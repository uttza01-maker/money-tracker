'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AddTransactionForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('ทั่วไป');
  const [type, setType] = useState<'income'|'expense'>('expense');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const value = Number(amount);
    if (!description || !amount || Number.isNaN(value)) {
      setError('กรุณากรอกคำอธิบายและจำนวนเงินที่ถูกต้อง');
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      setLoading(false);
      setError('ผู้ใช้ไม่พบ กรุณาเข้าสู่ระบบใหม่');
      return;
    }

    const payload = {
      description,
      amount: value,
      category,
      type,
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from('transactions').insert(payload);
    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setDescription('');
    setAmount('');
    setCategory('ทั่วไป');
    setType('expense');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 grid gap-4 rounded-2xl border border-slate-800/70 bg-gradient-to-b from-slate-900/60 to-slate-900/40 p-4 shadow-lg">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-400">คำอธิบาย</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="เช่น ซื้อกาแฟ, เงินเดือน"
            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400">จำนวน (บาท)</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            type="number"
            step="0.01"
            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-400">หมวดหมู่</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="ค่าอาหาร, ค่าน้ำ, ค่ารถ"
            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="w-40">
          <label className="block text-xs font-medium text-slate-400">ประเภท</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income'|'expense')}
            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
          >
            <option value="income">รายรับ</option>
            <option value="expense">รายจ่าย</option>
          </select>
        </div>

        <div className="w-44">
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-60"
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึกรายการ'}
          </button>
        </div>
      </div>

      {error ? <div className="text-sm text-rose-300">{error}</div> : null}
    </form>
  );
}
