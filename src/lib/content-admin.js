export function slugifyVietnamese(value) {
  return String(value || '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function toDateTimeLocalValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function fromDateTimeLocalValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}

export function normalizePublicationPayload(data) {
  const payload = { ...data };

  if (payload.status === 'draft') {
    payload.published_at = payload.published_at || null;
    return payload;
  }

  if (payload.status === 'published') {
    payload.published_at = payload.published_at || new Date().toISOString();
    return payload;
  }

  if (payload.status === 'scheduled') {
    return payload;
  }

  payload.status = 'draft';
  return payload;
}

export function getContentStatusMeta(status, publishedAt) {
  if (status === 'scheduled') {
    return {
      label: 'Hẹn giờ',
      variant: 'secondary',
      description: publishedAt ? `Tự đăng lúc ${new Date(publishedAt).toLocaleString('vi-VN')}` : 'Chưa chọn giờ đăng',
    };
  }

  if (status === 'published') {
    return {
      label: 'Đã xuất bản',
      variant: 'default',
      description: publishedAt ? `Đăng lúc ${new Date(publishedAt).toLocaleString('vi-VN')}` : 'Đang hiển thị công khai',
    };
  }

  return {
    label: 'Nháp',
    variant: 'secondary',
    description: 'Chưa hiển thị công khai',
  };
}

export function sortContentByPriority(items = []) {
  return [...items].sort((left, right) => {
    const leftOrder = Number.isFinite(Number(left?.sort_order)) ? Number(left.sort_order) : 1000;
    const rightOrder = Number.isFinite(Number(right?.sort_order)) ? Number(right.sort_order) : 1000;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    const leftDate = new Date(left?.published_at || left?.created_date || 0).getTime();
    const rightDate = new Date(right?.published_at || right?.created_date || 0).getTime();

    return rightDate - leftDate;
  });
}
