import React, { useState } from 'react';
import { 
  AppRole, 
  AdminTab, 
  PaymentTransaction, 
  DeviceChangeRequest, 
  ModerationReport, 
  AuditLogEntry, 
  Course,
  Coupon,
  CouponRedemption,
  MentorProfile,
  MentorVideo
} from '../../types';
import { 
  INITIAL_COUPONS, 
  INITIAL_COUPON_REDEMPTIONS, 
  INITIAL_MENTORS, 
  INITIAL_MENTOR_VIDEOS 
} from '../../data/mockData';
import { AdminCouponManager } from './AdminCouponManager';
import { AdminMentorManager } from './AdminMentorManager';
import { 
  LayoutDashboard, 
  Users, 
  Smartphone, 
  BookOpen, 
  CreditCard, 
  ShieldAlert, 
  ScrollText, 
  Lock, 
  KeyRound, 
  Check, 
  X, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  UserX, 
  VolumeX, 
  Trash2,
  RefreshCw,
  LogOut,
  ChevronRight,
  TrendingUp,
  Tag,
  Video
} from 'lucide-react';

interface AdminPortalProps {
  currentRole: AppRole;
  onRoleChange: (role: AppRole) => void;
  payments: PaymentTransaction[];
  onVerifyPayment: (paymentId: string) => void;
  deviceRequests: DeviceChangeRequest[];
  onApproveDevice: (requestId: string) => void;
  onRejectDevice: (requestId: string) => void;
  reports: ModerationReport[];
  onResolveReport: (reportId: string, action: 'mute' | 'delete' | 'dismiss') => void;
  auditLogs: AuditLogEntry[];
  courses: Course[];
  onBackToStudent: () => void;
  coupons?: Coupon[];
  redemptions?: CouponRedemption[];
  mentors?: MentorProfile[];
  mentorVideos?: MentorVideo[];
  onUpdateCoupons?: (coupons: Coupon[]) => void;
  onUpdateMentors?: (mentors: MentorProfile[]) => void;
  onUpdateMentorVideos?: (videos: MentorVideo[]) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentRole,
  onRoleChange,
  payments,
  onVerifyPayment,
  deviceRequests,
  onApproveDevice,
  onRejectDevice,
  reports,
  onResolveReport,
  auditLogs,
  courses,
  onBackToStudent
}) => {
  // Authentication & 2FA State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showTwoFactorScreen, setShowTwoFactorScreen] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Search & Filter state
  const [studentSearch, setStudentSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'verified'>('all');

  // Coupons & Mentors State with Local Storage sync
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const s = localStorage.getItem('vyrox_admin_coupons');
      return s ? JSON.parse(s) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [redemptions, setRedemptions] = useState<CouponRedemption[]>(() => {
    try {
      const s = localStorage.getItem('vyrox_admin_redemptions');
      return s ? JSON.parse(s) : INITIAL_COUPON_REDEMPTIONS;
    } catch {
      return INITIAL_COUPON_REDEMPTIONS;
    }
  });

  const [mentors, setMentors] = useState<MentorProfile[]>(() => {
    try {
      const s = localStorage.getItem('vyrox_mentors');
      return s ? JSON.parse(s) : INITIAL_MENTORS;
    } catch {
      return INITIAL_MENTORS;
    }
  });

  const [mentorVideos, setMentorVideos] = useState<MentorVideo[]>(() => {
    try {
      const s = localStorage.getItem('vyrox_mentor_videos');
      return s ? JSON.parse(s) : INITIAL_MENTOR_VIDEOS;
    } catch {
      return INITIAL_MENTOR_VIDEOS;
    }
  });

  // Coupon Handlers
  const handleCreateCoupon = (data: Partial<Coupon>) => {
    const newC: Coupon = {
      id: `cpn_${Date.now()}`,
      code: (data.code || 'CODE').toUpperCase(),
      discountType: data.discountType || 'percentage',
      discountValue: data.discountValue || 10,
      applicablePlans: data.applicablePlans || 'all',
      startDate: data.startDate || '2026-01-01',
      expiryDate: data.expiryDate || '2026-12-31',
      usageLimit: data.usageLimit || 100,
      usedCount: 0,
      perUserLimit: data.perUserLimit || 1,
      minPurchaseAmount: data.minPurchaseAmount || 100,
      maxDiscountAmount: data.maxDiscountAmount,
      status: 'active',
      description: data.description || 'Admin created voucher',
      createdAt: 'Just now'
    };
    const updated = [newC, ...coupons];
    setCoupons(updated);
    try { localStorage.setItem('vyrox_admin_coupons', JSON.stringify(updated)); } catch {}
  };

  const handleUpdateCoupon = (id: string, data: Partial<Coupon>) => {
    const updated = coupons.map(c => c.id === id ? { ...c, ...data } : c);
    setCoupons(updated);
    try { localStorage.setItem('vyrox_admin_coupons', JSON.stringify(updated)); } catch {}
  };

  const handleDeleteCoupon = (id: string) => {
    const updated = coupons.filter(c => c.id !== id);
    setCoupons(updated);
    try { localStorage.setItem('vyrox_admin_coupons', JSON.stringify(updated)); } catch {}
  };

  const handleToggleCouponStatus = (id: string) => {
    const updated = coupons.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } as Coupon : c);
    setCoupons(updated);
    try { localStorage.setItem('vyrox_admin_coupons', JSON.stringify(updated)); } catch {}
  };

  // Mentor Handlers
  const handleToggleMentorPermission = (mentorId: string, currentVal: boolean) => {
    const updated = mentors.map(m => m.id === mentorId ? { ...m, uploadPermissionGranted: !currentVal } : m);
    setMentors(updated);
    try { localStorage.setItem('vyrox_mentors', JSON.stringify(updated)); } catch {}
  };

  const handleApproveMentor = (mentorId: string) => {
    const updated = mentors.map(m => m.id === mentorId ? { ...m, status: 'active', isAuthorized: true, uploadPermissionGranted: true } as MentorProfile : m);
    setMentors(updated);
    try { localStorage.setItem('vyrox_mentors', JSON.stringify(updated)); } catch {}
  };

  const handleRejectMentor = (mentorId: string) => {
    const updated = mentors.map(m => m.id === mentorId ? { ...m, status: 'suspended', isAuthorized: false, uploadPermissionGranted: false } as MentorProfile : m);
    setMentors(updated);
    try { localStorage.setItem('vyrox_mentors', JSON.stringify(updated)); } catch {}
  };

  const handleApproveVideo = (videoId: string) => {
    const updated = mentorVideos.map(v => v.id === videoId ? { ...v, status: 'published' } as MentorVideo : v);
    setMentorVideos(updated);
    try { localStorage.setItem('vyrox_mentor_videos', JSON.stringify(updated)); } catch {}
  };

  const handleRemoveVideo = (videoId: string) => {
    const updated = mentorVideos.filter(v => v.id !== videoId);
    setMentorVideos(updated);
    try { localStorage.setItem('vyrox_mentor_videos', JSON.stringify(updated)); } catch {}
  };

  const couponAnalytics = {
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter(c => c.status === 'active').length,
    expiredCoupons: coupons.filter(c => c.status === 'inactive').length,
    totalRedemptions: redemptions.length,
    totalDiscountProvided: redemptions.reduce((acc, r) => acc + r.discountAmount, 0),
    mostFrequentCoupon: 'VYROX20 (14 redemptions)'
  };

  // Action Modals
  const [muteModalTarget, setMuteModalTarget] = useState<ModerationReport | null>(null);
  const [muteDuration, setMuteDuration] = useState<'1h' | '24h' | '7d' | 'permanent'>('24h');
  const [muteReason, setMuteReason] = useState('Violation of SEBI academy guidelines: posting direct buy/sell tips.');

  const recoveryCodesList = [
    'VX-8812-9901', 'VX-4412-1092', 'VX-9021-3310', 'VX-7781-4402',
    'VX-3321-8890', 'VX-1109-5561', 'VX-6652-3341', 'VX-2290-7718',
    'VX-9941-2283', 'VX-5510-9940'
  ];

  // 2FA Verification handler
  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length === 6) {
      setIsAuthenticated(true);
      setShowTwoFactorScreen(false);
      setAuthError(null);
    } else {
      const nextFail = failedAttempts + 1;
      setFailedAttempts(nextFail);
      if (nextFail >= 3) {
        setAuthError('Account locked: 3 consecutive failed 2FA attempts. 24-hour security quarantine triggered.');
      } else {
        setAuthError(`Invalid 6-digit code. ${3 - nextFail} attempt(s) remaining before lockout.`);
      }
    }
  };

  const filteredPayments = payments.filter(p => {
    if (paymentFilter === 'pending') return p.status === 'pending';
    if (paymentFilter === 'verified') return p.status === 'verified';
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Admin Top Header Bar */}
      <div className="bg-[#0F1522] border border-[#26304A] p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E2A4A] border border-[#8FB0FF]/40 flex items-center justify-center text-[#8FB0FF] font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#F2F4F8]">VYROX Academy Admin Console</span>
              <span className="bg-[#3A2D0C] text-[#E5A82B] text-[10px] font-mono px-2 py-0.5 rounded border border-[#E5A82B]/30 font-bold uppercase">
                {currentRole.replace('_', ' ')}
              </span>
            </div>
            <span className="text-xs text-[#9AA6BD] font-mono">
              Hardware Session: #ADM-8821 • 2FA Enforced • TLS 1.3 Audit Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Admin Role Selector (Owner Admin, Content Manager, Moderator, Payments Admin) */}
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as AppRole)}
            className="bg-[#1A2133] border border-[#26304A] text-xs font-semibold text-[#F2F4F8] rounded-xl px-3 py-2 outline-none touch-target"
          >
            <option value="owner_admin">Owner Admin (Full Control)</option>
            <option value="payments_admin">Payments Admin</option>
            <option value="moderator">Community Moderator</option>
          </select>

          <button
            onClick={() => setShowTwoFactorScreen(true)}
            className="touch-target px-3 py-2 rounded-xl bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] text-xs font-semibold text-[#8FB0FF] flex items-center gap-1.5 transition-colors"
            title="Simulate 2FA Security Challenge"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>2FA Auth</span>
          </button>

          <button
            onClick={onBackToStudent}
            className="touch-target px-4 py-2 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#E5A82B]/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit to Student Academy</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#26304A]">
        {[
          { id: 'dashboard' as AdminTab, label: 'Dashboard & KPIs', icon: LayoutDashboard },
          { id: 'coupons' as AdminTab, label: `Coupons & Discounts (${coupons.length})`, icon: Tag },
          { id: 'mentor_management' as AdminTab, label: `Mentor & Video Review (${mentors.length})`, icon: Video },
          { id: 'payments' as AdminTab, label: `Payments Queue (${payments.filter(p => p.status === 'pending').length})`, icon: CreditCard, alert: payments.filter(p => p.status === 'pending').length > 0 },
          { id: 'device_approvals' as AdminTab, label: `Device Changes (${deviceRequests.filter(d => d.status === 'pending').length})`, icon: Smartphone },
          { id: 'moderation' as AdminTab, label: `Moderation Reports (${reports.filter(r => r.status === 'open').length})`, icon: ShieldAlert, alert: reports.filter(r => r.status === 'open').length > 0 },
          { id: 'students' as AdminTab, label: 'Student Directory', icon: Users },
          { id: 'course_manager' as AdminTab, label: 'Course Curriculum', icon: BookOpen },
          { id: 'audit_log' as AdminTab, label: 'Security Audit Log', icon: ScrollText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`touch-target px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                isActive
                  ? 'bg-[#E5A82B] text-[#0B0F17] font-bold shadow-md shadow-[#E5A82B]/20'
                  : 'bg-[#1A2133] hover:bg-[#212B42] text-[#9AA6BD] border border-[#26304A]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-[#FF6B6B] animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-VIEW 1: DASHBOARD & KPIS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1A2133] border border-[#26304A] p-4 rounded-xl space-y-1 shadow-sm">
              <div className="flex justify-between items-center text-[#9AA6BD]">
                <span className="text-[11px] font-mono font-semibold">ACTIVE STUDENTS</span>
                <Users className="w-4 h-4 text-[#8FB0FF]" />
              </div>
              <div className="text-2xl font-bold text-[#F2F4F8] font-mono">248</div>
              <span className="text-[10px] text-[#3DDC97] flex items-center gap-1 font-mono">
                <TrendingUp className="w-3 h-3" /> +14% this month
              </span>
            </div>

            <div className="bg-[#1A2133] border border-[#26304A] p-4 rounded-xl space-y-1 shadow-sm">
              <div className="flex justify-between items-center text-[#9AA6BD]">
                <span className="text-[11px] font-mono font-semibold">NEW ENROLLMENTS</span>
                <BookOpen className="w-4 h-4 text-[#E5A82B]" />
              </div>
              <div className="text-2xl font-bold text-[#F2F4F8] font-mono">19</div>
              <span className="text-[10px] text-[#9AA6BD] font-mono">Current weekly cohort</span>
            </div>

            <div className="bg-[#1A2133] border border-[#26304A] p-4 rounded-xl space-y-1 shadow-sm">
              <div className="flex justify-between items-center text-[#9AA6BD]">
                <span className="text-[11px] font-mono font-semibold">PENDING PAYMENTS</span>
                <CreditCard className="w-4 h-4 text-[#E5A82B]" />
              </div>
              <div className="text-2xl font-bold text-[#E5A82B] font-mono">
                {payments.filter(p => p.status === 'pending').length}
              </div>
              <span className="text-[10px] text-[#E5A82B] font-mono">Requires UTR verification</span>
            </div>

            <div className="bg-[#1A2133] border border-[#26304A] p-4 rounded-xl space-y-1 shadow-sm">
              <div className="flex justify-between items-center text-[#9AA6BD]">
                <span className="text-[11px] font-mono font-semibold">MODERATION REPORTS</span>
                <ShieldAlert className="w-4 h-4 text-[#FF6B6B]" />
              </div>
              <div className="text-2xl font-bold text-[#FF6B6B] font-mono">
                {reports.filter(r => r.status === 'open').length}
              </div>
              <span className="text-[10px] text-[#FF6B6B] font-mono">SEBI compliance review</span>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Quick Verification Queue */}
            <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
                <h3 className="text-sm font-bold text-[#F2F4F8] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#E5A82B]" />
                  <span>Pending Payment Verifications</span>
                </h3>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="text-xs text-[#E5A82B] hover:underline"
                >
                  View All ({payments.length})
                </button>
              </div>

              <div className="space-y-3">
                {payments.filter(p => p.status === 'pending').slice(0, 3).map(pay => (
                  <div key={pay.id} className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A] flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F2F4F8]">{pay.studentName}</span>
                        <span className="font-mono text-[10px] text-[#9AA6BD]">({pay.orderRef})</span>
                      </div>
                      <span className="text-[11px] text-[#9AA6BD] block mt-0.5 font-mono">
                        {pay.method.toUpperCase()} • ₹{pay.amount.toLocaleString('en-IN')} • Ref: {pay.transactionId}
                      </span>
                    </div>

                    <button
                      onClick={() => onVerifyPayment(pay.id)}
                      className="touch-target px-3 py-1.5 rounded-lg bg-[#16382C] text-[#3DDC97] border border-[#3DDC97]/40 hover:bg-[#16382C]/80 font-bold text-xs"
                    >
                      Verify ✓
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgent Moderation Queue */}
            <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
                <h3 className="text-sm font-bold text-[#F2F4F8] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#FF6B6B]" />
                  <span>Open Community Reports</span>
                </h3>
                <button
                  onClick={() => setActiveTab('moderation')}
                  className="text-xs text-[#FF6B6B] hover:underline"
                >
                  Review ({reports.filter(r => r.status === 'open').length})
                </button>
              </div>

              <div className="space-y-3">
                {reports.filter(r => r.status === 'open').map(rep => (
                  <div key={rep.id} className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#FF6B6B] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {rep.reason.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-[#9AA6BD]">{rep.timestamp}</span>
                    </div>
                    <p className="text-[#9AA6BD] italic text-[11px]">"{rep.messageSnippet}"</p>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => onResolveReport(rep.id, 'dismiss')}
                        className="touch-target px-2.5 py-1 text-[11px] text-[#9AA6BD] hover:text-white"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => setMuteModalTarget(rep)}
                        className="touch-target px-3 py-1 rounded-lg bg-[#3A1717] text-[#FF6B6B] border border-[#FF6B6B]/30 hover:bg-[#3A1717]/80 font-bold text-[11px]"
                      >
                        Mute User
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW: COUPONS & DISCOUNT MANAGEMENT */}
      {activeTab === 'coupons' && (
        <AdminCouponManager
          coupons={coupons}
          redemptions={redemptions}
          analytics={couponAnalytics}
          onCreateCoupon={handleCreateCoupon}
          onUpdateCoupon={handleUpdateCoupon}
          onDeleteCoupon={handleDeleteCoupon}
          onToggleStatus={handleToggleCouponStatus}
        />
      )}

      {/* SUB-VIEW: MENTOR & VIDEO REVIEWS */}
      {activeTab === 'mentor_management' && (
        <AdminMentorManager
          mentors={mentors}
          videos={mentorVideos}
          onToggleUploadPermission={handleToggleMentorPermission}
          onApproveMentor={handleApproveMentor}
          onRejectMentor={handleRejectMentor}
          onApproveVideo={handleApproveVideo}
          onRemoveVideo={handleRemoveVideo}
        />
      )}

      {/* SUB-VIEW 2: PAYMENTS QUEUE */}
      {activeTab === 'payments' && (
        <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#26304A]">
            <div>
              <h3 className="text-base font-bold text-[#F2F4F8]">Payment Verification & Settlements</h3>
              <p className="text-xs text-[#9AA6BD] mt-0.5">
                Verify UTR numbers from Google Pay UPI ({'nandhakumar052007@okaxis'}) and Binance UID ({'1129930138'}).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaymentFilter('all')}
                className={`touch-target px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  paymentFilter === 'all' ? 'bg-[#E5A82B] text-[#0B0F17]' : 'bg-[#0B0F17] text-[#9AA6BD]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setPaymentFilter('pending')}
                className={`touch-target px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  paymentFilter === 'pending' ? 'bg-[#E5A82B] text-[#0B0F17]' : 'bg-[#0B0F17] text-[#9AA6BD]'
                }`}
              >
                Pending Only
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0F17] text-[#9AA6BD] font-mono text-[10px] uppercase border-b border-[#26304A]">
                <tr>
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method & Tx ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26304A]">
                {filteredPayments.map(pay => (
                  <tr key={pay.id} className="hover:bg-[#212B42]/50 transition-colors">
                    <td className="p-3 font-mono font-semibold text-[#F2F4F8]">{pay.orderRef}</td>
                    <td className="p-3">
                      <div className="font-semibold text-[#F2F4F8]">{pay.studentName}</div>
                      <div className="text-[10px] text-[#9AA6BD] font-mono">{pay.studentEmail}</div>
                    </td>
                    <td className="p-3 text-[#9AA6BD] max-w-xs truncate">{pay.courseName}</td>
                    <td className="p-3 font-mono font-bold text-[#F2F4F8]">₹{pay.amount.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <div className="font-semibold text-[#E5A82B]">{pay.method.toUpperCase()}</div>
                      <div className="text-[10px] text-[#9AA6BD] font-mono select-all">{pay.transactionId}</div>
                    </td>
                    <td className="p-3 text-[#9AA6BD] font-mono text-[10px]">{pay.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        pay.status === 'verified'
                          ? 'bg-[#16382C] text-[#3DDC97] border border-[#3DDC97]/30'
                          : 'bg-[#3A2D0C] text-[#E5A82B] border border-[#E5A82B]/30'
                      }`}>
                        {pay.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {pay.status === 'pending' ? (
                        <button
                          onClick={() => onVerifyPayment(pay.id)}
                          className="touch-target px-3 py-1.5 rounded-lg bg-[#16382C] hover:bg-[#16382C]/80 text-[#3DDC97] border border-[#3DDC97]/40 font-bold text-xs"
                        >
                          Verify & Grant Access
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#9AA6BD] font-mono">
                          Verified by {pay.verifiedBy || 'Admin'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: DEVICE CHANGE APPROVALS */}
      {activeTab === 'device_approvals' && (
        <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 space-y-4">
          <div className="pb-3 border-b border-[#26304A]">
            <h3 className="text-base font-bold text-[#F2F4F8]">Hardware Device Migration Queue</h3>
            <p className="text-xs text-[#9AA6BD] mt-0.5">
              Strict 1-device enforcement: review old vs new hardware fingerprints before revoking active sessions.
            </p>
          </div>

          {deviceRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#9AA6BD]">
              No pending device migration requests in queue.
            </div>
          ) : (
            <div className="space-y-4">
              {deviceRequests.map(req => (
                <div key={req.id} className="p-4 bg-[#0B0F17] rounded-xl border border-[#26304A] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#F2F4F8]">{req.studentName}</span>
                      <span className="text-xs text-[#9AA6BD] font-mono ml-2">({req.studentEmail})</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#E5A82B] bg-[#3A2D0C] px-2 py-0.5 rounded border border-[#E5A82B]/30 font-bold">
                      24h Security Hold
                    </span>
                  </div>

                  <p className="text-xs text-[#9AA6BD] bg-[#1A2133] p-2.5 rounded-lg border border-[#26304A]">
                    <strong>Reason:</strong> {req.reason}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Old Device */}
                    <div className="p-3 bg-[#1A2133]/60 rounded-xl border border-[#26304A]">
                      <span className="text-[10px] font-mono text-[#FF6B6B] block font-bold">REVOKING HARDWARE:</span>
                      <span className="font-bold text-[#F2F4F8] block mt-1">{req.oldDevice.deviceName}</span>
                      <span className="text-[11px] text-[#9AA6BD] font-mono block">OS: {req.oldDevice.os}</span>
                      <span className="text-[11px] text-[#9AA6BD] font-mono block">IP: {req.oldDevice.ipAddress}</span>
                    </div>

                    {/* New Target Device */}
                    <div className="p-3 bg-[#16382C]/30 rounded-xl border border-[#3DDC97]/40">
                      <span className="text-[10px] font-mono text-[#3DDC97] block font-bold">AUTHORIZING HARDWARE:</span>
                      <span className="font-bold text-[#F2F4F8] block mt-1">{req.newDevice.deviceName}</span>
                      <span className="text-[11px] text-[#9AA6BD] font-mono block">OS: {req.newDevice.os}</span>
                      <span className="text-[11px] text-[#9AA6BD] font-mono block">IP: {req.newDevice.ipAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => onRejectDevice(req.id)}
                      className="touch-target px-4 py-2 rounded-xl text-xs font-semibold text-[#FF6B6B] hover:bg-[#3A1717] transition-colors"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => onApproveDevice(req.id)}
                      className="touch-target px-5 py-2 rounded-xl bg-[#3DDC97] hover:bg-[#32B87D] text-[#0B0F17] font-bold text-xs shadow-md transition-all"
                    >
                      Approve & Reassign Key
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 4: MODERATION CONSOLE */}
      {activeTab === 'moderation' && (
        <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 space-y-4">
          <div className="pb-3 border-b border-[#26304A]">
            <h3 className="text-base font-bold text-[#F2F4F8]">Community Moderation & SEBI Compliance Desk</h3>
            <p className="text-xs text-[#9AA6BD] mt-0.5">
              Enforce academy safety: mute offenders, purge unauthorized signals, and safeguard regulatory compliance.
            </p>
          </div>

          <div className="space-y-3">
            {reports.map(rep => (
              <div key={rep.id} className="p-4 bg-[#0B0F17] rounded-xl border border-[#26304A] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#F2F4F8]">{rep.reportedUserName}</span>
                    <span className="text-[10px] font-mono bg-[#3A1717] text-[#FF6B6B] px-2 py-0.5 rounded border border-[#FF6B6B]/30 uppercase font-bold">
                      {rep.reason}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#9AA6BD]">Reported by {rep.reportedBy}</span>
                </div>

                <div className="p-3 bg-[#1A2133] rounded-lg border border-[#26304A] text-[#9AA6BD] italic">
                  "{rep.messageSnippet}"
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => onResolveReport(rep.id, 'dismiss')}
                    className="touch-target px-3 py-1.5 text-xs text-[#9AA6BD] hover:text-white"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => onResolveReport(rep.id, 'delete')}
                    className="touch-target px-3 py-1.5 rounded-lg bg-[#212B42] text-[#F2F4F8] hover:bg-[#26304A] text-xs font-semibold"
                  >
                    Delete Message
                  </button>
                  <button
                    onClick={() => setMuteModalTarget(rep)}
                    className="touch-target px-4 py-1.5 rounded-lg bg-[#FF6B6B] hover:bg-[#E05252] text-white font-bold text-xs"
                  >
                    Mute Student
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: STUDENT DIRECTORY */}
      {activeTab === 'students' && (
        <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
            <h3 className="text-base font-bold text-[#F2F4F8]">Enrolled Students Directory</h3>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-[#9AA6BD] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students or device IDs..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full bg-[#0B0F17] border border-[#26304A] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F2F4F8] outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0F17] text-[#9AA6BD] font-mono text-[10px] uppercase border-b border-[#26304A]">
                <tr>
                  <th className="p-3">Student</th>
                  <th className="p-3">Enrolled Course</th>
                  <th className="p-3">Active Hardware Device</th>
                  <th className="p-3">GPay / Binance ID</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26304A]">
                <tr className="hover:bg-[#212B42]/50">
                  <td className="p-3">
                    <div className="font-bold text-[#F2F4F8]">Arun Kumar</div>
                    <div className="text-[10px] text-[#9AA6BD] font-mono">nandhakumar052007@gmail.com</div>
                  </td>
                  <td className="p-3 text-[#9AA6BD]">SMC Foundations (35%)</td>
                  <td className="p-3 font-mono text-[11px] text-[#3DDC97]">
                    Samsung Galaxy A54 (DEV-A54-8902)
                  </td>
                  <td className="p-3 font-mono text-[10px] text-[#9AA6BD]">
                    nandhakumar052007@okaxis • 1129930138
                  </td>
                  <td className="p-3">
                    <span className="bg-[#16382C] text-[#3DDC97] px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                      ACTIVE
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-[#212B42]/50">
                  <td className="p-3">
                    <div className="font-bold text-[#F2F4F8]">Karthik V.</div>
                    <div className="text-[10px] text-[#9AA6BD] font-mono">karthik.trader@gmail.com</div>
                  </td>
                  <td className="p-3 text-[#9AA6BD]">Order Blocks & Entries (80%)</td>
                  <td className="p-3 font-mono text-[11px] text-[#3DDC97]">
                    MacBook Pro M2 (DEV-MAC-9912)
                  </td>
                  <td className="p-3 font-mono text-[10px] text-[#9AA6BD]">
                    karthik.v@oksbi • 994018231
                  </td>
                  <td className="p-3">
                    <span className="bg-[#16382C] text-[#3DDC97] px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                      ACTIVE
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-[#212B42]/50">
                  <td className="p-3">
                    <div className="font-bold text-[#F2F4F8]">Priya Sundar</div>
                    <div className="text-[10px] text-[#9AA6BD] font-mono">priya.sundar@gmail.com</div>
                  </td>
                  <td className="p-3 text-[#9AA6BD]">Risk Mastery (100% Certified)</td>
                  <td className="p-3 font-mono text-[11px] text-[#3DDC97]">
                    Dell XPS 15 (DEV-DELL-4401)
                  </td>
                  <td className="p-3 font-mono text-[10px] text-[#9AA6BD]">
                    priya@okhdfcbank • 482910481
                  </td>
                  <td className="p-3">
                    <span className="bg-[#16382C] text-[#3DDC97] px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 6: SECURITY AUDIT LOG */}
      {activeTab === 'audit_log' && (
        <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 space-y-4">
          <div className="pb-3 border-b border-[#26304A]">
            <h3 className="text-base font-bold text-[#F2F4F8]">Immutable Security Audit Trail</h3>
            <p className="text-xs text-[#9AA6BD] mt-0.5">
              Section 36 Decision 8: All administrative actions, 2FA sign-ins, and payment approvals logged for minimum 1 year.
            </p>
          </div>

          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A] flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#E5A82B] bg-[#3A2D0C] px-1.5 py-0.2 rounded">
                      {log.action}
                    </span>
                    <span className="font-bold text-[#F2F4F8]">{log.actor}</span>
                    <span className="text-[10px] text-[#9AA6BD]">({log.actorRole})</span>
                    <span>•</span>
                    <span className="text-[10px] text-[#9AA6BD] font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-[#9AA6BD] text-[11px]">{log.details}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-[10px] text-[#9AA6BD] block">{log.ipAddress}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                    log.severity === 'critical' ? 'bg-[#3A1717] text-[#FF6B6B]' :
                    log.severity === 'high' ? 'bg-[#3A2D0C] text-[#E5A82B]' : 'bg-[#16382C] text-[#3DDC97]'
                  }`}>
                    {log.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2FA AUTHENTICATION SIMULATOR MODAL */}
      {showTwoFactorScreen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 bg-[#0F1522] border-b border-[#26304A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E5A82B]/20 border border-[#E5A82B]/50 flex items-center justify-center text-[#E5A82B]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F2F4F8]">Two-Factor Authentication</h3>
                  <span className="text-[11px] text-[#9AA6BD] font-mono">Decision 2: 6-Digit TOTP Required</span>
                </div>
              </div>
              <button onClick={() => setShowTwoFactorScreen(false)} className="text-[#9AA6BD] hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {authError && (
                <div className="p-3 bg-[#3A1717] border border-[#FF6B6B]/40 rounded-xl text-xs text-[#FF6B6B] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <p className="text-xs text-[#9AA6BD]">
                Enter the 6-digit verification code from your Google Authenticator or hardware security token to verify elevated permissions.
              </p>

              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div className="space-y-1.5 text-center">
                  <label className="text-xs font-mono text-[#9AA6BD] block">6-DIGIT CODE</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-48 mx-auto text-center font-mono text-2xl tracking-[0.5em] bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl py-2.5 text-[#F2F4F8] outline-none font-bold"
                  />
                  <span className="text-[10px] text-[#9AA6BD] block pt-1">
                    (Tip: Enter any 6 digits like 123456 to test pass)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#9AA6BD] pt-1">
                  <button
                    type="button"
                    onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
                    className="text-[#E5A82B] hover:underline"
                  >
                    {showRecoveryCodes ? 'Hide Recovery Codes' : 'Use 10 Recovery Codes'}
                  </button>
                  <span className="font-mono text-[10px]">Session: 15 min TTL</span>
                </div>

                {showRecoveryCodes && (
                  <div className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A] space-y-2 text-xs">
                    <span className="text-[10px] font-mono text-[#E5A82B] font-bold block">
                      Decision 3: 10 Emergency Recovery Codes
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-[#F2F4F8]">
                      {recoveryCodesList.map((c, i) => (
                        <div key={i} className="p-1 bg-[#1A2133] rounded text-center border border-[#26304A]">
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full touch-target py-2.5 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs shadow-lg shadow-[#E5A82B]/20"
                >
                  Verify Authenticator Code
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MUTE USER MODAL */}
      {muteModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1A2133] border border-[#FF6B6B]/40 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
              <div className="flex items-center gap-2 text-[#FF6B6B] font-bold text-sm">
                <VolumeX className="w-4 h-4" />
                <span>Mute Student: {muteModalTarget.reportedUserName}</span>
              </div>
              <button onClick={() => setMuteModalTarget(null)} className="text-[#9AA6BD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#F2F4F8] font-semibold block mb-1">Mute Duration:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['1h', '24h', '7d', 'permanent'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setMuteDuration(d)}
                      className={`py-2 rounded-lg font-mono font-bold text-center touch-target ${
                        muteDuration === d
                          ? 'bg-[#FF6B6B] text-white'
                          : 'bg-[#0B0F17] text-[#9AA6BD] border border-[#26304A]'
                      }`}
                    >
                      {d.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#F2F4F8] font-semibold block mb-1">Audit Justification Note:</label>
                <textarea
                  value={muteReason}
                  onChange={(e) => setMuteReason(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#26304A] rounded-xl p-2.5 text-xs text-[#F2F4F8] outline-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#26304A]">
                <button
                  onClick={() => setMuteModalTarget(null)}
                  className="touch-target px-3 py-1.5 text-xs text-[#9AA6BD]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onResolveReport(muteModalTarget.id, 'mute');
                    setMuteModalTarget(null);
                  }}
                  className="touch-target px-4 py-2 bg-[#FF6B6B] hover:bg-[#E05252] text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirm Mute Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
