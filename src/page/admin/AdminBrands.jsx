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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const emptyBrand = {
  name: '', slug: '', logo: '', banner: '', platform: 'shopee',
  description: '', website_url: '', is_featured: false, is_active: true, sort_order: 0,
};

export default function AdminBrands() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: brands = [], isLoading } = useQuery({
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
    if (!editing.name) { toast.error('Vui lòng nhập tên'); return; }
    if (!editing.slug) editing.slug = editing.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    saveMutation.mutate(editing);
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold font-heading">Quản Lý Thương Hiệu</h1>
        <Button onClick={() => { setEditing({ ...emptyBrand }); setShowForm(true); }} className="gap-2"><Plus className="w-4 h-4" /> Thêm</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map(b => (
          <div key={b.id} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden border">
                {b.logo ? <img src={b.logo} alt={b.name} className="w-full h-full object-contain p-1" /> : <span className="font-bold text-muted-foreground">{b.name[0]}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{b.name}</h3>
                <p className="text-xs text-muted-foreground">{b.platform}</p>
              </div>
            </div>
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="sm" onClick={() => { setEditing({ ...b }); setShowForm(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { if (confirm('Xóa?')) deleteMutation.mutate(b.id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Sửa Thương Hiệu' : 'Thêm Thương Hiệu'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Tên *</Label><Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} /></div>
              <div><Label>Logo URL</Label><Input value={editing.logo} onChange={e => setEditing({ ...editing, logo: e.target.value })} /></div>
              <div>
                <Label>Sàn</Label>
                <Select value={editing.platform} onValueChange={v => setEditing({ ...editing, platform: v })}>
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
              <div><Label>Website URL</Label><Input value={editing.website_url} onChange={e => setEditing({ ...editing, website_url: e.target.value })} /></div>
              <div><Label>Mô tả</Label><Textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} /></div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><Switch checked={editing.is_featured} onCheckedChange={v => setEditing({ ...editing, is_featured: v })} /><Label>Nổi bật</Label></div>
                <div className="flex items-center gap-2"><Switch checked={editing.is_active} onCheckedChange={v => setEditing({ ...editing, is_active: v })} /><Label>Hiện</Label></div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowForm(false)}>Hủy</Button>
                <Button onClick={handleSave} disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Đang lưu...' : 'Lưu'}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
