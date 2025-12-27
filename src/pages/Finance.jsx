import React, { useState, useEffect } from 'react';
import { addTransaction, getFinancials } from '../store/dataStore';
import { PlusCircle, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

const Finance = () => {
  const [activeTab, setActiveTab] = useState('summary'); // summary | add
  const [finances, setFinances] = useState({ expenses: 0, revenue: 0, profit: 0, transactions: [] });
  const [txForm, setTxForm] = useState({ type: 'expense', amount: '', category: 'علف', notes: '' });

  useEffect(() => {
    setFinances(getFinancials('cycle-1'));
  }, [activeTab]);

  const handleAddTx = (e) => {
    e.preventDefault();
    addTransaction({ cycleId: 'cycle-1', date: new Date().toISOString(), ...txForm });
    alert('تمت الإضافة');
    setTxForm({ type: 'expense', amount: '', category: '', notes: '' });
    setActiveTab('summary');
  };

  return (
    <div className="space-y-6">
      
      {/* التبديل بين العرض والإضافة */}
      <div className="flex bg-gray-200 p-1 rounded-xl">
        <button onClick={() => setActiveTab('summary')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${activeTab === 'summary' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>الملخص</button>
        <button onClick={() => setActiveTab('add')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${activeTab === 'add' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>إضافة عملية</button>
      </div>

      {activeTab === 'summary' ? (
        <>
          {/* بطاقة الأرباح */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 opacity-80 mb-2">
              <Wallet size={20} />
              <span className="text-sm">صافي الربح التقديري</span>
            </div>
            <h2 className="text-4xl font-bold" dir="ltr">{finances.profit.toLocaleString()} <span className="text-lg">SDG</span></h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <span className="text-red-500 text-xs font-bold block mb-1">المصروفات</span>
              <span className="text-xl font-bold text-gray-800">{finances.expenses.toLocaleString()}</span>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <span className="text-green-600 text-xs font-bold block mb-1">المبيعات</span>
              <span className="text-xl font-bold text-gray-800">{finances.revenue.toLocaleString()}</span>
            </div>
          </div>

          {/* قائمة العمليات الأخيرة */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-bold mb-4 text-gray-700">آخر العمليات</h3>
            <div className="space-y-3">
              {finances.transactions.slice(-5).reverse().map((tx) => (
                <div key={tx.id} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {tx.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">{tx.category}</p>
                      <p className="text-[10px] text-gray-400">{new Date(tx.date).toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
              {finances.transactions.length === 0 && <p className="text-center text-gray-400 text-sm">لا توجد عمليات مسجلة</p>}
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleAddTx} className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-gray-700">تسجيل مصروف أو إيراد</h3>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" checked={txForm.type === 'expense'} onChange={() => setTxForm({...txForm, type: 'expense'})} className="w-5 h-5 accent-red-500" />
              <span className="text-sm">مصروف (شراء)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" checked={txForm.type === 'income'} onChange={() => setTxForm({...txForm, type: 'income'})} className="w-5 h-5 accent-green-500" />
              <span className="text-sm">إيراد (بيع)</span>
            </label>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600">التصنيف</label>
            <select value={txForm.category} onChange={(e) => setTxForm({...txForm, category: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200">
              {txForm.type === 'expense' ? (
                <>
                  <option>علف</option>
                  <option>أدوية ولقاحات</option>
                  <option>صيصان</option>
                  <option>عمالة</option>
                  <option>كهرباء/ماء</option>
                </>
              ) : (
                <>
                  <option>بيع دجاج حي</option>
                  <option>بيع سماد</option>
                  <option>مرتجعات</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600">المبلغ</label>
            <input type="number" value={txForm.amount} onChange={(e) => setTxForm({...txForm, amount: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" required />
          </div>

          <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2">
            <PlusCircle size={18} /> إضافة
          </button>
        </form>
      )}
    </div>
  );
};

export default Finance;
