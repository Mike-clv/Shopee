import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Loader2 } from 'lucide-react';
import { localClient } from '@/api/localClient';
import AuthLayout from '@/components/AuthLayout';
import GoogleIcon from '@/components/GoogleIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/components/ui/use-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại chưa khớp');
      return;
    }
    setLoading(true);
    try {
      await localClient.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || 'Đăng ký chưa thành công');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await localClient.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        localClient.auth.setToken(result.access_token);
      }
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Mã xác thực chưa đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await localClient.auth.resendOtp(email);
      toast({
        title: 'Đã gửi lại mã',
        description: 'Anh kiểm tra email để lấy mã xác thực mới nhé.',
      });
    } catch (err) {
      setError(err.message || 'Không thể gửi lại mã xác thực');
    }
  };

  const handleGoogle = () => {
    setError('Đăng ký bằng Google chưa bật trong bản local. Anh hãy dùng tài khoản quản trị đã cấu hình trong file .env.');
  };

  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title="Xác thực email"
        subtitle={`Em đã gửi mã xác thực tới ${email}`}
      >
        {error ? (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="space-y-5">
          <div className="space-y-3 text-center">
            <Label>Mã xác thực</Label>
            <div className="flex justify-center">
              <InputOTP value={otpCode} onChange={setOtpCode} maxLength={6}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button type="button" className="h-12 w-full font-medium" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xác thực...
              </>
            ) : (
              'Xác thực tài khoản'
            )}
          </Button>

          <div className="space-y-2 text-center text-sm text-muted-foreground">
            <p>Chưa nhận được mã?</p>
            <button type="button" onClick={handleResend} className="font-medium text-primary hover:underline">
              Gửi lại mã xác thực
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Tạo tài khoản"
      subtitle="Đăng ký nhanh để quản lý website thuận tiện hơn"
      footer={(
        <>
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Đăng nhập ngay
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
              placeholder="anh@vidu.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Tối thiểu 8 ký tự"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
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
              Đang tạo tài khoản...
            </>
          ) : (
            'Tạo tài khoản'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
