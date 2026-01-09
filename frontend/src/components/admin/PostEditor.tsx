'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Post } from '@/types';
import '@uiw/react-md-editor/markdown-editor.css';
// import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
    () => import('@uiw/react-md-editor'),
    { ssr: false }
);

interface PostEditorProps {
    initialData?: Post;
}

export function PostEditor({ initialData }: PostEditorProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        summary: '',
        cover: '',
        content: '',
        published: false,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                slug: initialData.slug || '',
                summary: initialData.summary || '',
                cover: initialData.cover || '',
                content: initialData.content || '',
                published: initialData.published || false,
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (initialData) {
                await api.updatePost(initialData.id, formData);
            } else {
                await api.createPost(formData);
            }
            router.push('/admin/posts');
            router.refresh();
        } catch (error) {
            console.error('Failed to save post:', error);
            alert('Failed to save post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md bg-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Slug</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md bg-transparent"
                            placeholder="Leave empty to auto-generate"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Publish Status</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="published"
                                checked={formData.published}
                                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <label htmlFor="published" className="text-sm text-zinc-600 dark:text-zinc-400">
                                Published (Visible to everyone)
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Summary (Optional)</label>
                        <textarea
                            rows={3}
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md bg-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                        <input
                            type="url"
                            value={formData.cover}
                            onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md bg-transparent"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                </div>
            </div>

            <div data-color-mode="auto">
                <label className="block text-sm font-medium mb-2">Content</label>
                <MDEditor
                    value={formData.content}
                    onChange={(val) => setFormData({ ...formData, content: val || '' })}
                    height={500}
                />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : 'Save Post'}
                </button>
            </div>
        </form>
    );
}
