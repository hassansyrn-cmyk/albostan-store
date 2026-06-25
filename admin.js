// ملف: admin.js (محسّن وآمن)

// المتغيرات العالمية
let categoriesData = [];
let productsData = [];
let couponsData = [];
let currentUser = null;

// ==========================================
// 1. نظام تسجيل الدخول (Authentication)
// ==========================================

// التحقق من حالة المستخدم عند فتح الصفحة
async function initializeAuth() {
    try {
        // التحقق من الجلسة الحالية
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            currentUser = session.user;
            showAdminPanel();
            loadDashboardData();
        } else {
            showLoginScreen();
        }
    } catch (error) {
        console.error('خطأ في التحقق من الجلسة:', error);
        showLoginScreen();
    }
}

// مراقبة تغييرات حالة المستخدم
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        currentUser = session.user;
        showAdminPanel();
        loadDashboardData();
    } else {
        currentUser = null;
        showLoginScreen();
    }
});

// دالة تسجيل الدخول
async function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');

    // التحقق من عدم ترك الحقول فارغة
    if (!email || !password) {
        errorMsg.textContent = '⚠️ يرجى ملء البريد الإلكتروني وكلمة المرور';
        errorMsg.style.display = 'block';
        return;
    }

    try {
        loginBtn.disabled = true;
        loginBtn.textContent = 'جاري الدخول...';
        errorMsg.style.display = 'none';

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            throw error;
        }

        // تم تسجيل الدخول بنجاح
        console.log('✅ تم تسجيل الدخول بنجاح');
        
    } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error);
        
        if (error.message.includes('Invalid login credentials')) {
            errorMsg.textContent = '❌ البريد الإلكتروني أو كلمة المرور غير صحيحة';
        } else if (error.message.includes('Email not confirmed')) {
            errorMsg.textContent = '⚠️ يرجى تأكيد بريدك الإلكتروني أولاً';
        } else {
            errorMsg.textContent = `❌ خطأ: ${error.message}`;
        }
        
        errorMsg.style.display = 'block';
        
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'دخول';
    }
}

// دالة تسجيل الخروج
async function logout() {
    try {
        await supabase.auth.signOut();
        currentUser = null;
        showLoginScreen();
    } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error);
        alert('حدث خطأ أثناء تسجيل الخروج');
    }
}

// دوال عرض/إخفاء الشاشات
function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
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
    const section = document.getElementById(sectionId + 'Section');
    if (section) {
        section.classList.add('active');
    }
    
    // تحديد الزر النشط
    event.currentTarget.classList.add('active');

    // تحميل البيانات المطلوبة
    if(sectionId === 'categories') fetchCategories();
    if(sectionId === 'products') fetchProducts();
    if(sectionId === 'coupons') fetchCoupons();
}

// نوافذ Modal
function openModal(modalId) {
    document.getElementById(modalId).classList.add('open');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
    // تنظيف الحقول
    const modal = document.getElementById(modalId);
    const inputs = modal.querySelectorAll('input, textarea, select');
    inputs.forEach(input => { 
        if(input.type !== 'file') {
            input.value = '';
        } else {
            input.value = null;
        }
    });
}

// ==========================================
// 3. الإحصائيات (Dashboard)
// ==========================================

async function loadDashboardData() {
    try {
        // جلب عدد المنتجات
        const { count: prodCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });
        
        const { count: availCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('available', 'yes');
        
        const { count: catCount } = await supabase
            .from('categories')
            .select('*', { count: 'exact', head: true });
        
        const { count: couponCount } = await supabase
            .from('coupons')
            .select('*', { count: 'exact', head: true });
        
        document.getElementById('statTotalProducts').innerText = prodCount || 0;
        document.getElementById('statAvailableProducts').innerText = availCount || 0;
        document.getElementById('statTotalCategories').innerText = catCount || 0;
        document.getElementById('statTotalCoupons').innerText = couponCount || 0;
        
    } catch (error) {
        console.error('خطأ في تحميل الإحصائيات:', error);
    }
}

// ==========================================
// 4. إدارة الأقسام (Categories)
// ==========================================

async function fetchCategories() {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: true });
        
        if(error) throw error;
        
        categoriesData = data || [];
        const tbody = document.getElementById('categoriesTableBody');
        const select = document.getElementById('prodCategory');
        
        tbody.innerHTML = '';
        select.innerHTML = '<option value="">اختر القسم</option>';

        categoriesData.forEach(cat => {
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
            // إضافة لقائمة اختيار القسم
            select.innerHTML += `<option value="${cat.id}" data-ar="${cat.name_ar}" data-en="${cat.name_en}">${cat.name_ar}</option>`;
        });
    } catch (error) {
        console.error('خطأ في جلب الأقسام:', error);
        alert('حدث خطأ في تحميل الأقسام');
    }
}

