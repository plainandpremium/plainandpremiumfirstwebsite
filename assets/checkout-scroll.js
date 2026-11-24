(function () {
  // Razorpay resets window.scrollY on iPhone while opening its iframe. Keep the
  // storefront visually stationary, without changing the SDK or its handlers.
  if (!window.MutationObserver || !document.getElementById('magic-checkout-data-container')) return;

  var root = document.documentElement;
  var body = document.body;
  var pendingPosition = null;
  var lockedPosition = null;
  var savedStyles = null;
  var checkoutContainer = null;
  var ownedProperties = ['position', 'top', 'left', 'width'];
  var checkoutSelector = '.shopify-payment-button__button, #CartCheckoutForm [name="checkout"]';

  function rememberPosition(event) {
    if (lockedPosition || !window.matchMedia('(max-width: 767px)').matches) return;
    var target = event.type === 'submit' ? event.submitter : event.target;
    if (!target || !target.closest || !target.closest(checkoutSelector)) return;
    pendingPosition = {
      x: window.scrollX,
      y: window.scrollY,
      width: root.clientWidth,
      time: Date.now()
    };
  }

  function freezeStorefront() {
    if (lockedPosition || !pendingPosition || Date.now() - pendingPosition.time > 15000) return;
    // Do not take ownership of a page already fixed by another modal.
    if (window.getComputedStyle(body).position === 'fixed') return;
    lockedPosition = pendingPosition;
    pendingPosition = null;
    savedStyles = {};
    ownedProperties.forEach(function (property) {
      savedStyles[property] = {
        value: body.style.getPropertyValue(property),
        priority: body.style.getPropertyPriority(property)
      };
    });
    body.style.position = 'fixed';
    body.style.top = -lockedPosition.y + 'px';
    body.style.left = -lockedPosition.x + 'px';
    body.style.width = lockedPosition.width + 'px';
  }

  function restoreStorefront(restoreScroll) {
    if (!lockedPosition) return;
    var position = lockedPosition;
    ownedProperties.forEach(function (property) {
      var original = savedStyles[property];
      if (original.value) body.style.setProperty(property, original.value, original.priority);
      else body.style.removeProperty(property);
    });
    lockedPosition = null;
    pendingPosition = null;
    savedStyles = null;
    if (restoreScroll) window.scrollTo(position.x, position.y);
  }

  function syncCheckoutState() {
    var container = document.querySelector('.razorpay-container');
    if (container !== checkoutContainer) {
      containerObserver.disconnect();
      checkoutContainer = container;
      if (container) containerObserver.observe(container, { attributes: true, attributeFilter: ['style', 'class'] });
    }
    var isLoading = root.classList.contains('razorpay-magic-scroll');
    var isOpen = checkoutContainer && checkoutContainer.isConnected &&
      window.getComputedStyle(checkoutContainer).display !== 'none';
    // Watch the provider's state, not a timeout: a slow network must not unlock
    // the page mid-checkout. A failed load or dismissal removes these markers.
    if (isLoading || isOpen) freezeStorefront();
    else restoreStorefront(true);
  }

  var containerObserver = new MutationObserver(syncCheckoutState);
  var rootObserver = new MutationObserver(syncCheckoutState);
  var bodyObserver = new MutationObserver(syncCheckoutState);
  rootObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
  bodyObserver.observe(body, { childList: true });

  // Capture only the position. Locking starts only when Razorpay signals that
  // it is opening, so native Shopify fallback navigation remains untouched.
  document.addEventListener('click', rememberPosition, true);
  document.addEventListener('submit', rememberPosition, true);
  window.addEventListener('pagehide', function () { restoreStorefront(false); });
})();
