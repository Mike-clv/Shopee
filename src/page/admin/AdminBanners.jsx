import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { localClient } from '@/api/localClient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const createEmptyBanner = (placement) => ({
  title: '',
  image_url: '',
  target_url: '',
  placement,
  is_active: true,
  sort_order: 0,
});

export function BannerManager({
  placement = 'homepage_top',
  title = 'Quản Lý Banner',
  description = 'Đổi ảnh banner, link affiliate và vị trí chiến dịch trên trang chủ.',
  addLabel = 'Thêm banner',
  placementLabel = 'Đầu trang chủ',
}) {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: banners = [] } = useQuery({
    queryKey: ['admin-banners-list', placement],
    queryFn: () => localClient.entities.Banner.filter({ placement }, 'sort_order', 100),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data, placement };
      if (data.id) {
        const { id, created_date, updated_date, ...rest } = payload;
        return localClient.entities.Banner.update(id, rest);
      }
      return localClient.entities.Banner.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-banners-list', placement] });
      qc.invalidateQueries({ queryKey: ['banners'] });
      setShowForm(false);
      toast.success('Đã lưu banner');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => localClient.entities.Banner.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-banners-list', placement] });
      qc.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Đã xóa banner');
    },
  });

  const handleSave = () => {
    if (!editing.title) return toast.error('Vui lòng nhập tiêu đề');
    if (!editing.image_url) return toast.error('Vui lòng nhập đường dẫn ảnh');
    saveMutation.mutate(editing);
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Button onClick={() => { setEditing(createEmptyBanner(placement)); setShowForm(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> {addLabel}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {banners.map(banner => (
          <div key={banner.id} className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="bg-secondary min-h-32 flex items-center justify-center">
              {banner.image_url ? (
                <img src={banner.image_url} alt={banner.title} className="w-full h-auto object-contain" />
              ) : (
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{banner.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{placementLabel} · {banner.is_active ? 'Đang hiện' : 'Đang ẩn'}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing({ ...banner }); setShowForm(true); }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { if (confirm('Xóa banner này?')) deleteMutation.mutate(banner.id); }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              {banner.target_url && <p className="text-xs text-muted-foreground truncate mt-2">{banner.target_url}</p>}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Sửa Banner' : 'Thêm Banner'}</DialogTitle>
            <DialogDescription>
              Quản lý ảnh banner, link khi bấm vào và thứ tự hiển thị cho từng vị trí.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Tiêu đề *</Label><Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><Label>Ảnh banner URL hoặc /uploads/ten-file.jpg *</Label><Input value={editing.image_url || ''} onChange={e => setEditing({ ...editing, image_url: e.target.value })} /></div>
              <div><Label>Link khi bấm vào banner</Label><Input value={editing.target_url || ''} onChange={e => setEditing({ ...editing, target_url: e.target.value })} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Vị trí</Label>
                  <div className="h-10 rounded-md border border-input bg-secondary/60 px-3 flex items-center text-sm font-medium">
                    {placementLabel}
                  </div>
                </div>
                <div><Label>Thứ tự</Label><Input type="number" value={editing.sort_order || 0} onChange={e => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={!!editing.is_active} onCheckedChange={value => setEditing({ ...editing, is_active: value })} />
                <Label>Hiển thị banner</Label>
              </div>
              {editing.image_url && (
                <div className="rounded-lg border border-border bg-secondary overflow-hidden">
                  <img src={editing.image_url} alt={editing.title || 'Preview'} className="w-full h-auto object-contain" />
                </div>
              )}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowForm(false)}>Hủy</Button>
                <Button onClick={handleSave} disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Đang lưu...' : 'Lưu banner'}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminBanners() {
  return (
    <BannerManager
      placement="homepage_top"
      title="Quản Lý Banner Đầu Trang"
      description="Quản lý riêng các banner nằm ngay dưới hero trang chủ."
      addLabel="Thêm banner đầu trang"
      placementLabel="Đầu trang chủ"
    />
  );
}
