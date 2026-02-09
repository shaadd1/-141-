
import React, { useState, useEffect } from 'react';
import { TEACHERS_DATA, Teacher } from '../constants';

interface SiteSettings {
  siteTitle: string;
  schoolName: string;
  ministryName: string;
  primaryColor: string;
  enableVoiceRoom: boolean;
  enableVoiceRecording: boolean;
  enableEmail: boolean;
}

interface AdminAuth {
  primaryEmail: string;
  primaryPass: string;
  secondaryEmails: string[];
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'staff_review' | 'live_monitor' | 'site_settings' | 'security_settings'>('staff_review');
  
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('site_teachers');
    return saved ? JSON.parse(saved) : TEACHERS_DATA;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('site_settings');
    return saved ? JSON.parse(saved) : {
      siteTitle: "بوابة تواصل الرقمية",
      schoolName: "الابتدائية 141 بجدة",
      ministryName: "وزارة التعليم",
      primaryColor: "emerald",
      enableVoiceRoom: true,
      enableVoiceRecording: true,
      enableEmail: true
    };
  });

  const [auth, setAuth] = useState<AdminAuth>(() => {
    const saved = localStorage.getItem('admin_auth_config');
    return saved ? JSON.parse(saved) : {
      primaryEmail: 'jahim.4u@gmail.com',
      primaryPass: 'Semoo1345',
      secondaryEmails: []
    };
  });

  const [newSecondaryEmail, setNewSecondaryEmail] = useState('');

  useEffect(() => {
    localStorage.setItem('site_teachers', JSON.stringify(teachers));
    localStorage.setItem('site_settings', JSON.stringify(settings));
    localStorage.setItem('admin_auth_config', JSON.stringify(auth));
    localStorage.setItem('site_config', JSON.stringify({
      ...settings,
      ministryLabel: settings.ministryName,
      schoolLabel: settings.schoolName,
    }));
  }, [teachers, settings, auth]);

  const handleApprove = (id: number | string) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, status: 'active' } : t));
  };

  const handleReject = (id: number | string) => {
    if (window.confirm('هل أنت متأكد من رفض طلب الانضمام هذا؟ سيتم حذفه نهائياً.')) {
      setTeachers(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleToggleFreeze = (id: number | string) => {
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'frozen' ? 'active' : 'frozen' };
      }
      return t;
    }));
  };

  const updateRole = (id: number | string, role: Teacher['role']) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, role } : t));
  };

  const getColorClass = (color: string) => {
    const map: Record<string, string> = {
      emerald: 'bg-emerald-600',
      blue: 'bg-blue-600',
      rose: 'bg-rose-600',
      violet: 'bg-violet-600',
      zinc: 'bg-zinc-800'
    };
    return map[color] || 'bg-emerald-600';
  };

  const addSecondaryEmail = () => {
    if (newSecondaryEmail && !auth.secondaryEmails.includes(newSecondaryEmail)) {
      setAuth({ ...auth, secondaryEmails: [...auth.secondaryEmails, newSecondaryEmail] });
      setNewSecondaryEmail('');
    }
  };

  const removeSecondaryEmail = (email: string) => {
    setAuth({ ...auth, secondaryEmails: auth.secondaryEmails.filter(e => e !== email) });
  };

  return (
    <div className="container mx-auto px-4 py-12 text-right min-h-screen">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
            <span className={`w-4 h-4 rounded-full animate-pulse ${getColorClass(settings.primaryColor)}`}></span>
            منصة الإدارة والتحكم الشامل
          </h2>
          <p className="text-zinc-500 font-bold mt-2 transition-colors">إدارة المنسوبات، تعيين المسميات، والمراقبة الفورية.</p>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setActiveTab('security_settings')} className="bg-zinc-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black border border-zinc-800 shadow-lg hover:bg-zinc-800 transition-all flex items-center gap-2">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
             تأمين الحساب
           </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        {[
          { id: 'staff_review', label: 'طلبات وقبول المنسوبات', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
          { id: 'live_monitor', label: 'المراقبة الفورية للنشاط', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
          { id: 'site_settings', label: 'ألوان وهوية الموقع', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
          { id: 'security_settings', label: 'إدارة الحساب والخصوصية', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-5 rounded-[1.8rem] font-black text-sm transition-all flex items-center gap-3 ${activeTab === tab.id ? `${getColorClass(settings.primaryColor)} text-white shadow-2xl scale-105` : 'bg-white dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600 border border-zinc-100 dark:border-zinc-700'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}/></svg>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-700">
        {activeTab === 'staff_review' && (
          <div className="space-y-12">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 border-4 border-dashed border-amber-200 dark:border-amber-900/30 shadow-xl overflow-hidden">
               <div className="flex items-center gap-4 mb-10">
                 <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping"></div>
                 <h3 className="text-2xl font-black text-zinc-900 dark:text-white underline decoration-amber-200 underline-offset-8">طلبات بانتظار الاعتماد وتحديد المسمى</h3>
               </div>
               
               <div className="space-y-6">
                 {teachers.filter(t => t.status === 'pending').length > 0 ? (
                   teachers.filter(t => t.status === 'pending').map(req => (
                     <div key={req.id} className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-700 flex flex-col lg:flex-row items-center justify-between gap-8 transition-all hover:bg-white dark:hover:bg-zinc-800">
                       <div className="flex items-center gap-6 flex-1">
                          <div className={`w-16 h-16 ${req.color} rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl`}>{req.name.charAt(0)}</div>
                          <div>
                            <p className="text-xl font-black text-zinc-900 dark:text-white">{req.name}</p>
                            <p className="text-xs text-zinc-400 font-bold" dir="ltr">{req.email}</p>
                          </div>
                       </div>
                       <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto">
                         <div className="flex flex-col gap-2 w-full md:w-auto">
                            <label className="text-[10px] font-black text-zinc-400 mr-2">أنا كمسؤول، اختار لها مسمى:</label>
                            <select 
                              value={req.role} 
                              onChange={(e) => updateRole(req.id, e.target.value as any)}
                              className="bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-700 px-6 py-3 rounded-xl text-xs font-black outline-none focus:border-emerald-500 transition-all text-zinc-900 dark:text-white"
                            >
                              <option value="teacher">معلمة</option>
                              <option value="principal">مديرة</option>
                              <option value="supervisor">مشرفة</option>
                              <option value="admin_staff">إدارية</option>
                            </select>
                         </div>
                         <div className="flex gap-4 w-full md:w-auto mt-4 md:mt-0">
                            <button onClick={() => handleReject(req.id)} className="flex-1 md:flex-none px-10 py-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black hover:bg-red-100 transition-all border border-red-100">رفض</button>
                            <button onClick={() => handleApprove(req.id)} className="flex-1 md:flex-none px-10 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all scale-105">قبول بالمسمى المختار</button>
                         </div>
                       </div>
                     </div>
                   ))
                 ) : (
                   <div className="text-center py-20 text-zinc-400 font-black italic">لا يوجد طلبات جديدة حالياً.</div>
                 )}
               </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 border border-zinc-100 dark:border-zinc-800 shadow-xl">
               <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-10 border-r-8 border-emerald-600 pr-5">الطاقم التعليمي والإداري الحالي</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {teachers.filter(t => t.status !== 'pending').map(teacher => (
                   <div key={teacher.id} className="p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-700 flex flex-col gap-6 relative group">
                     {teacher.status === 'frozen' && <div className="absolute top-4 left-4 bg-red-600 text-white text-[8px] px-3 py-1 rounded-full font-black animate-pulse">حساب مجمد</div>}
                     <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 ${teacher.color} rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg`}>{teacher.name.charAt(0)}</div>
                        <div className="flex-1">
                          <h4 className="text-lg font-black text-zinc-900 dark:text-white">{teacher.name}</h4>
                          <div className="flex gap-3 mt-1 text-zinc-900 dark:text-white">
                            <select value={teacher.role} onChange={(e) => updateRole(teacher.id, e.target.value as any)} className="bg-transparent text-[10px] font-black text-zinc-500 border-b border-zinc-300 outline-none">
                              <option value="teacher">معلمة</option>
                              <option value="principal">مديرة</option>
                              <option value="supervisor">مشرفة</option>
                              <option value="admin_staff">إدارية</option>
                            </select>
                          </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <button onClick={() => handleToggleFreeze(teacher.id)} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${teacher.status === 'frozen' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{teacher.status === 'frozen' ? 'إلغاء تجميد الحساب' : 'تجميد الحساب فوراً'}</button>
                        <button onClick={() => handleReject(teacher.id)} className="p-3 bg-white dark:bg-zinc-900 border text-zinc-300 hover:text-red-600 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'live_monitor' && (
          <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-12 border border-zinc-100 dark:border-zinc-800 shadow-xl">
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-10 border-r-8 border-blue-600 pr-5">المراقبة الفورية للنشاط</h3>
            <div className="space-y-6">
               {[
                 { student: 'سارة العتيبي', staff: 'أ. نورة', type: 'فتح روم صوتي', time: 'الآن' },
                 { student: 'ريما القحطاني', staff: 'أ. مريم', type: 'إرسال إيميل', time: 'قبل 5 دقائق' },
                 { student: 'نورة الشهري', staff: 'أ. هند', type: 'تسجيل صوتي', time: 'قبل 12 دقيقة' },
               ].map((log, i) => (
                 <div key={i} className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-700 hover:scale-[1.02] transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
                       <div>
                          <p className="font-black text-sm text-zinc-900 dark:text-white">تم <span className="text-blue-600">{log.type}</span> من الطالبة: <span className="underline decoration-blue-200">{log.student}</span></p>
                          <p className="text-xs text-zinc-500 font-bold mt-1">الموجهة إلى: {log.staff} • {log.time}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'site_settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl">
               <h3 className="text-xl font-black mb-8 border-r-4 border-emerald-600 pr-3 text-zinc-900 dark:text-white">تخصيص الهوية البصرية</h3>
               <div className="space-y-8">
                 <div>
                   <label className="text-[10px] font-black text-zinc-400 block mb-4 uppercase tracking-widest">اللون الرئيسي للنظام</label>
                   <div className="flex gap-4">
                     {['emerald', 'blue', 'rose', 'violet', 'zinc'].map(color => (
                       <button key={color} onClick={() => setSettings({...settings, primaryColor: color})} className={`w-14 h-14 rounded-2xl transition-all ${settings.primaryColor === color ? 'ring-4 ring-offset-2 ring-zinc-300 dark:ring-zinc-600 scale-110' : ''} ${getColorClass(color)} shadow-lg`} />
                     ))}
                   </div>
                 </div>
                 <div className="space-y-4">
                   <SettingInput label="اسم الوزارة" value={settings.ministryName} onChange={v => setSettings({...settings, ministryName: v})} />
                   <SettingInput label="اسم المنشأة" value={settings.schoolName} onChange={v => setSettings({...settings, schoolName: v})} />
                   <SettingInput label="عنوان الموقع" value={settings.siteTitle} onChange={v => setSettings({...settings, siteTitle: v})} />
                 </div>
               </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl">
               <h3 className="text-xl font-black mb-8 border-r-4 border-blue-600 pr-3 text-zinc-900 dark:text-white">تفعيل وتعطيل الوظائف</h3>
               <div className="space-y-6">
                 <ToggleRow label="تفعيل الروم الصوتي" active={settings.enableVoiceRoom} onToggle={() => setSettings({...settings, enableVoiceRoom: !settings.enableVoiceRoom})} />
                 <ToggleRow label="تفعيل التسجيل الصوتي" active={settings.enableVoiceRecording} onToggle={() => setSettings({...settings, enableVoiceRecording: !settings.enableVoiceRecording})} />
                 <ToggleRow label="تفعيل مراسلة الإيميل" active={settings.enableEmail} onToggle={() => setSettings({...settings, enableEmail: !settings.enableEmail})} />
               </div>
            </div>
          </div>
        )}

        {activeTab === 'security_settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Main Admin Account */}
            <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border-2 border-zinc-950 dark:border-zinc-700 shadow-2xl">
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-zinc-950 text-white rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zM7 7a3 3 0 016 0v2H7V7z"/></svg>
                 </div>
                 <h3 className="text-xl font-black text-zinc-900 dark:text-white">بيانات المسؤول الرئيسي</h3>
               </div>
               <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 mr-2">البريد الإلكتروني الحالي</label>
                    <input 
                      type="email" 
                      value={auth.primaryEmail} 
                      onChange={(e) => setAuth({...auth, primaryEmail: e.target.value})}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 p-5 rounded-2xl text-sm font-black outline-none focus:border-zinc-950 dark:focus:border-white transition-all text-zinc-900 dark:text-white"
                      dir="ltr"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 mr-2">كلمة السر الجديدة</label>
                    <input 
                      type="password" 
                      value={auth.primaryPass} 
                      onChange={(e) => setAuth({...auth, primaryPass: e.target.value})}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 p-5 rounded-2xl text-sm font-black outline-none focus:border-zinc-950 dark:focus:border-white transition-all text-zinc-900 dark:text-white"
                      placeholder="اتركها كما هي للمحافظة عليها"
                    />
                 </div>
                 <div className="pt-4">
                    <p className="text-[10px] text-zinc-400 font-bold bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-700">
                      ملاحظة: هذه البيانات هي التي تستخدمها للدخول من الخانة المخفية أسفل الصفحة الرئيسية.
                    </p>
                 </div>
               </div>
            </div>

            {/* Secondary Admin Accounts */}
            <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl">
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a7 7 0 00-7 7v1h11v-1a7 7 0 00-7-7z"/></svg>
                 </div>
                 <h3 className="text-xl font-black text-zinc-900 dark:text-white">مسؤولون إضافيون (اختياري)</h3>
               </div>
               
               <div className="space-y-6">
                 <div className="flex gap-3">
                    <input 
                      type="email" 
                      value={newSecondaryEmail}
                      onChange={(e) => setNewSecondaryEmail(e.target.value)}
                      placeholder="أضف بريد إلكتروني إضافي..."
                      className="flex-1 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 p-4 rounded-2xl text-xs font-black outline-none focus:border-blue-500 transition-all text-zinc-900 dark:text-white"
                      dir="ltr"
                    />
                    <button 
                      onClick={addSecondaryEmail}
                      className="bg-blue-600 text-white px-6 rounded-2xl font-black text-xs hover:bg-blue-700 transition-all"
                    >
                      إضافة
                    </button>
                 </div>

                 <div className="space-y-3">
                    {auth.secondaryEmails.length > 0 ? (
                      auth.secondaryEmails.map((email, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700 group">
                           <span className="text-xs font-black text-zinc-600 dark:text-zinc-400" dir="ltr">{email}</span>
                           <button 
                            onClick={() => removeSecondaryEmail(email)}
                            className="text-zinc-300 hover:text-red-500 transition-colors"
                           >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-6 text-zinc-300 font-bold italic text-[10px]">لا يوجد مسؤولون إضافيون.</p>
                    )}
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingInput: React.FC<{ label: string, value: string, onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-zinc-400 uppercase mr-2">{label}</label>
    <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 p-4 rounded-2xl text-xs font-bold outline-none focus:border-emerald-600 transition-all text-zinc-900 dark:text-white" />
  </div>
);

const ToggleRow: React.FC<{ label: string, active: boolean, onToggle: () => void }> = ({ label, active, onToggle }) => (
  <div className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700">
    <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">{label}</span>
    <button onClick={onToggle} className={`w-14 h-7 rounded-full transition-all relative ${active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${active ? 'left-8' : 'left-1'}`} />
    </button>
  </div>
);

export default AdminDashboard;
