import React from 'react';
import { StudentTab } from '../../types';
import { 
  Home, 
  GraduationCap, 
  BookOpen, 
  MessageSquare, 
  Users, 
  CreditCard, 
  Smartphone, 
  UserCheck, 
  ChevronRight,
  TrendingUp,
  FileCheck,
  Video,
  Crown
} from 'lucide-react';

interface SidebarProps {
  activeTab: StudentTab;
  onSelectTab: (tab: StudentTab) => void;
  unreadMentorshipCount?: number;
  isEnrolledInSMC: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadMentorshipCount = 1,
  isEnrolledInSMC
}) => {
  const academyNavItems = [
    {
      id: 'home' as StudentTab,
      label: 'Home & Feed',
      icon: Home,
      badge: null
    },
    {
      id: 'mentor_videos' as StudentTab,
      label: 'Mentor Video Library',
      icon: Video,
      badge: '12 Focus',
      highlight: true
    },
    {
      id: 'membership' as StudentTab,
      label: 'Membership Plans',
      icon: Crown,
      badge: '₹119/mo'
    },
    {
      id: 'learning' as StudentTab,
      label: 'My Learning',
      icon: GraduationCap,
      badge: isEnrolledInSMC ? '35%' : null
    },
    {
      id: 'catalog' as StudentTab,
      label: 'SMC Courses',
      icon: BookOpen,
      badge: '4'
    },
    {
      id: 'mentorship' as StudentTab,
      label: '1-on-1 Mentorship',
      icon: MessageSquare,
      badge: unreadMentorshipCount > 0 ? `${unreadMentorshipCount}` : null
    },
    {
      id: 'community' as StudentTab,
      label: 'Trading Discussions',
      icon: Users,
      badge: '12 Cats'
    }
  ];

  const securityNavItems = [
    {
      id: 'payment_details' as StudentTab,
      label: 'Payment Details',
      icon: CreditCard,
      badge: 'GPay/Binance'
    },
    {
      id: 'device_security' as StudentTab,
      label: 'Device Security',
      icon: Smartphone,
      badge: '1 Device'
    },
    {
      id: 'profile' as StudentTab,
      label: 'Student Account',
      icon: UserCheck,
      badge: null
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-56 lg:w-64 bg-[#0F1522] border-r border-[#26304A] shrink-0 min-h-[calc(100vh-65px)] p-3">
      {/* Academy Live Status Banner */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#1A2133] to-[#16213A] border border-[#26304A] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3DDC97] animate-ping" />
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#F2F4F8] leading-none">London / NY Desk</span>
            <span className="text-[10px] text-[#9AA6BD] font-mono mt-0.5">Live Market Active</span>
          </div>
        </div>
        <TrendingUp className="w-4 h-4 text-[#E5A82B]" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        <div className="text-[10px] uppercase font-mono tracking-wider text-[#9AA6BD] px-3 py-1 font-semibold">
          Trading Academy
        </div>

        {academyNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full touch-target px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all group ${
                isActive
                  ? 'bg-[#1A2133] text-[#E5A82B] border-l-4 border-[#E5A82B] shadow-sm font-semibold'
                  : 'text-[#9AA6BD] hover:text-[#F2F4F8] hover:bg-[#1A2133]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-[#E5A82B]' : 'text-[#9AA6BD]'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    item.highlight
                      ? 'bg-[#E5A82B] text-[#0B0F17]'
                      : item.badge === 'Live'
                      ? 'bg-[#16382C] text-[#3DDC97] border border-[#3DDC97]/30'
                      : 'bg-[#26304A] text-[#9AA6BD]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 text-[10px] uppercase font-mono tracking-wider text-[#9AA6BD] px-3 py-1 font-semibold">
          Security & Payments
        </div>

        {securityNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full touch-target px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all group ${
                isActive
                  ? 'bg-[#1A2133] text-[#E5A82B] border-l-4 border-[#E5A82B] shadow-sm font-semibold'
                  : 'text-[#9AA6BD] hover:text-[#F2F4F8] hover:bg-[#1A2133]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-[#E5A82B]' : 'text-[#9AA6BD]'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#26304A] text-[#9AA6BD] font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Institutional Mentorship Card in Sidebar */}
      <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-b from-[#1A2133] to-[#0F1522] border border-[#E5A82B]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#E5A82B]/5 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-2 text-xs font-bold text-[#E5A82B]">
          <FileCheck className="w-4 h-4" />
          <span>SMC Mentorship Batch</span>
        </div>
        <p className="text-[11px] text-[#9AA6BD] mt-1 leading-snug">
          Direct weekly live chart reviews & trade markups with mentor Rahul.
        </p>
        <button
          onClick={() => onSelectTab('mentorship')}
          className="mt-3 w-full py-2 px-3 rounded-lg bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors touch-target"
        >
          <span>Open Chat Channel</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
