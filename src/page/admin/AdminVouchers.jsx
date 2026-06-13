import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, GripVertical, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { localClient } from '@/api/localClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const emptyVoucher = {
  title: '',
  slug: '',
  code: '',
  description: '',
  terms: '',
  discount_type: 'percent',
  discount_value: '',
  min_order_value: '',
  max_discount: '',
  start_date: '',
  end_date: '',
  status: 'active',
  voucher_type: 'coupon',
  platform: 'shopee',
  brand_id: '',
  brand_name: '',
  brand_logo: '',
  category_id: '',
  category_name: '',
  original_url: '',
  tracking_url: '',
  is_hot: false,
  is_verified: false,
  is_exclusive: false,
  is_featured: false,
  sort_order: 0,
};

function sortVouchersByPriority(items = []) {
  return [...items].sort((left, right) => {
    const leftOrder = Number.isFinite(Number(left?.sort_order)) ? Number(left.sort_order) : 0;
    const rightOrder = Number.isFinite(Number(right?.sort_order)) ? Number(right.sort_order) : 0;

    if (leftOrder !== rightOrder) {
      return rightOrder - leftOrder;
    }

    const leftDate = new Date(left?.created_date || 0).getTime();
    const rightDate = new Date(right?.created_date || 0).getTime();

    return rightDate - leftDate;
  });
}

function reorderItems(items, startIndex, endIndex) {
  const next = [...items];
  const [removed] = next.splice(startIndex, 1);
  next.splice(endIndex, 0, removed);

  const total = next.length;
  return next.map((item, index) => ({
    ...item,
    sort_order: total - index,
  }));
}

function StatusBadge({ status }) {
  const labels = {
    active: 'Đang hoạt động',
    expiring_soon: 'Sắp hết hạn',
    expired: 'Đã hết hạn',
    draft: 'Bản nháp',
  };

  return (
    <Badge variant={status === 'active' ? 'default' : 'secondary'} className="rounded-full whitespace-nowrap px-3 py-1 text-[10px]">
      {labels[status] || status}
    </Badge>
  );
}

