'use client';

import { PostEditor } from '@/components/admin/PostEditor';

export default function NewPostPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Create New Post</h1>
            <PostEditor />
        </div>
    );
}
