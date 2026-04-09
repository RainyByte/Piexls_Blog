import Link from "next/link";
import { PixelCard } from "@/components/pixel";
import { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  currentSlug?: string;
}

export default function CategoryFilter({ categories, currentSlug }: CategoryFilterProps) {
  return (
    <PixelCard>
      <h3 className="font-pixel text-[0.65rem] mb-3">分类</h3>
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className={`text-sm hover:text-primary ${!currentSlug ? "text-primary font-bold" : ""}`}
        >
          📁 全部
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={`text-sm hover:text-primary ${
              currentSlug === cat.slug ? "text-primary font-bold" : ""
            }`}
          >
            📁 {cat.name} ({cat.post_count || 0})
          </Link>
        ))}
      </div>
    </PixelCard>
  );
}
