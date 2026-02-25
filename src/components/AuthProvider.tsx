"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { currentUser } = useStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            if (!currentUser && pathname !== "/login") {
                router.push("/login");
            }
        }
    }, [currentUser, router, pathname, mounted]);

    if (!mounted) {
        return null; // or a loading spinner
    }

    return <>{children}</>;
}
