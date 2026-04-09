import { getPosts, getCategories, getTags } from "@/lib/api";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import PostList from "@/components/blog/PostList";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export default async function TagPage({ params }: Props) {
  const [postsData, categories, tags] = await Promise.all([
    getPosts(1, 50, undefined, params.slug),
    getCategories(),
    getTags(),
  ]);

  const tag = tags.find((t) => t.slug === params.slug);

  return (
    <>
      <Header />
      <main className="max-w-[1100px] mx-auto px-4 md:px-10">
        <h1 className="font-pixel text-xs md:text-sm mb-6">
          // {tag?.name || params.slug}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 md:gap-12">
          <Sidebar categories={categories} tags={tags} currentTag={params.slug} />
          <PostList posts={postsData.items} />
        </div>
      </main>
      <Footer />
    </>
  );
}
