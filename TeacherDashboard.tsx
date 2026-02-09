
import React, { useState } from 'react';

interface VoiceRoomRequest {
  id: string;
  parentName: string;
  studentName: string;
  studentClass: string;
  time: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface EmailInquiry {
  id: string;
  subject: string;
  parentName: string;
  content: string;
  time: string;
  isNew: boolean;
  reply?: string;
  status: 'unread' | 'read' | 'replied';
}

interface TeacherDashboardProps {
  teacherName: string;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacherName }) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'email' | 'voice_room'>('voice');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  
  // Extracting first name for greeting if it's a full name
  const firstName = teacherName.split(' ')[0];

  const [emails, setEmails] = useState<EmailInquiry[]>([
    {
      id: 'e1',
      subject: 'استفسار بخصوص نتائج الاختبار',
      parentName: 'ولي/ة أمر ريما القحطاني',
      content: 'السلام عليكم، أود الاستفسار عن درجات ابنتي ريما في مادة الرياضيات للاختبار الفتري الأول.',
      time: 'منذ ساعتين',
      isNew: true,
      status: 'unread'
    },
    {
      id: 'e2',
      subject: 'طلب موعد لمناقشة المستوى الدراسي',
      parentName: 'ولي/ة أمر ساره عبدالله',
      content: 'نأمل تحديد موعد للحديث عن تطور مستوى ساره الدراسي خلال هذا الفصل.',
      time: 'منذ يوم',
      isNew: false,
      status: 'read'
    }
  ]);

  const [requests, setRequests] = useState<VoiceRoomRequest[]>([
    {
      id: '1',
      parentName: 'ولي/ة أمر ريما القحطاني',
      studentName: 'ريما القحطاني',
      studentClass: 'خامس ابتدائي / ١',
      time: 'منذ 10 دقائق',
      status: 'pending'
    },
    {
      id: '2',
      parentName: 'ولي/ة أمر ساره عبدالله',
      studentName: 'ساره عبدالله',
      studentClass: 'سادس ابتدائي / ٢',
      time: 'منذ ساعة',
      status: 'pending'
    }
  ]);

  const handleRequestAction = (id: string, action: 'accepted' | 'rejected') => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
  };

  const handleSendReply = (emailId: string) => {
    if (!replyText.trim()) return;
    setIsSendingReply(true);
    
    // Simulate API call
    setTimeout(() => {
      setEmails(prev => prev.map(e => 
        e.id === emailId ? { ...e, status: 'replied', reply: replyText, isNew: false } : e
      ));
      setReplyText('');
      setSelectedEmail(null);
      setIsSendingReply(false);
      alert('تم إرسال الرد بنجاح لولي الأمر.');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12 text-right">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-zinc-950 dark:text-white mb-2 transition-colors">
          مرحباً، أ. {firstName}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-bold transition-colors">لوحة التحكم الخاصة باستلام استفسارات أولياء الأمور</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('voice')}
          className={`flex-1 min-w-[150px] py-4 rounded-2xl font-black transition-all border-2 ${activeTab === 'voice' ? 'bg-emerald-700 border-emerald-700 text-white shadow-xl' : 'bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'}`}
        >
          الرسائل الصوتية الواردة
        </button>
        <button 
          onClick={() => setActiveTab('email')}
          className={`flex-1 min-w-[150px] py-4 rounded-2xl font-black transition-all border-2 ${activeTab === 'email' ? 'bg-zinc-950 dark:bg-zinc-700 border-zinc-950 dark:border-zinc-700 text-white shadow-xl' : 'bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'}`}
        >
          الإيميلات الواردة
        </button>
        <button 
          onClick={() => setActiveTab('voice_room')}
          className={`flex-1 min-w-[150px] py-4 rounded-2xl font-black transition-all border-2 ${activeTab === 'voice_room' ? 'bg-blue-700 border-blue-700 text-white shadow-xl' : 'bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'}`}
        >
          طلبات الروم الصوتي
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-700 shadow-xl p-8 min-h-[400px] transition-colors">
        {activeTab === 'voice' && (
          <div className="space-y-6">
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-700 rounded-3xl flex items-center justify-between group hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-700 dark:text-emerald-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" /></svg>
                </div>
                <div>
                  <h4 className="font-black text-zinc-900 dark:text-white transition-colors">ولي/ة أمر ساره عبدالله (سادس ابتدائي / ٢)</h4>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">منذ ساعتين • 03:45 دقيقة</p>
                </div>
              </div>
              <button className="bg-emerald-700 text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-emerald-800 transition-all">تشغيل الرسالة</button>
            </div>
            <div className="text-center py-20 text-zinc-300 dark:text-zinc-600 font-bold italic transition-colors">لا توجد رسائل صوتية أخرى حالياً</div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-4">
             {emails.map((email) => (
               <div key={email.id} className="space-y-2">
                 <div 
                   onClick={() => setSelectedEmail(selectedEmail === email.id ? null : email.id)}
                   className={`p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-700 rounded-3xl flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all cursor-pointer ${selectedEmail === email.id ? 'ring-2 ring-emerald-500' : ''}`}
                 >
                    <div>
                      <h4 className={`font-black text-zinc-900 dark:text-white transition-colors ${email.status === 'unread' ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
                        {email.subject}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">من: {email.parentName} • {email.time}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {email.status === 'replied' && (
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full font-black transition-colors">تم الرد</span>
                      )}
                      {email.status === 'unread' && (
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full font-black transition-colors">جديد</span>
                      )}
                      <svg className={`w-5 h-5 text-zinc-400 transition-transform ${selectedEmail === email.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                 </div>

                 {selectedEmail === email.id && (
                   <div className="p-8 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 rounded-3xl animate-in slide-in-from-top-2 duration-300">
                      <div className="mb-6">
                        <p className="text-zinc-600 dark:text-zinc-300 font-bold leading-relaxed whitespace-pre-wrap">{email.content}</p>
                      </div>

                      {email.status === 'replied' ? (
                        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                          <h5 className="text-xs font-black text-emerald-600 mb-2">رد المنسوبة:</h5>
                          <p className="text-zinc-800 dark:text-zinc-200 font-black leading-relaxed">{email.reply}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <label className="text-xs font-black text-zinc-950 dark:text-white block mr-2">رد المنسوبة على الاستفسار:</label>
                          <textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="اكتب الرد هنا لولي الأمر..."
                            className="w-full bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 p-6 rounded-2xl outline-none font-black text-sm text-zinc-950 dark:text-white transition-all min-h-[150px] resize-none"
                          />
                          <div className="flex justify-end">
                            <button 
                              onClick={() => handleSendReply(email.id)}
                              disabled={isSendingReply || !replyText.trim()}
                              className={`px-10 py-4 rounded-2xl text-xs font-black text-white shadow-xl transition-all active:scale-95 flex items-center gap-3 ${isSendingReply || !replyText.trim() ? 'bg-zinc-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20'}`}
                            >
                              {isSendingReply ? 'جاري الإرسال...' : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                                  إرسال الرد
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                   </div>
                 )}
               </div>
             ))}
             {emails.length === 0 && (
               <div className="text-center py-20 text-zinc-300 dark:text-zinc-600 font-bold italic transition-colors">صندوق الوارد فارغ</div>
             )}
          </div>
        )}

        {activeTab === 'voice_room' && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-200 mb-4 border-r-4 border-blue-600 pr-3">طلبات الروم الصوتي المفتوحة</h3>
            {requests.filter(r => r.status === 'pending').length > 0 ? (
              requests.filter(r => r.status === 'pending').map(req => (
                <div key={req.id} className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all border-r-8 border-r-blue-500">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center text-blue-700 dark:text-blue-400">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 004.587 4.587l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                    </div>
                    <div>
                      <h4 className="font-black text-zinc-900 dark:text-white transition-colors">{req.parentName}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">الطالبة: {req.studentName} ({req.studentClass}) • {req.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => handleRequestAction(req.id, 'rejected')}
                      className="flex-1 md:flex-none px-6 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-xs font-black hover:bg-red-100 transition-all"
                    >
                      رفض الطلب
                    </button>
                    <button 
                      onClick={() => handleRequestAction(req.id, 'accepted')}
                      className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-black hover:bg-emerald-800 shadow-lg shadow-emerald-700/20 transition-all"
                    >
                      قبول الطلب
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-zinc-300 dark:text-zinc-600 font-bold italic transition-colors">لا توجد طلبات روم صوتي جديدة حالياً</div>
            )}
          </div>
        )}
      </div>

      <div className="mt-12 p-8 bg-zinc-900 dark:bg-black rounded-[3rem] text-white border border-zinc-800 dark:border-zinc-900 flex items-center justify-between transition-all">
         <div>
            <h4 className="text-xl font-black text-emerald-500 mb-2">تعليمات أمن البيانات</h4>
            <p className="text-zinc-400 text-xs font-bold">المستخدمة: {teacherName}</p>
         </div>
         <div className="text-emerald-600 font-black text-2xl italic leading-none border-r-2 border-emerald-900 pr-8">
            VISION <span className="text-white">2030</span>
         </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
