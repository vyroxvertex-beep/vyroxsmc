import React, { useState } from 'react';
import { MentorProfile, MentorVideo, MentorVideoCategory } from '../../types';
import { MENTOR_VIDEO_CATEGORIES } from '../../data/mockData';
import { 
  Users, 
  Video, 
  Check, 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  Eye, 
  Clock, 
  AlertTriangle,
  Play,
  Layers,
  Sparkles
} from 'lucide-react';

interface AdminMentorManagerProps {
  mentors: MentorProfile[];
  videos: MentorVideo[];
  onToggleUploadPermission: (mentorId: string, currentVal: boolean) => void;
  onApproveMentor: (mentorId: string) => void;
  onRejectMentor: (mentorId: string) => void;
  onApproveVideo: (videoId: string) => void;
  onRemoveVideo: (videoId: string) => void;
}

export const AdminMentorManager: React.FC<AdminMentorManagerProps> = ({
  mentors,
  videos,
  onToggleUploadPermission,
  onApproveMentor,
  onRejectMentor,
  onApproveVideo,
  onRemoveVideo
}) => {
  const [subTab, setSubTab] = useState<'mentors' | 'videos' | 'categories'>('mentors');
  const [videoFilter, setVideoFilter] = useState<'all' | 'published' | 'draft' | 'pending_review'>('all');

  const filteredVideos = videos.filter(v => {
    if (videoFilter === 'all') return true;
    return v.status === videoFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-4 flex items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('mentors')}
            className={`touch-target px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'mentors'
                ? 'bg-[#E5A82B] text-[#0B0F17] shadow-sm'
                : 'bg-[#0B0F17] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Mentor Directory & Permissions ({mentors.length})</span>
          </button>

          <button
            onClick={() => setSubTab('videos')}
            className={`touch-target px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'videos'
                ? 'bg-[#E5A82B] text-[#0B0F17] shadow-sm'
                : 'bg-[#0B0F17] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Review & Moderation ({videos.length})</span>
          </button>

          <button
            onClick={() => setSubTab('categories')}
            className={`touch-target px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'categories'
                ? 'bg-[#E5A82B] text-[#0B0F17] shadow-sm'
                : 'bg-[#0B0F17] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>12 Categories ({MENTOR_VIDEO_CATEGORIES.length})</span>
          </button>
        </div>
      </div>

      {/* MENTORS TAB */}
      {subTab === 'mentors' && (
        <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 bg-[#0F1522] border-b border-[#26304A] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F2F4F8]">Mentor Applications & Authorization</h3>
            <span className="text-xs text-[#9AA6BD] font-mono">
              Enforce strict institutional trading credentials
            </span>
          </div>

          <div className="divide-y divide-[#26304A]/60">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#212B42]/40 transition-colors">
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={mentor.avatarUrl}
                    alt={mentor.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#26304A] shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#F2F4F8]">{mentor.name}</h4>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        mentor.status === 'active'
                          ? 'bg-[#16382C] text-[#3DDC97] border-[#3DDC97]/40'
                          : 'bg-[#3A2D0C] text-[#E5A82B] border-[#E5A82B]/40'
                      }`}>
                        {mentor.status.toUpperCase()}
                      </span>
                      {mentor.uploadPermissionGranted ? (
                        <span className="text-[10px] font-mono text-[#3DDC97] bg-[#16382C] px-2 py-0.5 rounded border border-[#3DDC97]/30">
                          UPLOAD GRANTED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#FF6B6B] bg-[#3A1717] px-2 py-0.5 rounded border border-[#FF6B6B]/30">
                          UPLOAD REVOKED
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#9AA6BD] font-mono">
                      {mentor.email} • {mentor.specialization} • {mentor.tradingExperience}
                    </p>

                    <p className="text-xs text-[#F2F4F8]/80 line-clamp-1 max-w-xl">
                      {mentor.shortBio}
                    </p>
                  </div>
                </div>

                {/* Permissions & Controls */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {mentor.status === 'pending_approval' ? (
                    <>
                      <button
                        onClick={() => onApproveMentor(mentor.id)}
                        className="touch-target px-3.5 py-2 rounded-xl bg-[#3DDC97] hover:bg-[#2BB87D] text-[#0B0F17] font-bold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Mentor</span>
                      </button>
                      <button
                        onClick={() => onRejectMentor(mentor.id)}
                        className="touch-target px-3.5 py-2 rounded-xl bg-[#3A1717] hover:bg-[#4D1E1E] text-[#FF6B6B] font-bold text-xs flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onToggleUploadPermission(mentor.id, mentor.uploadPermissionGranted)}
                      className={`touch-target px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        mentor.uploadPermissionGranted
                          ? 'bg-[#3A1717] hover:bg-[#4D1E1E] text-[#FF6B6B] border-[#FF6B6B]/40'
                          : 'bg-[#16382C] hover:bg-[#1E4D3C] text-[#3DDC97] border-[#3DDC97]/40'
                      }`}
                    >
                      {mentor.uploadPermissionGranted ? 'Revoke Upload Permission' : 'Grant Upload Permission'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIDEOS REVIEW TAB */}
      {subTab === 'videos' && (
        <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl overflow-hidden shadow-lg space-y-0">
          <div className="p-4 bg-[#0F1522] border-b border-[#26304A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-[#F2F4F8]">Review Mentor Video Curriculum</h3>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#9AA6BD] uppercase">Filter:</span>
              {(['all', 'published', 'draft', 'pending_review'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setVideoFilter(f)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-colors ${
                    videoFilter === f ? 'bg-[#E5A82B] text-[#0B0F17] font-bold border-[#E5A82B]' : 'bg-[#0B0F17] text-[#9AA6BD] border-[#26304A]'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#26304A]/60">
            {filteredVideos.map((video) => (
              <div key={video.id} className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#212B42]/40 transition-colors">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 border border-[#26304A] relative">
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[9px] font-mono text-white">
                      {Math.floor(video.durationSeconds / 60)}m
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold bg-[#1E2A4A] text-[#8FB0FF] px-2 py-0.5 rounded border border-[#8FB0FF]/30">
                        {video.category}
                      </span>
                      {video.instruments.map(ins => (
                        <span key={ins} className="text-[10px] font-mono font-bold bg-[#3A2D0C] text-[#E5A82B] px-1.5 py-0.2 rounded border border-[#E5A82B]/30">
                          {ins}
                        </span>
                      ))}
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                        video.status === 'published' ? 'bg-[#16382C] text-[#3DDC97]' : 'bg-[#3A2D0C] text-[#E5A82B]'
                      }`}>
                        {video.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#F2F4F8] truncate">
                      {video.title}
                    </h4>

                    <div className="text-[11px] font-mono text-[#9AA6BD]">
                      Mentor: <strong className="text-[#F2F4F8]">{video.mentorName}</strong> • {video.views} views • {video.likes} likes • {video.uploadedAt}
                    </div>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {video.status !== 'published' && (
                    <button
                      onClick={() => onApproveVideo(video.id)}
                      className="touch-target px-3.5 py-2 rounded-xl bg-[#3DDC97] hover:bg-[#2BB87D] text-[#0B0F17] font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (window.confirm(`Remove video "${video.title}" for inappropriate content or SEBI violation?`)) {
                        onRemoveVideo(video.id);
                      }
                    }}
                    className="touch-target px-3.5 py-2 rounded-xl bg-[#3A1717] hover:bg-[#4D1E1E] text-[#FF6B6B] border border-[#FF6B6B]/30 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Content</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {subTab === 'categories' && (
        <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
            <h3 className="text-sm font-bold text-[#F2F4F8]">
              Active SMC Curriculum Categories (12 Focus Areas)
            </h3>
            <span className="text-xs text-[#E5A82B] font-mono">Institutional Standard</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MENTOR_VIDEO_CATEGORIES.map((cat, idx) => {
              const count = videos.filter(v => v.category === cat).length;
              return (
                <div key={cat} className="p-4 rounded-xl bg-[#0B0F17] border border-[#26304A] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#1E2A4A] text-[#8FB0FF] font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#F2F4F8]">{cat}</span>
                  </div>
                  <span className="text-[11px] font-mono bg-[#1A2133] text-[#E5A82B] px-2 py-0.5 rounded border border-[#26304A]">
                    {count} Videos
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
