import React, { useState } from 'react';
import { Course, UserProfile } from '../../types';
import { Star, CheckCircle, Clock, BookOpen, ArrowRight, ShieldCheck, Play } from 'lucide-react';

interface CourseCatalogViewProps {
  courses: Course[];
  user: UserProfile;
  onEnroll: (course: Course) => void;
  onOpenPlayer: (courseId: string, lessonId: string) => void;
}

export const CourseCatalogView: React.FC<CourseCatalogViewProps> = ({
  courses,
  user,
  onEnroll,
  onOpenPlayer
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Professional'>('All');

  const filteredCourses = selectedLevel === 'All' 
    ? courses 
    : courses.filter(c => c.level === selectedLevel);

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#F2F4F8] tracking-tight">
          Smart Money Concepts (SMC) Curriculum Catalog
        </h1>
        <p className="text-xs text-[#9AA6BD] mt-1 max-w-2xl">
          Structured institutional trading education from foundational market structure to advanced liquidity engineering, order block refinement, and risk asymmetry.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', 'Beginner', 'Intermediate', 'Professional'] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`touch-target px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              selectedLevel === lvl
                ? 'bg-[#E5A82B] text-[#0B0F17] font-bold shadow-md shadow-[#E5A82B]/20'
                : 'bg-[#1A2133] hover:bg-[#212B42] text-[#9AA6BD] border border-[#26304A]'
            }`}
          >
            {lvl === 'All' ? 'All SMC Courses' : `${lvl} Level`}
          </button>
        ))}
      </div>

      {/* Courses Detailed List */}
      <div className="space-y-6">
        {filteredCourses.map((course) => {
          const isEnrolled = user.enrolledCourseIds.includes(course.id);

          return (
            <div
              key={course.id}
              className="bg-[#1A2133] border border-[#26304A] hover:border-[#E5A82B]/50 rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex flex-col sm:flex-row gap-5">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full sm:w-56 h-36 rounded-xl object-cover border border-[#26304A] shrink-0"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-[#3A2D0C] text-[#E5A82B] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border border-[#E5A82B]/30 uppercase">
                        {course.badge}
                      </span>
                      <span className="text-xs text-[#9AA6BD] font-mono">
                        {course.level} Tier
                      </span>
                      <span className="text-xs text-[#E5A82B] font-mono flex items-center gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" /> {course.rating}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#F2F4F8]">
                      {course.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#9AA6BD] leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#9AA6BD] font-mono pt-1">
                      <span>{course.lessons.length} HD Lessons</span>
                      <span>•</span>
                      <span>Tamil & English CC</span>
                      <span>•</span>
                      <span>1-on-1 Mentorship Included</span>
                    </div>
                  </div>
                </div>

                {/* Price and CTA Column */}
                <div className="lg:w-60 bg-[#0F1522] p-4 rounded-xl border border-[#26304A] space-y-3 shrink-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#9AA6BD] font-mono block">ONE-TIME TUITION</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-[#F2F4F8] font-mono">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                      {course.originalPrice && (
                        <span className="text-xs text-[#9AA6BD] line-through font-mono">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#3DDC97] flex items-center gap-1 mt-1 font-mono">
                      <ShieldCheck className="w-3 h-3" /> Hardware Verified License
                    </span>
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={() => onOpenPlayer(course.id, course.lessons[0].id)}
                      className="w-full touch-target py-2.5 rounded-xl bg-[#1A2133] hover:bg-[#26304A] text-[#E5A82B] border border-[#E5A82B]/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Continue Course</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onEnroll(course)}
                      className="w-full touch-target py-2.5 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E5A82B]/20 transition-all"
                    >
                      <span>Enroll in Course</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Learning Outcomes Checklist */}
              <div className="p-4 bg-[#0F1522] rounded-xl border border-[#26304A] space-y-2">
                <span className="text-[11px] font-mono uppercase text-[#E5A82B] font-bold block">
                  Core Execution Outcomes:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#9AA6BD]">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-[#3DDC97] font-bold">✓</span>
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
