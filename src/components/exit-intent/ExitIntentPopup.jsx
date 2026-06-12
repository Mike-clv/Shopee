import React from 'react';
import { Gift, TicketPercent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useExitIntent from './useExitIntent';

function isExternalUrl(url) {
  return /^https?:\/\//i.test(String(url || ''));
}

export default function ExitIntentPopup({ config }) {
  const navigate = useNavigate();
  const { isOpen, dismiss } = useExitIntent({
    enabled: Boolean(config?.enabled),
  });

  if (!config?.enabled) {
    return null;
  }

  const handlePrimaryAction = () => {
    dismiss();

    if (!config.buttonUrl) {
      return;
    }

    if (isExternalUrl(config.buttonUrl)) {
      window.open(config.buttonUrl, '_blank', 'noopener');
      return;
    }

    navigate(config.buttonUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) dismiss(); }}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md overflow-hidden rounded-3xl border-0 p-0 shadow-2xl">
        <div className="bg-gradient-to-br from-primary/10 via-background to-background p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Ưu đãi trước khi rời trang</p>
              <DialogTitle className="mt-1 font-heading text-xl">
                {config.title || 'Đừng bỏ lỡ mã giảm giá hot hôm nay'}
              </DialogTitle>
            </div>
          </div>

          <DialogDescription className="text-sm leading-6 text-muted-foreground">
            {config.description || 'Nhận nhanh mã giảm giá và deal đang được áp dụng trên web.'}
          </DialogDescription>

          {config.imageUrl ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
              <img
                src={config.imageUrl}
                alt={config.title || 'Exit intent popup'}
                className="h-44 w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : null}

          {config.couponCode ? (
            <div className="mt-5 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                <TicketPercent className="h-4 w-4" />
                Mã ưu đãi
              </div>
              <p className="mt-3 break-all text-lg font-bold tracking-[0.12em] text-foreground">
                {config.couponCode}
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              className="h-11 flex-1 rounded-2xl"
              onClick={handlePrimaryAction}
            >
              {config.buttonLabel || 'Xem mã giảm giá'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-2xl"
              onClick={dismiss}
            >
              Để sau
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
