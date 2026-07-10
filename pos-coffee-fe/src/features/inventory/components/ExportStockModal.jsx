import { useState } from "react";
import { X, Trash2, Loader2 } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";
import ConfirmModal from "../../../shared/components/ConfirmModal.jsx";

const ExportStockModal = ({ isOpen, onClose, existingStocks, onRefresh }) => {
    const [submitting, setSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [apiError, setApiError] = useState("");

    const [stockId, setStockId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    const handleOpenConfirm = (e) => {
        e.preventDefault();
        setApiError("");

        const selectedStock = existingStocks.find(item => item.id === stockId);
        if (selectedStock && parseFloat(quantity) > selectedStock.quantity) {
            alert(`Không thể xuất quá số lượng hiện có! (Tồn hiện tại: ${selectedStock.quantity} ${selectedStock.unit})`);
            return;
        }

        setShowConfirm(true);
    };

    const handleConfirmExport = async () => {
        setSubmitting(true);
        setApiError("");
        try {
            const payload = {
                stockId: stockId,
                quantity: parseFloat(quantity),
                reason: reason
            };

            await axiosClient.post("/admin/inventory/export", payload);

            setStockId(""); setQuantity(""); setReason("");
            setShowConfirm(false);
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Lỗi xuất kho:", error);
            const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi tạo phiếu xuất kho.";
            setApiError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const selectedItemName = existingStocks.find(item => item.id === stockId)?.itemName || "Hàng hóa";

    return (
        <>
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${showConfirm ? 'pointer-events-none opacity-40' : ''}`}>
                <div className="bg-white rounded-2xl w-full max-w-md border border-[#ebdcd0] shadow-2xl relative overflow-hidden animate-fade-in pointer-events-auto">
                    <div className="p-6 border-b border-[#f7f0e9] flex items-center justify-between">
                        <h5 className="text-lg font-black text-[#26170f] flex items-center gap-2">
                            <Trash2 size={20} className="text-rose-600" /> Tạo phiếu xuất hủy kho
                        </h5>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={showConfirm}
                            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-30"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleOpenConfirm} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wider">Mặt hàng cần xuất hủy</label>
                            <select disabled={showConfirm} required value={stockId} onChange={(e) => setStockId(e.target.value)} className="w-full px-3 py-2.5 bg-[#FAF6F0]/50 border border-[#ebdcd0] rounded-xl text-sm font-semibold text-[#26170f] outline-none focus:border-[#a27b5c] focus:bg-white transition-all disabled:opacity-60">
                                <option value="">-- Chọn nguyên vật liệu/hàng hóa --</option>
                                {existingStocks.map(item => (
                                    <option key={item.id} value={item.id}>{item.itemName} (Hiện có: {item.quantity} {item.unit})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wider">Số lượng xuất</label>
                            <input disabled={showConfirm} type="number" step="0.01" required min="0.01" placeholder="Nhập số lượng lớn hơn 0" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-3 py-2.5 bg-[#FAF6F0]/50 border border-[#ebdcd0] rounded-xl text-sm font-semibold text-[#26170f] outline-none focus:border-[#a27b5c] focus:bg-white transition-all disabled:opacity-60" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wider">Lý do xuất hủy (Bắt buộc)</label>
                            <textarea disabled={showConfirm} required rows="3" placeholder="Ví dụ: Hàng hết hạn sử dụng..." value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2.5 bg-[#FAF6F0]/50 border border-[#ebdcd0] rounded-xl text-sm font-semibold text-[#26170f] outline-none focus:border-[#a27b5c] focus:bg-white transition-all placeholder:text-stone-300 resize-none disabled:opacity-60" />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={onClose} disabled={showConfirm} className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-bold text-xs transition-colors disabled:opacity-50">
                                Hủy bỏ
                            </button>
                            <button type="submit" disabled={showConfirm} className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50">
                                <Trash2 size={14} /> Tiến hành xuất hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => !submitting && setShowConfirm(false)}
                onConfirm={handleConfirmExport}
                title="Xác nhận xuất kho"
                message={`Bạn có chắc chắn muốn xuất kho "${selectedItemName}" khỏi hệ thống?`}
                error={apiError}
            />
        </>
    );
};

export default ExportStockModal;