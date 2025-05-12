/**
 * Script pentru funcționalitățile site-ului Biblioteca Virtuală
 * Funcționalități implementate:
 * 1. Sistem de autentificare utilizator
 * 2. Coș de cumpărături
 */

// Așteptăm ca tot documentul să se încarce înainte de a executa codul
document.addEventListener('DOMContentLoaded', function() {
  // Inițializăm funcționalitățile
  initLoginSystem();
  initShoppingCart();
});

/**
 * Funcționalitatea sistemului de autentificare
 */
function initLoginSystem() {
  const loginButton = document.getElementById('login-button');
  const loginModal = document.getElementById('login-modal');
  const closeLogin = document.getElementById('close-login');
  const tabs = document.querySelectorAll('.tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const togglePasswords = document.querySelectorAll('.toggle-password');

  let isLoggedIn = false;
  let currentUser = null;

  function openLoginModal() {
    loginModal.classList.remove('hidden');
  }

  function closeLoginModal() {
    loginModal.classList.add('hidden');
  }

  loginButton.addEventListener('click', () => {
    if (isLoggedIn) {
      showUserDropdown();
    } else {
      openLoginModal();
    }
  });

  closeLogin.addEventListener('click', closeLoginModal);

  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      closeLoginModal();
    }
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabId = tab.getAttribute('data-tab');
      tabPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === tabId + '-pane');
      });
    });
  });

  togglePasswords.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const passwordInput = toggle.previousElementSibling;
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      toggle.classList.toggle('fa-eye', !isPassword);
      toggle.classList.toggle('fa-eye-slash', isPassword);
    });
  });

  function handleLogin(email, password) {
    if (email && password) {
      const mockUser = { name: 'Utilizator Demo', email: email };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      isLoggedIn = true;
      currentUser = mockUser;
      updateUserInterface();
      closeLoginModal();
      return true;
    }
    return false;
  }

  function handleRegister(name, email, password, confirmPassword) {
    if (!name || !email || !password || password !== confirmPassword) {
      alert('Vă rugăm să completați toate câmpurile și să vă asigurați că parolele coincid.');
      return false;
    }

    const newUser = { name: name, email: email };
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    isLoggedIn = true;
    currentUser = newUser;
    updateUserInterface();
    closeLoginModal();
    return true;
  }

  function updateUserInterface() {
    if (isLoggedIn && currentUser) {
      loginButton.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
    } else {
      loginButton.innerHTML = '<i class="fas fa-user"></i> Contul meu';
    }
  }

  function showUserDropdown() {
    if (confirm('Doriți să vă deconectați?')) {
      localStorage.removeItem('currentUser');
      isLoggedIn = false;
      currentUser = null;
      updateUserInterface();
    }
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    handleLogin(email, password);
  });

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    handleRegister(name, email, password, confirmPassword);
  });

  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    isLoggedIn = true;
    updateUserInterface();
  }
}

/**
 * Funcționalitatea coșului de cumpărături
 */
function initShoppingCart() {
  const cartIcon = document.getElementById('cart-icon');
  const cartModal = document.getElementById('cart-modal');
  const closeCart = document.getElementById('close-cart');
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const cartEmpty = document.getElementById('cart-empty');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateCartUI() {
    cartCount.textContent = cart.length;
    cartItems.innerHTML = '';

    if (cart.length === 0) {
      cartEmpty.classList.remove('hidden');
      cartItemsContainer.classList.add('hidden');
    } else {
      cartEmpty.classList.add('hidden');
      cartItemsContainer.classList.remove('hidden');

      let total = 0;

      cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        const itemTotal = parseFloat(item.price) * item.quantity;
        total += itemTotal;

        li.innerHTML = `
          <div class="cart-item-info">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">${parseFloat(item.price).toFixed(2)} RON</div>
          </div>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn increase" data-index="${index}">+</button>
          </div>
          <div class="remove-item" data-index="${index}">×</div>
        `;
        cartItems.appendChild(li);
      });

      cartTotalPrice.textContent = total.toFixed(2) + ' RON';

      document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', () => {
          decreaseQuantity(parseInt(btn.getAttribute('data-index')));
        });
      });

      document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', () => {
          increaseQuantity(parseInt(btn.getAttribute('data-index')));
        });
      });

      document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
          removeItem(parseInt(btn.getAttribute('data-index')));
        });
      });
    }
  }

  function addToCart(title, price) {
    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ title: title, price: price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  }

  function increaseQuantity(index) {
    cart[index].quantity++;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  }

  function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      removeItem(index);
      return;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  }

  function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  }

  cartIcon.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
    updateCartUI();
  });

  closeCart.addEventListener('click', () => {
    cartModal.classList.add('hidden');
  });

  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      cartModal.classList.add('hidden');
    }
  });

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const title = button.getAttribute('data-title');
      const price = button.getAttribute('data-price');
      addToCart(title, price);

      const originalText = button.textContent;
      button.textContent = 'Adăugat!';
      button.classList.add('added');
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('added');
      }, 1500);
    });
  });

  updateCartUI();
}
/**
 * Funcționalitatea meniului circular "Contact" (apare la hover)
 */
function initContactMenu() {
    const contactButton = document.querySelector('.contact-button');
    const circularMenu = document.querySelector('.circular-menu');
    let isMouseOverButton = false;
    let isMouseOverMenu = false;
    let timeoutId;
    const delay = 200; // Timp de întârziere în milisecunde pentru a evita apariții/dispariții accidentale

    contactButton.addEventListener('mouseenter', () => {
        isMouseOverButton = true;
        clearTimeout(timeoutId);
        circularMenu.classList.add('active');
    });

    contactButton.addEventListener('mouseleave', () => {
        isMouseOverButton = false;
        timeoutId = setTimeout(() => {
            if (!isMouseOverMenu) {
                circularMenu.classList.remove('active');
            }
        }, delay);
    });

    circularMenu.addEventListener('mouseenter', () => {
        isMouseOverMenu = true;
        clearTimeout(timeoutId);
    });

    circularMenu.addEventListener('mouseleave', () => {
        isMouseOverMenu = false;
        timeoutId = setTimeout(() => {
            if (!isMouseOverButton) {
                circularMenu.classList.remove('active');
            }
        }, delay);
    });
}

// Inițializează funcționalitatea meniului circular
initContactMenu();