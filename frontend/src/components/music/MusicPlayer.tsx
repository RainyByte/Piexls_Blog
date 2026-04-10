"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMusicStore } from "@/stores/musicStore";
import { getMusic } from "@/lib/api";
import { getMediaUrl } from "@/lib/media";
import { PixelCard } from "@/components/pixel";
import VinylRecord from "./VinylRecord";
import PlayerControls from "./PlayerControls";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastSrcRef = useRef<string>("");
  const {
    playlist,
    currentIndex,
    isPlaying,
    volume,
    repeatMode,
    setPlaylist,
    play,
    pause,
    next,
    prev,
    seek,
    setCurrentTime,
    setDuration,
    setVolume,
    cycleRepeat,
    currentTime,
    duration,
  } = useMusicStore();

  const currentTrack = playlist[currentIndex];

  // Fetch playlist on mount
  useEffect(() => {
    getMusic().then(setPlaylist).catch(() => {});
  }, [setPlaylist]);

  // Load new track when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const newSrc = getMediaUrl(currentTrack.file_path);
    if (lastSrcRef.current === newSrc) return;
    lastSrcRef.current = newSrc;

    audio.src = newSrc;
    audio.load();

    // Auto-play new track if already in playing state (e.g. next/prev)
    if (isPlaying) {
      audio.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.file_path]);

  // Pause audio when store sets isPlaying=false (e.g. end of playlist)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // Play/pause via direct click handler (user gesture context for Safari)
  const handleToggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      pause();
    } else {
      // Ensure source is loaded
      const expectedSrc = getMediaUrl(currentTrack.file_path);
      if (lastSrcRef.current !== expectedSrc) {
        lastSrcRef.current = expectedSrc;
        audio.src = expectedSrc;
        audio.load();
      }
      play(); // Update UI immediately
      audio.play().catch(() => {
        pause(); // Revert on failure
      });
    }
  }, [isPlaying, currentTrack, play, pause]);

  // Handle track ended — repeat-one restarts, otherwise advance
  const handleEnded = useCallback(() => {
    const audio = audioRef.current;
    if (repeatMode === "one" && audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      next();
    }
  }, [repeatMode, next]);

  const handleSeek = useCallback(
    (time: number) => {
      seek(time);
      if (audioRef.current) audioRef.current.currentTime = time;
    },
    [seek]
  );

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (playlist.length === 0) return null;

  return (
    <PixelCard padding="sm">
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleEnded}
        onError={(e) => {
          const err = e.currentTarget.error;
          if (err) console.warn("Audio error:", err.message, "code:", err.code);
        }}
      />
      <h3 className="font-pixel text-[0.5rem] mb-2 text-text-secondary">{"// NOW PLAYING"}</h3>
      <div className="flex items-center gap-3">
        <VinylRecord
          coverUrl={getMediaUrl(currentTrack?.cover_path)}
          isPlaying={isPlaying}
        />
        <div className="flex-1 min-w-0">
          <p className="font-pixel text-[0.5rem] truncate">{currentTrack?.title || "---"}</p>
          <p className="text-[0.6rem] text-text-secondary truncate">
            {currentTrack?.artist || "Unknown"}
          </p>
          <PlayerControls
            isPlaying={isPlaying}
            onToggle={handleToggle}
            onPrev={prev}
            onNext={next}
            repeatMode={repeatMode}
            onCycleRepeat={cycleRepeat}
          />
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-2 flex items-center gap-2 text-[0.5rem] text-text-secondary">
        <span className="font-code">{formatTime(currentTime)}</span>
        <div
          className="flex-1 h-[6px] bg-bg-secondary border-2 border-border cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            handleSeek(pct * duration);
          }}
        >
          <div
            className="h-full bg-primary"
            style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
          />
        </div>
        <span className="font-code">{formatTime(duration)}</span>
      </div>
      {/* Volume */}
      <div className="mt-1 flex items-center gap-2">
        <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 5h2l4-3v12L4 11H2V5zm10 1a4 4 0 010 4M10 4a6 6 0 010 8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 h-1 accent-[var(--color-primary)]"
        />
      </div>
    </PixelCard>
  );
}
