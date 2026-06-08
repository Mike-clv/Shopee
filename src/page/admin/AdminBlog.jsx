import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import ImageUploadButton from '@/components/admin/ImageUploadButton';
import {
  fromDateTimeLocalValue,
  getContentStatusMeta,
  normalizePublicationPayload,
  slugifyVietnamese,
  toDateTimeLocalValue,
} from '@/lib/content-admin';

const emptyPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  category: '',
  seo_title: '',
  seo_description: '',
  status: 'draft',
  published_at: '',
};

export default function AdminBlog() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: posts = [] } = useQuery({
    queryKey: ['admin-blog-list'],
    queryFn: () => localClient.entities.BlogPost.list('-created_date', 100),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = normalizePublicationPayload(data);
      if (payload.status === 'scheduled' && !payload.published_at) {
        throw new Error('Vui lòng chọn thời gian đăng tự động.');
      }

      if (payload.id) {
        const { id, created_date, updated_date, created_by_id, ...rest } = payload;
        return localClient.entities.BlogPost.update(id, rest);
      }

      return localClient.entities.BlogPost.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog-list'] });
      qc.invalidateQueries({ queryKey: ['blog-posts'] });
      qc.invalidateQueries({ queryKey: ['home-blog-tips'] });
      setShowForm(false);
      setEditing(null);
      toast.success('Đã lưu bài viết');
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể lưu bài viết');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => localClient.entities.BlogPost.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog-list'] });
      qc.invalidateQueries({ queryKey: ['blog-posts'] });
      qc.invalidateQueries({ queryKey: ['home-blog-tips'] });
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

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold font-heading">Quản Lý Blog</h1>
        <Button onClick={() => { setEditing({ ...emptyPost }); setShowForm(true); }} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm bài
        </Button>
      </div>

      <div className="space-y-3">
        {posts.map((post) => {
          const statusMeta = getContentStatusMeta(post.status, post.published_at);

          return (
            <div key={post.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              {post.cover_image && <img src={post.cover_image} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">{post.title}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={statusMeta.variant} className="text-[10px]">{statusMeta.label}</Badge>
                  {post.category && <span className="text-xs text-muted-foreground">{post.category}</span>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{statusMeta.description}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing({ ...post }); setShowForm(true); }}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { if (confirm('Xóa bài viết này?')) deleteMutation.mutate(post.id); }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

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
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="vi-du-meo-san-sale"
                />
                <p className="text-xs text-muted-foreground">Slug là đoạn cuối trong đường link bài viết, ví dụ `/blog/vi-du-meo-san-sale`.</p>
              </div>

              <div className="space-y-2">
                <Label>Ảnh bìa URL</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={editing.cover_image}
                    onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })}
                    placeholder="/uploads/ten-anh.jpg hoặc URL ảnh"
                  />
                  <ImageUploadButton
                    className="w-full sm:w-auto"
                    label="Upload ảnh bìa"
                    onUploaded={(url) => setEditing((current) => ({ ...current, cover_image: url }))}
                  />
                </div>
                {editing.cover_image && <img src={editing.cover_image} alt="" className="max-h-40 rounded-lg border border-border object-cover" />}
              </div>

              <div>
                <Label>Danh mục</Label>
                <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              </div>

              <div>
                <Label>Tóm tắt</Label>
                <Textarea value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} />
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
                  Nút `MUA NGAY` sẽ chèn mẫu `[MUA NGAY](https://)`. Anh chỉ cần thay URL phía sau bằng link sản phẩm hoặc affiliate của anh.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Trạng thái</Label>
                  <Select value={editing.status} onValueChange={(value) => setEditing({ ...editing, status: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Nháp</SelectItem>
                      <SelectItem value="published">Xuất bản ngay</SelectItem>
                      <SelectItem value="scheduled">Hẹn giờ đăng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
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
