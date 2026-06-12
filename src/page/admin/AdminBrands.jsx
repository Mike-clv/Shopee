import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Globe, GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { localClient } from '@/api/localClient';
import BrandLogo from '@/components/brand/BrandLogo';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

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

function sortBrandsByPriority(items = []) {
  return [...items].sort((left, right) => {
    const leftOrder = Number(left.sort_order) || 0;
    const rightOrder = Number(right.sort_order) || 0;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return String(left.name || '').localeCompare(String(right.name || ''), 'vi');
  });
}

function reorderItems(items, startIndex, endIndex) {
  const next = [...items];
  const [removed] = next.splice(startIndex, 1);
  next.splice(endIndex, 0, removed);

  return next.map((item, index) => ({
    ...item,
    sort_order: index + 1,
  }));
}

export default function AdminBrands() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [orderedBrands, setOrderedBrands] = useState([]);
  const qc = useQueryClient();

  const { data: brands = [] } = useQuery({
    queryKey: ['admin-brands-list'],
    queryFn: () => localClient.entities.Brand.list('sort_order', 200),
  });

  useEffect(() => {
    setOrderedBrands(sortBrandsByPriority(brands));
  }, [brands]);

  const visibleBrands = useMemo(() => sortBrandsByPriority(orderedBrands), [orderedBrands]);

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
      qc.invalidateQueries({ queryKey: ['homepage'] });
      setShowForm(false);
      setEditing(null);
      toast.success('Đã lưu thương hiệu');
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể lưu thương hiệu');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (items) => Promise.all(
      items.map((item, index) => localClient.entities.Brand.update(item.id, { sort_order: index + 1 })),
    ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-brands-list'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      toast.success('Đã cập nhật thứ tự thương hiệu');
    },
    onError: (error, _items, previousItems) => {
      if (previousItems) {
        setOrderedBrands(previousItems);
      }

      toast.error(error.message || 'Không thể cập nhật thứ tự thương hiệu');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => localClient.entities.Brand.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-brands-list'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      toast.success('Đã xóa thương hiệu');
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể xóa thương hiệu');
    },
  });

  const handleSave = () => {
    if (!editing?.name) {
      toast.error('Vui lòng nhập tên thương hiệu');
      return;
    }

    const payload = {
      ...editing,
      slug: editing.slug || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    saveMutation.mutate(payload);
  };

  const handleDragEnd = (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const previousItems = visibleBrands;
    const nextItems = reorderItems(visibleBrands, result.source.index, result.destination.index);
    setOrderedBrands(nextItems);
    reorderMutation.mutate(nextItems, { onError: () => setOrderedBrands(previousItems) });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">Quản Lý Thương Hiệu</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            Kéo thả để ưu tiên thương hiệu hiển thị ngoài trang chủ, đồng thời kiểm tra logo, nền tảng
            và đường dẫn website cho từng thương hiệu.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditing({ ...emptyBrand, sort_order: visibleBrands.length + 1 });
            setShowForm(true);
          }}
          className="h-12 gap-2 rounded-2xl shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Thêm thương hiệu
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="brands">
          {(dropProvided) => (
            <div ref={dropProvided.innerRef} {...dropProvided.droppableProps} className="space-y-3">
              {visibleBrands.map((brand, index) => (
                <Draggable key={brand.id} draggableId={brand.id} index={index}>
                  {(dragProvided, snapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      style={dragProvided.draggableProps.style}
                      className={`grid grid-cols-[40px,72px,minmax(0,1fr)] gap-3 rounded-3xl border border-border bg-card p-4 transition-shadow sm:flex sm:items-center sm:gap-4 sm:p-5 ${
                        snapshot.isDragging ? 'shadow-xl ring-1 ring-primary/20' : 'shadow-sm'
                      }`}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        aria-label="Kéo để sắp xếp thương hiệu"
                        className="flex h-10 w-10 shrink-0 self-center cursor-grab touch-none select-none items-center justify-center rounded-full border border-border/70 bg-secondary/40 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground active:cursor-grabbing sm:self-auto"
                        {...dragProvided.dragHandleProps}
                      >
                        <GripVertical className="h-4 w-4" />
                      </div>

                      <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 self-center items-center justify-center overflow-hidden rounded-2xl border bg-secondary sm:h-16 sm:w-16 sm:self-auto">
                        <BrandLogo
                          brand={brand}
                          alt={brand.name}
                          className="h-full w-full object-contain p-1.5"
                          fallbackClassName="font-bold text-muted-foreground"
                        />
                      </div>

                      <div className="min-w-0 flex-1 self-center sm:self-auto">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-2 text-[11px] font-bold text-muted-foreground">
                                #{index + 1}
                              </span>
                              <h3 className="line-clamp-2 text-sm font-semibold leading-5 sm:truncate">
                                {brand.name}
                              </h3>
                            </div>
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
                          <span className="rounded-full bg-secondary px-2.5 py-1">
                            {brand.website_url ? 'Có website' : 'Chưa có website'}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-col gap-2 border-t border-border/70 pt-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0 flex items-center gap-2 text-xs text-muted-foreground">
                            <Globe className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate break-all">
                              {brand.website_url || 'Chưa gắn link website'}
                            </span>
                          </div>

                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-full"
                              onClick={() => {
                                setEditing({ ...brand });
                                setShowForm(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-full text-destructive"
                              onClick={() => {
                                if (confirm('Xóa thương hiệu này?')) {
                                  deleteMutation.mutate(brand.id);
                                }
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
              ))}

              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
                <p className="mb-2 text-xs font-medium text-muted-foreground">Xem trước logo</p>
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
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
                <Input
                  value={editing.website_url}
                  onChange={(e) => setEditing({ ...editing, website_url: e.target.value })}
                />
              </div>

              <div>
                <Label>Mô tả</Label>
                <Textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editing.is_featured}
                    onCheckedChange={(value) => setEditing({ ...editing, is_featured: value })}
                  />
                  <Label>Nổi bật</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={editing.is_active}
                    onCheckedChange={(value) => setEditing({ ...editing, is_active: value })}
                  />
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
