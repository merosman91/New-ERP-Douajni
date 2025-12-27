import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

// بيانات أولية فارغة للمزرعة الجديدة
const initialData = {
  settings: {
    farmName: 'مزرعة الخير',
    role: 'manager', // 'manager' or 'worker'
    targetDays: 45,
    targetWeight: 2500, // جرام
  },
  cycle: {
    id: 'cycle-001',
    startDate: new Date().toISOString().split('T')[0],
    breed: 'Ross 308',
    initialCount: 5000,
    costPerChick: 450, // سعر الكتكوت
  },
  logs: [],
  transactions: [], // { id, date, type: 'expense'|'income', category, amount, notes }
  inventory: {
    feed: { start: 0, grow: 0, finish: 0 },
    meds: []
  },
  vaccines: [
    { id: 1, name: 'نيوكاسل', day: 7, done: false },
    { id: 2, name: 'جامبورو', day: 14, done: false },
    { id: 3, name: 'لاسوتا', day: 21, done: false },
  ]
};

export const GlobalProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('poultry_app_v1');
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('poultry_app_v1', JSON.stringify(data));
  }, [data]);

  // --- الوظائف الأساسية ---

  const addLog = (logData) => {
    const newLog = { ...logData, id: uuidv4(), date: new Date().toISOString() };
    setData(prev => ({ ...prev, logs: [...prev.logs, newLog] }));
  };

  const addTransaction = (txData) => {
    setData(prev => ({ ...prev, transactions: [...prev.transactions, { ...txData, id: uuidv4() }] }));
  };

  const toggleVaccine = (id) => {
    setData(prev => ({
      ...prev,
      vaccines: prev.vaccines.map(v => v.id === id ? { ...v, done: !v.done } : v)
    }));
  };

  const updateSettings = (newSettings) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...newSettings } }));
  };

  // --- الحسابات الذكية (KPIs) ---
  const getKPIs = () => {
    const { cycle, logs, transactions } = data;
    
    // 1. العمر
    const start = new Date(cycle.startDate);
    const today = new Date();
    const age = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;

    // 2. المجاميع من السجلات
    let totalDead = 0;
    let totalFeed = 0; // كجم
    let lastWeight = 0; // جرام

    logs.forEach(log => {
      totalDead += Number(log.mortality || 0);
      totalFeed += Number(log.feed || 0);
      if (log.weight > 0) lastWeight = Number(log.weight);
    });

    const currentCount = cycle.initialCount - totalDead;
    const mortalityRate = ((totalDead / cycle.initialCount) * 100).toFixed(2);
    
    // 3. FCR (التحويل الغذائي)
    // الوزن الحي الكلي (طن) = (العدد الحالي * متوسط الوزن) / 1000 / 1000
    // FCR = العلف المستهلك (كجم) / الوزن الحي (كجم)
    const totalLiveWeightKg = (currentCount * lastWeight) / 1000;
    const fcr = totalLiveWeightKg > 0 ? (totalFeed / totalLiveWeightKg).toFixed(2) : 0;

    // 4. المالية
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    // إضافة تكلفة الكتاكيت المبدئية للمصروفات
    const chickCost = cycle.initialCount * cycle.costPerChick;
    const totalCost = expenses + chickCost;

    const costPerBird = currentCount > 0 ? (totalCost / currentCount).toFixed(1) : 0;

    return {
      age,
      currentCount,
      totalDead,
      mortalityRate,
      totalFeed,
      lastWeight,
      fcr,
      totalCost,
      costPerBird
    };
  };

  return (
    <GlobalContext.Provider value={{ data, addLog, addTransaction, toggleVaccine, updateSettings, getKPIs }}>
      {children}
    </GlobalContext.Provider>
  );
};
