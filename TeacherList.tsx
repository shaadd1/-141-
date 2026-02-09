
import React, { useState, useEffect } from 'react';
import { Teacher } from '../constants';
import VoiceRoom from './VoiceRoom';
import VoiceRecording from './VoiceRecording';

const AnonymousAvatar: React.FC<{ color: string, size?: string }> = ({ color, size = "w-28 h-28" }) => (
  <div className={`${size} ${color} rounded-[3rem] flex items-end justify-center overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800 relative group-hover:scale-105 transition-transform duration-500`}>
    <svg className="w-4/5 h-4/5 text-white/90 translate-y-2" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
  </div>
);

const TeacherList: React.FC = () => {
  const [activeCallTeacher, setActiveCallTeacher] = useState<Teacher | null>(null);
  const [activeRecordingTeacher, setActiveRecordingTeacher] = useState<Teacher | null>(null);
  const [activeRecordingTitle, setActiveRecordingTitle] = useState<string>('تسجيل رسالة صوتية');
  
  const [config, setConfig] = useState<any>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const savedConfig = localStorage.getItem('site_config');
    const savedTeachers = localStorage.getItem('site_teachers');
    
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    } else {
      setConfig({
        ministryLabel: "وزارة التعليم",
        schoolLabel: "الابتدائية 141 بجدة",
        enableEmail: true,
        enableVoiceRoom: true,
        enableVoiceRecording: true
      });
    }
    
    if (savedTeachers) {
      const filtered = JSON.parse(savedTeachers).filter((t: Teacher) => t.status === 'active');
      setTeachers(filtered);
    } else {
      import('../constants').then(module => {
        const filtered = module.TEACHERS_DATA.filter(t => t.status === 'active');
        setTeachers(filtered);
      });
    }
  }, []);

  const openRecording = (teacher: Teacher, title: string) => {
    setActiveRecordingTitle(title);
    setActiveRecordingTeacher(teacher);
  };

  if (!config) return <div className="p-20 text-center font-black animate-pulse text-zinc-400">جاري تحميل الدليل المعتمد...</div>;

  return (
    <div className="container mx-auto px-6 py-20 text-right pb-32 relative z-10">
      {/* Dynamic Header with Large Typography */}
      <div className="mb-24 text-center">
        <div className="flex flex-col items-center leading-tight mb-14 animate-in fade-in slide-in-from-top duration-1000">
           <span className="text-zinc-950 dark:text-white font-black text-6xl lg:text-7xl mb-4 tracking-tighter drop-shadow-sm uppercase">
             {config.ministryLabel}
           </span>
           <span className="text-4xl lg:text-5xl text-emerald-800 dark:text-emerald-500 font-extrabold tracking-tight drop-shadow-sm">
             {config.schoolLabel}
           </span>
           <div className="mt-8 flex gap-3">
             <div className="h-1.5 w-16 bg-emerald-600 rounded-full"></div>
             <div className="h-1.5 w-4 bg-emerald-600/30 rounded-full"></div>
             <div className="h-1.5 w-4 bg-emerald-600/10 rounded-full"></div>
           </div>
        </div>
        
        <h2 className="text-5xl lg:text-7xl font-black text-zinc-900 dark:text-white mb-8 tracking-tighter">الهيئة التعليمية والإدارية</h2>
        <p className="text-2xl text-zinc-500 dark:text-zinc-400 max-w-4xl mx-auto font-bold leading-relaxed transition-colors border-b-2 border-zinc-100 dark:border-zinc-800 pb-12">
          قائمة المنسوبات المتاحات للتواصل المباشر والآمن مع أولياء الأمور.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {teachers.map((teacher: Teacher) => (
          <div 
            key={teacher.id} 
            className="group relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[4rem] shadow-2xl border border-white dark:border-zinc-800 hover:shadow-[0_60px_100px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_60px_100px_rgba(0,0,0,0.4)] transition-all duration-700 hover:-translate-y-4 overflow-hidden"
          >
            {/* Design accents */}
            <div className={`absolute top-0 right-0 w-3 h-full ${teacher.color} opacity-40 group-hover:opacity-100 transition-opacity`}></div>
            <div className={`absolute -top-12 -left-12 w-32 h-32 ${teacher.color} blur-[50px] opacity-10 rounded-full group-hover:opacity-20 transition-opacity`}></div>
            
            <div className="p-12 relative z-10 flex flex-col h-full">
              <div className="flex flex-col items-center mb-10">
                <AnonymousAvatar color={teacher.color} />
                <div className="text-center mt-8">
                  <h3 className="text-3xl font-black text-zinc-950 dark:text-white mb-2">{teacher.name}</h3>
                  <div className="inline-block bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-[0.2em]">
                     {teacher.subject}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mt-auto">
                {config.enableEmail && (
                  <a href={`mailto:${teacher.email}`} className="w-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-4 text-xs shadow-xl shadow-black/10 hover:bg-emerald-800 hover:text-white active:scale-95 group/btn">
                    <svg className="w-5 h-5 group-hover/btn:-rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    المراسلة الإلكترونية
                  </a>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {config.enableVoiceRoom && (
                    <button onClick={() => setActiveCallTeacher(teacher)} className="bg-zinc-100 dark:bg-zinc-800/50 text-zinc-800 dark:text-white font-black py-5 rounded-[2rem] transition-all flex flex-col items-center justify-center gap-2 text-[10px] border border-transparent hover:border-emerald-500/50 hover:bg-white dark:hover:bg-zinc-800 active:scale-95">
                      <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 004.587 4.587l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                      روم صوتي
                    </button>
                  )}

                  {config.enableVoiceRecording && (
                    <button 
                      onClick={() => openRecording(teacher, config.voiceRecordingLabel || 'تسجيل صوتي')}
                      className="bg-zinc-100 dark:bg-zinc-800/50 text-zinc-800 dark:text-white font-black py-5 rounded-[2rem] transition-all flex flex-col items-center justify-center gap-2 text-[10px] border border-transparent hover:border-rose-500/50 hover:bg-white dark:hover:bg-zinc-800 active:scale-95"
                    >
                      <svg className="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
                      استفسار صوتي
                    </button>
                  )}
                </div>

                {teacher.name.includes('سميرة الصحفي') && (
                  <div className="grid grid-cols-1 gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button onClick={() => openRecording(teacher, 'تسميع التلاوة')} className="w-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 font-black py-4 rounded-2xl text-[10px] hover:bg-emerald-200 transition-all">تسميع التلاوة</button>
                    <button onClick={() => openRecording(teacher, 'تسميع الغيب')} className="w-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 font-black py-4 rounded-2xl text-[10px] hover:bg-amber-200 transition-all">تسميع الغيب</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeCallTeacher && (
        <VoiceRoom teacher={activeCallTeacher} onClose={() => setActiveCallTeacher(null)} />
      )}

      {activeRecordingTeacher && (
        <VoiceRecording 
          teacher={activeRecordingTeacher} 
          onClose={() => setActiveRecordingTeacher(null)}
          customTitle={activeRecordingTitle}
        />
      )}
    </div>
  );
};

export default TeacherList;
