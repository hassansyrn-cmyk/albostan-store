// ملف: admin.js

// المتغيرات العالمية (لتخزين البيانات مؤقتاً في الصفحة)
let categoriesData = [];
let productsData = [];

// ==========================================
// 1. نظام تسجيل الدخول (Authentication)
// ==========================================

// التحقق من حالة المستخدم عند فتح الصفحة
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        // المستخدم مسجل دخول
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'flex';
        loadDashboardData(); // تحميل البيانات
    } else {
        // المستخدم غير مسجل
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
    }
});

// دالة تسجيل الدخول
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        errorMsg.textContent = 'خطأ في البريد أو كلمة المرور';
        errorMsg.style.display = 'block';
    }
}

// دالة تسجيل الخروج
async function logout() {
    await supabase.auth.signOut();
}

// ==========================================
// 2. التنقل في لوحة التحكم
// ==========================================
function showSection(sectionId) {
    // إخفاء كل الأقسام
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    // إزالة اللون من كل الأزرار
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // إظهار القسم المطلوب
    document.getElementById(sectionId + 'Section').classList.add('active');
    event.currentTarget.classList.add('active');

    if(sectionId === 'categories') fetchCategories();
    if(sectionId === 'products') fetchProducts();
}

// نوافذ Modal
function openModal(modalId) {
    document.getElementById(modalId).classList.add('open');
}
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
    // تنظيف الحقول
    const inputs = document.getElementById(modalId).querySelectorAll('input, textarea');
    inputs.forEach(input => { if(input.type !== 'file') input.value = ''; else input.value = null; });
}

// ==========================================
// 3. الإحصائيات (Dashboard)
// ==========================================
async function loadDashboardData() {
    // جلب عدد المنتجات
    const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: availCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('available', 'yes');
    
    document.getElementById('statTotalProducts').innerText = prodCount || 0;
    document.getElementById('statAvailableProducts').innerText = availCount || 0;
    
    // جلب الأقسام مبكراً لاستخدامها في قائمة المنتجات
    fetchCategories();
}

// ==========================================
// 4. إدارة الأقسام (Categories)
// ==========================================
async function fetchCategories() {
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
    if(error) return alert('خطأ في جلب الأقسام');
    
    categoriesData = data;
    const tbody = document.getElementById('categoriesTableBody');
    const select = document.getElementById('prodCategory');
    
    tbody.innerHTML = '';
    select.innerHTML = '<option value="">اختر القسم</option>';

    data.forEach(cat => {
        // إضافة للجدول
        tbody.innerHTML += `
            <tr>
                <td style="font-size: 1.5rem;">${cat.emoji || '📁'}</td>
                <td>${cat.name_ar}</td>
                <td>${cat.name_en}</td>
                <td>
                    <button class="btn-danger" onclick="deleteCategory('${cat.id}')">حذف</button>
                </td>
            </tr>
        `;
        // إضافة لقائمة اختيار القسم في إضافة منتج
        select.innerHTML += `<option value="${cat.id}" data-ar="${cat.name_ar}" data-en="${cat.name_en}">${cat.name_ar}</option>`;
    });
}

async function saveCategory() {
    const nameAr = document.getElementById('catNameAr').value;
    const nameEn = document.getElementById('catNameEn').value;
    const emoji = document.getElementById('catEmoji').value;

    if(!nameAr || !nameEn) return alert('يرجى كتابة الاسم بالعربي والإنجليزي');

    const { error } = await supabase.from('categories').insert([{ name_ar: nameAr, name_en: nameEn, emoji: emoji }]);
    
    if(error) alert('حدث خطأ أثناء الحفظ');
    else {
        closeModal('categoryModal');
        fetchCategories();
    }
}

async function deleteCategory(id) {
    if(!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
}

// ==========================================
// 5. إدارة المنتجات والصور (Products & Storage)
// ==========================================
async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if(error) return alert('خطأ في جلب المنتجات');
    
    productsData = data;
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    data.forEach(prod => {
        let mediaHtml = prod.image_url 
            ? `<img src="${prod.image_url}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">` 
            : `<span style="font-size: 1.5rem;">${prod.emoji || '📦'}</span>`;

        let statusText = prod.available === 'yes' ? '<span style="color:green;">متوفر</span>' : '<span style="color:red;">غير متوفر</span>';

        tbody.innerHTML += `
            <tr>
                <td>${mediaHtml}</td>
                <td>${prod.name_ar}</td>
                <td>${prod.category_ar || '-'}</td>
                <td>${prod.price} د.إ</td>
                <td>${statusText}</td>
                <td>
                    <button class="btn-danger" onclick="deleteProduct('${prod.id}')">حذف</button>
                </td>
            </tr>
        `;
    });
}

async function saveProduct() {
    const btn = document.getElementById('saveProdBtn');
    btn.textContent = 'جاري الحفظ...';
    btn.disabled = true;

    try {
        const nameAr = document.getElementById('prodNameAr').value;
        const nameEn = document.getElementById('prodNameEn').value;
        const price = document.getElementById('prodPrice').value;
        const oldPrice = document.getElementById('prodOldPrice').value;
        const catSelect = document.getElementById('prodCategory');
        const categoryId = catSelect.value;
        const available = document.getElementById('prodAvailable').value;
        const emoji = document.getElementById('prodEmoji').value;
        const fileInput = document.getElementById('prodImageFile');

        if(!nameAr || !nameEn || !price || !categoryId) {
            alert('يرجى ملء الحقول الأساسية (الاسم، السعر، القسم)');
            btn.textContent = 'حفظ المنتج'; btn.disabled = false; return;
        }

        // استخراج بيانات القسم لتخزينها مع المنتج لسهولة العرض
        const selectedCatOption = catSelect.options[catSelect.selectedIndex];
        const categoryAr = selectedCatOption.getAttribute('data-ar');
        const categoryEn = selectedCatOption.getAttribute('data-en');

        let imageUrl = null;

        // 🟢 رفع الصورة إذا قام باختيار ملف
        if(fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            
            // رفع الصورة للباكيت
            const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
            
            if(uploadError) throw new Error('فشل رفع الصورة');
            
            // استخراج الرابط العام للصورة
            const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
            imageUrl = publicUrlData.publicUrl;
        }

        // تجهيز بيانات المنتج
        const productData = {
            name_ar: nameAr,
            name_en: nameEn,
            price: price,
            old_price: oldPrice || null,
            category_id: categoryId,
            category_ar: categoryAr,
            category_en: categoryEn,
            available: available,
            emoji: emoji || null,
            image_url: imageUrl,
            description_ar: document.getElementById('prodDescAr').value,
            description_en: document.getElementById('prodDescEn').value,
            badge_ar: document.getElementById('prodBadge').value,
            badge_en: document.getElementById('prodBadge').value,
            rating: document.getElementById('prodRating').value || null
        };

        // حفظ في قاعدة البيانات
        const { error } = await supabase.from('products').insert([productData]);
        if(error) throw error;

        closeModal('productModal');
        fetchProducts();
        loadDashboardData(); // لتحديث العدادات

    } catch (error) {
        alert(error.message || 'حدث خطأ غير متوقع');
    } finally {
        btn.textContent = 'حفظ المنتج';
        btn.disabled = false;
    }
}

async function deleteProduct(id) {
    if(!confirm('هل أنت متأكد من حذف المنتج؟')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
    loadDashboardData();
}
