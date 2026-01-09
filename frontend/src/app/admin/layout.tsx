'use client';

import { AdminGuard } from '@/components/auth/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </AdminGuard>
    );
}
