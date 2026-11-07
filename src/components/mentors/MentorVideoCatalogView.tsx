import React, { useState, useMemo, useEffect } from 'react';
import { 
  MentorVideo, 
  MentorVideoCategory, 
  MentorProfile, 
  UserProfile, 
  AppRole 
} from '../../types';
import { MENTOR_VIDEO_CATEGORIES } from '../../data/mockData';
import { MentorVideoPlayer } from './MentorVideoPlayer';
import { 
  Search, 
  Filter, 
  Clock, 
  Eye, 
  ThumbsUp, 
  Bookmark, 
  Share2, 
  MessageSquare, 
  Send, 
  CornerDownRight, 
  Check, 
  Play, 
  Layers, 
  CheckCircle2, 
  X, 
  Sparkles,
  ChevronLeft,
  User,
  ShieldCheck,
  Video
} from 'lucide-react';

interface MentorVideoCatalogViewProps {
  user: UserProfile;
  currentRole: AppRole;
  videos: MentorVideo[];
  mentors: MentorProfile[];
  onLikeVideo: (videoId: string) => void;
  onBookmarkVideo: (videoId: string) => void;
  onAddComment: (videoId: string, content: string, replyToCommentId?: string, replyToAuthorName?: string) => void;
  onOpenUploadDashboard?: () => void;
}

const COMMON_INSTRUMENTS = ['ALL', 'US30', 'XAUUSD', 'GBPUSD', 'EURUSD', 'BTCUSD', 'BANKNIFTY'];

