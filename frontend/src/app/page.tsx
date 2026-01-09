import Link from 'next/link';
import { Post } from '@/types';

// ISR: 60秒重验证
export const revalidate = 60;

// 服务端数据获取
async function getPosts(): Promise<Post[]> {
  const res = await fetch('http://localhost:3001/api/posts', {
    next: { revalidate: 60 }
  });
  if (!res.ok) return [];
  const posts = await res.json();
  return Array.isArray(posts) ? posts.slice(0, 5) : [];
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="space-y-8">
      <section className="text-center py-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to My Blog</h1>
        <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
          Sharing thoughts on technology, development, and life.
        </p>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Posts</h2>
          <Link href="/posts" className="text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <p className="text-zinc-500 col-span-full text-center py-8">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="group border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
                <Link href={`/posts/${post.slug}`} className="block">
                  <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative">
                    {post.cover ? (
                      <img
                        src={post.cover}
                        alt={post.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        No Cover
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-zinc-500 text-sm line-clamp-2">
                      {post.summary || post.content.substring(0, 100)}...
                    </p>
                    <div className="text-xs text-zinc-400 pt-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
