"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// ==================== TYPES ====================
interface Student {
  id: string;
  name: string;
  bioData: {
    dob: string;
    parentContact: string;
    email?: string;
    address?: string;
  };
  classId: string;
  competencies: {
    criticalThinking: number;
    creativity: number;
    communication: number;
    collaboration: number;
    citizenship: number;
    digitalLiteracy: number;
    learningToLearn: number;
  };
  attendance: Array<{ date: string; status: "present" | "absent" | "late" }>;
  fees: {
    balance: number;
    payments: Array<{
      id: string;
      amount: number;
      date: string;
      method: string;
    }>;
  };
  messages: string[];
  extracurriculars?: string[];
}

interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  lessonPlans: string[];
  email?: string;
  phone?: string;
}

interface Class {
  id: string;
  name: string;
  students: string[];
  timetable: string[];
  teacherId?: string;
}

interface LessonPlan {
  id: string;
  title: string;
  scheme: string;
  alignedCBC: boolean;
  sharedWith: string[];
  teacherId: string;
  subject: string;
  createdAt: string;
}

interface TimetableSlot {
  id: string;
  day: string;
  period: string;
  subject: string;
  teacherId: string;
  classId: string;
  time: string;
}

interface Exam {
  id: string;
  name: string;
  date: string;
  classId: string;
  subject: string;
  schedule: Array<{ studentId: string; marks: number }>;
}

interface Fee {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  description: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  payroll: {
    salary: number;
    deductions: number;
    netPay?: number;
  };
  email?: string;
  phone?: string;
  leaveBalance?: number;
}

interface Message {
  id: string;
  to: string[];
  from: string;
  content: string;
  type: "SMS" | "Email";
  timestamp: string;
  read?: boolean;
}

interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
  description?: string;
}

interface Report {
  id: string;
  studentId: string;
  competencies: Student["competencies"];
  holisticNotes: string;
  term: string;
  generatedAt: string;
}

type Role = "Admin" | "Teacher" | "Parent" | "Student";

interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  userId: string | null;
}

interface DataState {
  students: Student[];
  teachers: Teacher[];
  classes: Class[];
  lessonPlans: LessonPlan[];
  timetable: TimetableSlot[];
  exams: Exam[];
  fees: Fee[];
  staff: Staff[];
  messages: Message[];
  events: Event[];
  reports: Report[];
}

type Page =
  | "login"
  | "dashboard"
  | "students"
  | "assessments"
  | "cbc-reports"
  | "lesson-plans"
  | "finance"
  | "hr"
  | "communication"
  | "reports"
  | "attendance"
  | "timetable"
  | "portal"
  | "messages"
  | "calendar"
  | "academics";

