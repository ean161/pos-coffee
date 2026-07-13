import { useState } from 'react';
import { LogOut, ChevronDown, Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser, useLogout } from '../../features/auth/login/useAuth.js';

const Header = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { data: currentUser } = useCurrentUser();
    const logoutMutation = useLogout();
    const displayName = currentUser?.fullName || currentUser?.username || "User";

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSettled: () => navigate("/login"),
        });
    };

    return (
        <header className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-stone-200 px-6 py-3 flex items-center justify-between z-30">
            <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-stone-100 md:hidden text-stone-700">
                <Menu size={20} />
            </button>
            <h1 className="text-sm font-bold text-stone-900">Quản trị hệ thống</h1>

            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 border border-stone-200 py-1.5 px-3 rounded-xl hover:bg-stone-50 transition-all">
                <span className="text-xs font-bold text-stone-900">{displayName}</span>
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4a3728&color=fff`} className="w-8 h-8 rounded-full" />
                <ChevronDown size={14} />
            </button>

            {dropdownOpen && (
                <div className="absolute top-16 right-6 w-48 bg-white border border-stone-100 rounded-xl shadow-xl py-2 z-50">
                    <button className="w-full text-left px-4 py-2 text-xs font-bold text-stone-700 flex items-center gap-2 hover:bg-stone-50"><User size={14}/> Tài khoản</button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 flex items-center gap-2 hover:bg-red-50"><LogOut size={14}/> Đăng xuất</button>
                </div>
            )}
        </header>
    );
};

export default Header;
