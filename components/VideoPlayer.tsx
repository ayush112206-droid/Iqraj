'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls, { Level } from 'hls.js';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Volume2, VolumeX, Settings, 
  RotateCcw, RotateCw, Lock, Unlock, Maximize2, Minimize2,
  RefreshCw, ChevronLeft, Check
} from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title: string;
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [controlsLocked, setControlsLocked] = useState(false);
  
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [qualities, setQualities] = useState<Level[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);

  const [showSettings, setShowSettings] = useState(false);
  const [settingsMenuUI, setSettingsMenuUI] = useState<'main' | 'speed' | 'quality'>('main');

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastTapTimeRef = useRef(0);

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    setLoading(true);
    setError(null);

    const proxiedUrl = `/api/proxy/playlist?url=${encodeURIComponent(url)}`;

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 600,
        maxMaxBufferLength: 1800,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 5.0,
        enableWorker: true
      });

      hlsRef.current = hls;
      hls.loadSource(proxiedUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setQualities(data.levels);
        setLoading(false);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentQuality(hls.autoLevelEnabled ? -1 : data.level);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.error('HLS Fatal Error:', data.type, data.details);
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            setError('Network Error - Try reloading');
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            setError('Media Error - Try another stream');
          } else {
            setError('Stream Error: ' + data.details);
          }
          setLoading(false);
        }
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = proxiedUrl;
      video.addEventListener('loadedmetadata', () => {
        setLoading(false);
        video.play().catch(() => {});
      });
    } else {
      setError('HLS is not supported in this browser');
      setLoading(false);
    }
  }, [url]);

  const resetHideControlsTimer = React.useCallback(() => {
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    setShowControls(true);
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying && !showSettings && !controlsLocked && !isDragging) {
        setShowControls(false);
      }
    }, 3500);
  }, [isPlaying, showSettings, controlsLocked, isDragging]);

  const toggleFullscreen = React.useCallback(() => {
    if (controlsLocked) return;
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, [controlsLocked]);

  const togglePlay = React.useCallback(() => {
    if (controlsLocked) return;
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
    resetHideControlsTimer();
  }, [controlsLocked, resetHideControlsTimer]);

  const handleVideoInteraction = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (controlsLocked) return;
    const now = Date.now();
    const timeDiff = now - lastTapTimeRef.current;

    let clientX = 0;
    if ('touches' in e) {
      clientX = (e as React.TouchEvent).touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    if (timeDiff < 300 && timeDiff > 0) {
      // Double tap detected
      lastTapTimeRef.current = 0;
      if (!containerRef.current || !videoRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      
      // Left 30% = Rewind, Right 30% = Forward
      if (x < rect.width * 0.3) {
        videoRef.current.currentTime -= 10;
      } else if (x > rect.width * 0.7) {
        videoRef.current.currentTime += 10;
      } else {
        toggleFullscreen();
      }
    } else {
      // Single tap
      lastTapTimeRef.current = now;
      setShowControls((prev) => !prev);
      if (showSettings) setShowSettings(false);
      resetHideControlsTimer();
    }
  }, [controlsLocked, showSettings, toggleFullscreen, resetHideControlsTimer]);

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      const v = videoRef.current;
      setCurrentTime(v.currentTime);
      setDuration(v.duration);
      if (v.duration > 0) {
        setProgress((v.currentTime / v.duration) * 100);
      }

      if (v.buffered.length > 0) {
        const bufferedEnd = v.buffered.end(v.buffered.length - 1);
        setBuffer((bufferedEnd / v.duration) * 100);
      }
    }
  };

  const handleSeek = (clientX: number) => {
    if (controlsLocked || !videoRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const percent = pos * 100;
    setProgress(percent);
    if (!isNaN(videoRef.current.duration)) {
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const changeQuality = (index: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = index;
      setCurrentQuality(index);
    }
    setSettingsMenuUI('main');
    setShowSettings(false);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-video bg-black overflow-hidden group select-none shadow-2xl ${isFullscreen ? 'h-screen max-w-none' : ''}`}
      onMouseMove={resetHideControlsTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onClick={handleVideoInteraction}
        onTouchStart={handleVideoInteraction}
        playsInline
      />

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none z-10">
          <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin mb-3" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 p-6 text-center">
          <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 mb-3" />
          <h2 className="text-white text-sm sm:text-lg font-bold mb-3">{error}</h2>
          <button 
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-pink-600 text-white text-xs sm:text-sm rounded-lg font-bold"
          >
            Reload Stream
          </button>
        </div>
      )}

      {/* Center Play Button Overlay (Fades out when playing) */}
      {!isPlaying && !loading && !error && (
        <button 
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-black/40 backdrop-blur border border-white/20 rounded-full text-white hover:bg-pink-600/80 transition-colors z-20 pointer-events-auto"
        >
          <Play className="w-5 h-5 sm:w-7 sm:h-7 fill-white ml-1" />
        </button>
      )}

      {/* Lock Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); setControlsLocked(!controlsLocked); }}
        className={`absolute right-4 top-4 sm:right-6 sm:top-6 z-50 p-2 sm:p-3 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 transition-opacity duration-300 ${showControls || controlsLocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {controlsLocked ? <Unlock className="w-4 h-4 sm:w-5 sm:h-5" /> : <Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
      </button>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && !controlsLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 pb-2 px-3 sm:px-4 z-40 pointer-events-none"
          >
            {/* Pointer-events-auto wrapper for interactive controls */}
            <div className="pointer-events-auto max-w-full">
               {/* Progress Container */}
               <div 
                 className="relative w-full h-1 sm:h-1.5 bg-white/20 cursor-pointer rounded-full mb-2 sm:mb-3 group/progress"
                 onMouseDown={(e) => {
                   setIsDragging(true);
                   handleSeek(e.clientX);
                 }}
                 onMouseMove={(e) => {
                   if (isDragging) handleSeek(e.clientX);
                 }}
                 onMouseUp={() => setIsDragging(false)}
                 onMouseLeave={() => setIsDragging(false)}
                 onTouchStart={(e) => {
                   setIsDragging(true);
                   handleSeek(e.touches[0].clientX);
                 }}
                 onTouchMove={(e) => {
                   if (isDragging) handleSeek(e.touches[0].clientX);
                 }}
                 onTouchEnd={() => setIsDragging(false)}
               >
                 {/* Buffer Bar */}
                 <div 
                   className="absolute top-0 left-0 h-full bg-white/40 rounded-full transition-all"
                   style={{ width: `${buffer}%` }}
                 />
                 {/* Progress Bar */}
                 <div 
                   className="absolute top-0 left-0 h-full bg-pink-600 rounded-full"
                   style={{ width: `${progress}%` }}
                 />
                 {/* Progress Handle */}
                 <div 
                   className="absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full border border-transparent shadow-[0_0_8px_rgba(255,45,85,0.6)] sm:group-hover/progress:scale-125 transition-transform"
                   style={{ 
                     left: `${progress}%`,
                     backgroundImage: 'linear-gradient(135deg, white, white), linear-gradient(90deg, #ff4757, #ffa502, #2ed573, #3742fa, #8e44ad)',
                     backgroundOrigin: 'border-box',
                     backgroundClip: 'content-box, border-box'
                   }}
                 />
               </div>

               {/* Bottom Control Bar */}
               <div className="flex items-center justify-between gap-2">
                 <div className="flex items-center gap-1 sm:gap-2">
                   <button onClick={togglePlay} className="p-1.5 sm:p-2 text-white hover:text-pink-500 transition-colors">
                     {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />}
                   </button>
                   
                   <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)} className="p-1 sm:p-2 text-white/80 hover:text-white transition-colors">
                     <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                   </button>
                   <button onClick={() => videoRef.current && (videoRef.current.currentTime += 10)} className="p-1 sm:p-2 text-white/80 hover:text-white transition-colors">
                     <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                   </button>

                   <div className="flex items-center group/volume ml-1 sm:ml-2">
                     <button onClick={() => setIsMuted(!isMuted)} className="p-1 sm:p-2 text-white/80 hover:text-white transition-colors">
                       {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                     </button>
                     <div className="hidden sm:block relative w-16 h-1 ml-2 bg-white/20 rounded-full overflow-hidden">
                       <div className="absolute top-0 left-0 h-full bg-green-500 pointer-events-none" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
                       <input
                         type="range" min="0" max="1" step="0.01"
                         value={String(isMuted ? 0 : volume)}
                         onChange={(e) => {
                           const val = parseFloat(e.target.value);
                           setVolume(val);
                           if (videoRef.current) {
                             videoRef.current.volume = val;
                             videoRef.current.muted = val === 0;
                           }
                           setIsMuted(val === 0);
                         }}
                         className="absolute inset-0 opacity-0 cursor-pointer"
                       />
                     </div>
                   </div>

                   <div className="text-white text-[9px] sm:text-xs font-medium tabular-nums ml-1 sm:ml-2 opacity-90 tracking-wide">
                     {formatTime(currentTime)} / {formatTime(duration)}
                   </div>
                 </div>

                 <div className="flex items-center gap-1 sm:gap-2 relative">
                   <button 
                     onClick={() => setShowSettings(!showSettings)}
                     className="p-1.5 sm:p-2 text-white/80 hover:text-white transition-colors"
                   >
                     <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                   </button>
                   
                   {/* Settings Menu Popup */}
                   <AnimatePresence>
                     {showSettings && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
                         className="absolute bottom-full right-0 mb-3 bg-zinc-900/95 border border-white/10 rounded-xl overflow-hidden py-1 min-w-[140px] shadow-2xl backdrop-blur-md z-50 text-[10px] sm:text-xs"
                       >
                         {settingsMenuUI === 'main' && (
                           <div className="flex flex-col">
                             <button onClick={() => setSettingsMenuUI('quality')} className="px-3 py-2.5 text-left text-white hover:bg-white/10 flex justify-between items-center gap-4">
                               <span className="font-medium">Quality</span>
                               <span className="text-zinc-400 font-mono">
                                 {currentQuality === -1 ? 'Auto' : (qualities[currentQuality]?.height ? `${qualities[currentQuality].height}p` : 'Auto')}
                               </span>
                             </button>
                             <button onClick={() => setSettingsMenuUI('speed')} className="px-3 py-2.5 text-left text-white hover:bg-white/10 flex justify-between items-center gap-4">
                               <span className="font-medium">Speed</span>
                               <span className="text-zinc-400 font-mono">{playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`}</span>
                             </button>
                           </div>
                         )}
                         
                         {settingsMenuUI === 'quality' && (
                           <div className="flex flex-col max-h-48 overflow-y-auto custom-scrollbar">
                             <button onClick={() => setSettingsMenuUI('main')} className="px-3 py-2 text-left text-zinc-400 border-b border-white/10 hover:bg-white/10 flex items-center gap-2 font-bold bg-zinc-800/50">
                               <ChevronLeft className="w-3 h-3" /> Quality
                             </button>
                             <button onClick={() => changeQuality(-1)} className={`px-3 py-2.5 text-left hover:bg-white/10 flex items-center justify-between ${currentQuality === -1 ? 'text-pink-500 font-bold bg-pink-500/10' : 'text-white'}`}>
                               Auto {currentQuality === -1 && <Check className="w-3 h-3 text-pink-500" />}
                             </button>
                             {[...qualities].reverse().map((q, i) => {
                               // HLS often organizes levels from lowest (0) to highest.
                               // By reversing, we show 1080p -> 720p -> 480p etc.
                               const actualIndex = qualities.length - 1 - i;
                               return (
                                 <button key={actualIndex} onClick={() => changeQuality(actualIndex)} className={`px-3 py-2.5 text-left hover:bg-white/10 flex items-center justify-between ${currentQuality === actualIndex ? 'text-pink-500 font-bold bg-pink-500/10' : 'text-white'}`}>
                                   <span className="font-mono">{q.height}p</span>
                                   {currentQuality === actualIndex && <Check className="w-3 h-3 text-pink-500" />}
                                 </button>
                               );
                             })}
                           </div>
                         )}
                         
                         {settingsMenuUI === 'speed' && (
                           <div className="flex flex-col max-h-48 overflow-y-auto custom-scrollbar">
                             <button onClick={() => setSettingsMenuUI('main')} className="px-3 py-2 text-left text-zinc-400 border-b border-white/10 hover:bg-white/10 flex items-center gap-2 font-bold bg-zinc-800/50">
                               <ChevronLeft className="w-3 h-3" /> Speed
                             </button>
                             {speeds.map((s) => (
                               <button key={s} onClick={() => { setPlaybackSpeed(s); if (videoRef.current) videoRef.current.playbackRate = s; setSettingsMenuUI('main'); setShowSettings(false); }} className={`px-3 py-2.5 text-left hover:bg-white/10 flex items-center justify-between font-mono ${playbackSpeed === s ? 'text-pink-500 font-bold bg-pink-500/10' : 'text-white'}`}>
                                 {s === 1 ? 'Normal' : `${s}x`} {playbackSpeed === s && <Check className="w-3 h-3 text-pink-500" />}
                               </button>
                             ))}
                           </div>
                         )}
                       </motion.div>
                     )}
                   </AnimatePresence>

                   <button onClick={toggleFullscreen} className="p-1.5 sm:p-2 text-white/80 hover:text-white transition-colors">
                     {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                   </button>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
