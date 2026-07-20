export const clearStoredAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
};

const decodeJwtPayload = (token) => {
    const payload = token.split(".")[1];
    if (!payload) throw new Error("Invalid token");
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
};

export const getStoredAuth = () => {
    const token = localStorage.getItem("accessToken");
    const rawUser = localStorage.getItem("currentUser");

    if (!token || !rawUser) {
        clearStoredAuth();
        return null;
    }

    try {
        const claims = decodeJwtPayload(token);
        const user = JSON.parse(rawUser);
        const isExpired = !claims.exp || claims.exp * 1000 <= Date.now();
        const hasKnownRole = user?.role === "ADMIN" || user?.role === "STAFF";
        if (isExpired || !hasKnownRole) throw new Error("Invalid auth data");
        return { token, user };
    } catch {
        clearStoredAuth();
        return null;
    }
};

export const homeForRole = (role) => role === "STAFF" ? "/staff/pos" : "/categories";

export const canRoleAccessPath = (role, path) => {
    if (!path || path === "/login") return false;
    return role === "STAFF" ? path.startsWith("/staff") : !path.startsWith("/staff");
};
