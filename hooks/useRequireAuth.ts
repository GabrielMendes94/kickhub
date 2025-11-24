import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/utils/auth";

export function useRequireAuth() {
    const router = useRouter();
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        if (!router.isReady) return;

        if (!isAuthenticated()) {
            router.replace("/auth/login");
            return;
        }

        setIsAllowed(true);
    }, [router]);

    return isAllowed;
}
