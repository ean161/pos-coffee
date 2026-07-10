import { useState, useEffect } from 'react';
import { Package, Sparkles, FilePlus2, FileMinus2 } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import InventoryTable from "../components/InventoryTable";
import ImportStockModal from "../components/ImportStockModal";
import ExportStockModal from "../components/ExportStockModal";
import InventoryLogDrawer from "../components/InventoryLogDrawer";


const InventoryPage = () => {
    const [inventories, setInventories] = useState([]);
    const [allStocks, setAllStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState("");

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);


    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/admin/inventory`, {
                params: { keyword: keyword || undefined, page: page, size: size }
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

    const fetchAllStocksForModal = async () => {
        try {
            const res = await axiosClient.get(`/admin/inventory`, { params: { size: 1000 } });
            setAllStocks(res.data.content || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => { fetchData(); }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [page, keyword]);

    useEffect(() => {
        if (isImportModalOpen || isExportModalOpen) {
            fetchAllStocksForModal();
        }
    }, [isImportModalOpen, isExportModalOpen]);

    const handleOpenDrawer = (item) => {
        setSelectedStock(item);
        setIsDrawerOpen(true);
    };


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
                            Quản lý kho hàng hóa
                            <Sparkles size={16} className="text-[#a27b5c]" />
                        </h4>
                        <p className="text-stone-500 text-sm mt-1">Xem và điều chỉnh số lượng tồn kho thực tế của các nguyên vật liệu thô</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-4 py-3 bg-[#a27b5c] hover:bg-[#8e6b4f] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#a27b5c]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                    >
                        <FilePlus2 size={15} /> Tạo phiếu nhập
                    </button>

                    <button
                        onClick={() => setIsExportModalOpen(true)}
                        className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                    >
                        <FileMinus2 size={15} /> Tạo phiếu xuất hủy
                    </button>
                </div>
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
                    onViewDetail={handleOpenDrawer}
                />
            </div>

            <ImportStockModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                existingStocks={allStocks}
                onRefresh={fetchData}
            />

            <ExportStockModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                existingStocks={allStocks}
                onRefresh={fetchData}
            />

            <InventoryLogDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                stockItem={selectedStock}
            />

        </div>
    );
};

export default InventoryPage;