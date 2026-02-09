
import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import TeacherList from './components/TeacherList';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'parent_portal' | 'teacher_portal' | 'admin_portal'>('home');
  const [userData, setUserData] = useState({ 
    email: '', 
    name: '', 
    studentClass: '',
    role: 'parent' as 'parent' | 'teacher' | 'admin'
  });

  // Dynamic Site Config for Layout
  const [siteConfig, setSiteConfig] = useState<any>({
    ministryLabel: "وزارة التعليم",
    schoolLabel: "الابتدائية 141 بجدة"
  });

  useEffect(() => {
    const saved = localStorage.getItem('site_config');
    if (saved) setSiteConfig(JSON.parse(saved));
  }, [view]);

  const handleParentLogin = (email: string, studentName: string, studentClass: string) => {
    setUserData({ email, name: studentName, studentClass, role: 'parent' });
    setView('parent_portal');
  };

  const handleTeacherLogin = (teacherName: string, email?: string, password?: string) => {
    // Admin Creds Check - Check localStorage first
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

    const enteredEmail = email?.trim().toLowerCase() || '';
    const isPrimary = enteredEmail === adminEmailConfig.trim().toLowerCase() && password === adminPassConfig;
    const isSecondary = secondaryAdmins.some(e => e.trim().toLowerCase() === enteredEmail) && password === adminPassConfig;

    if (isPrimary || isSecondary) {
      setUserData({ email: enteredEmail, name: 'مدير النظام', studentClass: '', role: 'admin' });
      setView('admin_portal');
      return;
    }

    setUserData({ email: email || '', name: teacherName, studentClass: '', role: 'teacher' });
    setView('teacher_portal');
  };

  const handleLogout = () => {
    setView('home');
    setUserData({ email: '', name: '', studentClass: '', role: 'parent' });
  };

  return (
    <Layout 
      userName={userData.name} 
      studentClass={userData.studentClass}
      onLogout={handleLogout}
      showNav={view !== 'home'}
      role={userData.role as any}
      ministryName={siteConfig.ministryLabel}
      schoolName={siteConfig.schoolLabel}
      primaryColor={siteConfig.primaryColor}
    >
      {view === 'home' && <Home onParentLogin={handleParentLogin} onTeacherLogin={handleTeacherLogin} />}
      {view === 'parent_portal' && <TeacherList />}
      {view === 'teacher_portal' && <TeacherDashboard teacherName={userData.name} />}
      {view === 'admin_portal' && <AdminDashboard />}
    </Layout>
  );
};

export default App;
