import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { Share2, PlusCircle, TrendingDown } from 'lucide-react';

const Finance = () => {
  const { data, getKPIs, addTransaction } = useGlobal();
  const kpi = getKPIs();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('علف');

  // حساب التوقعات (مبسط)
  const projectedRevenue = kpi.currentCount * (data.settings.targetWeight / 1000) * 1200; 
  // ملاحظة: يمكنك جعل سعر الكيلو (1200) متغيراً في الإعدادات لاحقاً
  
  // حساب إجمالي المصروفات من المعاملات + تكلفة الكتكوت المبدئية
  const expenses = data.transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const chickCost = data.cycle.initialCount * 450; // افتراض سعر الكتكوت 450
  const totalCostCalc = expenses + chickCost;
  
  const projectedProfit = projectedRevenue - totalCostCalc;

  const handleAddExpense = (e) => {
    e.preventDefault();
    if(!amount) return;
    addTransaction({ 
      type: 'expense', 
      amount, 
      category, 
      date: new Date().toISOString() 
    });
    setAmount('');
    alert('✅ تمت إضافة المصروف');
  };

  const shareReport = () => {
    const text = `📊 *تقرير مالي - ${data.settings.farmName}*\n💰 التكلفة الحالية: ${totalCostCalc.toLocaleString()}\n📈 الربح المتوقع: ${projectedProfit.toLocaleString()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* البطاقة المالية */}
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-gray-400 text-sm mb-1">صافي الربح المتوقع</h2>
        <div className={`text-4xl font-bold ${projectedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`} dir="ltr">
          {projectedProfit.toLocaleString()} 
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-700 pt-4 text-center">
          <div>
            <span className="text-xs text-gray-400 block">التكاليف</span>
            <span className="font-bold text-red-300">{totalCostCalc.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">المبيعات المتوقعة</span>
            <span className="font-bold text-green-300">{projectedRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* إضافة مصروف */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-700"><PlusCircle size={18}/> تسجيل مصروف جديد</h3>
        <form onSubmit={handleAddExpense} className="flex gap-2">
          <select value={category} onChange={e => setCategory(e.target.value)} className="bg-gray-50 border rounded-lg p-2 text-sm w-1/3">
            <option>علف</option>
            <option>أدوية</option>
            <option>عمالة</option>
            <option>كهرباء</option>
            <option>نشارة</option>
            <option>صيانة</option>
          </select>
          <input type="number" placeholder="المبلغ" value={amount} onChange={e => setAmount(e.target.value)} className="flex-1 bg-gray-50 border rounded-lg p-2" />
          <button className="bg-gray-800 text-white px-4 rounded-lg font-bold">حفظ</button>
        </form>
      </div>

      <button onClick={shareReport} className="w-full bg-green-600 text-white p-3 rounded-xl flex justify-center items-center gap-2 font-bold shadow-md">
        <Share2 size={18} /> تقرير للمدير
      </button>

      {/* السجل */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 bg-gray-50 border-b font-bold text-gray-700 text-sm">أحدث المصروفات</div>
        {data.transactions.length > 0 ? (
          data.transactions.slice(-5).reverse().map(tx => (
            <div key={tx.id} className="flex justify-between p-3 border-b last:border-0 text-sm">
              <span className="text-gray-600">{tx.category}</span>
              <span className="font-bold text-red-600">-{Number(tx.amount).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-400 text-sm">لا توجد مصروفات مسجلة</div>
        )}
      </div>
    </div>
  );
};

export default Finance;
