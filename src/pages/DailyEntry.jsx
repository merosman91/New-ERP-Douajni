import React, { useState } from 'react';
import { addDailyLog } from '../store/dataStore';
import { Save } from 'lucide-react';

const DailyEntry = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mortality: '',
    feed: '',
    weight: '',
    temp: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.mortality || !formData.feed) return alert('الرجاء تعبئة البيانات الأساسية');
    
    addDailyLog({
      cycleId: 'cycle-1', // ربط ثابت للدورة الحالية
      ...formData
    });
    
    alert('تم الحفظ بنجاح!');
    setFormData({ ...formData, mortality: '', feed: '', weight: '', temp: '', notes: '' });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">تسجيل يومي جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">التاريخ</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">درجة الحرارة</label>
            <input type="number" name="temp" placeholder="°C" value={formData.temp} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-red-500 mb-1">عدد النافق (وفيات)</label>
          <input type="number" name="mortality" placeholder="0" value={formData.mortality} onChange={handleChange} className="w-full p-3 bg-red-50 rounded-xl border border-red-100 focus:border-red-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">العلف المستهلك (كجم)</label>
          <input type="number" name="feed" placeholder="0" value={formData.feed} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">متوسط وزن الطير (جم)</label>
          <input type="number" name="weight" placeholder="مثال: 1500" value={formData.weight} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">ملاحظات / علاجات</label>
          <textarea name="notes" rows="2" value={formData.notes} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none"></textarea>
        </div>

        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 mt-4 transition-colors">
          <Save size={20} />
          حفظ البيانات
        </button>
      </form>
    </div>
  );
};

export default DailyEntry;
