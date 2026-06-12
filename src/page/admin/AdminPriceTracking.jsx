import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  ExternalLink,
  LineChart as LineChartIcon,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { localClient } from '@/api/localClient';
import PriceHistoryChart from '@/components/charts/PriceHistoryChart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { slugifyVietnamese } from '@/lib/content-admin';
import {
  formatTrackedDateTime,
  formatTrackedPrice,
  getTrackedProductPlatformLabel,
  TRACKED_PRODUCT_PLATFORM_OPTIONS,
} from '@/lib/price-tracking';

const defaultForm = {
  name: '',
  slug: '',
  platform: 'shopee',
  product_url: '',
  price_selector: '',
  currency: 'VND',
  sort_order: 0,
  is_active: true,
};

export default function AdminPriceTracking() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [historyDays, setHistoryDays] = useState('30');

  const { data: trackedProducts = [], isLoading } = useQuery({
    queryKey: ['admin-tracked-products'],
    queryFn: () => localClient.entities.TrackedProduct.list('sort_order', 100),
  });

  useEffect(() => {
    if (!selectedId && trackedProducts[0]?.id) {
      setSelectedId(trackedProducts[0].id);
    }
  }, [selectedId, trackedProducts]);

  const selectedProduct = useMemo(
    () => trackedProducts.find((item) => item.id === selectedId) || trackedProducts[0] || null,
    [selectedId, trackedProducts],
  );

  const { data: historyResponse, isFetching: historyLoading } = useQuery({
    queryKey: ['tracked-product-history', selectedProduct?.id, historyDays],
    queryFn: () => localClient.priceTracking.history(selectedProduct.id, historyDays),
    enabled: !!selectedProduct?.id,
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const finalPayload = {
        ...payload,
        slug: payload.slug || slugifyVietnamese(payload.name),
      };

      if (payload.id) {
        const { id, created_date, updated_date, current_price, current_price_text, last_checked_at, last_error, ...rest } = finalPayload;
        return localClient.entities.TrackedProduct.update(id, rest);
      }

      return localClient.entities.TrackedProduct.create(finalPayload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-tracked-products'] });
      qc.invalidateQueries({ queryKey: ['tracked-products'] });
      setShowForm(false);
      setEditing(null);
      toast.success('Đã lưu sản phẩm theo dõi giá');
    },
    onError: (error) => toast.error(error.message || 'Không thể lưu sản phẩm theo dõi giá'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => localClient.entities.TrackedProduct.delete(id),
    onSuccess: (_, deletedId) => {
      qc.invalidateQueries({ queryKey: ['admin-tracked-products'] });
      qc.invalidateQueries({ queryKey: ['tracked-products'] });
      qc.invalidateQueries({ queryKey: ['tracked-product-history'] });
      if (selectedId === deletedId) {
        setSelectedId('');
      }
      toast.success('Đã xóa sản phẩm theo dõi giá');
    },
    onError: (error) => toast.error(error.message || 'Không thể xóa sản phẩm'),
  });

  const runNowMutation = useMutation({
    mutationFn: (id) => localClient.priceTracking.runNow(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['admin-tracked-products'] });
      qc.invalidateQueries({ queryKey: ['tracked-products'] });
      qc.invalidateQueries({ queryKey: ['tracked-product-history', id] });
      qc.invalidateQueries({ queryKey: ['tracked-product-history'] });
      toast.success('Đã chạy lấy giá ngay cho sản phẩm này');
    },
    onError: (error) => toast.error(error.message || 'Không thể chạy lấy giá ngay'),
  });

  const summary = useMemo(() => ({
    total: trackedProducts.length,
    active: trackedProducts.filter((item) => item.is_active).length,
    withError: trackedProducts.filter((item) => item.last_error).length,
    neverChecked: trackedProducts.filter((item) => !item.last_checked_at).length,
  }), [trackedProducts]);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">Theo dõi giá sản phẩm</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            Thêm URL sản phẩm, ưu tiên lấy giá từ JSON-LD, và chỉ dùng selector khi cần dự phòng.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing({
              ...defaultForm,
              sort_order: trackedProducts.length + 1,
            });
            setShowForm(true);
          }}
          className="h-12 gap-2 rounded-2xl shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Tổng sản phẩm</p>
            <p className="mt-2 text-3xl font-bold">{summary.total}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Đang hoạt động</p>
            <p className="mt-2 text-3xl font-bold">{summary.active}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Chưa check lần nào</p>
            <p className="mt-2 text-3xl font-bold">{summary.neverChecked}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Can xu ly loi</p>
            <p className="mt-2 text-3xl font-bold">{summary.withError}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),420px]">
        <div className="space-y-4">
          {isLoading ? (
            <Card className="rounded-3xl">
              <CardContent className="p-6 text-sm text-muted-foreground">Đang tải danh sách sản phẩm theo dõi giá...</CardContent>
            </Card>
          ) : trackedProducts.length === 0 ? (
            <Card className="rounded-3xl">
              <CardContent className="p-6 text-sm text-muted-foreground">Chưa có sản phẩm nào trong danh sách theo dõi giá.</CardContent>
            </Card>
          ) : (
            trackedProducts.map((product) => (
              <Card
                key={product.id}
                className={`rounded-3xl border transition-colors ${selectedProduct?.id === product.id ? 'border-primary shadow-lg' : 'border-border'}`}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedId(product.id)}
                          className="text-left font-heading text-lg font-bold transition-colors hover:text-primary"
                        >
                          {product.name}
                        </button>
                        <Badge variant="secondary" className="rounded-full">{getTrackedProductPlatformLabel(product.platform)}</Badge>
                        <Badge className={`rounded-full ${product.is_active ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-secondary text-muted-foreground hover:bg-secondary'}`}>
                          {product.is_active ? 'Đang theo dõi' : 'Đã tắt'}
                        </Badge>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Giá hiện tại</p>
                          <p className="mt-1 text-sm font-semibold">{formatTrackedPrice(product.current_price, product.currency || 'VND')}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Lần check gần nhất</p>
                          <p className="mt-1 text-sm font-semibold">{formatTrackedDateTime(product.last_checked_at)}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Slug</p>
                          <p className="mt-1 break-all text-sm font-semibold">{product.slug}</p>
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{product.product_url}</p>
                      {product.price_selector ? (
                        <p className="mt-2 text-xs text-muted-foreground">Selector dự phòng: <code>{product.price_selector}</code></p>
                      ) : null}
                      {product.last_error ? (
                        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          <span className="line-clamp-2">{product.last_error}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() => setSelectedId(product.id)}
                      >
                        <LineChartIcon className="mr-2 h-4 w-4" />
                        Xem biểu đồ
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() => runNowMutation.mutate(product.id)}
                        disabled={runNowMutation.isPending}
                      >
                        <RefreshCw className={`mr-2 h-4 w-4 ${runNowMutation.isPending ? 'animate-spin' : ''}`} />
                        Chạy ngay
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() => {
                          setEditing({
                            ...defaultForm,
                            ...product,
                            current_price: product.current_price || '',
                          });
                          setShowForm(true);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Sửa
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-2xl text-destructive hover:text-destructive"
                        onClick={() => {
                          if (window.confirm('Xóa sản phẩm theo dõi giá này?')) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card className="rounded-3xl">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Lịch sử giá</CardTitle>
              <CardDescription>
                {selectedProduct ? `Theo dõi biến động giá của ${selectedProduct.name}` : 'Chọn sản phẩm để xem lịch sử giá'}
              </CardDescription>
            </div>
            <Select value={historyDays} onValueChange={setHistoryDays}>
              <SelectTrigger className="w-28 rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 ngày</SelectItem>
                <SelectItem value="30">30 ngày</SelectItem>
                <SelectItem value="90">90 ngày</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProduct ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-secondary/20 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Giá hiện tại</p>
                    <p className="mt-2 text-xl font-bold">{formatTrackedPrice(selectedProduct.current_price, selectedProduct.currency || 'VND')}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-secondary/20 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Lần cập nhật</p>
                    <p className="mt-2 text-sm font-semibold">{formatTrackedDateTime(selectedProduct.last_checked_at)}</p>
                  </div>
                </div>
                <PriceHistoryChart
                  history={historyResponse?.history || []}
                  currency={selectedProduct.currency || 'VND'}
                  className={historyLoading ? 'opacity-60' : ''}
                />
                <a
                  href={selectedProduct.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Mở trang sản phẩm gốc
                  <ExternalLink className="h-4 w-4" />
                </a>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                Chưa có sản phẩm nào để hiển thị biểu đồ.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Sửa sản phẩm theo dõi giá' : 'Thêm sản phẩm theo dõi giá'}</DialogTitle>
            <DialogDescription>Nhập URL sản phẩm. Hệ thống sẽ ưu tiên lấy giá từ JSON-LD, selector chỉ dùng làm phương án dự phòng.</DialogDescription>
          </DialogHeader>

          {editing ? (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Tên sản phẩm</Label>
                  <Input value={editing.name} onChange={(event) => setEditing((current) => ({ ...current, name: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={editing.slug || ''} onChange={(event) => setEditing((current) => ({ ...current, slug: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Sàn</Label>
                  <Select value={editing.platform || 'other'} onValueChange={(value) => setEditing((current) => ({ ...current, platform: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRACKED_PRODUCT_PLATFORM_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>URL sản phẩm</Label>
                  <Textarea rows={3} value={editing.product_url} onChange={(event) => setEditing((current) => ({ ...current, product_url: event.target.value }))} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Selector dự phòng</Label>
                  <Input value={editing.price_selector || ''} onChange={(event) => setEditing((current) => ({ ...current, price_selector: event.target.value }))} placeholder=".product-price, [data-price]" />
                </div>
                <div className="space-y-2">
                  <Label>Thứ tự</Label>
                  <Input type="number" value={editing.sort_order || 0} onChange={(event) => setEditing((current) => ({ ...current, sort_order: Number(event.target.value) || 0 }))} />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input value={editing.currency || 'VND'} onChange={(event) => setEditing((current) => ({ ...current, currency: event.target.value || 'VND' }))} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Đang theo dõi</p>
                  <p className="text-xs text-muted-foreground">Tắt nếu tạm thời không muốn cron chạy cho sản phẩm này.</p>
                </div>
                <Switch checked={!!editing.is_active} onCheckedChange={(value) => setEditing((current) => ({ ...current, is_active: value }))} />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowForm(false)}>Hủy</Button>
                <Button
                  onClick={() => saveMutation.mutate(editing)}
                  disabled={saveMutation.isPending || !editing.name || !editing.product_url}
                >
                  {saveMutation.isPending ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
