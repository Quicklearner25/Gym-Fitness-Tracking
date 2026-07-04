import React, { useState } from 'react';
import { Member, Payment, Attendance, GymAnnouncement, Plan, GymConfig } from '../types';
import { Award, Calendar, QrCode, Bell, Clock, Printer, CreditCard, Upload, Heart, Sparkles, User, LogOut } from 'lucide-react';
import { printReceipt } from '../utils/helpers';

interface MemberPortalProps {
  member: Member;
  payments: Payment[];
  attendance: Attendance[];
  notifications: GymAnnouncement[];
  plans: Plan[];
  gymConfig: GymConfig;
  onUpdateMemberPhoto: (memberId: string, photoBase64: string) => void;
  onLogout: () => void;
}

export default function MemberPortal({
  member,
  payments,
  attendance,
  notifications,
  plans,
  gymConfig,
  onUpdateMemberPhoto,
  onLogout,
}: MemberPortalProps) {
  const [copied, setCopied] = useState(false);
  const plan = plans.find((p) => p.id === member.planId);

  // Filter personal payments
  const myPayments = payments.filter((p) => p.memberId === member.id).reverse();

  // Filter personal attendance logs
  const myAttendance = attendance.filter((a) => a.memberId === member.id).reverse();

  // Filter personal notifications (general ones or targeted to this member ID)
  const myNotifications = notifications.filter(
    (n) => !n.targetMemberId || n.targetMemberId === member.id
  ).reverse();

  // Calculate membership active status and days left
  const today = new Date();
  const due = new Date(member.feeDueDate);
  const timeDiff = due.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // Base64 file reader for photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateMemberPhoto(member.id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(member.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="member-portal-container">
      {/* Portal Top Bar */}
      <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">FitTrack Portal</span>
            <h2 className="text-lg font-black text-white">Hello, <span className="text-amber-500">{member.name}</span>!</h2>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-3.5 py-1.5 bg-zinc-900 hover:bg-red-950/20 text-zinc-400 hover:text-red-400 rounded-xl text-xs font-bold border border-zinc-800 hover:border-red-900/30 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log Out
        </button>
      </div>

      {/* Main split dashboard panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left pane: Membership Gold VIP Pass Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            {/* Holographic background sparkles */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-700"></div>
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div>
                <span className="text-sm font-black text-amber-500 tracking-wider">FIT<span className="text-white">TRACK</span></span>
                <p className="text-[9px] text-zinc-500 tracking-widest uppercase mt-0.5">{gymConfig.name}</p>
              </div>
              <span className="text-[9px] font-black tracking-widest bg-amber-500 text-black px-2.5 py-0.5 rounded-full">VIP MEMBER</span>
            </div>

            {/* Profile image with camera photo upload trigger overlay */}
            <div className="my-6 flex flex-col items-center">
              <div className="relative w-24 h-24 rounded-2xl bg-zinc-900 border-2 border-amber-500 shadow-xl overflow-hidden group/photo flex items-center justify-center text-3xl font-extrabold text-amber-500">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  member.name.charAt(0)
                )}
                
                {/* Overlay upload button */}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex flex-col items-center justify-center text-[10px] text-white font-bold cursor-pointer transition-all duration-300">
                  <Upload className="w-4 h-4 text-amber-500 mb-1" />
                  <span>Update Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Sleek Barcode Graphic */}
              <div className="mt-5 p-3 bg-white rounded-xl shadow-xl flex flex-col items-center justify-center">
                <div className="flex gap-[2px] items-stretch h-12 w-32 bg-white">
                  <div className="w-[2px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[3px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[2px] bg-zinc-950"></div>
                  <div className="w-[3px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[3px] bg-zinc-950"></div>
                  <div className="w-[2px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[3px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[2px] bg-zinc-950"></div>
                  <div className="w-[2px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[3px] bg-zinc-950"></div>
                </div>
                <span className="text-[8px] font-mono font-black text-zinc-800 tracking-[0.25em] mt-1.5">
                  {member.id.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Member Card Details */}
            <div className="space-y-2 border-t border-zinc-800 pt-4 text-center">
              <h4 className="text-base font-black text-white tracking-wide uppercase">{member.name}</h4>
              <div className="flex justify-center items-center gap-1.5 font-mono text-zinc-400 text-xs cursor-pointer hover:text-white" onClick={handleCopyId}>
                <span>ID: {member.id}</span>
                <span className="text-[9px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 uppercase font-black tracking-widest">
                  {copied ? 'Copied' : 'Copy'}
                </span>
              </div>
              <p className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest mt-2 animate-pulse">Verify ID at Reception</p>
            </div>
          </div>

          {/* Plan Status Countdown meter */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-amber-500" />
              Membership Plan Details
            </h3>

            <div className="space-y-4">
              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Tier level</span>
                  <p className="text-sm font-extrabold text-white mt-0.5">{plan?.name || 'Custom Package'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Expiration Date</span>
                  <p className="text-sm font-extrabold text-amber-500 mt-0.5">{member.feeDueDate}</p>
                </div>
              </div>

              {/* Status block */}
              <div className="flex items-center gap-3">
                <div className={`p-4 rounded-xl border flex-1 text-center ${daysLeft >= 0 ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-red-950/20 border-red-900/30'}`}>
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Days Remaining</span>
                  <p className={`text-xl font-black mt-1 ${daysLeft >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {daysLeft >= 0 ? `${daysLeft} Days` : 'Expired'}
                  </p>
                </div>

                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex-1 text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Renewal Fee</span>
                  <p className="text-xl font-black text-white mt-1">₹{member.feeAmount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right pane: Attendance streaking, announcements, and receipt logs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gym announcements feed */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1.5">
              <Bell className="w-4.5 h-4.5 text-amber-500" />
              Gym Announcements & Bulletins ({myNotifications.length})
            </h3>

            <div className="space-y-3.5 max-h-52 overflow-y-auto pr-1">
              {myNotifications.length === 0 ? (
                <div className="p-4 bg-zinc-900/40 text-center text-zinc-500 text-xs rounded-xl border border-zinc-900">
                  No announcements today. Have a productive workout!
                </div>
              ) : (
                myNotifications.map((n) => (
                  <div key={n.id} className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[9px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        {n.type}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">{n.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase">{n.title}</h4>
                    <p className="text-zinc-400 text-xs mt-1 leading-relaxed font-sans">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Member Check-In History log */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1.5">
              <Clock className="w-4.5 h-4.5 text-amber-500" />
              My Check-In History ({myAttendance.length} visits)
            </h3>

            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {myAttendance.length === 0 ? (
                <div className="p-4 bg-zinc-900/40 text-center text-zinc-500 text-xs rounded-xl border border-zinc-900">
                  You haven't logged any workouts yet. Hold your VIP QR card to the scanner counter!
                </div>
              ) : (
                myAttendance.map((log) => (
                  <div key={log.id} className="p-3 bg-zinc-900/60 border border-zinc-900 rounded-xl flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-white font-bold">{log.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-400 font-mono">Checked In at {log.checkInTime}</span>
                      <span className="text-[9px] bg-zinc-800 text-zinc-500 font-bold uppercase px-1.5 py-0.5 rounded border border-zinc-800">
                        {log.method}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Member Receipts Ledger */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1.5">
              <Printer className="w-4.5 h-4.5 text-amber-500" />
              My Payment Invoice History
            </h3>

            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {myPayments.length === 0 ? (
                <div className="p-4 bg-zinc-900/40 text-center text-zinc-500 text-xs rounded-xl border border-zinc-900">
                  No receipts on file yet.
                </div>
              ) : (
                myPayments.map((p) => (
                  <div key={p.id} className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{p.planName}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Date Paid: {p.paymentDate} • Receipt: {p.receiptNumber}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-amber-500 font-extrabold font-mono">₹{p.amount}</span>
                      <button
                        onClick={() => printReceipt(p, gymConfig)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 hover:border-amber-500/20 transition-all flex items-center gap-1 hover:text-white"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print
                      </button>
                    </div>
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
