import { useState, useEffect } from 'react';
import { Coffee, X, Loader2, DollarSign } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";

const ToppingDetailModal = ({ isOpen, onClose, topping, onRefresh }) => {
    const [price, setPrice] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (topping) {
            setPrice(topping.price);
        }
    }, [topping, isOpen]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleUpdatePrice = async (e) => {
        e.preventDefault();
        if (!price || parseFloat(price) < 0) return;
        setSaving(true);
        try {
            await axiosClient.patch(`/toppings/${topping.toppingId}/price?price=${parseFloat(price)}`);
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen || !topping) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-md w-full overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#a27b5c] to-[#4a3728]" />

                <div className="p-6 border-b border-[#f7f0e9] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Coffee className="text-[#a27b5c]" size={20} />
                        <h3 className="font-black text-lg text-[#26170f]">Thông tin Topping</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="bg-[#FAF6F0] p-4.5 rounded-xl border border-[#efe6dc] space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Tên Topping</span>
                            <span className="font-extrabold text-[#26170f] text-base">{topping.name}</span>
                        </div>
                        <hr className="border-[#ebdcd0]/60" />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Mã Topping</span>
                            <span className="font-semibold text-stone-500 text-xs">{topping.toppingId}</span>
                        </div>
                        <hr className="border-[#ebdcd0]/60" />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Trạng thái</span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                topping.status
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-stone-100 text-stone-500 border-stone-200"
                            }`}>
                                {topping.status ? "Đang bán lẻ" : "Hết hàng"}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleUpdatePrice} className="border-t border-[#f7f0e9] pt-4 space-y-4">
                        <h4 className="text-xs font-black text-[#a27b5c] uppercase tracking-widest flex items-center gap-1">
                            <DollarSign size={14} /> Chỉnh sửa giá bán lẻ
                        </h4>

                        <div className="space-y-2">
                            <input
                                type="number"
                                min="0"
                                className={`w-full bg-[#FAF6F0]/40 border ${parseFloat(price) < 0 ? 'border-red-500' : 'border-[#ebdcd0]'} p-3 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none text-sm transition-all`}
                                placeholder="Nhập giá mới..."
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                            {parseFloat(price) < 0 && (
                                <span className="text-xs text-red-500 font-bold ml-1 block">Giá không được nhỏ hơn 0</span>
                            )}
                            <p className="text-[10px] text-stone-400 ml-1">
                                Giá hiện tại: <span className="font-bold text-[#a27b5c]">{formatCurrency(topping.price)}</span>
                            </p>
                        </div>

                        <div className="pt-2 flex justify-end gap-2 text-xs">
                            <button
                                type="submit"
                                disabled={saving || parseFloat(price) < 0}
                                className="px-5 py-2.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={12} className="animate-spin" /> : null}
                                Cập nhật giá
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 bg-stone-200 text-stone-700 rounded-xl font-bold hover:bg-stone-300"
                            >
                                Đóng
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ToppingDetailModal;