import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "./useAuth.js";
import { Coffee } from "lucide-react";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const loginMutation = useLogin();
    const [form, setForm] = useState({ username: "", password: "" });
    const token = localStorage.getItem("accessToken");

    if (token) {
        try {
            const cached = JSON.parse(localStorage.getItem("currentUser") || "null");
            const fallback = cached?.role === "STAFF" ? "/staff/pos" : "/categories";
            return <Navigate to={location.state?.from?.pathname || fallback} replace />;
        } catch (_) {
            return <Navigate to="/categories" replace />;
        }
    }

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        loginMutation.mutate(form, {
            onSuccess: (data) => {
                const role = data?.user?.role;
                const fallback = role === "STAFF" ? "/staff/pos" : "/categories";
                navigate(location.state?.from?.pathname || fallback, { replace: true });
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white border border-stone-200 rounded-lg p-6 shadow-sm"
            >
                <h1 className="text-xl font-bold text-stone-900 mb-5 flex space-x-2 items-center">
					<div className="group bg-gradient-to-tr from-[#a27b5c] to-[#c5a880] p-3 rounded-2xl shadow-lg shadow-[#a27b5c]/20 transition-all duration-500 hover:rotate-12 hover:scale-105 w-fit">
						<Coffee className="w-5 h-5 text-[#fbf9f6] transition-transform duration-700 group-hover:scale-110" />
					</div>
                    <span>Đăng nhập</span>
                </h1>

                <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Tài khoản
                </label>
                <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full text-black border border-stone-300 rounded-md px-3 py-2 mb-4"
                    autoComplete="username"
                    required
                />

                <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Mật khẩu
                </label>
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full text-black border border-stone-300 rounded-md px-3 py-2 mb-4"
                    autoComplete="current-password"
                    required
                />

                {loginMutation.isError && (
                    <p className="text-sm text-red-600 mb-4">
                        {loginMutation.error.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-stone-900 text-white rounded-md py-2 font-semibold disabled:opacity-60"
                >
                    {loginMutation.isPending ? "Đang xử lý" : "Đăng nhập"}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
