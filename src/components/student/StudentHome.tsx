import React, { useState } from 'react';
import { UserProfile, Course, StudentTab } from '../../types';
import { FREE_INTRO_VIDEOS } from '../../data/mockData';
import { 
  Play, 
  Clock, 
  BookOpen, 
  Star, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  MessageSquare,
  Smartphone,
  CreditCard,
  ChevronRight,
  TrendingUp,
  Volume2,
  Users,
  Video,
  Crown,
  Tag
} from 'lucide-react';
import { MEMBERSHIP_PLANS, formatInr } from '../../data/membershipPricing';

interface StudentHomeProps {
  user: UserProfile;
  courses: Course[];
  onSelectTab: (tab: StudentTab) => void;
  onOpenPlayer: (courseId: string, lessonId: string) => void;
  onEnrollCourse: (course: Course) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  user,
  courses,
  onSelectTab,
  onOpenPlayer,
  onEnrollCourse
}) => {
  const [activeFreeVideoIdx, setActiveFreeVideoIdx] = useState(0);

  // Active enrolled course
  const enrolledCourse = courses.find(c => c.id === user.activeCourseId) || courses[0];
  const activeLesson = enrolledCourse?.lessons.find(l => l.id === user.activeLessonId) || enrolledCourse?.lessons[1];

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome & Live Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#1A2133] via-[#16213A] to-[#0F1522] p-5 sm:p-6 rounded-2xl border border-[#26304A]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#E5A82B] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL SMC PORTAL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F2F4F8] tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6BD] mt-1 max-w-xl">
            You are enrolled in <strong className="text-[#F2F4F8]">SMC Foundations</strong>. Follow the daily order flow discipline and submit your chart markups to Rahul for feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('mentorship')}
            className="touch-target px-4 py-2.5 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#E5A82B]/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Mentor Rahul</span>
          </button>
        </div>
      </div>

      {/* Continue Watching Section (Highlight Card) */}
      <section aria-labelledby="continue-watching-heading">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 bg-[#E5A82B] rounded-sm" />
            <h2 id="continue-watching-heading" className="text-base sm:text-lg font-bold text-[#F2F4F8]">
              Continue Watching
            </h2>
          </div>
          <span className="text-xs text-[#9AA6BD] font-mono">35% Completed (8/24 Lessons)</span>
        </div>

        <div className="bg-[#1A2133] border border-[#26304A] hover:border-[#E5A82B]/50 transition-all rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg group">
          {/* Thumbnail with Overlay Scrim */}
          <div className="relative w-full md:w-72 h-44 sm:h-40 rounded-xl overflow-hidden shrink-0 border border-[#26304A]">
            <img
              src={enrolledCourse.thumbnail}
              alt={activeLesson?.title || 'SMC Lesson'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17]/90 via-[#0B0F17]/30 to-transparent flex items-center justify-center">
              <button
                onClick={() => onOpenPlayer(enrolledCourse.id, activeLesson.id)}
                className="w-12 h-12 rounded-full bg-[#E5A82B] text-[#0B0F17] flex items-center justify-center shadow-xl shadow-[#E5A82B]/30 group-hover:scale-110 transition-transform touch-target"
                aria-label="Resume Lesson"
              >
                <Play className="w-6 h-6 fill-current ml-1" />
              </button>
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[11px] font-mono text-white/90 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
              <span>Resume at 04:12</span>
              <span>12:40 total</span>
            </div>
            {/* Scrubber indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#26304A]">
              <div className="h-full bg-[#E5A82B] w-[35%]" />
            </div>
          </div>

          {/* Lesson Details */}
          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#3A2D0C] text-[#E5A82B] border border-[#E5A82B]/30">
                Current Lesson
              </span>
              <span className="text-xs text-[#9AA6BD]">
                {enrolledCourse.title}
              </span>
              <span className="text-xs text-[#3DDC97] flex items-center gap-1 font-mono">
                <CheckCircle className="w-3 h-3" /> Tamil & English Subtitles
              </span>
            </div>

            <h3 className="text-base sm:text-xl font-bold text-[#F2F4F8] group-hover:text-[#E5A82B] transition-colors">
              {activeLesson?.title || '2. Introduction to Institutional Order Flow'}
            </h3>

            <p className="text-xs sm:text-sm text-[#9AA6BD] line-clamp-2">
              {activeLesson?.description}
            </p>

            {/* Key takeaway chips */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[11px] bg-[#0F1522] border border-[#26304A] px-2.5 py-1 rounded text-[#9AA6BD]">
                • Buy-Side Liquidity (BSL)
              </span>
              <span className="text-[11px] bg-[#0F1522] border border-[#26304A] px-2.5 py-1 rounded text-[#9AA6BD]">
                • Institutional Accumulation
              </span>
              <span className="text-[11px] bg-[#0F1522] border border-[#26304A] px-2.5 py-1 rounded text-[#9AA6BD]">
                • Stop Run Mechanics
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => onOpenPlayer(enrolledCourse.id, activeLesson.id)}
              className="w-full md:w-auto touch-target px-6 py-3 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E5A82B]/20 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Lesson</span>
            </button>
          </div>
        </div>
      </section>

      {/* Free Introduction Videos (Mobile Carousel with Snap / Desktop 4-grid) */}
      <section aria-labelledby="free-intro-heading">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 bg-[#8FB0FF] rounded-sm" />
            <div>
              <h2 id="free-intro-heading" className="text-base sm:text-lg font-bold text-[#F2F4F8]">
                Free Introduction Lessons
              </h2>
              <span className="text-xs text-[#9AA6BD]">Zero cost preview • Master the core theory before enrolling</span>
            </div>
          </div>
          <span className="text-xs font-mono text-[#8FB0FF] bg-[#1E2A4A] px-2.5 py-1 rounded-full border border-[#8FB0FF]/30 hidden sm:inline-block">
            Free Access
          </span>
        </div>

        {/* Carousel Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FREE_INTRO_VIDEOS.map((video, idx) => (
            <div
              key={video.id}
              onClick={() => {
                setActiveFreeVideoIdx(idx);
                onOpenPlayer('course_smc_foundations', 'lesson_f1');
              }}
              className="bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] hover:border-[#8FB0FF]/50 rounded-xl p-3 flex flex-col justify-between transition-all cursor-pointer group shadow-md"
            >
              <div className="relative rounded-lg overflow-hidden h-36 bg-[#0B0F17] mb-3">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#1E2A4A]/90 text-[#8FB0FF] group-hover:bg-[#E5A82B] group-hover:text-[#0B0F17] flex items-center justify-center transition-all shadow-md">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-1.5 right-1.5 bg-black/80 font-mono text-[10px] text-white px-2 py-0.5 rounded">
                  {video.duration}
                </span>
                <span className="absolute top-1.5 left-1.5 bg-[#1E2A4A]/90 text-[#8FB0FF] text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                  FREE
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#F2F4F8] group-hover:text-[#8FB0FF] transition-colors line-clamp-2">
                  {video.title}
                </h4>
                <p className="text-[11px] text-[#9AA6BD] mt-1 line-clamp-2">
                  {video.summary}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#26304A]/70 flex items-center justify-between text-[11px] text-[#9AA6BD]">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" /> {video.duration}
                </span>
                <span className="text-[#8FB0FF] font-semibold group-hover:underline">
                  Watch Free →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Paid Institutional SMC Curriculum Grid */}
      <section aria-labelledby="smc-courses-heading">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 bg-[#E5A82B] rounded-sm" />
            <div>
              <h2 id="smc-courses-heading" className="text-base sm:text-lg font-bold text-[#F2F4F8]">
                Institutional SMC Curriculum
              </h2>
              <span className="text-xs text-[#9AA6BD]">Comprehensive algorithmic market maker theory and execution</span>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('catalog')}
            className="text-xs text-[#E5A82B] hover:text-[#C48D17] font-semibold flex items-center gap-1 touch-target"
          >
            <span>View All Syllabus</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const isEnrolled = user.enrolledCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                className="bg-[#1A2133] border border-[#26304A] hover:border-[#E5A82B]/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-md"
              >
                <div>
                  {/* Card Thumbnail */}
                  <div className="relative h-44 overflow-hidden bg-[#0B0F17]">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A2133] via-transparent to-black/30" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-[#3A2D0C] text-[#E5A82B] border border-[#E5A82B]/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                        {course.badge}
                      </span>
                      <span className="bg-[#0F1522]/80 backdrop-blur-xs text-[10px] text-[#F2F4F8] px-2 py-0.5 rounded font-mono">
                        {course.level}
                      </span>
                    </div>

                    {isEnrolled && (
                      <div className="absolute top-3 right-3 bg-[#16382C] text-[#3DDC97] border border-[#3DDC97]/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                        <CheckCircle className="w-3 h-3" /> Enrolled
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#9AA6BD]">
                      <span className="flex items-center gap-1 text-[#E5A82B] font-bold font-mono">
                        <Star className="w-3.5 h-3.5 fill-current" /> {course.rating}
                      </span>
                      <span>•</span>
                      <span>{course.lessons.length} Lessons</span>
                      <span>•</span>
                      <span>{course.studentCount} Students</span>
                    </div>

                    <h3 className="text-base font-bold text-[#F2F4F8] group-hover:text-[#E5A82B] transition-colors leading-snug">
                      {course.title}
                    </h3>

                    <p className="text-xs text-[#9AA6BD] line-clamp-2">
                      {course.tagline}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1 pt-1">
                      {course.learningOutcomes.slice(0, 2).map((outcome, i) => (
                        <div key={i} className="text-[11px] text-[#9AA6BD] flex items-center gap-1.5">
                          <span className="text-[#3DDC97] font-bold">✓</span>
                          <span className="truncate">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer & Action */}
                <div className="p-4 sm:p-5 pt-0 border-t border-[#26304A]/60 mt-3 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#9AA6BD] font-mono block">TUITION FEE</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base sm:text-lg font-bold text-[#F2F4F8] font-mono">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                      {course.originalPrice && (
                        <span className="text-xs text-[#9AA6BD] line-through font-mono">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={() => onOpenPlayer(course.id, course.lessons[0].id)}
                      className="touch-target px-4 py-2 rounded-xl bg-[#1A2133] hover:bg-[#26304A] text-[#E5A82B] border border-[#E5A82B]/40 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onEnrollCourse(course)}
                      className="touch-target px-4 py-2 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#E5A82B]/20"
                    >
                      <span>Enroll Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Institutional Membership Plans Widget */}
      <section aria-labelledby="membership-plans-heading" className="bg-gradient-to-r from-[#1A2133] via-[#211E10] to-[#1A2133] border border-[#E5A82B]/40 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E5A82B] text-[#0B0F17] flex items-center gap-1">
                <Crown className="w-3 h-3" /> OFFICIAL MEMBERSHIP PRICING
              </span>
              <span className="text-[11px] font-mono text-[#3DDC97] flex items-center gap-1">
                <Tag className="w-3 h-3" /> Coupons Accepted
              </span>
            </div>
            <h3 id="membership-plans-heading" className="text-lg sm:text-xl font-bold text-[#F2F4F8]">
              Upgrade Your VYROX Institutional Trading Access
            </h3>
            <p className="text-xs sm:text-sm text-[#9AA6BD]">
              Access mentor video library, live doubt sessions, institutional order flow breakdowns, and automated signals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('membership')}
              className="touch-target px-5 py-3 rounded-xl bg-gradient-to-r from-[#E5A82B] to-[#F3C358] text-[#0B0F17] font-bold text-xs sm:text-sm flex items-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-[#E5A82B]/20 shrink-0"
            >
              <Crown className="w-4 h-4" />
              <span>Explore Plans (From ₹119/mo)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Plan price summary chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-[#E5A82B]/20">
          {Object.values(MEMBERSHIP_PLANS).map(plan => (
            <div 
              key={plan.id}
              onClick={() => onSelectTab('membership')}
              className="p-3.5 bg-[#0B0F17]/80 rounded-xl border border-[#26304A] hover:border-[#E5A82B] transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#F2F4F8] group-hover:text-[#E5A82B] transition-colors">{plan.name}</span>
                  {plan.savingsBadge && (
                    <span className="text-[9px] font-mono font-bold bg-[#3A2D0C] text-[#E5A82B] px-1.5 py-0.2 rounded border border-[#E5A82B]/30">
                      {plan.savingsBadge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#9AA6BD]">{plan.durationLabel}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-[#E5A82B]">
                  {formatInr(plan.price)}
                </div>
                <span className="text-[10px] text-[#3DDC97]">{plan.perMonthLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access Tiles */}
      <section aria-labelledby="quick-actions-heading" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Mentor Video Library Tile */}
        <div
          onClick={() => onSelectTab('mentor_videos')}
          className="bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] hover:border-[#E5A82B]/60 p-4 rounded-xl cursor-pointer transition-all flex items-start gap-3.5 group shadow-sm"
        >
          <div className="w-10 h-10 rounded-lg bg-[#E5A82B]/10 border border-[#E5A82B]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5 text-[#E5A82B]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-[#F2F4F8] group-hover:text-[#E5A82B] transition-colors">
                Mentor Video Library
              </h4>
              <span className="text-[9px] font-mono font-bold bg-[#E5A82B] text-[#0B0F17] px-1.5 py-0.2 rounded">12 Cats</span>
            </div>
            <p className="text-[11px] text-[#9AA6BD] mt-0.5">
              12 categories: SMC, BOS/CHOCH, Liquidity, 0.5x–2x player speed, PiP & auto-resume.
            </p>
          </div>
        </div>

        {/* Trading Discussions Community Tile */}
        <div
          onClick={() => onSelectTab('community')}
          className="bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] hover:border-[#8FB0FF]/60 p-4 rounded-xl cursor-pointer transition-all flex items-start gap-3.5 group shadow-sm"
        >
          <div className="w-10 h-10 rounded-lg bg-[#1E2A4A] border border-[#8FB0FF]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5 text-[#8FB0FF]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-[#F2F4F8] group-hover:text-[#8FB0FF] transition-colors">
                Trading Discussions
              </h4>
              <span className="text-[9px] font-mono font-bold bg-[#8FB0FF] text-[#0B0F17] px-1.5 py-0.2 rounded">Community</span>
            </div>
            <p className="text-[11px] text-[#9AA6BD] mt-0.5">
              12 discussion categories: Chart markups, SMC models, Trade setups, and psychology.
            </p>
          </div>
        </div>

        {/* Mentorship Tile */}
        <div
          onClick={() => onSelectTab('mentorship')}
          className="bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] hover:border-[#3DDC97]/40 p-4 rounded-xl cursor-pointer transition-all flex items-start gap-3.5 group shadow-sm"
        >
          <div className="w-10 h-10 rounded-lg bg-[#16382C] border border-[#3DDC97]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5 text-[#3DDC97]" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-[#F2F4F8] group-hover:text-[#3DDC97] transition-colors">
              1-on-1 Chart Feedback
            </h4>
            <p className="text-[11px] text-[#9AA6BD] mt-0.5">
              Submit your marked BOS & Order Block screenshots to Rahul for direct validation.
            </p>
          </div>
        </div>

        {/* Payment Details Tile */}
        <div
          onClick={() => onSelectTab('payment_details')}
          className="bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] hover:border-[#E5A82B]/40 p-4 rounded-xl cursor-pointer transition-all flex items-start gap-3.5 group shadow-sm"
        >
          <div className="w-10 h-10 rounded-lg bg-[#3A2D0C] border border-[#E5A82B]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CreditCard className="w-5 h-5 text-[#E5A82B]" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-[#F2F4F8] group-hover:text-[#E5A82B] transition-colors">
              Payment Details (GPay & Binance)
            </h4>
            <p className="text-[11px] text-[#9AA6BD] mt-0.5">
              Instant 1-tap copy of Google Pay UPI and Binance UID with verification receipt status.
            </p>
          </div>
        </div>

        {/* Device Security Tile */}
        <div
          onClick={() => onSelectTab('device_security')}
          className="bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] hover:border-[#8FB0FF]/40 p-4 rounded-xl cursor-pointer transition-all flex items-start gap-3.5 group shadow-sm"
        >
          <div className="w-10 h-10 rounded-lg bg-[#1E2A4A] border border-[#8FB0FF]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Smartphone className="w-5 h-5 text-[#8FB0FF]" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-[#F2F4F8] group-hover:text-[#8FB0FF] transition-colors">
              Hardware Device Security
            </h4>
            <p className="text-[11px] text-[#9AA6BD] mt-0.5">
              Strict 1-device policy active. Bound to Samsung Galaxy A54. Request migration if needed.
            </p>
          </div>
        </div>

        {/* Membership Plans Tile */}
        <div
          onClick={() => onSelectTab('membership')}
          className="bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] hover:border-[#E5A82B]/50 p-4 rounded-xl cursor-pointer transition-all flex items-start gap-3.5 group shadow-sm"
        >
          <div className="w-10 h-10 rounded-lg bg-[#3A2D0C] border border-[#E5A82B]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Crown className="w-5 h-5 text-[#E5A82B]" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-[#F2F4F8] group-hover:text-[#E5A82B] transition-colors">
              Membership Plans & Coupons
            </h4>
            <p className="text-[11px] text-[#9AA6BD] mt-0.5">
              Monthly ₹119, Quarterly ₹319, Yearly ₹1,119. Apply active discount codes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
