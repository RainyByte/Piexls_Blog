import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import "highlight.js/styles/github-dark.css";

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={{
          pre: ({ children }) => (
            <pre className="pixel-border bg-bg-secondary p-4 overflow-x-auto font-code text-sm">
              {children}
            </pre>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-bg-secondary px-1 py-0.5 border border-border text-sm font-code">
                  {children}
                </code>
              );
            }
            return <code className={className}>{children}</code>;
          },
          h1: ({ children }) => (
            <h1 className="font-pixel text-base mb-4 mt-8">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-pixel text-sm mb-3 mt-6">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-pixel text-xs mb-2 mt-4">{children}</h3>
          ),
          a: ({ children, href }) => (
            <a href={href} className="text-primary hover:underline">
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt || ""} className="pixel-border max-w-full" />
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-text-secondary">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="pixel-border w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-3 py-2 bg-bg-secondary font-pixel text-xs text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
