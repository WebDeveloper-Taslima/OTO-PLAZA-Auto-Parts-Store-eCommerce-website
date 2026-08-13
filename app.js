/**
 * OTO PLAZA - AUTO PARTS STORE & ACCESSORIES (ELEMENTOR PRO REDESIGN ENGINE)
 * Multi-template switcher, responsive viewport toggle, live vehicle fitment calculator,
 * mobile drawer navigation, shopping cart engine, flash sale countdown, search & toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {

  // Application Global State
  const AppState = {
    currentTemplate: 'home',
    viewportMode: 'desktop',
    selectedVehicle: {
      year: '2024',
      make: 'BMW',
      model: 'M3 Competition',
      engine: '3.0L Twin-Turbo S58'
    },
    cart: [
      {
        id: 'rim-19',
        name: 'Forged Performance Alloy Wheel Rim Set 19"',
        cat: 'WHEELS',
        price: 899.00,
        qty: 1,
        icon: 'fa-compact-disc'
      },
      {
        id: 'shock-coilovers',
        name: 'Coilover Adjustable Racing Suspension Kit',
        cat: 'SUSPENSION',
        price: 649.00,
        qty: 1,
        icon: 'fa-dharmachakra'
      }
    ]
  };

  // DOM Elements
  const viewportFrame = document.getElementById('viewportFrame');
  const templateButtons = document.querySelectorAll('.template-btn');
  const viewportButtons = document.querySelectorAll('.viewport-btn');
  const pageViews = document.querySelectorAll('.page-view');
  const navLinks = document.querySelectorAll('.nav-link');
  const toastContainer = document.getElementById('toastContainer');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNavBar = document.getElementById('mainNavBar');

  // ==========================================
  // 1. MOBILE HAMBURGER MENU DRAWER
  // ==========================================
  if (mobileMenuBtn && mainNavBar) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mainNavBar.classList.toggle('mobile-active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.className = mainNavBar.classList.contains('mobile-active') ? 'fas fa-xmark' : 'fas fa-bars';
      }
    });

    // Close menu drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNavBar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mainNavBar.classList.remove('mobile-active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }

  // ==========================================
  // 2. TEMPLATE SWITCHER ENGINE
  // ==========================================
  function switchTemplate(templateId) {
    AppState.currentTemplate = templateId;

    // Close mobile nav drawer if open
    if (mainNavBar) mainNavBar.classList.remove('mobile-active');
    if (mobileMenuBtn) {
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }

    // Update active control bar buttons
    templateButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.template === templateId);
    });

    // Update active main nav links
    navLinks.forEach(link => {
      if (link.dataset.targetTemplate) {
        link.classList.toggle('active-link', link.dataset.targetTemplate === templateId);
      }
    });

    // Toggle active page view
    pageViews.forEach(view => {
      const isTarget = view.id === `template-${templateId}`;
      view.classList.toggle('active-view', isTarget);
    });

    // If switching to Cart, render cart items table
    if (templateId === 'cart') {
      renderCartTable();
    }

    // Scroll smoothly to top of viewport
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Bind template buttons
  document.querySelectorAll('[data-target-template]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.dataset.targetTemplate;
      if (target) switchTemplate(target);
    });
  });

  templateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTemplate(btn.dataset.template);
    });
  });

  // ==========================================
  // 3. VIEWPORT TOGGLE (DESKTOP VS MOBILE)
  // ==========================================
  viewportButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      AppState.viewportMode = mode;

      viewportButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (mode === 'mobile') {
        viewportFrame.classList.add('mobile-mode');
        showToast('📱 Mobile Viewport Simulator Active (420px)', 'info');
      } else {
        viewportFrame.classList.remove('mobile-mode');
        showToast('💻 Desktop Viewport Active (100% Full Width)', 'info');
      }
    });
  });

  // ==========================================
  // 4. VEHICLE PARTS FINDER ENGINE
  // ==========================================
  const finderMakeSelect = document.getElementById('finderMakeSelect');
  const finderModelSelect = document.getElementById('finderModelSelect');
  const finderEngineSelect = document.getElementById('finderEngineSelect');
  const finderSubmitBtn = document.getElementById('finderSubmitBtn');
  const fitmentAlert = document.getElementById('fitmentAlert');
  const headerActiveVehicle = document.getElementById('headerActiveVehicle');

  // Vehicle data dictionary
  const vehicleData = {
    'BMW': {
      models: ['M3 Competition', 'M5 CS', '330i xDrive', 'X5 M'],
      engines: ['3.0L Twin-Turbo S58', '2.0L Turbo B48', '4.4L Twin-Turbo V8']
    },
    'Audi': {
      models: ['RS6 Avant', 'R8 V10 Performance', 'A4 Quattro', 'S5 Coupe'],
      engines: ['4.0L Twin-Turbo V8', '5.2L V10 FSI', '2.0L TFSI Turbo']
    },
    'Mercedes-Benz': {
      models: ['C63 S AMG', 'G63 AMG', 'E63 S', 'AMG GT R'],
      engines: ['4.0L Biturbo V8', '3.0L Turbo Inline-6']
    },
    'Toyota': {
      models: ['GR Supra', 'GR Yaris', 'Camry TRD', 'Tacoma TRD'],
      engines: ['3.0L Turbo B58', '1.6L Turbo 3-Cyl', '3.5L V6']
    },
    'Ford': {
      models: ['Mustang GT', 'Mustang Shelby GT500', 'F-150 Raptor'],
      engines: ['5.0L Coyote V8', '5.2L Supercharged V8', '3.5L EcoBoost V8']
    }
  };

  if (finderMakeSelect && finderModelSelect) {
    finderMakeSelect.addEventListener('change', () => {
      const make = finderMakeSelect.value;
      finderModelSelect.innerHTML = '<option value="">Select Model</option>';
      finderEngineSelect.innerHTML = '<option value="">Select Engine</option>';

      if (vehicleData[make]) {
        vehicleData[make].models.forEach(m => {
          finderModelSelect.innerHTML += `<option value="${m}">${m}</option>`;
        });
        vehicleData[make].engines.forEach(e => {
          finderEngineSelect.innerHTML += `<option value="${e}">${e}</option>`;
        });
      }
    });
  }

  if (finderSubmitBtn) {
    finderSubmitBtn.addEventListener('click', () => {
      const year = document.getElementById('finderYearSelect').value || '2024';
      const make = finderMakeSelect.value || 'BMW';
      const model = finderModelSelect.value || 'M3 Competition';
      const engine = finderEngineSelect.value || '3.0L Twin-Turbo S58';

      AppState.selectedVehicle = { year, make, model, engine };

      if (headerActiveVehicle) {
        headerActiveVehicle.innerText = `${year} ${make} ${model.split(' ')[0]}`;
      }

      if (fitmentAlert) {
        fitmentAlert.innerHTML = `<i class="fas fa-circle-check"></i> <span>Showing parts guaranteed to fit: <strong>${year} ${make} ${model} (${engine})</strong></span>`;
        fitmentAlert.classList.add('active');
      }

      showToast(`✅ Filtered Parts for ${year} ${make} ${model}!`, 'success');
    });
  }

  // ==========================================
  // 5. FLASH SALE COUNTDOWN TIMER
  // ==========================================
  const hoursBox = document.getElementById('hoursBox');
  const minsBox = document.getElementById('minsBox');
  const secsBox = document.getElementById('secsBox');

  let totalSeconds = (14 * 3600) + (38 * 60) + 42;

  setInterval(() => {
    if (totalSeconds <= 0) return;
    totalSeconds--;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (hoursBox) hoursBox.innerText = String(h).padStart(2, '0');
    if (minsBox) minsBox.innerText = String(m).padStart(2, '0');
    if (secsBox) secsBox.innerText = String(s).padStart(2, '0');
  }, 1000);

  // ==========================================
  // 6. SHOPPING CART SYSTEM
  // ==========================================
  function updateCartUI() {
    const totalQty = AppState.cart.reduce((sum, item) => sum + item.qty, 0);
    const totalCost = AppState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update counters
    document.querySelectorAll('.cart-count, .cart-btn-count').forEach(el => {
      el.innerText = totalQty;
    });

    const headerCartTotal = document.getElementById('headerCartTotal');
    if (headerCartTotal) {
      headerCartTotal.innerText = `$${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }

    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartGrandTotal = document.getElementById('cartGrandTotal');
    if (cartSubtotal) cartSubtotal.innerText = `$${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (cartGrandTotal) cartGrandTotal.innerText = `$${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  function addToCart(id, name, price, icon = 'fa-cogs', cat = 'AUTO PARTS') {
    const existing = AppState.cart.find(i => i.id === id);
    if (existing) {
      existing.qty++;
    } else {
      AppState.cart.push({
        id,
        name,
        price: parseFloat(price),
        qty: 1,
        icon,
        cat
      });
    }

    updateCartUI();
    showToast(`🛒 Added "${name}" to your cart!`, 'success');
  }

  // Bind Add to Cart Buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add-cart');
    if (btn) {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      addToCart(id, name, price);
    }
  });

  // Render Cart Table
  function renderCartTable() {
    const container = document.getElementById('cartItemsList');
    if (!container) return;

    if (AppState.cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem;">
          <i class="fas fa-shopping-bag" style="font-size: 3.5rem; color: #CBD5E1; margin-bottom: 1rem;"></i>
          <h3 style="font-size: 1.2rem;">Your shopping cart is currently empty.</h3>
          <p style="color: #64748B; margin-bottom: 1.5rem; font-size: 0.9rem;">Explore our catalog to add precision auto parts.</p>
          <button class="btn-primary" data-target-template="shop">Explore Parts Catalog</button>
        </div>
      `;
      return;
    }

    let html = `
      <h2 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 1.2rem; padding-bottom: 0.8rem; border-bottom: 1px solid #E2E8F0;">Cart Items (${AppState.cart.length})</h2>
      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
    `;

    AppState.cart.forEach((item, index) => {
      html += `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #F1F5F9; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="width: 50px; height: 50px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: var(--color-primary); font-size: 1.3rem;">
              <i class="fas ${item.icon || 'fa-compact-disc'}"></i>
            </div>
            <div>
              <h4 style="font-size: 0.9rem; font-weight: 700; color: #0F172A;">${item.name}</h4>
              <span style="font-size: 0.78rem; color: #64748B; font-weight: 600;">$${item.price.toFixed(2)} each</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="display: flex; align-items: center; border: 1px solid #CBD5E1; border-radius: var(--radius-sm); overflow: hidden;">
              <button class="cart-qty-btn" data-action="dec" data-index="${index}" style="padding: 3px 8px; background: #F1F5F9; font-weight: 700;">-</button>
              <span style="padding: 3px 10px; font-weight: 700; font-size: 0.85rem;">${item.qty}</span>
              <button class="cart-qty-btn" data-action="inc" data-index="${index}" style="padding: 3px 8px; background: #F1F5F9; font-weight: 700;">+</button>
            </div>
            <span style="font-weight: 800; font-size: 1rem; min-width: 80px; text-align: right;">$${(item.price * item.qty).toFixed(2)}</span>
            <button class="cart-remove-btn" data-index="${index}" style="color: #EF4444; font-size: 0.95rem; padding: 4px;"><i class="fas fa-trash-can"></i></button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Bind quantity & remove listeners
    container.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        const action = btn.dataset.action;
        if (action === 'inc') AppState.cart[index].qty++;
        if (action === 'dec' && AppState.cart[index].qty > 1) AppState.cart[index].qty--;
        updateCartUI();
        renderCartTable();
      });
    });

    container.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        const removed = AppState.cart.splice(index, 1);
        updateCartUI();
        renderCartTable();
        showToast(`Removed "${removed[0].name}" from cart`, 'info');
      });
    });
  }

  // ==========================================
  // 7. CHECKOUT PLACE ORDER TRIGGER
  // ==========================================
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      showToast('🎉 Order Successfully Placed! Thank you for choosing OTO PLAZA.', 'success');
      AppState.cart = [];
      updateCartUI();
      setTimeout(() => switchTemplate('home'), 1800);
    });
  }

  // Quick View triggers
  document.addEventListener('click', (e) => {
    const qv = e.target.closest('.quick-view-btn');
    if (qv) {
      switchTemplate('product');
      showToast('Viewing featured part specifications & fitment details', 'info');
    }
  });

  // Search input handler
  const searchTriggerBtn = document.getElementById('searchTriggerBtn');
  const searchInput = document.getElementById('searchInput');

  if (searchTriggerBtn && searchInput) {
    searchTriggerBtn.addEventListener('click', () => {
      const q = searchInput.value.trim();
      if (q) {
        switchTemplate('shop');
        showToast(`Filtered parts matching "${q}"`, 'info');
      } else {
        showToast('Please type a part name or OEM number to search.', 'warning');
      }
    });
  }

  // ==========================================
  // 8. TOAST NOTIFICATION UTILITY
  // ==========================================
  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fas ${iconClass}" style="color: var(--color-primary);"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Initial UI Sync
  updateCartUI();

});
