  // ===== الإعدادات الثابتة ورسوم التوصيل =====
  const whatsappNumber = '971501554132';
  const deliveryFees = {
    'Abu Dhabi': 15,
    'Dubai': 20,
    'Sharjah': 20,
    'Ajman': 20,
    'Ras Al Khaimah': 25,
    'Fujairah': 25,
    'Um Al Quwain': 25
  };

  const OWNER = 'hassansyrn-cmyk';
  const REPO = 'albostan-store';
  const BRANCH = 'main';
  const PRODUCTS_PATH = 'products.json';
  const COUPONS_PATH = 'coupons.json';

  // ===== اللغة والترجمة =====
  let currentLang = 'ar';
  const T = {
    ar: {
      emptyCart: 'السلة فارغة، أضف منتجات أولًا',
      currency: 'د.إ',
      added: 'تمت الإضافة للسلة',
      removed: 'تم حذف المنتج من السلة',
      emptyCartCheckout: 'السلة فارغة، أضف منتجات أولًا',
      noResults: 'لا توجد منتجات مطابقة',
      waInquiry: 'مرحبًا، أريد الاستفسار عن متجر البستان',
      outOfStock: 'غير متوفر',
      directWaMsg: 'مرحبًا متجر البستان، أريد طلب هذا المنتج بشكل مباشر:\n',
      wishlistEmpty: 'المفضلة فارغة حاليًا',
      wishlistAdded: 'تمت الإضافة للمفضلة',
      wishlistRemoved: 'تمت الإزالة من المفضلة',
      couponInvalid: 'الكوبون المدخل غير صحيح',
      couponSuccess: 'تم تطبيق الكوبون بنجاح',
      minOrderToast: 'الحد الأدنى للطلب هو 30 د.إ',
      copied: 'تم نسخ الرابط ومعلومات المنتج بنجاح!',
      trackMsg: 'مرحبًا، أريد تتبع طلبي. رقم الهاتف/الطلب: '
    },
    en: {
      emptyCart: 'Your cart is empty, please add products first',
      currency: 'AED',
      added: 'Added to cart',
      removed: 'Item removed from cart',
      emptyCartCheckout: 'Your cart is empty, please add products first',
      noResults: 'No matching products found',
      waInquiry: 'Hello, I would like to ask about AlBostan Store',
      outOfStock: 'Out of Stock',
      directWaMsg: 'Hello AlBostan Store, I would like to order this item directly:\n',
      wishlistEmpty: 'Your wishlist is empty',
      wishlistAdded: 'Added to wishlist',
      wishlistRemoved: 'Removed from wishlist',
      couponInvalid: 'The entered coupon is invalid',
      couponSuccess: 'Coupon applied successfully',
      minOrderToast: 'Minimum order amount is 30 AED',
      copied: 'Product link and info copied successfully!',
      trackMsg: 'Hello, I would like to track my order. Phone/Order number: '
    }
  };

  // مصفوفة المنتجات العالمية
  let globalProductsList = [];

  // ===== مفاتيح localStorage =====
  const CUSTOMER_STORAGE_KEY = 'albostan_customer_details';
  const LAST_ORDER_DETAILS_KEY = 'albostan_last_order_details';

  // ===== دوال مساعدة =====
  function svgIcon(name){
    const icons = {
      bag:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8V6a5 5 0 0 1 10 0v2"></path><path d="M5 8h14l-1 13H6L5 8z"></path></svg>',
      cart:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l2.2 10.2a2 2 0 0 0 2 1.6h6.9a2 2 0 0 0 1.9-1.4L21 8H7"></path><circle cx="10" cy="20" r="1.4"></circle><circle cx="18" cy="20" r="1.4"></circle></svg>',
      heart:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 5.6c-1.7-1.9-4.6-2-6.4-.2L12 7.8 9.6 5.4c-1.8-1.8-4.7-1.7-6.4.2-1.7 1.9-1.6 4.8.2 6.6L12 21l8.6-8.8c1.8-1.8 1.9-4.7.2-6.6z"></path></svg>',
      user:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.8-4 5-6 8-6s6.2 2 8 6"></path></svg>',
      download:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11"></path><path d="M8 10l4 4 4-4"></path><path d="M5 19h14"></path></svg>',
      pin:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12z"></path><circle cx="12" cy="9" r="2.3"></circle></svg>',
      chat:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18l-2 4 4-2a9 9 0 1 0-2-2z"></path><path d="M8 11h.01M12 11h.01M16 11h.01"></path></svg>',
      cash:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"></rect><circle cx="12" cy="12" r="3"></circle><path d="M6 9v.01M18 15v.01"></path></svg>',
      phone:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"></path></svg>',
      mail:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
      clock:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>',
      truck:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v10H3z"></path><path d="M14 11h4l3 3v3h-7z"></path><circle cx="7" cy="19" r="2"></circle><circle cx="18" cy="19" r="2"></circle></svg>',
      check:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"></path></svg>',
      coin:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M12 7v10M9 10c0-1.2 1.2-2 3-2s3 .8 3 2-1.2 2-3 2-3 .8-3 2 1.2 2 3 2 3-.8 3-2"></path></svg>',
      link:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"></path><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1"></path></svg>',
      search:'<svg class="svg-inline" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>'
    };
    return icons[name] || icons.bag;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
  }

  function pad(num){ return String(num).padStart(2, '0'); }

  function formatMoney(value){
    const n = Number(value || 0);
    return n % 1 === 0 ? String(n) : n.toFixed(2);
  }
  function normalizeCategoryEn(cat){ return cat === 'Grocery' ? 'Selected Products' : (cat || ''); }
  function normalizeCategoryAr(cat){ return cat === 'بقالة' ? 'منتجات مختارة' : (cat || ''); }
  function normalizeProductImages(productData){
    let images = [];
    if(!productData) return images;
    if(Array.isArray(productData.images)) images = productData.images;
    else if(productData.images){ try{ images = JSON.parse(productData.images); }catch(e){ images = []; } }
    if((!images || images.length === 0) && productData.img) images = [productData.img];
    return (images || []).filter(Boolean);
  }
  function getProductPrimaryImage(productData){ const images = normalizeProductImages(productData); return images.length ? images[0] : ''; }

  // ===== نظام تاريخ نهاية التخفيض =====
  function parseDiscountEndDate(value){
    if(!value) return null;
    const raw = String(value).trim();
    if(!raw) return null;
    const parts = raw.split('-');
    if(parts.length === 3){
      const y = Number(parts[0]);
      const m = Number(parts[1]);
      const d = Number(parts[2]);
      if(y && m && d){
        return new Date(y, m - 1, d, 23, 59, 59, 999);
      }
    }
    const parsed = new Date(raw);
    if(isNaN(parsed.getTime())) return null;
    parsed.setHours(23, 59, 59, 999);
    return parsed;
  }

  function isDiscountStillActive(discountEndDate){
    if(!discountEndDate) return true;
    const end = parseDiscountEndDate(discountEndDate);
    if(!end) return true;
    return new Date().getTime() <= end.getTime();
  }

  function getEffectiveProductPricing(product){
    const p = product || {};
    const currentPrice = Number(p.price || 0);
    const oldPrice = Number(p.oldPrice || 0);
    const originalBeforeDiscount = Number(p.originalPriceBeforeDiscount || 0);
    const candidateOriginal = oldPrice > currentPrice ? oldPrice : (originalBeforeDiscount > currentPrice ? originalBeforeDiscount : 0);
    const active = candidateOriginal > currentPrice && isDiscountStillActive(p.discountEndDate);
    const effectivePrice = active ? currentPrice : (candidateOriginal > currentPrice ? candidateOriginal : currentPrice);
    return {
      price: effectivePrice,
      priceText: formatMoney(effectivePrice),
      oldPrice: active ? candidateOriginal : 0,
      oldPriceText: active && candidateOriginal ? formatMoney(candidateOriginal) : '',
      discount: active ? (p.discount || '') : '',
      discountEndDate: p.discountEndDate || '',
      isActiveDiscount: active
    };
  }

  function formatDiscountEndLabel(discountEndDate){
    if(!discountEndDate) return '';
    return currentLang === 'ar' ? 'ينتهي في ' + discountEndDate : 'Ends on ' + discountEndDate;
  }

  // ===== رقم الطلب والتاريخ =====
  function createOrderDate(){
    const d = new Date();
    return {
      iso: d.toISOString(),
      year: d.getFullYear(),
      month: pad(d.getMonth() + 1),
      day: pad(d.getDate()),
      hour: pad(d.getHours()),
      minute: pad(d.getMinutes())
    };
  }

  function generateOrderId(dateObj){
    const d = dateObj || createOrderDate();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ABS-${d.year}${d.month}${d.day}-${d.hour}${d.minute}-${random}`;
  }

  function formatOrderDateDisplay(dateObj){
    if(!dateObj) return '';
    if(typeof dateObj === 'string'){
      try{
        const d = new Date(dateObj);
        if(!isNaN(d.getTime())){
          return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} - ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        }
      }catch(e){}
      return dateObj;
    }
    if(dateObj.day && dateObj.month && dateObj.year){
      return `${dateObj.day}/${dateObj.month}/${dateObj.year} - ${dateObj.hour||'00'}:${dateObj.minute||'00'}`;
    }
    return '';
  }

  let pendingOrderMeta = null;

  function createPendingOrderMeta(){
    const orderDate = createOrderDate();
    return { orderId: generateOrderId(orderDate), orderDate };
  }

  function resetPendingOrderMeta(){ pendingOrderMeta = null; }

  function getPendingOrderMeta(){
    if(!pendingOrderMeta) pendingOrderMeta = createPendingOrderMeta();
    return pendingOrderMeta;
  }

  function updateCheckoutOrderMetaBox(){
    const box = document.getElementById('checkoutOrderMetaBox');
    if(!box) return;
    const meta = getPendingOrderMeta();
    const formattedDate = formatOrderDateDisplay(meta.orderDate);
    if(currentLang === 'ar'){
      box.innerHTML = `<div>رقم الطلب: ${meta.orderId}</div><div>تاريخ الطلب: ${formattedDate}</div>`;
    } else {
      box.innerHTML = `<div>Order ID: ${meta.orderId}</div><div>Order Date: ${formattedDate}</div>`;
    }
  }

  // ===== حفظ بيانات العميل =====
  function safeParseCustomerDetails(){
    try{
      const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if(!raw) return null;
      const data = JSON.parse(raw);
      if(!data || typeof data !== 'object') return null;
      return {
        name: typeof data.name === 'string' ? data.name : '',
        phone: typeof data.phone === 'string' ? data.phone : '',
        emirate: typeof data.emirate === 'string' ? data.emirate : '',
        address: typeof data.address === 'string' ? data.address : ''
      };
    }catch(e){
      try{ localStorage.removeItem(CUSTOMER_STORAGE_KEY); }catch(err){}
      return null;
    }
  }

  function saveCustomerDetails(){
    const saveCheck = document.getElementById('saveCustomerDetailsCheck');
    if(!saveCheck || !saveCheck.checked) return;
    const nameEl = document.getElementById('custName');
    const phoneEl = document.getElementById('custPhone');
    const emirateEl = document.getElementById('custEmirate');
    const addressEl = document.getElementById('custAddress');
    if(!nameEl || !phoneEl || !emirateEl || !addressEl) return;
    try{
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify({
        name: nameEl.value.trim(),
        phone: phoneEl.value.trim(),
        emirate: emirateEl.value,
        address: addressEl.value.trim()
      }));
    }catch(e){}
  }

  function loadSavedCustomerDetails(){
    const data = safeParseCustomerDetails();
    if(!data) return;
    const nameEl = document.getElementById('custName');
    const phoneEl = document.getElementById('custPhone');
    const emirateEl = document.getElementById('custEmirate');
    const addressEl = document.getElementById('custAddress');
    const saveCheck = document.getElementById('saveCustomerDetailsCheck');
    if(nameEl && data.name) nameEl.value = data.name;
    if(phoneEl && data.phone) phoneEl.value = data.phone;
    if(emirateEl && data.emirate) emirateEl.value = data.emirate;
    if(addressEl && data.address) addressEl.value = data.address;
    if(saveCheck) saveCheck.checked = true;
    updateCheckoutSummary();
  }

  function clearSavedCustomerDetails(){
    try{ localStorage.removeItem(CUSTOMER_STORAGE_KEY); }catch(e){}
    const saveCheck = document.getElementById('saveCustomerDetailsCheck');
    if(saveCheck) saveCheck.checked = false;
    showToast(currentLang === 'ar' ? 'تم حذف بياناتك المحفوظة' : 'Your saved details have been cleared');
  }

  // ===== آخر طلب =====
  function saveLastOrderDetails(meta, values, items){
    try{
      if(!items || !items.length) return;
      const order = {
        orderId: meta.orderId,
        orderDate: meta.orderDate,
        customer: { name: values.name, phone: values.phone, emirate: values.emirate, address: values.address },
        items,
        coupon: values.discount > 0 ? values.coupon : '',
        subtotal: values.subtotal,
        discount: values.discount,
        deliveryFee: values.deliveryFee,
        grandTotal: values.grandTotal,
        paymentMethodAr: 'نقدًا عند الاستلام فقط (COD)',
        paymentMethodEn: 'Cash on Delivery only (COD)',
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(LAST_ORDER_DETAILS_KEY, JSON.stringify(order));
      renderLastOrderBox();
    }catch(e){ console.warn('Saving last order skipped safely', e); }
  }

  function loadLastOrderDetails(){
    try{
      const raw = localStorage.getItem(LAST_ORDER_DETAILS_KEY);
      if(!raw) return null;
      const order = JSON.parse(raw);
      if(!order || typeof order !== 'object') return null;
      if(!order.orderId || !Array.isArray(order.items)) return null;
      return order;
    }catch(e){
      try{ localStorage.removeItem(LAST_ORDER_DETAILS_KEY); }catch(err){}
      return null;
    }
  }

  function renderLastOrderBox(){
    const box = document.getElementById('albostanLastOrderBox');
    if(!box) return;
    const order = loadLastOrderDetails();
    const cur = currentLang === 'ar' ? 'د.إ' : 'AED';

    if(!order){
      box.innerHTML = `
        <h4 data-ar="آخر طلب من هذا الجهاز" data-en="Last order from this device">${currentLang === 'ar' ? 'آخر طلب من هذا الجهاز' : 'Last order from this device'}</h4>
        <p>${currentLang === 'ar'
          ? 'لا يوجد طلب محفوظ حتى الآن. بعد إرسال أول طلب عبر واتساب سيظهر هنا رقم الطلب لتتبعه بسهولة.'
          : 'No saved order yet. After sending your first order via WhatsApp, the order number will appear here for easy tracking.'}</p>`;
      return;
    }

    const dateText = formatOrderDateDisplay(order.orderDate);
    const itemCount = order.items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

    if(currentLang === 'ar'){
      box.innerHTML = `
        <h4>آخر طلب من هذا الجهاز</h4>
        <p><strong>رقم الطلب:</strong> ${order.orderId}</p>
        <p><strong>تاريخ الطلب:</strong> ${dateText}</p>
        <p><strong>عدد المنتجات:</strong> ${itemCount}</p>
        <p><strong>الإجمالي:</strong> ${formatMoney(order.grandTotal)} ${cur}</p>
        <p><strong>طريقة الدفع:</strong> نقدًا عند الاستلام فقط</p>
        <div class="last-order-actions">
          <button type="button" class="last-order-track-btn" id="trackLastOrderBtn">تتبع آخر طلب عبر واتساب</button>
          <button type="button" class="last-order-repeat-btn" id="repeatLastOrderBtn">إعادة طلب آخر طلب</button>
        </div>`;
    } else {
      box.innerHTML = `
        <h4>Last order from this device</h4>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Order Date:</strong> ${dateText}</p>
        <p><strong>Items count:</strong> ${itemCount}</p>
        <p><strong>Total:</strong> ${formatMoney(order.grandTotal)} ${cur}</p>
        <p><strong>Payment:</strong> Cash on Delivery only</p>
        <div class="last-order-actions">
          <button type="button" class="last-order-track-btn" id="trackLastOrderBtn">Track last order via WhatsApp</button>
          <button type="button" class="last-order-repeat-btn" id="repeatLastOrderBtn">Repeat last order</button>
        </div>`;
    }

    const trackBtn = document.getElementById('trackLastOrderBtn');
    const repeatBtn = document.getElementById('repeatLastOrderBtn');

    if(trackBtn){
      trackBtn.addEventListener('click', function(){
        const dateText2 = formatOrderDateDisplay(order.orderDate);
        let msg = currentLang === 'ar'
          ? `مرحبًا متجر البستان، أريد تتبع آخر طلب.\nرقم الطلب: ${order.orderId}\nتاريخ الطلب: ${dateText2}\n`
          : `Hello AlBostan Store, I would like to track my last order.\nOrder ID: ${order.orderId}\nOrder Date: ${dateText2}\n`;
        if(order.customer && order.customer.phone){
          msg += currentLang === 'ar' ? `رقم الهاتف: ${order.customer.phone}` : `Phone: ${order.customer.phone}`;
        }
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      });
    }

    if(repeatBtn){
      repeatBtn.addEventListener('click', function(){
        if(!order.items || !order.items.length){ showToast(currentLang === 'ar' ? 'تعذر إعادة الطلب حاليًا' : 'Could not repeat the order now'); return; }
        order.items.forEach(savedItem => {
          const existing = cart.find(item => item.nameAr === savedItem.nameAr);
          if(existing){ existing.quantity += Number(savedItem.quantity || 1); }
          else { cart.push({ nameAr: savedItem.nameAr, nameEn: savedItem.nameEn || savedItem.nameAr, price: Number(savedItem.price || 0), emoji: '', quantity: Number(savedItem.quantity || 1) }); }
        });
        renderCart();
        openCart();
        showToast(currentLang === 'ar' ? 'تمت إضافة آخر طلب إلى السلة' : 'Last order has been added to the cart');
      });
    }
  }

  // ===== Toast =====
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message){
    if(!toast) return;
    toast.textContent = message || T[currentLang].added;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1500);
  }

  // ===== السلة =====
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('albostan_cart')) || []; } catch(e) { cart = []; }
  cart = cart.map(item => { if(item.quantity === undefined) item.quantity = 1; return item; });

  const cartCountEl = document.getElementById('cartCount');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');

  function saveCart(){
    try { localStorage.setItem('albostan_cart', JSON.stringify(cart)); } catch(e) {}
    window.onbeforeunload = cart.length > 0 ? function(){ return true; } : null;
  }

  function getCartSubtotal(){ return cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0); }

  function renderCart(){
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalQty;
    const cur = T[currentLang].currency;
    if(cart.length === 0){
      cartItemsList.innerHTML = `<p class="cart-empty">${T[currentLang].emptyCart}</p>`;
      cartTotalEl.textContent = `0 ${cur}`;
      saveCart();
      syncProductQtyControls();
      return;
    }
    let total = getCartSubtotal();
    cartItemsList.innerHTML = cart.map((item, index) => {
      const itemTotal = Number(item.price) * item.quantity;
      const name = currentLang === 'ar' ? item.nameAr : item.nameEn;
      const img = getProductPrimaryImage(item);
      const thumbHtml = img ? `<div class="ci-thumb"><img src="${escapeHTML(img)}" alt="" onerror="this.parentElement.innerHTML=svgIcon('bag')"></div>` : `<div class="ci-thumb">${svgIcon('bag')}</div>`;
      return `<div class="cart-line">
        ${thumbHtml}
        <div class="ci-info"><h5>${escapeHTML(name)}</h5><span>${itemTotal} ${cur}</span></div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn-minus" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn-plus" data-index="${index}">+</button>
        </div>
        <button class="ci-remove" data-index="${index}" aria-label="حذف المنتج">×</button>
      </div>`;
    }).join('');
    cartTotalEl.textContent = `${total} ${cur}`;
    saveCart();

    cartItemsList.querySelectorAll('.qty-btn-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.index);
        const item = cart[idx];
        if(!item) return;
        const stockLimit = getProductStockLimit(item);
        if(stockLimit !== Infinity && (parseInt(item.quantity) || 0) >= stockLimit){
          showToast(getLimitToastMessage(stockLimit));
          syncProductQtyControls();
          return;
        }
        item.quantity++;
        renderCart();
        trackGAEvent('add_to_cart', { item_name: item.nameEn, value: item.price });
      });
    });
    cartItemsList.querySelectorAll('.qty-btn-minus').forEach(btn => {
      btn.addEventListener('click', () => { const idx = Number(btn.dataset.index); trackGAEvent('remove_from_cart', { item_name: cart[idx].nameEn, value: cart[idx].price }); cart[idx].quantity--; if(cart[idx].quantity <= 0){ cart.splice(idx, 1); showToast(T[currentLang].removed); } renderCart(); });
    });
    cartItemsList.querySelectorAll('.ci-remove').forEach(btn => {
      btn.addEventListener('click', () => { const idx = Number(btn.dataset.index); trackGAEvent('remove_from_cart', { item_name: cart[idx].nameEn, value: cart[idx].price }); cart.splice(idx, 1); renderCart(); showToast(T[currentLang].removed); });
    });
    syncProductQtyControls();
  }

  function getProductStockLimit(productData){
    if(!productData) return Infinity;
    const rawQty = productData.quantity;
    if(rawQty === undefined || rawQty === null || String(rawQty).trim() === '') return Infinity;
    const qty = parseInt(rawQty);
    return Number.isFinite(qty) ? Math.max(0, qty) : Infinity;
  }

  function getLimitToastMessage(limit){
    if(limit === 0){
      return currentLang === 'ar' ? 'هذا المنتج غير متوفر حالياً' : 'This product is currently out of stock';
    }
    return currentLang === 'ar'
      ? 'لقد وصلت إلى الحد الأقصى المتوفر من هذا المنتج: ' + limit
      : 'Maximum limit reached for this product: ' + limit;
  }

  function addToCart(productData, customQty = 1){
    const stockLimit = getProductStockLimit(productData);
    if(productData.available === 'no' || stockLimit === 0){ showToast(getLimitToastMessage(stockLimit)); return false; }
    const pricing = getEffectiveProductPricing(productData);
    const effectivePrice = Number(pricing.price || productData.price || 0);
    const existing = cart.find(item => item.nameAr === productData.nameAr);
    const currentQty = existing ? (parseInt(existing.quantity) || 0) : 0;
    const requestedQty = Math.max(1, parseInt(customQty) || 1);
    if(stockLimit !== Infinity && currentQty + requestedQty > stockLimit){
      showToast(getLimitToastMessage(stockLimit));
      syncProductQtyControls();
      return false;
    }
    if(existing){
      existing.quantity += requestedQty;
      existing.price = effectivePrice;
      existing.stockLimit = stockLimit === Infinity ? '' : stockLimit;
      existing.img = getProductPrimaryImage(productData) || existing.img || '';
      existing.images = normalizeProductImages(productData).length ? normalizeProductImages(productData) : (existing.images || []);
    } else {
      cart.push({
        nameAr: productData.nameAr,
        nameEn: productData.nameEn,
        price: effectivePrice,
        emoji: '',
        img: getProductPrimaryImage(productData),
        images: normalizeProductImages(productData),
        quantity: requestedQty,
        stockLimit: stockLimit === Infinity ? '' : stockLimit,
        discountEndDate: productData.discountEndDate || '',
        originalPriceBeforeDiscount: productData.originalPriceBeforeDiscount || productData.oldPrice || ''
      });
    }
    renderCart();
    showToast(T[currentLang].added);
    trackGAEvent('add_to_cart', { item_name: productData.nameEn, value: effectivePrice });
    return true;
  }

  function openCart(){ cartDrawer.classList.add('open'); cartOverlay.classList.add('open'); closeWishlist(); }
  function closeCart(){ cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); }

  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // ===== المفضلة =====
  let wishlist = [];
  try { wishlist = JSON.parse(localStorage.getItem('albostan_wishlist')) || []; } catch(e) { wishlist = []; }

  const wishlistBtn = document.getElementById('wishlistBtn');
  const wishlistCountEl = document.getElementById('wishlistCount');
  const wishlistOverlay = document.getElementById('wishlistOverlay');
  const wishlistDrawer = document.getElementById('wishlistDrawer');
  const wishlistClose = document.getElementById('wishlistClose');
  const wishlistItemsList = document.getElementById('wishlistItemsList');

  function saveWishlist(){
    try { localStorage.setItem('albostan_wishlist', JSON.stringify(wishlist)); } catch(e) {}
    wishlistCountEl.textContent = wishlist.length;
  }

  function toggleWishlist(productData){
    const index = wishlist.findIndex(item => item.nameAr === productData.nameAr);
    if(index > -1){ wishlist.splice(index, 1); showToast(T[currentLang].wishlistRemoved); }
    else { const pricing = getEffectiveProductPricing(productData); wishlist.push({ nameAr: productData.nameAr, nameEn: productData.nameEn, price: pricing.priceText, oldPrice: pricing.oldPriceText, discount: pricing.discount, discountEndDate: productData.discountEndDate || '', originalPriceBeforeDiscount: productData.originalPriceBeforeDiscount || productData.oldPrice || '', emoji: '', img: productData.img || '', categoryAr: productData.categoryAr || '', categoryEn: productData.categoryEn || '', descAr: productData.descAr || '', descEn: productData.descEn || '', available: productData.available || 'yes' }); showToast(T[currentLang].wishlistAdded); }
    saveWishlist();
    renderWishlist();
    syncWishlistHearts();
  }

  function syncWishlistHearts(){
    document.querySelectorAll('.prod-card').forEach(card => {
      const nameAr = card.dataset.nameAr;
      const isFav = wishlist.some(item => item.nameAr === nameAr);
      const heartBtn = card.querySelector('.prod-wishlist-btn');
      if(heartBtn){ heartBtn.innerHTML = svgIcon('heart'); isFav ? heartBtn.classList.add('active') : heartBtn.classList.remove('active'); }
    });
  }

  function renderWishlist(){
    wishlistCountEl.textContent = wishlist.length;
    const cur = T[currentLang].currency;
    if(wishlist.length === 0){ wishlistItemsList.innerHTML = `<p class="wishlist-empty">${T[currentLang].wishlistEmpty}</p>`; return; }
    wishlistItemsList.innerHTML = wishlist.map((item, index) => {
      const name = currentLang === 'ar' ? item.nameAr : item.nameEn;
      const btnAddCartText = currentLang === 'ar' ? 'السلة' : '+ Cart';
      const btnOrderText = currentLang === 'ar' ? 'طلب' : 'Order';
      return `<div class="wishlist-line" style="flex-direction:column; align-items:stretch;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="ci-emoji">${escapeHTML(item.emoji)}</span>
          <div class="ci-info"><h5>${escapeHTML(name)}</h5><span>${item.price} ${cur}</span></div>
          <button class="ci-remove wl-remove-btn" data-index="${index}">×</button>
        </div>
        <div class="wishlist-actions">
          <button class="wl-add-cart" data-index="${index}">${svgIcon('cart')} ${btnAddCartText}</button>
          <button class="wl-wa-order" data-index="${index}">${svgIcon('chat')} ${btnOrderText}</button>
        </div>
      </div>`;
    }).join('');

    wishlistItemsList.querySelectorAll('.wl-remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); const idx = Number(btn.dataset.index); wishlist.splice(idx, 1); saveWishlist(); renderWishlist(); syncWishlistHearts(); showToast(T[currentLang].wishlistRemoved); });
    });
    wishlistItemsList.querySelectorAll('.wl-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); addToCart(wishlist[Number(btn.dataset.index)], 1); });
    });
    wishlistItemsList.querySelectorAll('.wl-wa-order').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); const item = wishlist[Number(btn.dataset.index)]; const name = currentLang === 'ar' ? item.nameAr : item.nameEn; let text = `${T[currentLang].directWaMsg}- ${name} [1]\n- السعر: ${item.price} ${T[currentLang].currency}`; window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank'); });
    });
  }

  function openWishlist(){ wishlistDrawer.classList.add('open'); wishlistOverlay.classList.add('open'); closeCart(); }
  function closeWishlist(){ wishlistDrawer.classList.remove('open'); wishlistOverlay.classList.remove('open'); }

  wishlistBtn.addEventListener('click', openWishlist);
  wishlistClose.addEventListener('click', closeWishlist);
  wishlistOverlay.addEventListener('click', closeWishlist);

  // ===== Checkout =====
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutClose = document.getElementById('checkoutClose');
  const custEmirateSelect = document.getElementById('custEmirate');
  const couponCodeInput = document.getElementById('couponCode');
  const minOrderAlert = document.getElementById('minOrderAlert');

  document.getElementById('checkoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if(cart.length === 0){ showToast(T[currentLang].emptyCartCheckout); return; }
    closeCart();
    pendingOrderMeta = createPendingOrderMeta();
    checkoutModal.classList.add('open');
    updateCheckoutSummary();
    updateCheckoutOrderMetaBox();
    loadSavedCustomerDetails();
    trackGAEvent('begin_checkout', { value: getCartSubtotal() });
  });

  checkoutClose.addEventListener('click', () => { checkoutModal.classList.remove('open'); resetPendingOrderMeta(); });
  checkoutModal.addEventListener('click', (e) => { if(e.target === checkoutModal){ checkoutModal.classList.remove('open'); resetPendingOrderMeta(); } });

  custEmirateSelect.addEventListener('change', updateCheckoutSummary);
  couponCodeInput.addEventListener('input', updateCheckoutSummary);

  document.getElementById('clearSavedDetailsBtn').addEventListener('click', clearSavedCustomerDetails);

  function updateCheckoutSummary(){
    const subtotal = getCartSubtotal();
    const emirate = custEmirateSelect.value;
    const fee = deliveryFees[emirate] || 0;
    const couponEntered = couponCodeInput.value.trim().toUpperCase();
    let discount = 0;
    const discountRow = document.getElementById('summaryDiscountRow');
    
    const coupons = JSON.parse(localStorage.getItem('albostan_coupons') || '[]');
    const coupon = coupons.find(c => c.code === couponEntered && c.active);
    
    if (coupon) {
      if (coupon.minOrder && subtotal < coupon.minOrder) {
        showToast(currentLang === "ar" ? "الحد الأدنى للكوبون " + coupon.minOrder : "Min order for coupon " + coupon.minOrder);
        return;
      }
      if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
        discountRow.style.display = 'none';
      } else if (coupon.type === 'percentage') {
        discount = subtotal * (coupon.value / 100);
        if(coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
        discountRow.style.display = 'flex';
        document.getElementById('summaryDiscountValue').textContent = `${discount.toFixed(2)} AED`;
      } else if (coupon.type === 'fixed') {
        discount = coupon.value;
        discountRow.style.display = 'flex';
        document.getElementById('summaryDiscountValue').textContent = `${discount.toFixed(2)} AED`;
      }
    } else if(couponEntered === 'BOSTAN10'){
      discount = subtotal * 0.10;
      if(discount > 10) discount = 10;
      discountRow.style.display = 'flex';
      document.getElementById('summaryDiscountValue').textContent = `${discount.toFixed(2)} AED`;
    } else {
      discountRow.style.display = 'none';
    }
    const grandTotal = subtotal - discount + fee;
    const cur = T[currentLang].currency;
    document.getElementById('summarySubtotal').textContent = `${subtotal} ${cur}`;
    document.getElementById('summaryDelivery').textContent = emirate ? `${fee} ${cur}` : `0 ${cur}`;
    document.getElementById('summaryGrandTotal').textContent = `${grandTotal.toFixed(2)} ${cur}`;
    minOrderAlert.style.display = subtotal < 30 ? 'block' : 'none';
  }

  const CREATE_ORDER_API_PATH = '/api/create-order';

  async function createPendingWebsiteOrder(orderPayload){
    const response = await fetch(CREATE_ORDER_API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    let data = null;
    try{ data = await response.json(); }catch(error){ data = null; }
    if(!response.ok || !data || data.ok !== true){
      const apiMessage = data && data.message ? data.message : '';
      throw new Error(apiMessage || 'Order registration failed');
    }
    return data;
  }

  function buildOrderPayloadForApi(meta, values, items){
    return {
      id: meta.orderId,
      customer: { name: values.name, phone: values.phone, emirate: values.emirate, address: values.address, notes: values.notes || '' },
      items: items.map(function(item){
        const qty = Number(item.quantity || item.qty || 1);
        const price = Number(item.price || 0);
        return { id: item.id || '', nameAr: item.nameAr || '', nameEn: item.nameEn || item.nameAr || '', categoryAr: item.categoryAr || '', categoryEn: item.categoryEn || '', price: price, qty: qty, total: Number((price * qty).toFixed(2)), img: item.img || '', emoji: item.emoji || '' };
      }),
      coupon: { code: values.discount > 0 ? values.coupon : '', discount: Number(values.discount || 0) },
      subtotal: Number(values.subtotal || 0),
      deliveryFee: Number(values.deliveryFee || 0),
      discountAmount: Number(values.discount || 0),
      grandTotal: Number(values.grandTotal || 0)
    };
  }

  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const subtotal = getCartSubtotal();
    if(subtotal < 30){ showToast(T[currentLang].minOrderToast); return; }

    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const emirate = custEmirateSelect.value;
    const address = document.getElementById('custAddress').value.trim();
    const notes = document.getElementById('custNotes').value.trim();
    const couponEntered = couponCodeInput.value.trim().toUpperCase();
    const fee = deliveryFees[emirate] || 0;

    // Phone Validation
    const phonePattern = /^(?:\+971|0)(?:50|51|52|54|55|56|58|2|3|4|6|7|9)\d{7}$/;
    if (!phonePattern.test(phone.replace(/\s/g, ''))) {
        showToast(currentLang === 'ar' ? 'يرجى إدخال رقم هاتف إماراتي صحيح' : 'Please enter a valid UAE phone number');
        return;
    }

    let discount = 0;
    const coupons = JSON.parse(localStorage.getItem('albostan_coupons') || '[]');
    const coupon = coupons.find(c => c.code === couponEntered && c.active);
    
    if (coupon) {
      if (coupon.minOrder && subtotal < coupon.minOrder) {
        showToast(currentLang === "ar" ? "الحد الأدنى للكوبون " + coupon.minOrder : "Min order for coupon " + coupon.minOrder);
        return;
      }
      if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
        showToast(currentLang === 'ar' ? 'انتهت صلاحية الكوبون' : 'Coupon expired');
        return;
      } else if (coupon.type === 'percentage') {
        discount = subtotal * (coupon.value / 100);
        if(coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
      } else if (coupon.type === 'fixed') {
        discount = coupon.value;
      }
    } else if(couponEntered === 'BOSTAN10'){
      discount = subtotal * 0.10;
      if(discount > 10) discount = 10;
    } else if(couponEntered !== ''){
      showToast(T[currentLang].couponInvalid);
      return;
    }
    const grandTotal = subtotal - discount + fee;

    saveCustomerDetails();
    const meta = getPendingOrderMeta();
    const dateText = formatOrderDateDisplay(meta.orderDate);

    const cartItems = cart.map(item => ({
      id: item.id || '',
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      categoryAr: item.categoryAr || '',
      categoryEn: item.categoryEn || '',
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      img: item.img || '',
      emoji: ''
    }));

    let msg = '';
    if(currentLang === 'ar'){
      msg += `🧾 طلب جديد من متجر البستان\n`;
      msg += `رقم الطلب: ${meta.orderId}\n`;
      msg += `تاريخ الطلب: ${dateText}\n\n`;
      msg += `👤 بيانات العميل:\n`;
      msg += `- الاسم: ${name}\n- الهاتف: ${phone}\n- الإمارة: ${emirate}\n- العنوان: ${address}\n`;
      if(notes) msg += `- ملاحظات: ${notes}\n`;
      msg += `\n💳 طريقة الدفع:\n- نقدًا عند الاستلام فقط (COD)\n- سيتم تأكيد الطلب عبر واتساب قبل التجهيز والتوصيل.\n\n`;
      msg += `📦 المنتجات المطلوبة:\n`;
      cartItems.forEach((item, idx) => { msg += `${idx+1}. ${item.nameAr} - الكمية: ${item.quantity} - السعر: ${item.price} د.إ\n`; });
      msg += `\n💵 تفاصيل الحساب:\n`;
      msg += `- قيمة المنتجات قبل الخصم: ${formatMoney(subtotal)} د.إ\n`;
      if(discount > 0) msg += `- الكوبون المستخدم: ${couponEntered}\n- قيمة الخصم: ${formatMoney(discount)} د.إ\n`;
      msg += `- رسوم التوصيل: ${formatMoney(fee)} د.إ\n`;
      msg += `- الإجمالي النهائي: ${formatMoney(grandTotal)} د.إ\n\n`;
      msg += `✅ تأكيد مهم:\nالدفع نقدًا عند الاستلام فقط، وسيتم التواصل مع العميل لتأكيد الطلب قبل التوصيل.`;
    } else {
      msg += `🧾 New Order from AlBostan Store\n`;
      msg += `Order ID: ${meta.orderId}\n`;
      msg += `Order Date: ${dateText}\n\n`;
      msg += `👤 Customer Details:\n`;
      msg += `- Name: ${name}\n- Phone: ${phone}\n- Emirate: ${emirate}\n- Address: ${address}\n`;
      if(notes) msg += `- Notes: ${notes}\n`;
      msg += `\n💳 Payment Method:\n- Cash on Delivery only (COD)\n- The order will be confirmed via WhatsApp before preparation and delivery.\n\n`;
      msg += `📦 Items Ordered:\n`;
      cartItems.forEach((item, idx) => { msg += `${idx+1}. ${item.nameEn} - Qty: ${item.quantity} - Price: ${item.price} AED\n`; });
      msg += `\n💵 Summary:\n`;
      msg += `- Items total before discount: ${formatMoney(subtotal)} AED\n`;
      if(discount > 0) msg += `- Coupon used: ${couponEntered}\n- Discount: ${formatMoney(discount)} AED\n`;
      msg += `- Delivery fee: ${formatMoney(fee)} AED\n`;
      msg += `- Grand total: ${formatMoney(grandTotal)} AED\n\n`;
      msg += `✅ Important Confirmation:\nPayment is Cash on Delivery only, and the order will be confirmed with the customer before delivery.`;
    }

    const submitBtn = e.submitter || document.querySelector('#checkoutForm button[type="submit"]');
    const oldSubmitText = submitBtn ? submitBtn.textContent : '';

    try{
      if(submitBtn){
        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'ar' ? 'جاري تسجيل الطلب...' : 'Saving order...';
      }
      const orderPayload = buildOrderPayloadForApi(meta, { name, phone, emirate, address, notes, coupon: couponEntered, subtotal, discount, deliveryFee: fee, grandTotal }, cartItems);
      const createdOrder = await createPendingWebsiteOrder(orderPayload);
      if(createdOrder && createdOrder.orderId){
        pendingOrderMeta.orderId = createdOrder.orderId;
      }
      saveLastOrderDetails(meta, { name, phone, emirate, address, coupon: couponEntered, subtotal, discount, deliveryFee: fee, grandTotal }, cartItems);
      trackGAEvent('whatsapp_checkout', { value: grandTotal });
      showToast(currentLang === 'ar' ? 'تم تسجيل الطلب، سيتم فتح واتساب الآن' : 'Order saved, WhatsApp will open now');
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
      const whatsappWindow = window.open(whatsappUrl, '_blank');
      if(!whatsappWindow){ window.location.href = whatsappUrl; }
      checkoutModal.classList.remove('open');
      resetPendingOrderMeta();
      cart = [];
      renderCart();
    }catch(error){
      console.error('Order registration failed:', error);
      showToast(currentLang === 'ar' ? 'تعذر تسجيل الطلب حاليًا، يرجى المحاولة مرة أخرى' : 'Could not save the order now. Please try again.');
    }finally{
      if(submitBtn){
        submitBtn.disabled = false;
        submitBtn.textContent = oldSubmitText;
      }
    }
  });

  // ===== طلباتي: البحث عن الطلب وتنزيل الإيصال =====
  let lastCustomerLookupOrder=null;
  function customerOrderStatusLabel(status){
    const ar={pending:'طلب جديد',confirmed:'تم التأكيد',out_for_delivery:'جاري التوصيل',delivered:'تم التوصيل',cancelled:'ملغي'};
    const en={pending:'Pending',confirmed:'Confirmed',out_for_delivery:'Out for delivery',delivered:'Delivered',cancelled:'Cancelled'};
    return (currentLang==='ar'?ar:en)[status] || status || (currentLang==='ar'?'غير محدد':'Unspecified');
  }
  function customerPaymentLabel(status){
    const ar={cod_pending:'الدفع عند الاستلام - غير مدفوع',cod_paid:'تم الدفع نقداً عند الاستلام',unpaid:'غير مدفوع',paid:'مدفوع'};
    const en={cod_pending:'COD pending - unpaid',cod_paid:'Paid cash on delivery',unpaid:'Unpaid',paid:'Paid'};
    return (currentLang==='ar'?ar:en)[status] || status || (currentLang==='ar'?'غير محدد':'Unspecified');
  }
  function customerMoney(value){ const num=Number(value||0); return (Number.isFinite(num)?num.toFixed(2):'0.00')+' AED'; }
  function customerDate(value){ if(!value)return '-'; const d=new Date(value); if(isNaN(d.getTime()))return escapeHTML(value); return d.toLocaleString(currentLang==='ar'?'ar-EG':'en-GB',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}); }
  function isCustomerOrderPaid(order){ return order && (order.paymentStatus==='cod_paid'||order.paymentStatus==='paid'); }
  function renderCustomerOrderMessage(message,type){
    const result=document.getElementById('customerOrderResult'); if(!result)return;
    const bg=type==='error'?'#ffebef':'#fff7e6'; const color=type==='error'?'#b91c1c':'#6a4600';
    result.innerHTML=`<div class="customer-order-message" style="background:${bg};color:${color};">${escapeHTML(message)}</div>`;
  }
  function renderCustomerOrderResult(order){
    const result=document.getElementById('customerOrderResult'); if(!result)return;
    const items=Array.isArray(order.items)?order.items:[]; const paid=isCustomerOrderPaid(order); const customer=order.customer||{};
    const itemsHtml=items.length?items.map(function(item,idx){
      const name=currentLang==='ar'?(item.nameAr||item.nameEn||'منتج'):(item.nameEn||item.nameAr||'Product');
      const qty=Number(item.qty||item.quantity||1); const total=Number(item.total||((Number(item.price)||0)*qty));
      return `<div class="customer-order-item"><span>${idx+1}. ${escapeHTML(name)} × ${qty}</span><strong>${customerMoney(total)}</strong></div>`;
    }).join(''):`<p style="color:#777;text-align:center;">${currentLang==='ar'?'لا توجد منتجات داخل هذا الطلب':'No products in this order'}</p>`;
    result.innerHTML=`<div class="customer-order-card"><div class="customer-order-head"><div><div style="font-weight:800;color:var(--clay);margin-bottom:4px;">${currentLang==='ar'?'تفاصيل الطلب':'Order Details'}</div><strong>${escapeHTML(order.id||'-')}</strong></div><span class="customer-status-pill ${paid?'customer-status-paid':''}">${escapeHTML(customerPaymentLabel(order.paymentStatus))}</span></div><div class="customer-order-grid"><div class="customer-order-info"><b>${currentLang==='ar'?'اسم العميل':'Customer Name'}</b>${escapeHTML(customer.name||'-')}</div><div class="customer-order-info"><b>${currentLang==='ar'?'الهاتف':'Phone'}</b><span style="direction:ltr;display:inline-block;">${escapeHTML(customer.phone||'-')}</span></div><div class="customer-order-info"><b>${currentLang==='ar'?'حالة الطلب':'Order Status'}</b>${escapeHTML(customerOrderStatusLabel(order.status))}</div><div class="customer-order-info"><b>${currentLang==='ar'?'تاريخ الطلب':'Order Date'}</b>${customerDate(order.createdAt)}</div><div class="customer-order-info"><b>${currentLang==='ar'?'الإمارة':'Emirate'}</b>${escapeHTML(customer.emirate||'-')}</div><div class="customer-order-info"><b>${currentLang==='ar'?'العنوان':'Address'}</b>${escapeHTML(customer.address||'-')}</div></div><div class="customer-order-items"><div style="font-weight:900;color:var(--clay);margin-bottom:8px;">${currentLang==='ar'?'المنتجات':'Products'}</div>${itemsHtml}</div><div class="customer-order-grid"><div class="customer-order-info"><b>${currentLang==='ar'?'المجموع':'Subtotal'}</b>${customerMoney(order.subtotal)}</div><div class="customer-order-info"><b>${currentLang==='ar'?'الخصم':'Discount'}</b>${customerMoney(order.discountAmount)}</div><div class="customer-order-info"><b>${currentLang==='ar'?'التوصيل':'Delivery'}</b>${customerMoney(order.deliveryFee)}</div><div class="customer-order-info"><b>${currentLang==='ar'?'الإجمالي النهائي':'Grand Total'}</b><strong style="color:var(--clay);">${customerMoney(order.grandTotal)}</strong></div></div><div class="customer-order-actions"><button type="button" onclick="openCustomerReceiptFromLastResult()">${currentLang==='ar'?'عرض / تنزيل الإيصال':'View / Download Receipt'}</button><button type="button" class="customer-order-secondary" onclick="trackCustomerOrderWhatsapp()">${currentLang==='ar'?'تتبع عبر واتساب':'Track via WhatsApp'}</button></div></div>`;
  }
  async function lookupCustomerOrder(){
    const orderId=document.getElementById('customerOrderIdInput').value.trim(); const phone=document.getElementById('customerPhoneInput').value.trim(); const btn=document.getElementById('trackSubmitBtn');
    if(!orderId||!phone){renderCustomerOrderMessage(currentLang==='ar'?'يرجى إدخال رقم الطلب ورقم الهاتف':'Please enter the order ID and phone number','error');return;}
    const oldText=btn.textContent; btn.disabled=true; btn.textContent=currentLang==='ar'?'جاري البحث...':'Searching...'; renderCustomerOrderMessage(currentLang==='ar'?'جاري البحث عن طلبك...':'Searching for your order...','info');
    try{
      const res=await fetch('/api/customer-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId,phone})});
      const data=await res.json().catch(()=>({}));
      if(!res.ok||!data.ok||!data.order){lastCustomerLookupOrder=null;renderCustomerOrderMessage(currentLang==='ar'?'لم يتم العثور على الطلب. تأكد من رقم الطلب ورقم الهاتف.':'Order not found. Please check the order ID and phone number.','error');return;}
      lastCustomerLookupOrder=data.order; renderCustomerOrderResult(data.order);
    }catch(error){lastCustomerLookupOrder=null;renderCustomerOrderMessage(currentLang==='ar'?'تعذر الاتصال بخدمة الطلبات. حاول لاحقاً.':'Could not connect to the orders service. Please try again later.','error');}
    finally{btn.disabled=false;btn.textContent=oldText;}
  }
  function buildCustomerReceiptHtml(order){
    const paid=isCustomerOrderPaid(order); const customer=order.customer||{}; const titleAr=paid?'فاتورة / إيصال دفع':'ملخص طلب غير مدفوع'; const titleEn=paid?'Invoice / Payment Receipt':'Unpaid Order Summary';
    const rows=(Array.isArray(order.items)?order.items:[]).map(function(item,idx){const qty=Number(item.qty||item.quantity||1);const price=Number(item.price||0);const total=Number(item.total||(price*qty));return `<tr><td>${idx+1}</td><td><div class="ar"><b>${escapeHTML(item.nameAr||item.nameEn||'منتج')}</b></div><div class="en">${escapeHTML(item.nameEn||item.nameAr||'Product')}</div></td><td>${qty}</td><td>${customerMoney(price)}</td><td>${customerMoney(total)}</td></tr>`;}).join('');
    const stamp=paid?'<div class="paid-stamp"><span>PAID</span><small>تم الدفع</small></div>':'';
    return `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escapeHTML(order.id||'receipt')}</title><link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap" rel="stylesheet"><style>*{box-sizing:border-box}body{margin:0;background:#eef2ef;font-family:Tajawal,Arial,sans-serif;color:#181A19;-webkit-print-color-adjust:exact;print-color-adjust:exact}.toolbar{position:sticky;top:0;background:#fff;padding:12px;display:flex;gap:10px;justify-content:center;border-bottom:1px solid #E8ECE9}.toolbar button{border:0;border-radius:999px;padding:11px 18px;font-weight:900;cursor:pointer}.print{background:#1F5E3B;color:#fff}.close{background:#E8ECE9;color:#15452A}.page{width:794px;min-height:1123px;margin:16px auto;background:#fff;padding:28px;box-shadow:0 20px 50px rgba(0,0,0,.12)}.receipt{position:relative;border:2px solid #1F5E3B;border-radius:16px;padding:20px}.top{display:grid;grid-template-columns:1fr 1fr;gap:18px;border-bottom:1px solid #E8ECE9;padding-bottom:14px;margin-bottom:14px}.brand{font-size:22px;font-weight:900;color:#15452A}.gold{color:#C9A227;font-weight:900}.ar{text-align:right;direction:rtl}.en{text-align:left;direction:ltr;font-family:Arial,sans-serif}.meta{font-size:12px;line-height:1.7;color:#33443a}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0}.panel{background:#F5F7F5;border:1px solid #E8ECE9;border-radius:14px;padding:12px;line-height:1.7;font-size:13px}.panel b{color:#15452A}table{width:100%;border-collapse:collapse;margin-top:12px;font-size:12px;text-align:center}th{background:#15452A;color:#fff;padding:8px}td{padding:9px;border-bottom:1px solid #E8ECE9;vertical-align:top}.summary{width:310px;margin:14px 0 0 auto;background:#F5F7F5;border-radius:12px;padding:12px;font-size:13px}.sum{display:flex;justify-content:space-between;margin-bottom:7px}.total{border-top:1px dashed #C9A227;padding-top:9px;font-weight:900;color:#15452A}.notice{margin-top:16px;background:#fff7e6;color:#4b3600;border-radius:12px;padding:12px;line-height:1.7;font-size:12px}.paid-stamp{position:absolute;top:92px;left:38px;width:132px;height:132px;border:6px solid #d71920;border-radius:50%;color:#d71920;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-18deg);opacity:.88;background:rgba(255,255,255,.18);z-index:3}.paid-stamp:before{content:"";position:absolute;inset:10px;border:2px dashed rgba(215,25,32,.65);border-radius:50%}.paid-stamp span{font-size:30px;font-weight:900;line-height:1}.paid-stamp small{font-size:18px;font-weight:900;margin-top:7px}@media(max-width:840px){.page{width:794px;min-width:794px;margin:10px}.toolbar{justify-content:stretch}.toolbar button{flex:1}}@page{size:A4 portrait;margin:8mm}@media print{body{background:#fff}.toolbar{display:none}.page{width:194mm;min-height:auto;margin:0;padding:0;box-shadow:none}.receipt{padding:5mm}}</style></head><body><div class="toolbar"><button class="print" onclick="window.print()">طباعة / حفظ PDF</button><button class="close" onclick="window.close()">إغلاق</button></div><div class="page"><div class="receipt">${stamp}<div class="top"><div class="en"><div class="brand">AlBostan Store</div><div class="gold">${titleEn}</div><div class="meta">Order ID: ${escapeHTML(order.id||'')}</div><div class="meta">Date: ${customerDate(order.createdAt)}</div><div class="meta">WhatsApp: +971 50 155 4132</div></div><div class="ar"><div class="brand">متجر البستان</div><div class="gold">${titleAr}</div><div class="meta">رقم الطلب: ${escapeHTML(order.id||'')}</div><div class="meta">التاريخ: ${customerDate(order.createdAt)}</div><div class="meta">واتساب: <span style="direction:ltr;display:inline-block;">+971 50 155 4132</span></div></div></div><div class="grid"><div class="panel en"><b>Customer Details</b><br>Name: ${escapeHTML(customer.name||'-')}<br>Phone: ${escapeHTML(customer.phone||'-')}<br>Emirate: ${escapeHTML(customer.emirate||'-')}<br>Address: ${escapeHTML(customer.address||'-')}</div><div class="panel ar"><b>بيانات العميل</b><br>الاسم: ${escapeHTML(customer.name||'-')}<br>الهاتف: <span style="direction:ltr;display:inline-block;">${escapeHTML(customer.phone||'-')}</span><br>الإمارة: ${escapeHTML(customer.emirate||'-')}<br>العنوان: ${escapeHTML(customer.address||'-')}</div></div><div class="grid"><div class="panel en"><b>Order & Payment</b><br>Order status: ${escapeHTML(customerOrderStatusLabel(order.status))}<br>Payment method: Cash on Delivery (COD)<br>Payment status: ${escapeHTML(customerPaymentLabel(order.paymentStatus))}</div><div class="panel ar"><b>بيانات الطلب والدفع</b><br>حالة الطلب: ${escapeHTML(customerOrderStatusLabel(order.status))}<br>طريقة الدفع: نقداً عند الاستلام COD<br>حالة الدفع: ${escapeHTML(customerPaymentLabel(order.paymentStatus))}</div></div><table><thead><tr><th>#</th><th>المنتج<br>Product</th><th>الكمية<br>Qty</th><th>سعر الوحدة<br>Unit Price</th><th>الإجمالي<br>Total</th></tr></thead><tbody>${rows}</tbody></table><div class="summary"><div class="sum"><span>Items / المنتجات</span><b>${customerMoney(order.subtotal)}</b></div><div class="sum"><span>Discount / الخصم</span><b>${customerMoney(order.discountAmount)}</b></div><div class="sum"><span>Delivery / التوصيل</span><b>${customerMoney(order.deliveryFee)}</b></div><div class="sum total"><span>Total / الإجمالي</span><b>${customerMoney(order.grandTotal)}</b></div></div><div class="notice"><div class="ar">${paid?'هذا المستند يؤكد أن حالة الدفع مسجلة كمدفوعة نقداً عند الاستلام في متجر البستان.':'هذا المستند ليس إيصال دفع. حالة الدفع الحالية غير مدفوعة، والدفع يتم نقداً عند الاستلام فقط.'}</div><div class="en">${paid?'This document confirms that the payment status is marked as paid cash on delivery in AlBostan Store.':'This document is not a payment receipt. The current payment status is unpaid, and payment is cash on delivery only.'}</div></div></div></div></body></html>`;
  }
  function openCustomerReceiptFromLastResult(){
    if(!lastCustomerLookupOrder){renderCustomerOrderMessage(currentLang==='ar'?'ابحث عن الطلب أولاً لعرض الإيصال.':'Search for the order first to view the receipt.','error');return;}
    const w=window.open('','_blank');
    if(!w){renderCustomerOrderMessage(currentLang==='ar'?'المتصفح منع فتح صفحة الإيصال. اسمح بالنوافذ المنبثقة ثم حاول مرة أخرى.':'The browser blocked the receipt window. Please allow pop-ups and try again.','error');return;}
    w.document.open(); w.document.write(buildCustomerReceiptHtml(lastCustomerLookupOrder)); w.document.close(); setTimeout(function(){try{w.focus();}catch(e){}},300);
  }
  function trackCustomerOrderWhatsapp(){
    if(!lastCustomerLookupOrder)return;
    const msg=currentLang==='ar'?`مرحبًا متجر البستان، أريد تتبع طلبي.\nرقم الطلب: ${lastCustomerLookupOrder.id}\nرقم الهاتف: ${lastCustomerLookupOrder.customer&&lastCustomerLookupOrder.customer.phone?lastCustomerLookupOrder.customer.phone:''}`:`Hello AlBostan Store, I would like to track my order.\nOrder ID: ${lastCustomerLookupOrder.id}\nPhone: ${lastCustomerLookupOrder.customer&&lastCustomerLookupOrder.customer.phone?lastCustomerLookupOrder.customer.phone:''}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,'_blank');
  }
  window.openCustomerReceiptFromLastResult=openCustomerReceiptFromLastResult;
  window.trackCustomerOrderWhatsapp=trackCustomerOrderWhatsapp;
  document.getElementById('trackOrderForm').addEventListener('submit', lookupCustomerOrder);

  // ===== زر الرجوع للأعلى =====
  const backToTopBtn = document.getElementById('backToTopBtn');
  window.addEventListener('scroll', () => { backToTopBtn.classList.toggle('show', window.scrollY > 300); });
  backToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // ===== زر واتساب العائم =====
  document.getElementById('waFloatBtn').addEventListener('click', (e) => {
    e.preventDefault();
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(T[currentLang].waInquiry)}`, '_blank');
    trackGAEvent('contact_whatsapp', { method: 'floating_button' });
  });

  // ===== البحث والتصفية =====
  const searchInput = document.getElementById('searchInput');
  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  const priceSortSelect = document.getElementById('priceSort');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const noResultsMsg = document.getElementById('noResultsMsg');
  const productGrid = document.getElementById('productGrid');
  const availableOnlyCheck = document.getElementById('availableOnlyCheck');

  let currentCategory = 'all';
  let currentSearchQuery = '';
  let minPriceValue = '';
  let maxPriceValue = '';
  let sortOption = 'default';

  function filterProducts(){
    let productCards = Array.from(productGrid.querySelectorAll('.prod-card'));
    let visibleCount = 0;
    const isAvailableOnly = availableOnlyCheck.checked;
    productCards.forEach(card => {
      const nameAr = card.dataset.nameAr ? card.dataset.nameAr.toLowerCase() : '';
      const nameEn = card.dataset.nameEn ? card.dataset.nameEn.toLowerCase() : '';
      const catEn = normalizeCategoryEn(card.dataset.categoryEn);
      const price = Number(card.dataset.price);
      const available = card.dataset.available || 'yes';
      const matchesSearch = nameAr.includes(currentSearchQuery) || nameEn.includes(currentSearchQuery);
      const matchesCategory = currentCategory === 'all' || catEn === currentCategory;
      const minP = minPriceValue !== '' ? Number(minPriceValue) : 0;
      const maxP = maxPriceValue !== '' ? Number(maxPriceValue) : Infinity;
      const matchesPrice = price >= minP && price <= maxP;
      const matchesAvailability = !isAvailableOnly || available === 'yes';
      if(matchesSearch && matchesCategory && matchesPrice && matchesAvailability){ card.style.display = 'block'; visibleCount++; }
      else { card.style.display = 'none'; }
    });

    if(sortOption !== 'default'){
      productCards.sort((a, b) => {
        const priceA = Number(a.dataset.price || 0), priceB = Number(b.dataset.price || 0);
        const nameA = currentLang === 'ar' ? (a.dataset.nameAr||'') : (a.dataset.nameEn||'');
        const nameB = currentLang === 'ar' ? (b.dataset.nameAr||'') : (b.dataset.nameEn||'');
        const avA = a.dataset.available || 'yes', avB = b.dataset.available || 'yes';
        const indexA = Number(a.dataset.index || 0), indexB = Number(b.dataset.index || 0);
        if(sortOption === 'low-high') return priceA - priceB;
        if(sortOption === 'high-low') return priceB - priceA;
        if(sortOption === 'name-az') return nameA.localeCompare(nameB);
        if(sortOption === 'name-za') return nameB.localeCompare(nameA);
        if(sortOption === 'available-first'){ if(avA==='yes'&&avB==='no') return -1; if(avA==='no'&&avB==='yes') return 1; return indexA-indexB; }
        if(sortOption === 'newest') return indexB - indexA;
        return 0;
      });
    } else {
      productCards.sort((a, b) => Number(a.dataset.index||0) - Number(b.dataset.index||0));
    }
    productCards.forEach(card => productGrid.appendChild(card));
    noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  searchInput.addEventListener('input', (e) => { currentSearchQuery = e.target.value.toLowerCase().trim(); filterProducts(); trackGAEvent('search', { search_term: currentSearchQuery }); });
  minPriceInput.addEventListener('input', (e) => { minPriceValue = e.target.value; filterProducts(); });
  maxPriceInput.addEventListener('input', (e) => { maxPriceValue = e.target.value; filterProducts(); });
  priceSortSelect.addEventListener('change', (e) => { sortOption = e.target.value; filterProducts(); });
  availableOnlyCheck.addEventListener('change', filterProducts);

  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = ''; minPriceInput.value = ''; maxPriceInput.value = '';
    priceSortSelect.value = 'default'; availableOnlyCheck.checked = false;
    currentSearchQuery = ''; minPriceValue = ''; maxPriceValue = ''; sortOption = 'default';
    window.setFilter('all');
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.cat;
      filterProducts();
      trackGAEvent('category_filter', { category: currentCategory });
    });
  });

  window.setFilter = function(cat){
    currentCategory = cat;
    filterButtons.forEach(b => { b.dataset.cat === cat ? b.classList.add('active') : b.classList.remove('active'); });
    filterProducts();
    trackGAEvent('category_filter', { category: cat });
  };

  // ===== نافذة تفاصيل المنتج =====
  const modalOverlay = document.getElementById('productModal');
  const modalClose = document.getElementById('modalClose');
  const mImg = document.getElementById('mImg');
  const mEmoji = document.getElementById('mEmoji');
  const mCat = document.getElementById('mCat');
  const mTitle = document.getElementById('mTitle');
  const mPrice = document.getElementById('mPrice');
  const mDesc = document.getElementById('mDesc');
  const mAddBtn = document.getElementById('mAddBtn');
  const mDirectWaBtn = document.getElementById('mDirectWaBtn');
  const mQtyText = document.getElementById('mQtyText');
  const mRating = document.getElementById('mRating');
  const mShareBtn = document.getElementById('mShareBtn');
  const relatedProductsSection = document.getElementById('relatedProductsSection');
  const relatedProductsArea = document.getElementById('relatedProductsArea');

  let currentModalProduct = null;
  let modalSelectedQty = 1;

  function updateModalContent(){
    if(!currentModalProduct) return;
    const data = currentModalProduct;
    mCat.textContent = currentLang === 'ar' ? data.categoryAr : data.categoryEn;
    mTitle.textContent = currentLang === 'ar' ? data.nameAr : data.nameEn;
    mDesc.textContent = currentLang === 'ar' ? data.descAr : data.descEn;
    mQtyText.textContent = modalSelectedQty;
    mRating.innerHTML = '';
    if(data.rating){
      const rateVal = Math.round(Number(data.rating));
      if(rateVal >= 1 && rateVal <= 5){ mRating.innerHTML = '★'.repeat(rateVal) + '☆'.repeat(5-rateVal); mRating.style.color = '#FFD700'; mRating.style.fontSize = '1.2rem'; }
    }
    const cur = T[currentLang].currency;
    const pricing = getEffectiveProductPricing(data);
    let priceHtml = `<span style="color:var(--clay); font-weight:800;">${pricing.priceText} ${cur}</span>`;
    if(pricing.isActiveDiscount && pricing.oldPriceText){
      priceHtml += `<span class="price-old">${pricing.oldPriceText} ${cur}</span>`;
      if(pricing.discount) priceHtml += ` <span style="background:#e63946; color:#fff; font-size:0.75rem; padding:2px 8px; border-radius:50px;">${pricing.discount}</span>`;
      if(data.discountEndDate) priceHtml += `<span class="discount-expiry-note">${formatDiscountEndLabel(data.discountEndDate)}</span>`;
      data.price = pricing.priceText;
      data.oldPrice = pricing.oldPriceText;
      data.discount = pricing.discount;
    }else{
      data.price = pricing.priceText;
      data.oldPrice = '';
      data.discount = '';
    }
    if(data.available === 'no'){
      priceHtml += ` <span style="background:var(--clay); color:#fff; font-size:0.75rem; padding:2px 8px; border-radius:50px; margin-inline-start:6px;">${T[currentLang].outOfStock}</span>`;
      mAddBtn.disabled = true; mDirectWaBtn.disabled = true;
    } else { mAddBtn.disabled = false; mDirectWaBtn.disabled = false; }
    mPrice.innerHTML = priceHtml;
    let images = [];
    try { images = data.images ? JSON.parse(data.images) : []; } catch(e) { images = []; }
    if(images.length === 0 && data.img) images = [data.img];
    
    if(images.length > 0){
      mEmoji.style.display = 'none';
      mImg.style.display = 'inline-block';
      mImg.src = images[0];
      mImg.dataset.imageIndex = '0';
      mImg.dataset.totalImages = images.length;
      mImg.dataset.allImages = JSON.stringify(images);
      mImg.onerror = function(){
        mImg.style.display = 'none';
        mEmoji.style.display = 'inline-block';
        mEmoji.innerHTML = svgIcon('bag');
      };
    } else {
      mImg.style.display = 'none';
      mEmoji.style.display = 'inline-block';
      mEmoji.innerHTML = svgIcon('bag');
    }
    renderRelatedProducts(data);
  }

  function renderRelatedProducts(currentProd){
    if(!globalProductsList || globalProductsList.length === 0){ relatedProductsSection.style.display = 'none'; return; }
    const filtered = globalProductsList.filter(p => p.categoryEn === currentProd.categoryEn && p.nameAr !== currentProd.nameAr).slice(0, 3);
    if(filtered.length === 0){ relatedProductsSection.style.display = 'none'; return; }
    relatedProductsSection.style.display = 'block';
    relatedProductsArea.innerHTML = filtered.map((p, idx) => {
      const pName = currentLang === 'ar' ? p.nameAr : p.nameEn;
      const mediaHtml = p.img ? `<img src="${p.img}" class="related-item-thumb" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : '';
      return `<div class="related-item" data-idx="${idx}">${mediaHtml}<div class="related-item-thumb" style="${p.img ? 'display:none;' : 'display:flex;'}">${svgIcon('bag')}</div><div class="related-item-info"><h5>${escapeHTML(pName)}</h5><span>${escapeHTML(getEffectiveProductPricing(p).priceText)} ${T[currentLang].currency}</span></div></div>`;
    }).join('');
    relatedProductsArea.querySelectorAll('.related-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        const tp = filtered[index];
        openModal({ nameAr: tp.nameAr, nameEn: tp.nameEn, price: tp.price, oldPrice: tp.oldPrice, originalPriceBeforeDiscount: tp.originalPriceBeforeDiscount || tp.oldPrice || '', discount: tp.discount, discountEndDate: tp.discountEndDate || '', emoji: tp.emoji, img: tp.img, categoryAr: tp.categoryAr, categoryEn: tp.categoryEn, descAr: tp.descAr, descEn: tp.descEn, available: tp.available, rating: tp.rating, images: JSON.stringify(Array.isArray(tp.images) ? tp.images : (tp.img ? [tp.img] : [])) });
      });
    });
  }

  function openModal(productData){ 
    currentModalProduct = productData; 
    modalSelectedQty = 1; 
    updateModalContent();
    setTimeout(() => updateImageGallery(), 100);
    modalOverlay.classList.add('open'); 
    trackGAEvent('product_view', { item_name: productData.nameEn }); 
  }
  function closeModal(){ modalOverlay.classList.remove('open'); currentModalProduct = null; }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if(e.target === modalOverlay) closeModal(); });
  document.getElementById('mQtyPlus').addEventListener('click', () => {
    if(!currentModalProduct) return;
    const stockLimit = getProductStockLimit(currentModalProduct);
    const alreadyInCart = getCartItemQuantityByName(currentModalProduct.nameAr);
    if(stockLimit !== Infinity && alreadyInCart + modalSelectedQty >= stockLimit){
      showToast(getLimitToastMessage(stockLimit));
      return;
    }
    modalSelectedQty++;
    mQtyText.textContent = modalSelectedQty;
  });
  document.getElementById('mQtyMinus').addEventListener('click', () => { if(modalSelectedQty > 1){ modalSelectedQty--; mQtyText.textContent = modalSelectedQty; } });
  mAddBtn.addEventListener('click', () => {
    if(currentModalProduct && currentModalProduct.available !== 'no'){
      const added = addToCart(currentModalProduct, modalSelectedQty);
      if(added) closeModal();
    }
  });
  mDirectWaBtn.addEventListener('click', () => {
    if(!currentModalProduct || currentModalProduct.available === 'no') return;
    const data = currentModalProduct;
    const name = currentLang === 'ar' ? data.nameAr : data.nameEn;
    let text = `${T[currentLang].directWaMsg}- ${name} [${modalSelectedQty}]\n- السعر: ${data.price} ${T[currentLang].currency}`;
    trackGAEvent('contact_whatsapp', { method: 'direct_product_button' });
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  });
  mShareBtn.addEventListener('click', async () => {
    if(!currentModalProduct) return;
    const data = currentModalProduct;
    const pName = currentLang === 'ar' ? data.nameAr : data.nameEn;
    const shareText = `${pName} - ${data.price} ${T[currentLang].currency}`;
    if(navigator.share){ try{ await navigator.share({ title: pName, text: shareText, url: window.location.href }); }catch(err){} }
    else { const d = document.createElement('textarea'); d.value = `${shareText} \n ${window.location.href}`; document.body.appendChild(d); d.select(); document.execCommand('copy'); document.body.removeChild(d); showToast(T[currentLang].copied); }
  });

  // ===== تكبير صور المنتجات =====
  const imageLightbox = document.getElementById('imageLightbox');
  const imageLightboxImg = document.getElementById('imageLightboxImg');
  const imageLightboxClose = document.getElementById('imageLightboxClose');
  const imageLightboxPrev = document.getElementById('imageLightboxPrev');
  const imageLightboxNext = document.getElementById('imageLightboxNext');
  const imageLightboxCounter = document.getElementById('imageLightboxCounter');
  let lightboxImages = [];
  let lightboxIndex = 0;
  function updateImageLightbox(){ if(!imageLightbox || !imageLightboxImg || !lightboxImages.length) return; lightboxIndex = (lightboxIndex + lightboxImages.length) % lightboxImages.length; imageLightboxImg.src = lightboxImages[lightboxIndex]; imageLightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`; const multi = lightboxImages.length > 1; imageLightboxPrev.style.display = multi ? 'flex' : 'none'; imageLightboxNext.style.display = multi ? 'flex' : 'none'; }
  function openImageLightbox(images, startIndex = 0, altText = ''){ lightboxImages = (images || []).filter(Boolean); if(!lightboxImages.length) return; lightboxIndex = startIndex || 0; imageLightboxImg.alt = altText || ''; updateImageLightbox(); imageLightbox.classList.add('open'); }
  function closeImageLightbox(){ if(!imageLightbox) return; imageLightbox.classList.remove('open'); imageLightboxImg.src = ''; }
  if(imageLightboxClose) imageLightboxClose.addEventListener('click', closeImageLightbox);
  if(imageLightbox) imageLightbox.addEventListener('click', e => { if(e.target === imageLightbox) closeImageLightbox(); });
  if(imageLightboxPrev) imageLightboxPrev.addEventListener('click', e => { e.stopPropagation(); lightboxIndex--; updateImageLightbox(); });
  if(imageLightboxNext) imageLightboxNext.addEventListener('click', e => { e.stopPropagation(); lightboxIndex++; updateImageLightbox(); });

  const mImgPrev = document.getElementById('mImgPrev');
  const mImgNext = document.getElementById('mImgNext');
  const mImgCounter = document.getElementById('mImgCounter');
  
  function updateImageGallery(){
    const totalImages = parseInt(mImg.dataset.totalImages) || 1;
    const currentIndex = parseInt(mImg.dataset.imageIndex) || 0;
    if(totalImages > 1){
      mImgPrev.style.display = 'block';
      mImgNext.style.display = 'block';
      mImgCounter.style.display = 'block';
      mImgCounter.textContent = `${currentIndex + 1} / ${totalImages}`;
    } else {
      mImgPrev.style.display = 'none';
      mImgNext.style.display = 'none';
      mImgCounter.style.display = 'none';
    }
  }
  
  mImgPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    try{
      const images = JSON.parse(mImg.dataset.allImages);
      let currentIndex = parseInt(mImg.dataset.imageIndex) || 0;
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      mImg.src = images[currentIndex];
      mImg.dataset.imageIndex = currentIndex;
      updateImageGallery();
    }catch(err){}
  });
  
  mImgNext.addEventListener('click', (e) => {
    e.stopPropagation();
    try{
      const images = JSON.parse(mImg.dataset.allImages);
      let currentIndex = parseInt(mImg.dataset.imageIndex) || 0;
      currentIndex = (currentIndex + 1) % images.length;
      mImg.src = images[currentIndex];
      mImg.dataset.imageIndex = currentIndex;
      updateImageGallery();
    }catch(err){}
  });
  mImg.addEventListener('click', (e) => { e.stopPropagation(); try{ const images = JSON.parse(mImg.dataset.allImages || '[]'); const currentIndex = parseInt(mImg.dataset.imageIndex) || 0; openImageLightbox(images, currentIndex, mTitle.textContent || ''); }catch(err){} });

  // ===== الأسئلة الشائعة =====
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => question.closest('.faq-item').classList.toggle('open'));
  });

  // ===== القوائم والقوائم المنسدلة =====
  const accountBtn = document.getElementById('accountBtn');
  const accountDropdown = document.getElementById('accountDropdown');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('nav.links');

  accountBtn.addEventListener('click', (e) => { e.stopPropagation(); accountDropdown.classList.toggle('open'); });
  menuToggle.addEventListener('click', (e) => { e.stopPropagation(); navLinks.classList.toggle('mobile-open'); menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('mobile-open') ? 'true' : 'false'); });
  document.addEventListener('click', () => { accountDropdown.classList.remove('open'); if(window.matchMedia('(max-width:680px)').matches){ navLinks.classList.remove('mobile-open'); menuToggle.setAttribute('aria-expanded','false'); } });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape'){ checkoutModal.classList.remove('open'); modalOverlay.classList.remove('open'); closeImageLightbox(); closeCart(); closeWishlist(); } });

  // ===== اللغة - دالة موحدة تشمل جميع التحديثات =====
  function applyLanguage(lang){
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-ar]').forEach(el => { el.textContent = lang === 'ar' ? el.dataset.ar : el.dataset.en; });
    document.querySelectorAll('[data-ar-placeholder]').forEach(el => { el.placeholder = lang === 'ar' ? el.dataset.arPlaceholder : el.dataset.enPlaceholder; });
    document.querySelectorAll('[data-ar-aria-label]').forEach(el => { el.setAttribute('aria-label', lang === 'ar' ? el.dataset.arAriaLabel : el.dataset.enAriaLabel); });
    document.getElementById('langToggle').textContent = lang === 'ar' ? 'EN' : 'AR';
    if(currentModalProduct) updateModalContent();
    renderCart();
    renderWishlist();
    filterProducts();
    updateCheckoutSummary();
    updateCheckoutOrderMetaBox();
    renderLastOrderBox();
    document.querySelectorAll('#priceSort option[data-ar]').forEach(opt => { opt.textContent = lang === 'ar' ? opt.dataset.ar : opt.dataset.en; });
  }

  document.getElementById('langToggle').addEventListener('click', () => {
    applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
  });

  // ===== جلب المنتجات (تم إصلاح مشكلة GitHub API بالكامل هنا) =====
  const PRODUCTS_JSON_URL = '/products.json';
  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1kdO5E6o8FW3X2qHQefOa9tlH0Qdnoqzuwx7UvPyyqTU/gviz/tq?tqx=out:csv&sheet=Products';

  const fallbackProducts = [
    { nameAr: 'عسل سدر طبيعي', nameEn: 'Natural Sidr Honey', price: '150', emoji: '', categoryAr: 'بقالة', categoryEn: 'Grocery', descAr: 'عسل سدر جبلي طبيعي 100% غني بالفوائد.', descEn: '100% natural mountain Sidr honey rich in benefits.', available: 'yes', rating: '5' },
    { nameAr: 'تمر خلاص فاخر', nameEn: 'Premium Khalas Dates', price: '45', emoji: '', categoryAr: 'بقالة', categoryEn: 'Grocery', descAr: 'تمر خلاص فاخر من مزارعنا، جودة عالية وطعم رائع.', descEn: 'Premium Khalas dates from our farms, high quality and great taste.', available: 'yes', rating: '5' },
    { nameAr: 'زيت زيتون بكر', nameEn: 'Virgin Olive Oil', price: '65', emoji: '', categoryAr: 'بقالة', categoryEn: 'Grocery', descAr: 'زيت زيتون بكر ممتاز عصرة أولى على البارد.', descEn: 'Extra virgin olive oil, first cold press.', available: 'yes', rating: '4' }
  ];

  function parseCSV(text){
    const rows = [];
    let row = [], field = '', inQuotes = false;
    for(let i = 0; i < text.length; i++){
      const char = text[i];
      if(inQuotes){ if(char === '"'){ if(text[i+1] === '"'){ field += '"'; i++; } else { inQuotes = false; } } else { field += char; } }
      else { if(char === '"'){ inQuotes = true; } else if(char === ','){ row.push(field); field = ''; } else if(char === '\n'){ row.push(field); rows.push(row); row = []; field = ''; } else if(char === '\r'){} else { field += char; } }
    }
    if(field.length > 0 || row.length > 0){ row.push(field); rows.push(row); }
    return rows;
  }

  function getCartItemQuantityByName(nameAr){ const item = cart.find(cartItem => cartItem.nameAr === nameAr); return item ? Number(item.quantity || 0) : 0; }
  function syncProductQtyControls(){ document.querySelectorAll('.prod-card').forEach(card => { const control = card.querySelector('.prod-card-cart-control'); const qtyText = card.querySelector('.prod-card-qty'); if(!control || !qtyText) return; const qty = getCartItemQuantityByName(card.dataset.nameAr); qtyText.textContent = qty; control.classList.toggle('active', qty > 0); }); }
  function decreaseProductFromCard(productData){ const idx = cart.findIndex(item => item.nameAr === productData.nameAr); if(idx === -1) return; trackGAEvent('remove_from_cart', { item_name: cart[idx].nameEn, value: cart[idx].price }); cart[idx].quantity--; if(cart[idx].quantity <= 0){ cart.splice(idx, 1); showToast(T[currentLang].removed); } renderCart(); }
  function bindProductCardEvents(){
    document.querySelectorAll('.prod-card .prod-card-plus').forEach(btn => { btn.addEventListener('click', (e) => { e.stopPropagation(); const card = btn.closest('.prod-card'); if(!card || card.dataset.available === 'no') return; addToCart(card.dataset, 1); }); });
    document.querySelectorAll('.prod-card .prod-card-minus').forEach(btn => { btn.addEventListener('click', (e) => { e.stopPropagation(); const card = btn.closest('.prod-card'); if(card) decreaseProductFromCard(card.dataset); }); });
    document.querySelectorAll('.prod-card .prod-zoom-btn').forEach(btn => { btn.addEventListener('click', (e) => { e.stopPropagation(); const card = btn.closest('.prod-card'); if(card) openImageLightbox(normalizeProductImages(card.dataset), 0, currentLang === 'ar' ? card.dataset.nameAr : card.dataset.nameEn); }); });
    document.querySelectorAll('.prod-card .prod-img').forEach(img => { img.addEventListener('click', (e) => { e.stopPropagation(); const card = img.closest('.prod-card'); if(card) openModal(card.dataset); }); });
    document.querySelectorAll('.prod-card .prod-wishlist-btn').forEach(btn => { btn.addEventListener('click', (e) => { e.stopPropagation(); toggleWishlist(btn.closest('.prod-card').dataset); }); });
    document.querySelectorAll('.prod-card').forEach(card => { card.addEventListener('click', () => openModal(card.dataset)); });
    syncProductQtyControls();
  }

  function renderProductsFromSheet(products){
    const grid = document.getElementById('productGrid');
    if(!grid) return;
    grid.innerHTML = '';
    globalProductsList = products;

    products.forEach((p, idx) => {
      const pricing = getEffectiveProductPricing(p);
      const nameAr = escapeHTML(p.nameAr), nameEn = escapeHTML(p.nameEn);
      const price = escapeHTML(pricing.priceText);
      const oldPrice = escapeHTML(pricing.oldPriceText);
      const discount = escapeHTML(pricing.discount);
      const discountEndDate = escapeHTML(p.discountEndDate || '');
      const originalPriceBeforeDiscount = escapeHTML(p.originalPriceBeforeDiscount || p.oldPrice || '');
      const emoji = svgIcon('bag');
      const img = escapeHTML(p.img), categoryAr = escapeHTML(p.categoryAr), categoryEn = escapeHTML(p.categoryEn);
      const descAr = escapeHTML(p.descAr), descEn = escapeHTML(p.descEn);
      const badgeAr = escapeHTML(p.badgeAr), badgeEn = escapeHTML(p.badgeEn);
      const ratingVal = p.rating ? Math.round(Number(p.rating)) : 0;
      const rawQuantity = (p.quantity !== undefined && p.quantity !== null) ? String(p.quantity).trim() : '';
      const quantity = rawQuantity === '' ? '' : Math.max(0, parseInt(rawQuantity) || 0);
      const available = (quantity !== '' && quantity <= 0) ? 'no' : escapeHTML(p.available || 'yes').toLowerCase();
      const images = Array.isArray(p.images) ? p.images.map(i => escapeHTML(i)) : (img ? [img] : []);

      const card = document.createElement('div');
      card.className = 'prod-card';
      card.dataset.index = idx;
      card.dataset.nameAr = nameAr;
      card.dataset.nameEn = nameEn;
      card.dataset.price = price;
      card.dataset.rawPrice = escapeHTML(p.price || '');
      card.dataset.oldPrice = oldPrice;
      card.dataset.rawOldPrice = escapeHTML(p.oldPrice || '');
      card.dataset.originalPriceBeforeDiscount = originalPriceBeforeDiscount;
      card.dataset.discount = discount;
      card.dataset.discountEndDate = discountEndDate;
      card.dataset.discountActive = pricing.isActiveDiscount ? 'yes' : 'no';
      card.dataset.emoji = emoji;
      card.dataset.img = img;
      card.dataset.categoryAr = categoryAr;
      card.dataset.categoryEn = categoryEn;
      card.dataset.descAr = descAr;
      card.dataset.descEn = descEn;
      card.dataset.available = available;
      card.dataset.rating = ratingVal > 0 ? ratingVal : '';
      card.dataset.quantity = quantity;
      card.dataset.images = JSON.stringify(images);

      let badgeHtml = '';
      if(pricing.isActiveDiscount && discount){
        badgeHtml = `<div class="prod-badge">${discount}</div>`;
      }else if(currentLang === 'ar' && badgeAr){
        badgeHtml = `<div class="prod-badge">${badgeAr}</div>`;
      }else if(currentLang === 'en' && badgeEn){
        badgeHtml = `<div class="prod-badge">${badgeEn}</div>`;
      }

      let stockOverlayHtml = '';
      if(available === 'no'){
        const textLabel = currentLang === 'ar' ? T.ar.outOfStock : T.en.outOfStock;
        stockOverlayHtml = `<div class="out-of-stock-badge"><span class="out-of-stock-text">${textLabel}</span></div>`;
      }

      let quantityBadgeHtml = '';
      if(quantity !== '' && quantity > 0 && quantity <= 5){
        quantityBadgeHtml = `<div class="prod-quantity-badge" style="position:absolute;top:50%;right:50%;transform:translate(50%,-50%);background:rgba(255,255,255,0.95);padding:4px 8px;border-radius:6px;font-size:0.75rem;font-weight:700;color:var(--clay);">${currentLang === 'ar' ? 'متبقي: ' + quantity : 'Only ' + quantity + ' left'}</div>`;
      }

      let priceDisplayHtml = `<span class="price">${price} ${T[currentLang].currency}</span>`;
      if(pricing.isActiveDiscount && oldPrice){
        priceDisplayHtml = `<div><span class="price">${price} ${T[currentLang].currency}</span><span class="price-old">${oldPrice} ${T[currentLang].currency}</span>${discountEndDate ? `<span class="discount-expiry-note">${formatDiscountEndLabel(discountEndDate)}</span>` : ''}</div>`;
      }

      let ratingStarsHtml = '';
      if(ratingVal >= 1 && ratingVal <= 5){
        ratingStarsHtml = `<div class="prod-rating">${'★'.repeat(ratingVal)}${'☆'.repeat(5-ratingVal)}</div>`;
      }

      card.innerHTML = `
        ${badgeHtml}${stockOverlayHtml}${quantityBadgeHtml}
        <button class="prod-wishlist-btn" aria-label="أضف للمفضلة">${svgIcon('heart')}</button>
        <div class="prod-thumb" style="background:var(--sand);">
          <img src="${img}" alt="" class="prod-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <span class="prod-emoji-fallback">${emoji}</span>
          <button type="button" class="prod-zoom-btn" aria-label="تكبير صورة المنتج">${svgIcon('search')}</button>
        </div>
        <div class="prod-body">
          <p class="prod-cat" data-ar="${categoryAr}" data-en="${categoryEn}">${currentLang === 'ar' ? categoryAr : categoryEn}</p>
          <h4 data-ar="${nameAr}" data-en="${nameEn}">${currentLang === 'ar' ? nameAr : nameEn}</h4>
          ${ratingStarsHtml}
          <div class="prod-foot">${priceDisplayHtml}<div class="prod-card-cart-control"><button class="prod-card-minus" type="button">−</button><span class="prod-card-qty">0</span><button class="add-btn prod-card-plus" type="button" aria-label="أضف للسلة" ${available === 'no' ? 'disabled' : ''}>+</button></div></div>
        </div>
      `;
      grid.appendChild(card);
    });

    bindProductCardEvents();
    syncWishlistHearts();
    filterProducts();
  }

  // ===== إصلاح GitHub API (استخدام jsDelivr) =====
  async function loadDataFromGitHub() {
    try {
      const pRes = await fetch(`https://cdn.jsdelivr.net/gh/${OWNER}/${REPO}@${BRANCH}/${PRODUCTS_PATH}?_cb=${Date.now()}`);
      if(pRes.ok) {
        const products = await pRes.json();
        if(Array.isArray(products)) renderProductsFromSheet(products);
      }
      const cRes = await fetch(`https://cdn.jsdelivr.net/gh/${OWNER}/${REPO}@${BRANCH}/${COUPONS_PATH}?_cb=${Date.now()}`);
      if(cRes.ok) {
        const couponsText = await cRes.text();
        localStorage.setItem('albostan_coupons', couponsText);
      }
    } catch(e) {
      console.warn('Failed to load data from CDN', e);
    }
  }

  async function loadProductsFromSheet(){
    try{
      const res = await fetch(PRODUCTS_JSON_URL + `?_cb=${new Date().getTime()}`);
      if(res.ok){
        const products = await res.json();
        if(Array.isArray(products) && products.length > 0){
          renderProductsFromSheet(products);
          return;
        }
      }
      const sheetRes = await fetch(SHEET_CSV_URL + `&_cb=${new Date().getTime()}`);
      if(!sheetRes.ok){ renderProductsFromSheet(fallbackProducts); return; }
      const text = await sheetRes.text();
      const rows = parseCSV(text).filter(r => r.length > 1 && r.some(c => c.trim() !== ''));
      if(rows.length < 2){ renderProductsFromSheet(fallbackProducts); return; }
      const headers = rows[0].map(h => h.trim());
      const products = rows.slice(1).map(r => { const obj = {}; headers.forEach((h, idx) => { obj[h] = (r[idx]||'').trim(); }); return obj; }).filter(p => p.nameAr || p.nameEn);
      if(products.length > 0) renderProductsFromSheet(products);
      else renderProductsFromSheet(fallbackProducts);
    }catch(err){ 
      console.warn('Products unavailable, using fallback', err); 
      renderProductsFromSheet(fallbackProducts); 
    }
  }

  function removeSkeletons(){
    const grid = document.getElementById('productGrid');
    if(grid) grid.querySelectorAll('.skeleton-card').forEach(s => s.remove());
    bindProductCardEvents();
    syncWishlistHearts();
    filterProducts();
  }

  function trackGAEvent(eventName, params = {}){
    if(typeof gtag === 'function') gtag('event', eventName, params);
  }

  // ===== PWA =====
  let deferredInstallPrompt = null;
  const installBtn = document.getElementById('installBtn');
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstallPrompt = e; if(installBtn) installBtn.style.display = 'flex'; });
  if(installBtn){ installBtn.addEventListener('click', async () => { if(!deferredInstallPrompt) return; deferredInstallPrompt.prompt(); const choice = await deferredInstallPrompt.userChoice; trackGAEvent('pwa_install_prompt', { outcome: choice.outcome }); deferredInstallPrompt = null; installBtn.style.display = 'none'; }); }
  window.addEventListener('appinstalled', () => { if(installBtn) installBtn.style.display = 'none'; trackGAEvent('pwa_installed'); });
  if('serviceWorker' in navigator){ window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW registration skipped', err)); }); }

  // ===== إخفاء قسم تحميل التطبيق داخل تطبيق الأندرويد =====
  (function hideDownloadAppInAndroid(){
    var isInsideApp = false;
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('source') === 'android_app' || urlParams.get('app') === '1'){
      isInsideApp = true;
    }
    if(window.matchMedia('(display-mode: standalone)').matches){
      isInsideApp = true;
    }
    if(window.navigator.standalone === true){
      isInsideApp = true;
    }
    if(isInsideApp){
      var elements = document.querySelectorAll('.hide-in-app');
      for(var i = 0; i < elements.length; i++){
        elements[i].style.display = 'none';
      }
    }
  })();

  // ===== تهيئة أولية =====
  bindProductCardEvents();
  renderCart();
  renderWishlist();
  renderLastOrderBox();
  loadDataFromGitHub();

  // ===== HERO VIDEO LOGIC =====
  (function() {
    const video = document.getElementById('heroVideo');
    const fallbackImg = document.querySelector('.hero-banner-img');
    
    if (video) {
      video.addEventListener('canplaythrough', () => {
        video.style.display = 'block';
        if (fallbackImg) fallbackImg.style.display = 'none';
        video.play().catch(e => console.warn("Video autoplay failed", e));
      });
      
      video.addEventListener('error', () => {
        video.style.display = 'none';
        if (fallbackImg) fallbackImg.style.display = 'block';
      });
      
      fetch(video.querySelector('source').src, { method: 'HEAD' })
        .then(res => {
          if (!res.ok) throw new Error("Video not found");
        })
        .catch(() => {
          video.style.display = 'none';
          if (fallbackImg) fallbackImg.style.display = 'block';
        });
    }
  })();
  // ===== END HERO VIDEO =====
  // ===== تفاعلات عصرية (Fly to Cart & Ripple) =====

  // 1. تأثير الموجة (Ripple Effect) للأزرار
  document.addEventListener('click', function(e) {
    const target = e.target.closest('.btn-primary, .download-app-btn, .filter-btn.active');
    if (!target) return;

    const circle = document.createElement('span');
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - target.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - target.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    // إزالة أي موجات قديمة
    const existingRipple = target.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();

    target.appendChild(circle);

    // تنظيف بعد انتهاء الأنيميشن
    setTimeout(() => circle.remove(), 600);
  });

  // 2. تأثير الطيران إلى السلة واهتزاز الأيقونة
  function flyToCart(productCard) {
    if (window.innerWidth < 680) return; // تجاهل التأثير على الجوال للأداء
    
    const cartBtn = document.getElementById('cartBtn');
    const img = productCard.querySelector('.prod-img');
    
    if (!cartBtn || !img || img.style.display === 'none') return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();

    const flyingImg = document.createElement('img');
    flyingImg.src = img.src;
    flyingImg.classList.add('fly-img');
    
    // تحديد نقطة البداية (مكان الصورة)
    flyingImg.style.top = `${imgRect.top}px`;
    flyingImg.style.left = `${imgRect.left}px`;
    flyingImg.style.width = `${imgRect.width}px`;
    flyingImg.style.height = `${imgRect.height}px`;
    
    document.body.appendChild(flyingImg);

    // إجبار المتصفح على رسم الصورة قبل تحريكها
    flyingImg.offsetWidth;

    // تحديد نقطة النهاية (مكان السلة) وتصغير الصورة
    flyingImg.style.top = `${cartRect.top + cartRect.height / 2}px`;
    flyingImg.style.left = `${cartRect.left + cartRect.width / 2}px`;
    flyingImg.style.width = '20px';
    flyingImg.style.height = '20px';
    flyingImg.style.opacity = '0.5';
    flyingImg.style.transform = 'rotate(360deg)';

    // اهتزاز السلة وإنهاء التأثير
    setTimeout(() => {
      flyingImg.remove();
      cartBtn.classList.add('bump');
      setTimeout(() => cartBtn.classList.remove('bump'), 500);
    }, 800);
  }

  // 3. ربط التأثير بزر الإضافة في بطاقة المنتج
  // تعديل بسيط لدالة bindProductCardEvents لاستدعاء التأثير
  const originalAddToCart = window.addToCart;
  window.addToCart = function(productData, customQty = 1) {
    const result = originalAddToCart(productData, customQty);
    if (result) {
      // إيجاد البطاقة التي تم الضغط عليها لتطبيق التأثير
      const cards = document.querySelectorAll('.prod-card');
      cards.forEach(card => {
        if (card.dataset.nameAr === productData.nameAr) {
          flyToCart(card);
        }
      });
    }
    return result;
  };

  // 4. تأثير 3D خفيف لبطاقات المنتجات عند تحريك الماوس (للأجهزة المكتبية)
  if (window.innerWidth > 1024) {
    document.addEventListener('mousemove', function(e) {
      const card = e.target.closest('.prod-card');
      if (!card || card.classList.contains('is-tilting')) return;

      // تفعيل التأثير فقط إذا كان الماوس فوق البطاقة بالفعل
      if (card.matches(':hover')) {
        card.classList.add('is-tilting');
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      }
    }, { passive: true });

    // إعادة البطاقة لوضعها الطبيعي عند مغادرة الماوس
    document.addEventListener('mouseout', function(e) {
      const card = e.target.closest('.prod-card');
      if (card && !card.matches(':hover')) {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      }
    }, { passive: true });
  }
