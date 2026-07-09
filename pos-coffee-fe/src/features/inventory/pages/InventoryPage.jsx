import { useState, useEffect } from 'react';
import { Package, Sparkles, RefreshCw } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import InventoryTable from "../components/InventoryTable";

const InventoryPage = () => {
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/inventories`, {
                params: {
                    keyword: keyword || undefined,
                    page: page,
                    size: size
                }
            });

            setInventories(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
            setTotalElements(res.data.totalElements || 0);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu kho:", error);
            setInventories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [page, keyword]);

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto space-y-6 max-w-7xl mx-auto">
            <div className="bg-white border border-[#ebdcd0] p-6 lg:p-8 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#FAF6F0] rounded-tl-full pointer-events-none -z-10" />

                <div className="flex items-center gap-4">
                    <div className="bg-[#FAF6F0] border border-[#e5dcd3] p-3.5 rounded-xl text-[#a27b5c]">
                        <Package size={24} className="animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-[#26170f] tracking-tight flex items-center gap-2">
                            Quản lý tồn kho hiện tại
                            <Sparkles size={16} className="text-[#a27b5c]" />
                        </h4>
                        <p className="text-stone-500 text-sm mt-1">Xem số lượng tồn kho thực tế của các biến thể sản phẩm và topping trong hệ thống</p>
                    </div>
                </div>

                <button
                    onClick={() => { setPage(0); setKeyword(""); fetchData(); }}
                    className="px-6 py-3.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#4a3728]/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Làm mới dữ liệu
                </button>
            </div>

            <div className="bg-white border border-[#ebdcd0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <InventoryTable
                    data={inventories}
                    loading={loading}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    onRefresh={fetchData}
                />
            </div>
        </div>
    );
};

export default InventoryPage;