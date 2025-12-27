import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Coins, Menu } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import DailyEntry from './pages/DailyEntry';
import Finance from './pages/Finance';

// مكون التنقل السفلي
const BottomNav = () => {
  const location = useLocation();
  const navClass = (path) => 
    `flex flex-col items-center justify-center w-full h-full ${location.pathname === path ? 'text-emerald-600 border-t-2 border-emerald-600' : 'text-gray-400'}`;

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex justify-between px-2 shadow-lg z-50">
      <Link to="/" className={navClass('/')}>
        <LayoutDashboard size={24} />
        <span className="text-xs mt-1 font-medium">الرئيسية</span>
      </Link>
      <Link to="/entry" className={navClass('/entry')}>
        <FilePlus size={24} />
        <span className="text-xs mt-1 font-medium">سجل اليوم</span>
      </Link>
      <Link to="/finance" className={navClass('/finance')}>
        <Coins size={24} />
        <span className="text-xs mt-1 font-medium">المالية</span>
      </Link>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans pb-20" dir="rtl">
        {/* Header */}
        <header className="bg-emerald-700 text-white p-4 shadow-md sticky top-0 z-40">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold">ERP دواجن</h1>
            <button className="p-1"><Menu size={24} /></button>
          </div>
        </header>

        <main className="p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/entry" element={<DailyEntry />} />
            <Route path="/finance" element={<Finance />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
 
