import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
    const location = useLocation();
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export const AdminRoute = () => {
    const token = localStorage.getItem("accessToken");
    const rawUser = localStorage.getItem("currentUser");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    try {
        const user = rawUser ? JSON.parse(rawUser) : null;
        if (user && user.role && user.role !== "ADMIN") {
            return <Navigate to="/staff/pos" replace />;
        }
    } catch (_) {}
    return <Outlet />;
};

export const StaffRoute = () => {
    const token = localStorage.getItem("accessToken");
    const rawUser = localStorage.getItem("currentUser");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    try {
        const user = rawUser ? JSON.parse(rawUser) : null;
        if (user && user.role && user.role !== "STAFF") {
            return <Navigate to="/categories" replace />;
        }
    } catch (_) {}
    return <Outlet />;
};

export default ProtectedRoute;
