import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  RotateCw, 
  Settings, 
  Check, 
  Sparkles,
  ShieldCheck,
  Minimize2
} from 'lucide-react';

interface MentorVideoPlayerProps {
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string;
  userEmail: string;
  deviceId: string;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const QUALITIES = ['360p', '720p', '1080p (Auto)', '4K UHD'];

export const MentorVideoPlayer: React.FC<MentorVideoPlayerProps> = ({
  videoId,
  videoUrl,
  title,
  thumbnailUrl,
  userEmail,
  deviceId,
  onEnded,
  onTimeUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('1080p (Auto)');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [resumedFromNotice, setResumedFromNotice] = useState<number | null>(null);

  // Resume watching from last position
  useEffect(() => {
    const savedTime = localStorage.getItem(`vyrox_video_pos_${videoId}`);
    if (savedTime && videoRef.current) {
      const parsedTime = parseFloat(savedTime);
      if (parsedTime > 5) {
        videoRef.current.currentTime = parsedTime;
        setCurrentTime(parsedTime);
        setResumedFromNotice(parsedTime);
        setTimeout(() => setResumedFromNotice(null), 4000);
      }
    }
  }, [videoId]);

  // Periodic save position to localStorage
  useEffect(() => {
    if (currentTime > 5 && duration > 0) {
      localStorage.setItem(`vyrox_video_pos_${videoId}`, currentTime.toString());
    }
  }, [currentTime, duration, videoId]);

  // Auto-hide controls timer
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying) {
      timeout = setTimeout(() => {
        if (!showSpeedMenu && !showQualityMenu) {
          setShowControls(false);
        }
      }, 3000);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showSpeedMenu, showQualityMenu]);

  // Handle Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Skip time forward / backward
  const handleSeekOffset = (seconds: number) => {
    if (!videoRef.current) return;
    const target = Math.min(Math.max(0, videoRef.current.currentTime + seconds), duration);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  // Timeline scrub
  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const target = parseFloat(e.target.value);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  // Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Speed change
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // Picture in Picture toggle
  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP not available or permission denied:', err);
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative rounded-2xl overflow-hidden bg-black border border-[#26304A] group shadow-2xl select-none aspect-video flex items-center justify-center"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        playsInline
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            onTimeUpdate?.(videoRef.current.currentTime, videoRef.current.duration);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
      />

      {/* Floating Dynamic Watermark (Anti-Piracy Security) */}
      <div 
        className="absolute top-4 left-6 pointer-events-none opacity-30 text-[10px] font-mono text-[#F2F4F8] z-10 hidden sm:block tracking-wider"
      >
        <span>{userEmail} • {deviceId}</span>
      </div>

      {/* Resumed from last position toast notice */}
      {resumedFromNotice !== null && (
        <div className="absolute top-4 right-4 z-20 bg-[#1A2133]/90 border border-[#E5A82B] text-xs font-semibold text-[#F2F4F8] px-3 py-1.5 rounded-lg backdrop-blur-md flex items-center gap-2 shadow-lg animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#E5A82B]" />
          <span>Resumed from {formatTime(resumedFromNotice)}</span>
        </div>
      )}

      {/* Big Center Play Button when Paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E5A82B]/90 hover:bg-[#E5A82B] text-[#0B0F17] flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 touch-target"
          aria-label="Play video"
        >
          <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
        </button>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 space-y-2.5 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubbable Progress Bar */}
        <div className="relative group/progress flex items-center">
          <div className="w-full h-1.5 group-hover/progress:h-2.5 bg-[#26304A] rounded-full overflow-hidden relative transition-all cursor-pointer">
            <div
              className="h-full bg-[#E5A82B] transition-all relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleScrub}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Seek progress"
          />
        </div>

        {/* Lower Control Bar */}
        <div className="flex items-center justify-between text-white text-xs gap-2 flex-wrap">
          {/* Left Controls: Play/Pause, Rewind 10, Forward 10, Volume, Time */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 hover:text-[#E5A82B] transition-colors touch-target"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => handleSeekOffset(-10)}
              className="p-1 hover:text-[#E5A82B] transition-colors hidden sm:inline-block touch-target"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSeekOffset(10)}
              className="p-1 hover:text-[#E5A82B] transition-colors hidden sm:inline-block touch-target"
              title="Forward 10 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/volume">
              <button
                onClick={toggleMute}
                className="p-1 hover:text-[#E5A82B] transition-colors touch-target"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-18 accent-[#E5A82B] h-1 bg-[#26304A] rounded-lg cursor-pointer hidden sm:block"
                aria-label="Volume slider"
              />
            </div>

            {/* Time Display */}
            <span className="font-mono text-[11px] text-[#9AA6BD]">
              <span className="text-[#F2F4F8]">{formatTime(currentTime)}</span> / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls: Playback Speed, Quality, PiP, Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Speed Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSpeedMenu(!showSpeedMenu);
                  setShowQualityMenu(false);
                }}
                className="touch-target px-2 py-1 rounded bg-[#1A2133] hover:bg-[#212B42] text-[11px] font-mono border border-[#26304A] hover:border-[#E5A82B] text-[#F2F4F8] transition-colors"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 bg-[#1A2133] border border-[#26304A] rounded-xl p-1.5 shadow-2xl z-30 min-w-[100px] space-y-1">
                  <div className="text-[10px] font-mono uppercase text-[#9AA6BD] px-2 py-0.5">Speed</div>
                  {PLAYBACK_SPEEDS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`w-full text-left px-2.5 py-1 text-xs rounded-lg flex items-center justify-between transition-colors ${
                        playbackSpeed === s ? 'bg-[#E5A82B] text-[#0B0F17] font-bold' : 'text-[#F2F4F8] hover:bg-[#212B42]'
                      }`}
                    >
                      <span>{s}x</span>
                      {playbackSpeed === s && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowQualityMenu(!showQualityMenu);
                  setShowSpeedMenu(false);
                }}
                className="touch-target p-1.5 rounded hover:text-[#E5A82B] transition-colors hidden sm:block"
                title="Video Quality"
              >
                <Settings className="w-4 h-4" />
              </button>

              {showQualityMenu && (
                <div className="absolute bottom-8 right-0 bg-[#1A2133] border border-[#26304A] rounded-xl p-1.5 shadow-2xl z-30 min-w-[130px] space-y-1">
                  <div className="text-[10px] font-mono uppercase text-[#9AA6BD] px-2 py-0.5">Quality</div>
                  {QUALITIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setQuality(q);
                        setShowQualityMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1 text-xs rounded-lg flex items-center justify-between transition-colors ${
                        quality === q ? 'bg-[#E5A82B] text-[#0B0F17] font-bold' : 'text-[#F2F4F8] hover:bg-[#212B42]'
                      }`}
                    >
                      <span>{q}</span>
                      {quality === q && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture in Picture */}
            {'pictureInPictureEnabled' in document && (
              <button
                onClick={togglePiP}
                className="touch-target p-1.5 hover:text-[#E5A82B] transition-colors hidden md:block text-[11px] font-mono"
                title="Picture-in-Picture"
              >
                PiP
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="touch-target p-1.5 hover:text-[#E5A82B] transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
