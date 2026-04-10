import Link from "next/link";
import { PixelCard, PixelTag } from "@/components/pixel";
import { getMediaUrl } from "@/lib/media";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : new Date(post.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  return (
    <PixelCard hoverable>
      <Link href={`/posts/${post.slug}`} className="block">
        <h2 className="font-pixel text-[0.65rem] md:text-[0.75rem] leading-relaxed mb-2 hover:text-primary transition-colors">
          {post.title}
        </h2>
        <div className="flex items-center gap-3 text-text-secondary text-xs mb-2">
          <span className="flex items-center gap-1">
            <span className="text-[0.6rem]">&#9635;</span> {dateStr}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-[0.6rem]">&#9719;</span> {post.reading_time} min read
          </span>
        </div>
        {post.excerpt && (
          <p className="text-text-secondary text-sm leading-relaxed mb-3 line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <div className="flex gap-2 flex-wrap mb-3">
          {post.category && (
            <PixelTag color="blue">{post.category.name}</PixelTag>
          )}
          {post.tags?.map((tag) => (
            <PixelTag key={tag.id} color={tag.color}>
              {tag.name}
            </PixelTag>
          ))}
        </div>
        {post.cover_image && (
          <div className="overflow-hidden pixel-border">
            <img
              src={getMediaUrl(post.cover_image)}
              alt={post.title}
              className="w-full h-44 object-cover"
            />
          </div>
        )}
      </Link>
    </PixelCard>
  );
}
