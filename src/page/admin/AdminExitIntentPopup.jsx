import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MousePointerClick, Save } from 'lucide-react';
import { toast } from 'sonner';
import { localClient } from '@/api/localClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { convertAffiliateFieldValue } from '@/lib/affiliate-admin';

const defaultForm = {
  enabled: false,
  title: '',
  description: '',
  couponCode: '',
  buttonLabel: '',
  buttonUrl: '',
  imageUrl: '',
};

export default function AdminExitIntentPopup() {
  const qc = useQueryClient();
  const [form, setForm] = useState(defaultForm);
  const [convertingField, setConvertingField] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-exit-intent-popup'],
    queryFn: () => localClient.settings.getAdminExitIntentPopup(),
  });

  useEffect(() => {
    if (data) {
      setForm({
        ...defaultForm,
        ...data,
      });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload) => localClient.settings.saveAdminExitIntentPopup(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-exit-intent-popup'] });
      qc.invalidateQueries({ queryKey: ['exit-intent-popup'] });
      toast.success('Đã lưu cấu hình popup giữ khách');
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể lưu cấu hình popup');
    },
  });

  const convertAffiliateField = async (field, rawValue) => {
    const trimmed = String(rawValue || '').trim();
    if (!trimmed) return;

    setConvertingField(field);
    try {
      const result = await convertAffiliateFieldValue(trimmed);
      setForm((current) => {
        if (String(current[field] || '').trim() !== trimmed) return current;
        return { ...current, [field]: result.cloakedUrl || trimmed };
      });

      if (result.wasCloaked && result.cloakedUrl && result.cloakedUrl !== trimmed) {
        toast.success('Đã chuyển link nút bấm sang link affiliate bọc');
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
    setForm((current) => ({ ...current, [field]: nextValue }));
    await convertAffiliateField(field, nextValue);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">Popup giữ khách trước khi rời trang</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          Quản lý popup giữ khách trước khi rời trang. Mobile chỉ kích hoạt khi người dùng đã cuộn sâu và vuốt ngược nhanh để thoát.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),380px]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Cấu hình popup</CardTitle>
            <CardDescription>Cập nhật nội dung, mã ưu đãi và đường dẫn khi người dùng bấm vào popup.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/30 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Bật popup</p>
                <p className="text-xs text-muted-foreground">Tắt khi anh không muốn popup hiện trên trang public.</p>
              </div>
              <Switch
                checked={!!form.enabled}
                onCheckedChange={(value) => setForm((current) => ({ ...current, enabled: value }))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Tiêu đề</Label>
                <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Mô tả</Label>
                <Textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Mã ưu đãi</Label>
                <Input value={form.couponCode} onChange={(event) => setForm((current) => ({ ...current, couponCode: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Chữ trên nút</Label>
                <Input value={form.buttonLabel} onChange={(event) => setForm((current) => ({ ...current, buttonLabel: event.target.value }))} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Link nút bấm</Label>
                <Input
                  value={form.buttonUrl}
                  onChange={(event) => setForm((current) => ({ ...current, buttonUrl: event.target.value }))}
                  onBlur={(event) => {
                    void convertAffiliateField('buttonUrl', event.target.value);
                  }}
                  onPaste={(event) => {
                    void handleAffiliatePaste('buttonUrl')(event);
                  }}
                />
                {convertingField === 'buttonUrl' && (
                  <p className="text-xs text-muted-foreground">Đang chuyển link nút bấm sang link affiliate bọc...</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>URL ảnh popup</Label>
                <Input value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || isLoading} className="gap-2 rounded-2xl">
                <Save className="h-4 w-4" />
                {saveMutation.isPending ? 'Đang lưu...' : 'Lưu cấu hình'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-primary/10">
          <CardHeader>
            <CardTitle>Xem nhanh giao diện</CardTitle>
            <CardDescription>Xem nhanh nội dung popup trên giao diện public.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-primary/10 via-background to-background p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <MousePointerClick className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold">{form.title || 'Đừng bỏ lỡ mã giảm giá hot hôm nay'}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {form.description || 'Nhận nhanh mã giảm giá và ưu đãi đang được áp dụng trên web.'}
              </p>
              {form.imageUrl ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
                  <img src={form.imageUrl} alt={form.title || 'Xem trước popup'} className="h-40 w-full object-cover" />
                </div>
              ) : null}
              {form.couponCode ? (
                <div className="mt-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-center text-lg font-bold tracking-[0.12em]">
                  {form.couponCode}
                </div>
              ) : null}
              <Button className="mt-5 h-11 w-full rounded-2xl">{form.buttonLabel || 'Xem mã giảm giá'}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
