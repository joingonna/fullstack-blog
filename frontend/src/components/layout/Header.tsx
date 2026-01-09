'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="border-b bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold font-mono">
                    MyBlog
                </Link>

                <nav className="flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
                        Home
                    </Link>
                    <Link href="/posts" className="text-sm font-medium hover:text-blue-600 transition-colors">
                        Posts
                    </Link>

                    <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                Hi, {user.username}
                            </span>
                            <button
                                onClick={logout}
                                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="text-sm font-medium px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
