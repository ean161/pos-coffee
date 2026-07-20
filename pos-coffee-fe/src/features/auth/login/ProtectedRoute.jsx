import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredAuth, homeForRole } from "./authStorage.js";

const ProtectedRoute = () => {
    const location = useLocation();
    const auth = getStoredAuth();

    if (!auth) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export const AdminRoute = () => {
    const location = useLocation();
    const auth = getStoredAuth();
    if (!auth) return <Navigate to="/login" replace state={{ from: location }} />;
    if (auth.user.role !== "ADMIN") {
        return <Navigate to={homeForRole(auth.user.role)} replace />;
    }
    return <Outlet />;
};

export const StaffRoute = () => {
    const location = useLocation();
    const auth = getStoredAuth();
    if (!auth) return <Navigate to="/login" replace state={{ from: location }} />;
    if (auth.user.role !== "STAFF") {
        return <Navigate to={homeForRole(auth.user.role)} replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
