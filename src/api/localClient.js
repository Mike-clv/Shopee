const entityPaths = {
  Voucher: 'vouchers',
  Brand: 'brands',
  Category: 'categories',
  BlogPost: 'blog-posts',
  InterestPost: 'interest-posts',
  ClickEvent: 'click-events',
  CopyEvent: 'copy-events',
  SyncLog: 'sync-logs',
  Banner: 'banners',
};

async function request(path, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const response = await fetch(path, {
    method: options.method || 'GET',
    credentials: 'include',
    headers: isFormData
      ? { ...(options.headers || {}) }
      : {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
    ...(options.body === undefined
      ? {}
      : { body: isFormData ? options.body : JSON.stringify(options.body) }),
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === 'object' && data?.message ? data.message : `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function queryString(filters = {}, sort, limit) {
  const params = new URLSearchParams();
  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  if (sort) params.set('sort', sort);
  if (limit) params.set('limit', String(limit));

  const query = params.toString();
  return query ? `?${query}` : '';
}

function entityClient(name) {
  const path = entityPaths[name];

  return {
    list: (sort, limit) => request(`/api/${path}${queryString({}, sort, limit)}`),
    filter: (filters = {}, sort, limit) => request(`/api/${path}${queryString(filters, sort, limit)}`),
    create: (data) => request(`/api/${path}`, { method: 'POST', body: data }),
    update: (id, data) => request(`/api/${path}/${encodeURIComponent(id)}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/api/${path}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  };
}

export const localClient = {
  homepage: {
    get: () => request('/api/homepage'),
  },
  entities: {
    Voucher: entityClient('Voucher'),
    Brand: entityClient('Brand'),
    Category: entityClient('Category'),
    BlogPost: entityClient('BlogPost'),
    InterestPost: entityClient('InterestPost'),
    ClickEvent: entityClient('ClickEvent'),
    CopyEvent: entityClient('CopyEvent'),
    SyncLog: entityClient('SyncLog'),
    Banner: entityClient('Banner'),
  },
  auth: {
    me: () => request('/api/auth/me'),
    loginViaEmailPassword: (email, password) => request('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),
    register: ({ email, password }) => request('/api/auth/register', {
      method: 'POST',
      body: { email, password },
    }),
    verifyOtp: () => Promise.reject(new Error('Xác thực OTP chưa bật trong bản local.')),
    resendOtp: () => Promise.reject(new Error('Gửi lại OTP chưa bật trong bản local.')),
    resetPasswordRequest: (email) => request('/api/auth/forgot-password', {
      method: 'POST',
      body: { email },
    }),
    resetPassword: ({ resetToken, newPassword }) => request('/api/auth/reset-password', {
      method: 'POST',
      body: { resetToken, newPassword },
    }),
    loginWithProvider: () => Promise.reject(new Error('Đăng nhập Google chưa cấu hình trong bản local.')),
    setToken: () => {},
    redirectToLogin: () => {
      window.location.href = '/login';
    },
  },
  functions: {
    invoke: async (name, payload = {}) => {
      if (name !== 'syncAccessTrade') {
        throw new Error(`Function "${name}" chưa được hỗ trợ trong bản local.`);
      }

      const data = await request('/api/accesstrade/sync', {
        method: 'POST',
        body: payload,
      });

      return { data };
    },
  },
  uploads: {
    image: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return request('/api/uploads/image', {
        method: 'POST',
        body: formData,
      });
    },
  },
  analytics: {
    track: ({ eventType = 'click', voucher = {}, sourcePage }) => {
      const path = eventType === 'copy' ? 'copy-events' : 'click-events';
      return request(`/api/${path}`, {
        method: 'POST',
        body: {
          voucher_id: voucher.id,
          brand_id: voucher.brand_id || '',
          event_type: eventType,
          source_page: sourcePage,
          voucher_title: voucher.title,
          brand_name: voucher.brand_name || '',
          analytics_token: voucher.analytics_token || '',
        },
      });
    },
  },
};
