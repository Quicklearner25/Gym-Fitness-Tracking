import React, { useState } from 'react';
import { Member, Plan } from '../types';
import { Search, UserPlus, SlidersHorizontal, Edit, Trash2, Phone, Calendar, ArrowLeft, ShieldAlert, Check, MapPin, Award, User, Clock } from 'lucide-react';

interface MemberManagementProps {
  members: Member[];
  plans: Plan[];
  onAddMember: (member: Member) => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
  selectedMemberId?: string;
  onClearSelectedMember?: () => void;
}

export default function MemberManagement({
  members,
  plans,
  onAddMember,
  onEditMember,
  onDeleteMember,
  selectedMemberId,
  onClearSelectedMember,
}: MemberManagementProps) {
  // Navigation & Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Male' | 'Female' | 'Other'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(
    selectedMemberId ? (members.find((m) => m.id === selectedMemberId) || null) : null
  );

  // Sync selectedMemberId prop with viewingMember state
  React.useEffect(() => {
    if (selectedMemberId) {
      const found = members.find((m) => m.id === selectedMemberId);
      if (found) {
        setViewingMember(found);
      }
    }
  }, [selectedMemberId, members]);

  // Form States
  const [formName, setFormName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formPhoto, setFormPhoto] = useState('');
  const [formGender, setFormGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [formAge, setFormAge] = useState(25);
  const [formAddress, setFormAddress] = useState('');
  const [formJoiningDate, setFormJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [formPlanId, setFormPlanId] = useState(plans[0]?.id || 'plan_monthly');
  const [formFeeAmount, setFormFeeAmount] = useState(plans[0]?.feeAmount || 50);
  const [formFeeDueDate, setFormFeeDueDate] = useState('');
  const [formEmergencyName, setFormEmergencyName] = useState('');
  const [formEmergencyRelation, setFormEmergencyRelation] = useState('');
  const [formEmergencyMobile, setFormEmergencyMobile] = useState('');

  // Auto calculate fee and due date based on chosen plan
  const handlePlanChange = (planId: string) => {
    setFormPlanId(planId);
    const selectedPlan = plans.find((p) => p.id === planId);
    if (selectedPlan) {
      setFormFeeAmount(selectedPlan.feeAmount);
      calculateDueDate(formJoiningDate, selectedPlan.durationMonths);
    }
  };

  const handleJoiningDateChange = (date: string) => {
    setFormJoiningDate(date);
    const selectedPlan = plans.find((p) => p.id === formPlanId);
    if (selectedPlan) {
      calculateDueDate(date, selectedPlan.durationMonths);
    }
  };

  const calculateDueDate = (joinDate: string, durationMonths: number) => {
    const dateObj = new Date(joinDate);
    dateObj.setMonth(dateObj.getMonth() + durationMonths);
    setFormFeeDueDate(dateObj.toISOString().split('T')[0]);
  };

  // Convert File to Base64 String for Offline storage
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Populate form for adding or editing
  const openForm = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setFormName(member.name);
      setFormMobile(member.mobile);
      setFormPhoto(member.photo || '');
      setFormGender(member.gender);
      setFormAge(member.age);
      setFormAddress(member.address);
      setFormJoiningDate(member.joiningDate);
      setFormPlanId(member.planId);
      setFormFeeAmount(member.feeAmount);
      setFormFeeDueDate(member.feeDueDate);
      setFormEmergencyName(member.emergencyContact.name);
      setFormEmergencyRelation(member.emergencyContact.relation);
      setFormEmergencyMobile(member.emergencyContact.mobile);
    } else {
      setEditingMember(null);
      setFormName('');
      setFormMobile('');
      setFormPhoto('');
      setFormGender('Male');
      setFormAge(24);
      setFormAddress('');
      setFormJoiningDate(new Date().toISOString().split('T')[0]);
      
      const defaultPlan = plans[0];
      if (defaultPlan) {
        setFormPlanId(defaultPlan.id);
        setFormFeeAmount(defaultPlan.feeAmount);
        const dateObj = new Date();
        dateObj.setMonth(dateObj.getMonth() + defaultPlan.durationMonths);
        setFormFeeDueDate(dateObj.toISOString().split('T')[0]);
      } else {
        setFormPlanId('');
        setFormFeeAmount(0);
        setFormFeeDueDate(new Date().toISOString().split('T')[0]);
      }
      setFormEmergencyName('');
      setFormEmergencyRelation('');
      setFormEmergencyMobile('');
    }
    setIsFormOpen(true);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formMobile) {
      alert('Name and Mobile Number are required.');
      return;
    }

    // Determine status based on fee due date
    const todayStr = new Date().toISOString().split('T')[0];
    const status = new Date(formFeeDueDate).getTime() >= new Date(todayStr).getTime() ? 'active' : 'expired';

    const memberData: Member = {
      id: editingMember ? editingMember.id : `mem_${Date.now()}`,
      name: formName,
      mobile: formMobile,
      photo: formPhoto || undefined,
      gender: formGender,
      age: Number(formAge),
      address: formAddress,
      joiningDate: formJoiningDate,
      planId: formPlanId,
      feeAmount: Number(formFeeAmount),
      feeDueDate: formFeeDueDate,
      emergencyContact: {
        name: formEmergencyName,
        relation: formEmergencyRelation,
        mobile: formEmergencyMobile,
      },
      status,
    };

    if (editingMember) {
      onEditMember(memberData);
      // Update viewing details if editing current viewing member
      if (viewingMember?.id === memberData.id) {
        setViewingMember(memberData);
      }
    } else {
      onAddMember(memberData);
    }

    setIsFormOpen(false);
  };

  // Search and Filter members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mobile.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesGender = genderFilter === 'all' || member.gender === genderFilter;
    return matchesSearch && matchesStatus && matchesGender;
  });

  // Render the member profile view
  if (viewingMember) {
    const associatedPlan = plans.find((p) => p.id === viewingMember.planId);
    
    return (
      <div className="space-y-6" id="member-profile-page">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setViewingMember(null);
              if (onClearSelectedMember) onClearSelectedMember();
            }}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Member Management</span>
            <h2 className="text-xl font-bold text-white">Member Profile</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Card Profile Info */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="h-28 bg-gradient-to-r from-zinc-900 via-zinc-950 to-amber-900/10 border-b border-zinc-800"></div>
              
              <div className="px-6 pb-6 relative">
                {/* Photo placement overlapping the banner */}
                <div className="absolute -top-12 left-6">
                  <div className="w-24 h-24 rounded-2xl bg-zinc-950 border-4 border-zinc-950 shadow-2xl overflow-hidden flex items-center justify-center text-3xl font-bold text-amber-500">
                    {viewingMember.photo ? (
                      <img src={viewingMember.photo} alt={viewingMember.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      viewingMember.name.charAt(0)
                    )}
                  </div>
                </div>

                <div className="pt-16 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-white">{viewingMember.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-zinc-400 text-xs mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        {viewingMember.gender}, {viewingMember.age} yrs
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        {viewingMember.mobile}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openForm(viewingMember)}
                      className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-500" />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this member?')) {
                          onDeleteMember(viewingMember.id);
                          setViewingMember(null);
                        }
                      }}
                      className="p-1.5 bg-zinc-900/50 hover:bg-red-950/20 text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status bar */}
                <div className="mt-6 p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Status</span>
                    <p className="mt-1">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-extrabold rounded-full uppercase ${viewingMember.status === 'active' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50' : 'bg-red-950/50 text-red-400 border border-red-900/50'}`}>
                        {viewingMember.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Current Plan</span>
                    <p className="text-sm font-bold text-white mt-1">{associatedPlan?.name || 'Custom'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Fee Amount</span>
                    <p className="text-sm font-bold text-amber-500 mt-1">₹{viewingMember.feeAmount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Due Date</span>
                    <p className="text-sm font-bold text-white mt-1">{viewingMember.feeDueDate}</p>
                  </div>
                </div>

                {/* Additional Details lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500" />
                      Membership Details
                    </h4>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-medium">Joined Date</span>
                        <span className="text-zinc-300 font-bold">{viewingMember.joiningDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-medium">Plan Duration</span>
                        <span className="text-zinc-300 font-bold">{associatedPlan?.durationMonths || 1} Month(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-medium">Address</span>
                        <span className="text-zinc-300 font-bold max-w-xs text-right truncate" title={viewingMember.address}>
                          {viewingMember.address || 'Not Provided'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                      Emergency Contact
                    </h4>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-medium">Contact Name</span>
                        <span className="text-zinc-300 font-bold">{viewingMember.emergencyContact.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-medium">Relationship</span>
                        <span className="text-zinc-300 font-bold">{viewingMember.emergencyContact.relation || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-medium">Mobile Contact</span>
                        <span className="text-zinc-300 font-bold">{viewingMember.emergencyContact.mobile || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Golden Membership Card QR Code layout */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-between min-h-[350px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              
              {/* Card Header */}
              <div className="w-full flex justify-between items-center pb-4 border-b border-zinc-800">
                <span className="text-sm font-black text-amber-500 tracking-wider">FIT<span className="text-white">TRACK</span></span>
                <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold uppercase px-2 py-0.5 rounded-full border border-amber-500/20">VIP CARD</span>
              </div>

              {/* Sleek Barcode Graphic */}
              <div className="my-6 p-4 bg-white rounded-xl shadow-xl flex flex-col items-center justify-center">
                <div className="flex gap-[2px] items-stretch h-14 w-40 bg-white">
                  <div className="w-[3px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[4px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[2px] bg-zinc-950"></div>
                  <div className="w-[3px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[4px] bg-zinc-950"></div>
                  <div className="w-[2px] bg-zinc-950"></div>
                  <div className="w-[3px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[4px] bg-zinc-950"></div>
                  <div className="w-[2px] bg-zinc-950"></div>
                  <div className="w-[3px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[2px] bg-zinc-950"></div>
                  <div className="w-[4px] bg-zinc-950"></div>
                  <div className="w-[3px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[2px] bg-zinc-950"></div>
                  <div className="w-[4px] bg-zinc-950"></div>
                  <div className="w-[1px] bg-zinc-950"></div>
                  <div className="w-[3px] bg-zinc-950"></div>
                </div>
                <span className="text-[10px] font-mono font-black text-zinc-800 tracking-[0.2em] mt-2">
                  {viewingMember.id.toUpperCase()}
                </span>
              </div>

              {/* Member details inside gold card */}
              <div className="w-full text-center">
                <h4 className="text-base font-extrabold text-white">{viewingMember.name}</h4>
                <p className="text-[11px] text-zinc-400 font-mono mt-1">ID: {viewingMember.id}</p>
                <p className="text-[10px] text-amber-500/80 font-semibold uppercase tracking-widest mt-2">Check-In Pass</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="members-list-page">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
            Member Management
          </h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            Manage your rosters, search member profiles, and check renewal schedules.
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-amber-500/20 self-start"
          id="add-member-button"
        >
          <UserPlus className="w-4.5 h-4.5" />
          Add Member
        </button>
      </div>

      {/* Filters and search Bar */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between shadow-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4.5 h-4.5" />
          <input
            type="text"
            placeholder="Search by name or mobile number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 transition-colors"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-zinc-500 font-bold uppercase">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold px-3 py-2 text-white outline-none focus:border-amber-500/60"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Members</option>
            <option value="expired">Expired Members</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold px-3 py-2 text-white outline-none focus:border-amber-500/60"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Roster Cards Grid */}
      {filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-600 bg-zinc-950 border border-zinc-800 rounded-2xl">
          <User className="w-12 h-12 stroke-1 mb-3 text-zinc-500" />
          <p className="text-sm font-semibold">No members found</p>
          <p className="text-xs mt-1">Try adjusting your filters or add a new member profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="members-cards-grid">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setViewingMember(member)}
              className="bg-zinc-950 border border-zinc-800 hover:border-amber-500/40 hover:bg-zinc-900/20 rounded-xl p-5 cursor-pointer transition-all duration-300 relative overflow-hidden group shadow-md"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-all duration-500"></div>
              
              <div className="flex items-start gap-4">
                {/* Photo */}
                <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center text-xl font-bold text-amber-500 shrink-0">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>

                {/* Meta details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-white text-sm truncate group-hover:text-amber-500 transition-colors">
                      {member.name}
                    </h3>
                    <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0 ${member.status === 'active' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' : 'bg-red-950/40 text-red-400 border border-red-900/40'}`}>
                      {member.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5 font-sans">
                    <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    {member.mobile}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span>Due Date: <span className="text-zinc-400 font-semibold">{member.feeDueDate}</span></span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pop-up Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto" id="member-form-modal">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-950/90 backdrop-blur-md z-10">
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                <span className="text-amber-500">★</span>
                {editingMember ? 'Edit Member Profile' : 'Register New Member'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-500 hover:text-white font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Section: Basic Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
                  1. Basic Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Leonidas Spartan"
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={formMobile}
                      onChange={(e) => setFormMobile(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Gender</label>
                    <select
                      value={formGender}
                      onChange={(e) => setFormGender(e.target.value as any)}
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Age</label>
                    <input
                      type="number"
                      value={formAge}
                      onChange={(e) => setFormAge(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Photo (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="w-full text-xs text-zinc-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Home Address</label>
                  <textarea
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="Enter full address..."
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60 h-16 resize-none"
                  />
                </div>
              </div>

              {/* Section: Plan Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
                  2. Membership Plan Assignment
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Joining Date</label>
                    <input
                      type="date"
                      value={formJoiningDate}
                      onChange={(e) => handleJoiningDateChange(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Choose Membership Plan</label>
                    <select
                      value={formPlanId}
                      onChange={(e) => handlePlanChange(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - ₹{p.feeAmount} ({p.durationMonths}m)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Fee Amount (₹)</label>
                    <input
                      type="number"
                      value={formFeeAmount}
                      onChange={(e) => setFormFeeAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Fee Due Date (Calculated)</label>
                    <input
                      type="date"
                      value={formFeeDueDate}
                      onChange={(e) => setFormFeeDueDate(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Emergency Contact */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
                  3. Emergency Contact
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Contact Name</label>
                    <input
                      type="text"
                      value={formEmergencyName}
                      onChange={(e) => setFormEmergencyName(e.target.value)}
                      placeholder="e.g. Sarah Spartan"
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Relation</label>
                    <input
                      type="text"
                      value={formEmergencyRelation}
                      onChange={(e) => setFormEmergencyRelation(e.target.value)}
                      placeholder="e.g. Wife, Brother"
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Contact Number</label>
                    <input
                      type="tel"
                      value={formEmergencyMobile}
                      onChange={(e) => setFormEmergencyMobile(e.target.value)}
                      placeholder="e.g. 9567890124"
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-zinc-800 pt-6 flex justify-end gap-3">
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
                  {editingMember ? 'Save Changes' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
