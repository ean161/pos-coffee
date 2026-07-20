import { NavLink, Link } from 'react-router-dom';
import { Coffee, LayoutGrid, Tag, CupSoda, Coins, Boxes, TrendingUp, Users, CalendarDays, Banknote, Wallet } from "lucide-react";

const MENU_ITEMS = [
    { icon: <TrendingUp className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Thống kê', path: '/top-selling' },
    { icon: <Coffee className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Sản phẩm', path: '/products' },
    { icon: <LayoutGrid className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Danh mục', path: '/categories' },
    { icon: <CupSoda className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Topping', path: '/toppings' },
    { icon: <Coins className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Phụ thu', path: '/surcharges' },
    { icon: <Tag className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Khuyến mãi', path: '/vouchers' },
    { icon: <Boxes className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Tồn kho', path: '/admin/inventory' },
    { icon: <Users className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Nhân viên', path: '/employees' },
    { icon: <CalendarDays className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Xếp ca', path: '/shifts' },
    { icon: <Banknote className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Bảng lương', path: '/payroll' },
    { icon: <Wallet className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />, label: 'Lịch sử két', path: '/admin/cash-history' },
];

const SideBar = ({ isOpen }) => {
    return (
        <aside className={`transition-all duration-500 ease-in-out bg-[#1f120c] text-white flex flex-col ${isOpen ? 'w-64' : 'w-0 opacity-0 overflow-hidden'} md:sticky md:top-0 fixed h-screen z-50 shadow-2xl shrink-0 select-none`}>
            <Link to="/top-selling" className="p-5 flex items-center gap-3 border-b border-[#2d1c13] shrink-0 hover:bg-[#26160e] transition-colors duration-200 group cursor-pointer">
                <div className="group bg-gradient-to-tr from-[#a27b5c] to-[#c5a880] p-2.5 rounded-2xl shadow-lg shadow-[#a27b5c]/20 transition-all duration-500 group-hover:rotate-12 group-hover:scale-105">
                    <Coffee className="w-5 h-5 text-[#fbf9f6] transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div>
                    <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-[#e5dcd3] bg-clip-text text-transparent group-hover:from-white group-hover:to-white">POS Coffee</span>
                    <span className="text-[9px] text-[#a27b5c] font-black uppercase tracking-widest block -mt-0.5">Espresso Bar</span>
                </div>
            </Link>

            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {MENU_ITEMS.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `group relative flex items-center gap-3.5 px-4 py-2.5 rounded-2xl transition-all duration-300 overflow-hidden ${
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

            <div className="p-5 border-t border-[#2d1c13] bg-[#160b07] flex items-center justify-between text-[10px] text-[#a27b5c] shrink-0">
                <span className="font-bold tracking-wider">EST. 2026 POS COFFEE</span>
                <span className="px-2 py-0.5 rounded-full bg-[#a27b5c]/10 text-[#c5a880] font-bold border border-[#a27b5c]/25">v3.0</span>
            </div>
        </aside>
    );
};

export default SideBar;