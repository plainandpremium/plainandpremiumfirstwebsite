(function () {
  var cartCountEl = document.querySelector('[data-cart-count]');
  var toast = document.getElementById('CartToast');
  var toastTimer;

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
      var key = input.getAttribute('data-line-key');
      var qty = parseInt(input.value, 10);
      if (!key) return;

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
        .then(function () {
          window.location.reload();
        })
        .catch(function () {
          window.location.reload();
        });
    });
  });

  refreshCartCount();
})();
