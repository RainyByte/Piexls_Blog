"use client";

import { SelectHTMLAttributes } from "react";

interface PixelSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
}

export default function PixelSelect({ label, options, className = "", ...props }: PixelSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-pixel text-xs text-text-secondary">{label}</label>}
      <select
        className={`px-3 py-2 bg-bg border-[3px] border-border text-text font-body outline-none focus:border-primary ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
