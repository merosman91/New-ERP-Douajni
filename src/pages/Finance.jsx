import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { Share2, PlusCircle, DollarSign, FileText } from 'lucide-react';

const Finance = () => {
  const { data, getKPIs, addTransaction } = useGlobal();
  const kpi = getKPIs();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('علف');

  // حساب التوقعات
  const projectedRevenue = kpi.currentCount * (data.settings.targetWeight / 1000) * 1200; // فرضنا سعر الكيلو 1200
  const projectedProfit = projectedRevenue - kpi.totalCost;

  const handleAddExpense = (e) => {
    e.preventDefault();
    addTransaction({ type: 'expense', amount, category, date: new Date().toISOString() });
    setAmount('');
    alert('تمت إضافة المصروف');
  };

  const shareReport = () => {
    const text = `
📊 *تقرير مزرعة ${data.settings.farmName}*
📅 اليوم: ${kpi.age}
----------------
🐔 العدد الحي: ${kpi.currentCount}
💀 النفوق: ${kpi.mortalityRate}%
⚖️ متوسط الوزن: ${kpi.lastWeight} جم
💰 التكلفة حتى الآن: ${kpi.totalCost.toLocaleString()}
📈 FCR: ${kpi.fcr}
    `.trim();
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* البطاقة المالية الرئيسية */}
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-gray-400 text-sm mb-1">الربح المتوقع (تقديري)</h2>
        <div className={`text-4xl font-bold ${projectedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {projectedProfit.toLocaleString()} 
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-700 pt-4">
          <div>
            <span className="text-xs text-gray-400 block">إجمالي التكلفة</span>
            <span className="font-bold">{kpi.totalCost.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">الإيراد المتوقع</span>
            <span className="font-bold">{projectedRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* إضافة مصروف سريع */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-bold mb-3 flex items-center gap-2"><PlusCircle size={18}/> تسجيل مصروف</h3>
        <form onSubmit={handleAddExpense} className="flex gap-2">
          <select value={category} onChange={e => setCategory(e.target.value)} className="bg-gray-50 border rounded-lg p-2 text-sm">
            <option>علف</option>
            <option>أدوية</option>
            <option>عمالة</option>
            <option>وقود/كهرباء</option>
            <option>نشارة</option>
          </select>
          <input type="number" placeholder="المبلغ" value={amount} onChange={e => setAmount(e.target.value)} className="flex-1 bg-gray-50 border rounded-lg p-2" required />
          <button className="bg-red-500 text-white px-4 rounded-lg font-bold">حفظ</button>
        </form>
      </div>

      {/* أزرار التقارير */}
      <button onClick={shareReport} className="w-full bg-green-500 text-white p-4 rounded-xl flex justify-center items-center gap-2 font-bold shadow-lg">
        <Share2 /> مشاركة التقرير واتساب
      </button>

      {/* سجل المصروفات الأخير */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 bg-gray-50 border-b font-bold text-gray-700">آخر الحركات</div>
        {data.transactions.slice(-5).reverse().map(tx => (
          <div key={tx.id} className="flex justify-between p-3 border-b last:border-0">
            <span>{tx.category}</span>
            <span className="font-bold text-red-600">-{Number(tx.amount).toLocaleString()}</span>
          </div>
        ))}
        {data.transactions.length === 0 && <div className="p-4 text-center text-gray-400">لا يوجد بيانات</div>}
      </div>
    </div>
  );
};

export default Finance;
