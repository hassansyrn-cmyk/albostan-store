const OWNER = 'hassansyrn-cmyk';
const REPO = 'albostan-store';
const BRANCH = 'main';
const ORDERS_PATH = 'orders.json';

function allowCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function jsonResponse(res, statusCode, data) {
  allowCors(res);
  res.status(statusCode).json(data);
}

function decodeBase64Utf8(base64Text) {
  return Buffer.from(String(base64Text || '').replace(/\n/g, ''), 'base64').toString('utf8');
}

function cleanText(value, maxLength = 300) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizePhone(value) {
  return String(value || '')
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .replace(/\+/g, '')
    .replace(/[()]/g, '')
    .trim();
}

function phonesMatch(a, b) {
  const phoneA = normalizePhone(a);
  const phoneB = normalizePhone(b);

  if (!phoneA || !phoneB) return false;

  if (phoneA === phoneB) return true;

  const lastA = phoneA.slice(-9);
  const lastB = phoneB.slice(-9);

  return lastA && lastB && lastA === lastB;
}

function orderIdMatches(a, b) {
  return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
}

function safeOrderForCustomer(order) {
  const customer = order.customer || {};

  return {
    id: order.id || '',
    createdAt: order.createdAt || '',
    updatedAt: order.updatedAt || '',
    status: order.status || 'pending',
    paymentStatus: order.paymentStatus || 'cod_pending',
    paymentMethod: order.paymentMethod || 'COD',
    customer: {
      name: customer.name || '',
      phone: customer.phone || '',
      emirate: customer.emirate || '',
      address: customer.address || '',
      notes: customer.notes || ''
    },
    items: Array.isArray(order.items) ? order.items.map(function(item) {
      const qty = Number(item.qty || item.quantity || 1);
      const price = Number(item.price || 0);
      const total = Number(item.total || (price * qty));

      return {
        id: item.id || '',
        nameAr: item.nameAr || '',
        nameEn: item.nameEn || '',
        categoryAr: item.categoryAr || '',
        categoryEn: item.categoryEn || '',
        price: price,
        qty: qty,
        total: Number(total.toFixed ? total.toFixed(2) : total),
        img: item.img || '',
        emoji: item.emoji || ''
      };
    }) : [],
    coupon: {
      code: order.coupon && order.coupon.code ? order.coupon.code : '',
      discount: order.coupon && order.coupon.discount ? Number(order.coupon.discount) : 0
    },
    subtotal: Number(order.subtotal || 0),
    deliveryFee: Number(order.deliveryFee || 0),
    discountAmount: Number(order.discountAmount || 0),
    grandTotal: Number(order.grandTotal || 0)
  };
}

async function getOrdersFile(token) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${ORDERS_PATH}?ref=${BRANCH}&_cb=${Date.now()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'AlBostan-Customer-Order-API'
    }
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to read orders file: ${response.status} ${text}`);
  }

  const data = await response.json();

  try {
    const decoded = decodeBase64Utf8(data.content);
    const parsed = JSON.parse(decoded);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

module.exports = async function handler(req, res) {
  allowCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return jsonResponse(res, 405, {
      ok: false,
      message: 'Method not allowed'
    });
  }

  try {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return jsonResponse(res, 500, {
        ok: false,
        message: 'Missing GITHUB_TOKEN environment variable'
      });
    }

    const orderId = cleanText(req.body && req.body.orderId, 120);
    const phone = cleanText(req.body && req.body.phone, 80);

    if (!orderId || !phone) {
      return jsonResponse(res, 400, {
        ok: false,
        message: 'Order ID and phone are required'
      });
    }

    const orders = await getOrdersFile(token);

    const foundOrder = orders.find(function(order) {
      const customer = order.customer || {};
      return orderIdMatches(order.id, orderId) && phonesMatch(customer.phone, phone);
    });

    if (!foundOrder) {
      return jsonResponse(res, 404, {
        ok: false,
        message: 'Order not found. Please check the order number and phone number.'
      });
    }

    return jsonResponse(res, 200, {
      ok: true,
      message: 'Order found',
      order: safeOrderForCustomer(foundOrder)
    });

  } catch (error) {
    return jsonResponse(res, 500, {
      ok: false,
      message: 'Failed to retrieve order',
      error: error.message
    });
  }
};

