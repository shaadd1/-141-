
import React, { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  userName?: string;
  studentClass?: string;
  onLogout?: () => void;
  showNav: boolean;
  role?: 'parent' | 'teacher' | 'admin';
  ministryName?: string;
  schoolName?: string;
  primaryColor?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, userName, studentClass, onLogout, showNav, role, ministryName, schoolName, primaryColor = 'emerald' }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const getColorClass = () => {
    const map: Record<string, string> = {
      emerald: 'bg-[#006C35] shadow-emerald-900/20',
      blue: 'bg-[#005a9c] shadow-blue-900/20',
      rose: 'bg-rose-800 shadow-rose-900/20',
      violet: 'bg-violet-800 shadow-violet-900/20',
      zinc: 'bg-zinc-900 shadow-black/40'
    };
    return map[primaryColor] || map.emerald;
  };

  const getTextColorClass = () => {
    const map: Record<string, string> = {
      emerald: 'text-[#006C35] dark:text-emerald-500',
      blue: 'text-[#005a9c] dark:text-blue-500',
      rose: 'text-rose-700 dark:text-rose-500',
      violet: 'text-violet-700 dark:text-violet-500',
      zinc: 'text-zinc-700 dark:text-zinc-400'
    };
    return map[primaryColor] || map.emerald;
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-700 ease-in-out relative text-right font-cairo">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#f4f7f6] dark:bg-[#080808] transition-colors duration-700"></div>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <header className="relative z-50 bg-white dark:bg-zinc-900 border-b-4 border-[#006C35] transition-all duration-700 sticky top-0 shadow-lg">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            
            <div className="flex items-center gap-4">
               {/* Official Emblem Container */}
               <div className={`w-11 h-11 rounded-lg flex items-center justify-center shadow-md ${getColorClass()}`}>
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                 </svg>
               </div>
               <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-black tracking-tight text-zinc-800 dark:text-white leading-none">{ministryName || 'وزارة التعليم'}</h1>
                  <span className="text-[#006C35] text-xs">●</span>
                </div>
                <p className={`text-[10px] font-bold mt-0.5 tracking-wide opacity-70 ${getTextColorClass()}`}>{schoolName || 'الابتدائية 141 بجدة'}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Vision 2030 Large Badge */}
              <div className="flex items-center gap-4 px-5 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 transition-all hover:bg-white shadow-sm">
                <div className="flex flex-col items-center leading-none">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="font-black text-[8px] text-[#006C35] tracking-widest uppercase">VISION</span>
                    <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  </div>
                  <span className="text-zinc-900 dark:text-white font-black text-3xl tracking-tighter leading-none">2030</span>
                </div>
                <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="text-center">
                  <span className="block text-[10px] font-black text-zinc-400 leading-none mb-1">المملكة العربية السعودية</span>
                  <span className="block text-[10px] font-black text-[#006C35] leading-none">رؤيـــــــــة</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsDark(!isDark)}
                  className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-[#006C35] transition-all"
                >
                  {isDark ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                  )}
                </button>

                {showNav && (
                  <button 
                    onClick={onLogout}
                    className="bg-[#006C35] text-white px-5 py-2.5 rounded-xl transition-all text-xs font-black shadow-md hover:bg-red-700"
                  >
                    خروج
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow relative z-10">
        {children}
      </main>

      <footer className="relative z-10 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 mt-12 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-center">
                <svg className="w-6 h-6 text-[#006C35]" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                </svg>
              </div>
              <div>
                <span className="block text-sm font-black text-zinc-800 dark:text-zinc-200">بوابة التواصل</span>
                <span className="block text-[10px] font-bold text-zinc-400">نظام موحد وآمن</span>
              </div>
            </div>
            
            <div className="flex gap-8">
               <div className="text-center">
                  <span className="block text-2xl font-black text-zinc-800 dark:text-white leading-none mb-1 tracking-tighter">2030</span>
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Vision</span>
               </div>
               <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800"></div>
               <div className="text-center">
                  <span className="block text-lg font-black text-[#006C35] leading-none mb-1">141</span>
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">School</span>
               </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 transition-colors uppercase tracking-wider">
              جميع الحقوق محفوظة للابتدائية ١٤١ بجدة &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
