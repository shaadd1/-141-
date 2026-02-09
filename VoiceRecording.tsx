
import React, { useState, useRef, useEffect } from 'react';
import { Teacher } from '../constants';

interface VoiceRecordingProps {
  teacher: Teacher;
  onClose: () => void;
  customTitle?: string;
}

const VoiceRecording: React.FC<VoiceRecordingProps> = ({ teacher, onClose, customTitle }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [status, setStatus] = useState<'idle' | 'recording' | 'finished' | 'sending'>('idle');
  const timerRef = useRef<any>(null);
  const MAX_TIME = 300; // 5 minutes

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_TIME) {
            stopRecording();
            return MAX_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setStatus('recording');
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setStatus('finished');
  };

  const handleSend = () => {
    setStatus('sending');
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 z-[130] bg-zinc-950/90 backdrop-blur-2xl flex items-center justify-center p-4 text-right">
      <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-zinc-100 p-10">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 ${teacher.color} rounded-2xl flex items-end justify-center overflow-hidden border-2 border-white/20`}>
              <svg className="w-4/5 h-4/5 text-white/90 translate-y-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900">{customTitle || 'تسجيل رسالة صوتية'}</h3>
              <p className="text-xs text-zinc-500 font-bold">الحد الأقصى: 5 دقائق</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="bg-zinc-50 rounded-[2rem] p-12 border border-zinc-100 flex flex-col items-center justify-center mb-6">
          <div className="text-4xl font-mono font-black text-zinc-800 mb-6">{formatTime(recordingTime)}</div>
          <div className="h-1 flex w-full bg-zinc-200 rounded-full mb-8 overflow-hidden">
             <div className="bg-red-600 transition-all duration-1000" style={{ width: `${(recordingTime / MAX_TIME) * 100}%` }}></div>
          </div>

          <div className="flex gap-6">
            {status === 'idle' && (
              <button onClick={startRecording} className="w-20 h-20 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full flex items-center justify-center shadow-xl"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg></button>
            )}
            {status === 'recording' && (
              <button onClick={stopRecording} className="w-20 h-20 bg-zinc-900 text-white rounded-full flex items-center justify-center animate-pulse"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" /></svg></button>
            )}
            {status === 'finished' && (
              <div className="flex gap-4">
                <button onClick={() => setStatus('idle')} className="bg-zinc-200 font-black px-6 py-4 rounded-2xl">إعادة</button>
                <button onClick={handleSend} className="bg-emerald-700 text-white font-black px-10 py-4 rounded-2xl">إرسال</button>
              </div>
            )}
          </div>
        </div>

        {status === 'sending' && (
          <div className="text-center font-black text-emerald-700 animate-pulse">جاري إرسال التسجيل الصوتي...</div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecording;
