import { useState } from "react";
import { X, Plus, PackageCheck, Loader2 } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

const ImportStockModal = ({ isOpen, onClose, existingStocks, onRefresh }) => {
    const [isNewItem, setIsNewItem] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [stockId, setStockId] = useState("");
    const [itemName, setItemName] = useState("");
    const [unit, setUnit] = useState("");
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                stockId: isNewItem ? null : stockId,
                itemName: isNewItem ? itemName : null,
                unit: isNewItem ? unit : null,
                quantity: parseFloat(quantity),
                reason: reason || ""
            };

            await axiosClient.post("/admin/inventory/import", payload);

            setStockId(""); setItemName(""); setUnit(""); setQuantity(""); setReason("");
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Lỗi nhập kho:", error);
            alert("Có lỗi xảy ra khi tạo phiếu nhập kho.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md border border-[#ebdcd0] shadow-2xl relative overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-[#f7f0e9] flex items-center justify-between">
                    <h5 className="text-lg font-black text-[#26170f] flex items-center gap-2">
                        <PackageCheck size={20} className="text-[#a27b5c]" /> Tạo phiếu nhập kho
                    </h5>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-50 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex bg-[#FAF6F0] p-1 rounded-xl border border-[#ebdcd0]">
                        <button type="button" onClick={() => setIsNewItem(false)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isNewItem ? 'bg-[#a27b5c] text-white shadow' : 'text-stone-500 hover:text-[#26170f]'}`}>
                            Chọn hàng sẵn có
                        </button>
                        <button type="button" onClick={() => setIsNewItem(true)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isNewItem ? 'bg-[#a27b5c] text-white shadow' : 'text-stone-500 hover:text-[#26170f]'}`}>
                            + Tạo hàng hóa mới
                        </button>
                    </div>

                    {!isNewItem ? (
                        <div>
                            <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wider">Mặt hàng trong kho</label>
                            <select required value={stockId} onChange={(e) => setStockId(e.target.value)} className="w-full px-3 py-2.5 bg-[#FAF6F0]/50 border border-[#ebdcd0] rounded-xl text-sm font-semibold text-[#26170f] outline-none focus:border-[#a27b5c] focus:bg-white transition-all">
                                <option value="">-- Chọn nguyên vật liệu/hàng hóa --</option>
                                {existingStocks.map(item => (
                                    <option key={item.id} value={item.id}>{item.itemName} (Hiện có: {item.quantity} {item.unit})</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wider">Tên hàng hóa mới</label>
                                <input type="text" required placeholder="Ví dụ: Ly nhựa 500ml, Hạt Cafe Arabica..." value={itemName} onChange={(e) => setItemName(e.target.value)} className="w-full px-3 py-2.5 bg-[#FAF6F0]/50 border border-[#ebdcd0] rounded-xl text-sm font-semibold text-[#26170f] outline-none focus:border-[#a27b5c] focus:bg-white transition-all placeholder:text-stone-300" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wider">Đơn vị tính</label>
                                <input type="text" required placeholder="Ví dụ: Cái, Hộp, Kg, Thùng..." value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2.5 bg-[#FAF6F0]/50 border border-[#ebdcd0] rounded-xl text-sm font-semibold text-[#26170f] outline-none focus:border-[#a27b5c] focus:bg-white transition-all placeholder:text-stone-300" />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wider">Số lượng nhập thêm</label>
                        <input type="number" step="0.01" required min="0.01" placeholder="Nhập số lượng lớn hơn 0" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-3 py-2.5 bg-[#FAF6F0]/50 border border-[#ebdcd0] rounded-xl text-sm font-semibold text-[#26170f] outline-none focus:border-[#a27b5c] focus:bg-white transition-all" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wider">Ghi chú / Lý do nhập</label>
                        <textarea rows="3" placeholder="Ghi chú" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2.5 bg-[#FAF6F0]/50 border border-[#ebdcd0] rounded-xl text-sm font-semibold text-[#26170f] outline-none focus:border-[#a27b5c] focus:bg-white transition-all placeholder:text-stone-300 resize-none" />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} disabled={submitting} className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-bold text-xs transition-colors">
                            Hủy bỏ
                        </button>
                        <button type="submit" disabled={submitting} className="flex-1 py-3 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#4a3728]/20 transition-all">
                            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Xác nhận nhập kho
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ImportStockModal;