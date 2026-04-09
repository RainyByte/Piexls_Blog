import ProfileCard from "./ProfileCard";
import CategoryFilter from "@/components/blog/CategoryFilter";
import TagCloud from "@/components/blog/TagCloud";
import MusicPlayer from "@/components/music/MusicPlayer";
import { Category, Tag } from "@/types";

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
  currentCategory?: string;
  currentTag?: string;
}

export default function Sidebar({ categories, tags, currentCategory, currentTag }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col gap-4 sticky top-6 self-start">
      <ProfileCard />
      <CategoryFilter categories={categories} currentSlug={currentCategory} />
      <TagCloud tags={tags} currentSlug={currentTag} />
      <MusicPlayer />
    </aside>
  );
}
