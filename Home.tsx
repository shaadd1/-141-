
import React, { useState, useEffect } from 'react';

interface HomeProps {
  onParentLogin: (email: string, studentName: string, studentClass: string) => void;
  onTeacherLogin: (teacherName: string, email?: string, password?: string) => void;
}

const Home: React.FC<HomeProps> = ({ onParentLogin, onTeacherLogin }) => {
  const [loginMode, setLoginMode] = useState<'parent' | 'teacher'>('parent');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Login States
  const [email, setEmail] = useState('');
  const [studentName, setStudentName] = useState('');
  
  // Selection States for Class
  const [studentLevel, setStudentLevel] = useState('');
  const [studentSection, setStudentSection] = useState('');
  
  const [rememberMeParent, setRememberMeParent] = useState(false);

  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [password, setPassword] = useState('');
  
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');

  const levels = [
    'أولى ابتدائي',
    'ثاني ابتدائي',
    'ثالث ابتدائي',
    'رابع ابتدائي',
    'خامس ابتدائي',
    'سادس ابتدائي'
  ];

  useEffect(() => {
    const savedParentEmail = localStorage.getItem('parent_email');
    const savedParentName = localStorage.getItem('parent_student_name');
    if (savedParentEmail && savedParentName) {
      setEmail(savedParentEmail);
      setStudentName(savedParentName);
      setRememberMeParent(true);
    }
  }, []);

  const handleParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !studentName || !studentLevel || !studentSection) {
      setError('يرجى إكمال كافة البيانات واختيار المرحلة والفصل');
      return;
    }

    const finalClass = `${studentLevel} / ${studentSection}`;

    if (rememberMeParent) {
      localStorage.setItem('parent_email', email);
      localStorage.setItem('parent_student_name', studentName);
    }
    onParentLogin(email, studentName, finalClass);
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!teacherEmail || !password || !teacherName) {
      setError('يرجى تعبئة كافة بيانات المنسوبة');
      return;
    }
    onTeacherLogin(teacherName, teacherEmail, password);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get stored credentials if available
    const savedAuth = localStorage.getItem('admin_auth_config');
    let adminEmailConfig = 'jahim.4u@gmail.com';
    let adminPassConfig = 'Semoo1345';
    let secondaryAdmins: string[] = [];

    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      adminEmailConfig = parsed.primaryEmail;
      adminPassConfig = parsed.primaryPass;
      secondaryAdmins = parsed.secondaryEmails || [];
    }

    const enteredEmail = adminEmail.trim().toLowerCase();
    
    const isPrimary = enteredEmail === adminEmailConfig.trim().toLowerCase() && adminPassword === adminPassConfig;
    const isSecondary = secondaryAdmins.some(email => email.trim().toLowerCase() === enteredEmail) && adminPassword === adminPassConfig;

    if (isPrimary || isSecondary) {
      onTeacherLogin('مدير النظام', enteredEmail, adminPassword);
    } else {
      setError('بيانات الدخول للمسؤول غير صحيحة');
    }
  };

  const inputClasses = "w-full bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800/50 focus:border-emerald-600/50 p-6 rounded-[2.5rem] outline-none font-black text-sm text-zinc-900 dark:text-white transition-all";
  const labelClasses = "text-sm font-black text-zinc-950 dark:text-white mr-5 tracking-tight";

  return (
    <div className="container mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between min-h-[85vh] gap-16 relative z-10 text-right">
      
      {/* Admin Login Modal (The Admin / المسؤول Portal) */}
      {showAdminPanel && (
        <div className="fixed inset-0 z-[500] bg-black/40 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-white/95 dark:bg-zinc-900/95 w-full max-w-[300px] rounded-[3rem] shadow-2xl border border-white/40 dark:border-zinc-800/40 relative overflow-hidden transition-all">
            <div className="bg-zinc-950 p-6 text-center">
              <div className="w-12 h-12 bg-amber-500 rounded-[1rem] flex items-center justify-center mx-auto mb-3 shadow-xl">
                 <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                 </svg>
              </div>
              <h3 className="text-lg font-black text-white">الادمن ( المسؤول )</h3>
              <button onClick={() => setShowAdminPanel(false)} className="absolute top-5 left-5 text-zinc-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleAdminSubmit} className="p-6 space-y-4">
              <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-800 border-none p-3.5 rounded-2xl outline-none font-black text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition-all" placeholder="البريد الإلكتروني" dir="ltr" required />
              <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-800 border-none p-3.5 rounded-2xl outline-none font-black text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition-all" placeholder="كلمة السر" required />
              <button type="submit" className="w-full py-3.5 bg-zinc-950 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-black rounded-2xl text-xs transition-all shadow-xl active:scale-95">تسجيل الدخول</button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Admin Button (Trigger) */}
      <div className="fixed bottom-12 left-12 z-[200]">
        <button 
          onClick={() => setShowAdminPanel(true)} 
          className="w-16 h-16 rounded-[2rem] bg-zinc-950 dark:bg-zinc-800 flex items-center justify-center shadow-[0_12px_24px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-90 transition-all group border-4 border-white/20"
        >
          <svg className="w-8 h-8 text-zinc-500 group-hover:text-amber-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      </div>

      {/* Left Content */}
      <div className="flex-1 animate-in slide-in-from-right duration-1000 space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-full text-xs font-black tracking-widest border border-emerald-200 dark:border-emerald-800/50">
            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            بروتوكول تواصل رسمي مشفر وآمن
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-zinc-950 dark:text-white leading-[1.1] tracking-tight">
            بوابة التواصل الآمن <br/>
            <span className="text-emerald-700 dark:text-emerald-500 drop-shadow-sm">للابتدائية ١٤١ بجدة</span>
          </h2>
          <p className="text-2xl text-zinc-500 dark:text-zinc-400 font-bold leading-relaxed max-w-xl border-r-4 border-emerald-600 pr-6">
            بيئة رقمية مغلقة تضمن خصوصية ولي الأمر والمنسوبة، موفرةً أدوات تواصل عصرية بمعايير أمان عالية تشمل الروم الصوتي والمراسلة الرسمية.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="p-8 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              <h4 className="font-black text-sm mb-2 text-zinc-900 dark:text-white">رومات صوتية آمنة</h4>
              <p className="text-[10px] text-zinc-400 font-bold leading-relaxed">قنوات تواصل صوتية مباشرة بخصوصية تامة.</p>
           </div>
           
           <div className="p-8 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h4 className="font-black text-sm mb-2 text-zinc-900 dark:text-white">مراسلة رسمية</h4>
              <p className="text-[10px] text-zinc-400 font-bold leading-relaxed">نظام بريد داخلي معتمد لتبادل الاستفسارات.</p>
           </div>

           <div className="p-8 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
              </div>
              <h4 className="font-black text-sm mb-2 text-zinc-900 dark:text-white">تسجيلات محمية</h4>
              <p className="text-[10px] text-zinc-400 font-bold leading-relaxed">إرسال استفسارات صوتية مشفرة ومؤمنة بالكامل.</p>
           </div>
        </div>
      </div>

      {/* Right Content (Login Portal) */}
      <div className="w-full lg:w-[500px] animate-in slide-in-from-left duration-1000">
        <div className="bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-3xl rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.6)] border border-white dark:border-zinc-800/50 overflow-hidden relative">
          
          <div className="flex bg-zinc-100 dark:bg-black/50 p-2.5 m-5 rounded-[3.5rem] gap-2">
            <button 
              onClick={() => { setLoginMode('parent'); setError(''); }} 
              className={`flex-1 py-5 rounded-[3rem] font-black text-xs transition-all duration-500 ${loginMode === 'parent' ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 shadow-xl' : 'text-zinc-400'}`}
            >
              بوابة أولياء الأمور
            </button>
            <button 
              onClick={() => { setLoginMode('teacher'); setError(''); }} 
              className={`flex-1 py-5 rounded-[3rem] font-black text-xs transition-all duration-500 ${loginMode === 'teacher' ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xl' : 'text-zinc-400'}`}
            >
              بوابة المنسوبات
            </button>
          </div>

          <form onSubmit={loginMode === 'parent' ? handleParentSubmit : handleTeacherSubmit} className="p-14 pt-6 space-y-7">
            <div className="text-center mb-4">
               <h3 className="text-3xl font-black text-zinc-950 dark:text-white">دخول آمن</h3>
            </div>

            {loginMode === 'parent' ? (
              <>
                <div className="space-y-2">
                  <label className={labelClasses}>البريد الشخصي لولي الامر</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className={inputClasses} 
                      placeholder="example@mail.com" 
                      dir="ltr" 
                    />
                    <svg className="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelClasses}>أسم الطالبة</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={studentName} 
                      onChange={(e) => setStudentName(e.target.value)} 
                      className={inputClasses} 
                      placeholder="أدخل الاسم الثلاثي للطالبة" 
                    />
                    <svg className="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                </div>
                
                <div className="space-y-5 pt-2">
                   <div className="space-y-2">
                      <label className={labelClasses}>اختيار المرحلة الدراسية</label>
                      <select 
                        value={studentLevel} 
                        onChange={(e) => setStudentLevel(e.target.value)}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                      >
                        <option value="">-- حدد المرحلة --</option>
                        {levels.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                   </div>
                   
                   <div className="space-y-2">
                      <label className={labelClasses}>اختيار الفصل</label>
                      <div className="flex gap-4">
                        {['١', '٢'].map(section => (
                          <button 
                            key={section}
                            type="button"
                            onClick={() => setStudentSection(section)}
                            className={`flex-1 py-5 rounded-2xl font-black text-sm transition-all border-2 ${studentSection === section ? 'bg-emerald-700 border-emerald-700 text-white shadow-lg' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-white hover:border-emerald-200'}`}
                          >
                            فصل {section}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className={labelClasses}>الاسم الرسمي للمنسوبة</label>
                  <input 
                    type="text" 
                    value={teacherName} 
                    onChange={(e) => setTeacherName(e.target.value)} 
                    className={inputClasses} 
                    placeholder="الاسم الرباعي" 
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClasses}>البريد الشخصي</label>
                  <input 
                    type="email" 
                    value={teacherEmail} 
                    onChange={(e) => setTeacherEmail(e.target.value)} 
                    className={inputClasses} 
                    placeholder="example@mail.com" 
                    dir="ltr" 
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClasses}>كلمة السر</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className={inputClasses} 
                    placeholder="••••••••" 
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-5 rounded-3xl text-[11px] font-black border border-red-100 dark:border-red-900/40 text-center animate-shake">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className={`w-full py-7 rounded-[3rem] text-white font-black text-sm shadow-2xl transition-all duration-500 active:scale-95 group relative overflow-hidden ${loginMode === 'teacher' ? 'bg-zinc-950 dark:bg-zinc-800' : 'bg-emerald-800'}`}
            >
              <span className="relative z-10">تأكيد الدخول الآمن</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