// ==================== HOOKS ====================
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// ==================== SEED DATA ====================
const generateSeedData = (): DataState => {
  const students: Student[] = [
    {
      id: "s1",
      name: "Amina Mwangi",
      bioData: {
        dob: "15/03/2012",
        parentContact: "+254712345678",
        email: "parent1@example.com",
        address: "Nairobi",
      },
      classId: "c1",
      competencies: {
        criticalThinking: 85,
        creativity: 78,
        communication: 90,
        collaboration: 82,
        citizenship: 88,
        digitalLiteracy: 75,
        learningToLearn: 80,
      },
      attendance: [
        { date: "10/11/2025", status: "present" },
        { date: "11/11/2025", status: "present" },
      ],
      fees: {
        balance: 15000,
        payments: [
          { id: "p1", amount: 35000, date: "05/09/2025", method: "M-PESA" },
        ],
      },
      messages: ["m1"],
      extracurriculars: ["Drama", "Debate"],
    },
    {
      id: "s2",
      name: "Brian Omondi",
      bioData: {
        dob: "22/07/2012",
        parentContact: "+254723456789",
        email: "parent2@example.com",
        address: "Mombasa",
      },
      classId: "c1",
      competencies: {
        criticalThinking: 70,
        creativity: 88,
        communication: 75,
        collaboration: 80,
        citizenship: 78,
        digitalLiteracy: 92,
        learningToLearn: 85,
      },
      attendance: [
        { date: "10/11/2025", status: "present" },
        { date: "11/11/2025", status: "late" },
      ],
      fees: {
        balance: 20000,
        payments: [
          { id: "p2", amount: 30000, date: "01/09/2025", method: "Bank" },
        ],
      },
      messages: [],
      extracurriculars: ["Football", "Coding Club"],
    },
    {
      id: "s3",
      name: "Cynthia Njeri",
      bioData: {
        dob: "10/01/2013",
        parentContact: "+254734567890",
        email: "parent3@example.com",
        address: "Kisumu",
      },
      classId: "c2",
      competencies: {
        criticalThinking: 92,
        creativity: 85,
        communication: 88,
        collaboration: 90,
        citizenship: 95,
        digitalLiteracy: 80,
        learningToLearn: 90,
      },
      attendance: [
        { date: "10/11/2025", status: "present" },
        { date: "11/11/2025", status: "present" },
      ],
      fees: {
        balance: 0,
        payments: [
          { id: "p3", amount: 50000, date: "28/08/2025", method: "M-PESA" },
        ],
      },
      messages: ["m2"],
      extracurriculars: ["Science Club", "Music"],
    },
    {
      id: "s4",
      name: "Daniel Kamau",
      bioData: {
        dob: "05/09/2012",
        parentContact: "+254745678901",
        email: "parent4@example.com",
        address: "Nakuru",
      },
      classId: "c2",
      competencies: {
        criticalThinking: 65,
        creativity: 70,
        communication: 68,
        collaboration: 75,
        citizenship: 72,
        digitalLiteracy: 78,
        learningToLearn: 70,
      },
      attendance: [
        { date: "10/11/2025", status: "absent" },
        { date: "11/11/2025", status: "present" },
      ],
      fees: {
        balance: 25000,
        payments: [
          { id: "p4", amount: 25000, date: "15/09/2025", method: "Cash" },
        ],
      },
      messages: [],
      extracurriculars: ["Basketball"],
    },
    {
      id: "s5",
      name: "Faith Akinyi",
      bioData: {
        dob: "18/11/2013",
        parentContact: "+254756789012",
        email: "parent5@example.com",
        address: "Eldoret",
      },
      classId: "c3",
      competencies: {
        criticalThinking: 88,
        creativity: 92,
        communication: 85,
        collaboration: 87,
        citizenship: 90,
        digitalLiteracy: 85,
        learningToLearn: 88,
      },
      attendance: [
        { date: "10/11/2025", status: "present" },
        { date: "11/11/2025", status: "present" },
      ],
      fees: {
        balance: 10000,
        payments: [
          { id: "p5", amount: 40000, date: "20/08/2025", method: "M-PESA" },
        ],
      },
      messages: ["m3"],
      extracurriculars: ["Art", "Environment Club"],
    },
  ];

  const teachers: Teacher[] = [
    {
      id: "t1",
      name: "Mr. John Kiprotich",
      subjects: ["Mathematics", "Science"],
      lessonPlans: ["lp1", "lp2"],
      email: "john.k@school.ac.ke",
      phone: "+254700111222",
    },
    {
      id: "t2",
      name: "Ms. Grace Wanjiru",
      subjects: ["English", "Kiswahili"],
      lessonPlans: ["lp3"],
      email: "grace.w@school.ac.ke",
      phone: "+254700222333",
    },
    {
      id: "t3",
      name: "Mr. David Otieno",
      subjects: ["Social Studies", "CRE"],
      lessonPlans: ["lp4"],
      email: "david.o@school.ac.ke",
      phone: "+254700333444",
    },
  ];

  const classes: Class[] = [
    {
      id: "c1",
      name: "Grade 6 Blue",
      students: ["s1", "s2"],
      timetable: ["tt1", "tt2"],
      teacherId: "t1",
    },
    {
      id: "c2",
      name: "Grade 7 Red",
      students: ["s3", "s4"],
      timetable: ["tt3", "tt4"],
      teacherId: "t2",
    },
    {
      id: "c3",
      name: "Grade 8 Green",
      students: ["s5"],
      timetable: ["tt5"],
      teacherId: "t3",
    },
  ];

  const lessonPlans: LessonPlan[] = [
    {
      id: "lp1",
      title: "Algebra Basics",
      scheme: "Introduction to variables and equations",
      alignedCBC: true,
      sharedWith: ["t2"],
      teacherId: "t1",
      subject: "Mathematics",
      createdAt: "01/09/2025",
    },
    {
      id: "lp2",
      title: "Scientific Method",
      scheme: "Hypothesis, experimentation, conclusion",
      alignedCBC: true,
      sharedWith: [],
      teacherId: "t1",
      subject: "Science",
      createdAt: "05/09/2025",
    },
    {
      id: "lp3",
      title: "Essay Writing",
      scheme: "Structure: Introduction, Body, Conclusion",
      alignedCBC: true,
      sharedWith: ["t1"],
      teacherId: "t2",
      subject: "English",
      createdAt: "08/09/2025",
    },
    {
      id: "lp4",
      title: "Kenyan Geography",
      scheme: "Physical and political features of Kenya",
      alignedCBC: true,
      sharedWith: [],
      teacherId: "t3",
      subject: "Social Studies",
      createdAt: "10/09/2025",
    },
  ];

  const timetable: TimetableSlot[] = [
    {
      id: "tt1",
      day: "Monday",
      period: "1",
      subject: "Mathematics",
      teacherId: "t1",
      classId: "c1",
      time: "08:00-09:00",
    },
    {
      id: "tt2",
      day: "Monday",
      period: "2",
      subject: "English",
      teacherId: "t2",
      classId: "c1",
      time: "09:00-10:00",
    },
    {
      id: "tt3",
      day: "Tuesday",
      period: "1",
      subject: "Science",
      teacherId: "t1",
      classId: "c2",
      time: "08:00-09:00",
    },
    {
      id: "tt4",
      day: "Tuesday",
      period: "2",
      subject: "Kiswahili",
      teacherId: "t2",
      classId: "c2",
      time: "09:00-10:00",
    },
    {
      id: "tt5",
      day: "Wednesday",
      period: "1",
      subject: "Social Studies",
      teacherId: "t3",
      classId: "c3",
      time: "08:00-09:00",
    },
  ];

  const exams: Exam[] = [
    {
      id: "e1",
      name: "Mid-Term Math",
      date: "15/10/2025",
      classId: "c1",
      subject: "Mathematics",
      schedule: [
        { studentId: "s1", marks: 85 },
        { studentId: "s2", marks: 70 },
      ],
    },
    {
      id: "e2",
      name: "End-Term Science",
      date: "20/11/2025",
      classId: "c2",
      subject: "Science",
      schedule: [
        { studentId: "s3", marks: 92 },
        { studentId: "s4", marks: 65 },
      ],
    },
  ];

  const fees: Fee[] = [
    {
      id: "f1",
      studentId: "s1",
      amount: 15000,
      dueDate: "30/11/2025",
      paid: false,
      description: "Term 3 Balance",
    },
    {
      id: "f2",
      studentId: "s2",
      amount: 20000,
      dueDate: "30/11/2025",
      paid: false,
      description: "Term 3 Balance",
    },
    {
      id: "f3",
      studentId: "s4",
      amount: 25000,
      dueDate: "30/11/2025",
      paid: false,
      description: "Term 3 Balance",
    },
    {
      id: "f4",
      studentId: "s5",
      amount: 10000,
      dueDate: "30/11/2025",
      paid: false,
      description: "Term 3 Balance",
    },
  ];

  const staff: Staff[] = [
    {
      id: "st1",
      name: "Ms. Lucy Nduta",
      role: "Accountant",
      payroll: { salary: 80000, deductions: 8000, netPay: 72000 },
      email: "lucy.n@school.ac.ke",
      phone: "+254700444555",
      leaveBalance: 15,
    },
    {
      id: "st2",
      name: "Mr. Peter Maina",
      role: "IT Support",
      payroll: { salary: 60000, deductions: 6000, netPay: 54000 },
      email: "peter.m@school.ac.ke",
      phone: "+254700555666",
      leaveBalance: 20,
    },
    {
      id: "st3",
      name: "Mrs. Anne Wambui",
      role: "Librarian",
      payroll: { salary: 50000, deductions: 5000, netPay: 45000 },
      email: "anne.w@school.ac.ke",
      phone: "+254700666777",
      leaveBalance: 18,
    },
  ];

  const messages: Message[] = [
    {
      id: "m1",
      to: ["+254712345678"],
      from: "school",
      content: "Parent meeting on Friday at 2pm",
      type: "SMS",
      timestamp: "09/11/2025 14:30",
      read: false,
    },
    {
      id: "m2",
      to: ["+254734567890"],
      from: "school",
      content:
        "Congratulations! Cynthia has been selected for science competition",
      type: "Email",
      timestamp: "08/11/2025 10:00",
      read: true,
    },
    {
      id: "m3",
      to: ["+254756789012"],
      from: "school",
      content: "Reminder: Fee balance due by end of month",
      type: "SMS",
      timestamp: "10/11/2025 09:00",
      read: false,
    },
  ];

  const events: Event[] = [
    {
      id: "ev1",
      title: "Sports Day",
      date: "20/11/2025",
      type: "School Event",
      description: "Annual inter-house sports competition",
    },
    {
      id: "ev2",
      title: "Parent-Teacher Meeting",
      date: "13/11/2025",
      type: "Meeting",
      description: "Term 3 progress review",
    },
    {
      id: "ev3",
      title: "Science Fair",
      date: "25/11/2025",
      type: "Academic",
      description: "Student science project exhibition",
    },
  ];

  const reports: Report[] = [
    {
      id: "r1",
      studentId: "s1",
      competencies: students[0].competencies,
      holisticNotes:
        "Amina demonstrates excellent communication skills and shows strong leadership in group activities. She consistently participates in class discussions and helps peers.",
      term: "Term 3 2025",
      generatedAt: "12/11/2025",
    },
    {
      id: "r2",
      studentId: "s3",
      competencies: students[2].competencies,
      holisticNotes:
        "Cynthia is an outstanding learner who excels across all competencies. Her critical thinking and citizenship values are exemplary. She actively contributes to environmental conservation initiatives.",
      term: "Term 3 2025",
      generatedAt: "12/11/2025",
    },
  ];

  return {
    students,
    teachers,
    classes,
    lessonPlans,
    timetable,
    exams,
    fees,
    staff,
    messages,
    events,
    reports,
  };
};

