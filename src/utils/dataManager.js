// هذا الملف يدير البيانات محلياً (Offline-First)
const STORAGE_KEY = 'poultry_cycles_data';

export const getCycles = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveDailyLog = (cycleId, logData) => {
  const cycles = getCycles();
  const cycleIndex = cycles.findIndex(c => c.id === cycleId);
  
  if (cycleIndex > -1) {
    cycles[cycleIndex].logs.push(logData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cycles));
    return true;
  }
  return false;
};

// معادلات ERP وحساب KPIs
export const calculateKPIs = (cycle) => {
  if (!cycle || !cycle.logs.length) return null;

  let totalFeed = 0; // بالكيلو
  let currentTotalWeight = 0; // الوزن القائم الحالي
  let totalDead = 0;
  
  cycle.logs.forEach(log => {
    totalFeed += Number(log.feedConsumed);
    totalDead += Number(log.mortality);
    // نفترض أن آخر سجل يحتوي على أحدث متوسط وزن
    if(log.avgWeight) currentTotalWeight = (cycle.initialCount - totalDead) * log.avgWeight; 
  });

  const mortalityRate = ((totalDead / cycle.initialCount) * 100).toFixed(2);
  
  // FCR = العلف المستهلك / الوزن الحي المنتج
  // (معادلة مبسطة للتوضيح)
  const fcr = currentTotalWeight > 0 ? (totalFeed / currentTotalWeight).toFixed(2) : 0;

  return {
    mortalityRate,
    totalFeed,
    totalDead,
    fcr,
    currentCount: cycle.initialCount - totalDead
  };
};

// بيانات تجريبية (لأول مرة)
export const initDemoData = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const demoData = [{
      id: 1,
      name: 'دورة يناير 2024',
      status: 'active', // تحضين، تربية، إنتاج
      initialCount: 5000,
      startDate: '2024-01-01',
      logs: [] 
    }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
  }
};
