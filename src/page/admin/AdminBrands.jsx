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
import { Plus, Pencil, Trash2, Globe } from 'lucide-react';
import { toast } from 'sonner';
import BrandLogo from '@/components/brand/BrandLogo';

const emptyBrand = {
  name: '',
  slug: '',
  logo: '',
  banner: '',
  platform: 'shopee',
  description: '',
  website_url: '',
  is_featured: false,
  is_active: true,
  sort_order: 0,
};

export default function AdminBrands() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: brands = [] } = useQuery({
    queryKey: ['admin-brands-list'],
    queryFn: () => localClient.entities.Brand.list('sort_order', 200),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) {
        const { id, created_date, updated_date, created_by_id, ...rest } = data;
        return localClient.entities.Brand.update(id, rest);
      }
      return localClient.entities.Brand.create(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-brands-list'] });
      setShowForm(false);
      toast.success('Đã lưu thương hiệu');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => localClient.entities.Brand.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-brands-list'] });
      toast.success('Đã xóa thương hiệu');
    },
  });

  const handleSave = () => {
    if (!editing.name) {
      toast.error('Vui lòng nhập tên');
      return;
    }
    if (!editing.slug) editing.slug = editing.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    saveMutation.mutate(editing);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">Quản Lý Thương Hiệu</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            Kiểm tra logo, nền tảng và trạng thái hiển thị theo kiểu card gọn hơn trên điện thoại.
          </p>
        </div>
        <Button onClick={() => { setEditing({ ...emptyBrand }); setShowForm(true); }} className="h-12 gap-2 rounded-2xl shadow-sm">
          <Plus className="w-4 h-4" />
          Thêm thương hiệu
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {brands.map((brand) => (
          <div key={brand.id} className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-secondary">
                <BrandLogo
                  brand={brand}
                  alt={brand.name}
                  className="h-full w-full object-contain p-1.5"
                  fallbackClassName="font-bold text-muted-foreground"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">{brand.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{brand.platform}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${brand.is_active ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                    {brand.is_active ? 'Đang hiện' : 'Đang ẩn'}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {brand.is_featured ? (
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">Nổi bật</span>
                  ) : null}
                  {brand.website_url ? (
                    <span className="rounded-full bg-secondary px-2.5 py-1">Có website</span>
                  ) : (
                    <span className="rounded-full bg-secondary px-2.5 py-1">Chưa có website</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="h-3.5 w-3.5" />
                <span className="truncate">{brand.website_url || 'Chưa gắn link website'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => { setEditing({ ...brand }); setShowForm(true); }}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-destructive"
                  onClick={() => { if (confirm('Xóa?')) deleteMutation.mutate(brand.id); }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Sửa Thương Hiệu' : 'Thêm Thương Hiệu'}</DialogTitle>
          </DialogHeader>
          {editing ? (
            <div className="space-y-4">
              <div>
                <Label>Tên *</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
              <div>
                <Label>Logo URL</Label>
                <Input value={editing.logo} onChange={(e) => setEditing({ ...editing, logo: e.target.value })} />
              </div>
              <div className="rounded-2xl border border-border bg-secondary/40 p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Preview logo</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border bg-card">
                    <BrandLogo
                      brand={editing}
                      alt={editing.name || 'Brand preview'}
                      className="h-full w-full object-contain p-1.5"
                      fallbackClassName="text-xl font-bold text-muted-foreground"
                      loading="eager"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nếu Logo URL lỗi, web sẽ dùng logo nội bộ hoặc fallback ổn định.
                  </p>
                </div>
              </div>
              <div>
                <Label>Sàn</Label>
                <Select value={editing.platform} onValueChange={(value) => setEditing({ ...editing, platform: value })}>
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
                <Label>Website URL</Label>
                <Input value={editing.website_url} onChange={(e) => setEditing({ ...editing, website_url: e.target.value })} />
              </div>
              <div>
                <Label>Mô tả</Label>
                <Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_featured} onCheckedChange={(value) => setEditing({ ...editing, is_featured: value })} />
                  <Label>Nổi bật</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_active} onCheckedChange={(value) => setEditing({ ...editing, is_active: value })} />
                  <Label>Hiện</Label>
                </div>
              </div>
              <div className="flex justify-end gap-3">
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
