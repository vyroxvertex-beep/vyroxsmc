import React from 'react';
import { MembershipPlan, MEMBERSHIP_PLANS_LIST, formatInr } from '../../data/membershipPricing';
import { UserProfile } from '../../types';
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  Crown, 
  Clock, 
  Sparkles, 
  CreditCard, 
  Smartphone, 
  Lock, 
  Video, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';

interface MembershipPlansViewProps {
  user: UserProfile;
  onSelectPlanToCheckout: (plan: MembershipPlan) => void;
}

export const MembershipPlansView: React.FC<MembershipPlansViewProps> = ({
  user,
  onSelectPlanToCheckout
}) => {
  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 bg-[#E5A82B]/20 border border-[#E5A82B]/40 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold text-[#E5A82B]">
          <Crown className="w-3.5 h-3.5" />
          <span>OFFICIAL VYROX INSTITUTIONAL MEMBERSHIP</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F2F4F8] tracking-tight">
          Master Smart Money Concepts with Verified Mentors
        </h1>

        <p className="text-xs sm:text-sm text-[#9AA6BD] leading-relaxed">
          Transparent, centralized pricing with zero hidden fees. All membership tiers grant complete access to the 12 specialized mentor video categories and community trading rooms.
        </p>
      </div>

      {/* Pricing Cards Grid (Monthly ₹119 | Quarterly ₹319 | Yearly ₹1,119) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {MEMBERSHIP_PLANS_LIST.map((plan) => {
          const isQuarterly = plan.id === 'quarterly';
          const isYearly = plan.id === 'yearly';

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                isQuarterly
                  ? 'bg-gradient-to-b from-[#1E2A4A] via-[#1A2133] to-[#0F1522] border-2 border-[#E5A82B] shadow-2xl shadow-[#E5A82B]/15 md:-translate-y-2'
                  : 'bg-[#1A2133] border border-[#26304A] hover:border-[#26304A]/90 shadow-xl'
              }`}
            >
              {/* Top Badges */}
              {plan.savingsBadge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E5A82B] text-[#0B0F17] text-[10px] font-mono font-bold px-3 py-0.5 rounded-full shadow-md whitespace-nowrap uppercase">
                  {plan.savingsBadge}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-[#F2F4F8]">
                    {plan.name}
                  </h3>
                  <span className="text-[11px] font-mono bg-[#0B0F17] px-2.5 py-0.5 rounded-full border border-[#26304A] text-[#9AA6BD]">
                    {plan.durationLabel}
                  </span>
                </div>

                {/* Price Display */}
                <div className="pt-2 border-t border-[#26304A]/60">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-[#F2F4F8] font-mono">
                      {formatInr(plan.price)}
                    </span>
                    {plan.regularPrice && (
                      <span className="text-sm font-mono text-[#9AA6BD] line-through">
                        {formatInr(plan.regularPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#E5A82B] font-mono font-semibold block mt-0.5">
                    {plan.perMonthLabel}
                  </span>
                </div>

                <p className="text-xs text-[#9AA6BD] leading-relaxed">
                  {plan.description}
                </p>

                {/* Features List */}
                <div className="space-y-2.5 pt-3 border-t border-[#26304A]/60">
                  <span className="text-[10px] font-mono uppercase text-[#9AA6BD] block font-semibold">
                    Included Benefits:
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#F2F4F8]">
                      <div className="w-4 h-4 rounded-full bg-[#16382C] text-[#3DDC97] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout CTA Button */}
              <div className="pt-6 mt-6 border-t border-[#26304A]">
                <button
                  onClick={() => onSelectPlanToCheckout(plan)}
                  className={`w-full touch-target py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isQuarterly
                      ? 'bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] shadow-[#E5A82B]/25 hover:scale-[1.02]'
                      : 'bg-[#212B42] hover:bg-[#26304A] text-[#F2F4F8] hover:border-[#E5A82B]/40'
                  }`}
                >
                  <span>Select {plan.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Verification Guarantees */}
      <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-5 shadow-lg">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#16382C] border border-[#3DDC97]/40 flex items-center justify-center text-[#3DDC97] shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#F2F4F8]">Strict 1-Device Policy</h4>
            <p className="text-[11px] text-[#9AA6BD] mt-1 leading-relaxed">
              Your account is cryptographically bound to 1 registered hardware token to prevent unauthorized credential sharing.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#1E2A4A] border border-[#8FB0FF]/40 flex items-center justify-center text-[#8FB0FF] shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#F2F4F8]">Zero Fraud Payment Verification</h4>
            <p className="text-[11px] text-[#9AA6BD] mt-1 leading-relaxed">
              Payments validated via Google Pay UPI reference and Binance UID ledger with server-side validation.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#3A2D0C] border border-[#E5A82B]/40 flex items-center justify-center text-[#E5A82B] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#F2F4F8]">SEBI Educational Standard</h4>
            <p className="text-[11px] text-[#9AA6BD] mt-1 leading-relaxed">
              Strictly non-advisory technical market analysis. We teach you how to fish—never tips, signals, or guaranteed returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
