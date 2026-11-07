import React from 'react';
import { StudentTab } from '../../types';
import { Home, GraduationCap, MessageSquare, MoreHorizontal, Users } from 'lucide-react';

interface BottomNavProps {
  activeTab: StudentTab;
  onSelectTab: (tab: StudentTab) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  unreadCount = 0
}) => {
  const tabs = [
    { id: 'home' as StudentTab, label: 'Home', icon: Home },
    { id: 'learning' as StudentTab, label: 'Learning', icon: GraduationCap },
    { id: 'community' as StudentTab, label: 'Discuss', icon: Users },
    { id: 'mentorship' as StudentTab, label: 'Chat', icon: MessageSquare, hasBadge: unreadCount > 0 },
    { id: 'payment_details' as StudentTab, label: 'Settings', icon: MoreHorizontal }
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-[#0F1522]/98 backdrop-blur-lg border-t border-[#26304A] z-40 px-2 flex items-center justify-around shadow-2xl"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center touch-target flex-1 transition-all relative ${
              isActive 
                ? 'text-[#E5A82B]' 
                : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
            }`}
            aria-label={tab.label}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              {tab.hasBadge && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#E5A82B] rounded-full ring-2 ring-[#0F1522]" />
              )}
            </div>
            <span className={`text-[11px] mt-1 font-medium tracking-tight ${
              isActive ? 'font-bold text-[#E5A82B]' : ''
            }`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute bottom-1 w-6 h-0.5 bg-[#E5A82B] rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
