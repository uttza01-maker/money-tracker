"use client";

import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WalletCards, Loader2 } from 'lucide-react'; // นำเข้าไอคอน

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

    router.push('/dashboard');
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-800/70 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        
        {/* โลโก้ด้านบน */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-sky-500/10 rounded-3xl">
            <WalletCards className="w-10 h-10 text-sky-400" />
          </div>
        </div>

        <div className="mb-8 text-center space-y-2">
          <h1 className="text-2xl font-semibold text-white">สร้างบัญชีผู้ใช้</h1>
          <p className="text-slate-400 text-sm">เริ่มต้นบันทึกการเงินของคุณได้ทันที</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none focus:border-sky-400 transition"
            placeholder="อีเมล"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none focus:border-sky-400 transition"
            placeholder="รหัสผ่าน"
            minLength={8}
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none focus:border-sky-400 transition"
            placeholder="ยืนยันรหัสผ่าน"
            minLength={8}
            required
          />

          {errorMessage && (
            <div className="rounded-xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300 border border-rose-500/20">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-400 transition flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'สมัครสมาชิก'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-800"></span>
          <span className="text-xs text-slate-500 uppercase tracking-widest">หรือ</span>
          <span className="h-px flex-1 bg-slate-800"></span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-3 font-semibold text-slate-200 hover:border-slate-500 transition"
        >
          สมัครด้วย Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          มีบัญชีแล้ว?{' '}
          <Link href="/login" className="font-semibold text-sky-400 hover:text-sky-300">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}