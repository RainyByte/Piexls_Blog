"use client";

interface PlayerControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  repeatMode: "none" | "all" | "one";
  onCycleRepeat: () => void;
}

const repeatIcons = { none: "➡️", all: "🔁", one: "🔂" };

export default function PlayerControls({
  isPlaying,
  onToggle,
  onPrev,
  onNext,
  repeatMode,
  onCycleRepeat,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onPrev} className="w-6 h-6 flex items-center justify-center text-xs hover:text-primary">
        ⏮
      </button>
      <button
        onClick={onToggle}
        className="w-8 h-8 flex items-center justify-center pixel-border pixel-border-hover bg-bg text-sm"
      >
        {isPlaying ? "⏸" : "▶️"}
      </button>
      <button onClick={onNext} className="w-6 h-6 flex items-center justify-center text-xs hover:text-primary">
        ⏭
      </button>
      <button
        onClick={onCycleRepeat}
        className="w-6 h-6 flex items-center justify-center text-[0.5rem] hover:text-primary"
        title={`Repeat: ${repeatMode}`}
      >
        {repeatIcons[repeatMode]}
      </button>
    </div>
  );
}
