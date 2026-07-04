import { useState } from "react";
import { ToggleLeft, ToggleRight, FolderOpen, Eye, SquarePen } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";
import ToppingDetailModal from "./ToppingDetailModal";

const ToppingTable = ({ data, onRefresh }) => {
    const [selectedTopping, setSelectedTopping] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const handleOpenDetail = (topping) => {
        setSelectedTopping(topping);
        setDetailModalOpen(true);
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await axiosClient.patch(`/toppings/${id}/status?status=${!currentStatus}`);
            onRefresh();
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[#a27b5c] bg-white rounded-2xl p-8 text-center animate-fade-in">
                <FolderOpen size={48} className="mb-4 text-stone-200" />
                <p className="text-base font-bold text-[#26170f]">Chưa có topping nào</p>
                <p className="text-xs text-stone-400 mt-1">Bấm nút "Thêm Topping" để bắt đầu thiết lập</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                <tr className="bg-[#FAF6F0]/60 border-b border-[#ebdcd0] text-[11px] text-[#a27b5c] uppercase font-bold tracking-widest">
                    <th className="px-8 py-5">Tên Topping</th>
                    <th className="px-6 py-5">Giá bán lẻ</th>
                    <th className="px-6 py-5">Trạng thái phục vụ</th>
                    <th className="px-8 py-5 text-right">Tùy chọn</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-[#f7f0e9]">
                {data.map((item) => (
                    <tr
                        key={item.toppingId}
                        className="group hover:bg-[#fcf8f2] transition-all duration-300 hover:translate-x-1.5"
                    >
                        <td className="px-8 py-5">
                                <span
                                    onClick={() => handleOpenDetail(item)}
                                    className="font-bold text-[#26170f] text-base hover:text-[#a27b5c] transition-colors cursor-pointer"
                                >
                                    {item.name}
                                </span>
                        </td>
                        <td className="px-6 py-5">
                                <span className="font-semibold text-stone-600">
                                    {formatCurrency(item.price)}
                                </span>
                        </td>
                        <td className="px-6 py-5">
                            <button
                                onClick={() => toggleStatus(item.toppingId, item.status)}
                                className="flex items-center gap-2.5 group/toggle focus:outline-none"
                            >
                                {item.status ? (
                                    <ToggleRight size={30} className="text-[#a27b5c]" />
                                ) : (
                                    <ToggleLeft size={30} className="text-stone-300" />
                                )}
                                <span className={`text-xs font-bold ${item.status ? "text-[#a27b5c]" : "text-stone-400"}`}>
                                        {item.status ? "Sẵn sàng" : "Hết hàng"}
                                    </span>
                            </button>
                        </td>
                        <td className="px-8 py-5 text-right flex justify-end gap-2">
                            <button
                                onClick={() => handleOpenDetail(item)}
                                className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-stone-400 bg-stone-50 border border-stone-200 hover:bg-stone-100 hover:text-stone-700 transition-all duration-300"
                                title="Xem chi tiết"
                            >
                                <Eye size={17} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <ToppingDetailModal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                topping={selectedTopping}
                onRefresh={onRefresh}
            />
        </div>
    );
};

export default ToppingTable;