import React, { useState, useRef } from 'react';
import { 
  MentorProfile, 
  MentorVideo, 
  MentorVideoCategory, 
  UserProfile 
} from '../../types';
import { MENTOR_VIDEO_CATEGORIES } from '../../data/mockData';
import { 
  Upload, 
  Video, 
  Check, 
  X, 
  AlertCircle, 
  Tag, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  Clock, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  FileCheck, 
  Sparkles,
  Layers,
  Film
} from 'lucide-react';

interface MentorVideoUploadDashboardProps {
  currentMentor: MentorProfile;
  videos: MentorVideo[];
  onUploadVideo: (videoData: Partial<MentorVideo>) => void;
  onEditVideo: (video: MentorVideo) => void;
  onDeleteVideo: (videoId: string) => void;
  onSelectVideoForWatch?: (videoId: string) => void;
}

const COMMON_INSTRUMENTS = ['US30', 'XAUUSD', 'GBPUSD', 'EURUSD', 'BTCUSD', 'BANKNIFTY'];

const SAMPLE_FALLBACK_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const PRESET_THUMBNAILS = [
  {
    name: 'Order Block & Liquidity Sweep',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'NY Open Judas Swing',
    url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Market Structure & BOS Confirmation',
    url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Trading Psychology & Risk Management',
    url: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=900&q=80'
  }
];

