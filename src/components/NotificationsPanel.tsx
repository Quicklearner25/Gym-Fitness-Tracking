import React, { useState } from 'react';
import { GymAnnouncement, Member } from '../types';
import { Bell, Megaphone, Gift, BadgePercent, AlertTriangle, Plus, Check, Info, Trash2 } from 'lucide-react';

interface NotificationsPanelProps {
  notifications: GymAnnouncement[];
  members: Member[];
  onAddNotification: (notification: GymAnnouncement) => void;
  onDeleteNotification: (notifId: string) => void;
}

export default function NotificationsPanel({
  notifications,
  members,
  onAddNotification,
  onDeleteNotification,
}: NotificationsPanelProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'fee_due' | 'expiry' | 'announcement' | 'birthday' | 'promo'>('announcement');
  const [targetMemberId, setTargetMemberId] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      alert('Title and Message are required.');
      return;
    }

    const newNotif: GymAnnouncement = {
      id: `not_${Date.now()}`,
      title,
      message,
      date: new Date().toISOString().split('T')[0],
      type,
      targetMemberId: targetMemberId === 'all' ? undefined : targetMemberId,
    };

    onAddNotification(newNotif);
    setIsFormOpen(false);
    
    // Clear form
    setTitle('');
    setMessage('');
    setType('announcement');
    setTargetMemberId('all');
  };

  const getTypeStyle = (notifType: string) => {
    switch (notifType) {
      case 'announcement':
        return { bg: 'bg-zinc-900 border-zinc-800', text: 'text-white', badgeBg: 'bg-zinc-800 text-zinc-300', icon: Megaphone };
      case 'birthday':
        return { bg: 'bg-zinc-900 border-zinc-800', text: 'text-amber-500', badgeBg: 'bg-amber-500/10 text-amber-500', icon: Gift };
      case 'promo':
        return { bg: 'bg-amber-950/20 border-amber-900/30', text: 'text-amber-500', badgeBg: 'bg-amber-500/20 text-amber-400', icon: BadgePercent };
      case 'fee_due':
        return { bg: 'bg-red-950/20 border-red-900/30', text: 'text-red-400', badgeBg: 'bg-red-500/10 text-red-400', icon: AlertTriangle };
      default:
        return { bg: 'bg-zinc-900 border-zinc-800', text: 'text-zinc-400', badgeBg: 'bg-zinc-800 text-zinc-400', icon: Bell };
    }
  };

  return (
    <div className="space-y-6" id="notifications-panel-container">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
            Communications Center
          </h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            Broadcast member-wide circulars, promote campaigns, or schedule specialized alerts.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-amber-500/20 self-start"
          id="compose-notif-btn"
        >
          <Plus className="w-4.5 h-4.5" />
          Compose Alert
        </button>
      </div>

      {/* Notifications feed timeline layout */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500">
          Chronological Communications Timeline ({notifications.length})
        </h3>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-600">
            <Bell className="w-12 h-12 stroke-1 mb-3 text-zinc-500" />
            <p className="text-sm font-semibold">No notifications drafted yet</p>
          </div>
        ) : (
          <div className="relative border-l border-zinc-800 pl-6 ml-4 space-y-6">
            {[...notifications].reverse().map((notif) => {
              const style = getTypeStyle(notif.type);
              const Icon = style.icon;
              const targetMember = notif.targetMemberId ? members.find((m) => m.id === notif.targetMemberId) : null;

              return (
                <div key={notif.id} className="relative group">
                  {/* Timeline bullet */}
                  <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-zinc-950 border-2 border-amber-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  </div>

                  {/* Notification bubble */}
                  <div className={`p-5 rounded-2xl border ${style.bg} hover:border-amber-500/30 transition-all shadow-md`}>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${style.badgeBg} border border-amber-500/10 flex items-center gap-1`}>
                          <Icon className="w-3 h-3 shrink-0" />
                          {notif.type}
                        </span>
                        {targetMember ? (
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 font-bold px-2 py-0.5 rounded-full">
                            Target: {targetMember.name}
                          </span>
                        ) : (
                          <span className="text-[10px] bg-zinc-800/40 text-zinc-400 font-bold px-2 py-0.5 rounded-full border border-zinc-800">
                            Target: Everyone
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-500 font-semibold">{notif.date}</span>
                        <button
                          onClick={() => onDeleteNotification(notif.id)}
                          className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete Alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className={`font-extrabold text-sm ${style.text}`}>{notif.title}</h4>
                    <p className="text-zinc-300 text-xs mt-1.5 leading-relaxed font-sans">{notif.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Compose Notification form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-amber-500" />
                Draft Broadcast Message
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-500 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Alert Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Steam Room Repair Notice"
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Alert Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="promo">Promo Offer</option>
                    <option value="birthday">Birthday Wishes</option>
                    <option value="fee_due">Fee Due</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Target Audience</label>
                  <select
                    value={targetMemberId}
                    onChange={(e) => setTargetMemberId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                  >
                    <option value="all">Broadcast (Everyone)</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        Individual: {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Message Body *</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Draft your circular, discount code, or system announcement..."
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60 h-24 resize-none"
                />
              </div>

              <div className="border-t border-zinc-900 pt-4 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-lg text-sm border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold rounded-lg text-sm flex items-center gap-1 hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                >
                  <Check className="w-4 h-4" />
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
