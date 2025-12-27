import React, { useState, useEffect } from 'react';
import { initDemoData, getCycles, saveDailyLog, calculateKPIs } from './utils/dataManager';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Droplets, Scale, Skull, PlusCircle, Save } from 'lucide-react';

// تهيئة البيانات عند البدء
initDemoData();

function App() {
  const [cycles, setCycles] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | entry
  const [formData, setFormData] = useState({
    mortality: 0,
    feedConsumed: 0,
    waterConsumed: 0,
    avgWeight: 0,
    temperature: 0
  });

  useEffect(() => {
    setCycles(getCycles());
  }, []);

  const currentCycle = cycles[0]; // نفترض التعامل مع أول دورة حالياً
  const kpis = calculateKPIs(currentCycle);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveDailyLog(currentCycle.id, { ...formData, date: new Date().toISOString().split('T')[0] });
    setCycles(getCycles()); // تحديث البيانات
    alert('تم الحفظ بنجاح (محلياً)');
    setFormData({ mortality: 0, feedConsumed: 0, waterConsumed: 0, avgWeight: 0, temperature: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-right" dir="rtl">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <h1 className="text-xl font-bold">مزرعتي (ERP)</h1>
        <p className="text-xs opacity-80">الدورة الحالية: {currentCycle?.name}</p>
      </header>

      <main className="p-4 pb-24">
        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && kpis && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-red-500 mb-2">
                  <Skull size={20} />
                  <span className="text-sm font-semibold">النفوق</span>
                </div>
                <p className="text-2xl font-bold">{kpis.mortalityRate}%</p>
                <p className="text-xs text-gray-400">العدد: {kpis.totalDead}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <Activity size={20} />
                  <span className="text-sm font-semibold">التحويل (FCR)</span>
                </div>
                <p className="text-2xl font-bold">{kpis.fcr}</p>
                <p className="text-xs text-gray-400">الهدف: 1.5</p>
              </div>
              
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <Scale size={20} />
                  <span className="text-sm font-semibold">العلف المستهلك</span>
                </div>
                <p className="text-2xl font-bold">{kpis.totalFeed} <span className="text-sm">كغ</span></p>
              </div>
              
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-purple-500 mb-2">
                  <Activity size={20} />
                  <span className="text-sm font-semibold">العدد الحالي</span>
                </div>
                <p className="text-2xl font-bold">{kpis.currentCount}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-64">
              <h3 className="font-bold text-gray-700 mb-4">منحنى نمو الوزن</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentCycle.logs}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="avgWeight" stroke="#10b981" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* DATA ENTRY VIEW */}
        {activeTab === 'entry' && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">سجل اليوم</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">عدد الوفيات</label>
              <input type="number" name="mortality" value={formData.mortality} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">العلف (كجم)</label>
              <input type="number" name="feedConsumed" value={formData.feedConsumed} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">استهلاك الماء (لتر)</label>
              <input type="number" name="waterConsumed" value={formData.waterConsumed} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">متوسط الوزن (جرام)</label>
              <input type="number" step="0.01" name="avgWeight" value={formData.avgWeight} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
            </div>

            <button type="submit" className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition">
              <Save size={18} />
              حفظ البيانات
            </button>
          </form>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 z-10">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <Activity />
          <span className="text-xs mt-1">التقرير</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('entry')} 
          className="bg-emerald-600 text-white p-4 rounded-full -mt-8 shadow-lg border-4 border-gray-50"
        >
          <PlusCircle size={28} />
        </button>

        <button 
          onClick={() => alert('ميزة التصدير PDF قادمة قريباً')} 
          className="flex flex-col items-center text-gray-400 hover:text-emerald-600"
        >
          <Droplets />
          <span className="text-xs mt-1">المزيد</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
