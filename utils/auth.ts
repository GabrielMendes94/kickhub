const AUTH_STORAGE_KEY = "kickhub-authenticated";

export function setAuthFlag() {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_STORAGE_KEY, Date.now().toString());
}

export function clearAuthFlag() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthenticated() {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem(AUTH_STORAGE_KEY));
}
