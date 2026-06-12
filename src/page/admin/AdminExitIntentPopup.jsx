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
      toast.success('Da luu cau hinh Exit Intent Popup');
    },
    onError: (error) => {
      toast.error(error.message || 'Khong the luu cau hinh popup');
    },
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">Exit Intent Popup</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          Quan ly popup giu khach truoc khi roi trang. Mobile chi kich hoat khi nguoi dung da cuon sau va vuot nguoc nhanh de thoat.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),380px]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Cau hinh popup</CardTitle>
            <CardDescription>Cap nhat noi dung, ma uu dai va duong dan khi nguoi dung bam vao popup.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/30 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Bat popup</p>
                <p className="text-xs text-muted-foreground">Tat khi anh khong muon popup hien tren trang public.</p>
              </div>
              <Switch
                checked={!!form.enabled}
                onCheckedChange={(value) => setForm((current) => ({ ...current, enabled: value }))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Tieu de</Label>
                <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Mo ta</Label>
                <Textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Ma uu dai</Label>
                <Input value={form.couponCode} onChange={(event) => setForm((current) => ({ ...current, couponCode: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Text nut</Label>
                <Input value={form.buttonLabel} onChange={(event) => setForm((current) => ({ ...current, buttonLabel: event.target.value }))} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Link nut bam</Label>
                <Input value={form.buttonUrl} onChange={(event) => setForm((current) => ({ ...current, buttonUrl: event.target.value }))} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>URL anh popup</Label>
                <Input value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || isLoading} className="gap-2 rounded-2xl">
                <Save className="h-4 w-4" />
                {saveMutation.isPending ? 'Dang luu...' : 'Luu cau hinh'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-primary/10">
          <CardHeader>
            <CardTitle>Xem nhanh giao dien</CardTitle>
            <CardDescription>Preview nhanh noi dung popup tren giao dien public.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-primary/10 via-background to-background p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <MousePointerClick className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold">{form.title || 'Tieu de popup'}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {form.description || 'Noi dung popup se hien tai day.'}
              </p>
              {form.imageUrl ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
                  <img src={form.imageUrl} alt={form.title || 'Preview popup'} className="h-40 w-full object-cover" />
                </div>
              ) : null}
              {form.couponCode ? (
                <div className="mt-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-center text-lg font-bold tracking-[0.12em]">
                  {form.couponCode}
                </div>
              ) : null}
              <Button className="mt-5 h-11 w-full rounded-2xl">{form.buttonLabel || 'Xem ma giam gia'}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
