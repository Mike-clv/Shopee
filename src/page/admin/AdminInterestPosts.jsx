import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Filter, GripVertical, Loader2, Pencil, Plus, Search, Sparkles, Trash2, X } from 'lucide-react';
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
import { convertAffiliateFieldValue } from '@/lib/affiliate-admin';

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

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'draft', label: 'Nháp' },
  { value: 'published', label: 'Đã xuất bản' },
  { value: 'scheduled', label: 'Hẹn giờ' },
];

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
  const [convertingField, setConvertingField] = useState('');
  const [lastGenerated, setLastGenerated] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const qc = useQueryClient();

  const { data: posts = [] } = useQuery({
    queryKey: ['admin-interest-posts'],
    queryFn: () => localClient.entities.InterestPost.list('sort_order', 100),
  });

  useEffect(() => {
    setOrderedPosts(sortContentByPriority(posts));
  }, [posts]);

  const visiblePosts = useMemo(() => sortContentByPriority(orderedPosts), [orderedPosts]);

  const filtered = useMemo(() => {
    let result = visiblePosts;

    if (filterStatus) {
      result = result.filter((post) => post.status === filterStatus);
    }

    const keyword = search.trim().toLowerCase();
    if (keyword) {
      result = result.filter((post) => (post.title || '').toLowerCase().includes(keyword));
    }

    return result;
  }, [visiblePosts, search, filterStatus]);

  const isFiltering = search.trim().length > 0 || filterStatus;

  const activeFilterCount = [filterStatus].filter(Boolean).length;

  const handleFilterChange = useCallback((setter) => (value) => {
    setter(value);
  }, []);

  const clearFilters = useCallback(() => {
    setFilterStatus('');
    setSearch('');
  }, []);

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

  const generateMutation = useMutation({
    mutationFn: () => localClient.interestPosts.generateFromAccessTrade({ limit: 20 }),
    onSuccess: (result) => {
      setLastGenerated(result);
      qc.invalidateQueries({ queryKey: ['admin-interest-posts'] });
      qc.invalidateQueries({ queryKey: ['interest-posts'] });
      qc.invalidateQueries({ queryKey: ['interest-posts-page'] });
      qc.invalidateQueries({ queryKey: ['homepage'] });
      if (result.createdCount > 0) {
        toast.success(`Đã tạo ${result.createdCount} bài nháp từ sản phẩm Shopee AccessTrade`);
      } else {
        toast.info(result.message || 'Chưa có sản phẩm mới phù hợp để tạo bài.');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể tạo bài từ sản phẩm AccessTrade');
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

    const previousItems = filtered;
    const nextItems = reorderItems(filtered, result.source.index, result.destination.index);
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
          <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">Có Thể Bạn Quan Tâm</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            Tạo bài/card gắn ảnh sản phẩm và link affiliate AccessTrade. Kéo thả để ưu tiên bài anh muốn hiển thị trước.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline" className="h-12 gap-2 rounded-2xl">
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
            className="h-12 gap-2 rounded-2xl shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Thêm bài
          </Button>
        </div>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="mb-5 space-y-3 sm:mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm tiêu đề bài viết..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-xl pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Lọc:</span>
            </div>

            <Select value={filterStatus || 'all'} onValueChange={(v) => handleFilterChange(setFilterStatus)(v === 'all' ? '' : v)}>
              <SelectTrigger className="h-9 w-auto min-w-[130px] rounded-xl text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value || 'all'} value={opt.value || 'all'}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-1 rounded-xl text-xs text-muted-foreground"
                onClick={clearFilters}
              >
                <X className="h-3 w-3" />
                Xóa lọc ({activeFilterCount})
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/5 via-background to-orange-50/70 p-4 shadow-sm sm:mb-6 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Shopee AccessTrade
            </div>
            <h2 className="font-heading text-lg font-bold">Tạo bài nháp từ sản phẩm Shopee</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Hệ thống ưu tiên lấy sản phẩm bán chạy từ AccessTrade. Nếu nguồn đó chưa có dữ liệu, hệ thống sẽ dùng product feed Shopee,
              lọc trùng sản phẩm, bọc link affiliate qua tên miền của anh và tạo bài ở trạng thái nháp để anh duyệt trước khi xuất bản.
            </p>
          </div>
          <Button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="h-12 shrink-0 gap-2 rounded-2xl px-5 shadow-sm"
          >
            {generateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {generateMutation.isPending ? 'Đang tạo bài...' : 'Tạo 20 bài nháp'}
          </Button>
        </div>

        {lastGenerated && (
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs text-muted-foreground">Đã tạo</p>
              <p className="mt-1 text-xl font-bold text-primary">{lastGenerated.createdCount || 0}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs text-muted-foreground">Đã quét</p>
              <p className="mt-1 text-xl font-bold">{lastGenerated.scannedCount || 0}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs text-muted-foreground">Bỏ qua</p>
              <p className="mt-1 text-xl font-bold">{lastGenerated.skippedCount || 0}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs text-muted-foreground">Nguồn datafeed</p>
              <p className="mt-1 text-xl font-bold">{lastGenerated.sources?.datafeeds || 0}</p>
            </div>
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={isFiltering ? undefined : handleDragEnd}>
        <Droppable droppableId="interest-posts">
          {(dropProvided) => (
            <div ref={dropProvided.innerRef} {...dropProvided.droppableProps} className="space-y-3">
              {filtered.map((post, index) => {
                const statusMeta = getContentStatusMeta(post.status, post.published_at);

                return (
                  <Draggable key={post.id} draggableId={post.id} index={index} isDragDisabled={isFiltering}>
                    {(dragProvided, snapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        style={dragProvided.draggableProps.style}
                        className={`grid grid-cols-[40px,88px,minmax(0,1fr)] gap-3 rounded-3xl border border-border bg-card p-4 transition-shadow sm:flex sm:items-center sm:gap-4 sm:p-5 ${
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

                        {post.thumbnail_image && (
                          <img
                            src={post.thumbnail_image}
                            alt={post.title}
                            className="h-20 w-[5.5rem] shrink-0 self-center rounded-2xl object-cover sm:h-14 sm:w-20 sm:self-auto sm:rounded-md"
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
                            {post.target_url && <span className="truncate text-xs text-muted-foreground">Có link affiliate</span>}
                          </div>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">{statusMeta.description}</p>
                        </div>

                        <div className="col-span-3 flex items-center justify-end gap-1 border-t border-border/70 pt-2 sm:col-auto sm:border-t-0 sm:pt-0">
                          {post.target_url && (
                            <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                              <a href={post.target_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}

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
                              if (confirm('Xóa bài này?')) deleteMutation.mutate(post.id);
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
        <DialogContent className="max-h-[90vh] w-[calc(100vw-1rem)] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Sửa Bài Quan Tâm' : 'Thêm Bài Quan Tâm'}</DialogTitle>
            <DialogDescription>
              Tạo bài gợi ý sản phẩm, gắn ảnh thu nhỏ, nội dung và link affiliate để hiển thị ngoài trang chủ.
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
                <Label>Ảnh thu nhỏ URL hoặc /uploads/ten-file.jpg</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input value={editing.thumbnail_image || ''} onChange={(e) => setEditing({ ...editing, thumbnail_image: e.target.value })} />
                  <ImageUploadButton
                    className="w-full sm:w-auto"
                    label="Tải ảnh thu nhỏ"
                    onUploaded={(url) => setEditing((current) => ({ ...current, thumbnail_image: url }))}
                  />
                </div>
                {editing.thumbnail_image && <img src={editing.thumbnail_image} alt="" className="max-h-40 rounded-lg border border-border object-cover" />}
              </div>

              <div>
                <Label>Link sản phẩm hoặc affiliate AccessTrade</Label>
                <Input
                  value={editing.target_url || ''}
                  onChange={(e) => setEditing({ ...editing, target_url: e.target.value })}
                  onBlur={(e) => {
                    void convertAffiliateField('target_url', e.target.value);
                  }}
                  onPaste={(e) => {
                    void handleAffiliatePaste('target_url')(e);
                  }}
                />
                {convertingField === 'target_url' && <p className="mt-1 text-xs text-muted-foreground">Đang chuyển link sản phẩm sang link bọc...</p>}
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
