import React from 'react';
import { UserProfile, StudentTab } from '../../types';
import { 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  GraduationCap, 
  Award, 
  Clock, 
  Lock, 
  ChevronRight,
  User,
  Mail,
  Phone
} from 'lucide-react';

interface StudentProfileViewProps {
  user: UserProfile;
  onSelectTab: (tab: StudentTab) => void;
  onRequestDeviceChange: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  user,
  onSelectTab,
  onRequestDeviceChange
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Profile Header Card */}
      <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-lg">
        <div className="relative">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-[#E5A82B] shadow-lg shadow-[#E5A82B]/20"
          />
          <div className="absolute -bottom-1 -right-1 bg-[#16382C] border border-[#3DDC97] p-1.5 rounded-full text-[#3DDC97]">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F2F4F8]">{user.name}</h1>
            <span className="bg-[#3A2D0C] text-[#E5A82B] text-[10px] font-mono px-2 py-0.5 rounded border border-[#E5A82B]/30 font-bold uppercase w-fit mx-auto sm:mx-0">
              Active SMC Student
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-[#9AA6BD] font-mono">
            <span className="flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#E5A82B]" /> {user.email}
            </span>
            <span className="flex items-center justify-center sm:justify-start gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#8FB0FF]" /> {user.phone}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span className="text-[11px] font-mono bg-[#16382C] text-[#3DDC97] px-2.5 py-1 rounded-full border border-[#3DDC97]/30 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Google Account Verified
            </span>
            <span className="text-[11px] font-mono bg-[#0B0F17] text-[#9AA6BD] px-2.5 py-1 rounded-full border border-[#26304A]">
              Member since Nov 2026
            </span>
          </div>
        </div>
      </div>

      {/* Account Settings & Quick Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Details Shortcut */}
        <div
          onClick={() => onSelectTab('payment_details')}
          className="bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] hover:border-[#E5A82B]/50 p-5 rounded-2xl cursor-pointer transition-all flex items-start justify-between gap-3 group shadow-md"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#E5A82B] font-bold text-sm">
              <CreditCard className="w-4 h-4" />
              <span>Section 38: Payment Details</span>
            </div>
            <p className="text-xs text-[#9AA6BD]">
              Google Pay UPI: <strong className="text-[#F2F4F8] font-mono">nandhakumar052007@okaxis</strong><br />
              Binance UID: <strong className="text-[#F2F4F8] font-mono">1129930138</strong>
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#9AA6BD] group-hover:text-[#E5A82B] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
        </div>

        {/* Hardware Device Security */}
        <div
          onClick={() => onSelectTab('device_security')}
          className="bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] hover:border-[#3DDC97]/50 p-5 rounded-2xl cursor-pointer transition-all flex items-start justify-between gap-3 group shadow-md"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#3DDC97] font-bold text-sm">
              <Smartphone className="w-4 h-4" />
              <span>Single Hardware Binding</span>
            </div>
            <p className="text-xs text-[#9AA6BD]">
              Active on: <strong className="text-[#F2F4F8]">{user.registeredDevice.deviceName}</strong><br />
              1-device policy strictly enforced. 24h migration hold.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#9AA6BD] group-hover:text-[#3DDC97] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
        </div>
      </div>

      {/* Academic Certifications & Record */}
      <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
          <h3 className="text-sm font-bold text-[#F2F4F8] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#E5A82B]" />
            <span>Academic Standing & Mentorship Cohort</span>
          </h3>
          <span className="text-xs font-mono text-[#3DDC97]">Good Standing</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A] flex justify-between items-center">
            <div>
              <span className="font-bold text-[#F2F4F8] block">Institutional SMC Mentorship with Rahul</span>
              <span className="text-[11px] text-[#9AA6BD]">Direct chart markup validation channel</span>
            </div>
            <span className="bg-[#16382C] text-[#3DDC97] px-2 py-0.5 rounded text-[10px] font-mono font-bold">
              AUTHORIZED
            </span>
          </div>

          <div className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A] flex justify-between items-center">
            <div>
              <span className="font-bold text-[#F2F4F8] block">SMC Foundations Certification</span>
              <span className="text-[11px] text-[#9AA6BD]">35% progress (8/24 Lessons completed)</span>
            </div>
            <span className="bg-[#3A2D0C] text-[#E5A82B] px-2 py-0.5 rounded text-[10px] font-mono font-bold">
              IN PROGRESS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
