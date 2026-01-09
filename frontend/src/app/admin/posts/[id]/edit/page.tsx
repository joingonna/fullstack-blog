'use client';

import { useEffect, useState, use } from 'react';
import { api } from '@/lib/api';
import { Post } from '@/types';
import { PostEditor } from '@/components/admin/PostEditor';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    // UnwrapRef params using React.use()
    const { id } = use(params);

    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadPost() {
            try {
                const data = await api.getPostById(parseInt(id));
                setPost(data);
            } catch (error) {
                console.error('Failed to load post:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadPost();
    }, [id]);

    if (isLoading) return <div>Loading...</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Edit Post</h1>
            <PostEditor initialData={post} />
        </div>
    );
}
