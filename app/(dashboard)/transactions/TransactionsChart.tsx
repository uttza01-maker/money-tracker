"use client";
import React from 'react';

type Transaction = {
  id: string;
  amount: number;
  category?: string | null;
  type?: 'income' | 'expense' | string | null;
  created_at?: string | null;
};

export default function TransactionsChart({ transactions }: { transactions: Transaction[] }) {
  // Aggregate totals per category (income positive, expense negative)
  const totals = transactions.reduce<Record<string, number>>((acc, t) => {
    const cat = t.category || 'ทั่วไป';
    const amt = typeof t.amount === 'number' ? t.amount : Number(t.amount || 0);
    const signed = (t.type === 'expense') ? -Math.abs(amt) : Math.abs(amt);
    acc[cat] = (acc[cat] || 0) + signed;
    return acc;
  }, {});

  const items = Object.entries(totals).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  const max = items.reduce((m, [, v]) => Math.max(m, Math.abs(v)), 0) || 1;

  return (
    <section className="rounded-2xl border border-slate-800/80 bg-linear-to-b from-slate-900/60 to-slate-900/40 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="mb-3 text-sm font-semibold text-slate-300">สรุปตามหมวดหมู่</h3>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs text-slate-400"><span className="h-2 w-4 rounded-sm bg-emerald-400 block"/> รายรับ</span>
          <span className="flex items-center gap-2 text-xs text-slate-400"><span className="h-2 w-4 rounded-sm bg-rose-400 block"/> รายจ่าย</span>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">ยังไม่มีข้อมูลสำหรับแสดงกราฟ</p>
      ) : (
        <div className="flex flex-col gap-3 mt-2">
          {items.map(([cat, total]) => {
            const width = Math.round((Math.abs(total) / max) * 100);
            const positive = total >= 0;
            return (
              <div key={cat} className="flex items-center gap-3">
                <div className="w-36 text-sm text-slate-300">{cat}</div>
                <div className="flex-1">
                  <div className="h-5 w-full rounded-full bg-linear-to-r from-slate-800 to-slate-800/60">
                    <div
                      style={{ width: `${width}%` }}
                      className={
                        `h-5 rounded-full ${positive ? 'bg-linear-to-r from-emerald-500 to-emerald-400' : 'bg-linear-to-r from-rose-500 to-rose-400'}`
                      }
                    />
                  </div>
                </div>
                <div className="w-36 text-right text-sm font-medium text-slate-100">{total.toLocaleString()} บาท</div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
