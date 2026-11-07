import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface LegalDisclaimerProps {
  compact?: boolean;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-[#0F1522] border-t border-[#26304A] py-3 px-4 text-xs text-[#9AA6BD] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#3DDC97] shrink-0" />
          <span>Institutional SMC Academy • 100% Educational • 1 Device Security Active</span>
        </div>
        <div className="text-[11px] text-[#9AA6BD]/80">
          Not SEBI Registered Investment Advice • Trading Futures/FX involves risk of capital loss
        </div>
      </div>
    );
  }

  return (
    <footer className="mt-16 border-t border-[#26304A] bg-[#0F1522]/90 pt-8 pb-20 md:pb-8 text-xs text-[#9AA6BD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-[#26304A]/60">
          <div className="space-y-2 md:col-span-1">
            <span className="font-bold text-sm text-[#F2F4F8] tracking-wider">VYROX SMC ACADEMY</span>
            <p className="text-[#9AA6BD] text-xs leading-relaxed">
              Institutional Order Flow and Smart Money Concepts (SMC) Theory structured education platform.
            </p>
          </div>
          <div>
            <span className="font-semibold text-xs text-[#F2F4F8] uppercase tracking-wider block mb-2">Curriculum</span>
            <ul className="space-y-1 text-xs text-[#9AA6BD]">
              <li>Market Structure (BOS & CHoCH)</li>
              <li>Order Blocks & Mitigations</li>
              <li>Liquidity Engineering (BSL/SSL)</li>
              <li>Risk & Asymmetry R:R</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-xs text-[#F2F4F8] uppercase tracking-wider block mb-2">Account & Safety</span>
            <ul className="space-y-1 text-xs text-[#9AA6BD]">
              <li>Single Device Policy (Hardware Locked)</li>
              <li>24-Hour Device Reassignment Hold</li>
              <li>Direct Mentor Verification</li>
              <li>Encrypted Payment Credentials</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-xs text-[#F2F4F8] uppercase tracking-wider block mb-2">Academy Support</span>
            <p className="text-xs text-[#9AA6BD]">
              Mentorship hours: Mon - Fri (09:00 - 18:00 IST)<br />
              Emergency verification: support@vyrox-academy.com
            </p>
          </div>
        </div>

        {/* Regulatory & Risk Box */}
        <div className="p-4 rounded-xl bg-[#1A2133]/60 border border-[#26304A] space-y-2">
          <div className="flex items-center gap-2 text-[#E5A82B] font-semibold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Statutory Regulatory Notice & SEBI Risk Warning</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#9AA6BD]">
            <strong className="text-[#F2F4F8]">Educational Purpose Only:</strong> VYROX, its mentors, instructors, and community participants provide technical market structure analysis exclusively for academic and illustrative purposes. VYROX is not registered with the Securities and Exchange Board of India (SEBI) as a Research Analyst or Registered Investment Advisor (RIA). Under no circumstances should any chart markup, mentorship session, live stream, or community message be construed as financial advice, buy/sell recommendations, or solicitation.
          </p>
          <p className="text-[11px] leading-relaxed text-[#9AA6BD]/90">
            <strong className="text-[#F2F4F8]">Capital Risk Disclosure:</strong> Trading foreign exchange (Forex), contracts for difference (CFDs), cryptocurrency derivatives, and equities carries substantial risk and may result in the loss of your entire invested capital. Past performance demonstrated in historical chart case studies is not indicative of future market results. Trade only with risk capital you can afford to lose.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#9AA6BD]/70 pt-2 gap-2">
          <div>© {new Date().getFullYear()} VYROX Smart Money Concepts. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy & Device Policy</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">SEBI Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
