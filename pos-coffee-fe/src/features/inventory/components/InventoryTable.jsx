import { Search, Loader2, PackageOpen, ChevronLeft, ChevronRight } from "lucide-react";

const InventoryTable = ({
                            data,
                            loading,
                            keyword,
                            setKeyword,
                            page,
                            setPage,
                            totalPages,
                            totalElements,
                            onRefresh
                        }) => {

    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
        setPage(0);
    };

    if (!loading && data.length === 0 && !keyword) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[#a27b5c] bg-white rounded-2xl p-8 text-center shadow-sm">
                <PackageOpen size={48} className="mb-4 text-stone-200" />
                <p className="text-base font-bold text-[#26170f]">Kho hàng trống</p>
                <p className="text-xs text-stone-400 mt-1">Chưa có dữ liệu nguyên vật liệu hay sản phẩm nào trong kho.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-4 bg-white flex items-center gap-3 border-b border-[#f7f0e9]">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên món, tên topping hoặc danh mục..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0]/50 border border-[#ebdcd0] rounded-xl text-xs font-bold text-[#26170f] outline-none focus:border-[#a27b5c] focus:bg-white transition-all placeholder:text-stone-300"
                        value={keyword}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                    <tr className="bg-[#FAF6F0]/60 border-b border-[#ebdcd0] text-[11px] text-[#a27b5c] uppercase font-bold tracking-widest">
                        <th className="px-8 py-5">Loại hàng</th>
                        <th className="px-6 py-5">Danh mục</th>
                        <th className="px-6 py-5">Tên vật phẩm</th>
                        <th className="px-6 py-5">Kích thước (Size)</th>
                        <th className="px-6 py-5">Số lượng tồn</th>
                        <th className="px-6 py-5">Đơn vị</th>
                        <th className="px-8 py-5 text-right">Cập nhật cuối</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f7f0e9]">
                    {loading ? (
                        <tr>
                            <td colSpan="7" className="py-20 text-center">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Loader2 className="animate-spin text-[#a27b5c]" size={28} />
                                    <span className="text-xs text-[#a27b5c] font-bold tracking-wider animate-pulse uppercase">Đang tải dữ liệu kho...</span>
                                </div>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="py-12 text-center text-stone-400 text-xs font-medium">
                                Không tìm thấy kết quả nào khớp với từ khóa "{keyword}".
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr key={item.id} className="group hover:bg-[#fcf8f2] transition-all duration-300 hover:translate-x-1">
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${
                                        item.itemType === "PRODUCT"
                                            ? "bg-amber-50 text-amber-800 border-amber-200"
                                            : "bg-purple-50 text-purple-800 border-purple-200"
                                    }`}>
                                        {item.itemType === "PRODUCT" ? "Sản phẩm" : "Topping"}
                                    </span>
                                </td>
                                <td className="px-6 py-5 font-bold text-stone-500 text-sm">{item.categoryName}</td>
                                <td className="px-6 py-5 font-extrabold text-[#26170f] text-base">{item.itemName}</td>
                                <td className="px-6 py-5 font-bold text-stone-600 text-sm">
                                    <span className={item.sizeName === "-" ? "text-stone-300" : ""}>{item.sizeName}</span>
                                </td>
                                <td className="px-6 py-5 font-black text-[#a27b5c] text-base">{item.quantity.toLocaleString("vi-VN")}</td>
                                <td className="px-6 py-5 font-semibold text-stone-500 text-sm">{item.unit}</td>
                                <td className="px-8 py-5 text-right font-medium text-stone-400 text-xs">
                                    {new Date(item.lastUpdated).toLocaleString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        day: "2-digit",
                                        month: "2-digit"
                                    })}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="p-4 bg-[#FAF6F0]/40 border-t border-[#f7f0e9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-stone-500">
                    <span>Hiển thị trang <span className="text-[#a27b5c]">{page + 1}</span> / {totalPages} (Tổng cộng {totalElements} dòng)</span>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0 || loading}
                            className="p-2 bg-white border border-[#ebdcd0] rounded-xl text-stone-600 hover:bg-stone-50 disabled:opacity-40"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {[...Array(totalPages).keys()].map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                disabled={loading}
                                className={`w-8 h-8 rounded-xl transition-all ${
                                    page === pageNum ? "bg-[#a27b5c] text-white" : "bg-white border border-[#ebdcd0] hover:bg-stone-50"
                                }`}
                            >
                                {pageNum + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1 || loading}
                            className="p-2 bg-white border border-[#ebdcd0] rounded-xl text-stone-600 hover:bg-stone-50 disabled:opacity-40"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryTable;