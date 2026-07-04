import React from 'react';
import { Member, Payment, Attendance, Plan } from '../types';
import { Users, UserCheck, UserX, AlertCircle, IndianRupee, Calendar, Flame, Search, ArrowUpRight, TrendingUp } from 'lucide-react';

interface AdminDashboardProps {
  members: Member[];
  plans: Plan[];
  payments: Payment[];
  attendance: Attendance[];
  onNavigate: (tab: string) => void;
  onSelectMember: (memberId: string) => void;
}

export default function AdminDashboard({
  members,
  plans,
  payments,
  attendance,
  onNavigate,
  onSelectMember,
}: AdminDashboardProps) {
  // Current Date logic
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Stats Calculations
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const expiredMembers = members.filter((m) => m.status === 'expired').length;
  
  // Fee due members (active but due date is <= today or expired)
  const feeDueMembers = members.filter((m) => {
    const dueTime = new Date(m.feeDueDate).getTime();
    const todayTime = new Date(todayStr).getTime();
    // Due soon/today (within next 5 days) or already past
    return dueTime <= todayTime + (5 * 24 * 60 * 60 * 1000);
  }).length;

  // Today's Collection
  const todayPayments = payments.filter((p) => p.paymentDate === todayStr && p.status === 'paid');
  const todayCollection = todayPayments.reduce((acc, p) => acc + p.amount, 0);

  // Monthly Revenue (Current Month)
  const currentMonth = new Date().toISOString().substring(0, 7); // "YYYY-MM"
  const monthlyPayments = payments.filter(
    (p) => p.paymentDate.startsWith(currentMonth) && p.status === 'paid'
  );
  const monthlyRevenue = monthlyPayments.reduce((acc, p) => acc + p.amount, 0);

  // Today's Attendance count
  const todayCheckIns = attendance.filter((a) => a.date === todayStr);
  const todayAttendanceCount = todayCheckIns.length;

  // Get active members check-ins for logs
  const todayAttendanceLogs = [...todayCheckIns].reverse().slice(0, 5);

  // Get top members with due dates soon
  const urgentDueList = members
    .filter((m) => new Date(m.feeDueDate).getTime() <= new Date(todayStr).getTime() + (7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(a.feeDueDate).getTime() - new Date(b.feeDueDate).getTime())
    .slice(0, 5);

  // Quick Stats config
  const statCards = [
    {
      id: 'total',
      title: 'Total Members',
      value: totalMembers,
      icon: Users,
      bgColor: 'bg-zinc-900',
      textColor: 'text-zinc-400',
      accentColor: 'border-zinc-800',
      onClick: () => onNavigate('members'),
    },
    {
      id: 'active',
      title: 'Active Members',
      value: activeMembers,
      icon: UserCheck,
      bgColor: 'bg-emerald-950/20',
      textColor: 'text-emerald-400',
      accentColor: 'border-emerald-900/30',
      onClick: () => onNavigate('members'),
    },
    {
      id: 'expired',
      title: 'Expired Plans',
      value: expiredMembers,
      icon: UserX,
      bgColor: 'bg-red-950/20',
      textColor: 'text-red-400',
      accentColor: 'border-red-900/30',
      onClick: () => onNavigate('members'),
    },
    {
      id: 'due',
      title: 'Fee Dues Soon',
      value: feeDueMembers,
      icon: AlertCircle,
      bgColor: 'bg-amber-950/20',
      textColor: 'text-amber-400',
      accentColor: 'border-amber-900/30',
      onClick: () => onNavigate('fees'),
    },
    {
      id: 'today-coll',
      title: "Today's Collection",
      value: `₹${todayCollection}`,
      icon: IndianRupee,
      bgColor: 'bg-zinc-900',
      textColor: 'text-amber-500',
      accentColor: 'border-zinc-800',
      onClick: () => onNavigate('fees'),
    },
    {
      id: 'monthly-rev',
      title: 'Monthly Revenue',
      value: `₹${monthlyRevenue}`,
      icon: TrendingUp,
      bgColor: 'bg-zinc-900',
      textColor: 'text-amber-500',
      accentColor: 'border-zinc-800',
      onClick: () => onNavigate('reports'),
    },
    {
      id: 'attendance',
      title: "Today's Attendance",
      value: `${todayAttendanceCount} Active`,
      icon: Flame,
      bgColor: 'bg-zinc-900',
      textColor: 'text-amber-500',
      accentColor: 'border-zinc-800',
      onClick: () => onNavigate('attendance'),
    },
  ];

  // Helper to generate mini charts path for dynamic visual appeal
  const getMiniSparkline = (data: number[]) => {
    if (data.length === 0) return '';
    const max = Math.max(...data, 100);
    const min = Math.min(...data, 0);
    const range = max - min;
    const height = 40;
    const width = 120;
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height + 2;
      return `${x},${y}`;
    }).join(' ');
    return points;
  };

  // Pre-calculate last 7 days revenue for sparkline visual
  const last7DaysRevenue = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().split('T')[0];
    return payments
      .filter((p) => p.paymentDate === dStr && p.status === 'paid')
      .reduce((acc, p) => acc + p.amount, 0);
  });

  return (
    <div className="space-y-6" id="admin-dashboard-container">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-zinc-950 to-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="z-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
            Welcome back, <span className="text-amber-500 font-extrabold">Gym Owner</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Here is your gym's pulse and metrics for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3 z-10">
          <button
            onClick={() => onNavigate('attendance')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-95"
            id="quick-check-in-btn"
          >
            Check-In Member
          </button>
          <button
            onClick={() => onNavigate('members')}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg text-sm border border-zinc-700 transition-all duration-200 active:scale-95"
            id="quick-add-member-btn"
          >
            + Add Member
          </button>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={card.onClick}
              className={`p-5 rounded-2xl border ${card.accentColor} ${card.bgColor} cursor-pointer hover:border-amber-500/40 hover:translate-y-[-2px] transition-all duration-300 shadow-md group relative overflow-hidden`}
              id={`stat-card-${card.id}`}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-300"></div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <Icon className={`w-5 h-5 ${card.textColor} transition-transform duration-300 group-hover:scale-110`} />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className={`text-xl md:text-2xl font-black ${card.textColor}`}>
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Action centers */}
        <div className="lg:col-span-8 space-y-6">
          {/* Revenue Sparkline Visual Card */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Revenue Stream Trend</h3>
                <p className="text-zinc-500 text-xs mt-0.5">Daily income capture over the last 7 days</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.4% this week</span>
              </div>
            </div>
            
            {/* Custom SVG line chart */}
            <div className="flex items-center justify-between gap-6 h-36">
              <div className="flex-1 h-28 relative">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="10" x2="100%" y2="10" stroke="#27272a" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="50" x2="100%" y2="50" stroke="#27272a" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="90" x2="100%" y2="90" stroke="#27272a" strokeWidth="1" strokeDasharray="4" />
                  
                  {/* Chart Line Path */}
                  <polyline
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={getMiniSparkline(last7DaysRevenue)}
                    className="w-full h-full"
                    style={{ transform: 'scale(5, 1.8)', transformOrigin: 'top left' }} // Responsive scale projection
                  />
                </svg>
              </div>
              
              <div className="w-28 flex flex-col justify-between text-right border-l border-zinc-800 pl-4 h-24">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Weekly peak</span>
                  <p className="text-white text-lg font-black">₹{Math.max(...last7DaysRevenue, 50)}</p>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Avg Daily</span>
                  <p className="text-amber-500 text-sm font-bold">
                    ₹{Math.round(last7DaysRevenue.reduce((a, b) => a + b, 0) / 7)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-zinc-500 mt-2">
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return <div key={i}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>;
              })}
            </div>
          </div>

          {/* Quick Member search & lookup */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Quick Member Profile Lookup</h3>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4.5 h-4.5" />
              <input
                type="text"
                placeholder="Search member by name or mobile number..."
                onClick={() => onNavigate('members')}
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 cursor-pointer focus:outline-none focus:border-amber-500/60 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
              {members.slice(0, 4).map((member) => (
                <div
                  key={member.id}
                  onClick={() => onSelectMember(member.id)}
                  className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center cursor-pointer hover:border-amber-500/40 hover:bg-zinc-900/60 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full mx-auto bg-gradient-to-tr from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate">{member.name}</h4>
                  <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1.5 uppercase ${member.status === 'active' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' : 'bg-red-950/40 text-red-400 border border-red-900/40'}`}>
                    {member.status}
                  </span>
                </div>
              ))}
              <div
                onClick={() => onNavigate('members')}
                className="p-3 bg-zinc-900/40 border border-zinc-800 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500 hover:text-amber-500 text-zinc-500 transition-colors"
              >
                <span className="text-xs font-semibold">+ View All</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Action trackers */}
        <div className="lg:col-span-4 space-y-6">
          {/* Urgent Fee Reminders */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white">Upcoming Fee Dues</h3>
              <button
                onClick={() => onNavigate('fees')}
                className="text-amber-500 text-xs font-bold flex items-center gap-0.5 hover:underline"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-3 flex-1 overflow-y-auto max-h-56 pr-1">
              {urgentDueList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center text-zinc-600">
                  <AlertCircle className="w-8 h-8 stroke-1 mb-2" />
                  <p className="text-xs">No pending fee dues soon!</p>
                </div>
              ) : (
                urgentDueList.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onSelectMember(m.id)}
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-amber-500/30 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{m.name}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Due: {m.feeDueDate}</p>
                    </div>
                    <span className="text-xs font-extrabold text-amber-500">
                      ₹{m.feeAmount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's Attendance Feed */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white">Recent Attendance Logs</h3>
              <button
                onClick={() => onNavigate('attendance')}
                className="text-amber-500 text-xs font-bold flex items-center gap-0.5 hover:underline"
              >
                <span>Logs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-56 pr-1">
              {todayAttendanceLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center text-zinc-600">
                  <Calendar className="w-8 h-8 stroke-1 mb-2" />
                  <p className="text-xs">No check-ins today yet!</p>
                </div>
              ) : (
                todayAttendanceLogs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => onSelectMember(log.memberId)}
                    className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl hover:border-amber-500/20 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{log.memberName}</h4>
                        <p className="text-[10px] text-zinc-500">
                          Checked-In at {log.checkInTime}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 uppercase">
                      Desk
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
