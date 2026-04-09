"use client";

import { PixelCard } from "@/components/pixel";

export default function ProfileCard() {
  return (
    <PixelCard>
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 mb-3 pixel-border overflow-hidden">
          <img
            src="/images/avatar.png"
            alt="Avatar"
            className="w-full h-full pixel-art object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><rect fill='%234A90D9' width='80' height='80'/><text x='40' y='52' text-anchor='middle' font-size='36'>PB</text></svg>";
            }}
          />
        </div>
        <h2 className="font-pixel text-[0.6rem] mb-2">PIXEL DEV</h2>
        <p className="text-text-secondary text-xs leading-relaxed opacity-65 mb-3">
          A developer who loves pixel art, clean code, and sharing knowledge.
        </p>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {["Developer", "Blogger", "Creator"].map((tag) => (
            <span
              key={tag}
              className="font-pixel text-[0.4rem] px-2 py-1 pixel-border bg-bg-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </PixelCard>
  );
}
