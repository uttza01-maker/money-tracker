'use client';
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push('/transactions');
  };

  const handleGoogleSignup = async () => {
    setErrorMessage('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16 sm:px-10">
        <div className="w-full rounded-[2rem] border border-slate-800/70 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="mb-8 space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">สมัครสมาชิก</p>
            <h1 className="text-4xl font-semibold text-white">เริ่มต้นบันทึกการเงินของคุณ</h1>
            <p className="max-w-xl text-slate-400">กรอกข้อมูลด้านล่างเพื่อสร้างบัญชี แล้วเริ่มบันทึกรายรับ-รายจ่าย และสลิปได้ทันที</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>

            {errorMessage ? (
              <div className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-500/20">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {loading ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิก'}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-700"></span>
            <span className="text-sm uppercase tracking-[0.28em] text-slate-500">หรือ</span>
            <span className="h-px flex-1 bg-slate-700"></span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center rounded-3xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'กำลังดำเนินการ...' : 'สมัครด้วย Google'}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            มีบัญชีแล้ว?{' '}
            <Link href="/login" className="font-semibold text-sky-300 hover:text-sky-200">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
