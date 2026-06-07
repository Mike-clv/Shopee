import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSync() {
  const qc = useQueryClient();

  const { data: syncLogs = [], isLoading } = useQuery({
    queryKey: ['sync-logs'],
    queryFn: () => localClient.entities.SyncLog.list('-created_date', 50),
  });

  const syncMutation = useMutation({
    mutationFn: async (syncType) => {
      const response = await localClient.functions.invoke('syncAccessTrade', { sync_type: syncType });
      return response.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['sync-logs'] });
      if (data.success) {
        toast.success(`Sync thành công: ${data.items_synced || 0} mục`);
      } else {
        toast.info(data.message || 'Cần cấu hình API key');
      }
    },
    onError: (err) => toast.error('Sync thất bại: ' + (err.message || 'Lỗi không xác định')),
  });

  const statusConfig = {
    running: { icon: RefreshCw, color: 'bg-blue-100 text-blue-700', label: 'Đang chạy' },
    success: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Thành công' },
    failed: { icon: AlertCircle, color: 'bg-red-100 text-red-700', label: 'Thất bại' },
  };

  return (
    <div className="p-3 sm:p-6">
      <h1 className="text-2xl font-bold font-heading mb-6">Đồng Bộ AccessTrade</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Cấu hình AccessTrade API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary rounded-lg p-4 mb-4">
            <p className="text-sm text-muted-foreground">
              AccessTrade chạy qua API nội bộ. Nếu chưa có API key, thao tác sync sẽ ghi log và trả thông báo cần cấu hình trong `.env`.
            </p>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• API Base: <code>https://api.accesstrade.vn/v1</code></p>
            <p>• Auth header: <code>Authorization: Token &lt;access_key&gt;</code></p>
            <p>• Campaigns: <code>GET /campaigns?approval=successful</code></p>
            <p>• Vouchers/Coupons/Deals: <code>GET /offers_informations/coupon</code></p>
            <p>• Tracking links: dùng link affiliate trả về từ AccessTrade</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        {['all', 'campaigns', 'vouchers', 'transactions'].map(type => (
          <Button
            key={type}
            variant="outline"
            onClick={() => syncMutation.mutate(type)}
            disabled={syncMutation.isPending}
            className="h-auto py-4 flex-col gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
            <span className="capitalize">Sync {type}</span>
          </Button>
        ))}
      </div>

      <h2 className="text-lg font-bold font-heading mb-4">Lịch Sử Sync</h2>
      <div className="space-y-3">
        {syncLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Chưa có lịch sử sync</p>
        ) : (
          syncLogs.map(log => {
            const cfg = statusConfig[log.status] || statusConfig.running;
            const Icon = cfg.icon;
            return (
              <div key={log.id} className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${log.status === 'running' ? 'animate-spin text-blue-500' : log.status === 'success' ? 'text-green-500' : 'text-red-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm capitalize">{log.sync_type}</span>
                    <Badge className={`text-[10px] ${cfg.color}`}>{cfg.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{log.message}</p>
                  {log.started_at && (
                    <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.started_at).toLocaleString('vi-VN')}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
