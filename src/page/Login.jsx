import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { localClient } from '@/api/localClient';
import AuthLayout from '@/components/AuthLayout';
import GoogleIcon from '@/components/GoogleIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await localClient.auth.loginViaEmailPassword(email, password);
      window.location.href = redirectTo;
    } catch (err) {
      setError(err.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setError('Đăng nhập bằng Google chưa được cấu hình trong bản local. Anh hãy dùng ADMIN_EMAIL và ADMIN_PASSWORD trong file .env.');
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Đăng nhập"
      subtitle="Đăng nhập để vào khu quản trị của anh"
      footer={(
        <>
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Tạo tài khoản mới
          </Link>
        </>
      )}
    >
      <Button
        variant="outline"
        className="mb-6 h-12 w-full text-sm font-medium"
        onClick={handleGoogle}
      >
        <GoogleIcon className="mr-2 h-5 w-5" />
        Tiếp tục với Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">hoặc</span>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="anh@vidu.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mật khẩu</Label>
            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 pl-10"
              required
            />
          </div>
        </div>

        <Button type="submit" className="h-12 w-full font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
