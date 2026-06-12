import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, AlertTriangle } from 'lucide-react';
import { localClient } from '@/api/localClient';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu nhập lại chưa khớp');
      return;
    }
    setLoading(true);
    try {
      await localClient.auth.resetPassword({ resetToken, newPassword });
      window.location.href = '/login';
    } catch (err) {
      setError(err.message || 'Không thể đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        title="Liên kết không hợp lệ"
        subtitle="Liên kết đặt lại mật khẩu đang thiếu hoặc đã hết hiệu lực"
        footer={(
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Yêu cầu liên kết mới
          </Link>
        )}
      >
        <p className="text-center text-sm text-foreground">
          Liên kết anh vừa mở có vẻ chưa đầy đủ. Anh hãy yêu cầu email đặt lại mật khẩu mới để tiếp tục.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Lock}
      title="Đặt mật khẩu mới"
      subtitle="Nhập mật khẩu mới của anh ở bên dưới"
    >
      {error ? (
        <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu mới</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="••••••••"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="h-12 pl-10"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Nhập lại mật khẩu mới</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-12 pl-10"
              required
            />
          </div>
        </div>
        <Button type="submit" className="h-12 w-full font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            'Cập nhật mật khẩu'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
