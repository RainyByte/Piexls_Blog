"use client";

import { useRouter } from "next/navigation";
import { PixelPagination } from "@/components/pixel";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function HomePagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  return (
    <PixelPagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={(p) => router.push(`/?page=${p}`)}
    />
  );
}
