import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusSquare, PieChart, Settings, Syringe } from 'lucide-react';
import { GlobalProvider, useGlobal } from './context/GlobalContext';
import Dashboard from './pages/Dashboard';
import DailyLog from './pages/DailyLog';
import Finance from './pages/Finance';
// (Inventory & Settings pages can be simple placeholders for now)

const BottomNav = () => {
  const location = useLocation();
  const { data } = useGlobal();
  const isWorker = data.settings.role === 'worker';

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link to={to} className={`flex flex-col items-center justify-center w-full h-full ${location.pathname === to ? 'text-emerald-600' : 'text-gray-400'}`}>
      <Icon size={24} strokeWidth={location.pathname === to ? 2.5 : 2} />
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="fixed bottom-0 left-0 w-full h-18 bg-white border-t border-gray-200 flex justify-between px-2 pb-1 pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <NavItem to="/" icon={LayoutDashboard} label="الرئيسية" />
      <NavItem to="/log" icon={PlusSquare} label="تسجيل" />
      
      {!isWorker && <NavItem to="/finance" icon={PieChart} label="المالية" />}
      
      {/* صفحة الصحة والمخزون مدمجة للتبسيط */}
      <NavItem to="/health" icon={Syringe} label="الصحة" /> 
      
      {!isWorker && <NavItem to="/settings" icon={Settings} label="إعدادات" />}
    </div>
  );
};

const PlaceholderPage = ({ title }) => (
  <div className="p-10 text-center text-gray-500">
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p>قيد التطوير...</p>
  </div>
);

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 font-sans text-right" dir="rtl">
          <main className="p-4 max-w-md mx-auto min-h-screen bg-gray-50 shadow-2xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/log" element={<DailyLog />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/health" element={<PlaceholderPage title="الصحة والمخزون" />} />
              <Route path="/settings" element={<PlaceholderPage title="الإعدادات" />} />
            </Routes>
          </main>
          <div className="max-w-md mx-auto">
             <BottomNav />
          </div>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;
