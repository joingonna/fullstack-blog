'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-zinc-500">
                    Welcome back, {user?.nickname || user?.username}.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-zinc-500 mb-2">Quick Actions</h3>
                    <Link
                        href="/admin/posts/new"
                        className="text-blue-600 hover:text-blue-700 font-medium block"
                    >
                        + Write a new post
                    </Link>
                </div>
            </div>
        </div>
    );
}
