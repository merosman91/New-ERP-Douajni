import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

const initialData = {
  settings: { farmName: 'مزرعة الخير', targetDays: 45, targetWeight: 2500 },
  cycle: { id: 'c1', startDate: new Date().toISOString().split('T')[0], initialCount: 5000 },
  inventory: { feed: 0 }, // رصيد العلف بالكيلو
  logs: [],
  transactions: [],
  vaccines: [
    { id: 1, name: 'هيتشنر + IB', day: 7, done: false },
    { id: 2, name: 'جامبورو', day: 14, done: false },
    { id: 3, name: 'لاسوتا', day: 20, done: false },
  ]
};

export const GlobalProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('poultry_erp_v2');
      return saved ? JSON.parse(saved) : initialData;
    } catch (e) {
      return initialData;
    }
  });

  useEffect(() => {
    localStorage.setItem('poultry_erp_v2', JSON.stringify(data));
  }, [data]);

  // --- 1. إدارة المخزون (إضافة وسحب) ---
  const addToInventory = (amountKg) => {
    setData(prev => ({
      ...prev,
      inventory: { ...prev.inventory, feed: prev.inventory.feed + Number(amountKg) }
    }));
  };

  // --- 2. التسجيل اليومي مع الخصم الذكي ---
  const addLog = (logData) => {
    const feedConsumed = Number(logData.feed);

    // تحقق من توفر الرصيد قبل الخصم
    if (data.inventory.feed < feedConsumed) {
      alert(`⚠️ خطأ: لا يوجد رصيد كافي من العلف! المتوفر: ${data.inventory.feed} كجم`);
      return false; // فشل العملية
    }

    const newLog = { ...logData, id: uuidv4(), date: new Date().toISOString() };
    
    setData(prev => ({
      ...prev,
      inventory: { ...prev.inventory, feed: prev.inventory.feed - feedConsumed }, // خصم العلف
      logs: [...prev.logs, newLog]
    }));
    return true; // نجاح العملية
  };

  // --- 3. نظام النسخ الاحتياطي ---
  const exportBackup = () => {
    const dataStr = JSON.stringify(data);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `backup_farm_${new Date().toISOString().slice(0,10)}.json`;

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importBackup = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      // تحقق بسيط من صحة الملف
      if (!parsed.cycle || !parsed.logs) throw new Error("ملف غير صالح");
      setData(parsed);
      alert("✅ تم استرجاع البيانات بنجاح!");
    } catch (e) {
      alert("❌ خطأ: ملف النسخة الاحتياطية تالف أو غير صحيح.");
    }
  };

  // --- الوظائف المساعدة ---
  const getKPIs = () => {
    // ... (نفس حسابات الـ KPIs السابقة)
    const start = new Date(data.cycle.startDate);
    const today = new Date();
    const age = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
    
    let totalDead = 0;
    data.logs.forEach(l => totalDead += Number(l.mortality));
    const currentCount = data.cycle.initialCount - totalDead;

    return { age, currentCount, feedStock: data.inventory.feed };
  };

  return (
    <GlobalContext.Provider value={{ data, addLog, addToInventory, exportBackup, importBackup, getKPIs }}>
      {children}
    </GlobalContext.Provider>
  );
};
