import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { localClient } from '@/api/localClient';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await localClient.auth.resetPasswordRequest(email);
    } catch {
      // Luôn báo thành công để tránh lộ trạng thái email.
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="Quên mật khẩu"
      subtitle="Em sẽ gửi cho anh liên kết đặt lại mật khẩu"
      footer={(
        <Link to="/login" className="font-medium text-primary hover:underline">
          <ArrowLeft className="mr-1 inline h-3 w-3" />
          Quay lại đăng nhập
        </Link>
      )}
    >
      {sent ? (
        <p className="text-center text-sm text-foreground">
          Nếu email này đã có tài khoản, anh sẽ sớm nhận được liên kết đặt lại mật khẩu trong hộp thư.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Địa chỉ email</Label>
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
          <Button type="submit" className="h-12 w-full font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              'Gửi liên kết đặt lại mật khẩu'
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
