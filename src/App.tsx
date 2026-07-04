import React, { useState, useEffect, useRef } from 'react';
import { Member, Plan, Payment, Attendance, GymAnnouncement, GymConfig, User } from './types';
import { DEFAULT_MEMBERS, DEFAULT_PLANS, DEFAULT_PAYMENTS, DEFAULT_ATTENDANCE, DEFAULT_NOTIFICATIONS, DEFAULT_GYM_CONFIG } from './data/mockData';

// Components
import AdminDashboard from './components/AdminDashboard';
import MemberManagement from './components/MemberManagement';
import PlanManagement from './components/PlanManagement';
import FeeManagement from './components/FeeManagement';
import AttendanceTracker from './components/AttendanceTracker';
import NotificationsPanel from './components/NotificationsPanel';
import ReportsPanel from './components/ReportsPanel';
import MemberPortal from './components/MemberPortal';

// Icons
import {
  Users,
  Award,
  CreditCard,
  Flame,
  Bell,
  BarChart3,
  LogOut,
  Dumbbell,
  Moon,
  Sun,
  Smartphone,
  CheckCircle,
  Database,
  ArrowRight,
  Sparkles,
  Camera,
  Info
} from 'lucide-react';
import { backupState } from './utils/helpers';

export default function App() {
  // --- Persistent States ---
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('fittrack_members');
    if (saved) {
      const parsed = JSON.parse(saved) as Member[];
      let updated = false;
      const migrated = parsed.map((m) => {
        if (m.feeAmount === 5) {
          m.feeAmount = 500;
          updated = true;
        } else if (m.feeAmount === 15) {
          m.feeAmount = 1500;
          updated = true;
        }
        return m;
      });
      if (updated) {
        localStorage.setItem('fittrack_members', JSON.stringify(migrated));
      }
      return migrated;
    }
    return DEFAULT_MEMBERS;
  });

  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem('fittrack_plans');
    if (saved) {
      const parsed = JSON.parse(saved) as Plan[];
      let updated = false;
      const migrated = parsed.map((p) => {
        if (p.feeAmount === 5) {
          p.feeAmount = 500;
          updated = true;
        } else if (p.feeAmount === 15) {
          p.feeAmount = 1500;
          updated = true;
        }
        return p;
      });
      if (updated) {
        localStorage.setItem('fittrack_plans', JSON.stringify(migrated));
      }
      return migrated;
    }
    return DEFAULT_PLANS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('fittrack_payments');
    if (saved) {
      const parsed = JSON.parse(saved) as Payment[];
      let updated = false;
      const migrated = parsed.map((p) => {
        if (p.amount === 5) {
          p.amount = 500;
          updated = true;
        } else if (p.amount === 15) {
          p.amount = 1500;
          updated = true;
        }
        return p;
      });
      if (updated) {
        localStorage.setItem('fittrack_payments', JSON.stringify(migrated));
      }
      return migrated;
    }
    return DEFAULT_PAYMENTS;
  });

  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    const saved = localStorage.getItem('fittrack_attendance');
    return saved ? JSON.parse(saved) : DEFAULT_ATTENDANCE;
  });

  const [notifications, setNotifications] = useState<GymAnnouncement[]>(() => {
    const saved = localStorage.getItem('fittrack_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  const [gymConfig, setGymConfig] = useState<GymConfig>(() => {
    const saved = localStorage.getItem('fittrack_config');
    return saved ? JSON.parse(saved) : DEFAULT_GYM_CONFIG;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('fittrack_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fittrack_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedUser = localStorage.getItem('fittrack_current_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return parsed.role === 'admin' ? 'dashboard' : 'portal';
    }
    return 'dashboard';
  });

  // Highlighted member to view instantly from Dashboard
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>(undefined);

  // --- Auth Screen States ---
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // File Ref for backup restore
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Save states to LocalStorage upon changes ---
  useEffect(() => {
    localStorage.setItem('fittrack_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('fittrack_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('fittrack_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('fittrack_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('fittrack_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('fittrack_config', JSON.stringify(gymConfig));
  }, [gymConfig]);

  useEffect(() => {
    localStorage.setItem('fittrack_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fittrack_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('fittrack_current_user');
    }
  }, [currentUser]);

  // --- Login authentication triggers ---
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === 'Gymfit' && loginPass === 'Ash25') {
      const adminUser: User = {
        id: 'user_admin',
        mobile: '9999999999',
        role: 'admin',
        name: 'RS FITNESS Administrator'
      };
      setCurrentUser(adminUser);
      setActiveTab('dashboard');
    } else {
      alert('Access Denied: Invalid Administrative ID or Password!');
    }
  };

  // Switch role or logout
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  // Admin Configuration Updates
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGymConfig((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Restore State from local file
  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.members && parsed.plans && parsed.payments) {
            setMembers(parsed.members);
            setPlans(parsed.plans);
            setPayments(parsed.payments);
            if (parsed.attendance) setAttendance(parsed.attendance);
            if (parsed.notifications) setNotifications(parsed.notifications);
            if (parsed.gymConfig) setGymConfig(parsed.gymConfig);
            alert('FitTrack Database Restored successfully!');
          } else {
            alert('Invalid backup schema. Please upload a valid fittrack json file.');
          }
        } catch (error) {
          alert('Failed to parse backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Navigation controller helper
  const handleQuickNavigation = (tabName: string) => {
    setActiveTab(tabName);
    setSelectedMemberId(undefined);
  };

  const handleSelectMemberProfile = (memberId: string) => {
    setSelectedMemberId(memberId);
    setActiveTab('members');
  };

  // --- Render Layouts ---
  if (!currentUser) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-zinc-50 text-zinc-950'} flex flex-col justify-between font-sans relative overflow-hidden`} id="auth-root">
        {/* Decorative backgrounds */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <header className="p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500 text-black rounded-lg">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase">
              RS <span className="text-amber-500">FITNESS</span>
            </span>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-colors text-zinc-400 hover:text-white"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-amber-500" />}
          </button>
        </header>

        {/* Content Block */}
        <main className="flex-1 flex items-center justify-center p-4 z-10">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-zinc-800 to-amber-500"></div>
            
            <div className="text-center space-y-1">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">ADMIN DASHBOARD</h2>
              <p className="text-xs text-zinc-500">Enter secure administrative credentials below</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4" id="login-admin-form">
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-wider mb-1.5">
                  Administrative ID
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 w-4.5 h-4.5" />
                  <input
                    type="text"
                    required
                    placeholder="Enter ID"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 w-4.5 h-4.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-extrabold rounded-xl text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 active:scale-95 transition-all cursor-pointer"
              >
                Access Admin Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-zinc-600 text-xs z-10 border-t border-zinc-900/40">
          RS FITNESS Gym Management Desk • Private Security Portal
        </footer>
      </div>
    );
  }

  // --- Render Member Portal if current user is Member ---
  if (currentUser.role === 'member') {
    const matchedMember = members.find((m) => m.id === currentUser.memberId);
    if (!matchedMember) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
          <p className="text-red-400 font-bold">Error linking member profile. Contact administrative counter.</p>
          <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-zinc-800 rounded">Logout</button>
        </div>
      );
    }

    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#060606] text-zinc-200' : 'bg-zinc-50 text-zinc-900'} p-6 transition-colors`}>
        <MemberPortal
          member={matchedMember}
          payments={payments}
          attendance={attendance}
          notifications={notifications}
          plans={plans}
          gymConfig={gymConfig}
          onUpdateMemberPhoto={(memberId, base64) => {
            setMembers((prev) =>
              prev.map((m) => (m.id === memberId ? { ...m, photo: base64 } : m))
            );
          }}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // --- Render Full Admin Dashboard ---
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#080808] text-zinc-200' : 'bg-zinc-50 text-zinc-950'} flex flex-col md:flex-row font-sans`}>
      
      {/* 1. Admin Navigation Sidebar Panel */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between shrink-0">
        
        {/* Top brand */}
        <div>
          <div className="p-6 border-b border-zinc-900 flex items-center gap-2.5">
            {gymConfig.logoUrl ? (
              <img src={gymConfig.logoUrl} alt="Logo" className="w-6.5 h-6.5 object-cover rounded" />
            ) : (
              <div className="p-1 bg-amber-500 text-black rounded-lg">
                <Dumbbell className="w-4.5 h-4.5" />
              </div>
            )}
            <div>
              <span className="text-base font-black text-white tracking-tight uppercase">
                RS <span className="text-amber-500">FITNESS</span>
              </span>
              <p className="text-[9px] text-zinc-500 tracking-wider uppercase font-bold mt-0.5">Manager Desk</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => handleQuickNavigation('dashboard')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${activeTab === 'dashboard' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'}`}
            >
              <Dumbbell className="w-4.5 h-4.5" />
              Control Panel
            </button>

            <button
              onClick={() => handleQuickNavigation('members')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${activeTab === 'members' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'}`}
            >
              <Users className="w-4.5 h-4.5" />
              Member Directory
            </button>

            <button
              onClick={() => handleQuickNavigation('plans')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${activeTab === 'plans' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'}`}
            >
              <Award className="w-4.5 h-4.5" />
              Membership Plans
            </button>

            <button
              onClick={() => handleQuickNavigation('fees')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${activeTab === 'fees' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'}`}
            >
              <CreditCard className="w-4.5 h-4.5" />
              Fees & Billings
            </button>

            <button
              onClick={() => handleQuickNavigation('attendance')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${activeTab === 'attendance' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'}`}
            >
              <Flame className="w-4.5 h-4.5" />
              Attendance logs
            </button>

            <button
              onClick={() => handleQuickNavigation('reports')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${activeTab === 'reports' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'}`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              Business reports
            </button>
          </nav>
        </div>

        {/* Configurations, Theme Toggles and Logout */}
        <div className="p-4 border-t border-zinc-900 space-y-4">
          <div className="flex justify-between items-center px-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-amber-500" />}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 bg-zinc-900 hover:bg-red-950/20 rounded-lg text-zinc-400 hover:text-red-400 flex items-center gap-1.5 text-xs font-bold"
              title="Logout Administrative Desk"
            >
              <LogOut className="w-4 h-4" />
              Exit
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Workspace Frame */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            members={members}
            plans={plans}
            payments={payments}
            attendance={attendance}
            onNavigate={handleQuickNavigation}
            onSelectMember={handleSelectMemberProfile}
          />
        )}

        {activeTab === 'members' && (
          <MemberManagement
            members={members}
            plans={plans}
            onAddMember={(newMember) => setMembers((prev) => [newMember, ...prev])}
            onEditMember={(edited) => setMembers((prev) => prev.map((m) => (m.id === edited.id ? edited : m)))}
            onDeleteMember={(id) => setMembers((prev) => prev.filter((m) => m.id !== id))}
            selectedMemberId={selectedMemberId}
            onClearSelectedMember={() => setSelectedMemberId(undefined)}
          />
        )}

        {activeTab === 'plans' && (
          <PlanManagement
            plans={plans}
            onAddPlan={(p) => setPlans((prev) => [p, ...prev])}
            onEditPlan={(edited) => setPlans((prev) => prev.map((p) => (p.id === edited.id ? edited : p)))}
            onDeletePlan={(id) => setPlans((prev) => prev.filter((p) => p.id !== id))}
          />
        )}

        {activeTab === 'fees' && (
          <FeeManagement
            members={members}
            payments={payments}
            plans={plans}
            gymConfig={gymConfig}
            onRecordPayment={(pay) => setPayments((prev) => [...prev, pay])}
            onRenewMember={(memberId, planId, paidAmount, nextDueDate) => {
              setMembers((prev) =>
                prev.map((m) =>
                  m.id === memberId
                    ? { ...m, planId, feeAmount: paidAmount, feeDueDate: nextDueDate, status: 'active' }
                    : m
                )
              );
            }}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTracker
            members={members}
            attendance={attendance}
            onCheckIn={(newCheckIn) => setAttendance((prev) => [...prev, newCheckIn])}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsPanel
            members={members}
            payments={payments}
            attendance={attendance}
            plans={plans}
          />
        )}
      </main>
    </div>
  );
}