// ==================== CONTEXTS ====================
const AuthContext = createContext<{
  auth: AuthState;
  login: (role: Role, userId?: string) => void;
  logout: () => void;
} | null>(null);

const DataContext = createContext<{
  data: DataState;
  updateData: (key: keyof DataState, value: any) => void;
  resetData: () => void;
} | null>(null);

const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: () => void;
} | null>(null);

const NavigationContext = createContext<{
  currentPage: Page;
  navigate: (page: Page) => void;
} | null>(null);

const ToastContext = createContext<{
  showToast: (message: string, type?: "success" | "error" | "info") => void;
} | null>(null);

// ==================== PROVIDERS ====================
function AppProviders({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useLocalStorage<AuthState>("sms_auth", {
    isAuthenticated: false,
    role: null,
    userId: null,
  });
  const [data, setData] = useLocalStorage<DataState>(
    "sms_data",
    generateSeedData()
  );
  const [isDark, setIsDark] = useLocalStorage("sms_theme", false);
  const [showOnboarding, setShowOnboarding] = useLocalStorage(
    "sms_onboarding",
    true
  );
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [toasts, setToasts] = useState<
    Array<{ id: number; message: string; type: "success" | "error" | "info" }>
  >([]);

  const login = (role: Role, userId?: string) => {
    setAuth({ isAuthenticated: true, role, userId: userId || null });
    setCurrentPage("dashboard");
    showToast("Logged in as " + role, "success");
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, role: null, userId: null });
    setCurrentPage("login");
    showToast("Logged out successfully", "success");
  };

  const updateData = (key: keyof DataState, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const resetData = () => {
    setData(generateSeedData());
    showToast("Data reset to default", "success");
  };

  const toggleTheme = () => setIsDark(!isDark);

  const navigate = (page: Page) => {
    if (!auth.isAuthenticated && page !== "login") {
      setCurrentPage("login");
      return;
    }
    setCurrentPage(page);
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    if (!auth.isAuthenticated && currentPage !== "login") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage("login");
    }
  }, [auth.isAuthenticated, currentPage]);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      <DataContext.Provider value={{ data, updateData, resetData }}>
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
          <NavigationContext.Provider value={{ currentPage, navigate }}>
            <ToastContext.Provider value={{ showToast }}>
              {showOnboarding && (
                <OnboardingModal onClose={() => setShowOnboarding(false)} />
              )}
              <ToastContainer toasts={toasts} />
              {children}
            </ToastContext.Provider>
          </NavigationContext.Provider>
        </ThemeContext.Provider>
      </DataContext.Provider>
    </AuthContext.Provider>
  );
}

// ==================== CUSTOM HOOKS ====================
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthContext");
  return context;
}

function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataContext");
  return context;
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeContext");
  return context;
}

function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context)
    throw new Error("useNavigation must be used within NavigationContext");
  return context;
}

function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastContext");
  return context;
}

