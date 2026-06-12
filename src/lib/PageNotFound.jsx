import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  const { data: authData, isFetched } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const user = await localClient.auth.me();
        return { user, isAuthenticated: true };
      } catch {
        return { user: null, isAuthenticated: false };
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-7xl font-light text-slate-300">404</h1>
            <div className="mx-auto h-0.5 w-16 bg-slate-200" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-medium text-slate-800">Không tìm thấy trang</h2>
            <p className="leading-relaxed text-slate-600">
              Trang <span className="font-medium text-slate-700">&quot;{pageName}&quot;</span> hiện không tồn tại trên website này.
            </p>
          </div>

          {isFetched && authData.isAuthenticated && authData.user?.role === 'admin' ? (
            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-100 p-4">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <div className="h-2 w-2 rounded-full bg-orange-400" />
                </div>
                <div className="space-y-1 text-left">
                  <p className="text-sm font-medium text-slate-700">Ghi chú quản trị</p>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Có thể trang này chưa được triển khai hoặc chưa gắn đúng route trong ứng dụng. Anh chỉ cần nhắn em bổ sung là được.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => {
              window.location.href = '/';
            }}
            className="inline-flex items-center rounded-lg bg-slate-800 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
