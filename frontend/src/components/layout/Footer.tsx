export function Footer() {
    return (
        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-auto">
            <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
                <p>© {new Date().getFullYear()} MyBlog. All rights reserved.</p>
            </div>
        </footer>
    );
}
