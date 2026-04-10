import { getPost, getCategories, getTags, getPosts } from "@/lib/api";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import PostContent from "@/components/blog/PostContent";
import { PixelCard, PixelTag } from "@/components/pixel";
import { getMediaUrl } from "@/lib/media";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const data = await getPosts(1, 100);
    return data.items.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: { slug: string };
}

export default async function PostPage({ params }: Props) {
  let post;
  try {
    post = await getPost(params.slug);
  } catch {
    notFound();
  }

  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

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
    <>
      <Header />
      <main className="max-w-[1100px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 md:gap-12">
          <Sidebar categories={categories} tags={tags} />
          <article>
            <PixelCard padding="lg">
              <div className="flex gap-2 mb-3 flex-wrap">
                {post.category && (
                  <Link href={`/category/${post.category.slug}`}>
                    <PixelTag color="blue">{post.category.name}</PixelTag>
                  </Link>
                )}
                {post.tags?.map((tag) => (
                  <Link key={tag.id} href={`/tag/${tag.slug}`}>
                    <PixelTag color={tag.color}>{tag.name}</PixelTag>
                  </Link>
                ))}
              </div>
              <h1 className="font-pixel text-sm md:text-base leading-relaxed mb-2">
                {post.title}
              </h1>
              <div className="flex items-center gap-3 text-text-secondary text-xs mb-6">
                <span className="flex items-center gap-1">
                  <span>&#9635;</span> {dateStr}
                </span>
                <span className="flex items-center gap-1">
                  <span>&#9719;</span> {post.reading_time} min read
                </span>
              </div>
              {post.cover_image && (
                <img
                  src={getMediaUrl(post.cover_image)}
                  alt={post.title}
                  className="w-full pixel-border mb-6"
                />
              )}
              <PostContent content={post.content} />
            </PixelCard>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
