"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/actions/admin";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    loginAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
          Mật khẩu admin
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#ee4d2d] focus:outline-none"
        />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-red-600">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#ee4d2d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#d73211] disabled:opacity-60"
      >
        {pending ? "Đang kiểm tra…" : "Đăng nhập"}
      </button>
    </form>
  );
}
