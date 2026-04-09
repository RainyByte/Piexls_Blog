import { TAG_COLORS } from "@/lib/constants";

interface PixelTagProps {
  color?: "blue" | "yellow" | "green" | "red";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function PixelTag({
  color = "blue",
  children,
  onClick,
  className = "",
}: PixelTagProps) {
  const colors = TAG_COLORS[color] || TAG_COLORS.blue;
  return (
    <span
      onClick={onClick}
      className={`inline-block px-2 py-1 text-[0.6rem] font-pixel border-2 border-border ${colors.bg} ${colors.text} ${
        onClick ? "cursor-pointer hover:opacity-80" : ""
      } ${className}`}
    >
      {children}
    </span>
  );
}
