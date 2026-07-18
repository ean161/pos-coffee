import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Coffee, LayoutGrid, Tag, CupSoda, Coins, Boxes, TrendingUp, Users, CalendarDays } from "lucide-react";

const MENU_ITEMS = [
    { icon: <LayoutDashboard className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Dashboard', path: '/' },
    { icon: <Coffee className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Sản phẩm', path: '/products' },
    { icon: <TrendingUp className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Thống kê', path: '/top-selling' },
    { icon: <LayoutGrid className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Danh mục', path: '/categories' },
    { icon: <CupSoda className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Topping', path: '/toppings' },
    { icon: <Coins className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Phụ thu', path: '/surcharges' },
    { icon: <Tag className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Khuyến mãi', path: '/vouchers' },
    { icon: <Boxes className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Tồn kho', path: '/admin/inventory' },
    { icon: <Users className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Nhân viên', path: '/employees' },
    { icon: <CalendarDays className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Xếp ca', path: '/shifts' },
];

const SideBar = ({ isOpen }) => {
    return (
        <aside className={`transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) bg-[#1f120c] text-white flex flex-col ${isOpen ? 'w-64' : 'w-0 opacity-0 overflow-hidden'} md:static fixed h-screen z-50 shadow-2xl`}>
            <div className="p-7 flex items-center gap-3 border-b border-[#2d1c13]">
                <div className="group bg-gradient-to-tr from-[#a27b5c] to-[#c5a880] p-3 rounded-2xl shadow-lg shadow-[#a27b5c]/20 transition-all duration-500 hover:rotate-12 hover:scale-105">
                    <Coffee className="w-5 h-5 text-[#fbf9f6] transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div>
                    <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-[#e5dcd3] bg-clip-text text-transparent">POS Coffee</span>
                    <span className="text-[9px] text-[#a27b5c] font-black uppercase tracking-widest block -mt-0.5">Espresso Bar</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {MENU_ITEMS.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden ${
                                isActive
                                    ? 'text-[#fdfbf9] font-bold shadow-lg shadow-black/15'
                                    : 'text-[#c5b5aa] hover:text-white'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#a27b5c] to-[#7f5f45] transition-all duration-500 -z-10 animate-fade-in" />
                                )}
                                <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                                <span className="font-medium tracking-wide relative z-10 text-sm">{item.label}</span>
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#c5a880] rounded-r-md" />
                                )}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity bg-white pointer-events-none" />
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-[#2d1c13] bg-[#160b07] flex items-center justify-between text-[10px] text-[#a27b5c]">
                <span className="font-bold tracking-wider">EST. 2026 POS COFFEE</span>
                <span className="px-2 py-0.5 rounded-full bg-[#a27b5c]/10 text-[#c5a880] font-bold border border-[#a27b5c]/25">v3.0</span>
            </div>
        </aside>
    );
};

export default SideBar;