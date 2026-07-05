import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import AddTransactionForm from './AddTransactionForm';
import TransactionsChart from './TransactionsChart';

export default async function TransactionsPage() {
  const supabase = await createClient();

  if (!supabase) {
    redirect('/login');
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, description, amount, category, type, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <div className="rounded-[2rem] border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-400">แดชบอร์ด</p>
              <h1 className="text-4xl font-semibold text-white">รายการรายรับ-รายจ่ายของฉัน</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">ดูรายการล่าสุดและจัดการการเงินของคุณได้ง่าย ๆ</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="rounded-3xl bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700">
                หน้าแรก
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-6">
            <AddTransactionForm />
          </div>

          <div className="mt-6">
            <TransactionsChart transactions={transactions ?? []} />
          </div>

          <div className="mt-8 grid gap-6">
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <article key={transaction.id} className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-5 transition hover:shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-slate-400">{transaction.category}</p>
                      <h2 className="mt-1 text-lg font-semibold text-white">{transaction.description}</h2>
                      <p className="mt-2 text-sm text-slate-400">{new Date(transaction.created_at).toLocaleString('th-TH', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xl font-semibold ${transaction.type === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`}>{transaction.amount} ฿</span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 p-10 text-center text-slate-400">
                <p className="text-xl font-semibold text-white">ยังไม่มีรายการ</p>
                <p className="mt-3">เพิ่มรายการรายรับหรือรายจ่ายเพื่อเริ่มบันทึกการเงิน</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}