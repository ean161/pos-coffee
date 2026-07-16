import { useState, useEffect } from 'react';
import { BarChart3, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import TopSellingProducts from '../components/TopSellingProducts';
import RevenueReport from '../components/RevenueReport';

const StatisticPage = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [revenueStats, setRevenueStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalItemsSold: 0,
        chartData: []
    });
    const [loadingRevenue, setLoadingRevenue] = useState(true);

    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const handleYearChange = (year) => {
        setSelectedYear(year);
        setSelectedMonth(''); // Reset tháng khi đổi năm mới
    };

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
    };

    useEffect(() => {
        const fetchTopSelling = async () => {
            setLoadingProducts(true);
            try {
                const res = await axiosClient.get(`/statistics/top-selling?page=${page}&size=${size}`);
                setTopProducts(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
            } catch (error) {
                console.error("Lỗi lấy thống kê món:", error);
                setTopProducts([]);
                setTotalPages(0);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchTopSelling();
    }, [page, size]);

    useEffect(() => {
        const fetchRevenueData = async () => {
            setLoadingRevenue(true);
            try {
                let queryParams = '';
                if (selectedYear) {
                    queryParams = `year=${selectedYear}`;
                    if (selectedMonth) {
                        queryParams += `&month=${selectedMonth}`;
                    }
                } else {
                    queryParams = 'period=7days';
                }

                const res = await axiosClient.get(`/statistics/revenue?${queryParams}`);
                setRevenueStats(res.data);
            } catch (error) {
                console.error("Lỗi lấy dữ liệu doanh thu từ Server:", error);
                // Fallback dữ liệu trống an toàn khi mất kết nối mạng hoặc lỗi API
                setRevenueStats({ totalRevenue: 0, totalOrders: 0, totalItemsSold: 0, chartData: [] });
            } finally {
                setLoadingRevenue(false);
            }
        };
        fetchRevenueData();
    }, [selectedYear, selectedMonth]);

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto space-y-8 max-w-7xl mx-auto">

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

            <RevenueReport
                stats={revenueStats}
                loading={loadingRevenue}
                selectedYear={selectedYear}
                onYearChange={handleYearChange}
                selectedMonth={selectedMonth}
                onMonthChange={handleMonthChange}
            />

            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="font-black text-base text-[#26170f] flex items-center gap-2">
                        🏆 Xếp hạng sản phẩm bán chạy nhất
                    </h3>

                    <select
                        value={size}
                        onChange={(e) => {
                            setSize(Number(e.target.value));
                            setPage(0);
                        }}
                        className="bg-white border border-[#ebdcd0] p-2 px-3 rounded-xl text-[#4a3728] font-bold outline-none text-xs cursor-pointer shadow-sm hover:border-[#a27b5c]"
                    >
                        <option value={5}>Hiển thị 5 món</option>
                        <option value={10}>Hiển thị 10 món</option>
                        <option value={15}>Hiển thị 15 món</option>
                    </select>
                </div>

                <TopSellingProducts data={topProducts} loading={loadingProducts} page={page} size={size} />

                {totalPages > 1 && (
                    <div className="flex items-center justify-between border border-[#ebdcd0] bg-white px-4 py-3 rounded-2xl shadow-sm">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                                disabled={page === 0}
                                className="relative inline-flex items-center rounded-xl border border-[#ebdcd0] bg-white px-4 py-2 text-xs font-bold text-[#4a3728] hover:bg-stone-50 disabled:opacity-50"
                            >
                                Trước
                            </button>
                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                                disabled={page === totalPages - 1}
                                className="relative ml-3 inline-flex items-center rounded-xl border border-[#ebdcd0] bg-white px-4 py-2 text-xs font-bold text-[#4a3728] hover:bg-stone-50 disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs text-[#a27b5c] font-medium">
                                    Hiển thị trang <span className="font-bold text-[#26170f]">{page + 1}</span> trên tổng số <span className="font-bold text-[#26170f]">{totalPages}</span> trang
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex -space-x-px rounded-xl gap-1" aria-label="Pagination">
                                    <button
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                                        disabled={page === 0}
                                        className="relative inline-flex items-center rounded-xl border border-[#ebdcd0] bg-[#FAF6F0]/50 p-2 text-stone-500 hover:bg-[#FAF6F0] disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    {[...Array(totalPages)].map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setPage(idx)}
                                            className={`relative inline-flex items-center justify-center h-8 w-8 text-xs font-bold rounded-xl border transition-all ${
                                                page === idx
                                                    ? 'bg-[#26170f] text-white border-[#26170f] shadow-sm'
                                                    : 'bg-white text-[#4a3728] border-[#ebdcd0] hover:bg-stone-50'
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                                        disabled={page === totalPages - 1}
                                        className="relative inline-flex items-center rounded-xl border border-[#ebdcd0] bg-[#FAF6F0]/50 p-2 text-stone-500 hover:bg-[#FAF6F0] disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatisticPage;