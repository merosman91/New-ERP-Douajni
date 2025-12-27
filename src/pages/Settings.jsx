import React, { useRef } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { Download, Upload, ShieldCheck, Database } from 'lucide-react';

const Settings = () => {
  const { exportBackup, importBackup, data } = useGlobal();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => importBackup(event.target.result);
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold text-gray-800">الإعدادات والأمان</h2>

      <div className="bg-white p-5 rounded-xl shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b pb-4">
          <Database className="text-emerald-600" />
          <div>
            <h3 className="font-bold">النسخ الاحتياطي</h3>
            <p className="text-xs text-gray-500">احفظ بياناتك خارج المتصفح لتجنب فقدانها</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={exportBackup}
            className="flex items-center justify-center gap-2 bg-emerald-100 text-emerald-800 py-3 rounded-lg font-bold border border-emerald-200 hover:bg-emerald-200"
          >
            <Download size={20} />
            تصدير ملف البيانات (Save)
          </button>

          <button 
            onClick={() => fileInputRef.current.click()}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-3 rounded-lg font-bold border border-gray-200 hover:bg-gray-200"
          >
            <Upload size={20} />
            استرجاع نسخة (Restore)
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
        <ShieldCheck className="text-blue-600 shrink-0" />
        <p className="text-sm text-blue-800">
          <strong>نصيحة:</strong> قم بتصدير نسخة احتياطية كل يوم جمعة أو بعد نهاية الدورة وأرسلها لنفسك عبر الواتساب.
        </p>
      </div>
    </div>
  );
};

export default Settings;
