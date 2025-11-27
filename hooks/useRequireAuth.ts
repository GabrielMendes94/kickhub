import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/utils/auth";

export function useRequireAuth() {
    const router = useRouter();
    const isRouterReady = router.isReady;

    const isClientAuthenticated = useMemo(() => {
        if (!isRouterReady) {
            return false;
        }

        return isAuthenticated();
    }, [isRouterReady]);

    useEffect(() => {
        if (!isRouterReady) {
            return;
        }

        if (!isClientAuthenticated) {
            router.replace("/auth/login");
        }
    }, [router, isRouterReady, isClientAuthenticated]);

    return isRouterReady && isClientAuthenticated;
}
