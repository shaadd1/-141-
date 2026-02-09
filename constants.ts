
export interface Teacher {
  id: number | string;
  name: string;
  subject: string;
  email: string;
  color: string;
  role: 'teacher' | 'principal' | 'supervisor' | 'admin_staff';
  status: 'active' | 'frozen' | 'pending';
}

export const TEACHERS_DATA: Teacher[] = [
  {
    id: 'principal_1',
    name: "أ. هند العتيبي",
    subject: "مديرة المدرسة",
    email: "hind.a@school.edu.sa",
    color: "bg-zinc-800",
    role: 'principal',
    status: 'active'
  },
  {
    id: 1,
    name: "أ. نورة العتيبي",
    subject: "معلمة - اللغة العربية",
    email: "noura.a@school.edu.sa",
    color: "bg-emerald-600",
    role: 'teacher',
    status: 'active'
  },
  {
    id: 2,
    name: "أ. سارة القحطاني",
    subject: "معلمة - الرياضيات",
    email: "sarah.q@school.edu.sa",
    color: "bg-indigo-600",
    role: 'teacher',
    status: 'active'
  },
  {
    id: 3,
    name: "أ. مريم الدوسري",
    subject: "مشرفة تعليمية",
    email: "maryam.d@school.edu.sa",
    color: "bg-rose-600",
    role: 'supervisor',
    status: 'active'
  },
  {
    id: 4,
    name: "أ. ليلى الشمري",
    subject: "إدارية - شؤون الطالبات",
    email: "laila.s@school.edu.sa",
    color: "bg-amber-600",
    role: 'admin_staff',
    status: 'active'
  },
  {
    id: 5,
    name: "أ. سميرة الصحفي",
    subject: "معلمة دراسات إسلامية",
    email: "samira.s@school.edu.sa",
    color: "bg-teal-600",
    role: 'teacher',
    status: 'active'
  }
];
