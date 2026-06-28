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

function encodeBase64Utf8(text) {
  return Buffer.from(text, 'utf8').toString('base64');
}

function decodeBase64Utf8(base64Text) {
  return Buffer.from(String(base64Text || '').replace(/\n/g, ''), 'base64').toString('utf8');
}

function makeOrderId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ABS-${y}${m}${d}-${hh}${mm}${ss}-${rand}`;
}

function cleanText(value, maxLength = 500) {
  return String(value || '').trim().slice(0, maxLength);
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function normalizeOrder(input) {
  const customer = input && input.customer ? input.customer : {};
  const itemsInput = Array.isArray(input && input.items) ? input.items : [];

  const items = itemsInput.map(function(item) {
    const qty = Math.max(1, Math.floor(toNumber(item.qty || item.quantity || 1)));
    const price = Math.max(0, toNumber(item.price));
    return {
      id: cleanText(item.id, 120),
      nameAr: cleanText(item.nameAr, 250),
      nameEn: cleanText(item.nameEn, 250),
      categoryAr: cleanText(item.categoryAr, 120),
      categoryEn: cleanText(item.categoryEn, 120),
      price: price,
      qty: qty,
      total: Number((price * qty).toFixed(2)),
      img: cleanText(item.img, 600),
      emoji: cleanText(item.emoji, 20)
    };
  }).filter(function(item) {
    return item.nameAr || item.nameEn;
  });

  const subtotal = Number(items.reduce(function(sum, item) {
    return sum + item.total;
  }, 0).toFixed(2));

  const deliveryFee = Math.max(0, toNumber(input && input.deliveryFee));
  const discountAmount = Math.max(0, toNumber(input && input.discountAmount));
  const grandTotal = Math.max(0, Number((subtotal + deliveryFee - discountAmount).toFixed(2)));

  const nowIso = new Date().toISOString();

  return {
    id: cleanText(input && input.id, 80) || makeOrderId(),
    createdAt: nowIso,
    updatedAt: nowIso,
    status: 'pending',
    paymentStatus: 'cod_pending',
    paymentMethod: 'COD',
    source: 'website',
    whatsappSent: false,
    customer: {
      name: cleanText(customer.name, 160),
      phone: cleanText(customer.phone, 80),
      emirate: cleanText(customer.emirate, 120),
      address: cleanText(customer.address, 500),
      notes: cleanText(customer.notes, 500)
    },
    items: items,
    coupon: {
      code: cleanText(input && input.coupon && input.coupon.code, 80),
      discount: Math.max(0, toNumber(input && input.coupon && input.coupon.discount))
    },
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    discountAmount: discountAmount,
    grandTotal: grandTotal
  };
}

async function getOrdersFile(token) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${ORDERS_PATH}?ref=${BRANCH}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'AlBostan-Orders-API'
    }
  });

  if (response.status === 404) {
    return {
      sha: null,
      orders: []
    };
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to read orders file: ${response.status} ${text}`);
  }

  const data = await response.json();
  let orders = [];

  try {
    const decoded = decodeBase64Utf8(data.content);
    const parsed = JSON.parse(decoded);
    orders = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    orders = [];
  }

  return {
    sha: data.sha,
    orders: orders
  };
}

async function saveOrdersFile(token, orders, sha) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${ORDERS_PATH}`;
  const content = JSON.stringify(orders, null, 2);

  const body = {
    message: 'Add new customer order',
    content: encodeBase64Utf8(content),
    branch: BRANCH
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'AlBostan-Orders-API'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to save orders file: ${response.status} ${text}`);
  }

  return response.json();
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

    const order = normalizeOrder(req.body || {});

    if (!order.customer.name || !order.customer.phone || !order.customer.emirate || !order.customer.address) {
      return jsonResponse(res, 400, {
        ok: false,
        message: 'Missing customer information'
      });
    }

    if (!order.items.length) {
      return jsonResponse(res, 400, {
        ok: false,
        message: 'Order has no items'
      });
    }

    let fileData = await getOrdersFile(token);

    fileData.orders.unshift(order);

    try {
      await saveOrdersFile(token, fileData.orders, fileData.sha);
    } catch (error) {
      fileData = await getOrdersFile(token);
      fileData.orders.unshift(order);
      await saveOrdersFile(token, fileData.orders, fileData.sha);
    }

    return jsonResponse(res, 200, {
      ok: true,
      message: 'Order created successfully',
      orderId: order.id,
      order: order
    });

  } catch (error) {
    return jsonResponse(res, 500, {
      ok: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};
