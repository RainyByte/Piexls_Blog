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
      <h3 className="font-pixel text-[0.55rem] mb-3 text-text-secondary">{"// CATEGORIES"}</h3>
      <div className="flex flex-col gap-1.5">
        <Link
          href="/"
          className={`flex items-center justify-between py-1.5 px-2 text-sm hover:text-primary transition-colors ${
            !currentSlug ? "text-primary font-semibold bg-bg-secondary" : ""
          }`}
        >
          <span>All</span>
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={`flex items-center justify-between py-1.5 px-2 text-sm hover:text-primary transition-colors ${
              currentSlug === cat.slug ? "text-primary font-semibold bg-bg-secondary" : ""
            }`}
          >
            <span>{cat.name}</span>
            <span className="font-pixel text-[0.4rem] px-1.5 py-0.5 bg-text text-bg min-w-[1.5rem] text-center">
              {cat.post_count || 0}
            </span>
          </Link>
        ))}
      </div>
    </PixelCard>
  );
}
