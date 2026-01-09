'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Overview', href: '/admin' },
    { label: 'Posts', href: '/admin/posts' },
    // { label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 min-h-[calc(100vh-64px)] p-4">
            <nav className="space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