function VoucherFlags({ voucher }) {
  const flags = [];
  if (voucher.is_hot) flags.push({ label: 'Nổi bật', className: 'bg-red-50 text-red-600' });
  if (voucher.is_verified) flags.push({ label: 'Đã xác minh', className: 'bg-green-50 text-green-600' });
  if (voucher.is_exclusive) flags.push({ label: 'Độc quyền', className: 'bg-amber-50 text-amber-600' });
  if (voucher.is_featured) flags.push({ label: 'Ưu tiên hiển thị', className: 'bg-blue-50 text-blue-600' });

  if (flags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {flags.map((flag) => (
        <span key={flag.label} className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${flag.className}`}>
          {flag.label}
        </span>
      ))}
    </div>
  );
}

const ITEMS_PER_PAGE = 50;

const PLATFORM_OPTIONS = [
  { value: '', label: 'Tất cả sàn' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'lazada', label: 'Lazada' },
  { value: 'tiki', label: 'Tiki' },
  { value: 'tiktok_shop', label: 'TikTok Shop' },
  { value: 'other', label: 'Khác' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'expiring_soon', label: 'Sắp hết hạn' },
  { value: 'expired', label: 'Đã hết hạn' },
  { value: 'draft', label: 'Bản nháp' },
];

export default function AdminVouchers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [bulkStatus, setBulkStatus] = useState('draft');
  const [selectedBulkStatus, setSelectedBulkStatus] = useState('draft');
  const [selectedVoucherIds, setSelectedVoucherIds] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [orderedVouchers, setOrderedVouchers] = useState([]);
  const qc = useQueryClient();

  // Xây dựng filters cho API call
  const apiFilters = useMemo(() => {
    const filters = {};
    if (filterPlatform) filters.platform = filterPlatform;
    if (filterStatus) filters.status = filterStatus;
    if (filterBrand) filters.brand_id = filterBrand;
    return filters;
  }, [filterPlatform, filterStatus, filterBrand]);

  // Fetch vouchers phân trang từ server
  const { data: voucherData, isLoading } = useQuery({
    queryKey: ['admin-vouchers-paginated', page, apiFilters],
    queryFn: () => localClient.entities.Voucher.listPaginated('-sort_order', ITEMS_PER_PAGE, page, apiFilters),
  });

  const vouchers = useMemo(() => voucherData?.data || [], [voucherData]);
  const totalVouchers = voucherData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalVouchers / ITEMS_PER_PAGE));

  const { data: brands = [] } = useQuery({
    queryKey: ['admin-brands-select'],
    queryFn: () => localClient.entities.Brand.list('name', 100),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories-select'],
    queryFn: () => localClient.entities.Category.list('name', 50),
  });

  useEffect(() => {
    setOrderedVouchers(sortVouchersByPriority(vouchers));
  }, [vouchers]);

  const visibleVouchers = useMemo(() => sortVouchersByPriority(orderedVouchers), [orderedVouchers]);

  // Search vẫn client-side trên data của page hiện tại
  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return visibleVouchers;

    return visibleVouchers.filter((voucher) =>
      (voucher.title || '').toLowerCase().includes(keyword)
      || (voucher.code || '').toLowerCase().includes(keyword)
      || (voucher.brand_name || '').toLowerCase().includes(keyword),
    );
  }, [search, visibleVouchers]);

  useEffect(() => {
    const currentIds = new Set(filtered.map((voucher) => voucher.id));
    setSelectedVoucherIds((current) => current.filter((id) => currentIds.has(id)));
  }, [filtered]);

  const isFiltering = search.trim().length > 0 || filterPlatform || filterStatus || filterBrand;

  // Reset page khi thay đổi filter
  const handleFilterChange = useCallback((setter) => (value) => {
    setter(value);
    setPage(1);
  }, []);

  // Đếm số filter đang active
  const activeFilterCount = [filterPlatform, filterStatus, filterBrand].filter(Boolean).length;

  // Xóa tất cả filter
  const clearFilters = useCallback(() => {
    setFilterPlatform('');
    setFilterStatus('');
    setFilterBrand('');
    setPage(1);
  }, []);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) {
        const { id, created_date: _createdDate, updated_date: _updatedDate, created_by_id: _createdById, ...rest } = data;
        return localClient.entities.Voucher.update(id, rest);
      }
      return localClient.entities.Voucher.create(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-vouchers-paginated'] });
      qc.invalidateQueries({ queryKey: ['admin-vouchers-list'] });
      qc.invalidateQueries({ queryKey: ['admin-vouchers'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      setShowForm(false);
      setEditing(null);
      toast.success('Đã lưu voucher');
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể lưu voucher');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (items) => Promise.all(
      items.map((item) => localClient.entities.Voucher.update(item.id, { sort_order: item.sort_order })),
    ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-vouchers-paginated'] });
      qc.invalidateQueries({ queryKey: ['admin-vouchers-list'] });
      qc.invalidateQueries({ queryKey: ['admin-vouchers'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      toast.success('Đã cập nhật thứ tự voucher');
    },
    onError: (error, _items, previousItems) => {
      if (previousItems) {
        setOrderedVouchers(previousItems);
      }
      toast.error(error.message || 'Không thể cập nhật thứ tự voucher');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => localClient.entities.Voucher.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-vouchers-paginated'] });
      qc.invalidateQueries({ queryKey: ['admin-vouchers-list'] });
      qc.invalidateQueries({ queryKey: ['admin-vouchers'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      toast.success('Đã xóa voucher');
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể xóa voucher');
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ filters, status }) => localClient.vouchers.bulkUpdateStatus({ filters, status }),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['admin-vouchers-paginated'] });
      qc.invalidateQueries({ queryKey: ['admin-vouchers-list'] });
      qc.invalidateQueries({ queryKey: ['admin-vouchers'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      const scopeLabel = Object.keys(result?.filters || {}).length > 0 ? 'voucher đang lọc' : 'toàn bộ voucher';
      toast.success(`Đã cập nhật ${result?.updatedCount || 0} ${scopeLabel} sang trạng thái mới.`);
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể cập nhật trạng thái hàng loạt');
    },
  });

  const bulkSelectedMutation = useMutation({
    mutationFn: ({ ids, data }) => localClient.vouchers.bulkUpdateSelected({ ids, data }),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['admin-vouchers-paginated'] });
      qc.invalidateQueries({ queryKey: ['admin-vouchers-list'] });
      qc.invalidateQueries({ queryKey: ['admin-vouchers'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      setSelectedVoucherIds([]);
      toast.success(`Đã cập nhật ${result?.updatedCount || 0} voucher đã chọn.`);
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể cập nhật voucher đã chọn');
    },
  });

  const bulkDeleteSelectedMutation = useMutation({
    mutationFn: ({ ids }) => localClient.vouchers.bulkDeleteSelected({ ids }),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['admin-vouchers-paginated'] });
      qc.invalidateQueries({ queryKey: ['admin-vouchers-list'] });
      qc.invalidateQueries({ queryKey: ['admin-vouchers'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      setSelectedVoucherIds([]);
      toast.success(`Đã xóa ${result?.deletedCount || 0} voucher đã chọn.`);
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể xóa voucher đã chọn');
    },
  });

  const handleEdit = (voucher) => {
    setEditing({ ...voucher });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditing({ ...emptyVoucher, sort_order: (visibleVouchers[0]?.sort_order || 0) + 1 });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!editing?.title) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }

    const payload = {
      ...editing,
      slug: editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    };

    saveMutation.mutate(payload);
  };

  const handleDragEnd = (result) => {
    if (isFiltering || !result.destination || result.destination.index === result.source.index) return;

    const previousItems = visibleVouchers;
    const nextItems = reorderItems(visibleVouchers, result.source.index, result.destination.index);
    setOrderedVouchers(nextItems);
    reorderMutation.mutate(nextItems, { onError: () => setOrderedVouchers(previousItems) });
  };

  const updateField = (field, value) => setEditing((prev) => ({ ...prev, [field]: value }));

  const allVisibleIds = useMemo(() => filtered.map((voucher) => voucher.id), [filtered]);
  const allVisibleSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedVoucherIds.includes(id));

  const toggleVoucherSelection = useCallback((voucherId, checked) => {
    setSelectedVoucherIds((current) => {
      if (checked) {
        return current.includes(voucherId) ? current : [...current, voucherId];
      }
      return current.filter((id) => id !== voucherId);
    });
  }, []);

  const handleToggleSelectAllVisible = useCallback((checked) => {
    if (checked) {
      setSelectedVoucherIds((current) => Array.from(new Set([...current, ...allVisibleIds])));
      return;
    }

    setSelectedVoucherIds((current) => current.filter((id) => !allVisibleIds.includes(id)));
  }, [allVisibleIds]);

  const handleBulkStatusApply = () => {
    const scopeLabel = activeFilterCount > 0
      ? 'tất cả voucher đang lọc theo sàn / trạng thái / thương hiệu'
      : 'toàn bộ voucher hiện có';

    if (!confirm(`Anh chắc muốn đổi trạng thái của ${scopeLabel} sang "${STATUS_OPTIONS.find((item) => item.value === bulkStatus)?.label || bulkStatus}" chứ?`)) {
      return;
    }

    bulkStatusMutation.mutate({
      filters: apiFilters,
      status: bulkStatus,
    });
  };

  const handleSelectedStatusApply = () => {
    if (selectedVoucherIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một voucher.');
      return;
    }

    const statusLabel = STATUS_OPTIONS.find((item) => item.value === selectedBulkStatus)?.label || selectedBulkStatus;
    if (!confirm(`Anh chắc muốn đổi ${selectedVoucherIds.length} voucher đã chọn sang "${statusLabel}" chứ?`)) {
      return;
    }

    bulkSelectedMutation.mutate({
      ids: selectedVoucherIds,
      data: { status: selectedBulkStatus },
    });
  };

  const handleSelectedToggleFlag = (field, value, label) => {
    if (selectedVoucherIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một voucher.');
      return;
    }

    if (!confirm(`Anh chắc muốn ${value ? 'bật' : 'tắt'} "${label}" cho ${selectedVoucherIds.length} voucher đã chọn chứ?`)) {
      return;
    }

    bulkSelectedMutation.mutate({
      ids: selectedVoucherIds,
      data: { [field]: value },
    });
  };

  const handleDeleteSelected = () => {
    if (selectedVoucherIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một voucher.');
      return;
    }

    if (!confirm(`Anh chắc muốn xóa ${selectedVoucherIds.length} voucher đã chọn chứ? Thao tác này không hoàn tác được.`)) {
      return;
    }

    bulkDeleteSelectedMutation.mutate({ ids: selectedVoucherIds });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">Quản Lý Voucher</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            Kéo thả để ưu tiên voucher hiển thị trước. Khi đang tìm kiếm, hệ thống sẽ tạm khóa kéo-thả để tránh sắp xếp nhầm.
          </p>
        </div>
        <Button onClick={handleNew} className="h-12 gap-2 rounded-2xl shadow-sm">
          <Plus className="h-4 w-4" />
          Thêm voucher
        </Button>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Ô tìm kiếm */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm voucher, mã, thương hiệu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-xl pl-10"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Lọc:</span>
            </div>

            {/* Filter Sàn */}
            <Select value={filterPlatform || 'all'} onValueChange={(v) => handleFilterChange(setFilterPlatform)(v === 'all' ? '' : v)}>
              <SelectTrigger className="h-9 w-auto min-w-[120px] rounded-xl text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORM_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value || 'all'} value={opt.value || 'all'}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Trạng thái */}
            <Select value={filterStatus || 'all'} onValueChange={(v) => handleFilterChange(setFilterStatus)(v === 'all' ? '' : v)}>
              <SelectTrigger className="h-9 w-auto min-w-[130px] rounded-xl text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value || 'all'} value={opt.value || 'all'}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Thương hiệu */}
            <Select value={filterBrand || 'all'} onValueChange={(v) => handleFilterChange(setFilterBrand)(v === 'all' ? '' : v)}>
              <SelectTrigger className="h-9 w-auto min-w-[130px] rounded-xl text-xs">
                <SelectValue placeholder="Thương hiệu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Nút xóa filter */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-1 rounded-xl text-xs text-muted-foreground"
                onClick={clearFilters}
              >
                <X className="h-3 w-3" />
                Xóa lọc ({activeFilterCount})
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-secondary/20 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Đổi trạng thái hàng loạt</p>
            <p className="text-xs leading-5 text-muted-foreground">
              Chức năng này áp dụng cho {activeFilterCount > 0 ? 'toàn bộ voucher đang lọc theo sàn / trạng thái / thương hiệu' : 'toàn bộ voucher hiện có'}.
              Ô tìm kiếm chữ chỉ hỗ trợ lọc nhanh trên trang hiện tại nên sẽ không được tính vào bulk action.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={bulkStatus} onValueChange={setBulkStatus}>
              <SelectTrigger className="h-10 min-w-[190px] rounded-xl text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.filter((item) => item.value).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              className="h-10 rounded-xl"
              onClick={handleBulkStatusApply}
              disabled={bulkStatusMutation.isPending || totalVouchers === 0}
            >
              {bulkStatusMutation.isPending ? 'Đang cập nhật...' : activeFilterCount > 0 ? 'Chọn hết & đổi trạng thái' : 'Đổi trạng thái tất cả'}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Chọn nhanh theo danh sách đang thấy</p>
              <p className="text-xs leading-5 text-muted-foreground">
                Anh có thể tick từng voucher hoặc chọn tất cả voucher trên trang này, rồi đổi trạng thái / bật cờ / xóa theo đúng danh sách đã chọn.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-xl text-xs"
                onClick={() => handleToggleSelectAllVisible(true)}
                disabled={filtered.length === 0 || allVisibleSelected}
              >
                Chọn tất cả trang này
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-9 rounded-xl text-xs"
                onClick={() => setSelectedVoucherIds([])}
                disabled={selectedVoucherIds.length === 0}
              >
                Bỏ chọn tất cả
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-secondary/20 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              <span className="font-medium">Đã chọn:</span> {selectedVoucherIds.length} voucher
            </div>
            <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
              <Select value={selectedBulkStatus} onValueChange={setSelectedBulkStatus}>
                <SelectTrigger className="h-10 min-w-[190px] rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.filter((item) => item.value).map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl"
                onClick={handleSelectedStatusApply}
                disabled={selectedVoucherIds.length === 0 || bulkSelectedMutation.isPending || bulkDeleteSelectedMutation.isPending}
              >
                Đổi trạng thái đã chọn
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl"
                onClick={() => handleSelectedToggleFlag('is_hot', true, 'Mã hot')}
                disabled={selectedVoucherIds.length === 0 || bulkSelectedMutation.isPending || bulkDeleteSelectedMutation.isPending}
              >
                Bật Mã hot
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl"
                onClick={() => handleSelectedToggleFlag('is_verified', true, 'Đã xác minh')}
                disabled={selectedVoucherIds.length === 0 || bulkSelectedMutation.isPending || bulkDeleteSelectedMutation.isPending}
              >
                Bật xác minh
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="h-10 rounded-xl"
                onClick={handleDeleteSelected}
                disabled={selectedVoucherIds.length === 0 || bulkSelectedMutation.isPending || bulkDeleteSelectedMutation.isPending}
              >
                Xóa đã chọn
              </Button>
            </div>
          </div>
        </div>

        {/* Thông tin */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <p>
            {isFiltering
              ? `Đang lọc ${filtered.length} / ${totalVouchers} voucher.`
              : `Kéo biểu tượng 6 chấm để đổi thứ tự ưu tiên hiển thị voucher.`
            }
            {' '}
            Trang {page}/{totalPages} · Tổng {totalVouchers} voucher
          </p>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="vouchers">
          {(dropProvided) => (
            <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
              <div className="space-y-3 md:hidden">
                {isLoading ? (
                  <div className="rounded-3xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                    Đang tải...
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="rounded-3xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                    Không có voucher
                  </div>
                ) : (
                  filtered.map((voucher, index) => (
                    <Draggable
                      key={voucher.id}
                      draggableId={voucher.id}
                      index={index}
                      isDragDisabled={isFiltering}
                    >
                      {(dragProvided, snapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          style={dragProvided.draggableProps.style}
                          className={`rounded-3xl border border-border bg-card p-4 shadow-sm transition-shadow ${
                            snapshot.isDragging ? 'shadow-xl ring-1 ring-primary/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={selectedVoucherIds.includes(voucher.id)}
                              onCheckedChange={(checked) => toggleVoucherSelection(voucher.id, Boolean(checked))}
                              className="mt-2"
                              aria-label={`Chọn voucher ${voucher.title}`}
                            />
                            <div
                              role="button"
                              tabIndex={0}
                              aria-label="Kéo để sắp xếp voucher"
                              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-secondary/40 text-muted-foreground transition-colors ${
                                isFiltering
                                  ? 'cursor-not-allowed opacity-50'
                                  : 'cursor-grab touch-none select-none hover:bg-accent hover:text-accent-foreground active:cursor-grabbing'
                              }`}
                              {...(!isFiltering ? dragProvided.dragHandleProps : {})}
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-2 text-[11px] font-bold text-muted-foreground">
                                      #{(page - 1) * ITEMS_PER_PAGE + index + 1}
                                    </span>
                                    <p className="line-clamp-2 text-sm font-semibold leading-5">{voucher.title}</p>
                                  </div>
                                  <p className="mt-1 text-xs text-muted-foreground">{voucher.brand_name || 'Chưa có thương hiệu'}</p>
                                </div>
                                <StatusBadge status={voucher.status} />
                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                {voucher.code ? (
                                  <code className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">{voucher.code}</code>
                                ) : null}
                                <span className="rounded-full bg-secondary px-2.5 py-1">{voucher.platform || 'other'}</span>
                              </div>

                              <div className="mt-3">
                                <VoucherFlags voucher={voucher} />
                              </div>

                              <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/70 pt-3">
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => handleEdit(voucher)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-10 w-10 rounded-full text-destructive"
                                  onClick={() => {
                                    if (confirm('Xóa voucher này?')) deleteMutation.mutate(voucher.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
              </div>

              <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-secondary/50">
                        <th className="w-12 p-3 text-left font-medium">
                          <Checkbox
                            checked={allVisibleSelected}
                            onCheckedChange={(checked) => handleToggleSelectAllVisible(Boolean(checked))}
                            aria-label="Chọn tất cả voucher trên trang"
                          />
                        </th>
                        <th className="w-14 p-3 text-left font-medium">Kéo</th>
                        <th className="p-3 text-left font-medium">Voucher</th>
                        <th className="hidden p-3 text-left font-medium sm:table-cell">Mã</th>
                        <th className="hidden p-3 text-left font-medium md:table-cell">Sàn</th>
                        <th className="hidden p-3 text-left font-medium lg:table-cell">Trạng thái</th>
                        <th className="hidden p-3 text-left font-medium lg:table-cell">Tags</th>
                        <th className="p-3 text-right font-medium">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-muted-foreground">Đang tải...</td>
                        </tr>
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-muted-foreground">Không có voucher</td>
                        </tr>
                      ) : (
                        filtered.map((voucher, index) => (
                          <Draggable
                            key={voucher.id}
                            draggableId={voucher.id}
                            index={index}
                            isDragDisabled={isFiltering}
                          >
                            {(dragProvided, snapshot) => (
                              <tr
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                style={dragProvided.draggableProps.style}
                                className={`border-b transition-colors hover:bg-secondary/30 ${
                                  snapshot.isDragging ? 'bg-secondary/40 shadow-sm' : ''
                                }`}
                              >
                                <td className="p-3 align-top">
                                  <Checkbox
                                    checked={selectedVoucherIds.includes(voucher.id)}
                                    onCheckedChange={(checked) => toggleVoucherSelection(voucher.id, Boolean(checked))}
                                    aria-label={`Chọn voucher ${voucher.title}`}
                                    className="mt-2"
                                  />
                                </td>
                                <td className="p-3 align-top">
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Kéo để sắp xếp voucher"
                                    className={`flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-secondary/40 text-muted-foreground transition-colors ${
                                      isFiltering
                                        ? 'cursor-not-allowed opacity-50'
                                        : 'cursor-grab touch-none select-none hover:bg-accent hover:text-accent-foreground active:cursor-grabbing'
                                    }`}
                                    {...(!isFiltering ? dragProvided.dragHandleProps : {})}
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-2 text-[11px] font-bold text-muted-foreground">
                                      #{(page - 1) * ITEMS_PER_PAGE + index + 1}
                                    </span>
                                    <div className="min-w-0">
                                      <p className="line-clamp-1 font-medium">{voucher.title}</p>
                                      <p className="text-xs text-muted-foreground">{voucher.brand_name}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="hidden p-3 sm:table-cell">
                                  {voucher.code ? (
                                    <code className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">{voucher.code}</code>
                                  ) : null}
                                </td>
                                <td className="hidden p-3 text-xs md:table-cell">{voucher.platform}</td>
                                <td className="hidden p-3 lg:table-cell">
                                  <StatusBadge status={voucher.status} />
                                </td>
                                <td className="hidden p-3 lg:table-cell">
                                  <VoucherFlags voucher={voucher} />
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => handleEdit(voucher)}>
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-full text-destructive"
                                      onClick={() => {
                                        if (confirm('Xóa voucher này?')) deleteMutation.mutate(voucher.id);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1">
          {/* Trang đầu */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-xl"
            disabled={page <= 1}
            onClick={() => setPage(1)}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Trang trước */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-xl"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pageNum;
            if (totalPages <= 7) {
              pageNum = i + 1;
            } else if (page <= 4) {
              pageNum = i + 1;
            } else if (page >= totalPages - 3) {
              pageNum = totalPages - 6 + i;
            } else {
              pageNum = page - 3 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={pageNum === page ? 'default' : 'outline'}
                size="icon"
                className={`h-9 w-9 rounded-xl ${pageNum === page ? 'pointer-events-none' : ''}`}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          {/* Trang sau */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-xl"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Trang cuối */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-xl"
            disabled={page >= totalPages}
            onClick={() => setPage(totalPages)}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-1rem)] max-w-2xl overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Sửa Voucher' : 'Thêm Voucher'}</DialogTitle>
          </DialogHeader>
          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label>Tiêu đề *</Label>
                  <Input value={editing.title} onChange={(e) => updateField('title', e.target.value)} />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={editing.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="Tự tạo từ tiêu đề" />
                </div>
                <div>
                  <Label>Mã coupon</Label>
                  <Input value={editing.code} onChange={(e) => updateField('code', e.target.value)} />
                </div>
                <div>
                  <Label>Loại giảm giá</Label>
                  <Select value={editing.discount_type} onValueChange={(value) => updateField('discount_type', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Giảm %</SelectItem>
                      <SelectItem value="fixed">Giảm tiền</SelectItem>
                      <SelectItem value="cashback">Hoàn tiền</SelectItem>
                      <SelectItem value="freeship">Miễn phí vận chuyển</SelectItem>
                      <SelectItem value="gift">Quà tặng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Giá trị giảm</Label>
                  <Input value={editing.discount_value} onChange={(e) => updateField('discount_value', e.target.value)} placeholder="VD: 50%, 100K" />
                </div>
                <div>
                  <Label>Đơn tối thiểu</Label>
                  <Input value={editing.min_order_value} onChange={(e) => updateField('min_order_value', e.target.value)} />
                </div>
                <div>
                  <Label>Giảm tối đa</Label>
                  <Input value={editing.max_discount} onChange={(e) => updateField('max_discount', e.target.value)} />
                </div>
                <div>
                  <Label>Loại voucher</Label>
                  <Select value={editing.voucher_type} onValueChange={(value) => updateField('voucher_type', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coupon">Mã giảm giá</SelectItem>
                      <SelectItem value="deal">Ưu đãi</SelectItem>
                      <SelectItem value="cashback">Hoàn tiền</SelectItem>
                      <SelectItem value="freeship">Miễn phí vận chuyển</SelectItem>
                      <SelectItem value="flash_sale">Siêu sale</SelectItem>
                      <SelectItem value="exclusive">Độc quyền</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sàn</Label>
                  <Select value={editing.platform} onValueChange={(value) => updateField('platform', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shopee">Shopee</SelectItem>
                      <SelectItem value="lazada">Lazada</SelectItem>
                      <SelectItem value="tiki">Tiki</SelectItem>
                      <SelectItem value="tiktok_shop">TikTok Shop</SelectItem>
                      <SelectItem value="sendo">Sendo</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Trạng thái</Label>
                  <Select value={editing.status} onValueChange={(value) => updateField('status', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang hoạt động</SelectItem>
                      <SelectItem value="expiring_soon">Sắp hết hạn</SelectItem>
                      <SelectItem value="expired">Đã hết hạn</SelectItem>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Thương hiệu</Label>
                  <Select
                    value={editing.brand_id || 'none'}
                    onValueChange={(value) => {
                      const brand = brands.find((item) => item.id === value);
                      updateField('brand_id', value === 'none' ? '' : value);
                      if (brand) {
                        updateField('brand_name', brand.name);
                        updateField('brand_logo', brand.logo || '');
                      }
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Chọn thương hiệu" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không chọn</SelectItem>
                      {brands.map((brand) => <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Danh mục</Label>
                  <Select
                    value={editing.category_id || 'none'}
                    onValueChange={(value) => {
                      const category = categories.find((item) => item.id === value);
                      updateField('category_id', value === 'none' ? '' : value);
                      if (category) updateField('category_name', category.name);
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không chọn</SelectItem>
                      {categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ngày bắt đầu</Label>
                  <Input type="date" value={editing.start_date?.split('T')[0] || ''} onChange={(e) => updateField('start_date', e.target.value)} />
                </div>
                <div>
                  <Label>Ngày hết hạn</Label>
                  <Input type="date" value={editing.end_date?.split('T')[0] || ''} onChange={(e) => updateField('end_date', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Label>URL gốc</Label>
                  <Input value={editing.original_url} onChange={(e) => updateField('original_url', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Tracking URL (affiliate)</Label>
                  <Input value={editing.tracking_url} onChange={(e) => updateField('tracking_url', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Mô tả</Label>
                  <Textarea value={editing.description} onChange={(e) => updateField('description', e.target.value)} rows={2} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Điều kiện áp dụng</Label>
                  <Textarea value={editing.terms} onChange={(e) => updateField('terms', e.target.value)} rows={2} />
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_hot} onCheckedChange={(value) => updateField('is_hot', value)} />
                  <Label>Mã hot</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_verified} onCheckedChange={(value) => updateField('is_verified', value)} />
                  <Label>Đã xác minh</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_exclusive} onCheckedChange={(value) => updateField('is_exclusive', value)} />
                  <Label>Độc quyền</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_featured} onCheckedChange={(value) => updateField('is_featured', value)} />
                  <Label>Ưu tiên hiển thị</Label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowForm(false)}>Hủy</Button>
                <Button onClick={handleSave} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
