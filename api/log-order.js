// api/log-order.js - نسخة مؤقتة بالتوكن مباشرة
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId, orderDate, items, customer, totals } = req.body;
  
  // مؤقت: التوكن مدمج مباشرة (غيّره لاحقاً لـ env)
  const GITHUB_TOKEN = "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";
  const OWNER = 'hassansyrn-cmyk';
  const REPO = 'albostan-store';
  const BRANCH = 'main';

  const headers = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'AlBostan-Store'
  };

  try {
    // 1. جلب المنتجات
    const prodRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/products.json?ref=${BRANCH}`, { headers });
    if (!prodRes.ok) throw new Error('Failed to fetch products');
    const prodData = await prodRes.json();
    const products = JSON.parse(Buffer.from(prodData.content, 'base64').toString('utf-8'));
    const prodSha = prodData.sha;

    // 2. خصم الكميات
    items.forEach(item => {
      const p = products.find(pr => pr.nameAr === item.nameAr);
      if (p) {
        const currentQty = parseInt(p.quantity) || 0;
        p.quantity = Math.max(0, currentQty - item.quantity);
      }
    });

    // 3. حفظ المنتجات
    await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/products.json`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Auto-update stock for order ${orderId}`,
        content: Buffer.from(JSON.stringify(products, null, 2)).toString('base64'),
        sha: prodSha,
        branch: BRANCH
      })
    });

    // 4. جلب المبيعات
    let sales = [];
    let salesSha = null;
    const salesRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/sales_data.json?ref=${BRANCH}`, { headers });
    if (salesRes.ok) {
      const salesData = await salesRes.json();
      sales = JSON.parse(Buffer.from(salesData.content, 'base64').toString('utf-8'));
      salesSha = salesData.sha;
    }

    // 5. إضافة المبيعات
    items.forEach(item => {
      const p = products.find(pr => pr.nameAr === item.nameAr);
      const cost = parseFloat(p?.cost || 0);
      const price = parseFloat(item.price);
      const profit = (price - cost) * item.quantity;
      
      sales.push({
        id: Date.now() + Math.random(),
        orderId,
        productName: item.nameAr,
        productNameEn: item.nameEn,
        qty: item.quantity,
        price: price,
        total: (price * item.quantity).toFixed(2),
        profit: profit.toFixed(2),
        date: orderDate.iso,
        customerPhone: customer.phone,
        customerName: customer.name,
        emirate: customer.emirate
      });
    });

    // 6. حفظ المبيعات
    await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/sales_data.json`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Auto-log sale for order ${orderId}`,
        content: Buffer.from(JSON.stringify(sales, null, 2)).toString('base64'),
        sha: salesSha,
        branch: BRANCH
      })
    });

    res.status(200).json({ success: true, orderId });
  } catch (e) {
    console.error('log-order error:', e);
    res.status(500).json({ error: e.message });
  }
}
