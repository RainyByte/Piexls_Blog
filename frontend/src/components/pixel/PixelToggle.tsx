"use client";

interface PixelToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export default function PixelToggle({ checked, onChange, label }: PixelToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 border-[3px] border-border transition-colors ${
          checked ? "bg-primary" : "bg-bg-secondary"
        }`}
      >
        <div
          className={`absolute top-0 w-4 h-full bg-text transition-transform ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
      {label && <span className="font-pixel text-xs">{label}</span>}
    </label>
  );
}
