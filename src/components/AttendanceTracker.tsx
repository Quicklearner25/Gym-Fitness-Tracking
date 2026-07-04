import React, { useState } from 'react';
import { Member, Attendance } from '../types';
import { Scan, QrCode, Search, CheckCircle, Clock, Calendar, AlertCircle, Sparkles, Filter } from 'lucide-react';

interface AttendanceTrackerProps {
  members: Member[];
  attendance: Attendance[];
  onCheckIn: (attendanceRecord: Attendance) => void;
}

export default function AttendanceTracker({
  members,
  attendance,
  onCheckIn,
}: AttendanceTrackerProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'history'>('manual');
  const [manualSearch, setManualSearch] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Members who haven't checked in today yet
  const checkedInTodayIds = attendance
    .filter((a) => a.date === todayStr)
    .map((a) => a.memberId);

  const eligibleForCheckIn = members.filter(
    (m) => !checkedInTodayIds.includes(m.id) && m.status === 'active'
  );

  const filteredEligible = eligibleForCheckIn.filter((m) =>
    m.name.toLowerCase().includes(manualSearch.toLowerCase()) || m.mobile.includes(manualSearch)
  );

  // Stats Calculations
  const todayCheckInCount = attendance.filter((a) => a.date === todayStr).length;
  const activeMembersCount = members.filter((m) => m.status === 'active').length;
  const attendanceRate = activeMembersCount > 0 ? Math.round((todayCheckInCount / activeMembersCount) * 100) : 0;

  // Handle actual Check-In execution
  const executeCheckIn = (member: Member) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    // Check if already checked in to prevent duplicates
    if (attendance.some((a) => a.date === todayStr && a.memberId === member.id)) {
      alert(`${member.name} is already checked in for today!`);
      return;
    }

    const newCheckIn: Attendance = {
      id: `att_${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      date: todayStr,
      checkInTime: timeNow,
      method: 'manual',
    };

    onCheckIn(newCheckIn);
  };

  return (
    <div className="space-y-6" id="attendance-tracker-container">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
            Attendance Logging
          </h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            Log daily member check-ins, view digital scan codes, and track check-in frequency.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${activeTab === 'manual' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'}`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Manual Check-In
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${activeTab === 'history' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'}`}
          >
            <Clock className="w-3.5 h-3.5" />
            Recent Logs
          </button>
        </div>
      </div>

      {/* Attendance summary gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Today's Check-Ins</span>
          <p className="text-2xl font-black text-white mt-1">{todayCheckInCount}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Active Members Rostered</span>
          <p className="text-2xl font-black text-white mt-1">{activeMembersCount}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Daily Turnout Rate</span>
          <p className="text-2xl font-black text-amber-500 mt-1">{attendanceRate}%</p>
        </div>
      </div>

      {/* Content renders based on tab */}
      {activeTab === 'manual' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4" id="manual-check-in-tab">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-white">Manual Counter Check-In</h3>
            <span className="text-xs text-zinc-500 font-bold bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
              Eligible members: {filteredEligible.length}
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Filter list by name or phone..."
              value={manualSearch}
              onChange={(e) => setManualSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="border border-zinc-900 rounded-xl overflow-hidden max-h-[350px] overflow-y-auto">
            {filteredEligible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-600 bg-zinc-900/20">
                <AlertCircle className="w-8 h-8 stroke-1 mb-2" />
                <p className="text-xs font-semibold">No checked-out active members found</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-900">
                {filteredEligible.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-zinc-950 hover:bg-zinc-900/40 flex items-center justify-between gap-4 transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{m.name}</h4>
                      <p className="text-[10px] text-zinc-500">Ph: {m.mobile} • Plan: {m.planId.replace('plan_', '')}</p>
                    </div>
                    <button
                      onClick={() => executeCheckIn(m)}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-amber-500 border border-zinc-800 hover:border-amber-500 hover:text-black text-zinc-300 font-extrabold rounded-lg text-xs transition-all duration-200"
                    >
                      Check-In
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl" id="attendance-history-tab">
          <div className="p-5 border-b border-zinc-900 bg-zinc-950 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500">
              Daily Check-In Feed Logs
            </h3>
            <span className="text-xs text-zinc-500 font-semibold">{attendance.length} Total Logs</span>
          </div>

          {attendance.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-600">
              <Calendar className="w-12 h-12 stroke-1 mb-3 text-zinc-500" />
              <p className="text-sm font-semibold">No attendance logged yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-bold uppercase">
                    <th className="p-4">Date</th>
                    <th className="p-4">Time Checked In</th>
                    <th className="p-4">Member Name</th>
                    <th className="p-4">Member ID</th>
                    <th className="p-4 text-center">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-sm text-zinc-300">
                  {[...attendance].reverse().map((att) => (
                    <tr key={att.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="p-4 font-sans text-xs font-bold">{att.date}</td>
                      <td className="p-4 font-mono text-xs">{att.checkInTime}</td>
                      <td className="p-4 font-bold text-white">{att.memberName}</td>
                      <td className="p-4 font-mono text-zinc-500 text-xs">{att.memberId}</td>
                      <td className="p-4 text-center">
                        <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-zinc-850 text-zinc-400 border border-zinc-800">
                          Desk Log
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
