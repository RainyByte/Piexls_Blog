"use client";

import { useEffect, useRef } from "react";
import { useMusicStore } from "@/stores/musicStore";
import { getMusic } from "@/lib/api";
import { PixelCard } from "@/components/pixel";
import VinylRecord from "./VinylRecord";
import PlayerControls from "./PlayerControls";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    playlist,
    currentIndex,
    isPlaying,
    volume,
    repeatMode,
    setPlaylist,
    toggle,
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

  // Load playlist on mount
  useEffect(() => {
    getMusic().then(setPlaylist).catch(() => {});
  }, [setPlaylist]);

  // Sync audio src when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || playlist.length === 0) return;
    const track = playlist[currentIndex];
    if (!track) return;
    const src = `/uploads/${track.file_path}`;
    if (audio.src !== window.location.origin + src) {
      audio.src = src;
      if (isPlaying) audio.play().catch(() => {});
    }
  }, [currentIndex, playlist]);

  // Sync play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume / 100;
  }, [volume]);

  const currentTrack = playlist[currentIndex];

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
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={next}
      />
      <h3 className="font-pixel text-[0.5rem] mb-2 text-text-secondary">🎵 Now Playing</h3>
      <div className="flex items-center gap-3">
        <VinylRecord
          coverUrl={currentTrack?.cover_path ? `/uploads/${currentTrack.cover_path}` : undefined}
          isPlaying={isPlaying}
        />
        <div className="flex-1 min-w-0">
          <p className="font-pixel text-[0.5rem] truncate">{currentTrack?.title || "---"}</p>
          <p className="text-[0.6rem] text-text-secondary truncate">
            {currentTrack?.artist || "Unknown"}
          </p>
          <PlayerControls
            isPlaying={isPlaying}
            onToggle={toggle}
            onPrev={prev}
            onNext={next}
            repeatMode={repeatMode}
            onCycleRepeat={cycleRepeat}
          />
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-2 flex items-center gap-2 text-[0.5rem] text-text-secondary">
        <span>{formatTime(currentTime)}</span>
        <div
          className="flex-1 h-1 bg-bg-secondary border border-border cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const time = pct * duration;
            seek(time);
            if (audioRef.current) audioRef.current.currentTime = time;
          }}
        >
          <div
            className="h-full bg-primary"
            style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>
      {/* Volume */}
      <div className="mt-1 flex items-center gap-2">
        <span className="text-[0.5rem]">🔊</span>
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
