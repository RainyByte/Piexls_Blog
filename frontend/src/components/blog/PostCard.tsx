import Link from "next/link";
import { PixelCard, PixelTag } from "@/components/pixel";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <PixelCard hoverable>
      <Link href={`/posts/${post.slug}`} className="block">
        {post.cover_image && (
          <div className="mb-3 -mx-4 -mt-4 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-40 object-cover"
            />
          </div>
        )}
        <div className="flex gap-2 mb-2 flex-wrap">
          {post.category && (
            <PixelTag color="blue">{post.category.name}</PixelTag>
          )}
          {post.tags?.map((tag) => (
            <PixelTag key={tag.id} color={tag.color}>
              {tag.name}
            </PixelTag>
          ))}
        </div>
        <h2 className="font-pixel text-[0.7rem] leading-relaxed mb-2">{post.title}</h2>
        {post.excerpt && (
          <p className="text-text-secondary text-sm mb-2 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="text-text-secondary text-xs">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString("zh-CN")
            : new Date(post.created_at).toLocaleDateString("zh-CN")}
          {" · "}
          {post.reading_time} min read
        </div>
      </Link>
    </PixelCard>
  );
}
