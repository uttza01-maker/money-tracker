'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, TrendingUp, TrendingDown, Plus } from 'lucide-react'

// กำหนดโครงสร้างข้อมูลให้ชัดเจน
interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description?: string;
  created_at: string;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) {
      setTransactions(data as Transaction[])
    } else if (error) {
      console.error("Error fetching data:", error)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const { error } = await supabase.from('transactions').insert({
      amount: Number(formData.get('amount')),
      category: formData.get('category'),
      type: type,
      description: formData.get('description'),
    })

    if (!error) {
      e.currentTarget.reset()
      fetchTransactions()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black text-gray-800">My Wallet</h1>
          <button 
            onClick={handleSignOut} 
            className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold transition"
          >
            <LogOut size={18} /> ออกจากระบบ
          </button>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
            <button 
              type="button"
              onClick={() => setType('income')} 
              className={`flex-1 py-3 rounded-xl font-bold transition ${type === 'income' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-400'}`}
            >
              รายรับ
            </button>
            <button 
              type="button"
              onClick={() => setType('expense')} 
              className={`flex-1 py-3 rounded-xl font-bold transition ${type === 'expense' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400'}`}
            >
              รายจ่าย
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              name="amount" type="number" step="0.01" placeholder="จำนวนเงิน" required 
              className="w-full text-xl p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-gray-200" 
            />
            <input 
              name="category" type="text" placeholder="หมวดหมู่ (เช่น อาหาร, เงินเดือน)" required 
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-gray-200" 
            />
            <button 
              type="submit" 
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition"
            >
              บันทึกรายการ
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-gray-700">รายการล่าสุด</h2>
          <div className="space-y-4">
            {transactions.map((t) => (
              <div key={t.id} className="flex justify-between items-center p-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <span className="font-semibold text-gray-700">{t.category}</span>
                </div>
                <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}