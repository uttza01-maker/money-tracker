'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (!error) router.push('/');
    else alert(error.message || 'Sign out failed');
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="rounded-3xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-70"
    >
      {loading ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
    </button>
  );
}
