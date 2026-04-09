"use client";

import { PixelCard } from "@/components/pixel";

export default function ProfileCard() {
  return (
    <PixelCard className="text-center">
      <div className="w-16 h-16 mx-auto mb-3 pixel-border overflow-hidden">
        <img
          src="/images/squirtle-sprite.png"
          alt="Avatar"
          className="w-full h-full pixel-art object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect fill='%234A90D9' width='64' height='64'/><text x='32' y='40' text-anchor='middle' font-size='32'>🐢</text></svg>";
          }}
        />
      </div>
      <h2 className="font-pixel text-xs mb-1">Pixel Dev</h2>
      <p className="text-text-secondary text-xs">开发者 / 博主</p>
    </PixelCard>
  );
}
