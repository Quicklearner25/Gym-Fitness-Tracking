import React, { useState } from 'react';
import { Plan } from '../types';
import { Sparkles, Calendar, BadgeDollarSign, Plus, Check, Edit, Info, Trash2 } from 'lucide-react';

interface PlanManagementProps {
  plans: Plan[];
  onAddPlan: (plan: Plan) => void;
  onEditPlan: (plan: Plan) => void;
  onDeletePlan: (planId: string) => void;
}

export default function PlanManagement({
  plans,
  onAddPlan,
  onEditPlan,
  onDeletePlan,
}: PlanManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [durationMonths, setDurationMonths] = useState(1);
  const [feeAmount, setFeeAmount] = useState(50);
  const [description, setDescription] = useState('');

  const openForm = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setName(plan.name);
      setDurationMonths(plan.durationMonths);
      setFeeAmount(plan.feeAmount);
      setDescription(plan.description);
    } else {
      setEditingPlan(null);
      setName('');
      setDurationMonths(1);
      setFeeAmount(50);
      setDescription('');
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Plan Name is required.');
      return;
    }

    const planData: Plan = {
      id: editingPlan ? editingPlan.id : `plan_${Date.now()}`,
      name,
      durationMonths,
      feeAmount,
      description,
    };

    if (editingPlan) {
      onEditPlan(planData);
    } else {
      onAddPlan(planData);
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6" id="plan-management-container">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
            Membership Plans
          </h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            Configure default and custom gym pricing packages for members.
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-amber-500/20 self-start"
          id="create-custom-plan-btn"
        >
          <Plus className="w-4.5 h-4.5" />
          Create Custom Plan
        </button>
      </div>

      {/* Plans List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="plans-card-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-zinc-950 border-2 border-zinc-900 hover:border-amber-500/30 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group transition-all duration-300 hover:translate-y-[-2px]"
          >
            {/* Top design accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-800 via-amber-500/30 to-zinc-800"></div>
            
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-black uppercase text-amber-500 tracking-wider bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                  ★ {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'}
                </span>
                
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openForm(plan)}
                    className="p-1 text-zinc-500 hover:text-amber-500 transition-colors"
                    title="Edit Plan"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this plan?')) {
                        onDeletePlan(plan.id);
                      }
                    }}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-extrabold text-white mb-2">{plan.name}</h3>
              
              {/* Pricing */}
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-black text-white">₹{plan.feeAmount}</span>
                <span className="text-xs text-zinc-500">total cost</span>
              </div>

              {/* Divider */}
              <div className="border-b border-zinc-900 my-4"></div>

              {/* Features List / Description */}
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed flex items-start gap-1.5">
                <Info className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                <span>{plan.description || 'Access to all standard gym machines, locker facilities, and support.'}</span>
              </p>
            </div>

            {/* Simulated CTA button */}
            <div className="mt-auto">
              <div className="w-full text-center py-2 bg-zinc-900 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-800 group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-500 transition-all">
                Active Tier
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {editingPlan ? 'Modify Plan Settings' : 'Create Custom Plan'}
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
                <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Couples Platinum VIP"
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Duration (Months) *</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Fee Amount (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Access to gym floors + dry sauna + nutritional plan counseling..."
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
                  {editingPlan ? 'Save Settings' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
