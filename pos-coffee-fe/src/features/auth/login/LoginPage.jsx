import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "./useAuth.js";
import {
    Coffee, User, Lock, Eye, EyeOff, AlertCircle,
    Loader2, Sparkles, ShieldCheck, ArrowRight
} from "lucide-react";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const loginMutation = useLogin();
    const [form, setForm] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const token = localStorage.getItem("accessToken");

    if (token) {
        let fallback = "/categories";
        try {
            const cached = JSON.parse(localStorage.getItem("currentUser") || "null");
            if (cached?.role === "STAFF") {
                fallback = "/staff/pos";
            }
        } catch {
            fallback = "/categories";
        }
        const targetPath = location.state?.from?.pathname || fallback;
        return <Navigate to={targetPath} replace />;
    }

    const handleChange = (event) => {
        setForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
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

    const getErrorMessage = () => {
        if (!loginMutation.isError) return null;
        return loginMutation.error?.response?.data?.message || "Tài khoản hoặc mật khẩu không chính xác!";
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f6f2ee] p-4 sm:p-6 lg:p-8 select-none">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl overflow-hidden shadow-2xl shadow-[#2c1810]/10 border border-[#e8dfd8]">

                {/*bên trái*/}
                <div className="lg:col-span-5 bg-linear-to-br from-[#1f120c] via-[#2c1a11] to-[#120905] p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden min-h-[260px] lg:min-h-[580px]">
                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#a27b5c]/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#c5a880]/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-linear-to-tr from-[#a27b5c] to-[#c5a880] p-3 rounded-2xl shadow-lg shadow-[#a27b5c]/25">
                                <Coffee className="w-6 h-6 text-[#fbf9f6]" />
                            </div>
                            <div>
                                <span className="font-extrabold text-lg tracking-tight bg-linear-to-r from-white via-[#f0e6df] to-[#c5a880] bg-clip-text text-transparent block">
                                    POS Coffee
                                </span>
                                <span className="text-[9px] text-[#a27b5c] font-black uppercase tracking-widest block -mt-1">
                                    Espresso Bar System
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 hidden sm:block">
                            <h2 className="text-2xl font-bold text-white leading-snug">
                                Quản lý quán cà phê thông minh & hiệu quả.
                            </h2>
                            <p className="text-xs text-[#b8a69a] leading-relaxed">
                                Giải pháp bán hàng toàn diện, tối ưu quy trình phục vụ và quản lý doanh thu thời gian thực.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-2 hidden lg:block">
                        <div className="flex items-center gap-2.5 text-xs font-semibold text-[#d6c5b8] bg-white/5 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
                            <Sparkles className="w-4 h-4 text-[#c5a880]" />
                            <span>Vận hành siêu tốc & Chính xác</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs font-semibold text-[#d6c5b8] bg-white/5 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
                            <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
                            <span>Bảo mật két tiền & Doanh thu 24/7</span>
                        </div>
                    </div>

                    <div className="relative z-10 pt-4 border-t border-white/10 hidden sm:block">
                        <span className="text-[10px] text-[#a27b5c] font-bold tracking-widest uppercase">
                            EST. 2026 POS COFFEE • v3.0
                        </span>
                    </div>
                </div>

                {/* bên phải*/}
                <div className="lg:col-span-7 p-8 sm:p-10 lg:p-14 flex flex-col justify-center bg-white">
                    <div className="max-w-md w-full mx-auto space-y-6">

                        <div>
                            <h2 className="text-2xl font-extrabold text-[#2c1810] tracking-tight">
                                Đăng nhập hệ thống
                            </h2>
                            <p className="text-xs text-[#7d6859] mt-1 font-medium">
                                Vui lòng nhập thông tin tài khoản của bạn để tiếp tục
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#5c4a3e] uppercase tracking-wider mb-2">
                                    Tài khoản
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a27b5c]">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        name="username"
                                        type="text"
                                        value={form.username}
                                        onChange={handleChange}
                                        placeholder="Tên tài khoản"
                                        className="w-full pl-10 pr-4 py-3 bg-[#faf7f4] text-[#2c1810] placeholder-[#a8978a] border border-[#e6ded6] rounded-xl text-sm focus:outline-none focus:border-[#a27b5c] focus:ring-2 focus:ring-[#a27b5c]/15 transition-all duration-200 font-medium"
                                        autoComplete="username"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#5c4a3e] uppercase tracking-wider mb-2">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a27b5c]">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Mật khẩu"
                                        className="w-full pl-10 pr-11 py-3 bg-[#faf7f4] text-[#2c1810] placeholder-[#a8978a] border border-[#e6ded6] rounded-xl text-sm focus:outline-none focus:border-[#a27b5c] focus:ring-2 focus:ring-[#a27b5c]/15 transition-all duration-200 font-medium"
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#a27b5c] hover:text-[#2c1810] transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {loginMutation.isError && (
                                <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
                                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                                    <span>{getErrorMessage()}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full py-3.5 px-4 bg-linear-to-r from-[#2c1810] to-[#593928] hover:from-[#1f100a] hover:to-[#472d1f] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#2c1810]/15 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer group"
                            >
                                {loginMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Đang xử lý...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Đăng nhập</span>
                                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;