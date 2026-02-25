"use client";

import { useStore } from "@/store/useStore";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CheckSquare, FileText, Settings, LogOut } from "lucide-react";

export default function Navigation() {
    const { currentUser, logout } = useStore();
    const pathname = usePathname();
    const router = useRouter();

    if (!currentUser) return null;

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const menu = [
        { name: "Dash", icon: <LayoutDashboard size={24} />, path: "/" },
        { name: "Tasks", icon: <CheckSquare size={24} />, path: "/tasks" },
        { name: "Report", icon: <FileText size={24} />, path: "/reports" },
    ];

    if (currentUser.role === "Admin") {
        menu.push({ name: "Admin", icon: <Settings size={24} />, path: "/admin" });
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background shadow-lg pb-safe md:hidden z-50">
            <div className="flex justify-around items-center h-16">
                {menu.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => router.push(item.path)}
                        className={`flex flex-col items-center justify-center w-full h-full text-xs transition-colors ${pathname === item.path ? "text-primary font-medium" : "text-muted-foreground"
                            }`}
                    >
                        {item.icon}
                        <span className="mt-1">{item.name}</span>
                    </button>
                ))}
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center justify-center w-full h-full text-xs text-muted-foreground transition-colors"
                >
                    <LogOut size={24} />
                    <span className="mt-1">Exit</span>
                </button>
            </div>
        </div>
    );
}

// Optional Top Nav for Desktop/tablet
export function TopNav() {
    const { currentUser, logout } = useStore();
    const router = useRouter();

    if (!currentUser) return null;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4">
                <div className="mr-4 hidden md:flex">
                    <a className="mr-6 flex items-center space-x-2" href="/">
                        <span className="hidden font-bold sm:inline-block">Junobo IT</span>
                    </a>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <a className="transition-colors hover:text-foreground/80 text-foreground" href="/">Dashboard</a>
                        <a className="transition-colors hover:text-foreground/80 text-foreground" href="/tasks">Tasks</a>
                        <a className="transition-colors hover:text-foreground/80 text-foreground" href="/reports">Reports</a>
                        {currentUser.role === 'Admin' && (
                            <a className="transition-colors hover:text-foreground/80 text-foreground" href="/admin">Admin Hub</a>
                        )}
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                    </div>
                    <nav className="flex items-center space-x-2">
                        <span className="text-sm font-medium mr-4">{currentUser.name}</span>
                        <button className="hidden md:inline-flex" onClick={() => { logout(); router.push('/login'); }}>
                            <LogOut size={16} />
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
}
