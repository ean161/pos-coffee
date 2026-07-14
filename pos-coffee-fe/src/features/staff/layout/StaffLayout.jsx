import { Outlet } from "react-router-dom";
import { Coffee, LogOut, User } from "lucide-react";
// import { useLogout, useCurrentUser } from "../../features/auth/login/useAuth.js";
import { useLogout, useCurrentUser } from "../../auth/login/useAuth.js";

export default function StaffLayout() {
    const logoutMutation = useLogout();
    const { data: user } = useCurrentUser();

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSettled: () => {
                window.location.href = "/login";
            },
        });
    };

    return (
        <div className="flex flex-col h-screen bg-[#FAF6F0] overflow-hidden">
            <header className="bg-gradient-to-r from-[#1f120c] to-[#4a3728] text-white shadow-md">
                <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-[#a27b5c] to-[#c5a880] p-2.5 rounded-2xl shadow-lg shadow-[#a27b5c]/20">
                            <Coffee className="w-5 h-5 text-[#fbf9f6]" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-base leading-tight">POS Coffee</h1>
                            <p className="text-[10px] text-[#c5a880] font-bold uppercase tracking-widest">
                                Màn hình bán hàng
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl">
                            <User size={14} />
                            <span className="text-xs font-bold">
                                {user?.data?.fullName || user?.fullName || "Thu ngân"}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#c5a880]">
                                · STAFF
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                        >
                            <LogOut size={14} />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}
