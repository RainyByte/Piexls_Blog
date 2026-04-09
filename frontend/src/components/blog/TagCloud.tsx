import Link from "next/link";
import { PixelCard, PixelTag } from "@/components/pixel";
import { Tag } from "@/types";

interface TagCloudProps {
  tags: Tag[];
  currentSlug?: string;
}

export default function TagCloud({ tags, currentSlug }: TagCloudProps) {
  if (tags.length === 0) return null;

  return (
    <PixelCard>
      <h3 className="font-pixel text-[0.65rem] mb-3">标签</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag.id} href={`/tag/${tag.slug}`}>
            <PixelTag
              color={tag.color}
              className={currentSlug === tag.slug ? "ring-2 ring-primary" : ""}
            >
              {tag.name}
            </PixelTag>
          </Link>
        ))}
      </div>
    </PixelCard>
  );
}
