import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { Save, Thermometer, Skull, Wheat, Scale } from 'lucide-react';
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
    if (!form.mortality || !form.feed) return alert('الرجاء إدخال النافق والعلف على الأقل');
    
    addLog(form);
    alert('✅ تم الحفظ بنجاح');
    navigate('/');
  };

  return (
    <div className="pb-24">
      <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">تسجيل يومي</h2>
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm space-y-6">
        
        {/* قسم الوفيات */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center gap-2 mb-3 text-red-700 font-bold">
            <Skull size={20} /> وفيات اليوم
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">العدد</label>
              <input type="number" inputMode="numeric" value={form.mortality} onChange={e => setForm({...form, mortality: e.target.value})} className="w-full p-2 rounded border border-red-200 focus:outline-none focus:border-red-500" placeholder="0" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">السبب الرئيسي</label>
              <select value={form.mortalityReason} onChange={e => setForm({...form, mortalityReason: e.target.value})} className="w-full p-2 rounded border border-red-200 text-sm">
                <option>غير محدد</option>
                <option>أمراض تنفسية</option>
                <option>إجهاد حراري</option>
                <option>مشاكل معوية</option>
                <option>سردة/فرز</option>
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
            <input type="number" inputMode="numeric" value={form.feed} onChange={e => setForm({...form, feed: e.target.value})} className="w-full p-3 rounded-lg border bg-gray-50" placeholder="مثال: 150" />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-bold text-gray-700 mb-1">
              <Scale size={16} className="text-blue-500" /> وزن العينة (جم)
            </label>
            <input type="number" inputMode="numeric" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className="w-full p-3 rounded-lg border bg-gray-50" placeholder="مثال: 500" />
          </div>
        </div>

        {/* الحرارة والمياه */}
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">استهلاك الماء (لتر)</label>
            <input type="number" inputMode="numeric" value={form.water} onChange={e => setForm({...form, water: e.target.value})} className="w-full p-3 rounded-lg border bg-gray-50" />
           </div>
           <div>
            <label className="flex items-center gap-1 text-sm font-bold text-gray-700 mb-1">
              <Thermometer size={16} className="text-orange-500" /> الحرارة (°C)
            </label>
            <div className="flex gap-2">
               <input type="number" placeholder="عظمى" value={form.tempHigh} onChange={e => setForm({...form, tempHigh: e.target.value})} className="w-full p-3 rounded-lg border bg-gray-50 text-sm" />
               <input type="number" placeholder="صغرى" value={form.tempLow} onChange={e => setForm({...form, tempLow: e.target.value})} className="w-full p-3 rounded-lg border bg-gray-50 text-sm" />
            </div>
           </div>
        </div>

        <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 active:scale-95 transition-all">
          حفظ البيانات
        </button>
      </form>
    </div>
  );
};

export default DailyLog;
