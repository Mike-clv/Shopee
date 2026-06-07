import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Flame, BadgeCheck, Star } from 'lucide-react';
import { toast } from 'sonner';

const emptyVoucher = {
  title: '', slug: '', code: '', description: '', terms: '',
  discount_type: 'percent', discount_value: '', min_order_value: '', max_discount: '',
  start_date: '', end_date: '', status: 'active', voucher_type: 'coupon',
  platform: 'shopee', brand_id: '', brand_name: '', brand_logo: '',
  category_id: '', category_name: '', original_url: '', tracking_url: '',
  is_hot: false, is_verified: false, is_exclusive: false, is_featured: false,
  sort_order: 0,
};

export default function AdminVouchers() {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: ['admin-vouchers-list'],
    queryFn: () => localClient.entities.Voucher.list('-created_date', 200),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['admin-brands-select'],
    queryFn: () => localClient.entities.Brand.list('name', 100),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories-select'],
    queryFn: () => localClient.entities.Category.list('name', 50),
  });

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
      setShowForm(false);
      setEditing(null);
      toast.success('Đã lưu voucher');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => localClient.entities.Voucher.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-vouchers-list'] });
      toast.success('Đã xóa voucher');
    },
  });

  const filtered = vouchers.filter(v =>
    (v.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.code || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.brand_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (v) => {
    setEditing({ ...v });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditing({ ...emptyVoucher });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!editing.title) { toast.error('Vui lòng nhập tiêu đề'); return; }
    if (!editing.slug) editing.slug = editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    saveMutation.mutate(editing);
  };

  const updateField = (field, value) => setEditing(prev => ({ ...prev, [field]: value }));

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold font-heading">Quản Lý Voucher</h1>
        <Button onClick={handleNew} className="gap-2"><Plus className="w-4 h-4" /> Thêm Voucher</Button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left p-3 font-medium">Voucher</th>
                <th className="text-left p-3 font-medium hidden sm:table-cell">Mã</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Sàn</th>
                <th className="text-left p-3 font-medium hidden lg:table-cell">Trạng thái</th>
                <th className="text-left p-3 font-medium hidden lg:table-cell">Tags</th>
                <th className="text-right p-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Đang tải...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Không có voucher</td></tr>
              ) : (
                filtered.map(v => (
                  <tr key={v.id} className="border-b hover:bg-secondary/30 transition-colors">
                    <td className="p-3">
                      <p className="font-medium line-clamp-1">{v.title}</p>
                      <p className="text-xs text-muted-foreground">{v.brand_name}</p>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      {v.code && <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{v.code}</code>}
                    </td>
                    <td className="p-3 hidden md:table-cell text-xs">{v.platform}</td>
                    <td className="p-3 hidden lg:table-cell">
                      <Badge variant={v.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">{v.status}</Badge>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="flex gap-1">
                        {v.is_hot && <Flame className="w-3.5 h-3.5 text-red-500" />}
                        {v.is_verified && <BadgeCheck className="w-3.5 h-3.5 text-green-500" />}
                        {v.is_exclusive && <Star className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(v)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                          if (confirm('Xóa voucher này?')) deleteMutation.mutate(v.id);
                        }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-1rem)] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Sửa Voucher' : 'Thêm Voucher'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Tiêu đề *</Label>
                  <Input value={editing.title} onChange={e => updateField('title', e.target.value)} />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={editing.slug} onChange={e => updateField('slug', e.target.value)} placeholder="Tự tạo từ tiêu đề" />
                </div>
                <div>
                  <Label>Mã coupon</Label>
                  <Input value={editing.code} onChange={e => updateField('code', e.target.value)} />
                </div>
                <div>
                  <Label>Loại giảm giá</Label>
                  <Select value={editing.discount_type} onValueChange={v => updateField('discount_type', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Giảm %</SelectItem>
                      <SelectItem value="fixed">Giảm tiền</SelectItem>
                      <SelectItem value="cashback">Hoàn tiền</SelectItem>
                      <SelectItem value="freeship">Freeship</SelectItem>
                      <SelectItem value="gift">Quà tặng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Giá trị giảm</Label>
                  <Input value={editing.discount_value} onChange={e => updateField('discount_value', e.target.value)} placeholder="VD: 50%, 100K" />
                </div>
                <div>
                  <Label>Đơn tối thiểu</Label>
                  <Input value={editing.min_order_value} onChange={e => updateField('min_order_value', e.target.value)} />
                </div>
                <div>
                  <Label>Giảm tối đa</Label>
                  <Input value={editing.max_discount} onChange={e => updateField('max_discount', e.target.value)} />
                </div>
                <div>
                  <Label>Loại voucher</Label>
                  <Select value={editing.voucher_type} onValueChange={v => updateField('voucher_type', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coupon">Mã giảm giá</SelectItem>
                      <SelectItem value="deal">Deal</SelectItem>
                      <SelectItem value="cashback">Hoàn tiền</SelectItem>
                      <SelectItem value="freeship">Freeship</SelectItem>
                      <SelectItem value="flash_sale">Flash Sale</SelectItem>
                      <SelectItem value="exclusive">Độc quyền</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sàn</Label>
                  <Select value={editing.platform} onValueChange={v => updateField('platform', v)}>
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
                  <Select value={editing.status} onValueChange={v => updateField('status', v)}>
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
                  <Select value={editing.brand_id || 'none'} onValueChange={v => {
                    const brand = brands.find(b => b.id === v);
                    updateField('brand_id', v === 'none' ? '' : v);
                    if (brand) { updateField('brand_name', brand.name); updateField('brand_logo', brand.logo || ''); }
                  }}>
                    <SelectTrigger><SelectValue placeholder="Chọn thương hiệu" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không chọn</SelectItem>
                      {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Danh mục</Label>
                  <Select value={editing.category_id || 'none'} onValueChange={v => {
                    const cat = categories.find(c => c.id === v);
                    updateField('category_id', v === 'none' ? '' : v);
                    if (cat) updateField('category_name', cat.name);
                  }}>
                    <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không chọn</SelectItem>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ngày bắt đầu</Label>
                  <Input type="date" value={editing.start_date?.split('T')[0] || ''} onChange={e => updateField('start_date', e.target.value)} />
                </div>
                <div>
                  <Label>Ngày hết hạn</Label>
                  <Input type="date" value={editing.end_date?.split('T')[0] || ''} onChange={e => updateField('end_date', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Label>URL gốc</Label>
                  <Input value={editing.original_url} onChange={e => updateField('original_url', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Label>Tracking URL (affiliate)</Label>
                  <Input value={editing.tracking_url} onChange={e => updateField('tracking_url', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Label>Mô tả</Label>
                  <Textarea value={editing.description} onChange={e => updateField('description', e.target.value)} rows={2} />
                </div>
                <div className="col-span-2">
                  <Label>Điều kiện áp dụng</Label>
                  <Textarea value={editing.terms} onChange={e => updateField('terms', e.target.value)} rows={2} />
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_hot} onCheckedChange={v => updateField('is_hot', v)} />
                  <Label>🔥 Hot</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_verified} onCheckedChange={v => updateField('is_verified', v)} />
                  <Label>✅ Verified</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_exclusive} onCheckedChange={v => updateField('is_exclusive', v)} />
                  <Label>⭐ Exclusive</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_featured} onCheckedChange={v => updateField('is_featured', v)} />
                  <Label>📌 Featured</Label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowForm(false)}>Hủy</Button>
                <Button onClick={handleSave} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
