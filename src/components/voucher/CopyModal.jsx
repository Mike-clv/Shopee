import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function CopyModal({ voucher, onClose, copied: initialCopied }) {
  const [copied, setCopied] = useState(initialCopied);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      toast.success('Đã copy mã thành công!');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.info('Vui lòng copy mã thủ công từ ô bên dưới');
    }
  };

  const handleGoToShop = () => {
    const url = voucher.tracking_url || voucher.original_url || '#';
    window.open(url, '_blank', 'noopener');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-heading">🎉 Mã giảm giá của bạn</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">{voucher.title}</p>
            <div className="relative">
              <Input
                readOnly
                value={voucher.code}
                className="text-center text-xl font-mono font-bold tracking-wider h-14 bg-primary/5 border-2 border-dashed border-primary/40"
                onClick={(e) => e.target.select()}
              />
              <Button
                size="sm"
                variant={copied ? 'default' : 'outline'}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={handleCopy}
              >
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? 'Đã copy' : 'Copy'}
              </Button>
            </div>
          </div>

          {voucher.terms && (
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">Điều kiện áp dụng:</p>
              <p className="text-xs text-muted-foreground">{voucher.terms}</p>
            </div>
          )}

          {voucher.end_date && (
            <p className="text-xs text-center text-muted-foreground">
              Hạn sử dụng: {new Date(voucher.end_date).toLocaleDateString('vi-VN')}
            </p>
          )}

          <Button onClick={handleGoToShop} className="w-full rounded-full h-12 text-base font-semibold">
            <ExternalLink className="w-4 h-4 mr-2" />
            Đi đến {voucher.brand_name || 'cửa hàng'}
          </Button>

          <p className="text-[10px] text-muted-foreground text-center">
            Dán mã vào ô "Mã giảm giá" khi thanh toán để được giảm giá
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}