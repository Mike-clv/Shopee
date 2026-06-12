import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GripVertical, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { localClient } from '@/api/localClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    active: 'Còn hạn',
    expiring_soon: 'Sắp hết hạn',
    expired: 'Hết hạn',
    draft: 'Nháp',
  };

  return (
    <Badge variant={status === 'active' ? 'default' : 'secondary'} className="rounded-full text-[10px]">
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

export default function AdminVouchers() {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [orderedVouchers, setOrderedVouchers] = useState([]);
  const qc = useQueryClient();

  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: ['admin-vouchers-list'],
    queryFn: () => localClient.entities.Voucher.list('-sort_order', 200),
  });

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

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return visibleVouchers;

    return visibleVouchers.filter((voucher) =>
      (voucher.title || '').toLowerCase().includes(keyword)
      || (voucher.code || '').toLowerCase().includes(keyword)
      || (voucher.brand_name || '').toLowerCase().includes(keyword),
    );
  }, [search, visibleVouchers]);

  const isFiltering = search.trim().length > 0;

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) {
        const { id, created_date, updated_date, created_by_id, ...rest } = data;
        return localClient.entities.Voucher.update(id, rest);
      }
      return localClient.entities.Voucher.create(data);
    },
    onSuccess: () => {
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
      qc.invalidateQueries({ queryKey: ['admin-vouchers-list'] });
      qc.invalidateQueries({ queryKey: ['admin-vouchers'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      toast.success('Đã xóa voucher');
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể xóa voucher');
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

      <div className="mb-4 space-y-2">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm voucher, mã, thương hiệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 rounded-2xl pl-10"
          />
        </div>
        {isFiltering ? (
          <p className="text-xs text-muted-foreground">
            Đang lọc danh sách. Xóa từ khóa tìm kiếm để kéo thả sắp xếp voucher.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Kéo biểu tượng 6 chấm để đổi thứ tự ưu tiên hiển thị voucher.
          </p>
        )}
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
                                      #{index + 1}
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
                          <td colSpan={7} className="p-8 text-center text-muted-foreground">Đang tải...</td>
                        </tr>
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground">Không có voucher</td>
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
                                      #{index + 1}
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
                      <SelectItem value="active">Còn hạn</SelectItem>
                      <SelectItem value="expiring_soon">Sắp hết hạn</SelectItem>
                      <SelectItem value="expired">Hết hạn</SelectItem>
                      <SelectItem value="draft">Nháp</SelectItem>
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
