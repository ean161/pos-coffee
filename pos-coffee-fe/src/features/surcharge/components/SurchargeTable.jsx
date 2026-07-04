import { useState } from "react";
import { ToggleLeft, ToggleRight, FolderOpen, Eye } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";
import SurchargeDetailModal from "./SurchargeDetailModal";

const SurchargeTable = ({ data, onRefresh }) => {
    const [selectedSurcharge, setSelectedSurcharge] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const handleOpenDetail = (surcharge) => {
        setSelectedSurcharge(surcharge);
        setDetailModalOpen(true);
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await axiosClient.patch(`/surcharges/${id}/status?status=${!currentStatus}`);
            onRefresh();
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    const formatValue = (item) => {
        if (item.surchargeType === 'PERCENT') {
            return `${item.value}%`;
        }
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.value);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[#a27b5c] bg-white rounded-2xl p-8 text-center animate-fade-in">
                <FolderOpen size={48} className="mb-4 text-stone-200" />
                <p className="text-base font-bold text-[#26170f]">Chưa có phụ thu nào</p>
                <p className="text-xs text-stone-400 mt-1">Bấm nút "Thêm Phụ thu" để bắt đầu thiết lập</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                <tr className="bg-[#FAF6F0]/60 border-b border-[#ebdcd0] text-[11px] text-[#a27b5c] uppercase font-bold tracking-widest">
                    <th className="px-8 py-5">Tên Phụ thu</th>
                    <th className="px-6 py-5">Loại</th>
                    <th className="px-6 py-5">Giá trị</th>
                    <th className="px-6 py-5">Thời gian hoạt động</th>
                    <th className="px-6 py-5">Trạng thái</th>
                    <th className="px-8 py-5 text-right">Tùy chọn</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-[#f7f0e9]">
                {data.map((item) => (
                    <tr
                        key={item.id}
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
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                    item.surchargeType === 'PERCENT'
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-orange-50 text-orange-700 border-orange-200"
                                }`}>
                                    {item.surchargeType === 'PERCENT' ? 'Phần trăm' : 'Số tiền'}
                                </span>
                        </td>
                        <td className="px-6 py-5">
                                <span className="font-semibold text-stone-600">
                                    {formatValue(item)}
                                </span>
                        </td>
                        <td className="px-6 py-5">
                                <span className="text-xs text-stone-500 font-medium">
                                    {formatDate(item.startTime)} - {formatDate(item.endTime)}
                                </span>
                        </td>
                        <td className="px-6 py-5">
                            <button
                                onClick={() => toggleStatus(item.id, item.status)}
                                className="flex items-center gap-2.5 group/toggle focus:outline-none"
                            >
                                {item.status ? (
                                    <ToggleRight size={30} className="text-[#a27b5c]" />
                                ) : (
                                    <ToggleLeft size={30} className="text-stone-300" />
                                )}
                            </button>
                        </td>
                        <td className="px-8 py-5 text-right">
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

            <SurchargeDetailModal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                surcharge={selectedSurcharge}
            />
        </div>
    );
};

export default SurchargeTable;