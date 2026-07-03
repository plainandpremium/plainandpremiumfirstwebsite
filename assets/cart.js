(function () {
  var cartCountEl = document.querySelector('[data-cart-count]');
  var toast = document.getElementById('CartToast');
  var toastTimer;
  var cartUpdateInFlight = false;

  function showToast() {
    if (!toast) return;
    toast.hidden = false;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
      toast.hidden = true;
    }, 2200);
  }

  function updateCartCount(count) {
    if (!cartCountEl) return;
    var n = parseInt(count, 10) || 0;
    cartCountEl.textContent = n;
    cartCountEl.hidden = n === 0;
  }

  function refreshCartCount() {
    return fetch('/cart.js', { credentials: 'same-origin' })
      .then(function (res) {
        return res.json();
      })
      .then(function (cart) {
        updateCartCount(cart.item_count);
        return cart;
      })
      .catch(function () {});
  }

  function addToCart(variantId, quantity) {
    return fetch('/cart/add.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        items: [{ id: Number(variantId), quantity: quantity || 1 }],
      }),
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (data) {
          throw new Error(data.description || data.message || 'Could not add to cart');
        });
      }
      return res.json();
    });
  }

  function formatMoney(cents, currencyCode) {
    var amount = (parseInt(cents, 10) || 0) / 100;
    var code = currencyCode || 'INR';
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: code,
      }).format(amount);
    } catch (e) {
      return amount.toFixed(2);
    }
  }

  function setCartQtyDisabled(disabled) {
    document.querySelectorAll('.js-cart-qty, .js-cart-qty-btn').forEach(function (el) {
      el.disabled = disabled;
    });
  }

  function renderCartFromResponse(cart, changedKey) {
    if (!cart) return;
    updateCartCount(cart.item_count);

    var subtotalEl = document.querySelector('.cart-page__total strong');
    if (subtotalEl) {
      subtotalEl.textContent = formatMoney(cart.total_price, cart.currency);
    }

    var lineEl = document.querySelector('.js-cart-qty[data-line-key="' + changedKey + '"]');
    if (!lineEl) return;
    var cartLine = lineEl.closest('.cart-line');
    if (!cartLine) return;

    var changedItem = (cart.items || []).find(function (item) {
      return item.key === changedKey;
    });

    if (!changedItem || changedItem.quantity <= 0) {
      cartLine.remove();
      if (!cart.items || cart.items.length === 0) {
        window.location.reload();
      }
      return;
    }

    var qtyInput = cartLine.querySelector('.js-cart-qty');
    if (qtyInput) qtyInput.value = String(changedItem.quantity);

    var linePriceEl = cartLine.querySelector('.cart-line__price');
    if (linePriceEl) {
      linePriceEl.textContent = formatMoney(changedItem.final_line_price, cart.currency);
    }
  }

  document.querySelectorAll('.js-product-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('[type="submit"]');
      var variantInput = form.querySelector('[name="id"]');
      if (!variantInput || !submitBtn || submitBtn.disabled) return;

      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Adding…';

      addToCart(variantInput.value, 1)
        .then(function () {
          return refreshCartCount();
        })
        .then(function () {
          showToast();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        })
        .catch(function (err) {
          alert(err.message || 'Could not add to cart.');
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    });
  });

  document.querySelectorAll('.js-quick-add').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var variantId = btn.getAttribute('data-variant-id');
      if (!variantId || btn.disabled) return;

      var originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Adding…';

      addToCart(variantId, 1)
        .then(function () {
          return refreshCartCount();
        })
        .then(function () {
          showToast();
          btn.textContent = originalText;
          btn.disabled = false;
        })
        .catch(function (err) {
          alert(err.message || 'Could not add to cart.');
          btn.textContent = originalText;
          btn.disabled = false;
        });
    });
  });

  document.querySelectorAll('.js-cart-qty').forEach(function (input) {
    input.addEventListener('change', function () {
      if (cartUpdateInFlight) return;
      var key = input.getAttribute('data-line-key');
      var qty = parseInt(input.value, 10);
      if (isNaN(qty) || qty < 0) qty = 0;
      if (!key) return;
      cartUpdateInFlight = true;
      setCartQtyDisabled(true);

      fetch('/cart/change.js', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ id: key, quantity: qty }),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (cart) {
          renderCartFromResponse(cart, key);
          cartUpdateInFlight = false;
          setCartQtyDisabled(false);
        })
        .catch(function () {
          window.location.reload();
        });
    });
  });

  document.querySelectorAll('.js-cart-qty-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = btn.closest('.cart-line__qty-wrap');
      if (!wrap) return;
      var input = wrap.querySelector('.js-cart-qty');
      if (!input) return;

      var current = parseInt(input.value, 10);
      if (isNaN(current)) current = 0;
      var action = btn.getAttribute('data-qty-action');
      var next = action === 'decrease' ? Math.max(0, current - 1) : current + 1;

      input.value = String(next);
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  refreshCartCount();
})();
