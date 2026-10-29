"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/actions/admin";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    loginAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-xs font-medium text-ink/60">
          Mật khẩu admin
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2.5 text-sm transition focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none"
        />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Đang kiểm tra…" : "Đăng nhập"}
      </button>
    </form>
  );
}
