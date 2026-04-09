"use client";

interface PixelModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function PixelModal({ open, onClose, title, children }: PixelModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative pixel-border bg-bg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-pixel text-sm">{title}</h2>
          <button onClick={onClose} className="font-pixel text-lg hover:text-primary">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
