import { useState } from 'react';
import { Coffee, Loader2, X } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";

const ToppingModal = ({ isOpen, onClose, onRefresh }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [saving, setSaving] = useState(false);

    const handleCreateTopping = async (e) => {
        e.preventDefault();
        if (parseFloat(price) < 0) return;
        setSaving(true);
        try {
            await axiosClient.post("/toppings", {
                name,
                price: parseFloat(price)
            });
            setName('');
            setPrice('');
            onClose();
            onRefresh();
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-md w-full overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#a27b5c]" />

                <div className="p-6 border-b border-[#f7f0e9] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Coffee className="text-[#a27b5c]" size={20} />
                        <h3 className="font-black text-lg text-[#26170f]">Thêm Topping mới</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleCreateTopping} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                            Tên Topping (*)
                        </label>
                        <input
                            type="text"
                            className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3.5 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] focus:bg-white outline-none transition-all placeholder:text-stone-300 text-sm"
                            placeholder="Ví dụ: Trân châu đen, Thạch nha đam..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                            Giá bán (VND) (*)
                        </label>
                        <input
                            type="number"
                            min="0"
                            className={`w-full bg-[#FAF6F0]/40 border ${parseFloat(price) < 0 ? 'border-red-500' : 'border-[#ebdcd0]'} p-3.5 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] focus:bg-white outline-none transition-all placeholder:text-stone-300 text-sm`}
                            placeholder="Ví dụ: 5000, 10000..."
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                        {parseFloat(price) < 0 && (
                            <span className="text-xs text-red-500 font-bold ml-1 block">Giá không được nhỏ hơn 0</span>
                        )}
                    </div>

                    <div className="pt-2 flex justify-end gap-2 text-sm">
                        <button
                            type="submit"
                            disabled={saving || parseFloat(price) < 0}
                            className="px-5 py-2.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                            Tạo mới
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-stone-150 text-stone-700 rounded-xl font-bold hover:bg-stone-200"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ToppingModal;