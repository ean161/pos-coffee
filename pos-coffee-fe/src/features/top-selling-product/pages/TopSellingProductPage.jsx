// src/features/top-selling-product/pages/TopSellingProductPage.jsx
import { useState, useEffect } from 'react';
import { BarChart3, Sparkles, DollarSign, ShoppingBag, BarChart, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axiosClient from "../../../shared/axios/axiosClient.js";
import TopSellingProducts from '../components/TopSellingProducts';

const TopSellingProductPage = () => {
    // State cho Món bán chạy
    const [topProducts, setTopProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [limit, setLimit] = useState(5);

    // State cho Doanh thu tổng hợp
    const [revenueStats, setRevenueStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalItemsSold: 0,
        chartData: []
    });
    const [loadingRevenue, setLoadingRevenue] = useState(true);
    const [filterTime, setFilterTime] = useState('7days'); // 7days, month, year

    useEffect(() => {
        const fetchTopSelling = async () => {
            setLoadingProducts(true);
            try {
                const res = await axiosClient.get(`/statistics/top-selling?limit=${limit}`);
                setTopProducts(res.data || []);
            } catch (error) {
                console.error("Lỗi lấy thống kê món:", error);
                // Dữ liệu giả lập phòng khi API lỗi/chưa làm
                setTopProducts([
                    { productName: 'Cà Phê Sữa Đá Sài Gòn', totalQuantitySold: 342 },
                    { productName: 'Bạc Xỉu Cốt Dừa', totalQuantitySold: 289 },
                    { productName: 'Trà Đào Hồng Đài', totalQuantitySold: 215 },
                    { productName: 'Trà Vải Hoa Lài', totalQuantitySold: 178 },
                    { productName: 'Cà Phê Muối Premium', totalQuantitySold: 145 }
                ].slice(0, limit));
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchTopSelling();
    }, [limit]);

    useEffect(() => {
        const fetchRevenueData = async () => {
            setLoadingRevenue(true);
            try {
                const res = await axiosClient.get(`/statistics/revenue?time=${filterTime}`);
                setRevenueStats(res.data);
            } catch (error) {
                console.error("Lỗi lấy doanh thu:", error);
                // Dữ liệu giả lập Doanh thu đồng bộ hệ thống mẫu
                setRevenueStats({
                    totalRevenue: 48250000,
                    totalOrders: 620,
                    totalItemsSold: 1169,
                    chartData: [
                        { name: 'T2', revenue: 5200000 },
                        { name: 'T3', revenue: 6800000 },
                        { name: 'T4', revenue: 4900000 },
                        { name: 'T5', revenue: 7200000 },
                        { name: 'T6', revenue: 8500000 },
                        { name: 'T7', revenue: 9800000 },
                        { name: 'CN', revenue: 5850000 },
                    ]
                });
            } finally {
                setLoadingRevenue(false);
            }
        };
        fetchRevenueData();
    }, [filterTime]);

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto space-y-8 max-w-7xl mx-auto">

            {/* 1. BANNER TIÊU ĐỀ */}
            <div className="bg-white border border-[#ebdcd0] p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#FAF6F0] rounded-tl-full pointer-events-none -z-10" />
                <div className="flex items-center gap-4">
                    <div className="bg-[#FAF6F0] border border-[#e5dcd3] p-3 rounded-xl text-[#a27b5c]">
                        <BarChart3 size={24} className="animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-[#26170f] tracking-tight flex items-center gap-2">
                            Tổng quan kết quả kinh doanh
                            <Sparkles size={16} className="text-[#a27b5c]" />
                        </h4>
                        <p className="text-stone-500 text-sm mt-0.5">Báo cáo doanh số dòng tiền và bảng phân tích hiệu suất món nước tại cửa hàng</p>
                    </div>
                </div>
            </div>

            {/* 2. HÀNG SỐ LIỆU TỔNG HỢP (CARDS) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Doanh Thu */}
                <div className="bg-white p-6 rounded-2xl border border-[#ebdcd0] shadow-sm flex items-center justify-between group hover:border-[#a27b5c] transition-all duration-300">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Tổng doanh thu</span>
                        <h3 className="text-2xl font-black text-[#26170f]">
                            {loadingRevenue ? "..." : `${revenueStats.totalRevenue.toLocaleString('vi-VN')} đ`}
                        </h3>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
                        <DollarSign size={24} />
                    </div>
                </div>

                {/* Card 2: Số Đơn Hàng */}
                <div className="bg-white p-6 rounded-2xl border border-[#ebdcd0] shadow-sm flex items-center justify-between group hover:border-[#a27b5c] transition-all duration-300">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Số lượng đơn hàng</span>
                        <h3 className="text-2xl font-black text-[#26170f]">
                            {loadingRevenue ? "..." : `${revenueStats.totalOrders.toLocaleString('vi-VN')} đơn`}
                        </h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={24} />
                    </div>
                </div>

                {/* Card 3: Sản phẩm tiêu thụ */}
                <div className="bg-white p-6 rounded-2xl border border-[#ebdcd0] shadow-sm flex items-center justify-between group hover:border-[#a27b5c] transition-all duration-300">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Ly nước/món đã bán</span>
                        <h3 className="text-2xl font-black text-[#26170f]">
                            {loadingRevenue ? "..." : `${revenueStats.totalItemsSold.toLocaleString('vi-VN')} sản phẩm`}
                        </h3>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100 group-hover:scale-110 transition-transform">
                        <TrendingUp size={24} />
                    </div>
                </div>
            </div>

            {/* 3. KHU VỰC BIỂU ĐỒ DOANH THU ĐỒNG BỘ */}
            <div className="w-full bg-white rounded-2xl border border-[#ebdcd0] p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f7f0e9] pb-4">
                    <div className="flex items-center gap-2">
                        <BarChart size={20} className="text-[#a27b5c]" />
                        <h3 className="font-black text-base text-[#26170f]">Xu hướng doanh thu dòng tiền</h3>
                    </div>
                    {/* Filter thời gian cho biểu đồ */}
                    <div className="flex gap-2">
                        {['7days', 'month', 'year'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterTime(type)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                    filterTime === type
                                        ? 'bg-[#26170f] text-white border-[#26170f]'
                                        : 'bg-[#FAF6F0]/60 text-[#4a3728] border-[#ebdcd0] hover:bg-stone-50'
                                }`}
                            >
                                {type === '7days' ? 'Tuần này' : type === 'month' ? 'Tháng này' : 'Năm này'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Vẽ biểu đồ Recharts Area mềm mại */}
                <div className="h-64 w-full pt-4">
                    {loadingRevenue ? (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs font-bold">Đang tải biểu đồ dữ liệu...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueStats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a27b5c" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#a27b5c" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e6dd" />
                                <XAxis dataKey="name" tickLine={false} stroke="#a27b5c" className="text-[11px] font-bold" />
                                <YAxis tickLine={false} axisLine={false} stroke="#a27b5c" className="text-[10px]" tickFormatter={(v) => `${v/1000000}M`} />
                                <Tooltip formatter={(value) => [`${value.toLocaleString('vi-VN')} đ`, 'Doanh thu']} contentStyle={{ borderRadius: '12px', border: '1px solid #ebdcd0', fontSize: '11px' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#a27b5c" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* 4. KHU VỰC BẢNG MÓN BÁN CHẠY (BÊN DƯỚI TỔNG HỢP) */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="font-black text-base text-[#26170f] flex items-center gap-2">
                        🏆 Xếp hạng sản phẩm bán chạy nhất
                    </h3>
                    {/* Bộ lọc số lượng món */}
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="bg-white border border-[#ebdcd0] p-2 px-3 rounded-xl text-[#4a3728] font-bold outline-none text-xs cursor-pointer shadow-sm"
                    >
                        <option value={5}>Top 5 món</option>
                        <option value={10}>Top 10 món</option>
                        <option value={15}>Top 15 món</option>
                    </select>
                </div>
                <TopSellingProducts data={topProducts} loading={loadingProducts} />
            </div>

        </div>
    );
};

export default TopSellingProductPage;