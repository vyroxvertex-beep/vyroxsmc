import React, { useState } from 'react';
import { DeviceInfo } from '../../types';
import { Smartphone, AlertTriangle, ShieldCheck, Clock, X, Check } from 'lucide-react';

interface DeviceChangeModalProps {
  currentDevice: DeviceInfo;
  onClose: () => void;
  onSubmitRequest: (reason: string, newDeviceModel: string) => void;
}

export const DeviceChangeModal: React.FC<DeviceChangeModalProps> = ({
  currentDevice,
  onClose,
  onSubmitRequest
}) => {
  const [reason, setReason] = useState('Purchased new hardware phone/laptop');
  const [newDeviceModel, setNewDeviceModel] = useState('Apple iPhone 15 Pro (iOS 17)');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRequest(reason, newDeviceModel);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 bg-[#0F1522] border-b border-[#26304A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E5A82B]/20 border border-[#E5A82B]/50 flex items-center justify-center text-[#E5A82B]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F2F4F8]">Device Migration Request</h3>
              <span className="text-[11px] text-[#9AA6BD] font-mono">1-Device Authorization Policy</span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#9AA6BD] hover:text-white p-1 touch-target">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#16382C] border border-[#3DDC97]/40 flex items-center justify-center mx-auto text-[#3DDC97]">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#F2F4F8]">Migration Request Dispatched</h4>
              <p className="text-xs text-[#9AA6BD] leading-relaxed">
                Your request has entered the <strong>24-hour verification window</strong>. The academy security desk has been notified.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Device Details */}
              <div className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A] space-y-1 text-xs">
                <span className="text-[10px] text-[#9AA6BD] font-mono block">CURRENT ACTIVE HARDWARE</span>
                <span className="font-bold text-[#F2F4F8] block">{currentDevice.deviceName}</span>
                <span className="text-[11px] text-[#9AA6BD] font-mono">{currentDevice.os} • {currentDevice.ipAddress}</span>
              </div>

              {/* Form fields */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F4F8] block">Reason for Migration</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-3 py-2 text-xs text-[#F2F4F8] outline-none"
                >
                  <option>Purchased new hardware phone/laptop</option>
                  <option>Previous device lost or damaged</option>
                  <option>Operating system reinstalled / Factory reset</option>
                  <option>Primary browser / station update</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F4F8] block">New Target Device Model</label>
                <input
                  type="text"
                  required
                  value={newDeviceModel}
                  onChange={(e) => setNewDeviceModel(e.target.value)}
                  placeholder="e.g. Apple MacBook Air M2 / iPhone 15"
                  className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-3 py-2 text-xs text-[#F2F4F8] outline-none"
                />
              </div>

              {/* Warning Notice (Section 36 24h wait) */}
              <div className="p-3 bg-[#3A2D0C]/60 border border-[#E5A82B]/40 rounded-xl space-y-1.5 text-xs text-[#E5A82B]">
                <div className="flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>24-Hour Security Quarantine</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#9AA6BD]">
                  To prevent multi-user account pooling, a 24-hour verification window applies before old hardware credentials are fully revoked.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#26304A]">
                <button
                  type="button"
                  onClick={onClose}
                  className="touch-target px-4 py-2 text-xs text-[#9AA6BD] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-5 py-2 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs"
                >
                  Submit Migration Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
