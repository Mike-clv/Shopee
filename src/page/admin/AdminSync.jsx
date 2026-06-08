import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { localClient } from '@/api/localClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STALE_WINDOW_MS = 15 * 60 * 1000;

function isFreshRunningLog(log) {
  if (log?.status !== 'running' || !log?.started_at) return false;
  return Date.now() - new Date(log.started_at).getTime() < STALE_WINDOW_MS;
}

export default function AdminSync() {
  const qc = useQueryClient();

  const { data: syncLogs = [] } = useQuery({
    queryKey: ['sync-logs'],
    queryFn: () => localClient.entities.SyncLog.list('-created_date', 50),
    refetchInterval: (query) => {
      const logs = query.state.data || [];
      return logs.some(isFreshRunningLog) ? 4000 : false;
    },
  });

  const hasRunningSync = syncLogs.some(isFreshRunningLog);

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
    onError: (error) => {
      toast.error(`Sync thất bại: ${error.message || 'Lỗi không xác định'}`);
    },
  });

  const statusConfig = {
    running: { icon: RefreshCw, color: 'bg-blue-100 text-blue-700', label: 'Đang chạy' },
    success: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Thành công' },
    failed: { icon: AlertCircle, color: 'bg-red-100 text-red-700', label: 'Thất bại' },
  };

  const disabled = syncMutation.isPending || hasRunningSync;

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Đồng Bộ AccessTrade</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Khi có phiên sync đang chạy, trang này sẽ tự làm mới để anh theo dõi dễ hơn.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link to="/quan-tam">
            Xem trang Quan tâm
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Cấu hình AccessTrade API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">
              AccessTrade chạy qua API nội bộ. Nếu chưa có API key, thao tác sync sẽ ghi log và trả thông báo cần cấu hình trong `.env`.
            </p>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• API Base: <code>https://api.accesstrade.vn/v1</code></p>
            <p>• Auth header: <code>Authorization: Token &lt;access_key&gt;</code></p>
            <p>• Campaigns: <code>GET /campaigns?approval=successful</code></p>
            <p>• Vouchers/Coupons/Deals: <code>GET /offers_informations/coupon</code></p>
            <p>• Tracking links: dùng link affiliate trả về từ AccessTrade</p>
          </div>
        </CardContent>
      </Card>

      {hasRunningSync && (
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Đang có một phiên sync chạy hoặc vừa mới khởi động. Hệ thống sẽ tự cập nhật lịch sử sync cho anh.
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        {['all', 'campaigns', 'vouchers', 'transactions'].map((type) => (
          <Button
            key={type}
            variant="outline"
            onClick={() => syncMutation.mutate(type)}
            disabled={disabled}
            className="h-auto flex-col gap-2 py-4"
          >
            <RefreshCw className={`h-5 w-5 ${(syncMutation.isPending || hasRunningSync) ? 'animate-spin' : ''}`} />
            <span className="capitalize">{hasRunningSync ? 'Đang sync...' : `Sync ${type}`}</span>
          </Button>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-bold font-heading">Lịch Sử Sync</h2>
      <div className="space-y-3">
        {syncLogs.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Chưa có lịch sử sync</p>
        ) : (
          syncLogs.map((log) => {
            const cfg = statusConfig[log.status] || statusConfig.running;
            const Icon = cfg.icon;
            return (
              <div key={log.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${log.status === 'running' ? 'animate-spin text-blue-500' : log.status === 'success' ? 'text-green-500' : 'text-red-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-medium capitalize">{log.sync_type}</span>
                    <Badge className={`text-[10px] ${cfg.color}`}>{cfg.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{log.message}</p>
                  {log.started_at && (
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
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
