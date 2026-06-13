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

const syncTypeLabels = {
  all: 'Toàn bộ',
  campaigns: 'Chiến dịch',
  vouchers: 'Voucher',
  transactions: 'Giao dịch',
};

export default function AdminSync() {
  const qc = useQueryClient();
  const stopAutoSyncRef = React.useRef(false);
  const [autoSyncState, setAutoSyncState] = React.useState(null);

  const { data: syncLogs = [] } = useQuery({
    queryKey: ['sync-logs'],
    queryFn: () => localClient.entities.SyncLog.list('-created_date', 50),
    refetchInterval: autoSyncState
      ? 3000
      : (query) => {
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
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['sync-logs'] });
    },
  });

  const runSyncUntilComplete = React.useCallback(async (syncType) => {
    stopAutoSyncRef.current = false;
    let round = 0;

    setAutoSyncState({
      syncType,
      round: 0,
      itemsSynced: 0,
      message: 'Đang khởi động phiên đồng bộ đầu tiên...',
    });

    try {
      while (!stopAutoSyncRef.current) {
        round += 1;
        setAutoSyncState((current) => ({
          ...current,
          syncType,
          round,
          message: `Đang chạy lượt ${round}...`,
        }));

        const data = await syncMutation.mutateAsync(syncType);

        if (!data?.success) {
          setAutoSyncState(null);
          toast.error(data?.message || 'Không thể tiếp tục đồng bộ AccessTrade.');
          return;
        }

        setAutoSyncState({
          syncType,
          round,
          itemsSynced: Number(data.items_synced || 0),
          message: data.message || `Đã xử lý ${Number(data.items_synced || 0)} mục.`,
        });

        if (data.completed !== false) {
          setAutoSyncState(null);
          toast.success(`Đồng bộ hoàn tất sau ${round} lượt. Đã xử lý ${Number(data.items_synced || 0)} mục.`);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1200));
      }

      setAutoSyncState(null);
      toast.info('Đã dừng vòng đồng bộ tự động. Khi cần, anh bấm lại để chạy tiếp từ checkpoint.');
    } catch (error) {
      setAutoSyncState(null);
      toast.error(`Đồng bộ thất bại: ${error.message || 'Lỗi không xác định'}`);
    }
  }, [syncMutation]);

  const handleStopAutoSync = React.useCallback(() => {
    stopAutoSyncRef.current = true;
  }, []);

  const statusConfig = {
    running: { icon: RefreshCw, color: 'bg-blue-100 text-blue-700', label: 'Đang chạy' },
    partial: { icon: RefreshCw, color: 'bg-amber-100 text-amber-700', label: 'Đang tiếp tục' },
    success: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Thành công' },
    failed: { icon: AlertCircle, color: 'bg-red-100 text-red-700', label: 'Thất bại' },
  };

  const isAutoSyncing = Boolean(autoSyncState);
  const disabled = syncMutation.isPending || hasRunningSync || isAutoSyncing;

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">Đồng bộ AccessTrade</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            Bấm một lần để hệ thống tự chia thành nhiều lượt đồng bộ liên tiếp cho đến khi hết checkpoint.
            Cách này phù hợp với Vercel hơn và tránh bị ngắt giữa chừng.
          </p>
        </div>
        <Button asChild variant="outline" className="h-12 gap-2 rounded-2xl">
          <Link to="/quan-tam">
            Xem trang Quan tâm
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="mb-6 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Cấu hình API AccessTrade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-sm leading-6 text-muted-foreground">
              AccessTrade chạy qua API nội bộ. Nếu chưa có API key, thao tác đồng bộ sẽ ghi log và trả thông báo
              cần cấu hình trong <code>.env</code>.
            </p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• API Base: <code>https://api.accesstrade.vn/v1</code></p>
            <p>• Auth header: <code>Authorization: Token &lt;access_key&gt;</code></p>
            <p>• Campaigns: <code>GET /campaigns?approval=successful</code></p>
            <p>• Voucher/Mã giảm giá/Ưu đãi: <code>GET /offers_informations/coupon</code></p>
            <p>• Tracking links: dùng link affiliate trả về từ AccessTrade</p>
          </div>
        </CardContent>
      </Card>

      {isAutoSyncing ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Hệ thống đang tự đồng bộ nhiều lượt liên tiếp.</p>
              <p className="mt-1">{autoSyncState?.message}</p>
              <p className="mt-1 text-xs text-amber-600">
                Lượt hiện tại: {autoSyncState?.round || 0}. Anh cứ để tab này mở, web sẽ tự chạy tiếp cho đến khi xong.
              </p>
            </div>
            <Button type="button" variant="outline" className="h-10 rounded-2xl" onClick={handleStopAutoSync}>
              Dừng sau lượt hiện tại
            </Button>
          </div>
        </div>
      ) : hasRunningSync ? (
        <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Đang có một phiên đồng bộ chạy hoặc vừa mới khởi động. Hệ thống sẽ tự cập nhật lịch sử đồng bộ cho anh.
        </div>
      ) : null}

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {['all', 'campaigns', 'vouchers', 'transactions'].map((type) => (
          <Button
            key={type}
            variant="outline"
            onClick={() => runSyncUntilComplete(type)}
            disabled={disabled}
            className="h-auto min-h-24 flex-col gap-2 rounded-3xl py-4 text-sm shadow-sm"
          >
            <RefreshCw className={`h-5 w-5 ${(syncMutation.isPending || hasRunningSync || isAutoSyncing) ? 'animate-spin' : ''}`} />
            <span>{(hasRunningSync || isAutoSyncing) ? 'Đang tự đồng bộ...' : `Đồng bộ ${syncTypeLabels[type]}`}</span>
          </Button>
        ))}
      </div>

      <h2 className="mb-4 font-heading text-lg font-bold">Lịch sử đồng bộ</h2>
      <div className="space-y-3">
        {syncLogs.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Chưa có lịch sử đồng bộ</p>
        ) : (
          syncLogs.map((log) => {
            const cfg = statusConfig[log.status] || statusConfig.running;
            const Icon = cfg.icon;
            const iconClassName =
              log.status === 'running' || log.status === 'partial'
                ? 'animate-spin text-blue-500'
                : log.status === 'success'
                  ? 'text-green-500'
                  : 'text-red-500';

            return (
              <div key={log.id} className="rounded-3xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClassName}`} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{syncTypeLabels[log.sync_type] || log.sync_type}</span>
                      <Badge className={`rounded-full text-[10px] ${cfg.color}`}>{cfg.label}</Badge>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{log.message}</p>
                    {log.started_at ? (
                      <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(log.started_at).toLocaleString('vi-VN')}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
