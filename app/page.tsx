import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';

export default async function HomePage() {
  const supabase = await createClient();
  await supabase?.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-linear-to-b from-slate-50 to-slate-100">
      <Image src="/file.svg" alt="Money illustration" width={160} height={160} className="mb-6 h-40 w-40 opacity-95" />
      <h1 className="text-5xl font-extrabold mb-4 text-sky-600">Money Tracker</h1>
      <p className="text-xl mb-8 text-gray-600 max-w-lg">
        บันทึกรายรับ-รายจ่ายของคุณอย่างเป็นระบบ ปลอดภัย และใช้งานง่าย
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          เข้าสู่ระบบ
        </Link>
        <Link 
          href="/register" 
          className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
        >
          สมัครสมาชิก
        </Link>
      </div>
    </main>
  );
}