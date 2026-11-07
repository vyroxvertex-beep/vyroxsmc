import React, { useState, useEffect } from 'react';
import { Course, Lesson, SubtitleTrack } from '../../types';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  RotateCw, 
  Maximize2, 
  Settings, 
  Subtitles, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  List, 
  FileText, 
  ShieldCheck, 
  AlertTriangle,
  Download,
  Share2
} from 'lucide-react';

interface VideoPlayerViewProps {
  course: Course;
  initialLessonId: string;
  completedLessonIds: string[];
  onToggleCompleteLesson: (lessonId: string) => void;
  onBackToCourse: () => void;
  onSelectLesson: (lessonId: string) => void;
}

export const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({
  course,
  initialLessonId,
  completedLessonIds,
  onToggleCompleteLesson,
  onBackToCourse,
  onSelectLesson
}) => {
  const currentLessonIndex = course.lessons.findIndex(l => l.id === initialLessonId);
  const activeLesson: Lesson = course.lessons[currentLessonIndex >= 0 ? currentLessonIndex : 0];

  // Playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(252); // default 04:12
  const totalDuration = (activeLesson.durationMinutes * 60) + activeLesson.durationSeconds;
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState('1080p (Auto)');
  const [selectedSubtitle, setSelectedSubtitle] = useState<'off' | 'en' | 'ta' | 'tanglish'>('ta');
  const [showCurriculumDrawer, setShowCurriculumDrawer] = useState(true);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'notes' | 'resources'>('curriculum');
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showCCMenu, setShowCCMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const isCompleted = completedLessonIds.includes(activeLesson.id);

  // Auto tick timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalDuration]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Find active subtitle cue
  const activeTrack = activeLesson.subtitles?.find(s => s.id === selectedSubtitle);
  const activeCue = activeTrack?.cues?.find(c => currentTime >= c.start && currentTime <= c.end);

  const progressPercentage = (currentTime / totalDuration) * 100;

  const nextLesson = course.lessons[currentLessonIndex + 1];
  const prevLesson = course.lessons[currentLessonIndex - 1];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToCourse}
          className="flex items-center gap-2 text-xs font-semibold text-[#9AA6BD] hover:text-[#E5A82B] transition-colors touch-target"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Course Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9AA6BD] font-mono hidden sm:inline-block">
            Lesson {currentLessonIndex + 1} of {course.lessons.length}
          </span>
          <button
            onClick={() => setShowCurriculumDrawer(!showCurriculumDrawer)}
            className="touch-target px-3 py-1.5 rounded-lg bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] text-xs font-semibold text-[#F2F4F8] flex items-center gap-2"
          >
            <List className="w-4 h-4 text-[#E5A82B]" />
            <span>{showCurriculumDrawer ? 'Hide Playlist' : 'Show Playlist'}</span>
          </button>
        </div>
      </div>

      {/* Main Video & Playlist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Player & Meta */}
        <div className={`${showCurriculumDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
          {/* 16:9 Institutional Player Container */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#070A0F] border border-[#26304A] shadow-2xl flex flex-col justify-end group select-none">
            {/* Simulated Institutional Chart Video Background */}
            <div className="absolute inset-0 z-0">
              <img
                src={course.thumbnail}
                alt={activeLesson.title}
                className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1]"
              />
              {/* Dynamic Chart Grid Overlay simulating TradingView / Institutional terminal */}
              <div className="absolute inset-0 bg-[radial-gradient(#26304A_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

              {/* Simulated SMC Watermark & Live Candle Movement */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#0B0F17]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#26304A]">
                <div className="w-2 h-2 rounded-full bg-[#3DDC97] animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-[#F2F4F8]">EUR/USD 15M • INST-LIQ POOL</span>
              </div>

              {/* Hardware Protected Watermark (anti-piracy student identifier) */}
              <div className="absolute top-4 right-4 z-10 text-[10px] font-mono text-[#9AA6BD]/40 pointer-events-none select-none">
                VYROX-SEC-UID: 1129930138 (Arun K.)
              </div>
            </div>

            {/* Subtitles Display overlay */}
            {selectedSubtitle !== 'off' && activeCue && (
              <div className="absolute bottom-20 left-6 right-6 z-20 flex justify-center pointer-events-none">
                <div className="bg-[#0B0F17]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[#E5A82B]/40 text-center max-w-xl shadow-2xl">
                  <span className="text-xs sm:text-sm font-medium text-[#F2F4F8] leading-relaxed">
                    {activeCue.text}
                  </span>
                </div>
              </div>
            )}

            {/* Gradient Scrim for Controls */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070A0F] via-[#070A0F]/80 to-transparent pointer-events-none z-10" />

            {/* Control Bar Overlay */}
            <div className="relative z-20 p-3 sm:p-4 space-y-2.5">
              {/* Scrubber Progress Bar */}
              <div className="relative w-full h-2 group/scrub cursor-pointer">
                <div className="w-full h-1.5 bg-[#26304A] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#E5A82B] to-[#FFE082] transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={totalDuration}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Seek video position"
                />
              </div>

              {/* Buttons Row */}
              <div className="flex items-center justify-between text-[#F2F4F8]">
                {/* Left Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-[#E5A82B] text-[#0B0F17] flex items-center justify-center hover:bg-[#C48D17] transition-all touch-target shadow-md"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                    className="touch-target p-2 text-[#9AA6BD] hover:text-[#F2F4F8] transition-colors"
                    title="Rewind 10 seconds"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 10))}
                    className="touch-target p-2 text-[#9AA6BD] hover:text-[#F2F4F8] transition-colors"
                    title="Forward 10 seconds"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="touch-target p-2 text-[#9AA6BD] hover:text-[#F2F4F8] transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-[#FF6B6B]" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <div className="text-xs font-mono text-[#F2F4F8] pl-2 hidden sm:block">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-[#9AA6BD]"> / </span>
                    <span className="text-[#9AA6BD]">{formatTime(totalDuration)}</span>
                  </div>
                </div>

                {/* Right Controls: CC, Speed, Quality */}
                <div className="flex items-center gap-1 sm:gap-2 relative">
                  {/* Subtitles CC Button */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowCCMenu(!showCCMenu);
                        setShowSpeedMenu(false);
                        setShowQualityMenu(false);
                      }}
                      className={`touch-target px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border transition-all ${
                        selectedSubtitle !== 'off'
                          ? 'bg-[#E5A82B]/20 text-[#E5A82B] border-[#E5A82B]'
                          : 'bg-[#1A2133] text-[#9AA6BD] border-[#26304A]'
                      }`}
                      aria-label="Subtitles & CC"
                    >
                      <Subtitles className="w-4 h-4" />
                      <span className="uppercase text-[11px]">{selectedSubtitle}</span>
                    </button>

                    {showCCMenu && (
                      <div className="absolute bottom-12 right-0 bg-[#0F1522] border border-[#26304A] rounded-xl p-2 w-48 shadow-2xl z-30 space-y-1">
                        <div className="text-[10px] uppercase font-mono text-[#9AA6BD] px-2 py-1 font-bold">
                          Subtitles / CC
                        </div>
                        {[
                          { id: 'off', label: 'Off' },
                          { id: 'en', label: 'English' },
                          { id: 'ta', label: 'தமிழ் (Tamil)' },
                          { id: 'tanglish', label: 'Tamil (Tanglish)' }
                        ].map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setSelectedSubtitle(sub.id as any);
                              setShowCCMenu(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between touch-target ${
                              selectedSubtitle === sub.id
                                ? 'bg-[#1A2133] text-[#E5A82B] font-bold'
                                : 'text-[#9AA6BD] hover:text-[#F2F4F8] hover:bg-[#1A2133]'
                            }`}
                          >
                            <span>{sub.label}</span>
                            {selectedSubtitle === sub.id && <span className="text-[#E5A82B]">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Playback Speed */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowSpeedMenu(!showSpeedMenu);
                        setShowCCMenu(false);
                        setShowQualityMenu(false);
                      }}
                      className="touch-target px-2.5 py-1.5 rounded-lg bg-[#1A2133] border border-[#26304A] text-xs font-mono font-bold text-[#F2F4F8] hover:border-[#E5A82B] transition-colors"
                    >
                      {playbackSpeed}x
                    </button>

                    {showSpeedMenu && (
                      <div className="absolute bottom-12 right-0 bg-[#0F1522] border border-[#26304A] rounded-xl p-2 w-32 shadow-2xl z-30 space-y-1">
                        <div className="text-[10px] uppercase font-mono text-[#9AA6BD] px-2 py-1 font-bold">
                          Speed
                        </div>
                        {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                          <button
                            key={speed}
                            onClick={() => {
                              setPlaybackSpeed(speed);
                              setShowSpeedMenu(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between touch-target ${
                              playbackSpeed === speed
                                ? 'bg-[#1A2133] text-[#E5A82B] font-bold'
                                : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
                            }`}
                          >
                            <span>{speed}x</span>
                            {playbackSpeed === speed && <span className="text-[#E5A82B]">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quality Settings */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowQualityMenu(!showQualityMenu);
                        setShowSpeedMenu(false);
                        setShowCCMenu(false);
                      }}
                      className="touch-target p-2 rounded-lg bg-[#1A2133] border border-[#26304A] text-[#9AA6BD] hover:text-[#F2F4F8] transition-colors"
                      aria-label="Quality settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    {showQualityMenu && (
                      <div className="absolute bottom-12 right-0 bg-[#0F1522] border border-[#26304A] rounded-xl p-2 w-44 shadow-2xl z-30 space-y-1">
                        <div className="text-[10px] uppercase font-mono text-[#9AA6BD] px-2 py-1 font-bold">
                          Stream Quality
                        </div>
                        {['1080p (Auto)', '1080p 60fps', '720p HD', '480p SD'].map(q => (
                          <button
                            key={q}
                            onClick={() => {
                              setQuality(q);
                              setShowQualityMenu(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between touch-target ${
                              quality === q
                                ? 'bg-[#1A2133] text-[#E5A82B] font-bold'
                                : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
                            }`}
                          >
                            <span>{q}</span>
                            {quality === q && <span className="text-[#E5A82B]">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fullscreen icon */}
                  <button
                    onClick={() => {
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                      } else {
                        document.documentElement.requestFullscreen();
                      }
                    }}
                    className="touch-target p-2 rounded-lg bg-[#1A2133] border border-[#26304A] text-[#9AA6BD] hover:text-[#F2F4F8] transition-colors hidden sm:flex"
                    aria-label="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Metadata & Mark Complete Banner */}
          <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-4 sm:p-6 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-[#1E2A4A] text-[#8FB0FF] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    MODULE {currentLessonIndex + 1}
                  </span>
                  <span className="text-xs text-[#9AA6BD] font-mono">
                    Duration: {activeLesson.videoDurationFormatted}
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-[#F2F4F8]">
                  {activeLesson.title}
                </h1>
                {activeLesson.titleTamil && (
                  <p className="text-xs text-[#9AA6BD] mt-0.5 font-sans">
                    {activeLesson.titleTamil}
                  </p>
                )}
              </div>

              {/* Mark Complete CTA Button */}
              <button
                onClick={() => onToggleCompleteLesson(activeLesson.id)}
                className={`touch-target px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isCompleted
                    ? 'bg-[#16382C] text-[#3DDC97] border border-[#3DDC97]/50 shadow-sm'
                    : 'bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] shadow-lg shadow-[#E5A82B]/20'
                }`}
              >
                <CheckCircle className="w-4 h-4 fill-current" />
                <span>{isCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#9AA6BD] leading-relaxed pt-1">
              {activeLesson.description}
            </p>

            {/* Next / Previous Lesson Navigation */}
            <div className="pt-4 border-t border-[#26304A]/60 flex items-center justify-between gap-3">
              {prevLesson ? (
                <button
                  onClick={() => onSelectLesson(prevLesson.id)}
                  className="touch-target px-3.5 py-2 rounded-lg bg-[#0F1522] border border-[#26304A] hover:border-[#E5A82B] text-xs font-semibold text-[#9AA6BD] hover:text-[#F2F4F8] flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="truncate max-w-[150px] sm:max-w-xs">{prevLesson.title}</span>
                </button>
              ) : <div />}

              {nextLesson ? (
                <button
                  onClick={() => onSelectLesson(nextLesson.id)}
                  className="touch-target px-3.5 py-2 rounded-lg bg-[#0F1522] border border-[#26304A] hover:border-[#E5A82B] text-xs font-semibold text-[#9AA6BD] hover:text-[#F2F4F8] flex items-center gap-1.5 transition-colors"
                >
                  <span className="truncate max-w-[150px] sm:max-w-xs">{nextLesson.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs text-[#3DDC97] font-semibold">🎉 All lessons completed!</span>
              )}
            </div>
          </div>

          {/* Institutional Takeaways Tabs */}
          <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-4 border-b border-[#26304A] pb-3">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`text-xs font-bold pb-1 transition-colors touch-target ${
                  activeTab === 'curriculum' ? 'text-[#E5A82B] border-b-2 border-[#E5A82B]' : 'text-[#9AA6BD]'
                }`}
              >
                Key Takeaways
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`text-xs font-bold pb-1 transition-colors touch-target ${
                  activeTab === 'notes' ? 'text-[#E5A82B] border-b-2 border-[#E5A82B]' : 'text-[#9AA6BD]'
                }`}
              >
                Chart Notes & Rules
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`text-xs font-bold pb-1 transition-colors touch-target ${
                  activeTab === 'resources' ? 'text-[#E5A82B] border-b-2 border-[#E5A82B]' : 'text-[#9AA6BD]'
                }`}
              >
                Downloadable PDF Markup
              </button>
            </div>

            {activeTab === 'curriculum' && (
              <div className="space-y-2 pt-2">
                {activeLesson.keyTakeaways?.map((takeaway, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#F2F4F8] bg-[#0F1522] p-2.5 rounded-lg border border-[#26304A]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E5A82B] mt-1.5 shrink-0" />
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="text-xs text-[#9AA6BD] leading-relaxed space-y-2 p-2">
                <p>
                  <strong>Rule 1:</strong> Always map swing points on the 4-Hour timeframe before executing entries on the 15-Minute or 1-Minute chart.
                </p>
                <p>
                  <strong>Rule 2:</strong> If equal highs (EQH) are sitting right above your identified Order Block, that block is treated as internal range liquidity and will likely be swept before actual rejection.
                </p>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="p-3 bg-[#0F1522] rounded-xl border border-[#26304A] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#E5A82B]" />
                  <div>
                    <span className="text-xs font-bold text-[#F2F4F8] block">SMC_Lesson_2_CheatSheet.pdf</span>
                    <span className="text-[10px] text-[#9AA6BD]">Institutional Order Flow Reference Guide • 4.2 MB</span>
                  </div>
                </div>
                <button 
                  onClick={() => alert('Download initiated: SMC_Lesson_2_CheatSheet.pdf')}
                  className="touch-target px-3 py-1.5 rounded-lg bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] text-xs font-semibold text-[#E5A82B] flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Curriculum Playlist Drawer */}
        {showCurriculumDrawer && (
          <div className="lg:col-span-4 bg-[#1A2133] border border-[#26304A] rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
              <div>
                <h3 className="text-sm font-bold text-[#F2F4F8]">Course Curriculum</h3>
                <span className="text-[11px] text-[#9AA6BD] font-mono">
                  {completedLessonIds.length} of {course.lessons.length} Completed
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#E5A82B] bg-[#3A2D0C] px-2 py-0.5 rounded border border-[#E5A82B]/30">
                {Math.round((completedLessonIds.length / course.lessons.length) * 100)}%
              </span>
            </div>

            {/* Playlist list */}
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {course.lessons.map((lesson, idx) => {
                const isCurrent = lesson.id === activeLesson.id;
                const isDone = completedLessonIds.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 touch-target ${
                      isCurrent
                        ? 'bg-[#0F1522] border-l-4 border-[#E5A82B] border-y border-r border-[#26304A] shadow-md'
                        : 'bg-[#1A2133] hover:bg-[#212B42] border border-transparent hover:border-[#26304A]'
                    }`}
                  >
                    {/* Completion icon / index */}
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <div className="w-5 h-5 rounded-full bg-[#16382C] text-[#3DDC97] flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                      ) : (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                          isCurrent ? 'bg-[#E5A82B] text-[#0B0F17] font-bold' : 'bg-[#26304A] text-[#9AA6BD]'
                        }`}>
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-semibold truncate ${
                          isCurrent ? 'text-[#E5A82B]' : 'text-[#F2F4F8]'
                        }`}>
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#9AA6BD] font-mono">
                        <span>{lesson.videoDurationFormatted}</span>
                        {lesson.isFreePreview && (
                          <span className="text-[#8FB0FF] bg-[#1E2A4A] px-1.5 rounded text-[9px]">
                            FREE
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[#E5A82B] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E5A82B] animate-ping" />
                            Playing
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
