import React from 'react';
import { Course, UserProfile } from '../../types';
import { Play, CheckCircle, Clock, BookOpen, Award, ArrowRight } from 'lucide-react';

interface MyLearningViewProps {
  user: UserProfile;
  courses: Course[];
  onOpenPlayer: (courseId: string, lessonId: string) => void;
  onExploreCourses: () => void;
}

export const MyLearningView: React.FC<MyLearningViewProps> = ({
  user,
  courses,
  onOpenPlayer,
  onExploreCourses
}) => {
  const enrolledCourses = courses.filter(c => user.enrolledCourseIds.includes(c.id));

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#F2F4F8] tracking-tight">
          My Learning Dashboard
        </h1>
        <p className="text-xs text-[#9AA6BD] mt-1">
          Track your progress through institutional SMC modules, video completion, and certification milestones.
        </p>
      </div>

      {/* Progress Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1A2133] border border-[#26304A] p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-[#9AA6BD]">ENROLLED COURSES</span>
          <div className="text-xl font-bold text-[#F2F4F8] font-mono">{enrolledCourses.length}</div>
          <span className="text-[10px] text-[#3DDC97]">Active Academic Access</span>
        </div>

        <div className="bg-[#1A2133] border border-[#26304A] p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-[#9AA6BD]">COMPLETED LESSONS</span>
          <div className="text-xl font-bold text-[#E5A82B] font-mono">
            {user.completedLessonIds.length} <span className="text-xs text-[#9AA6BD]">/ 24</span>
          </div>
          <span className="text-[10px] text-[#9AA6BD]">35% Overall Syllabus Completion</span>
        </div>

        <div className="bg-[#1A2133] border border-[#26304A] p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-[#9AA6BD]">CERTIFICATION STATUS</span>
          <div className="text-base font-bold text-[#F2F4F8] flex items-center gap-1.5 pt-0.5">
            <Award className="w-4 h-4 text-[#E5A82B]" />
            <span>In Progress</span>
          </div>
          <span className="text-[10px] text-[#9AA6BD]">Complete all 24 lessons to qualify</span>
        </div>
      </div>

      {/* Enrolled Courses List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#F2F4F8]">Enrolled Modules</h3>

        {enrolledCourses.map((course) => {
          const completedInThisCourse = course.lessons.filter(l => user.completedLessonIds.includes(l.id)).length;
          const percent = Math.round((completedInThisCourse / course.lessons.length) * 100);

          return (
            <div
              key={course.id}
              className="bg-[#1A2133] border border-[#26304A] hover:border-[#E5A82B]/50 rounded-2xl p-5 space-y-4 shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-20 h-20 rounded-xl object-cover border border-[#26304A] shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#3A2D0C] text-[#E5A82B] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#E5A82B]/30 uppercase">
                        {course.badge}
                      </span>
                      <span className="text-xs text-[#3DDC97] flex items-center gap-1 font-mono">
                        <CheckCircle className="w-3 h-3" /> Hardware Verified
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#F2F4F8] mt-1">
                      {course.title}
                    </h4>

                    <span className="text-xs text-[#9AA6BD] font-mono block mt-0.5">
                      {completedInThisCourse} of {course.lessons.length} lessons finished ({percent}%)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenPlayer(course.id, course.lessons[0].id)}
                  className="touch-target px-5 py-2.5 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#E5A82B]/20"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Open Video Classroom</span>
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-[#0B0F17] rounded-full overflow-hidden border border-[#26304A]">
                <div
                  className="h-full bg-gradient-to-r from-[#E5A82B] to-[#FFE082]"
                  style={{ width: `${Math.max(percent, 5)}%` }}
                />
              </div>

              {/* Lessons breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                {course.lessons.map((lesson, idx) => {
                  const isDone = user.completedLessonIds.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onOpenPlayer(course.id, lesson.id)}
                      className={`text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors touch-target ${
                        isDone
                          ? 'bg-[#16382C]/30 border-[#3DDC97]/30 text-[#3DDC97]'
                          : 'bg-[#0B0F17] border-[#26304A] text-[#9AA6BD] hover:text-[#F2F4F8] hover:border-[#E5A82B]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px]">{idx + 1}.</span>
                        <span className="truncate">{lesson.title.replace(/^\d+\.\s*/, '')}</span>
                      </div>
                      {isDone && <CheckCircle className="w-3.5 h-3.5 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explore More Curriculum Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1E2A4A] via-[#1A2133] to-[#0F1522] border border-[#26304A] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-[#F2F4F8]">Expand Your Edge to Order Blocks & High-Probability Entries</h4>
          <p className="text-xs text-[#9AA6BD] mt-1 max-w-xl">
            Advance beyond market structure into breaker blocks, inducement sweeps, and sniper LTF confirmation execution.
          </p>
        </div>
        <button
          onClick={onExploreCourses}
          className="touch-target px-5 py-2.5 rounded-xl bg-[#1A2133] hover:bg-[#212B42] text-[#E5A82B] border border-[#E5A82B]/40 font-bold text-xs flex items-center gap-2 shrink-0 transition-colors"
        >
          <span>Explore All Courses</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
