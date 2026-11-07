import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { 
  CreditCard, 
  Smartphone, 
  Copy, 
  Check, 
  Edit3, 
  ShieldCheck, 
  AlertCircle, 
  Lock, 
  Clock, 
  HelpCircle,
  QrCode,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface SettingsPaymentViewProps {
  user: UserProfile;
  onUpdatePaymentDetails: (gpay: string, binance: string) => void;
  onRequestDeviceChange: () => void;
}

export const SettingsPaymentView: React.FC<SettingsPaymentViewProps> = ({
  user,
  onUpdatePaymentDetails,
  onRequestDeviceChange
}) => {
  const [activeTab, setActiveTab] = useState<'payment' | 'device'>('payment');

  // Copy state feedbacks
  const [gpayCopied, setGpayCopied] = useState(false);
  const [binanceCopied, setBinanceCopied] = useState(false);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editGpay, setEditGpay] = useState(user.paymentDetails.gpayUpiId);
  const [editBinance, setEditBinance] = useState(user.paymentDetails.binanceUid);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopyGpay = () => {
    navigator.clipboard.writeText(user.paymentDetails.gpayUpiId);
    setGpayCopied(true);
    setTimeout(() => setGpayCopied(false), 2500);
  };

  const handleCopyBinance = () => {
    navigator.clipboard.writeText(user.paymentDetails.binanceUid);
    setBinanceCopied(true);
    setTimeout(() => setBinanceCopied(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation matching design review Section 38
    if (!editGpay.includes('@')) {
      setValidationError('Please enter a valid Google Pay UPI ID containing "@" (e.g. username@okaxis).');
      return;
    }

    if (!/^\d{8,12}$/.test(editBinance.trim())) {
      setValidationError('Binance UID must be an 8 to 12 digit numeric user identifier.');
      return;
    }

    onUpdatePaymentDetails(editGpay.trim(), editBinance.trim());
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#26304A] pb-3">
        <button
          onClick={() => setActiveTab('payment')}
          className={`touch-target px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'payment'
              ? 'bg-[#1A2133] text-[#E5A82B] border border-[#E5A82B]/40 shadow-sm'
              : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Details (GPay & Binance)</span>
        </button>

        <button
          onClick={() => setActiveTab('device')}
          className={`touch-target px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'device'
              ? 'bg-[#1A2133] text-[#E5A82B] border border-[#E5A82B]/40 shadow-sm'
              : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Hardware Device Security</span>
        </button>
      </div>

      {activeTab === 'payment' ? (
        <div className="space-y-6">
          {/* Header Title & Notice */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F2F4F8] tracking-tight">
              Settings / Payment Details
            </h1>
            <p className="text-xs text-[#9AA6BD] mt-1">
              Visible only to you and authorized academy settlement administrators. Never displayed on your public profile or community chat.
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3.5 bg-[#16382C] border border-[#3DDC97]/40 rounded-xl text-xs text-[#3DDC97] flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Payment credentials updated successfully and logged in your security audit trail.</span>
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-4">
              {/* Card 1: Google Pay (GPay) */}
              <div className="bg-[#1A2133] border border-[#26304A] hover:border-[#26304A]/90 rounded-2xl p-5 space-y-4 shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#0F1522] border border-[#26304A] flex items-center justify-center font-bold text-xs text-[#8FB0FF]">
                      GPay
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#F2F4F8]">Google Pay (GPay)</h3>
                      <span className="text-[11px] text-[#9AA6BD]">Payment ID / UPI ID</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#3DDC97] bg-[#16382C] px-2 py-0.5 rounded border border-[#3DDC97]/30">
                    Active
                  </span>
                </div>

                {/* Value Box */}
                <div className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A] font-mono text-xs sm:text-sm text-[#F2F4F8] break-all select-all font-semibold">
                  {user.paymentDetails.gpayUpiId}
                </div>

                {/* Actions: 44px min touch target */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleCopyGpay}
                    className={`touch-target flex-1 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      gpayCopied
                        ? 'bg-[#16382C] text-[#3DDC97] border border-[#3DDC97]'
                        : 'bg-[#212B42] hover:bg-[#26304A] text-[#F2F4F8] border border-[#26304A]'
                    }`}
                    aria-label="Copy Google Pay UPI ID"
                  >
                    {gpayCopied ? (
                      <>
                        <Check className="w-4 h-4 text-[#3DDC97]" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#E5A82B]" />
                        <span>Copy UPI ID</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="touch-target px-5 py-2.5 rounded-xl bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] text-xs font-semibold text-[#9AA6BD] hover:text-[#F2F4F8] flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Binance */}
              <div className="bg-[#1A2133] border border-[#26304A] hover:border-[#26304A]/90 rounded-2xl p-5 space-y-4 shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#0F1522] border border-[#26304A] flex items-center justify-center font-bold text-xs text-[#E5A82B]">
                      BIN
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#F2F4F8]">Binance Pay</h3>
                      <span className="text-[11px] text-[#9AA6BD]">Binance User ID (UID)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#3DDC97] bg-[#16382C] px-2 py-0.5 rounded border border-[#3DDC97]/30">
                    Active
                  </span>
                </div>

                {/* Value Box */}
                <div className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A] font-mono text-xs sm:text-sm text-[#F2F4F8] select-all font-semibold tracking-wider">
                  {user.paymentDetails.binanceUid}
                </div>

                {/* Actions: 44px min touch target */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleCopyBinance}
                    className={`touch-target flex-1 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      binanceCopied
                        ? 'bg-[#16382C] text-[#3DDC97] border border-[#3DDC97]'
                        : 'bg-[#212B42] hover:bg-[#26304A] text-[#F2F4F8] border border-[#26304A]'
                    }`}
                    aria-label="Copy Binance UID"
                  >
                    {binanceCopied ? (
                      <>
                        <Check className="w-4 h-4 text-[#3DDC97]" />
                        <span>Copied UID!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#E5A82B]" />
                        <span>Copy Binance UID</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="touch-target px-5 py-2.5 rounded-xl bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] text-xs font-semibold text-[#9AA6BD] hover:text-[#F2F4F8] flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Form with Real-time Validation */
            <form onSubmit={handleSave} className="bg-[#1A2133] border border-[#E5A82B]/50 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
                <h3 className="text-sm font-bold text-[#F2F4F8]">Edit Payment Identifiers</h3>
                <span className="text-xs text-[#9AA6BD] font-mono">Requires verification check</span>
              </div>

              {validationError && (
                <div className="p-3 bg-[#3A1717] border border-[#FF6B6B]/40 rounded-xl text-xs text-[#FF6B6B] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F4F8] block">
                  Google Pay UPI ID
                </label>
                <input
                  type="text"
                  value={editGpay}
                  onChange={(e) => setEditGpay(e.target.value)}
                  placeholder="e.g. yourname@okaxis"
                  className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] focus:ring-1 focus:ring-[#E5A82B] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F2F4F8] outline-none font-mono"
                  required
                />
                <span className="text-[10px] text-[#9AA6BD]">Must be a valid bank UPI virtual payment address</span>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-[#F2F4F8] block">
                  Binance UID (Numeric User ID)
                </label>
                <input
                  type="text"
                  value={editBinance}
                  onChange={(e) => setEditBinance(e.target.value)}
                  placeholder="e.g. 1129930138"
                  className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] focus:ring-1 focus:ring-[#E5A82B] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F2F4F8] outline-none font-mono"
                  required
                />
                <span className="text-[10px] text-[#9AA6BD]">Locate in your Binance App Profile → User ID</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#26304A]">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setValidationError(null);
                  }}
                  className="touch-target px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA6BD] hover:text-[#F2F4F8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-6 py-2 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs transition-all shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Privacy & Security Disclosures Box */}
          <div className="p-4 rounded-xl bg-[#0F1522] border border-[#26304A] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F2F4F8]">
              <Lock className="w-3.5 h-3.5 text-[#3DDC97]" />
              <span>Section 38 Institutional Security Standards</span>
            </div>
            <ul className="text-[11px] text-[#9AA6BD] space-y-1 list-disc pl-4 leading-relaxed">
              <li>Identifiers are stored encrypted at rest with multi-tenant separation.</li>
              <li>Every add, copy, or edit is recorded in the immutable audit log with timestamp and actor ID.</li>
              <li>Only authorized settlement administrators can review payment proofs for course enrollment.</li>
            </ul>
          </div>
        </div>
      ) : (
        /* Hardware Device Security Tab */
        <div className="space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F2F4F8] tracking-tight">
              Hardware Device Security
            </h1>
            <p className="text-xs text-[#9AA6BD] mt-1">
              Strict 1-device policy enforced to safeguard institutional course intellectual property and prevent account sharing.
            </p>
          </div>

          {/* Active Device Card */}
          <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#16382C] border border-[#3DDC97]/40 flex items-center justify-center text-[#3DDC97]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F2F4F8] flex items-center gap-2">
                    {user.registeredDevice.deviceName}
                    <span className="w-2 h-2 rounded-full bg-[#3DDC97] inline-block animate-ping" />
                  </h3>
                  <span className="text-[11px] font-mono text-[#9AA6BD]">
                    Hardware Fingerprint: {user.registeredDevice.id}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono text-[#3DDC97] bg-[#16382C] px-2.5 py-1 rounded-full border border-[#3DDC97]/30 font-bold">
                AUTHORIZED ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A]">
                <span className="text-[10px] text-[#9AA6BD] block font-mono">OPERATING SYSTEM</span>
                <span className="text-xs font-semibold text-[#F2F4F8]">{user.registeredDevice.os}</span>
              </div>
              <div className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A]">
                <span className="text-[10px] text-[#9AA6BD] block font-mono">REGISTERED IP</span>
                <span className="text-xs font-semibold text-[#F2F4F8] font-mono">{user.registeredDevice.ipAddress}</span>
              </div>
              <div className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#9AA6BD] block font-mono">LOCATION</span>
                <span className="text-xs font-semibold text-[#F2F4F8] truncate block">{user.registeredDevice.location}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#26304A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-[#9AA6BD] flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#3DDC97]" /> Last session ping: {user.registeredDevice.lastActive}
              </span>

              <button
                onClick={onRequestDeviceChange}
                className="touch-target px-4 py-2 rounded-xl bg-[#212B42] hover:bg-[#26304A] border border-[#26304A] text-xs font-semibold text-[#E5A82B] flex items-center justify-center gap-2 transition-colors"
              >
                <span>Request Device Migration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Device Policy Explanation Banner */}
          <div className="p-4 rounded-xl bg-[#1A2133]/60 border border-[#26304A] space-y-2 text-xs text-[#9AA6BD]">
            <div className="flex items-center gap-2 text-[#E5A82B] font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>Institutional Device Policy Guidelines</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              • To protect proprietary order flow strategies, student accounts are bound to <strong>exactly one active primary device</strong>.
            </p>
            <p className="leading-relaxed text-[11px]">
              • If you upgrade your phone or computer, submit a migration request. To prevent credentials cycling, migrations undergo a <strong>24-hour verification review</strong> before the previous hardware key is revoked.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