export const MentorVideoUploadDashboard: React.FC<MentorVideoUploadDashboardProps> = ({
  currentMentor,
  videos,
  onUploadVideo,
  onEditVideo,
  onDeleteVideo,
  onSelectVideoForWatch
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<MentorVideo | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MentorVideoCategory>('SMC Concepts');
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(['XAUUSD']);
  const [tagsInput, setTagsInput] = useState('BOS, LiquiditySweep, OrderBlock');
  const [thumbnailUrl, setThumbnailUrl] = useState(PRESET_THUMBNAILS[0].url);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  // Upload Progress State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('14.2 MB/s');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [statusAction, setStatusAction] = useState<'published' | 'draft'>('published');

  // Filter own videos
  const mentorVideos = videos.filter(v => v.mentorId === currentMentor.id);

  // Open edit modal
  const handleStartEdit = (video: MentorVideo) => {
    setEditingVideo(video);
    setTitle(video.title);
    setDescription(video.description);
    setCategory(video.category);
    setSelectedInstruments(video.instruments);
    setTagsInput(video.tags.join(', '));
    setThumbnailUrl(video.thumbnailUrl);
    setVideoUrl(video.videoUrl);
    setShowUploadForm(true);
    setValidationError(null);
  };

  // Reset form
  const handleResetForm = () => {
    setEditingVideo(null);
    setTitle('');
    setDescription('');
    setCategory('SMC Concepts');
    setSelectedInstruments(['XAUUSD']);
    setTagsInput('BOS, LiquiditySweep, OrderBlock');
    setThumbnailUrl(PRESET_THUMBNAILS[0].url);
    setVideoFile(null);
    setVideoUrl('');
    setIsUploading(false);
    setUploadProgress(0);
    setValidationError(null);
    setShowUploadForm(false);
  };

  // Video File Selection with Validation
  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!validVideoTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|mkv)$/i)) {
      setValidationError('Invalid video format. Supported formats: MP4, WebM, QuickTime (MOV).');
      return;
    }

    // Validate size (max 500MB)
    const maxBytes = 500 * 1024 * 1024;
    if (file.size > maxBytes) {
      setValidationError('Video file size exceeds 500MB limit. Please compress before uploading.');
      return;
    }

    setValidationError(null);
    setVideoFile(file);

    // Create playable Object URL
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
  };

  // Thumbnail File Selection
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setValidationError('Please upload a valid image file for thumbnail.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setThumbnailUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Toggle Instrument Selection
  const toggleInstrument = (sym: string) => {
    setSelectedInstruments(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  // Submit Video Upload / Save
  const handleFormSubmit = (e: React.FormEvent, targetStatus: 'published' | 'draft') => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim() || title.trim().length < 5) {
      setValidationError('Video title must be at least 5 characters long.');
      return;
    }

    if (!description.trim() || description.trim().length < 20) {
      setValidationError('Detailed description must be at least 20 characters explaining the SMC thesis.');
      return;
    }

    if (!videoUrl && !editingVideo) {
      setValidationError('Please select a video file or provide a video URL.');
      return;
    }

    if (!currentMentor.uploadPermissionGranted) {
      setValidationError('Your mentor account upload permission is currently pending admin review.');
      return;
    }

    setStatusAction(targetStatus);
    setIsUploading(true);
    setUploadProgress(10);

    // Simulated reliable chunked upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const processedTags = tagsInput
              .split(',')
              .map(t => t.trim().replace(/^#/, ''))
              .filter(Boolean);

            const videoPayload: Partial<MentorVideo> = {
              id: editingVideo ? editingVideo.id : `mvid_${Date.now()}`,
              title: title.trim(),
              description: description.trim(),
              category,
              thumbnailUrl,
              videoUrl: videoUrl || SAMPLE_FALLBACK_VIDEO_URL,
              durationSeconds: editingVideo ? editingVideo.durationSeconds : 720,
              mentorId: currentMentor.id,
              mentorName: currentMentor.name,
              mentorAvatar: currentMentor.avatarUrl,
              mentorSpecialization: currentMentor.specialization,
              instruments: selectedInstruments.length > 0 ? selectedInstruments : ['ALL'],
              tags: processedTags.length > 0 ? processedTags : ['SMCConcepts'],
              status: targetStatus,
              fileSizeMb: videoFile ? Math.round((videoFile.size / (1024 * 1024)) * 10) / 10 : 124.5
            };

            if (editingVideo) {
              onEditVideo(videoPayload as MentorVideo);
            } else {
              onUploadVideo(videoPayload);
            }

            handleResetForm();
          }, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Mentor Header Profile Card */}
      <div className="bg-gradient-to-r from-[#16213A] via-[#1A2133] to-[#0F1522] border border-[#26304A] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5A82B]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={currentMentor.avatarUrl}
              alt={currentMentor.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#E5A82B] shadow-lg shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-[#F2F4F8]">
                  {currentMentor.name}
                </h1>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  currentMentor.uploadPermissionGranted
                    ? 'bg-[#16382C] text-[#3DDC97] border-[#3DDC97]/40'
                    : 'bg-[#3A1717] text-[#FF6B6B] border-[#FF6B6B]/40'
                }`}>
                  {currentMentor.uploadPermissionGranted ? 'VERIFIED MENTOR' : 'PERMISSION PENDING'}
                </span>
              </div>
              <p className="text-xs text-[#9AA6BD] font-mono">
                {currentMentor.specialization} • {currentMentor.tradingExperience}
              </p>
              <p className="text-xs text-[#F2F4F8]/80 max-w-xl leading-relaxed">
                {currentMentor.shortBio}
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                handleResetForm();
                setShowUploadForm(true);
              }}
              disabled={!currentMentor.uploadPermissionGranted}
              className="w-full md:w-auto touch-target px-5 py-2.5 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] disabled:opacity-50 text-[#0B0F17] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E5A82B]/20 transition-all hover:scale-[1.02]"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>Upload Video Lesson</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 pt-5 border-t border-[#26304A]/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#0B0F17]/60 p-3 rounded-xl border border-[#26304A]/60">
            <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Published Lessons</span>
            <span className="text-lg font-bold text-[#F2F4F8]">{mentorVideos.length} Videos</span>
          </div>
          <div className="bg-[#0B0F17]/60 p-3 rounded-xl border border-[#26304A]/60">
            <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Total Video Views</span>
            <span className="text-lg font-bold text-[#3DDC97]">
              {mentorVideos.reduce((acc, v) => acc + v.views, 0).toLocaleString()}
            </span>
          </div>
          <div className="bg-[#0B0F17]/60 p-3 rounded-xl border border-[#26304A]/60">
            <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Student Likes</span>
            <span className="text-lg font-bold text-[#8FB0FF]">
              {mentorVideos.reduce((acc, v) => acc + v.likes, 0)}
            </span>
          </div>
          <div className="bg-[#0B0F17]/60 p-3 rounded-xl border border-[#26304A]/60">
            <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Active Categories</span>
            <span className="text-lg font-bold text-[#E5A82B]">12 Supported</span>
          </div>
        </div>
      </div>

      {/* Permission Alert if Revoked */}
      {!currentMentor.uploadPermissionGranted && (
        <div className="p-4 rounded-xl bg-[#3A1717] border border-[#FF6B6B]/40 text-xs text-[#FF6B6B] flex items-center gap-3 shadow-md">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>
            Upload permissions are currently disabled for this mentor account. An academy administrator must grant upload access via the Admin Console.
          </span>
        </div>
      )}

      {/* Upload & Edit Video Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl space-y-0">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#0F1522] border-b border-[#26304A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E5A82B]/20 border border-[#E5A82B]/50 flex items-center justify-center text-[#E5A82B]">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#F2F4F8]">
                    {editingVideo ? 'Edit Mentor Video Lesson' : 'Upload Mentor Video Lesson'}
                  </h3>
                  <span className="text-[11px] text-[#9AA6BD] font-mono">
                    Institutional Curriculum Content Studio
                  </span>
                </div>
              </div>

              <button
                onClick={handleResetForm}
                className="text-[#9AA6BD] hover:text-white p-1 rounded-lg hover:bg-[#212B42] touch-target"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={(e) => handleFormSubmit(e, 'published')} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {validationError && (
                <div className="p-3 bg-[#3A1717] border border-[#FF6B6B]/40 rounded-xl text-xs text-[#FF6B6B] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Upload Progress Indicator */}
              {isUploading && (
                <div className="p-4 bg-[#0B0F17] rounded-xl border border-[#E5A82B]/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#E5A82B] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E5A82B] animate-ping" />
                      Uploading & Processing Video ({uploadProgress}%)
                    </span>
                    <span className="font-mono text-[11px] text-[#9AA6BD]">{uploadSpeed}</span>
                  </div>
                  <div className="w-full h-2 bg-[#26304A] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#E5A82B] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Video File Dropzone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F4F8] flex items-center justify-between">
                  <span>Video File (Direct Upload) *</span>
                  <span className="text-[10px] text-[#9AA6BD]">MP4, WebM, MOV up to 500MB</span>
                </label>

                {videoFile ? (
                  <div className="p-3 bg-[#0B0F17] border border-[#3DDC97]/40 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-[#16382C] text-[#3DDC97] flex items-center justify-center shrink-0">
                        <Video className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-[#F2F4F8] truncate block">
                          {videoFile.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#9AA6BD]">
                          {(videoFile.size / (1024 * 1024)).toFixed(1)} MB • Validated Video Track
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoUrl('');
                      }}
                      className="text-[#9AA6BD] hover:text-[#FF6B6B] p-1.5 touch-target"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#26304A] hover:border-[#E5A82B]/60 bg-[#0B0F17] rounded-xl p-5 text-center cursor-pointer transition-colors group"
                  >
                    <Upload className="w-7 h-7 text-[#9AA6BD] group-hover:text-[#E5A82B] mx-auto mb-1.5 transition-colors" />
                    <span className="text-xs font-semibold text-[#F2F4F8] block">
                      Click to choose video file or drag and drop
                    </span>
                    <span className="text-[10px] text-[#9AA6BD]">
                      Large videos processed locally into high-bandwidth playable stream
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/*"
                      onChange={handleVideoFileSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Video Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F4F8] flex items-center justify-between">
                  <span>Lesson Title *</span>
                  <span className="text-[10px] text-[#9AA6BD] font-mono">{title.length}/120</span>
                </label>
                <input
                  type="text"
                  maxLength={120}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. XAUUSD 15M London Sweep & Bullish CHoCH Entry Execution (1:4.8 RR)"
                  className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F2F4F8] placeholder-[#9AA6BD]/50 outline-none"
                />
              </div>

              {/* 12 Categories Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F4F8]">
                    Video Category (1 of 12) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MentorVideoCategory)}
                    className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-3 py-2.5 text-xs text-[#F2F4F8] outline-none"
                  >
                    {MENTOR_VIDEO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Trading Instruments */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F4F8]">
                    Related Instruments
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {COMMON_INSTRUMENTS.map((ins) => {
                      const isSel = selectedInstruments.includes(ins);
                      return (
                        <button
                          key={ins}
                          type="button"
                          onClick={() => toggleInstrument(ins)}
                          className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-colors ${
                            isSel
                              ? 'bg-[#E5A82B] text-[#0B0F17] border-[#E5A82B] font-bold'
                              : 'bg-[#0B0F17] text-[#9AA6BD] border-[#26304A] hover:text-[#F2F4F8]'
                          }`}
                        >
                          {ins}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F4F8] flex items-center justify-between">
                  <span>Detailed Description & Curriculum Thesis *</span>
                  <span className="text-[10px] text-[#9AA6BD]">Markdown supported</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail high-timeframe market context, entry model rules (BOS/CHoCH/FVG), risk:reward ratio, invalidation criteria..."
                  className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl p-3 text-xs sm:text-sm text-[#F2F4F8] placeholder-[#9AA6BD]/50 outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Video Thumbnail Upload / Preset Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#F2F4F8] flex items-center justify-between">
                  <span>Video Thumbnail Image *</span>
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="text-[10px] text-[#E5A82B] hover:underline"
                  >
                    Upload Custom Image
                  </button>
                </label>

                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailSelect}
                  className="hidden"
                />

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {PRESET_THUMBNAILS.map((thumb, idx) => (
                    <div
                      key={idx}
                      onClick={() => setThumbnailUrl(thumb.url)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 shrink-0 w-32 h-20 transition-all ${
                        thumbnailUrl === thumb.url ? 'border-[#E5A82B] scale-105' : 'border-[#26304A] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={thumb.url} alt={thumb.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                        <span className="text-[8px] font-mono text-white truncate">{thumb.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F4F8]">
                  Tags (Comma separated)
                </label>
                <div className="relative">
                  <Tag className="w-3.5 h-3.5 text-[#9AA6BD] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="BOS, FVG, LondonSweep, US30, HighProbability"
                    className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl pl-9 pr-4 py-2 text-xs text-[#F2F4F8] outline-none font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons: Save Draft vs Publish */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#26304A]">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="touch-target px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA6BD] hover:text-[#F2F4F8]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={(e) => handleFormSubmit(e, 'draft')}
                  disabled={isUploading}
                  className="touch-target px-4 py-2 rounded-xl bg-[#212B42] hover:bg-[#26304A] text-xs font-semibold text-[#F2F4F8] transition-colors"
                >
                  Save as Draft
                </button>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="touch-target px-6 py-2.5 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#E5A82B]/20 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingVideo ? 'Update Lesson' : 'Publish Lesson'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mentor Uploaded Videos Management Table */}
      <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#E5A82B]" />
            <h2 className="text-sm sm:text-base font-bold text-[#F2F4F8]">
              Your Uploaded Video Lessons ({mentorVideos.length})
            </h2>
          </div>
          <span className="text-[11px] text-[#9AA6BD] font-mono">
            Direct Streaming • Protected Membership Access
          </span>
        </div>

        {mentorVideos.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#0B0F17] border border-[#26304A] flex items-center justify-center mx-auto text-[#9AA6BD]">
              <Film className="w-6 h-6" />
            </div>
            <p className="text-xs text-[#9AA6BD]">
              You haven't uploaded any mentor lessons yet. Click "Upload Video Lesson" above to share your first technical breakdown.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mentorVideos.map((video) => (
              <div
                key={video.id}
                className="p-3.5 sm:p-4 rounded-xl bg-[#0B0F17] border border-[#26304A] hover:border-[#E5A82B]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    onClick={() => onSelectVideoForWatch?.(video.id)}
                    className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 cursor-pointer border border-[#26304A]"
                  >
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[9px] font-mono text-white">
                      {Math.floor(video.durationSeconds / 60)}m
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1E2A4A] text-[#8FB0FF] border border-[#8FB0FF]/30">
                        {video.category}
                      </span>
                      {video.instruments.map(ins => (
                        <span key={ins} className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#3A2D0C] text-[#E5A82B] border border-[#E5A82B]/30">
                          {ins}
                        </span>
                      ))}
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                        video.status === 'published' ? 'bg-[#16382C] text-[#3DDC97]' : 'bg-[#26304A] text-[#9AA6BD]'
                      }`}>
                        {video.status}
                      </span>
                    </div>

                    <h4
                      onClick={() => onSelectVideoForWatch?.(video.id)}
                      className="text-xs sm:text-sm font-bold text-[#F2F4F8] group-hover:text-[#E5A82B] transition-colors truncate cursor-pointer"
                    >
                      {video.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[10px] font-mono text-[#9AA6BD]">
                      <span>{video.views} views</span>
                      <span>•</span>
                      <span>{video.likes} likes</span>
                      <span>•</span>
                      <span>{video.commentsCount} comments</span>
                      <span>•</span>
                      <span>Uploaded {video.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Controls */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleStartEdit(video)}
                    className="touch-target p-2 rounded-lg bg-[#1A2133] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A] transition-colors"
                    title="Edit video lesson"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete lesson "${video.title}"?`)) {
                        onDeleteVideo(video.id);
                      }
                    }}
                    className="touch-target p-2 rounded-lg bg-[#3A1717] hover:bg-[#4D1E1E] text-[#FF6B6B] border border-[#FF6B6B]/30 transition-colors"
                    title="Delete video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
