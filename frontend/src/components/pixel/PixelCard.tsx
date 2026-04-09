interface PixelCardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  padding?: "sm" | "md" | "lg";
  className?: string;
}

const paddingStyles = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function PixelCard({
  children,
  hoverable = false,
  padding = "md",
  className = "",
}: PixelCardProps) {
  return (
    <div
      className={`pixel-border bg-bg ${paddingStyles[padding]} ${
        hoverable ? "pixel-border-hover cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