// ==================== COMPONENTS ====================
function ToastContainer({
  toasts,
}: {
  toasts: Array<{
    id: number;
    message: string;
    type: "success" | "error" | "info";
  }>;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`px-4 py-3 rounded-lg shadow-lg text-white ${
              toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function OnboardingModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Elimu Smart School Management System! 🎓
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          

          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Key Features:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>CBC Competency-based assessments & holistic reports</li>
              <li>Student & teacher management with attendance tracking</li>
              <li>Fee management with M-PESA integration support</li>
              <li>Lesson planning with CBC alignment</li>
              <li>Parent portal for real-time updates</li>
              <li>Communication via SMS/Email</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              Getting Started:
            </h3>
            <p className="text-sm">
              Select a role on the login page to explore different dashboards.
              Sample data is pre-loaded for testing.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          Get Started
        </button>
      </motion.div>
    </motion.div>
  );
}

function Navbar() {
  const { auth, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { navigate } = useNavigation();
  const [showDevMenu, setShowDevMenu] = useState(false);
  const { resetData } = useData();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() =>
                navigate(auth.isAuthenticated ? "dashboard" : "login")
              }
              className="flex items-center"
            >
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Elimu Smart SMS
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {auth.isAuthenticated && (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {auth.role}
                </span>
                <button
                  onClick={() => setShowDevMenu(!showDevMenu)}
                  className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Dev 🛠️
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("login");
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showDevMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-4 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-50 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
            Developer Tools
          </h3>
          <button
            onClick={() => {
              resetData();
              setShowDevMenu(false);
            }}
            className="w-full mb-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition text-sm"
          >
            Reset Data
          </button>
          <button
            onClick={() => {
              const dataStr = localStorage.getItem("sms_data");
              if (dataStr) {
                const blob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "sms_data.json";
                a.click();
              }
            }}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition text-sm"
          >
            Export JSON
          </button>
        </motion.div>
      )}
    </nav>
  );
}

function Sidebar() {
  const { auth } = useAuth();
  const { currentPage, navigate } = useNavigation();

  const getMenuItems = () => {
    const base = [
      { page: "dashboard" as Page, label: "Dashboard", icon: "📊" },
    ];

    if (auth.role === "Admin") {
      return [
        ...base,
        { page: "students" as Page, label: "Students", icon: "👨‍🎓" },
        { page: "academics" as Page, label: "Academics", icon: "📚" },
        { page: "finance" as Page, label: "Finance", icon: "💰" },
        { page: "hr" as Page, label: "HR & Staff", icon: "👥" },
        { page: "reports" as Page, label: "Reports", icon: "📈" },
        { page: "communication" as Page, label: "Communication", icon: "📧" },
        { page: "calendar" as Page, label: "Calendar", icon: "📅" },
      ];
    }

    if (auth.role === "Teacher") {
      return [
        ...base,
        { page: "assessments" as Page, label: "Assessments", icon: "✍️" },
        { page: "lesson-plans" as Page, label: "Lesson Plans", icon: "📝" },
        { page: "attendance" as Page, label: "Attendance", icon: "✅" },
        { page: "timetable" as Page, label: "Timetable", icon: "🕐" },
        { page: "messages" as Page, label: "Messages", icon: "💬" },
      ];
    }

    if (auth.role === "Parent" || auth.role === "Student") {
      return [
        ...base,
        { page: "portal" as Page, label: "Portal", icon: "🏠" },
        { page: "cbc-reports" as Page, label: "Elimu Smart Reports", icon: "📋" },
        { page: "messages" as Page, label: "Messages", icon: "💬" },
        { page: "calendar" as Page, label: "Calendar", icon: "📅" },
      ];
    }

    return base;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.page}
            onClick={() => navigate(item.page)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === item.page
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${color} rounded-lg shadow-lg p-6 text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </motion.div>
  );
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function Table({
  columns,
  data,
  onRowClick,
}: {
  columns: Array<{
    key: string;
    label: string;
    render?: (val: any, row: any) => React.ReactNode;
  }>;
  data: any[];
  onRowClick?: (row: any) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className={
                onRowClick
                  ? "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition"
                  : ""
              }
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==================== PAGES ====================

function LoginPage() {
  const { login } = useAuth();
  const { navigate } = useNavigation();
  const [selectedRole, setSelectedRole] = useState<Role>("Admin");

  const handleLogin = () => {
    login(selectedRole);
    navigate("dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Elimu Smart SMS
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            School Management System
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
              <option value="Parent">Parent</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition transform hover:scale-105"
          >
            Login as {selectedRole}
          </button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            Demo mode - Select any role to explore the system
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function AdminDashboard() {
  const { data } = useData();

  const stats = [
    {
      title: "Total Students",
      value: data.students.length,
      icon: "👨‍🎓",
      color: "bg-blue-600",
    },
    {
      title: "Total Teachers",
      value: data.teachers.length,
      icon: "👨‍🏫",
      color: "bg-green-600",
    },
    {
      title: "Pending Fees",
      value: `KES ${data.fees
        .reduce((sum, f) => sum + (f.paid ? 0 : f.amount), 0)
        .toLocaleString()}`,
      icon: "💰",
      color: "bg-yellow-600",
    },
    {
      title: "Upcoming Events",
      value: data.events.length,
      icon: "📅",
      color: "bg-purple-600",
    },
  ];

  const recentActivity = [
    { action: "New student enrolled", time: "2 hours ago", type: "success" },
    { action: "Fee payment received", time: "4 hours ago", type: "success" },
    { action: "Staff leave approved", time: "1 day ago", type: "info" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <DashboardCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    activity.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h2>
          <div className="space-y-3">
            {data.events.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="p-3 border-l-4 border-blue-600 bg-gray-50 dark:bg-gray-700"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {event.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {event.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Competency Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            "criticalThinking",
            "creativity",
            "communication",
            "collaboration",
            "citizenship",
            "digitalLiteracy",
            "learningToLearn",
          ].map((comp) => {
            const avg = Math.round(
              data.students.reduce(
                (sum, s) =>
                  sum + s.competencies[comp as keyof Student["competencies"]],
                0
              ) / data.students.length
            );
            return (
              <div
                key={comp}
                className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <p className="text-2xl font-bold text-blue-600">{avg}%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 capitalize">
                  {comp.replace(/([A-Z])/g, " $1").trim()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TeacherDashboard() {
  const { data } = useData();
  const teacher = data.teachers[0];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Welcome, {teacher.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="My Classes"
          value="3"
          icon="📚"
          color="bg-blue-600"
        />
        <DashboardCard
          title="Lesson Plans"
          value={teacher.lessonPlans.length}
          icon="📝"
          color="bg-green-600"
        />
        <DashboardCard
          title="Students"
          value={
            data.students.filter((s) => ["c1", "c2"].includes(s.classId)).length
          }
          icon="👨‍🎓"
          color="bg-purple-600"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Today&apos;s Schedule
        </h2>
        <div className="space-y-2">
          {data.timetable
            .filter((t) => t.teacherId === teacher.id)
            .slice(0, 3)
            .map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {slot.subject}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {slot.time}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {data.classes.find((c) => c.id === slot.classId)?.name}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function PortalPage() {
  const { data } = useData();
  const { auth } = useAuth();
  const student = data.students[0];

  const competencyLabels = {
    criticalThinking: "Critical Thinking",
    creativity: "Creativity",
    communication: "Communication",
    collaboration: "Collaboration",
    citizenship: "Citizenship",
    digitalLiteracy: "Digital Literacy",
    learningToLearn: "Learning to Learn",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {auth.role === "Parent" ? `${student.name}'s Portal` : "My Portal"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Attendance Rate"
          value={`${Math.round(
            (student.attendance.filter((a) => a.status === "present").length /
              student.attendance.length) *
              100
          )}%`}
          icon="✅"
          color="bg-green-600"
        />
        <DashboardCard
          title="Fee Balance"
          value={`KES ${student.fees.balance.toLocaleString()}`}
          icon="💰"
          color="bg-yellow-600"
        />
        <DashboardCard
          title="Messages"
          value={student.messages.length}
          icon="📧"
          color="bg-blue-600"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Elimu Smart Competencies
        </h2>
        <div className="space-y-4">
          {Object.entries(student.competencies).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {competencyLabels[key as keyof typeof competencyLabels]}
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {value}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, delay: 0.1 }}
                  className={`h-2.5 rounded-full ${
                    value >= 80
                      ? "bg-green-600"
                      : value >= 60
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Attendance
          </h2>
          <div className="space-y-2">
            {student.attendance
              .slice(-5)
              .reverse()
              .map((att, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {att.date}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      att.status === "present"
                        ? "bg-green-100 text-green-800"
                        : att.status === "late"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {att.status}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Extracurricular Activities
          </h2>
          <div className="space-y-2">
            {student.extracurriculars?.map((activity, idx) => (
              <div
                key={idx}
                className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg"
              >
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  {activity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsPage() {
  const { data, updateData } = useData();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    parentContact: "",
    email: "",
    classId: data.classes[0]?.id || "",
  });

  const filteredStudents = data.students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editStudent) {
      updateData(
        "students",
        data.students.map((s) =>
          s.id === editStudent.id
            ? {
                ...s,
                name: formData.name,
                classId: formData.classId,
                bioData: {
                  ...s.bioData,
                  dob: formData.dob,
                  parentContact: formData.parentContact,
                  email: formData.email,
                },
              }
            : s
        )
      );
      showToast("Student updated", "success");
    } else {
      const newStudent: Student = {
        id: `s${data.students.length + 1}`,
        name: formData.name,
        bioData: {
          dob: formData.dob,
          parentContact: formData.parentContact,
          email: formData.email,
        },
        classId: formData.classId,
        competencies: {
          criticalThinking: 0,
          creativity: 0,
          communication: 0,
          collaboration: 0,
          citizenship: 0,
          digitalLiteracy: 0,
          learningToLearn: 0,
        },
        attendance: [],
        fees: { balance: 0, payments: [] },
        messages: [],
        extracurriculars: [],
      };
      updateData("students", [...data.students, newStudent]);
      showToast("Student added", "success");
    }
    setShowModal(false);
    setFormData({
      name: "",
      dob: "",
      parentContact: "",
      email: "",
      classId: data.classes[0]?.id || "",
    });
    setEditStudent(null);
  };

  const handleEdit = (student: Student) => {
    setEditStudent(student);
    setFormData({
      name: student.name,
      dob: student.bioData.dob,
      parentContact: student.bioData.parentContact,
      email: student.bioData.email || "",
      classId: student.classId,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      updateData(
        "students",
        data.students.filter((s) => s.id !== id)
      );
      showToast("Student deleted", "success");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    {
      key: "classId",
      label: "Class",
      render: (val: string) =>
        data.classes.find((c) => c.id === val)?.name || val,
    },
    {
      key: "bioData",
      label: "Parent Contact",
      render: (val: any) => val.parentContact,
    },
    {
      key: "fees",
      label: "Fee Balance",
      render: (val: any) => `KES ${val.balance.toLocaleString()}`,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: Student) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Students Management
        </h1>
        <button
          onClick={() => {
            setEditStudent(null);
            setFormData({
              name: "",
              dob: "",
              parentContact: "",
              email: "",
              classId: data.classes[0]?.id || "",
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          + Add Student
        </button>
      </div>

      <input
        type="text"
        placeholder="Search students..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Table columns={columns} data={filteredStudents} />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editStudent ? "Edit Student" : "Add New Student"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth
              </label>
              <input
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parent Contact
              </label>
              <input
                value={formData.parentContact}
                onChange={(e) =>
                  setFormData({ ...formData, parentContact: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Parent Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Class
            </label>
            <select
              value={formData.classId}
              onChange={(e) =>
                setFormData({ ...formData, classId: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            >
              {data.classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            {editStudent ? "Update" : "Add"} Student
          </button>
        </form>
      </Modal>
    </div>
  );
}

function AssessmentsPage() {
  const { data, updateData } = useData();
  const { showToast } = useToast();
  const [selectedClass, setSelectedClass] = useState(data.classes[0]?.id || "");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);

  const classStudents = data.students.filter(
    (s) => s.classId === selectedClass
  );

  const columns = [
    { key: "name", label: "Student" },
    {
      key: "competencies",
      label: "Avg Score",
      render: (comp: Student["competencies"]) => {
        const avg = Math.round(
          Object.values(comp).reduce((a, b) => a + b, 0) / 7
        );
        return (
          <span
            className={`px-2 py-1 rounded ${
              avg >= 80
                ? "bg-green-100 text-green-800"
                : avg >= 60
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {avg}%
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: Student) => (
        <button
          onClick={() => {
            setSelectedStudent(row);
            setShowModal(true);
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          Update Scores
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Elimu Smart Assessments
      </h1>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Class
        </label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          {data.classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Table columns={columns} data={classStudents} />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Update Competencies - ${selectedStudent?.name}`}
      >
        {selectedStudent && (
          <CompetencyForm
            student={selectedStudent}
            onSubmit={(id, comp) => {
              updateData(
                "students",
                data.students.map((s) =>
                  s.id === id ? { ...s, competencies: comp } : s
                )
              );
              showToast("Competencies updated", "success");
              setShowModal(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function CompetencyForm({
  student,
  onSubmit,
}: {
  student: Student;
  onSubmit: (id: string, comp: Student["competencies"]) => void;
}) {
  const [competencies, setCompetencies] = useState(student.competencies);

  const competencyLabels = {
    criticalThinking: "Critical Thinking",
    creativity: "Creativity",
    communication: "Communication",
    collaboration: "Collaboration",
    citizenship: "Citizenship",
    digitalLiteracy: "Digital Literacy",
    learningToLearn: "Learning to Learn",
  };

  return (
    <div className="space-y-6">
      {Object.entries(competencies).map(([key, value]) => (
        <div key={key}>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {competencyLabels[key as keyof typeof competencyLabels]}
            </label>
            <span className="text-sm font-bold text-blue-600">{value}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) =>
              setCompetencies({
                ...competencies,
                [key]: parseInt(e.target.value),
              })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
      ))}
      <button
        onClick={() => onSubmit(student.id, competencies)}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        Save Competencies
      </button>
    </div>
  );
}

function CBCReportsPage() {
  const { data } = useData();
  const { auth } = useAuth();
  const { showToast } = useToast();

  const student =
    auth.role === "Admin"
      ? data.students[0]
      : data.students.find((s) => s.id === auth.userId) || data.students[0];
  const report = data.reports.find((r) => r.studentId === student.id);

  const handlePrint = () => {
    window.print();
    showToast("Report ready to print", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Elimu Smart Holistic Reports
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {student.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {data.classes.find((c) => c.id === student.classId)?.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Term 3, 2025
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Elimu Smart Competencies
            </h3>
            <div className="space-y-3">
              {Object.entries(student.competencies).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          value >= 80
                            ? "bg-green-600"
                            : value >= 60
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-blue-600 w-12 text-right">
                      {value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance Summary
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Overall Average
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    Object.values(student.competencies).reduce(
                      (a, b) => a + b,
                      0
                    ) / 7
                  )}
                  %
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(
                    (student.attendance.filter((a) => a.status === "present")
                      .length /
                      student.attendance.length) *
                      100
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {report && (
          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Holistic Assessment
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {report.holisticNotes}
            </p>
          </div>
        )}

        <div className="mt-8 flex space-x-4">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Print Report
          </button>
          <button
            onClick={() => showToast("Report shared with parent", "success")}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Share with Parent
          </button>
        </div>
      </div>
    </div>
  );
}

function LessonPlansPage() {
  const { data, updateData } = useData();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: data.teachers[0]?.subjects[0] || "",
    scheme: "",
    alignedCBC: "true",
  });

  const teacher = data.teachers[0];
  const myPlans = data.lessonPlans.filter((lp) => lp.teacherId === teacher.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: LessonPlan = {
      id: `lp${data.lessonPlans.length + 1}`,
      title: formData.title,
      subject: formData.subject,
      scheme: formData.scheme,
      teacherId: teacher.id,
      createdAt: new Date().toLocaleDateString("en-GB"),
      sharedWith: [],
      alignedCBC: formData.alignedCBC === "true",
    };
    updateData("lessonPlans", [...data.lessonPlans, newPlan]);
    showToast("Lesson plan created", "success");
    setShowModal(false);
    setFormData({
      title: "",
      subject: teacher.subjects[0],
      scheme: "",
      alignedCBC: "true",
    });
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "subject", label: "Subject" },
    { key: "createdAt", label: "Created" },
    {
      key: "alignedCBC",
      label: "CBC Aligned",
      render: (val: boolean) => (
        <span
          className={`px-2 py-1 text-xs rounded ${
            val ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {val ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <button
          onClick={() => showToast("Shared with teachers", "success")}
          className="text-green-600 hover:text-green-800"
        >
          Share
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Lesson Plans
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          + Create Lesson Plan
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Table columns={columns} data={myPlans} />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Lesson Plan"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <select
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            >
              {teacher.subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Scheme of Work
            </label>
            <textarea
              value={formData.scheme}
              onChange={(e) =>
                setFormData({ ...formData, scheme: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              CBC Aligned?
            </label>
            <select
              value={formData.alignedCBC}
              onChange={(e) =>
                setFormData({ ...formData, alignedCBC: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Create Lesson Plan
          </button>
        </form>
      </Modal>
    </div>
  );
}

function FinancePage() {
  const { data, updateData } = useData();
  const { showToast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    method: "M-PESA",
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFee) {
      const student = data.students.find((s) => s.id === selectedFee.studentId);
      if (student) {
        const payment = {
          id: `p${Date.now()}`,
          amount: parseFloat(paymentData.amount),
          date: new Date().toLocaleDateString("en-GB"),
          method: paymentData.method,
        };

        updateData(
          "students",
          data.students.map((s) =>
            s.id === selectedFee.studentId
              ? {
                  ...s,
                  fees: {
                    ...s.fees,
                    balance: s.fees.balance - payment.amount,
                    payments: [...s.fees.payments, payment],
                  },
                }
              : s
          )
        );

        updateData(
          "fees",
          data.fees.map((f) =>
            f.id === selectedFee.id
              ? { ...f, paid: f.amount <= payment.amount }
              : f
          )
        );

        showToast(
          `Payment of KES ${payment.amount.toLocaleString()} recorded`,
          "success"
        );
        setShowPaymentModal(false);
        setPaymentData({ amount: "", method: "M-PESA" });
      }
    }
  };

  const columns = [
    {
      key: "studentId",
      label: "Student",
      render: (id: string) =>
        data.students.find((s) => s.id === id)?.name || id,
    },
    { key: "description", label: "Description" },
    {
      key: "amount",
      label: "Amount",
      render: (val: number) => `KES ${val.toLocaleString()}`,
    },
    { key: "dueDate", label: "Due Date" },
    {
      key: "paid",
      label: "Status",
      render: (val: boolean) => (
        <span
          className={`px-2 py-1 text-xs rounded ${
            val ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {val ? "Paid" : "Pending"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: Fee) =>
        !row.paid && (
          <button
            onClick={() => {
              setSelectedFee(row);
              setShowPaymentModal(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Record Payment
          </button>
        ),
    },
  ];

  const totalPending = data.fees
    .filter((f) => !f.paid)
    .reduce((sum, f) => sum + f.amount, 0);
  const totalCollected = data.students.reduce(
    (sum, s) => sum + s.fees.payments.reduce((pSum, p) => pSum + p.amount, 0),
    0
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Finance Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Pending"
          value={`KES ${totalPending.toLocaleString()}`}
          icon="⏳"
          color="bg-yellow-600"
        />
        <DashboardCard
          title="Total Collected"
          value={`KES ${totalCollected.toLocaleString()}`}
          icon="✅"
          color="bg-green-600"
        />
        <DashboardCard
          title="Outstanding Invoices"
          value={data.fees.filter((f) => !f.paid).length}
          icon="📄"
          color="bg-red-600"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Table columns={columns} data={data.fees} />
      </div>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Payment"
      >
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount (KES)
            </label>
            <input
              type="number"
              value={paymentData.amount}
              onChange={(e) =>
                setPaymentData({ ...paymentData, amount: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Method
            </label>
            <select
              value={paymentData.method}
              onChange={(e) =>
                setPaymentData({ ...paymentData, method: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="M-PESA">M-PESA</option>
              <option value="Bank">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Record Payment
          </button>
        </form>
      </Modal>
    </div>
  );
}

function HRPage() {
  const { data, updateData } = useData();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    salary: "",
    deductions: "0",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff: Staff = {
      id: `st${data.staff.length + 1}`,
      name: formData.name,
      role: formData.role,
      payroll: {
        salary: parseFloat(formData.salary),
        deductions: parseFloat(formData.deductions),
        netPay: parseFloat(formData.salary) - parseFloat(formData.deductions),
      },
      email: formData.email,
      phone: formData.phone,
      leaveBalance: 20,
    };
    updateData("staff", [...data.staff, newStaff]);
    showToast("Staff member added", "success");
    setShowModal(false);
    setFormData({
      name: "",
      role: "",
      email: "",
      phone: "",
      salary: "",
      deductions: "0",
    });
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "phone", label: "Phone" },
    {
      key: "payroll",
      label: "Net Pay",
      render: (val: Staff["payroll"]) => `KES ${val.netPay?.toLocaleString()}`,
    },
    {
      key: "leaveBalance",
      label: "Leave Balance",
      render: (val: number) => `${val} days`,
    },
  ];

  const totalPayroll = data.staff.reduce(
    (sum, s) => sum + (s.payroll.netPay || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          HR & Staff Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          + Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Staff"
          value={data.staff.length}
          icon="👥"
          color="bg-blue-600"
        />
        <DashboardCard
          title="Monthly Payroll"
          value={`KES ${totalPayroll.toLocaleString()}`}
          icon="💰"
          color="bg-green-600"
        />
        <DashboardCard
          title="On Leave"
          value="0"
          icon="🏖️"
          color="bg-yellow-600"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Table columns={columns} data={data.staff} />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Staff Member"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <input
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salary (KES)
              </label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deductions (KES)
              </label>
              <input
                type="number"
                value={formData.deductions}
                onChange={(e) =>
                  setFormData({ ...formData, deductions: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Add Staff Member
          </button>
        </form>
      </Modal>
    </div>
  );
}

function CommunicationPage() {
  const { data, updateData } = useData();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: "SMS" as "SMS" | "Email",
    recipients: "",
    content: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMessage: Message = {
      id: `m${data.messages.length + 1}`,
      to: formData.recipients.split(",").map((r) => r.trim()),
      from: "school",
      content: formData.content,
      type: formData.type,
      timestamp: new Date().toLocaleString("en-GB"),
      read: false,
    };
    updateData("messages", [...data.messages, newMessage]);
    showToast(`${formData.type} sent successfully`, "success");
    setShowModal(false);
    setFormData({ type: "SMS", recipients: "", content: "" });
  };

  const columns = [
    {
      key: "to",
      label: "Recipients",
      render: (val: string[]) => val.join(", ").substring(0, 30) + "...",
    },
    {
      key: "content",
      label: "Message",
      render: (val: string) => val.substring(0, 50) + "...",
    },
    { key: "type", label: "Type" },
    { key: "timestamp", label: "Sent" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Communication
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          + Send Message
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Templates
          </h2>
          <div className="space-y-2">
            <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition">
              📢 Fee Reminder
            </button>
            <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 rounded-lg transition">
              📅 Event Notification
            </button>
            <button className="w-full text-left p-3 bg-yellow-50 dark:bg-yellow-900 hover:bg-yellow-100 dark:hover:bg-yellow-800 rounded-lg transition">
              📝 Academic Update
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">SMS Sent</span>
              <span className="text-2xl font-bold text-blue-600">
                {data.messages.filter((m) => m.type === "SMS").length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">
                Emails Sent
              </span>
              <span className="text-2xl font-bold text-green-600">
                {data.messages.filter((m) => m.type === "Email").length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white p-6 border-b dark:border-gray-700">
          Message History
        </h2>
        <Table columns={columns} data={data.messages} />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Send Message"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "SMS" | "Email",
                })
              }
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="SMS">SMS</option>
              <option value="Email">Email</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipients (comma-separated)
            </label>
            <textarea
              value={formData.recipients}
              onChange={(e) =>
                setFormData({ ...formData, recipients: e.target.value })
              }
              required
              rows={2}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="+254712345678, +254723456789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Send Message
          </button>
        </form>
      </Modal>
    </div>
  );
}

function MessagesPage() {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMessages = data.messages.filter((m) =>
    m.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Messages
      </h1>

      <input
        type="text"
        placeholder="Search messages..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
      />

      <div className="space-y-3">
        {filteredMessages.map((msg) => (
          <motion.div
            key={msg.id}
            whileHover={{ scale: 1.01 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    msg.type === "SMS"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {msg.type}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {msg.timestamp}
                </span>
              </div>
              {!msg.read && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                  New
                </span>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300">{msg.content}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              To: {msg.to.join(", ")}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CalendarPage() {
  const { data, updateData } = useData();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    type: "School Event",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: `ev${data.events.length + 1}`,
      title: formData.title,
      date: formData.date,
      type: formData.type,
      description: formData.description,
    };
    updateData("events", [...data.events, newEvent]);
    showToast("Event added", "success");
    setShowModal(false);
    setFormData({ title: "", date: "", type: "School Event", description: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          School Calendar
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          + Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h2>
          <div className="space-y-3">
            {data.events.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border-l-4 border-blue-600 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.description}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      event.type === "School Event"
                        ? "bg-purple-100 text-purple-800"
                        : event.type === "Meeting"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {event.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  📅 {event.date}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Stats
          </h2>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Total Events
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {data.events.length}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
              <p className="text-sm text-green-900 dark:text-green-100">
                This Month
              </p>
              <p className="text-2xl font-bold text-green-600">
                {data.events.filter((e) => e.date.includes("/11/2025")).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Event"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date (DD/MM/YYYY)
            </label>
            <input
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              placeholder="13/11/2025"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="School Event">School Event</option>
              <option value="Meeting">Meeting</option>
              <option value="Academic">Academic</option>
              <option value="Holiday">Holiday</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Add Event
          </button>
        </form>
      </Modal>
    </div>
  );
}

function AttendancePage() {
  const { data, updateData } = useData();
  const { showToast } = useToast();
  const [selectedClass, setSelectedClass] = useState(data.classes[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-GB")
  );

  const classStudents = data.students.filter(
    (s) => s.classId === selectedClass
  );

  const markAttendance = (
    studentId: string,
    status: "present" | "absent" | "late"
  ) => {
    updateData(
      "students",
      data.students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              attendance: [
                ...s.attendance.filter((a) => a.date !== selectedDate),
                { date: selectedDate, status },
              ],
            }
          : s
      )
    );
    showToast("Attendance marked", "success");
  };

  const markAllPresent = () => {
    updateData(
      "students",
      data.students.map((s) =>
        classStudents.find((cs) => cs.id === s.id)
          ? {
              ...s,
              attendance: [
                ...s.attendance.filter((a) => a.date !== selectedDate),
                { date: selectedDate, status: "present" as const },
              ],
            }
          : s
      )
    );
    showToast("All marked present", "success");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Attendance Register
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          >
            {data.classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <input
            type="text"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="DD/MM/YYYY"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={markAllPresent}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Mark All Present
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {classStudents.map((student) => {
              const todayAttendance = student.attendance.find(
                (a) => a.date === selectedDate
              );
              return (
                <tr key={student.id}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                    {student.name}
                  </td>
                  <td className="px-6 py-4">
                    {todayAttendance ? (
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          todayAttendance.status === "present"
                            ? "bg-green-100 text-green-800"
                            : todayAttendance.status === "late"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {todayAttendance.status}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not marked</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => markAttendance(student.id, "present")}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(student.id, "late")}
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition"
                      >
                        Late
                      </button>
                      <button
                        onClick={() => markAttendance(student.id, "absent")}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition"
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TimetablePage() {
  const { data, updateData } = useData();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    day: "Monday",
    period: "1",
    time: "",
    subject: "",
    classId: data.classes[0]?.id || "",
    teacherId: data.teachers[0]?.id || "",
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["1", "2", "3", "4", "5"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: TimetableSlot = {
      id: `tt${data.timetable.length + 1}`,
      day: formData.day,
      period: formData.period,
      subject: formData.subject,
      teacherId: formData.teacherId,
      classId: formData.classId,
      time: formData.time,
    };
    updateData("timetable", [...data.timetable, newSlot]);
    showToast("Timetable slot added", "success");
    setShowModal(false);
    setFormData({
      day: "Monday",
      period: "1",
      time: "",
      subject: "",
      classId: data.classes[0]?.id || "",
      teacherId: data.teachers[0]?.id || "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Timetable Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          + Add Slot
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Period
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {periods.map((period) => (
              <tr key={period}>
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                  Period {period}
                </td>
                {days.map((day) => {
                  const slot = data.timetable.find(
                    (t) => t.day === day && t.period === period
                  );
                  return (
                    <td key={day} className="px-4 py-3">
                      {slot ? (
                        <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded text-xs">
                          <p className="font-semibold text-blue-900 dark:text-blue-100">
                            {slot.subject}
                          </p>
                          <p className="text-blue-700 dark:text-blue-300">
                            {slot.time}
                          </p>
                          <p className="text-blue-600 dark:text-blue-400">
                            {
                              data.classes.find((c) => c.id === slot.classId)
                                ?.name
                            }
                          </p>
                        </div>
                      ) : (
                        <div className="p-2 text-gray-400 text-xs">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Timetable Slot"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Day
              </label>
              <select
                value={formData.day}
                onChange={(e) =>
                  setFormData({ ...formData, day: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Period
              </label>
              <select
                value={formData.period}
                onChange={(e) =>
                  setFormData({ ...formData, period: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <input
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              placeholder="08:00-09:00"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <input
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Class
            </label>
            <select
              value={formData.classId}
              onChange={(e) =>
                setFormData({ ...formData, classId: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            >
              {data.classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Teacher
            </label>
            <select
              value={formData.teacherId}
              onChange={(e) =>
                setFormData({ ...formData, teacherId: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            >
              {data.teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Add Slot
          </button>
        </form>
      </Modal>
    </div>
  );
}

function AcademicsPage() {
  const { data } = useData();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Academic Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Classes"
          value={data.classes.length}
          icon="🏫"
          color="bg-blue-600"
        />
        <DashboardCard
          title="Subjects"
          value="12"
          icon="📚"
          color="bg-green-600"
        />
        <DashboardCard
          title="Exams Scheduled"
          value={data.exams.length}
          icon="📝"
          color="bg-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Classes Overview
          </h2>
          <div className="space-y-3">
            {data.classes.map((cls) => (
              <div
                key={cls.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {cls.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {cls.students.length} students · Teacher:{" "}
                      {data.teachers.find((t) => t.id === cls.teacherId)?.name}
                    </p>
                  </div>
                  <span className="text-2xl">👨‍🎓</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Exams
          </h2>
          <div className="space-y-3">
            {data.exams.map((exam) => (
              <div
                key={exam.id}
                className="p-4 border-l-4 border-purple-600 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <p className="font-semibold text-gray-900 dark:text-white">
                  {exam.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {exam.subject}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  📅 {exam.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsPage() {
  const { data } = useData();
  const { showToast } = useToast();

  const handleExportCSV = () => {
    showToast("CSV export initiated", "success");
  };

  const avgCompetencies = useMemo(() => {
    return Object.keys(data.students[0]?.competencies || {}).map((key) => {
      const avg = Math.round(
        data.students.reduce(
          (sum, s) =>
            sum + s.competencies[key as keyof Student["competencies"]],
          0
        ) / data.students.length
      );
      return { name: key.replace(/([A-Z])/g, " $1").trim(), value: avg };
    });
  }, [data.students]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics & Reports
        </h1>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          📊 Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Students"
          value={data.students.length}
          icon="👨‍🎓"
          color="bg-blue-600"
        />
        <DashboardCard
          title="Avg Attendance"
          value="92%"
          icon="✅"
          color="bg-green-600"
        />
        <DashboardCard
          title="Fee Collection"
          value="75%"
          icon="💰"
          color="bg-yellow-600"
        />
        <DashboardCard
          title="Avg Performance"
          value="80%"
          icon="📈"
          color="bg-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Elimu Smart Competencies Average
          </h2>
          <div className="space-y-3">
            {avgCompetencies.map((comp) => (
              <div key={comp.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {comp.name}
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {comp.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      comp.value >= 80
                        ? "bg-green-600"
                        : comp.value >= 60
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${comp.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Fee Collection Status
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <p className="text-sm text-green-900 dark:text-green-100">
                Collected
              </p>
              <p className="text-2xl font-bold text-green-600">
                KES{" "}
                {data.students
                  .reduce(
                    (sum, s) =>
                      sum +
                      s.fees.payments.reduce((pSum, p) => pSum + p.amount, 0),
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
              <p className="text-sm text-red-900 dark:text-red-100">Pending</p>
              <p className="text-2xl font-bold text-red-600">
                KES{" "}
                {data.students
                  .reduce((sum, s) => sum + s.fees.balance, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Layout Component
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const { currentPage } = useNavigation();
  const { auth } = useAuth();

  const renderPage = () => {
    if (currentPage === "login") {
      return <LoginPage />;
    }

    if (!auth.isAuthenticated) {
      return <LoginPage />;
    }

    const pageMap: Record<Page, React.ReactNode> = {
      login: <LoginPage />,
      dashboard:
        auth.role === "Admin" ? (
          <AdminDashboard />
        ) : auth.role === "Teacher" ? (
          <TeacherDashboard />
        ) : (
          <PortalPage />
        ),
      students: <StudentsPage />,
      assessments: <AssessmentsPage />,
      "cbc-reports": <CBCReportsPage />,
      "lesson-plans": <LessonPlansPage />,
      finance: <FinancePage />,
      hr: <HRPage />,
      communication: <CommunicationPage />,
      reports: <ReportsPage />,
      attendance: <AttendancePage />,
      timetable: <TimetablePage />,
      portal: <PortalPage />,
      messages: <MessagesPage />,
      calendar: <CalendarPage />,
      academics: <AcademicsPage />,
    };

    return (
      <DashboardLayout>
        {pageMap[currentPage] || <AdminDashboard />}
      </DashboardLayout>
    );
  };

  return renderPage();
}

function Home() {
  return (
    <AppProviders>
      <App />
    </AppProviders>
  );
}

export default Home;
