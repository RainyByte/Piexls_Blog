"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function PixelInput({ label, className = "", ...props }: PixelInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-pixel text-xs text-text-secondary">{label}</label>}
      <input
        className={`px-3 py-2 bg-bg border-[3px] border-border text-text font-body outline-none focus:border-primary transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}

interface PixelTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function PixelTextarea({ label, className = "", ...props }: PixelTextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-pixel text-xs text-text-secondary">{label}</label>}
      <textarea
        className={`px-3 py-2 bg-bg border-[3px] border-border text-text font-body outline-none focus:border-primary transition-colors resize-y ${className}`}
        {...props}
      />
    </div>
  );
}
