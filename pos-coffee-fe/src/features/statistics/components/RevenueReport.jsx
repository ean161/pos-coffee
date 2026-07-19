import { DollarSign, ShoppingBag, TrendingUp, BarChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const RevenueReport = ({
                           stats,
                           loading,
                           selectedYear,
                           onYearChange,
                           selectedMonth,
                           onMonthChange
                       }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#ebdcd0] shadow-sm flex items-center justify-between group hover:border-[#a27b5c] transition-all duration-300">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Tổng doanh thu</span>
                        <h3 className="text-2xl font-black text-[#26170f]">
                            {loading ? "..." : `${(stats?.totalRevenue || 0).toLocaleString('vi-VN')} đ`}
                        </h3>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform"><DollarSign size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#ebdcd0] shadow-sm flex items-center justify-between group hover:border-[#a27b5c] transition-all duration-300">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Số lượng đơn hàng</span>
                        <h3 className="text-2xl font-black text-[#26170f]">
                            {loading ? "..." : `${(stats?.totalOrders || 0).toLocaleString('vi-VN')} đơn`}
                        </h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform"><ShoppingBag size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#ebdcd0] shadow-sm flex items-center justify-between group hover:border-[#a27b5c] transition-all duration-300">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Ly nước/món đã bán</span>
                        <h3 className="text-2xl font-black text-[#26170f]">
                            {loading ? "..." : `${(stats?.totalItemsSold || 0).toLocaleString('vi-VN')} sản phẩm`}
                        </h3>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100 group-hover:scale-110 transition-transform"><TrendingUp size={24} /></div>
                </div>
            </div>

            <div className="w-full bg-white rounded-2xl border border-[#ebdcd0] p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f7f0e9] pb-4">
                    <div className="flex items-center gap-2">
                        <BarChart size={20} className="text-[#a27b5c]" />
                        <h3 className="font-black text-base text-[#26170f]">Xu hướng doanh thu</h3>
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={selectedYear}
                            onChange={(e) => onYearChange(e.target.value)}
                            className="bg-white border border-[#ebdcd0] p-2 px-3 rounded-xl text-[#4a3728] font-bold outline-none text-xs cursor-pointer shadow-sm hover:border-[#a27b5c]"
                        >
                            <option value="">Năm hiện tại</option>
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                        </select>

                        <select
                            value={selectedMonth}
                            onChange={(e) => onMonthChange(e.target.value)}
                            disabled={!selectedYear}
                            className="bg-white border border-[#ebdcd0] p-2 px-3 rounded-xl text-[#4a3728] font-bold outline-none text-xs cursor-pointer shadow-sm hover:border-[#a27b5c] disabled:opacity-40"
                        >
                            <option value="">Cả năm</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="h-64 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats?.chartData || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e6dd" />
                            <XAxis dataKey="name" tickLine={false} stroke="#a27b5c" className="text-[11px] font-bold" />
                            <YAxis tickLine={false} axisLine={false} stroke="#a27b5c" className="text-[10px]" tickFormatter={(v) => `${v/1000000}M`} />
                            <Tooltip formatter={(value) => [`${Number(value).toLocaleString('vi-VN')} đ`, 'Doanh thu']} />
                            <Area type="monotone" dataKey="revenue" stroke="#a27b5c" fill="#a27b5c" fillOpacity={0.1} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RevenueReport;