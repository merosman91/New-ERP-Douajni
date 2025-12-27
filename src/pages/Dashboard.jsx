import React from 'react';
import { useGlobal } from '../context/GlobalContext';
import { AlertTriangle, Droplets, Scale, Activity, TrendingUp, Syringe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data, getKPIs } = useGlobal();
  const kpi = getKPIs();
  const { settings } = data;
  
  // 1. منطق تنبيهات اللقاحات
  const todayVaccine = data.vaccines.find(v => v.day === kpi.age);
  const upcomingVaccine = data.vaccines.find(v => v.day > kpi.age && v.day <= kpi.age + 2);
  const nextVaccine = data.vaccines.find(v => v.day >= kpi.age && !v.done);

  // 2. منطق تنبيهات العلف
  const isLowFeed = kpi.feedStock < 200;

  return (
    <div className="space-y-5 pb-20">
      {/* رأس الصفحة */}
      <div className="bg-emerald-700 text-white p-6 rounded-b-3xl shadow-lg -mx-4 -mt-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">{settings.farmName}</h1>
            <p className="opacity-80 text-sm">الدورة: {data.cycle.breed}</p>
          </div>
          <div className="text-center bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <span className="block text-xs opacity-80">العمر</span>
            <span className="text-2xl font-bold">{kpi.age}</span>
            <span className="text-xs">/{settings.targetDays} يوم</span>
          </div>
        </div>
      </div>

      {/* منطقة التنبيهات الذكية */}
      <div className="space-y-2">
        {/* تنبيه اللقاح اليوم */}
        {todayVaccine && !todayVaccine.done && (
          <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg animate-pulse flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Syringe size={24} />
              <div>
                <p className="font-bold">مطلوب اليوم!</p>
                <p className="text-sm">لقاح: {todayVaccine.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* تنبيه اللقاح القادم (بدون تضارب مع اليوم) */}
        {upcomingVaccine && !todayVaccine && (
          <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-500" />
              <div>
                <p className="font-bold text-gray-800">تنبيه تحصين قادم</p>
                <p className="text-sm text-gray-600">موعد {upcomingVaccine.name} (يوم {upcomingVaccine.day})</p>
              </div>
            </div>
            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded">قريباً</span>
          </div>
        )}

        {/* تنبيه نفاذ العلف */}
        {isLowFeed && (
          <div className="bg-amber-100 border-r-4 border-amber-500 p-4 rounded shadow-sm">
            <p className="font-bold text-amber-800 flex items-center gap-2">
              <AlertTriangle size={18}/> انتبه: المخزون منخفض
            </p>
            <p className="text-sm text-amber-700">متبقي {kpi.feedStock} كجم فقط.</p>
          </div>
        )}
      </div>

      {/* بطاقات المؤشرات السريعة */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-blue-500">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <Scale size={16} /> متوسط الوزن
          </div>
          <p className="text-2xl font-bold text-gray-800">{kpi.lastWeight} <span className="text-sm font-normal">جم</span></p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-green-500">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <Activity size={16} /> معامل التحويل
          </div>
          <p className="text-2xl font-bold text-gray-800">{kpi.fcr}</p>
          <p className="text-[10px] text-gray-400">الهدف: 1.5</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-red-500">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <AlertTriangle size={16} /> العدد الحي
          </div>
          <p className="text-2xl font-bold text-gray-800">{kpi.currentCount}</p>
          <p className="text-xs text-red-500 mt-1">نافق: {kpi.totalDead} ({kpi.mortalityRate}%)</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-purple-500">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <TrendingUp size={16} /> التكلفة/طائر
          </div>
          <p className="text-2xl font-bold text-gray-800">{kpi.costPerBird}</p>
          <p className="text-[10px] text-gray-400">تراكمي</p>
        </div>
      </div>

      {/* زر العمل السريع */}
      <Link to="/log" className="block w-full bg-emerald-600 text-white p-4 rounded-xl shadow-lg text-center font-bold text-lg hover:bg-emerald-700 transition">
        تسجيل بيانات اليوم
      </Link>
    </div>
  );
};

export default Dashboard;