async function saveCategory() {
    const nameAr = document.getElementById('catNameAr').value.trim();
    const nameEn = document.getElementById('catNameEn').value.trim();
    const emoji = document.getElementById('catEmoji').value.trim();

    if(!nameAr || !nameEn) {
        alert('⚠️ يرجى كتابة الاسم بالعربي والإنجليزي');
        return;
    }

    try {
        const { error } = await supabase.from('categories').insert([{ 
            name_ar: nameAr, 
            name_en: nameEn, 
            emoji: emoji 
        }]);
        
        if(error) throw error;

        alert('✅ تم إضافة القسم بنجاح');
        closeModal('categoryModal');
        fetchCategories();
        
    } catch (error) {
        console.error('خطأ في حفظ القسم:', error);
        alert('❌ حدث خطأ أثناء الحفظ: ' + error.message);
    }
}

async function deleteCategory(id) {
    if(!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    
    try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if(error) throw error;
        
        alert('✅ تم حذف القسم بنجاح');
        fetchCategories();
    } catch (error) {
        console.error('خطأ في حذف القسم:', error);
        alert('❌ حدث خطأ: ' + error.message);
    }
}

// ==========================================
// 5. إدارة المنتجات والصور (Products & Storage)
// ==========================================

async function fetchProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        
        if(error) throw error;
        
        productsData = data || [];
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';

        productsData.forEach(prod => {
            let mediaHtml = prod.image_url 
                ? `<img src="${prod.image_url}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover; cursor: pointer;" onclick="window.open('${prod.image_url}', '_blank')" title="اضغط لعرض الصورة">` 
                : `<span style="font-size: 1.5rem;">${prod.emoji || '📦'}</span>`;

            let statusText = prod.available === 'yes' 
                ? '<span style="color:green; font-weight: bold;">✓ متوفر</span>' 
                : '<span style="color:red; font-weight: bold;">✗ غير متوفر</span>';

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
    } catch (error) {
        console.error('خطأ في جلب المنتجات:', error);
        alert('حدث خطأ في تحميل المنتجات');
    }
}

async function saveProduct() {
    const btn = document.getElementById('saveProdBtn');
    btn.textContent = 'جاري الحفظ...';
    btn.disabled = true;

    try {
        const nameAr = document.getElementById('prodNameAr').value.trim();
        const nameEn = document.getElementById('prodNameEn').value.trim();
        const price = document.getElementById('prodPrice').value;
        const oldPrice = document.getElementById('prodOldPrice').value;
        const catSelect = document.getElementById('prodCategory');
        const categoryId = catSelect.value;
        const available = document.getElementById('prodAvailable').value;
        const emoji = document.getElementById('prodEmoji').value.trim();
        const fileInput = document.getElementById('prodImageFile');

        if(!nameAr || !nameEn || !price || !categoryId) {
            alert('⚠️ يرجى ملء الحقول الأساسية (الاسم، السعر، القسم)');
            btn.textContent = 'حفظ المنتج'; 
            btn.disabled = false; 
            return;
        }

        // استخراج بيانات القسم
        const selectedCatOption = catSelect.options[catSelect.selectedIndex];
        const categoryAr = selectedCatOption.getAttribute('data-ar');
        const categoryEn = selectedCatOption.getAttribute('data-en');

        let imageUrl = null;

        // رفع الصورة إذا قام المستخدم باختيار ملف
        if(fileInput.files.length > 0) {
            const file = fileInput.files[0];
            
            // التحقق من نوع الملف
            if (!file.type.startsWith('image/')) {
                throw new Error('يرجى اختيار ملف صورة صحيح');
            }
            
            // التحقق من حجم الملف (أقصى 5 MB)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('حجم الصورة كبير جداً (الحد الأقصى 5 MB)');
            }

            const fileExt = file.name.split('.').pop().toLowerCase();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            
            // رفع الصورة للـ Storage
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, file);
            
            if(uploadError) throw new Error('فشل رفع الصورة: ' + uploadError.message);
            
            // استخراج الرابط العام للصورة
            const { data: publicUrlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);
            imageUrl = publicUrlData.publicUrl;
        }

        // تجهيز بيانات المنتج
        const productData = {
            name_ar: nameAr,
            name_en: nameEn,
            price: parseFloat(price),
            old_price: oldPrice ? parseFloat(oldPrice) : null,
            category_id: categoryId,
            category_ar: categoryAr,
            category_en: categoryEn,
            available: available,
            emoji: emoji || null,
            image_url: imageUrl,
            description_ar: document.getElementById('prodDescAr').value.trim(),
            description_en: document.getElementById('prodDescEn').value.trim(),
            badge_ar: document.getElementById('prodBadge').value.trim(),
            badge_en: document.getElementById('prodBadge').value.trim(),
            rating: document.getElementById('prodRating').value || null
        };

        // حفظ في قاعدة البيانات
        const { error } = await supabase.from('products').insert([productData]);
        if(error) throw error;

        alert('✅ تم إضافة المنتج بنجاح');
        closeModal('productModal');
        fetchProducts();
        loadDashboardData();

    } catch (error) {
        console.error('خطأ في حفظ المنتج:', error);
        alert('❌ ' + (error.message || 'حدث خطأ غير متوقع'));
    } finally {
        btn.textContent = 'حفظ المنتج';
        btn.disabled = false;
    }
}

