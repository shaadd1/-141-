
import React, { useEffect, useRef, useState } from 'react';
import { Teacher } from '../constants';

interface VoiceRoomProps {
  teacher: Teacher;
  onClose: () => void;
}

type CallStatus = 'requesting' | 'request_sent' | 'connecting' | 'active' | 'error';

const VoiceRoom: React.FC<VoiceRoomProps> = ({ teacher, onClose }) => {
  const [status, setStatus] = useState<CallStatus>('requesting');
  
  useEffect(() => {
    if (status === 'requesting') {
      const timer = setTimeout(() => {
        setStatus('request_sent');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="fixed inset-0 z-[120] bg-zinc-950/95 backdrop-blur-3xl flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-[3rem] border border-zinc-800 shadow-2xl p-12 text-center relative overflow-hidden">
        
        <div className={`w-24 h-24 ${teacher.color} rounded-3xl mx-auto mb-8 flex items-end justify-center overflow-hidden border-4 border-white/10 shadow-2xl`}>
          <svg className="w-4/5 h-4/5 text-white/90 translate-y-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
        </div>

        {status === 'requesting' && (
          <div className="space-y-6">
            <h4 className="text-3xl font-black text-white">جاري إرسال طلب الروم</h4>
            <div className="flex gap-2 justify-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></div>
            </div>
          </div>
        )}

        {status === 'request_sent' && (
          <div className="space-y-8">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-[2rem]">
               <h4 className="text-2xl font-black text-emerald-500 mb-4">تم إرسال طلبكم بنجاح</h4>
               <p className="text-zinc-400 font-bold leading-relaxed">
                 عند قبول {teacher.name} لطلب الروم الصوتي، ستصلكم رسالة فورية على البريد الإلكتروني تحتوي على رابط الدخول المباشر.
               </p>
            </div>
            <button 
              onClick={onClose}
              className="w-full bg-white text-zinc-950 font-black py-5 rounded-2xl hover:bg-zinc-200 transition-all"
            >
              فهمت، بانتظار الإيميل
            </button>
          </div>
        )}

        <button 
          onClick={onClose}
          className="absolute top-8 left-8 text-zinc-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
};

export default VoiceRoom;
