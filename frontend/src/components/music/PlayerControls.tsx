"use client";

interface PlayerControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  repeatMode: "none" | "all" | "one";
  onCycleRepeat: () => void;
}

const repeatLabels = { none: "->", all: "ALL", one: "1" };

export default function PlayerControls({
  isPlaying,
  onToggle,
  onPrev,
  onNext,
  repeatMode,
  onCycleRepeat,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <button
        onClick={onPrev}
        className="w-6 h-6 flex items-center justify-center font-pixel text-[0.4rem] hover:text-primary cursor-pointer"
        aria-label="Previous track"
      >
        {"<<"}
      </button>
      <button
        onClick={onToggle}
        className="w-7 h-7 flex items-center justify-center pixel-border pixel-border-hover bg-bg font-pixel text-[0.5rem]"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "||" : ">"}
      </button>
      <button
        onClick={onNext}
        className="w-6 h-6 flex items-center justify-center font-pixel text-[0.4rem] hover:text-primary cursor-pointer"
        aria-label="Next track"
      >
        {">>"}
      </button>
      <button
        onClick={onCycleRepeat}
        className={`w-6 h-6 flex items-center justify-center font-pixel text-[0.35rem] hover:text-primary cursor-pointer ${
          repeatMode !== "none" ? "text-primary" : ""
        }`}
        title={`Repeat: ${repeatMode}`}
        aria-label={`Repeat mode: ${repeatMode}`}
      >
        {repeatLabels[repeatMode]}
      </button>
    </div>
  );
}
