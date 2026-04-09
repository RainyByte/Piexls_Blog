"use client";

interface VinylRecordProps {
  coverUrl?: string;
  isPlaying: boolean;
}

export default function VinylRecord({ coverUrl, isPlaying }: VinylRecordProps) {
  return (
    <div
      className={`w-[60px] h-[60px] rounded-full border-[3px] border-border overflow-hidden relative flex-shrink-0 ${
        isPlaying ? "animate-spin-slow" : ""
      }`}
      style={{ animationPlayState: isPlaying ? "running" : "paused" }}
    >
      {coverUrl ? (
        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover pixel-art" />
      ) : (
        <div className="w-full h-full bg-text flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-bg-secondary border-2 border-border" />
        </div>
      )}
      {/* Center hole */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-3 h-3 rounded-full bg-bg border-2 border-border" />
      </div>
    </div>
  );
}
