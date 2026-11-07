import React from 'react';
import { Logo } from './Logo';
import { AppRole, StudentTab, UserProfile } from '../../types';
import { ShieldCheck, Smartphone, Bell, User, Search, ShieldAlert, Sparkles, Video } from 'lucide-react';

interface HeaderProps {
  currentRole: AppRole;
  onRoleChange: (role: AppRole) => void;
  activeStudentTab: StudentTab;
  onSelectStudentTab: (tab: StudentTab) => void;
  user: UserProfile;
  unreadChatCount: number;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeStudentTab: _activeStudentTab,
  onSelectStudentTab,
  user,
  unreadChatCount,
  onOpenNotifications
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F1522]/95 backdrop-blur-md border-b border-[#26304A] px-4 lg:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Brand Lockup */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onSelectStudentTab('home')} 
            className="flex items-center touch-target focus:outline-none focus:ring-2 focus:ring-[#E5A82B]/50 rounded-lg"
            aria-label="VYROX Home"
          >
            <Logo variant="full" />
          </button>
        </div>

        {/* Global Search Bar (Desktop & Tablet) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA6BD]" />
            <input
              type="text"
              placeholder="Search order blocks, BOS, liquidity lessons, mentors..."
              className="w-full bg-[#1A2133] border border-[#26304A] focus:border-[#E5A82B] focus:ring-1 focus:ring-[#E5A82B] rounded-lg pl-10 pr-4 py-2 text-xs text-[#F2F4F8] placeholder-[#9AA6BD]/60 transition-all outline-none"
            />
          </div>
        </div>

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Device Security Badge */}
          <button
            onClick={() => onSelectStudentTab('device_security')}
            className="hidden sm:flex items-center gap-2 bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] px-3 py-1.5 rounded-lg text-xs transition-colors group touch-target"
            title="Registered Hardware Device: 1 device active"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#3DDC97]" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-[#9AA6BD] font-mono leading-none">DEVICE SECURED</span>
              <span className="text-xs text-[#F2F4F8] font-medium leading-tight flex items-center gap-1">
                A54 5G <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC97] inline-block animate-pulse"></span>
              </span>
            </div>
          </button>

          {/* Role Switcher Pill (Switch between Student, Mentor Studio, and Admin Control Suite) */}
          <div className="flex items-center bg-[#1A2133] border border-[#26304A] p-0.5 rounded-lg">
            <button
              onClick={() => onRoleChange('student')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all touch-target ${
                currentRole === 'student'
                  ? 'bg-[#E5A82B] text-[#0B0F17] shadow-sm font-bold'
                  : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => onRoleChange('mentor')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all touch-target flex items-center gap-1 ${
                currentRole === 'mentor'
                  ? 'bg-[#16382C] text-[#3DDC97] border border-[#3DDC97]/40 shadow-sm font-bold'
                  : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#3DDC97]" />
              <span>Mentor</span>
            </button>
            <button
              onClick={() => onRoleChange('owner_admin')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all touch-target flex items-center gap-1.5 ${
                currentRole !== 'student' && currentRole !== 'mentor'
                  ? 'bg-[#1E2A4A] text-[#8FB0FF] border border-[#8FB0FF]/40 shadow-sm font-bold'
                  : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#E5A82B]" />
              <span>Admin</span>
            </button>
          </div>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] text-[#9AA6BD] hover:text-[#F2F4F8] transition-colors touch-target"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E5A82B] text-[#0B0F17] font-bold text-[10px] rounded-full flex items-center justify-center">
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar / Shortcut */}
          <button
            onClick={() => onSelectStudentTab('profile')}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-lg bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] transition-colors touch-target group"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-[#E5A82B]/40 group-hover:border-[#E5A82B]"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#F2F4F8] group-hover:text-[#E5A82B] transition-colors">
                {user.name}
              </span>
              <span className="text-[10px] text-[#3DDC97] flex items-center gap-1 font-mono">
                <ShieldCheck className="w-2.5 h-2.5" /> Google Verified
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
