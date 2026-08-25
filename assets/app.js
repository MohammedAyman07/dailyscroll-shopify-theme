/* =============================================
   DAILYSCROLL3D — JavaScript
   Cursor, Navbar, Cart, Animations
   (3D Orb handled separately by orb3d.js)
   ============================================= */


// =============================================
// NAVBAR SCROLL EFFECT
// =============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// =============================================
// FLOATING ACCENT DOT — follows cursor loosely
// =============================================
const accentDot = document.getElementById('accentDot');
let dotX = 200, dotY = 120;
let dotTargetX = 200, dotTargetY = 120;

document.addEventListener('mousemove', (e) => {
  dotTargetX = e.clientX * 0.2 + 150;
  dotTargetY = e.clientY * 0.1 + 80;
});

function animateDot() {
  dotX += (dotTargetX - dotX) * 0.015;
  dotY += (dotTargetY - dotY) * 0.015;
  if (accentDot) {
    accentDot.style.left = dotX + 'px';
    accentDot.style.top = dotY + 'px';
  }
  requestAnimationFrame(animateDot);
}
animateDot();



// =============================================
// SCROLL REVEAL ANIMATIONS
// =============================================
function initReveal() {
  const els = document.querySelectorAll('.product-card, .manifesto-content, .newsletter-inner, .footer-col');
  els.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-2');
    if (i % 3 === 2) el.classList.add('reveal-delay-4');
  });
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
initReveal();

// =============================================
// CART SYSTEM
// =============================================
let cart = [];

function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  updateCart();
  showToast(`${name} added to bag`);
  
  // Animate cart count
  const cartCount = document.getElementById('cartCount');
  cartCount.style.transform = 'scale(1.5)';
  setTimeout(() => cartCount.style.transform = 'scale(1)', 300);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  document.getElementById('cartCount').textContent = totalItems;
  document.getElementById('cartTotal').textContent = `$${totalPrice.toLocaleString()}`;

  const cartItemsEl = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<div class="cart-empty">YOUR BAG IS EMPTY.</div>';
    cartFooter.style.display = 'none';
  } else {
    cartFooter.style.display = 'block';
    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price} × ${item.qty}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
      </div>
    `).join('');
  }
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartBtn').addEventListener('click', openCart);

// =============================================
// TOAST NOTIFICATION
// =============================================
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = '✓ ' + message.toUpperCase();
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// =============================================
// NEWSLETTER FORM
// =============================================
function handleNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('emailInput').value;
  showToast('Welcome to the drop list!');
  document.getElementById('emailInput').value = '';
}

// =============================================
// MARQUEE PAUSE ON HOVER
// =============================================
document.querySelectorAll('.marquee-inner, .marquee-inner-reverse').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.animationPlayState = 'paused';
  });
  el.addEventListener('mouseleave', () => {
    el.style.animationPlayState = 'running';
  });
});

// =============================================
// PARALLAX on HERO TEXT
// =============================================
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroText = document.querySelector('.hero-text');
  if (heroText && scrollY < window.innerHeight) {
    heroText.style.transform = `translateY(${scrollY * 0.25}px)`;
    heroText.style.opacity = 1 - scrollY / (window.innerHeight * 0.7);
  }
  const orbEl = document.querySelector('.orb-container');
  if (orbEl && scrollY < window.innerHeight) {
    orbEl.style.marginTop = `${scrollY * 0.15}px`;
  }
});

// =============================================
// PRODUCT CARD — 3D Tilt Effect
// =============================================
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(4px)`;
    card.style.transition = 'transform 0.05s ease, border-color 0.3s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease';
  });
});

// =============================================
// KEYBOARD ACCESSIBILITY
// =============================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCart();
});

console.log('%cDAILYSCROLL3D', 'font-size:32px; font-weight:900; color:#c8ff00; background:#000; padding:10px 20px;');
console.log('%cAll Objects Considered.', 'font-size:14px; color:#888;');
