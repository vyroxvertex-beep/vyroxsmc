import React, { useState } from 'react';
import { Coupon, CouponRedemption, CouponAnalytics } from '../../types';
import { 
  Percent, 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  Search,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';

interface AdminCouponManagerProps {
  coupons: Coupon[];
  redemptions: CouponRedemption[];
  analytics: CouponAnalytics;
  onCreateCoupon: (couponData: Partial<Coupon>) => void;
  onUpdateCoupon: (couponId: string, couponData: Partial<Coupon>) => void;
  onDeleteCoupon: (couponId: string) => void;
  onToggleStatus: (couponId: string) => void;
}

export const AdminCouponManager: React.FC<AdminCouponManagerProps> = ({
  coupons,
  redemptions,
  analytics,
  onCreateCoupon,
  onUpdateCoupon,
  onDeleteCoupon,
  onToggleStatus
}) => {
  const [activeTab, setActiveTab] = useState<'coupons' | 'redemptions'>('coupons');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [applicablePlans, setApplicablePlans] = useState<'all' | 'monthly' | 'quarterly' | 'yearly'>('all');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [perUserLimit, setPerUserLimit] = useState<number>(1);
  const [minPurchaseAmount, setMinPurchaseAmount] = useState<number>(100);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | undefined>(150);
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(20);
    setApplicablePlans('all');
    setStartDate(new Date().toISOString().split('T')[0]);
    setExpiryDate('2026-12-31');
    setUsageLimit(100);
    setPerUserLimit(1);
    setMinPurchaseAmount(100);
    setMaxDiscountAmount(150);
    setDescription('');
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue);
    setApplicablePlans(c.applicablePlans);
    setStartDate(c.startDate);
    setExpiryDate(c.expiryDate);
    setUsageLimit(c.usageLimit);
    setPerUserLimit(c.perUserLimit);
    setMinPurchaseAmount(c.minPurchaseAmount);
    setMaxDiscountAmount(c.maxDiscountAmount);
    setDescription(c.description || '');
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length < 3) {
      setFormError('Coupon code must be at least 3 characters long.');
      return;
    }

    if (discountValue <= 0) {
      setFormError('Discount value must be greater than zero.');
      return;
    }

    if (discountType === 'percentage' && discountValue > 100) {
      setFormError('Percentage discount cannot exceed 100%.');
      return;
    }

    const payload: Partial<Coupon> = {
      code: cleanCode,
      discountType,
      discountValue: Number(discountValue),
      applicablePlans,
      startDate,
      expiryDate,
      usageLimit: Number(usageLimit),
      perUserLimit: Number(perUserLimit),
      minPurchaseAmount: Number(minPurchaseAmount),
      maxDiscountAmount: discountType === 'percentage' && maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
      description: description.trim() || `${cleanCode} discount voucher`
    };

    if (editingCoupon) {
      onUpdateCoupon(editingCoupon.id, payload);
    } else {
      onCreateCoupon(payload);
    }

    setShowModal(false);
  };

  // Filtered coupons
  const filteredCoupons = coupons.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.code.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#1A2133] border border-[#26304A] p-4 rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Total Coupons</span>
          <span className="text-xl font-bold text-[#F2F4F8]">{analytics.totalCoupons}</span>
        </div>

        <div className="bg-[#1A2133] border border-[#26304A] p-4 rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Active Coupons</span>
          <span className="text-xl font-bold text-[#3DDC97]">{analytics.activeCoupons}</span>
        </div>

        <div className="bg-[#1A2133] border border-[#26304A] p-4 rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Expired / Inactive</span>
          <span className="text-xl font-bold text-[#FF6B6B]">{analytics.expiredCoupons}</span>
        </div>

        <div className="bg-[#1A2133] border border-[#26304A] p-4 rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Redemptions</span>
          <span className="text-xl font-bold text-[#8FB0FF]">{analytics.totalRedemptions}</span>
        </div>

        <div className="bg-[#1A2133] border border-[#26304A] p-4 rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Total Discounts</span>
          <span className="text-xl font-bold text-[#E5A82B]">
            ₹{analytics.totalDiscountProvided.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-[#1A2133] border border-[#26304A] p-4 rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Top Coupon</span>
          <span className="text-xs font-mono font-bold text-[#F2F4F8] truncate block">
            {analytics.mostFrequentCoupon}
          </span>
        </div>
      </div>

      {/* Control Header & Action Bar */}
      <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('coupons')}
            className={`touch-target px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'coupons'
                ? 'bg-[#E5A82B] text-[#0B0F17] shadow-sm'
                : 'bg-[#0B0F17] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Configured Coupons ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('redemptions')}
            className={`touch-target px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'redemptions'
                ? 'bg-[#E5A82B] text-[#0B0F17] shadow-sm'
                : 'bg-[#0B0F17] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Usage History ({redemptions.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#9AA6BD] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coupon code..."
              className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F2F4F8] placeholder-[#9AA6BD]/60 outline-none"
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="touch-target px-4 py-2 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#E5A82B]/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Main Content: Coupons Table vs Redemptions History */}
      {activeTab === 'coupons' ? (
        <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0F1522] border-b border-[#26304A] text-[#9AA6BD] uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-4">Coupon Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Applicable Plans</th>
                  <th className="p-4">Usage Limit</th>
                  <th className="p-4">Validity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26304A]/60 font-sans">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-[#212B42]/50 transition-colors">
                    {/* Code & Description */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#F2F4F8] bg-[#0B0F17] px-2.5 py-1 rounded-md border border-[#26304A]">
                          {coupon.code}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#9AA6BD] line-clamp-1 mt-1">
                        {coupon.description}
                      </span>
                    </td>

                    {/* Discount Value */}
                    <td className="p-4 font-mono font-bold">
                      {coupon.discountType === 'percentage' ? (
                        <span className="text-[#3DDC97]">
                          {coupon.discountValue}% OFF
                          {coupon.maxDiscountAmount && (
                            <span className="text-[10px] text-[#9AA6BD] block font-normal">
                              Max ₹{coupon.maxDiscountAmount}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-[#E5A82B]">
                          Flat ₹{coupon.discountValue} OFF
                        </span>
                      )}
                    </td>

                    {/* Applicable Plans */}
                    <td className="p-4 font-mono text-[11px]">
                      <span className="bg-[#1E2A4A] text-[#8FB0FF] px-2 py-0.5 rounded border border-[#8FB0FF]/30 font-semibold uppercase">
                        {coupon.applicablePlans}
                      </span>
                    </td>

                    {/* Usage Progress */}
                    <td className="p-4 font-mono text-xs">
                      <div>
                        <span className="font-bold text-[#F2F4F8]">{coupon.usedCount}</span>
                        <span className="text-[#9AA6BD]"> / {coupon.usageLimit}</span>
                      </div>
                      <div className="w-24 h-1.5 bg-[#0B0F17] rounded-full overflow-hidden mt-1 border border-[#26304A]">
                        <div
                          className="h-full bg-[#E5A82B]"
                          style={{ width: `${Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100)}%` }}
                        />
                      </div>
                    </td>

                    {/* Validity Range */}
                    <td className="p-4 font-mono text-[11px] text-[#9AA6BD]">
                      <span>{coupon.startDate}</span>
                      <span className="block text-[#F2F4F8]">to {coupon.expiryDate}</span>
                    </td>

                    {/* Status Pill */}
                    <td className="p-4">
                      <button
                        onClick={() => onToggleStatus(coupon.id)}
                        className={`touch-target px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-colors ${
                          coupon.status === 'active'
                            ? 'bg-[#16382C] text-[#3DDC97] border-[#3DDC97]/40 hover:bg-[#3DDC97]/20'
                            : 'bg-[#3A1717] text-[#FF6B6B] border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/20'
                        }`}
                        title="Click to toggle status"
                      >
                        {coupon.status.toUpperCase()}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(coupon)}
                          className="touch-target p-1.5 rounded-lg bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A] transition-colors"
                          title="Edit coupon"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete coupon "${coupon.code}"?`)) {
                              onDeleteCoupon(coupon.id);
                            }
                          }}
                          className="touch-target p-1.5 rounded-lg bg-[#3A1717] hover:bg-[#4D1E1E] text-[#FF6B6B] border border-[#FF6B6B]/30 transition-colors"
                          title="Delete coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Redemptions History Table */
        <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0F1522] border-b border-[#26304A] text-[#9AA6BD] uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Coupon</th>
                  <th className="p-4">Plan Selected</th>
                  <th className="p-4">Original</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Paid Amount</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Order Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26304A]/60 font-sans">
                {redemptions.map((red) => (
                  <tr key={red.id} className="hover:bg-[#212B42]/50 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-[#F2F4F8] block">{red.studentName}</span>
                      <span className="text-[10px] font-mono text-[#9AA6BD]">{red.studentEmail}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#E5A82B]">
                      {red.couponCode}
                    </td>
                    <td className="p-4 font-mono text-xs text-[#8FB0FF]">
                      {red.planName}
                    </td>
                    <td className="p-4 font-mono text-[#9AA6BD]">
                      ₹{red.originalPrice}
                    </td>
                    <td className="p-4 font-mono text-[#3DDC97] font-bold">
                      -₹{red.discountAmount}
                    </td>
                    <td className="p-4 font-mono font-bold text-[#F2F4F8]">
                      ₹{red.finalPaidAmount}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#9AA6BD]">
                      {red.redeemedAt}
                    </td>
                    <td className="p-4 font-mono text-[10px] text-[#9AA6BD]">
                      {red.orderRef}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl max-w-lg w-full my-auto overflow-hidden shadow-2xl space-y-0">
            <div className="p-4 sm:p-5 bg-[#0F1522] border-b border-[#26304A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#E5A82B]" />
                <h3 className="text-sm sm:text-base font-bold text-[#F2F4F8]">
                  {editingCoupon ? 'Edit Coupon Code' : 'Create New Discount Coupon'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#9AA6BD] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-[#3A1717] border border-[#FF6B6B]/40 rounded-xl text-xs text-[#FF6B6B] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F4F8]">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VYROX20, SMC100"
                  className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-4 py-2.5 text-xs text-[#F2F4F8] font-mono outline-none uppercase"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F4F8]">Discount Type *</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-3 py-2.5 text-xs text-[#F2F4F8] outline-none"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F4F8]">
                    Discount Value {discountType === 'percentage' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={discountType === 'percentage' ? 100 : 5000}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-4 py-2.5 text-xs text-[#F2F4F8] font-mono outline-none"
                  />
                </div>
              </div>

              {/* Applicable Plans & Min Purchase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F4F8]">Applicable Plans</label>
                  <select
                    value={applicablePlans}
                    onChange={(e) => setApplicablePlans(e.target.value as any)}
                    className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-3 py-2.5 text-xs text-[#F2F4F8] outline-none"
                  >
                    <option value="all">All Plans (Monthly, Quarterly, Yearly)</option>
                    <option value="monthly">Monthly Plan Only (₹119)</option>
                    <option value="quarterly">Quarterly Plan Only (₹319)</option>
                    <option value="yearly">Yearly Plan Only (₹1,119)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F4F8]">Min Purchase Amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={minPurchaseAmount}
                    onChange={(e) => setMinPurchaseAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-4 py-2.5 text-xs text-[#F2F4F8] font-mono outline-none"
                  />
                </div>
              </div>

              {/* Max Discount (if percentage) */}
              {discountType === 'percentage' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F4F8]">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={maxDiscountAmount || ''}
                    onChange={(e) => setMaxDiscountAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="e.g. 150 (Leave blank for no limit)"
                    className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-4 py-2.5 text-xs text-[#F2F4F8] font-mono outline-none"
                  />
                </div>
              )}

              {/* Validity Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F4F8]">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-3 py-2 text-xs text-[#F2F4F8] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F4F8]">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-3 py-2 text-xs text-[#F2F4F8] outline-none"
                  />
                </div>
              </div>

              {/* Usage Limits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F4F8]">Total Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(parseInt(e.target.value) || 100)}
                    className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-4 py-2.5 text-xs text-[#F2F4F8] font-mono outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F4F8]">Per-User Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={perUserLimit}
                    onChange={(e) => setPerUserLimit(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-4 py-2.5 text-xs text-[#F2F4F8] font-mono outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F4F8]">Description / Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 20% discount across all membership tiers"
                  className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl p-2.5 text-xs text-[#F2F4F8] outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#26304A]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="touch-target px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA6BD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-5 py-2.5 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs flex items-center gap-2 shadow-md shadow-[#E5A82B]/20"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCoupon ? 'Update Coupon' : 'Create Coupon'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