export const MentorVideoCatalogView: React.FC<MentorVideoCatalogViewProps> = ({
  user,
  currentRole,
  videos,
  mentors,
  onLikeVideo,
  onBookmarkVideo,
  onAddComment,
  onOpenUploadDashboard
}) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMentorId, setSelectedMentorId] = useState<string>('ALL');
  const [selectedInstrument, setSelectedInstrument] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Comment input state
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; authorName: string } | null>(null);

  // Mentor profile modal
  const [inspectedMentor, setInspectedMentor] = useState<MentorProfile | null>(null);

  // Watched video tracking
  const [watchedVideoIds, setWatchedVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vyrox_watched_mentor_videos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mark video watched
  const handleMarkWatched = (vId: string) => {
    if (!watchedVideoIds.includes(vId)) {
      const updated = [...watchedVideoIds, vId];
      setWatchedVideoIds(updated);
      try {
        localStorage.setItem('vyrox_watched_mentor_videos', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Find currently open video
  const activeVideo = useMemo(() => {
    if (!selectedVideoId) return null;
    return videos.find(v => v.id === selectedVideoId) || null;
  }, [selectedVideoId, videos]);

  // Related videos
  const relatedVideos = useMemo(() => {
    if (!activeVideo) return [];
    return videos
      .filter(v => v.id !== activeVideo.id && v.category === activeVideo.category)
      .slice(0, 4);
  }, [activeVideo, videos]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: videos.length };
    MENTOR_VIDEO_CATEGORIES.forEach(cat => {
      counts[cat] = 0;
    });
    videos.forEach(v => {
      if (counts[v.category] !== undefined) {
        counts[v.category]++;
      }
    });
    return counts;
  }, [videos]);

  // Filtered list
  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      if (selectedCategory !== 'ALL' && v.category !== selectedCategory) {
        return false;
      }
      if (selectedMentorId !== 'ALL' && v.mentorId !== selectedMentorId) {
        return false;
      }
      if (selectedInstrument !== 'ALL') {
        if (!v.instruments.some(ins => ins.toUpperCase() === selectedInstrument.toUpperCase())) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = v.title.toLowerCase().includes(q);
        const inDesc = v.description.toLowerCase().includes(q);
        const inMentor = v.mentorName.toLowerCase().includes(q);
        const inTags = v.tags.some(t => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inMentor && !inTags) {
          return false;
        }
      }
      return true;
    });
  }, [videos, selectedCategory, selectedMentorId, selectedInstrument, searchQuery]);

  // Handle Comment Submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeVideo) return;

    onAddComment(
      activeVideo.id,
      commentText.trim(),
      replyingTo?.commentId,
      replyingTo?.authorName
    );

    setCommentText('');
    setReplyingTo(null);
    showToast('Question / comment submitted to mentor!');
  };

  // Share Video
  const handleShareVideo = (video: MentorVideo) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/videos?v=${video.id}`);
      showToast('Video link copied to clipboard!');
    }
  };

  // ==========================================
  // RENDER WATCH EXPERIENCE IF VIDEO IS SELECTED
  // ==========================================
  if (activeVideo) {
    const isWatched = watchedVideoIds.includes(activeVideo.id);

    return (
      <div className="space-y-6 pb-20 max-w-6xl mx-auto">
        {toastMessage && (
          <div className="fixed top-16 right-4 z-50 bg-[#1A2133] border border-[#E5A82B] text-xs font-semibold text-[#F2F4F8] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3DDC97]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Back and Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setSelectedVideoId(null)}
            className="touch-target px-3.5 py-1.5 rounded-xl bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] text-xs font-semibold text-[#9AA6BD] hover:text-[#F2F4F8] flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#E5A82B]" />
            <span>Back to Video Library</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="bg-[#1E2A4A] text-[#8FB0FF] text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#8FB0FF]/30 font-bold">
              {activeVideo.category}
            </span>
            {activeVideo.instruments.map(ins => (
              <span key={ins} className="bg-[#3A2D0C] text-[#E5A82B] text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#E5A82B]/30 font-bold">
                {ins}
              </span>
            ))}
          </div>
        </div>

        {/* High-End Video Player */}
        <div className="space-y-4">
          <MentorVideoPlayer
            videoId={activeVideo.id}
            videoUrl={activeVideo.videoUrl}
            title={activeVideo.title}
            thumbnailUrl={activeVideo.thumbnailUrl}
            userEmail={user.email}
            deviceId={user.registeredDevice.deviceName}
            onEnded={() => handleMarkWatched(activeVideo.id)}
            onTimeUpdate={(cTime, dur) => {
              if (cTime > 30 && dur > 0 && (cTime / dur) > 0.8) {
                handleMarkWatched(activeVideo.id);
              }
            }}
          />

          {/* Video Metadata & Actions Card */}
          <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#E5A82B]/20 text-[#E5A82B] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#E5A82B]/40">
                    {activeVideo.category}
                  </span>
                  {isWatched && (
                    <span className="bg-[#16382C] text-[#3DDC97] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#3DDC97]/40 flex items-center gap-1">
                      <Check className="w-3 h-3" /> WATCHED
                    </span>
                  )}
                </div>

                <h1 className="text-lg sm:text-2xl font-bold text-[#F2F4F8] leading-snug">
                  {activeVideo.title}
                </h1>

                {/* Mentor row */}
                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={activeVideo.mentorAvatar}
                    alt={activeVideo.mentorName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#E5A82B]/50 shrink-0 cursor-pointer"
                    onClick={() => {
                      const m = mentors.find(men => men.id === activeVideo.mentorId);
                      if (m) setInspectedMentor(m);
                    }}
                  />
                  <div>
                    <div 
                      onClick={() => {
                        const m = mentors.find(men => men.id === activeVideo.mentorId);
                        if (m) setInspectedMentor(m);
                      }}
                      className="text-xs sm:text-sm font-bold text-[#F2F4F8] hover:text-[#E5A82B] transition-colors cursor-pointer"
                    >
                      {activeVideo.mentorName}
                    </div>
                    <div className="text-[11px] font-mono text-[#9AA6BD]">
                      {activeVideo.mentorSpecialization} • Uploaded {activeVideo.uploadedAt}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onLikeVideo(activeVideo.id)}
                  className={`touch-target px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeVideo.likedByUser
                      ? 'bg-[#16382C] text-[#3DDC97] border border-[#3DDC97]/40 font-bold'
                      : 'bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${activeVideo.likedByUser ? 'fill-current' : ''}`} />
                  <span>{activeVideo.likes}</span>
                </button>

                <button
                  onClick={() => onBookmarkVideo(activeVideo.id)}
                  className={`touch-target px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeVideo.isBookmarked
                      ? 'bg-[#3A2D0C] text-[#E5A82B] border border-[#E5A82B]/40 font-bold'
                      : 'bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${activeVideo.isBookmarked ? 'fill-current' : ''}`} />
                  <span>{activeVideo.isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={() => handleShareVideo(activeVideo)}
                  className="touch-target p-2 rounded-xl bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#E5A82B] border border-[#26304A] transition-colors"
                  title="Share lesson"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description Body */}
            <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#26304A] space-y-2 text-xs sm:text-sm text-[#F2F4F8] leading-relaxed whitespace-pre-wrap font-sans">
              {activeVideo.description}
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {activeVideo.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] font-mono bg-[#0B0F17] text-[#9AA6BD] border border-[#26304A] px-2.5 py-0.5 rounded">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Comments & Q&A with Mentor */}
          <section aria-labelledby="qa-heading" className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#E5A82B]" />
                <h2 id="qa-heading" className="text-sm sm:text-base font-bold text-[#F2F4F8]">
                  Lesson Questions & Mentor Replies ({activeVideo.comments?.length || 0})
                </h2>
              </div>
              <span className="text-[10px] text-[#9AA6BD] font-mono">
                SEBI Compliance: Structural Q&A only
              </span>
            </div>

            {/* Add Comment / Question Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              {replyingTo && (
                <div className="p-2 rounded-lg bg-[#0F1522] border border-[#E5A82B]/30 flex items-center justify-between text-xs text-[#E5A82B]">
                  <span className="flex items-center gap-1.5 font-mono">
                    <CornerDownRight className="w-3.5 h-3.5" />
                    Replying to <strong>@{replyingTo.authorName}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-[#9AA6BD] hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#26304A] shrink-0 mt-1"
                />
                <div className="flex-1 space-y-2">
                  <textarea
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={
                      replyingTo 
                        ? `Reply to @${replyingTo.authorName}...` 
                        : 'Ask mentor Rahul a clarifying question about this entry model or structure...'
                    }
                    className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl p-3 text-xs sm:text-sm text-[#F2F4F8] placeholder-[#9AA6BD]/50 outline-none resize-none leading-relaxed"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="touch-target px-5 py-2 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] disabled:opacity-40 text-[#0B0F17] font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Question</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments Stream */}
            <div className="space-y-3.5 pt-2">
              {(!activeVideo.comments || activeVideo.comments.length === 0) ? (
                <div className="py-8 text-center text-xs text-[#9AA6BD]">
                  No questions asked on this lesson yet. Be the first trader to submit your question.
                </div>
              ) : (
                activeVideo.comments.map((comm) => {
                  const isNested = Boolean(comm.replyToCommentId);
                  return (
                    <div
                      key={comm.id}
                      className={`p-3.5 sm:p-4 rounded-xl border ${
                        isNested ? 'ml-6 sm:ml-10 bg-[#16213A]/50 border-[#26304A]/60' : 'bg-[#0B0F17] border-[#26304A]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={comm.authorAvatar}
                            alt={comm.authorName}
                            className="w-7 h-7 rounded-full object-cover border border-[#26304A] shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#F2F4F8]">{comm.authorName}</span>
                              {comm.authorBadge && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#3A2D0C] text-[#E5A82B] border border-[#E5A82B]/30 font-bold">
                                  {comm.authorBadge}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#9AA6BD] font-mono">{comm.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      {comm.replyToAuthorName && (
                        <div className="mt-1.5 text-[11px] font-mono text-[#E5A82B] flex items-center gap-1">
                          <CornerDownRight className="w-3 h-3" />
                          <span>Replying to @{comm.replyToAuthorName}</span>
                        </div>
                      )}

                      <p className="mt-2 text-xs text-[#F2F4F8] leading-relaxed whitespace-pre-wrap">
                        {comm.content}
                      </p>

                      <div className="mt-2.5 flex items-center gap-3 text-[11px] text-[#9AA6BD]">
                        <button
                          onClick={() => setReplyingTo({ commentId: comm.id, authorName: comm.authorName })}
                          className="hover:text-[#E5A82B] font-semibold transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Related Videos in Category */}
          {relatedVideos.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#F2F4F8]">
                More in {activeVideo.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedVideos.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setSelectedVideoId(rel.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3 bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] hover:border-[#E5A82B]/40 rounded-xl cursor-pointer transition-all space-y-2 group shadow-sm"
                  >
                    <div className="relative h-28 rounded-lg overflow-hidden border border-[#26304A]">
                      <img src={rel.thumbnailUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[9px] font-mono text-white">
                        {Math.floor(rel.durationSeconds / 60)}m
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#F2F4F8] group-hover:text-[#E5A82B] transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <div className="text-[10px] text-[#9AA6BD] flex items-center justify-between">
                      <span>{rel.mentorName}</span>
                      <span>{rel.views} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN CATALOG BROWSE VIEW
  // ==========================================
  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#1A2133] border border-[#E5A82B] text-xs font-semibold text-[#F2F4F8] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3DDC97]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#16213A] via-[#1A2133] to-[#0F1522] border border-[#26304A] rounded-2xl p-5 sm:p-7 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5A82B]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-[#E5A82B]/20 text-[#E5A82B] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#E5A82B]/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5A82B] animate-pulse" />
                OFFICIAL MENTOR VIDEO REPOSITORY
              </span>
              <span className="text-[10px] text-[#9AA6BD] font-mono">12 SMC Focus Areas</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#F2F4F8] tracking-tight">
              Mentor Video Learning Library
            </h1>

            <p className="text-xs sm:text-sm text-[#9AA6BD] leading-relaxed">
              Explore in-depth video analyses, live market executions, and structural breakdowns recorded exclusively by verified institutional SMC mentors.
            </p>
          </div>

          {/* Mentor Upload Portal CTA (Authorized mentors or Admin) */}
          {(currentRole !== 'student' || onOpenUploadDashboard) && (
            <div className="shrink-0">
              <button
                onClick={onOpenUploadDashboard}
                className="touch-target px-5 py-2.5 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#E5A82B]/20 transition-all hover:scale-[1.02]"
              >
                <Video className="w-4 h-4" />
                <span>Mentor Upload Studio</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Metrics */}
        <div className="mt-6 pt-5 border-t border-[#26304A]/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#0B0F17]/60 p-3 rounded-xl border border-[#26304A]/60">
            <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Published Lessons</span>
            <span className="text-lg font-bold text-[#F2F4F8]">{videos.length} Videos</span>
          </div>
          <div className="bg-[#0B0F17]/60 p-3 rounded-xl border border-[#26304A]/60">
            <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Verified Mentors</span>
            <span className="text-lg font-bold text-[#3DDC97]">
              {mentors.filter(m => m.isAuthorized).length} Senior Traders
            </span>
          </div>
          <div className="bg-[#0B0F17]/60 p-3 rounded-xl border border-[#26304A]/60">
            <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Completed Lessons</span>
            <span className="text-lg font-bold text-[#8FB0FF]">{watchedVideoIds.length} Watched</span>
          </div>
          <div className="bg-[#0B0F17]/60 p-3 rounded-xl border border-[#26304A]/60">
            <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Playback Quality</span>
            <span className="text-lg font-bold text-[#E5A82B]">1080p HD / 4K</span>
          </div>
        </div>
      </div>

      {/* 12 Categories Horizontal Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#9AA6BD] px-1">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#F2F4F8]">
            <Layers className="w-3.5 h-3.5 text-[#E5A82B]" />
            12 SPECIALIZED SMC CURRICULUM CATEGORIES
          </span>
          {selectedCategory !== 'ALL' && (
            <button
              onClick={() => setSelectedCategory('ALL')}
              className="text-[#E5A82B] hover:underline text-[11px] font-mono"
            >
              Reset to All
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`touch-target px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 ${
              selectedCategory === 'ALL'
                ? 'bg-[#E5A82B] text-[#0B0F17] font-bold shadow-md shadow-[#E5A82B]/20'
                : 'bg-[#1A2133] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
            }`}
          >
            <span>All Categories</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'ALL' ? 'bg-[#0B0F17] text-[#E5A82B]' : 'bg-[#0B0F17] text-[#9AA6BD]'
            }`}>
              {categoryCounts['ALL'] || 0}
            </span>
          </button>

          {MENTOR_VIDEO_CATEGORIES.map((cat) => {
            const isSel = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`touch-target px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 ${
                  isSel
                    ? 'bg-[#E5A82B] text-[#0B0F17] font-bold shadow-md shadow-[#E5A82B]/20'
                    : 'bg-[#1A2133] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSel ? 'bg-[#0B0F17] text-[#E5A82B]' : 'bg-[#0B0F17] text-[#9AA6BD]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Filter Bar: Search, Mentor Filter & Instrument Filter */}
      <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9AA6BD] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons, mentors, entry models, tags..."
              className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl pl-9 pr-8 py-2 text-xs text-[#F2F4F8] placeholder-[#9AA6BD]/50 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9AA6BD] hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mentor Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#9AA6BD] uppercase shrink-0">Mentor:</span>
            <select
              value={selectedMentorId}
              onChange={(e) => setSelectedMentorId(e.target.value)}
              className="bg-[#0B0F17] border border-[#26304A] text-xs text-[#F2F4F8] rounded-xl px-3 py-2 outline-none touch-target"
            >
              <option value="ALL">All Mentors</option>
              {mentors.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Instruments Strip */}
        <div className="pt-2 border-t border-[#26304A]/60 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-mono uppercase text-[#9AA6BD] shrink-0 font-semibold">
            Instrument:
          </span>
          {COMMON_INSTRUMENTS.map((ins) => (
            <button
              key={ins}
              onClick={() => setSelectedInstrument(ins)}
              className={`touch-target text-[10px] font-mono px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
                selectedInstrument === ins
                  ? 'bg-[#E5A82B] text-[#0B0F17] font-bold'
                  : 'bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
              }`}
            >
              {ins}
            </button>
          ))}

          {(selectedInstrument !== 'ALL' || selectedCategory !== 'ALL' || selectedMentorId !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedInstrument('ALL');
                setSelectedCategory('ALL');
                setSelectedMentorId('ALL');
                setSearchQuery('');
              }}
              className="text-[10px] text-[#FF6B6B] hover:underline ml-auto shrink-0 font-mono"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.length === 0 ? (
          <div className="col-span-full bg-[#1A2133] border border-[#26304A] rounded-2xl p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#0B0F17] border border-[#26304A] flex items-center justify-center mx-auto text-[#9AA6BD]">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#F2F4F8]">No Mentor Videos Found</h3>
            <p className="text-xs text-[#9AA6BD] max-w-md mx-auto">
              No video lessons match your current filters. Try selecting "All Categories" or clearing the search box.
            </p>
          </div>
        ) : (
          filteredVideos.map((video) => {
            const isWatched = watchedVideoIds.includes(video.id);

            return (
              <div
                key={video.id}
                onClick={() => {
                  setSelectedVideoId(video.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#1A2133] hover:bg-[#1E273C] border border-[#26304A] hover:border-[#E5A82B]/60 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-md"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video overflow-hidden bg-[#0B0F17]">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Duration badge */}
                    <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.floor(video.durationSeconds / 60)}:{(video.durationSeconds % 60).toString().padStart(2, '0')}
                    </span>

                    {/* Watched pill */}
                    {isWatched && (
                      <span className="absolute top-2 left-2 bg-[#16382C] text-[#3DDC97] text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-[#3DDC97]/40 flex items-center gap-1">
                        <Check className="w-3 h-3" /> WATCHED
                      </span>
                    )}

                    {/* Play hover trigger */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-[#E5A82B] text-[#0B0F17] flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    {/* Category & Instrument */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold bg-[#1E2A4A] text-[#8FB0FF] px-2 py-0.5 rounded border border-[#8FB0FF]/30">
                        {video.category}
                      </span>
                      {video.instruments.map(ins => (
                        <span key={ins} className="text-[10px] font-mono font-bold bg-[#3A2D0C] text-[#E5A82B] px-1.5 py-0.2 rounded border border-[#E5A82B]/30">
                          {ins}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-[#F2F4F8] group-hover:text-[#E5A82B] transition-colors line-clamp-2 leading-snug">
                      {video.title}
                    </h3>

                    <p className="text-[11px] text-[#9AA6BD] line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Mentor & Stats */}
                <div className="p-4 pt-2 border-t border-[#26304A]/60 flex items-center justify-between text-[11px] text-[#9AA6BD]">
                  <div className="flex items-center gap-2">
                    <img
                      src={video.mentorAvatar}
                      alt={video.mentorName}
                      className="w-6 h-6 rounded-full object-cover border border-[#26304A]"
                    />
                    <span className="truncate max-w-[120px] font-medium text-[#F2F4F8]">
                      {video.mentorName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 font-mono text-[10px]">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {video.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-[#3DDC97]" /> {video.likes}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Mentor Profile Modal */}
      {inspectedMentor && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setInspectedMentor(null)}
              className="absolute top-4 right-4 text-[#9AA6BD] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={inspectedMentor.avatarUrl}
                alt={inspectedMentor.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E5A82B] shadow-lg shrink-0"
              />
              <div>
                <h3 className="text-base font-bold text-[#F2F4F8]">{inspectedMentor.name}</h3>
                <span className="text-xs text-[#E5A82B] font-mono">{inspectedMentor.tradingExperience}</span>
                <div className="text-[11px] text-[#9AA6BD] mt-0.5">{inspectedMentor.email}</div>
              </div>
            </div>

            <div className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A] text-xs text-[#9AA6BD] space-y-1">
              <span className="text-[#F2F4F8] font-bold block">Specialization:</span>
              <p>{inspectedMentor.specialization}</p>
            </div>

            <p className="text-xs text-[#F2F4F8]/80 leading-relaxed">
              {inspectedMentor.shortBio}
            </p>

            <div className="grid grid-cols-2 gap-2 text-center pt-2">
              <div className="bg-[#0B0F17] p-2.5 rounded-xl border border-[#26304A]">
                <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Published Lessons</span>
                <span className="text-sm font-bold text-[#E5A82B]">{inspectedMentor.totalPublishedVideos} Videos</span>
              </div>
              <div className="bg-[#0B0F17] p-2.5 rounded-xl border border-[#26304A]">
                <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Total Views</span>
                <span className="text-sm font-bold text-[#3DDC97]">{inspectedMentor.totalViews.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
