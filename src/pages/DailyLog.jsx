import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { Save, Thermometer, Skull, Wheat, Scale, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DailyLog = () => {
  const { addLog } = useGlobal();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    mortality: '',
    mortalityReason: 'غير محدد',
    feed: '',
    water: '',
    weight: '',
    tempHigh: '',
    tempLow: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // التحقق المبدئي
    if (!form.mortality || !form.feed) {
      return alert('⚠️ الرجاء إدخال النافق والعلف على الأقل');
    }
    
    // محاولة الحفظ (addLog تعيد true إذا نجحت، و false إذا فشلت بسبب المخزون)
    const success = addLog(form);
    
    if (success) {
      alert('✅ تم الحفظ وتحديث المخزون بنجاح');
      navigate('/');
    }
    // في حالة الفشل، التنبيه يظهر تلقائياً من الـ Context
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="pb-24 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 px-2">تسجيل يومي</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm space-y-6">
        
        {/* قسم الوفيات */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center gap-2 mb-3 text-red-700 font-bold">
            <Skull size={20} /> وفيات اليوم
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">العدد</label>
              <input type="number" name="mortality" value={form.mortality} onChange={handleChange} className="w-full p-2 rounded border border-red-200 focus:outline-none focus:border-red-500" placeholder="0" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">السبب</label>
              <select name="mortalityReason" value={form.mortalityReason} onChange={handleChange} className="w-full p-2 rounded border border-red-200 text-sm">
                <option>غير محدد</option>
                <option>أمراض تنفسية</option>
                <option>إجهاد حراري</option>
                <option>مشاكل معوية</option>
                <option>فرز/سردة</option>
              </select>
            </div>
          </div>
        </div>

        {/* قسم العلف والوزن */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1 text-sm font-bold text-gray-700 mb-1">
              <Wheat size={16} className="text-amber-500" /> العلف (كجم)
            </label>
            <input type="number" name="feed" value={form.feed} onChange={handleChange} className="w-full p-3 rounded-lg border bg-gray-50" placeholder="مثال: 150" />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-bold text-gray-700 mb-1">
              <Scale size={16} className="text-blue-500" /> الوزن (جم)
            </label>
            <input type="number" name="weight" value={form.weight} onChange={handleChange} className="w-full p-3 rounded-lg border bg-gray-50" placeholder="مثال: 500" />
          </div>
        </div>

        {/* الحرارة والمياه */}
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="flex items-center gap-1 text-sm font-bold text-gray-700 mb-1">
              <Droplets size={16} className="text-blue-400" /> الماء (لتر)
            </label>
            <input type="number" name="water" value={form.water} onChange={handleChange} className="w-full p-3 rounded-lg border bg-gray-50" />
           </div>
           <div>
            <label className="flex items-center gap-1 text-sm font-bold text-gray-700 mb-1">
              <Thermometer size={16} className="text-orange-500" /> الحرارة (°C)
            </label>
            <div className="flex gap-2">
               <input type="number" name="tempHigh" placeholder="عظمى" value={form.tempHigh} onChange={handleChange} className="w-full p-3 rounded-lg border bg-gray-50 text-sm" />
               <input type="number" name="tempLow" placeholder="صغرى" value={form.tempLow} onChange={handleChange} className="w-full p-3 rounded-lg border bg-gray-50 text-sm" />
            </div>
           </div>
        </div>

        <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 active:scale-95 transition-all flex justify-center gap-2">
          <Save /> حفظ البيانات
        </button>
      </form>
    </div>
  );
};

export default DailyLog;
