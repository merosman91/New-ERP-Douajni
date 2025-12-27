import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { Package, Plus, TrendingDown } from 'lucide-react';

const Inventory = () => {
  const { data, addToInventory } = useGlobal();
  const [amount, setAmount] = useState('');

  const handleAddStock = (e) => {
    e.preventDefault();
    addToInventory(amount);
    alert(`تم إضافة ${amount} كجم للمخزون`);
    setAmount('');
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold text-gray-800">إدارة المخزون</h2>

      {/* بطاقة الرصيد الحالي */}
      <div className="bg-amber-500 text-white p-6 rounded-xl shadow-lg flex justify-between items-center">
        <div>
          <p className="text-amber-100 text-sm">رصيد العلف الحالي</p>
          <h3 className="text-4xl font-bold">{data.inventory.feed.toLocaleString()} <span className="text-lg">كجم</span></h3>
        </div>
        <Package size={48} className="opacity-50" />
      </div>

      {/* نموذج إضافة مخزون (شراء علف) */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Plus size={20}/> توريد علف جديد</h3>
        <form onSubmit={handleAddStock} className="flex gap-2">
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            placeholder="الكمية (كجم)" 
            className="flex-1 border p-3 rounded-lg bg-gray-50"
            required
          />
          <button type="submit" className="bg-gray-800 text-white px-6 rounded-lg font-bold">إضافة</button>
        </form>
      </div>

      {/* التنبيهات */}
      {data.inventory.feed < 500 && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex items-center gap-3">
          <TrendingDown className="text-red-500" />
          <div>
            <p className="font-bold text-red-700">تنبيه نفاذ المخزون</p>
            <p className="text-sm text-red-600">الرصيد أقل من 500 كجم. يرجى الشراء فوراً.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