async function deleteProduct(id) {
    if(!confirm('هل أنت متأكد من حذف المنتج؟')) return;
    
    try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if(error) throw error;
        
        alert('✅ تم حذف المنتج بنجاح');
        fetchProducts();
        loadDashboardData();
    } catch (error) {
        console.error('خطأ في حذف المنتج:', error);
        alert('❌ حدث خطأ: ' + error.message);
    }
}

// ==========================================
// 6. إدارة الكوبونات (Coupons)
// ==========================================

async function fetchCoupons() {
    try {
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });
        
        if(error) throw error;
        
        couponsData = data || [];
        const tbody = document.getElementById('couponsTableBody');
        tbody.innerHTML = '';

        couponsData.forEach(coupon => {
            const typeText = coupon.type === 'percentage' ? '%' : 'د.إ';
            const statusText = coupon.status === 'active' 
                ? '<span style="color:green;">✓ نشط</span>' 
                : '<span style="color:red;">✗ غير نشط</span>';

            tbody.innerHTML += `
                <tr>
                    <td><strong>${coupon.code}</strong></td>
                    <td>${coupon.type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}</td>
                    <td>${coupon.value} ${typeText}</td>
                    <td>${statusText}</td>
                    <td>
                        <button class="btn-danger" onclick="deleteCoupon('${coupon.id}')">حذف</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('خطأ في جلب الكوبونات:', error);
        alert('حدث خطأ في تحميل الكوبونات');
    }
}

async function saveCoupon() {
    const code = document.getElementById('couponCode').value.trim().toUpperCase();
    const type = document.getElementById('couponType').value;
    const value = document.getElementById('couponValue').value;
    const maxDiscount = document.getElementById('couponMaxDiscount').value;
    const status = document.getElementById('couponStatus').value;

    if(!code || !value) {
        alert('⚠️ يرجى ملء الحقول المطلوبة');
        return;
    }

    try {
        const { error } = await supabase.from('coupons').insert([{ 
            code: code,
            type: type,
            value: parseFloat(value),
            max_discount: maxDiscount ? parseFloat(maxDiscount) : null,
            status: status
        }]);
        
        if(error) throw error;

        alert('✅ تم إضافة الكوبون بنجاح');
        closeModal('couponModal');
        fetchCoupons();
        loadDashboardData();
        
    } catch (error) {
        console.error('خطأ في حفظ الكوبون:', error);
        alert('❌ حدث خطأ: ' + error.message);
    }
}

async function deleteCoupon(id) {
    if(!confirm('هل أنت متأكد من حذف الكوبون؟')) return;
    
    try {
        const { error } = await supabase.from('coupons').delete().eq('id', id);
        if(error) throw error;
        
        alert('✅ تم حذف الكوبون بنجاح');
        fetchCoupons();
        loadDashboardData();
    } catch (error) {
        console.error('خطأ في حذف الكوبون:', error);
        alert('❌ حدث خطأ: ' + error.message);
    }
}

// ==========================================
// 7. تهيئة التطبيق عند التحميل
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // إضافة مستمع لزر الدخول
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }

    // السماح بالدخول بالضغط على Enter
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    if (loginEmail && loginPassword) {
        loginEmail.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') login();
        });
        loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') login();
        });
    }

    // تهيئة المصادقة
    initializeAuth();
});
