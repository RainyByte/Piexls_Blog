import { getPosts, getCategories, getTags } from "@/lib/api";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import PostList from "@/components/blog/PostList";
import HomePagination from "./HomePagination";

interface Props {
  searchParams: { page?: string };
}

export const revalidate = 60;

export default async function HomePage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const [postsData, categories, tags] = await Promise.all([
    getPosts(page, 10),
    getCategories(),
    getTags(),
  ]);

  return (
    <>
      <Header />
      <MobileNav categories={categories} />
      <main className="max-w-[1100px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 md:gap-12">
          <Sidebar categories={categories} tags={tags} />
          <div>
            <PostList posts={postsData.items} />
            <HomePagination currentPage={page} totalPages={postsData.total_pages} />
          </div>
        </div>
      </main>
    </>
  );
}
