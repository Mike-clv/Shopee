import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const emptyPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  thumbnail_image: '',
  target_url: '',
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

export default function AdminInterestPosts() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [orderedPosts, setOrderedPosts] = useState([]);
  const qc = useQueryClient();

  const { data: posts = [] } = useQuery({
    queryKey: ['admin-interest-posts'],
    queryFn: () => localClient.entities.InterestPost.list('sort_order', 100),
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
        return localClient.entities.InterestPost.update(id, rest);
      }

      return localClient.entities.InterestPost.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-interest-posts'] });
      qc.invalidateQueries({ queryKey: ['interest-posts'] });
      qc.invalidateQueries({ queryKey: ['interest-posts-page'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      setShowForm(false);
      setEditing(null);
      toast.success('Đã lưu bài Quan tâm');
    },
    onError: (error) => toast.error(error.message || 'Không thể lưu bài Quan tâm'),
  });

  const reorderMutation = useMutation({
    mutationFn: async (items) => Promise.all(
      items.map((item, index) =>
        localClient.entities.InterestPost.update(item.id, { sort_order: index + 1 }),
      ),
    ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-interest-posts'] });
      qc.invalidateQueries({ queryKey: ['interest-posts'] });
      qc.invalidateQueries({ queryKey: ['interest-posts-page'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      toast.success('Đã cập nhật thứ tự hiển thị');
    },
    onError: (error, _items, previousItems) => {
      if (previousItems) {
        setOrderedPosts(previousItems);
      }
      toast.error(error.message || 'Không thể cập nhật thứ tự');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => localClient.entities.InterestPost.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-interest-posts'] });
      qc.invalidateQueries({ queryKey: ['interest-posts'] });
      qc.invalidateQueries({ queryKey: ['interest-posts-page'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      toast.success('Đã xóa bài Quan tâm');
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

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Có Thể Bạn Quan Tâm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tạo bài/card gắn ảnh sản phẩm và link affiliate AccessTrade. Kéo thả để ưu tiên bài anh muốn hiển thị trước.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/quan-tam">
              Xem trang Quan tâm
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            onClick={() => {
              setEditing({ ...emptyPost, sort_order: visiblePosts.length + 1 });
              setShowForm(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Thêm bài
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="interest-posts">
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
                        className={`flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-shadow ${
                          snapshot.isDragging ? 'shadow-xl ring-1 ring-primary/20' : ''
                        }`}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          className="flex h-10 w-10 shrink-0 cursor-grab touch-none select-none items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground active:cursor-grabbing"
                          aria-label="Keo de sap xep"
                          {...dragProvided.dragHandleProps}
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>

                        {post.thumbnail_image && (
                          <img
                            src={post.thumbnail_image}
                            alt={post.title}
                            className="h-14 w-20 shrink-0 rounded-md object-cover"
                          />
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-2 text-[11px] font-bold text-muted-foreground">
                              #{index + 1}
                            </span>
                            <h3 className="truncate text-sm font-semibold">{post.title}</h3>
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <Badge variant={statusMeta.variant} className="text-[10px]">{statusMeta.label}</Badge>
                            {post.target_url && <span className="truncate text-xs text-muted-foreground">Có link affiliate</span>}
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">{statusMeta.description}</p>
                        </div>

                        <div className="flex shrink-0 gap-1">
                          {post.target_url && (
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                              <a href={post.target_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditing({ ...post });
                              setShowForm(true);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              if (confirm('Xóa bài này?')) deleteMutation.mutate(post.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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
        <DialogContent className="max-h-[90vh] w-[calc(100vw-1rem)] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Sửa Bài Quan Tâm' : 'Thêm Bài Quan Tâm'}</DialogTitle>
            <DialogDescription>
              Tạo bài gợi ý sản phẩm, gắn thumbnail, nội dung và link affiliate để hiển thị ngoài trang chủ.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Tiêu đề *</Label>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={editing.slug || ''}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder="goi-y-san-pham-noi-bat"
                  />
                  <p className="text-xs text-muted-foreground">Slug là phần đường link ngắn gọn để hệ thống tạo URL dễ nhớ.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ảnh thumbnail URL hoặc /uploads/ten-file.jpg</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input value={editing.thumbnail_image || ''} onChange={(e) => setEditing({ ...editing, thumbnail_image: e.target.value })} />
                  <ImageUploadButton
                    className="w-full sm:w-auto"
                    label="Upload thumbnail"
                    onUploaded={(url) => setEditing((current) => ({ ...current, thumbnail_image: url }))}
                  />
                </div>
                {editing.thumbnail_image && <img src={editing.thumbnail_image} alt="" className="max-h-40 rounded-lg border border-border object-cover" />}
              </div>

              <div>
                <Label>Link sản phẩm hoặc affiliate AccessTrade</Label>
                <Input value={editing.target_url || ''} onChange={(e) => setEditing({ ...editing, target_url: e.target.value })} />
                <p className="mt-2 text-xs text-muted-foreground">
                  Link này sẽ được dùng cho nút ưu đãi và cả ảnh bìa của bài Quan tâm khi người dùng bấm vào.
                </p>
              </div>

              <div>
                <Label>Tóm tắt</Label>
                <Textarea value={editing.excerpt || ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} />
              </div>

              <div>
                <Label>Nội dung bài viết</Label>
                <MarkdownEditor value={editing.content || ''} onChange={(value) => setEditing({ ...editing, content: value })} rows={10} />
                <p className="mt-2 text-xs text-muted-foreground">
                  Nút `MUA NGAY` sẽ chèn mẫu `[MUA NGAY](https://)`. Nút `Ảnh + link` sẽ chèn mẫu `[![mo-ta-anh](https://url-anh)](https://link-affiliate)` để người dùng bấm vào ảnh trong nội dung cũng ra đúng link của anh.
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
                  <Input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) || 0 })} />
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
                Bài ở trạng thái `Hẹn giờ đăng` sẽ tự động xuất bản đúng thời điểm anh cài, không cần vào admin bấm tay lại.
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowForm(false)}>Hủy</Button>
                <Button onClick={handleSave} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Đang lưu...' : 'Lưu bài'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
