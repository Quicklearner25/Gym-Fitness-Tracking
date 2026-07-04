import React, { useState } from 'react';
import { Member, Payment, Plan, GymConfig } from '../types';
import { BadgeDollarSign, MessageSquare, Receipt, CheckCircle, Search, Calendar, Landmark, Printer, Check, UserCheck, Smartphone } from 'lucide-react';
import { generateWhatsAppLink, printReceipt } from '../utils/helpers';

interface FeeManagementProps {
  members: Member[];
  payments: Payment[];
  plans: Plan[];
  gymConfig: GymConfig;
  onRecordPayment: (payment: Payment) => void;
  onRenewMember: (memberId: string, planId: string, paidAmount: number, nextDueDate: string) => void;
}

export default function FeeManagement({
  members,
  payments,
  plans,
  gymConfig,
  onRecordPayment,
  onRenewMember,
}: FeeManagementProps) {
  const [activeSubTab, setActiveSubTab] = useState<'due' | 'history'>('due');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Renewal modal states
  const [renewingMember, setRenewingMember] = useState<Member | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [customFee, setCustomFee] = useState(0);
  const [customDueDate, setCustomDueDate] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Members with fee due (expired or within next 7 days)
  const dueMembers = members.filter((m) => {
    const dueTime = new Date(m.feeDueDate).getTime();
    const todayTime = new Date(todayStr).getTime();
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.mobile.includes(searchTerm);
    // Overdue or due in the next 7 days
    const isDue = dueTime <= todayTime + (7 * 24 * 60 * 60 * 1000);
    return isDue && matchesSearch;
  });

  // Filter payment logs
  const filteredPayments = [...payments]
    .filter((p) => p.memberName.toLowerCase().includes(searchTerm.toLowerCase()) || p.memberId.includes(searchTerm))
    .reverse();

  // Handle opening renewal form
  const handleOpenRenew = (member: Member) => {
    setRenewingMember(member);
    const chosenPlanId = member.planId || plans[0]?.id || '';
    setSelectedPlanId(chosenPlanId);
    
    const associatedPlan = plans.find((p) => p.id === chosenPlanId);
    const amount = associatedPlan ? associatedPlan.feeAmount : member.feeAmount;
    setCustomFee(amount);
    
    // Calculate new due date based on chosen plan
    const durationMonths = associatedPlan ? associatedPlan.durationMonths : 1;
    const baseDate = new Date(member.feeDueDate).getTime() < new Date(todayStr).getTime() ? new Date(todayStr) : new Date(member.feeDueDate);
    baseDate.setMonth(baseDate.getMonth() + durationMonths);
    setCustomDueDate(baseDate.toISOString().split('T')[0]);
  };

  const handleRenewPlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const selectedPlan = plans.find((p) => p.id === planId);
    if (selectedPlan && renewingMember) {
      setCustomFee(selectedPlan.feeAmount);
      // Recalculate based on joining/expiration dates
      const baseDate = new Date(renewingMember.feeDueDate).getTime() < new Date(todayStr).getTime() ? new Date(todayStr) : new Date(renewingMember.feeDueDate);
      baseDate.setMonth(baseDate.getMonth() + selectedPlan.durationMonths);
      setCustomDueDate(baseDate.toISOString().split('T')[0]);
    }
  };

  const handleRenewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewingMember) return;

    const chosenPlan = plans.find((p) => p.id === selectedPlanId);
    const planName = chosenPlan ? chosenPlan.name : 'Custom Plan';

    // Record the payment in history log
    const receiptNum = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      memberId: renewingMember.id,
      memberName: renewingMember.name,
      planName: planName,
      amount: customFee,
      paymentDate: todayStr,
      status: 'paid',
      dueDate: customDueDate,
      receiptNumber: receiptNum,
    };

    onRecordPayment(newPayment);
    onRenewMember(renewingMember.id, selectedPlanId, customFee, customDueDate);
    
    // Auto trigger receipt printing
    if (confirm(`Renewal complete! Would you like to generate and print the payment receipt for ${renewingMember.name}?`)) {
      printReceipt(newPayment, gymConfig);
    }
    
    setRenewingMember(null);
  };

  return (
    <div className="space-y-6" id="fee-management-container">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
            Fee & billing center
          </h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            Track dues, collect subscription fees, review transactions, and print invoice vouchers.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl self-start">
          <button
            onClick={() => {
              setActiveSubTab('due');
              setSearchTerm('');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'due' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'}`}
          >
            Outstanding Dues
          </button>
          <button
            onClick={() => {
              setActiveSubTab('history');
              setSearchTerm('');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'history' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'}`}
          >
            Payment History Ledger
          </button>
        </div>
      </div>

      {/* Subtab Search Bar */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-xl">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4.5 h-4.5" />
          <input
            type="text"
            placeholder={activeSubTab === 'due' ? 'Search due members by name or mobile...' : 'Search past records by member name or ID...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Renders Tab content */}
      {activeSubTab === 'due' ? (
        <div className="space-y-4" id="due-members-section">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500">
            Dues Pending Renewal ({dueMembers.length})
          </h3>

          {dueMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-600 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <CheckCircle className="w-12 h-12 stroke-1 mb-3 text-emerald-500" />
              <p className="text-sm font-semibold">Perfect Balance!</p>
              <p className="text-xs mt-1">All members are currently active with up-to-date fees.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dueMembers.map((member) => {
                const plan = plans.find((p) => p.id === member.planId);
                const isOverdue = new Date(member.feeDueDate).getTime() < new Date(todayStr).getTime();
                
                // Construct prefilled WhatsApp text link
                const whatsappUrl = generateWhatsAppLink(
                  member.mobile,
                  member.name,
                  member.feeAmount,
                  member.feeDueDate,
                  gymConfig.name,
                  gymConfig.whatsappTemplate
                );

                return (
                  <div
                    key={member.id}
                    className="bg-zinc-950 border border-zinc-800 hover:border-amber-500/30 rounded-xl p-5 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <h4 className="font-extrabold text-white text-sm">{member.name}</h4>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Ph: {member.mobile}</p>
                        </div>
                        <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${isOverdue ? 'bg-red-950/40 text-red-400 border border-red-900/40' : 'bg-amber-950/40 text-amber-400 border border-amber-900/40'}`}>
                          {isOverdue ? 'Overdue' : 'Due Soon'}
                        </span>
                      </div>

                      <div className="border-b border-zinc-900 my-3"></div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Plan Assigned:</span>
                          <span className="text-zinc-300 font-bold">{plan?.name || 'Custom'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Amount Pending:</span>
                          <span className="text-amber-500 font-bold">₹{member.feeAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Due Expiration:</span>
                          <span className={`font-bold ${isOverdue ? 'text-red-400' : 'text-zinc-300'}`}>{member.feeDueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-5">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-950/30 text-emerald-400 border border-emerald-900/40 hover:bg-emerald-950/60 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors text-center"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Reminder
                      </a>
                      <button
                        onClick={() => handleOpenRenew(member)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-xs font-black flex items-center justify-center gap-1 transition-all active:scale-95"
                      >
                        <BadgeDollarSign className="w-3.5 h-3.5" />
                        Settle Paid
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4" id="payments-history-section">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500">
            Payment Audit Trail Ledger
          </h3>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
            {filteredPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-600">
                <Receipt className="w-12 h-12 stroke-1 mb-3 text-zinc-500" />
                <p className="text-sm font-semibold">No transactions recorded</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-bold uppercase">
                      <th className="p-4">Receipt No</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Member Name</th>
                      <th className="p-4">Plan Settled</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">New Expiry</th>
                      <th className="p-4 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-sm">
                    {filteredPayments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="p-4 font-mono text-zinc-400 text-xs">{pay.receiptNumber}</td>
                        <td className="p-4 text-zinc-300 font-sans">{pay.paymentDate}</td>
                        <td className="p-4 font-bold text-white">{pay.memberName}</td>
                        <td className="p-4 text-zinc-400 text-xs font-bold">{pay.planName}</td>
                        <td className="p-4 text-amber-500 font-extrabold">₹{pay.amount}</td>
                        <td className="p-4 text-zinc-400 text-xs">{pay.dueDate}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => printReceipt(pay, gymConfig)}
                            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                            title="Generate Receipt PDF"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-500" />
                            Print
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Renewal Modal form */}
      {renewingMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-amber-500" />
                Settle Subscription Renewal
              </h3>
              <button
                onClick={() => setRenewingMember(null)}
                className="text-zinc-500 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRenewSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Member Name</span>
                <p className="text-sm font-extrabold text-white mt-0.5">{renewingMember.name}</p>
                <p className="text-xs text-zinc-400 mt-1">Mobile: {renewingMember.mobile}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Choose Renewal Plan</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => handleRenewPlanChange(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - ₹{p.feeAmount} ({p.durationMonths}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Amount Paid (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={customFee}
                    onChange={(e) => setCustomFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">New Fee Due Date</label>
                  <input
                    type="date"
                    required
                    value={customDueDate}
                    onChange={(e) => setCustomDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-4 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRenewingMember(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-lg text-sm border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold rounded-lg text-sm flex items-center gap-1 hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                >
                  <Check className="w-4 h-4" />
                  Settle Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
