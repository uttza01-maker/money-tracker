import Link from "next/link";
import { WalletCards } from "lucide-react"; // นำเข้าไอคอนกระเป๋าตังค์

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      
      {/* เพิ่มส่วนโลโก้ตรงนี้ */}
      <div className="mb-6 p-4 bg-white rounded-3xl shadow-sm border border-pink-100">
        <WalletCards className="w-12 h-12 text-pink-500" />
      </div>

      <h1 className="text-5xl font-bold text-slate-800 mb-6">
        Money <span className="text-pink-500">Tracker</span>
      </h1>
      
      <p className="text-lg text-slate-600 mb-8 max-w-md">
        บันทึกรายรับ รายจ่าย และจัดการการเงินของคุณให้เป็นระบบ ด้วยดีไซน์ที่สะอาดตา
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          เข้าสู่ระบบ
        </Link>
        <Link 
          href="/register" 
          className="px-6 py-3 bg-white text-pink-600 border border-pink-200 rounded-xl font-medium hover:bg-pink-50 transition-colors"
        >
          ลงทะเบียน
        </Link>
      </div>
    </div>
  );
}