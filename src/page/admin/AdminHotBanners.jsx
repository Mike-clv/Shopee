import React from 'react';
import { BannerManager } from './AdminBanners';

export default function AdminHotBanners() {
  return (
    <BannerManager
      placement="hot_empty"
      title="Banner Mã Giảm Giá Hot"
      description="Quản lý riêng banner hiển thị trong mục Mã giảm giá hot hôm nay khi chưa có mã hot."
      addLabel="Thêm banner mã hot"
      placementLabel="Mục Mã hot hôm nay"
    />
  );
}
