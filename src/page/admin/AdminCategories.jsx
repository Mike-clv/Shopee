import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

const emptyCategory = {
  name: '',
  slug: '',
  icon: 'ShoppingBag',
  description: '',
  seo_title: '',
  seo_description: '',
  is_active: true,
  sort_order: 0,
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
          <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">Quản Lý Danh Mục</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            Sắp xếp danh mục, chỉnh icon và quản lý trạng thái hiển thị dễ nhìn hơn trên mobile.
          </p>
        </div>
        <Button onClick={() => { setEditing({ ...emptyCategory }); setShowForm(true); }} className="h-12 gap-2 rounded-2xl shadow-sm">
          <Plus className="w-4 h-4" />
          Thêm danh mục
        </Button>
      </div>

      <div className="space-y-3 md:hidden">
        {categories.map((category) => (
          <div key={category.id} className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                <FolderOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{category.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{category.slug}</p>
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    #{category.sort_order || 0}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-secondary px-2.5 py-1">{category.icon || 'ShoppingBag'}</span>
                  <span className={`rounded-full px-2.5 py-1 ${category.is_active ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                    {category.is_active ? 'Đang hiện' : 'Đang ẩn'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/70 pt-3">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => { setEditing({ ...category }); setShowForm(true); }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-destructive"
                onClick={() => { if (confirm('Xóa?')) deleteMutation.mutate(category.id); }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="p-3 text-left font-medium">Danh mục</th>
                <th className="hidden p-3 text-left font-medium sm:table-cell">Slug</th>
                <th className="hidden p-3 text-left font-medium md:table-cell">Icon</th>
                <th className="p-3 text-center font-medium">Thứ tự</th>
                <th className="p-3 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b hover:bg-secondary/30">
                  <td className="p-3 font-medium">{category.name}</td>
                  <td className="hidden p-3 text-muted-foreground sm:table-cell">{category.slug}</td>
                  <td className="hidden p-3 text-muted-foreground md:table-cell">{category.icon}</td>
                  <td className="p-3 text-center">{category.sort_order}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => { setEditing({ ...category }); setShowForm(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full text-destructive"
                        onClick={() => { if (confirm('Xóa?')) deleteMutation.mutate(category.id); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}</DialogTitle>
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
                <Label>Icon (Lucide)</Label>
                <Input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="VD: Shirt, Smartphone, Heart" />
              </div>
              <div>
                <Label>Mô tả</Label>
                <Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} />
              </div>
              <div>
                <Label>Thứ tự</Label>
                <Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value, 10) || 0 })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editing.is_active} onCheckedChange={(value) => setEditing({ ...editing, is_active: value })} />
                <Label>Hiện</Label>
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
