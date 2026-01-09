'use client';

import { useEffect, useState, use } from 'react';
import { api } from '@/lib/api';
import { Post } from '@/types';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadPost() {
            try {
                const data = await api.getPostBySlug(slug);
                setPost(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load post');
            } finally {
                setIsLoading(false);
            }
        }
        loadPost();
    }, [slug]);

    if (isLoading) return <div className="text-center py-20">Loading...</div>;
    if (error || !post) return <div className="text-center py-20 text-red-600">{error || 'Post not found'}</div>;

    return (
        <article className="max-w-3xl mx-auto space-y-8">
            <header className="space-y-4 text-center border-b pb-8">
                <h1 className="text-4xl font-bold">{post.title}</h1>
                <div className="flex items-center justify-center gap-4 text-zinc-500">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{post.views} views</span>
                    {post.author && (
                        <>
                            <span>·</span>
                            <span>{post.author.nickname || post.author.username}</span>
                        </>
                    )}
                </div>
                {post.cover && (
                    <div className="aspect-video relative mt-8 rounded-lg overflow-hidden">
                        <img src={post.cover} alt={post.title} className="object-cover w-full h-full" />
                    </div>
                )}
            </header>

            <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                    {post.content}
                </ReactMarkdown>
            </div>

            <div className="pt-12 border-t">
                <Link href="/posts" className="text-blue-600 hover:text-blue-700">
                    ← Back to all posts
                </Link>
            </div>
        </article>
    );
}
