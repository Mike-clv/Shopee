import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const emptyCategory = {
  name: '', slug: '', icon: 'ShoppingBag', description: '',
  seo_title: '', seo_description: '', is_active: true, sort_order: 0,
};

export default function AdminCategories() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: () => localClient.entities.Category.list('sort_order', 50),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) {
        const { id, created_date, updated_date, created_by_id, ...rest } = data;
        return localClient.entities.Category.update(id, rest);
      }
      return localClient.entities.Category.create(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories-list'] });
      setShowForm(false);
      toast.success('Đã lưu danh mục');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => localClient.entities.Category.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories-list'] });
      toast.success('Đã xóa danh mục');
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
        <h1 className="text-2xl font-bold font-heading">Quản Lý Danh Mục</h1>
        <Button onClick={() => { setEditing({ ...emptyCategory }); setShowForm(true); }} className="gap-2"><Plus className="w-4 h-4" /> Thêm</Button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="text-left p-3 font-medium">Danh mục</th>
              <th className="text-left p-3 font-medium hidden sm:table-cell">Slug</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Icon</th>
              <th className="text-center p-3 font-medium">Thứ tự</th>
              <th className="text-right p-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-b hover:bg-secondary/30">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 hidden sm:table-cell text-muted-foreground">{c.slug}</td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{c.icon}</td>
                <td className="p-3 text-center">{c.sort_order}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing({ ...c }); setShowForm(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { if (confirm('Xóa?')) deleteMutation.mutate(c.id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Tên *</Label><Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} /></div>
              <div><Label>Icon (Lucide)</Label><Input value={editing.icon} onChange={e => setEditing({ ...editing, icon: e.target.value })} placeholder="VD: Shirt, Smartphone, Heart" /></div>
              <div><Label>Mô tả</Label><Textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={2} /></div>
              <div><Label>Thứ tự</Label><Input type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-center gap-2"><Switch checked={editing.is_active} onCheckedChange={v => setEditing({ ...editing, is_active: v })} /><Label>Hiện</Label></div>
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
