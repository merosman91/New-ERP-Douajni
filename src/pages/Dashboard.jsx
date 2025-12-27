import React, { useEffect, useState } from 'react';
import { calculateKPIs, getLogsByCycle, loadData } from '../store/dataStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Share2, AlertTriangle, TrendingUp } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [chartData, setChartData] = useState([]);
  const activeCycleId = 'cycle-1'; // يمكن تغييره ليكون ديناميكياً

  useEffect(() => {
    setKpis(calculateKPIs(activeCycleId));
    setChartData(getLogsByCycle(activeCycleId));
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Poultry Farm Report", 10, 10);
    
    // جدول البيانات
    const tableData = chartData.map(log => [log.date, log.mortality, log.feed, log.weight]);
    doc.autoTable({
      head: [['Date', 'Mortality', 'Feed (kg)', 'Weight (g)']],
      body: tableData,
    });
    doc.save('report.pdf');
  };

  const shareWhatsApp = () => {
    if(!kpis) return;
    const text = `📊 تقرير المزرعة:\n- النافق: ${kpis.mortalityRate}%\n- التحويل (FCR): ${kpis.fcr}\n- الوزن الحالي: ${kpis.currentAvgWeight}g`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!kpis) return <div className="text-center mt-10">جاري تحميل البيانات...</div>;

  return (
    <div className="space-y-6">
      {/* بطاقات المؤشرات */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100">
          <p className="text-gray-500 text-xs">معدل التحويل (FCR)</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-emerald-700">{kpis.fcr}</span>
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100">
          <p className="text-gray-500 text-xs">نسبة النفوق</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-red-600">{kpis.mortalityRate}%</span>
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">العدد: {kpis.totalDead} طير</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
          <p className="text-gray-500 text-xs">متوسط الوزن</p>
          <span className="text-2xl font-bold text-blue-700">{kpis.currentAvgWeight} <span className="text-sm">جم</span></span>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100">
          <p className="text-gray-500 text-xs">استهلاك العلف</p>
          <span className="text-2xl font-bold text-orange-700">{kpis.totalFeed} <span className="text-sm">كجم</span></span>
        </div>
      </div>

      {/* الرسم البياني */}
      <div className="bg-white p-4 rounded-2xl shadow-sm h-72">
        <h3 className="font-bold text-gray-700 mb-4 text-sm">منحنى نمو الوزن</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" hide />
            <YAxis orientation="right" tick={{fontSize: 10}} />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#059669" strokeWidth={3} dot={{r: 4}} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex gap-3">
        <button onClick={exportPDF} className="flex-1 bg-gray-800 text-white py-3 rounded-xl flex justify-center items-center gap-2 shadow-lg">
          <Download size={18} /> تقرير PDF
        </button>
        <button onClick={shareWhatsApp} className="flex-1 bg-green-500 text-white py-3 rounded-xl flex justify-center items-center gap-2 shadow-lg">
          <Share2 size={18} /> واتساب
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
