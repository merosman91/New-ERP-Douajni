import { v4 as uuidv4 } from 'uuid';

const DB_KEY = 'poultry_erp_db';

// التهيئة الأولية للبيانات
const initialData = {
  cycles: [
    {
      id: 'cycle-1',
      name: 'دورة رقم 1 (تجريبية)',
      startDate: new Date().toISOString().split('T')[0],
      initialBirds: 5000,
      status: 'active', // active, closed
      breed: 'Ross 308'
    }
  ],
  logs: [], // السجلات اليومية
  transactions: [] // المصروفات والإيرادات
};

// تحميل البيانات
export const loadData = () => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : initialData;
};

// حفظ البيانات
const saveData = (data) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// --- وظائف السجلات اليومية ---
export const addDailyLog = (log) => {
  const db = loadData();
  const newLog = { ...log, id: uuidv4(), timestamp: new Date().toISOString() };
  db.logs.push(newLog);
  saveData(db);
  return newLog;
};

export const getLogsByCycle = (cycleId) => {
  const db = loadData();
  return db.logs.filter(log => log.cycleId === cycleId).sort((a, b) => new Date(a.date) - new Date(b.date));
};

// --- وظائف المالية ---
export const addTransaction = (transaction) => {
  const db = loadData();
  db.transactions.push({ ...transaction, id: uuidv4() });
  saveData(db);
};

export const getFinancials = (cycleId) => {
  const db = loadData();
  const txs = db.transactions.filter(t => t.cycleId === cycleId);
  
  const expenses = txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  const revenue = txs.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  
  return { expenses, revenue, profit: revenue - expenses, transactions: txs };
};

// --- حساب مؤشرات الأداء (The Brain) ---
export const calculateKPIs = (cycleId) => {
  const db = loadData();
  const cycle = db.cycles.find(c => c.id === cycleId);
  const logs = db.logs.filter(l => l.cycleId === cycleId);

  if (!cycle) return null;

  const totalFeed = logs.reduce((sum, log) => sum + Number(log.feed), 0);
  const totalDead = logs.reduce((sum, log) => sum + Number(log.mortality), 0);
  
  // آخر وزن تم تسجيله
  const lastLog = logs[logs.length - 1];
  const currentAvgWeight = lastLog ? Number(lastLog.weight) : 0; // بالجرام
  
  const currentBirds = cycle.initialBirds - totalDead;
  const totalWeightKg = (currentBirds * currentAvgWeight) / 1000;

  // FCR = العلف المستهلك / الوزن اللحم المنتج
  const fcr = totalWeightKg > 0 ? (totalFeed / totalWeightKg).toFixed(2) : 0;
  const mortalityRate = ((totalDead / cycle.initialBirds) * 100).toFixed(2);

  return {
    cycleName: cycle.name,
    age: logs.length, // العمر بالأيام تقريباً
    currentBirds,
    totalDead,
    mortalityRate,
    totalFeed,
    fcr,
    currentAvgWeight
  };
};
