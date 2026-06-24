alert('admin.js loaded');

let categoriesData = [];
let productsData = [];

// ===============================
// AUTH
// ===============================
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'flex';
        loadDashboardData();
    } else {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
    }
});

// ===============================
// LOGIN
// ===============================
async function login() {
    alert('تم الضغط على زر الدخول');

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');

    if (!email || !password) {
        alert('أدخل البيانات');
        return;
    }

    if (typeof supabase === 'undefined') {
        alert('Supabase غير محمل');
        return;
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        errorMsg.textContent = error.message;
        errorMsg.style.display = 'block';
    }
}

// ===============================
// LOGOUT
// ===============================
async function logout() {
    await supabase.auth.signOut();
}

// ===============================
// NAVIGATION
// ===============================
function showSection(sectionId, btn) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(sectionId + 'Section').classList.add('active');
    if (btn) btn.classList.add('active');

    if (sectionId === 'categories') fetchCategories();
    if (sectionId === 'products') fetchProducts();
}

// ===============================
// MODALS
// ===============================
function openModal(id) {
    document.getElementById(id).classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');

    document.querySelectorAll(`#${id} input, #${id} textarea`).forEach(el => {
        if (el.type !== 'file') el.value = '';
        else el.value = null;
    });
}

// ===============================
// DASHBOARD
// ===============================
async function loadDashboardData() {
    const { count: prodCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    const { count: availCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('available', 'yes');

    document.getElementById('statTotalProducts').innerText = prodCount || 0;
    document.getElementById('statAvailableProducts').innerText = availCount || 0;

    fetchCategories();
}

// ===============================
// CATEGORIES
// ===============================
async function fetchCategories() {
    const { data } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

    categoriesData = data || [];

    const tbody = document.getElementById('categoriesTableBody');
    const select = document.getElementById('prodCategory');

    tbody.innerHTML = '';
    select.innerHTML = '<option value="">اختر القسم</option>';

    categoriesData.forEach(cat => {
        tbody.innerHTML += `
            <tr>
                <td>${cat.emoji || '📁'}</td>
                <td>${cat.name_ar}</td>
                <td>${cat.name_en}</td>
                <td>
                    <button class="btn-danger" onclick="deleteCategory('${cat.id}')">حذف</button>
                </td>
            </tr>
        `;

        select.innerHTML += `
            <option value="${cat.id}" data-ar="${cat.name_ar}" data-en="${cat.name_en}">
                ${cat.name_ar}
            </option>
        `;
    });
}

async function saveCategory() {
    const nameAr = document.getElementById('catNameAr').value;
    const nameEn = document.getElementById('catNameEn').value;
    const emoji = document.getElementById('catEmoji').value;

    if (!nameAr || !nameEn) return;

    await supabase.from('categories').insert([{
        name_ar: nameAr,
        name_en: nameEn,
        emoji
    }]);

    closeModal('categoryModal');
    fetchCategories();
}

async function deleteCategory(id) {
    if (!confirm('حذف؟')) return;

    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
}

// ===============================
// PRODUCTS
// ===============================
async function fetchProducts() {
    const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    productsData = data || [];

    const tbody = document.getElementById('productsTableBody');
    let html = '';

    productsData.forEach(prod => {
        const media = prod.image_url
            ? `<img src="${prod.image_url}" style="width:40px;height:40px;border-radius:8px;">`
            : (prod.emoji || '📦');

        html += `
            <tr>
                <td>${media}</td>
                <td>${prod.name_ar}</td>
                <td>${prod.category_ar || '-'}</td>
                <td>${prod.price}</td>
                <td>${prod.available === 'yes' ? 'متوفر' : 'غير متوفر'}</td>
                <td>
                    <button class="btn-danger" onclick="deleteProduct('${prod.id}')">حذف</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

async function saveProduct() {
    const nameAr = document.getElementById('prodNameAr').value;
    const nameEn = document.getElementById('prodNameEn').value;
    const price = document.getElementById('prodPrice').value;
    const cat = document.getElementById('prodCategory');

    if (!nameAr || !nameEn || !price || !cat.value) return;

    const option = cat.options[cat.selectedIndex];

    let imageUrl = null;
    const file = document.getElementById('prodImageFile').files[0];

    if (file) {
        const fileName = Date.now() + '_' + file.name;

        await supabase.storage
            .from('product-images')
            .upload(fileName, file);

        const { data } = supabase
            .storage
            .from('product-images')
            .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
    }

    await supabase.from('products').insert([{
        name_ar: nameAr,
        name_en: nameEn,
        price,
        category_id: cat.value,
        category_ar: option.getAttribute('data-ar'),
        category_en: option.getAttribute('data-en'),
        available: document.getElementById('prodAvailable').value,
        emoji: document.getElementById('prodEmoji').value,
        image_url: imageUrl
    }]);

    closeModal('productModal');
    fetchProducts();
    loadDashboardData();
}

async function deleteProduct(id) {
    if (!confirm('حذف؟')) return;

    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
    loadDashboardData();
}
