"use client";

import { useEffect, useState, use } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Link from "next/link";
import { getWriteups } from "../../../../../lib/writeups";

export default function Writeup({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const event = decodeURIComponent(params.event);
  const category = decodeURIComponent(params.category);
  const slug = decodeURIComponent(params.slug);

  const [writeup, setWriteup] = useState(null);
  const [writeups, setWritups] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWriteup() {
      try {
        const fetchedWriteups = await getWriteups();
        setWritups(fetchedWriteups);
        
        // Helper function to normalize strings for comparison
        const normalize = (str) => str
          .replace(/_/g, ' ')
          .replace(/-/g, ' ')
          .toUpperCase()
          .trim();

        // Find the original category
        const normalizedSearchCategory = normalize(category);
        const originalCategory = Object.keys(fetchedWriteups[event]).find(
          key => normalize(key) === normalizedSearchCategory
        );

        console.log("Original category from data:", originalCategory);
        const categoryWriteups = fetchedWriteups[event]?.[originalCategory] || [];
        
        // Find the writeup using normalized comparison
        const foundWriteup = categoryWriteups.find(w => 
          normalize(w.slug) === normalize(slug)
        );
        
        console.log("All slugs in category:", categoryWriteups.map(w => w.slug));
        console.log("Looking for slug:", slug);
        console.log("Found writeup:", foundWriteup);
        
        setWriteup(foundWriteup || null);
      } catch (error) {
        console.error("Error fetching writeup:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWriteup();
  }, [event, category, slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-foreground font-mono flex items-center justify-center">
        <p className="text-green-500 text-xl animate-pulse">Loading...</p>
      </main>
    );
  }

  if (!writeup) {
    return (
      <main className="min-h-screen bg-black text-foreground font-mono p-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href={`/writeups/${event}`}
            className="text-green-500 hover:text-green-400 mb-8 inline-block"
          >
            ← Back to Event
          </Link>
          <p className="text-2xl text-gray-400">Writeup not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-[#0a192f] text-foreground font-mono relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Back button */}
          <Link 
            href={`/writeups/${event}`}
            className="text-green-500 hover:text-green-400 mb-6 sm:mb-8 inline-block"
          >
            ← Back to Event
          </Link>

          {/* Date */}
          <div className="text-gray-400 mb-3 sm:mb-4">{writeup.date}</div>

          {/* Title */}
          <h1 className="text-green-500 text-2xl sm:text-3xl font-bold">{writeup.title}</h1>

          {/* Event, Category, Difficulty Tags */}
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-3 mb-6 sm:mb-8">
            <span className="px-3 py-1 rounded-md text-sm bg-gray-800/80 backdrop-blur-sm text-gray-300">
              📅 {writeup.event}
            </span>
            <span className="px-3 py-1 rounded-md text-sm bg-gray-800/80 backdrop-blur-sm text-blue-300">
              🔎 {writeup.category}
            </span>
            <span className="px-3 py-1 rounded-md text-sm bg-gray-800/80 backdrop-blur-sm text-green-300">
              🎯 {writeup.difficulty}
            </span>
          </div>

          {/* Authors - Made responsive */}
          {writeup.authors?.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 mb-6 sm:mb-8">
              {writeup.authors.map((author, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
                  />
                  <span className="text-white text-sm sm:text-base">{author.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Introduction */}
          {writeup.introduction && (
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white">{writeup.introduction}</h2>
              <p className="text-gray-300 text-sm sm:text-base">{writeup.introduction}</p>
            </div>
          )}

          {/* Tags */}
          {writeup.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 sm:mb-12">
              {writeup.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-md text-sm bg-green-500/20 text-green-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Table of Contents */}
          {writeup.tableOfContents?.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white">Table of Contents</h2>
              <div className="text-green-500">
                {writeup.tableOfContents.map((item, index) => (
                  <a key={index} href={`#${item.anchor}`} className="block hover:underline">
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Main Content with fixed overflow issues */}
          <article className="prose prose-sm sm:prose prose-invert max-w-none overflow-hidden">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img({ node, ...props }) {
                  return (
                    <div className="overflow-hidden my-8">
                      <img
                        className="rounded-lg shadow-lg max-w-full h-auto mx-auto"
                        loading="lazy"
                        {...props}
                      />
                    </div>
                  );
                },
                pre({ node, children, ...props }) {
                  return (
                    <div className="overflow-x-auto my-4 rounded-lg bg-gray-800">
                      <pre {...props} className="p-4">
                        {children}
                      </pre>
                    </div>
                  );
                },
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="overflow-x-auto my-4">
                      <SyntaxHighlighter 
                        style={vscDarkPlus} 
                        language={match[1]} 
                        PreTag="div"
                        customStyle={{
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          fontSize: '0.875rem',
                          lineHeight: '1.5'
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300 text-sm break-all">
                      {children}
                    </code>
                  );
                },
                table({ node, ...props }) {
                  return (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full divide-y divide-gray-700" {...props} />
                    </div>
                  );
                },
                p({ node, ...props }) {
                  return (
                    <p className="text-gray-300 my-4 leading-relaxed break-words whitespace-pre-wrap" {...props} />
                  );
                },
                h1({ node, ...props }) {
                  return (
                    <h1 
                      className="text-green-500 text-2xl font-bold mt-8 mb-4 break-words" 
                      {...props} 
                    />
                  );
                },
                h2({ node, ...props }) {
                  return (
                    <h2 
                      className="text-green-500 text-xl font-semibold mt-6 mb-3 break-words" 
                      {...props} 
                    />
                  );
                },
                h3({ node, ...props }) {
                  return (
                    <h3 
                      className="text-white text-lg font-medium mt-4 mb-2 break-words" 
                      {...props} 
                    />
                  );
                },
                blockquote({ node, ...props }) {
                  return (
                    <blockquote 
                      className="border-l-4 border-green-500 pl-4 my-4 italic text-gray-300 break-words"
                      {...props} 
                    />
                  );
                },
                a({ node, ...props }) {
                  return (
                    <a 
                      className="text-green-500 hover:text-green-400 break-words"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  );
                },
                ul({ node, ...props }) {
                  return (
                    <ul className="list-disc pl-5 my-4 space-y-2" {...props} />
                  );
                },
                ol({ node, ...props }) {
                  return (
                    <ol className="list-decimal pl-5 my-4 space-y-2" {...props} />
                  );
                },
                li({ node, ...props }) {
                  return (
                    <li className="text-gray-300 break-words" {...props} />
                  );
                }
              }}
            >
              {writeup.content || "No content available"}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </main>
  );
}
