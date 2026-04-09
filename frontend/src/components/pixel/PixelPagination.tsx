"use client";

interface PixelPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PixelPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PixelPaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex gap-2 items-center justify-center mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 font-pixel text-xs pixel-border pixel-border-hover disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ◀
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 font-pixel text-xs pixel-border pixel-border-hover ${
            page === currentPage ? "bg-primary text-white" : "bg-bg"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 font-pixel text-xs pixel-border pixel-border-hover disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ▶
      </button>
    </div>
  );
}
