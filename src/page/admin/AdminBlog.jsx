import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { localClient } from '@/api/localClient';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import ImageUploadButton from '@/components/admin/ImageUploadButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  fromDateTimeLocalValue,
  getContentStatusMeta,
  normalizePublicationPayload,
  slugifyVietnamese,
  sortContentByPriority,
  toDateTimeLocalValue,
} from '@/lib/content-admin';
import { convertAffiliateFieldValue } from '@/lib/affiliate-admin';

const emptyPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  cover_target_url: '',
  category: '',
  seo_title: '',
  seo_description: '',
  status: 'draft',
  sort_order: 1000,
  published_at: '',
};

function reorderItems(items, startIndex, endIndex) {
  const next = [...items];
  const [removed] = next.splice(startIndex, 1);
  next.splice(endIndex, 0, removed);
  return next.map((item, index) => ({
    ...item,
    sort_order: index + 1,
  }));
}

export default function AdminBlog() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [orderedPosts, setOrderedPosts] = useState([]);
  const [convertingField, setConvertingField] = useState('');
  const qc = useQueryClient();

  const { data: posts = [] } = useQuery({
    queryKey: ['admin-blog-list'],
    queryFn: () => localClient.entities.BlogPost.list('sort_order', 100),
  });

  useEffect(() => {
    setOrderedPosts(sortContentByPriority(posts));
  }, [posts]);

  const visiblePosts = useMemo(() => sortContentByPriority(orderedPosts), [orderedPosts]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = normalizePublicationPayload(data);
      if (payload.status === 'scheduled' && !payload.published_at) {
        throw new Error('Vui lòng chọn thời gian đăng tự động.');
      }

      if (payload.id) {
        const { id, created_date, updated_date, ...rest } = payload;
        return localClient.entities.BlogPost.update(id, rest);
      }

      return localClient.entities.BlogPost.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog-list'] });
      qc.invalidateQueries({ queryKey: ['blog-posts'] });
      qc.invalidateQueries({ queryKey: ['home-blog-tips'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      setShowForm(false);
      setEditing(null);
      toast.success('Đã lưu bài viết');
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể lưu bài viết');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (items) => Promise.all(
      items.map((item, index) =>
        localClient.entities.BlogPost.update(item.id, { sort_order: index + 1 }),
      ),
    ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog-list'] });
      qc.invalidateQueries({ queryKey: ['blog-posts'] });
      qc.invalidateQueries({ queryKey: ['home-blog-tips'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      toast.success('Đã cập nhật thứ tự bài Blog');
    },
    onError: (error, _items, previousItems) => {
      if (previousItems) {
        setOrderedPosts(previousItems);
      }
      toast.error(error.message || 'Không thể cập nhật thứ tự bài viết');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => localClient.entities.BlogPost.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog-list'] });
      qc.invalidateQueries({ queryKey: ['blog-posts'] });
      qc.invalidateQueries({ queryKey: ['home-blog-tips'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      toast.success('Đã xóa bài viết');
    },
  });

  const handleSave = () => {
    if (!editing.title) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }

    saveMutation.mutate({
      ...editing,
      slug: editing.slug || slugifyVietnamese(editing.title),
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const previousItems = visiblePosts;
    const nextItems = reorderItems(visiblePosts, result.source.index, result.destination.index);
    setOrderedPosts(nextItems);
    reorderMutation.mutate(nextItems, { onError: () => setOrderedPosts(previousItems) });
  };

  const convertAffiliateField = async (field, rawValue) => {
    const trimmed = String(rawValue || '').trim();
    if (!trimmed) return;

    setConvertingField(field);
    try {
      const result = await convertAffiliateFieldValue(trimmed);
      setEditing((current) => {
        if (!current) return current;
        const currentValue = String(current[field] || '').trim();
        if (currentValue !== trimmed) return current;
        return { ...current, [field]: result.cloakedUrl || trimmed };
      });

      if (result.wasCloaked && result.cloakedUrl && result.cloakedUrl !== trimmed) {
        toast.success('Đã chuyển sang link bọc qua tên miền của anh');
      }
    } catch (error) {
      toast.error(error.message || 'Không thể chuyển đổi link affiliate');
    } finally {
      setConvertingField((current) => (current === field ? '' : current));
    }
  };

  const handleAffiliatePaste = (field) => async (event) => {
    const pastedText = event.clipboardData?.getData('text') || '';
    if (!pastedText.trim()) return;

    event.preventDefault();
    const nextValue = pastedText.trim();
    setEditing((current) => (current ? { ...current, [field]: nextValue } : current));
    await convertAffiliateField(field, nextValue);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">Quản Lý Blog</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">Kéo thả để ưu tiên bài nào lên trước ở trang Blog và khu Mẹo săn mã.</p>
        </div>
        <Button
          onClick={() => {
            setEditing({ ...emptyPost, sort_order: visiblePosts.length + 1 });
            setShowForm(true);
          }}
          className="h-12 gap-2 rounded-2xl shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Thêm bài
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blog-posts">
          {(dropProvided) => (
            <div ref={dropProvided.innerRef} {...dropProvided.droppableProps} className="space-y-3">
              {visiblePosts.map((post, index) => {
                const statusMeta = getContentStatusMeta(post.status, post.published_at);

                return (
                  <Draggable key={post.id} draggableId={post.id} index={index}>
                    {(dragProvided, snapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        style={dragProvided.draggableProps.style}
                        className={`grid grid-cols-[40px,72px,minmax(0,1fr)] gap-3 rounded-3xl border border-border bg-card p-4 transition-shadow sm:flex sm:items-center sm:gap-4 sm:p-5 ${
                          snapshot.isDragging ? 'shadow-xl ring-1 ring-primary/20' : ''
                        }`}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          className="flex h-10 w-10 shrink-0 self-center cursor-grab touch-none select-none items-center justify-center rounded-full border border-border/70 bg-secondary/40 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground active:cursor-grabbing sm:self-auto"
                          aria-label="Keo de sap xep"
                          {...dragProvided.dragHandleProps}
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>

                        {post.cover_image && (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="h-[4.5rem] w-[4.5rem] shrink-0 self-center rounded-2xl object-cover sm:h-12 sm:w-16 sm:self-auto sm:rounded-lg"
                          />
                        )}

                        <div className="min-w-0 flex-1 self-center sm:self-auto">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-2 text-[11px] font-bold text-muted-foreground">
                              #{index + 1}
                            </span>
                            <h3 className="line-clamp-2 text-sm font-semibold leading-5 sm:truncate">{post.title}</h3>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <Badge variant={statusMeta.variant} className="text-[10px]">{statusMeta.label}</Badge>
                            {post.category && <span className="text-xs text-muted-foreground">{post.category}</span>}
                          </div>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">{statusMeta.description}</p>
                        </div>

                        <div className="col-span-3 flex items-center justify-end gap-1 border-t border-border/70 pt-2 sm:col-auto sm:border-t-0 sm:pt-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                            onClick={() => {
                              setEditing({ ...post });
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
                              if (confirm('Xóa bài viết này?')) deleteMutation.mutate(post.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-1rem)] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Sửa Bài Viết' : 'Thêm Bài Viết'}</DialogTitle>
            <DialogDescription>
              Viết bài blog, chọn trạng thái xuất bản ngay hoặc hẹn giờ đăng tự động.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Tiêu đề *</Label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={editing.slug || ''}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="vi-du-meo-san-sale"
                />
                <p className="text-xs text-muted-foreground">Slug là đoạn cuối trong đường link bài viết, ví dụ `/blog/vi-du-meo-san-sale`.</p>
              </div>

              <div className="space-y-2">
                <Label>Ảnh bìa URL</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={editing.cover_image || ''}
                    onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })}
                    placeholder="/uploads/ten-anh.jpg hoặc URL ảnh"
                  />
                  <ImageUploadButton
                    className="w-full sm:w-auto"
                    label="Tải ảnh bìa"
                    onUploaded={(url) => setEditing((current) => ({ ...current, cover_image: url }))}
                  />
                </div>
                {editing.cover_image && <img src={editing.cover_image} alt="" className="max-h-40 rounded-lg border border-border object-cover" />}
              </div>

              <div>
                <Label>Link khi bấm vào ảnh bìa</Label>
                <Input
                  value={editing.cover_target_url || ''}
                  onChange={(e) => setEditing({ ...editing, cover_target_url: e.target.value })}
                  onBlur={(e) => {
                    void convertAffiliateField('cover_target_url', e.target.value);
                  }}
                  onPaste={(e) => {
                    void handleAffiliatePaste('cover_target_url')(e);
                  }}
                  placeholder="https://link-affiliate-cua-anh.com"
                />
                {convertingField === 'cover_target_url' && <p className="mt-1 text-xs text-muted-foreground">Đang chuyển link sản phẩm sang link bọc...</p>}
                <p className="mt-2 text-xs text-muted-foreground">
                  Nếu điền link này, khi người dùng bấm vào ảnh bìa ở trang chi tiết bài viết sẽ mở sang URL anh gắn.
                </p>
              </div>

              <div>
                <Label>Danh mục</Label>
                <Input value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              </div>

              <div>
                <Label>Tóm tắt</Label>
                <Textarea value={editing.excerpt || ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>SEO title</Label>
                  <Input
                    value={editing.seo_title || ''}
                    onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })}
                    placeholder="Tiêu đề tối ưu SEO cho Google"
                  />
                </div>
                <div>
                  <Label>SEO description</Label>
                  <Textarea
                    value={editing.seo_description || ''}
                    onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })}
                    rows={2}
                    placeholder="Mô tả ngắn khoảng 140-160 ký tự"
                  />
                </div>
              </div>

              <div>
                <Label>Nội dung bài viết</Label>
                <MarkdownEditor value={editing.content || ''} onChange={(value) => setEditing({ ...editing, content: value })} rows={12} />
                <p className="mt-2 text-xs text-muted-foreground">
                  Khi lưu bài, các link sản phẩm Shopee, Lazada, Tiki, TikTok Shop trong markdown sẽ tự động đổi sang link bọc `/go/...`.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Trạng thái</Label>
                  <Select value={editing.status || 'draft'} onValueChange={(value) => setEditing({ ...editing, status: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Nháp</SelectItem>
                      <SelectItem value="published">Xuất bản ngay</SelectItem>
                      <SelectItem value="scheduled">Hẹn giờ đăng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Thứ tự</Label>
                  <Input
                    type="number"
                    value={editing.sort_order || 0}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) || 0 })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label>Thời gian đăng</Label>
                  <Input
                    type="datetime-local"
                    value={toDateTimeLocalValue(editing.published_at)}
                    onChange={(e) => setEditing({ ...editing, published_at: fromDateTimeLocalValue(e.target.value) })}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
                Nếu chọn `Hẹn giờ đăng`, bài sẽ tự chuyển sang trạng thái xuất bản khi đến đúng thời gian anh đặt.
              </div>

              <div className="flex justify-end gap-3">
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
