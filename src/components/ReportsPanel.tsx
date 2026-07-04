import React from 'react';
import { Member, Payment, Attendance, Plan } from '../types';
import { BarChart3, Download, Eye, TrendingUp, Calendar, FileJson, Users, ShieldCheck, Flame } from 'lucide-react';
import { exportToCSV } from '../utils/helpers';

interface ReportsPanelProps {
  members: Member[];
  payments: Payment[];
  attendance: Attendance[];
  plans: Plan[];
}

export default function ReportsPanel({
  members,
  payments,
  attendance,
  plans,
}: ReportsPanelProps) {
  // 1. Calculations: Plan Popularity
  const planDistribution = plans.map((p) => {
    const count = members.filter((m) => m.planId === p.id).length;
    return { name: p.name, count };
  });

  // 2. Calculations: Gender Distribution
  const maleCount = members.filter((m) => m.gender === 'Male').length;
  const femaleCount = members.filter((m) => m.gender === 'Female').length;
  const otherCount = members.filter((m) => m.gender === 'Other').length;

  // 3. Revenue over past 4 months (Monthly Revenue report)
  const monthlyRevenueReport = () => {
    const report: { month: string; total: number }[] = [];
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const currentYear = new Date().getFullYear();

    // Past 4 months chronological tracking
    for (let i = 3; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mStr = String(d.getMonth() + 1).padStart(2, '0');
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      const filterMonthStr = `${currentYear}-${mStr}`;
      const total = payments
        .filter((p) => p.paymentDate.startsWith(filterMonthStr) && p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);

      report.push({ month: label, total });
    }
    return report;
  };

  const revenueHistory = monthlyRevenueReport();

  // Export handlers
  const handleExportMembers = () => {
    const formatted = members.map(m => ({
      id: m.id,
      name: m.name,
      mobile: m.mobile,
      gender: m.gender,
      age: m.age,
      address: m.address,
      joining_date: m.joiningDate,
      plan_id: m.planId,
      fee_amount: m.feeAmount,
      fee_due_date: m.feeDueDate,
      status: m.status
    }));
    exportToCSV(formatted, 'fittrack_members_report', [
      'ID', 'Name', 'Mobile', 'Gender', 'Age', 'Address', 'Joining Date', 'Plan ID', 'Fee Amount', 'Fee Due Date', 'Status'
    ]);
  };

  const handleExportPayments = () => {
    const formatted = payments.map(p => ({
      id: p.id,
      receipt_number: p.receiptNumber,
      member_id: p.memberId,
      member_name: p.memberName,
      plan_name: p.planName,
      amount: p.amount,
      payment_date: p.paymentDate,
      status: p.status,
      due_date: p.dueDate
    }));
    exportToCSV(formatted, 'fittrack_payments_report', [
      'ID', 'Receipt Number', 'Member ID', 'Member Name', 'Plan Name', 'Amount', 'Payment Date', 'Status', 'Due Date'
    ]);
  };

  const handleExportAttendance = () => {
    const formatted = attendance.map(a => ({
      id: a.id,
      member_id: a.memberId,
      member_name: a.memberName,
      date: a.date,
      check_in_time: a.checkInTime,
      method: a.method
    }));
    exportToCSV(formatted, 'fittrack_attendance_report', [
      'ID', 'Member ID', 'Member Name', 'Date', 'Check-In Time', 'Method'
    ]);
  };

  return (
    <div className="space-y-6" id="reports-panel-container">
      {/* Page Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
          Business Reports & Analytics
        </h2>
        <p className="text-zinc-500 text-sm mt-0.5">
          Auditing panels, demographic analysis, plan distributions, and spreadsheet export utilities.
        </p>
      </div>

      {/* Grid of charts & summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left pane: CSV downloads */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              Download Spreadsheet Reports
            </h3>
            <p className="text-zinc-500 text-xs leading-relaxed mb-6">
              Extract real-time databases into structured CSV schemas compatible with Google Sheets, Microsoft Excel, and CRM databases.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleExportMembers}
                className="w-full px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/20 text-white rounded-xl text-xs font-bold flex items-center justify-between transition-all active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-500" />
                  Membership Directory Sheet
                </span>
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">CSV</span>
              </button>

              <button
                onClick={handleExportPayments}
                className="w-full px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/20 text-white rounded-xl text-xs font-bold flex items-center justify-between transition-all active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-500" />
                  Transaction Receipt Ledger
                </span>
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">CSV</span>
              </button>

              <button
                onClick={handleExportAttendance}
                className="w-full px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/20 text-white rounded-xl text-xs font-bold flex items-center justify-between transition-all active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Member Check-In Registers
                </span>
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">CSV</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/50 border border-zinc-900 rounded-xl text-xs text-zinc-500 leading-relaxed flex gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              All reports are computed inside the secure client sandbox with local-cache persistence, meeting general ISO privacy guidelines.
            </span>
          </div>
        </div>

        {/* Right pane: Visual bar charts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Revenue distribution bar projection */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-6 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Overtime Revenue Chart
            </h3>

            {/* Custom SVG/Bar chart representation */}
            <div className="h-44 flex items-end justify-around gap-4 border-b border-zinc-800 pb-2">
              {revenueHistory.map((data, idx) => {
                const max = Math.max(...revenueHistory.map((h) => h.total), 200);
                const pct = max > 0 ? (data.total / max) * 100 : 0;
                
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 max-w-[80px] group">
                    <span className="text-[10px] font-extrabold text-amber-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{data.total}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-zinc-900 to-amber-500 hover:to-amber-400 rounded-t-lg transition-all duration-500 ease-out shadow-lg shadow-amber-500/10"
                      style={{ height: `${Math.max(pct, 5)}%` }}
                    ></div>
                    <span className="text-[10px] font-bold text-zinc-500 mt-2 font-mono uppercase tracking-wider truncate w-full text-center">
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plan distribution & Demographics info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Membership plans distribution */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" />
                Plan popularity roster
              </h3>

              <div className="space-y-3">
                {planDistribution.map((dist, i) => {
                  const maxCount = Math.max(...planDistribution.map((d) => d.count), 1);
                  const widthPct = (dist.count / maxCount) * 100;
                  
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-white">{dist.name}</span>
                        <span className="text-zinc-400 font-mono">{dist.count} member(s)</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-900">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${widthPct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Demographics distribution */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Gender Demographics
                </h3>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Male Roster</span>
                    <span className="text-white font-mono">{maleCount} ({members.length > 0 ? Math.round((maleCount / members.length) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Female Roster</span>
                    <span className="text-white font-mono">{femaleCount} ({members.length > 0 ? Math.round((femaleCount / members.length) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Other / Unspecified</span>
                    <span className="text-white font-mono">{otherCount} ({members.length > 0 ? Math.round((otherCount / members.length) * 100) : 0}%)</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-4 mt-4">
                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <span>Total Members:</span>
                  <span className="text-amber-500">{members.length} Active + Expired</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
