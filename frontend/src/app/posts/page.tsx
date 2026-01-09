import Link from 'next/link';
import { Post } from '@/types';

// ISR: 60秒重验证
export const revalidate = 60;

interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

// 服务端数据获取
async function getPosts(): Promise<Post[]> {
    const res = await fetch('http://localhost:3001/api/posts', {
        next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const posts = await res.json();
    return Array.isArray(posts) ? posts : [];
}

export default async function PostsPage({ searchParams }: PageProps) {
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;
    const limit = 10;

    const allPosts = await getPosts();
    const total = allPosts.length;
    const totalPages = Math.ceil(total / limit);

    // 分页切片
    const start = (page - 1) * limit;
    const posts = allPosts.slice(start, start + limit);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">All Posts</h1>

            <div className="space-y-6">
                {posts.length === 0 ? (
                    <p className="text-zinc-500 text-center py-8">No posts yet.</p>
                ) : (
                    posts.map((post) => (
                        <article key={post.id} className="border-b border-zinc-200 dark:border-zinc-800 pb-6 last:border-0">
                            <Link href={`/posts/${post.slug}`} className="group block">
                                <h2 className="text-2xl font-bold group-hover:text-blue-600 transition-colors mb-2">
                                    {post.title}
                                </h2>
                                <p className="text-zinc-500 line-clamp-2 mb-4">
                                    {post.summary || post.content}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-zinc-400">
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    {post.category && (
                                        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                                            {post.category.name}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        </article>
                    ))
                )}
            </div>

            {/* 分页导航 */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-8">
                    <Link
                        href={page > 1 ? `/posts?page=${page - 1}` : '#'}
                        className={`px-4 py-2 border rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 ${page === 1 ? 'opacity-50 pointer-events-none' : ''
                            }`}
                    >
                        Previous
                    </Link>
                    <span className="px-4 py-2">
                        Page {page} of {totalPages}
                    </span>
                    <Link
                        href={page < totalPages ? `/posts?page=${page + 1}` : '#'}
                        className={`px-4 py-2 border rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 ${page === totalPages ? 'opacity-50 pointer-events-none' : ''
                            }`}
                    >
                        Next
                    </Link>
                </div>
            )}
        </div>
    );
}
