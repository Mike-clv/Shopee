import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, GripVertical, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { localClient } from '@/api/localClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  buildGlobalCouponRedirectPath,
  formatGlobalCouponExpiry,
  GLOBAL_COUPON_PLATFORM_LABELS,
  GLOBAL_COUPON_TYPE_LABELS,
  GLOBAL_COUPON_TYPE_OPTIONS,
} from '@/lib/global-coupons';

const emptyCoupon = {
  id: '',
  platform: 'other',
  brand_id: '',
  brand_name: '',
  title: '',
  description: '',
  coupon_code: '',
  affiliate_url: '',
  type: 'all_site',
  is_evergreen: false,
  expires_at: '',
};

function formatDateTimeLocal(value) {
  if (!value) return '';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  const offset = parsed.getTimezoneOffset();
  const localDate = new Date(parsed.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function reorderItems(items, startIndex, endIndex) {
  const next = [...items];
  const [removed] = next.splice(startIndex, 1);
  next.splice(endIndex, 0, removed);
  return next;
}

function CouponRow({ coupon, index, onEdit, onDelete }) {
  return (
    <Draggable draggableId={coupon.id || `draft-${index}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`rounded-3xl border border-border bg-card transition-shadow ${snapshot.isDragging ? 'shadow-xl' : 'shadow-sm'}`}
        >
          <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 flex-1 gap-4">
              <button
                type="button"
                {...provided.dragHandleProps}
                className="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-secondary/40 text-muted-foreground hover:bg-secondary sm:inline-flex"
                aria-label={`Kéo thả coupon ${coupon.title || index + 1}`}
              >
                <GripVertical className="h-4 w-4" />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {GLOBAL_COUPON_PLATFORM_LABELS[coupon.platform] || coupon.platform || 'Khác'}
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    {GLOBAL_COUPON_TYPE_LABELS[coupon.type] || coupon.type}
                  </Badge>
                  {coupon.brand_name ? (
                    <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                      {coupon.brand_name}
                    </Badge>
                  ) : null}
                  {coupon.is_evergreen ? (
                    <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      Ưu đãi lưu lâu
                    </Badge>
                  ) : null}
                  {coupon.expires_at ? (
                    <Badge variant="secondary" className="rounded-full">
                      Hết hạn: {formatGlobalCouponExpiry(coupon.expires_at)}
                    </Badge>
                  ) : null}
                </div>

                <h3 className="mt-3 line-clamp-2 font-heading text-lg font-bold">
                  {coupon.title || 'Coupon chưa đặt tên'}
                </h3>

                {coupon.description ? (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {coupon.description}
                  </p>
                ) : null}

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-secondary/20 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Mã hiển thị
                    </p>
                    <p className="mt-1 break-all text-sm font-semibold">
                      {coupon.coupon_code || 'Không dùng mã - chỉ bấm kích hoạt'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-secondary/20 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Link bọc
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="min-w-0 flex-1 truncate text-xs">
                        {buildGlobalCouponRedirectPath(coupon.id || 'draft')}
                      </code>
                      {coupon.id ? (
                        <a
                          href={buildGlobalCouponRedirectPath(coupon.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-primary"
                          aria-label={`Xem trước ${coupon.title}`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-end lg:self-start">
              <Button type="button" variant="outline" size="icon" className="rounded-2xl" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-2xl text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default function AdminGlobalCoupons() {
  const queryClient = useQueryClient();
  const [coupons, setCoupons] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [form, setForm] = useState(emptyCoupon);

  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-global-coupons'],
    queryFn: () => localClient.settings.getAdminGlobalCoupons(),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['admin-global-coupon-brands'],
    queryFn: () => localClient.entities.Brand.filter({ is_active: true }, 'sort_order', 100),
  });

  useEffect(() => {
    if (!isDirty) {
      setCoupons(data);
    }
  }, [data, isDirty]);

  const saveMutation = useMutation({
    mutationFn: (payload) => localClient.settings.saveAdminGlobalCoupons(payload),
    onSuccess: (savedCoupons) => {
      setCoupons(savedCoupons);
      setIsDirty(false);
      queryClient.invalidateQueries({ queryKey: ['admin-global-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['homepage'] });
      toast.success('Đã lưu danh sách coupon chọn lọc');
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể lưu coupon chọn lọc');
    },
  });

  const brandOptions = useMemo(
    () => brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      platform: brand.platform || 'other',
    })),
    [brands],
  );

  const summary = useMemo(() => ({
    total: coupons.length,
    evergreen: coupons.filter((item) => item.is_evergreen).length,
    freeship: coupons.filter((item) => item.type === 'freeship').length,
  }), [coupons]);

  const handleOpenNew = () => {
    setEditingIndex(-1);
    setForm(emptyCoupon);
    setShowForm(true);
  };

  const handleOpenEdit = (coupon, index) => {
    setEditingIndex(index);
    setForm({
      ...emptyCoupon,
      ...coupon,
      expires_at: formatDateTimeLocal(coupon.expires_at),
    });
    setShowForm(true);
  };

  const handleBrandChange = (value) => {
    const selectedBrand = brandOptions.find((brand) => brand.id === value);
    if (!selectedBrand) {
      setForm((current) => ({
        ...current,
        brand_id: '',
        brand_name: '',
        platform: 'other',
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      brand_id: selectedBrand.id,
      brand_name: selectedBrand.name,
      platform: selectedBrand.platform || 'other',
    }));
  };

  const handleSaveLocal = () => {
    if (!form.brand_id) {
      toast.error('Vui lòng chọn thương hiệu');
      return;
    }
    if (!form.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề coupon');
      return;
    }
    if (!form.affiliate_url.trim()) {
      toast.error('Vui lòng nhập link affiliate hoặc link sản phẩm');
      return;
    }

    const nextItem = {
      ...form,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };

    const nextCoupons = [...coupons];
    if (editingIndex >= 0) {
      nextCoupons[editingIndex] = nextItem;
    } else {
      nextCoupons.unshift(nextItem);
    }

    setCoupons(nextCoupons);
    setIsDirty(true);
    setShowForm(false);
    setEditingIndex(-1);
    setForm(emptyCoupon);
  };

  const handleDeleteLocal = (index) => {
    setCoupons((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setIsDirty(true);
  };

  const handleDragEnd = (result) => {
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    setCoupons((current) => reorderItems(current, result.source.index, result.destination.index));
    setIsDirty(true);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">Mã giảm giá chọn lọc</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            Tạo danh sách mã toàn sàn, miễn phí vận chuyển và ưu đãi lưu lâu dài để đẩy nổi bật ở trang chủ. Anh có thể kéo thả để đổi thứ tự ưu tiên hiển thị.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="h-12 rounded-2xl" onClick={handleOpenNew}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm coupon
          </Button>
          <Button
            type="button"
            className="h-12 rounded-2xl"
            onClick={() => saveMutation.mutate(coupons)}
            disabled={saveMutation.isPending || !isDirty}
          >
            <Save className="mr-2 h-4 w-4" />
            {saveMutation.isPending ? 'Đang lưu...' : 'Lưu toàn bộ'}
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card className="rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Tổng coupon</p>
            <p className="mt-2 text-3xl font-bold">{summary.total}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Ưu đãi lưu lâu</p>
            <p className="mt-2 text-3xl font-bold">{summary.evergreen}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Miễn phí vận chuyển</p>
            <p className="mt-2 text-3xl font-bold">{summary.freeship}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Danh sách coupon nổi bật</CardTitle>
          <CardDescription>
            Danh sách này lưu trong SiteSetting với key <code>global_coupons</code>. Khi lưu, hệ thống sẽ tự tạo route bọc dạng <code>/go/coupon-id</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải danh sách coupon...</p>
          ) : coupons.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Chưa có coupon chọn lọc nào. Thêm coupon đầu tiên để hiển thị trên trang chủ.
              </p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="admin-global-coupons-list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                    {coupons.map((coupon, index) => (
                      <CouponRow
                        key={coupon.id || `draft-${index}`}
                        coupon={coupon}
                        index={index}
                        onEdit={() => handleOpenEdit(coupon, index)}
                        onDelete={() => handleDeleteLocal(index)}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingIndex >= 0 ? 'Chỉnh sửa coupon' : 'Thêm coupon chọn lọc'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Thương hiệu</Label>
                <Select value={form.brand_id || 'none'} onValueChange={handleBrandChange}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="Chọn thương hiệu đang hiển thị trên web" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Chọn thương hiệu</SelectItem>
                    {brandOptions.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Hiện đang lấy toàn bộ thương hiệu đang bật trên web để anh chọn nhanh.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Loại mã</Label>
                <Select value={form.type} onValueChange={(value) => setForm((current) => ({ ...current, type: value }))}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GLOBAL_COUPON_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/15 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nền tảng suy ra</p>
              <p className="mt-1 text-sm font-semibold">
                {GLOBAL_COUPON_PLATFORM_LABELS[form.platform] || form.platform || 'Khác'}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tiêu đề</Label>
              <Input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="rounded-2xl"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Mã coupon hiển thị</Label>
                <Input
                  value={form.coupon_code}
                  onChange={(event) => setForm((current) => ({ ...current, coupon_code: event.target.value }))}
                  className="rounded-2xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Hết hạn lúc</Label>
                <Input
                  type="datetime-local"
                  value={form.expires_at || ''}
                  onChange={(event) => setForm((current) => ({ ...current, expires_at: event.target.value }))}
                  className="rounded-2xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Affiliate URL hoặc link sản phẩm</Label>
              <Input
                value={form.affiliate_url}
                onChange={(event) => setForm((current) => ({ ...current, affiliate_url: event.target.value }))}
                className="rounded-2xl"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/20 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Mã ưu đãi lưu lâu</p>
                <p className="text-xs text-muted-foreground">
                  Bật nếu muốn đổi nút sang kiểu “Bấm lưu trên ứng dụng” thay vì sao chép mã.
                </p>
              </div>
              <Switch
                checked={!!form.is_evergreen}
                onCheckedChange={(value) => setForm((current) => ({ ...current, is_evergreen: value }))}
              />
            </div>

            <div className="rounded-2xl border border-dashed border-border bg-secondary/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Xem trước link bọc</p>
              <code className="mt-2 block break-all text-sm">
                {form.id ? buildGlobalCouponRedirectPath(form.id) : 'ID sẽ tự sinh khi anh lưu toàn bộ'}
              </code>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" className="rounded-2xl" onClick={() => setShowForm(false)}>
                Hủy
              </Button>
              <Button type="button" className="rounded-2xl" onClick={handleSaveLocal}>
                {editingIndex >= 0 ? 'Cập nhật local' : 'Thêm vào danh sách'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
