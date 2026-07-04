import { useState } from "react";
import { ToggleLeft, ToggleRight, FolderOpen, Eye } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";
import VoucherDetailModal from "./VoucherDetailModal";

const VoucherTable = ({ data, onRefresh }) => {
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const handleOpenDetail = (voucher) => {
        setSelectedVoucher(voucher);
        setDetailModalOpen(true);
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await axiosClient.patch(`/vouchers/${id}/status?status=${!currentStatus}`);
            onRefresh();
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return "";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDiscount = (item) => {
        if (item.discountType === 'PERCENT') {
            return `${item.discountValue}%`;
        }
        return formatCurrency(item.discountValue);
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
                <p className="text-base font-bold text-[#26170f]">Chưa có voucher nào</p>
                <p className="text-xs text-stone-400 mt-1">Bấm nút "Tạo Voucher" để bắt đầu thiết lập</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                <tr className="bg-[#FAF6F0]/60 border-b border-[#ebdcd0] text-[11px] text-[#a27b5c] uppercase font-bold tracking-widest">
                    <th className="px-8 py-5">Mã Voucher</th>
                    <th className="px-6 py-5">Loại giảm</th>
                    <th className="px-6 py-5">Mức giảm</th>
                    <th className="px-6 py-5">Đơn tối thiểu</th>
                    <th className="px-6 py-5">Hạn dùng</th>
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
                                    {item.code}
                                </span>
                        </td>
                        <td className="px-6 py-5">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                    item.discountType === 'PERCENT'
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-orange-50 text-orange-700 border-orange-200"
                                }`}>
                                    {item.discountType === 'PERCENT' ? 'Phần trăm' : 'Số tiền'}
                                </span>
                        </td>
                        <td className="px-6 py-5">
                                <span className="font-semibold text-stone-600">
                                    {formatDiscount(item)}
                                </span>
                        </td>
                        <td className="px-6 py-5">
                                <span className="font-semibold text-stone-600">
                                    {formatCurrency(item.minOrderValue)}
                                </span>
                        </td>
                        <td className="px-6 py-5">
                                <span className="text-xs text-stone-500 font-medium">
                                    {formatDate(item.expiryDate)}
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

            <VoucherDetailModal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                voucher={selectedVoucher}
            />
        </div>
    );
};

export default VoucherTable;