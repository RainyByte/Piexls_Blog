"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="mb-8 md:mb-12">
      <div className="pixel-border bg-bg p-6 md:p-10">
        <p className="font-code text-text-secondary text-sm mb-3">
          {">"} WELCOME TO MY CORNER OF THE WEB
        </p>
        <h1 className="font-pixel text-base md:text-xl leading-relaxed mb-4">
          Pixel Blog
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 max-w-xl">
          Essays, opinions, and dev notes from someone who builds things on the internet.
          A pixel-art styled space for code, creativity, and curiosity.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/#posts"
            className="font-pixel text-[0.6rem] px-5 py-3 pixel-border pixel-border-hover bg-primary text-white inline-block"
          >
            START READING
          </Link>
          <Link
            href="/admin/login"
            className="font-pixel text-[0.6rem] px-5 py-3 pixel-border pixel-border-hover bg-bg inline-block"
          >
            SIGN IN
          </Link>
        </div>
      </div>
      {/* Scrolling marquee */}
      <div className="overflow-hidden pixel-border border-t-0 bg-bg-secondary py-2">
        <div className="animate-marquee whitespace-nowrap font-pixel text-[0.5rem] text-text-secondary">
          <span>
            ★ CODER &middot; DEVELOPER &middot; BLOGGER &middot; CREATOR &middot; READER &middot;&nbsp;
          </span>
          <span>
            ★ CODER &middot; DEVELOPER &middot; BLOGGER &middot; CREATOR &middot; READER &middot;&nbsp;
          </span>
          <span>
            ★ CODER &middot; DEVELOPER &middot; BLOGGER &middot; CREATOR &middot; READER &middot;&nbsp;
          </span>
          <span>
            ★ CODER &middot; DEVELOPER &middot; BLOGGER &middot; CREATOR &middot; READER &middot;&nbsp;
          </span>
        </div>
      </div>
    </section>
  );
}
