import { useState, useEffect } from 'react';
import { Coffee, Plus, Sparkles, Loader2, X } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import ToppingTable from "../components/ToppingTable";

const ToppingPage = () => {
    const [toppings, setToppings] = useState([]);
    const [loading, setLoading] = useState(true);

    // States cho Modal thêm Topping
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/toppings`);
            // Backend trả về Page<ToppingResponse> nên dữ liệu nằm ở res.data.content
            setToppings(res.data.content || []);
        } catch (error) {
            console.error("Lỗi tải topping:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTopping = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axiosClient.post("/toppings", {
                name,
                price: parseFloat(price)
            });
            setName('');
            setPrice('');
            setCreateModalOpen(false);
            fetchData(); // Tải lại danh sách
        } catch (error) {
            console.error("Lỗi tạo topping:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto space-y-6 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="bg-white border border-[#ebdcd0] p-6 lg:p-8 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#FAF6F0] rounded-tl-full pointer-events-none -z-10" />

                <div className="flex items-center gap-4">
                    <div className="bg-[#FAF6F0] border border-[#e5dcd3] p-3.5 rounded-xl text-[#a26b9c]">
                        <Coffee size={24} className="animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-[#26170f] tracking-tight flex items-center gap-2">
                            Quản lý Toppings
                            <Sparkles size={16} className="text-[#a26b9c]" />
                        </h4>
                        <p className="text-stone-500 text-sm mt-1">Quản lý các loại topping thêm vào trà sữa, cà phê và món phụ</p>
                    </div>
                </div>

                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="px-6 py-3.5 bg-[#a26b9c] hover:bg-[#8c5a86] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#a26b9c]/20 hover:shadow-[#a26b9c]/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
                >
                    <Plus size={18} className="stroke-[3]" /> Thêm Topping
                </button>
            </div>

            {/* Bảng Topping */}
            <div className="bg-white border border-[#ebdcd0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-[#a26b9c] h-8 w-8" />
                    </div>
                ) : (
                    <ToppingTable data={toppings} onRefresh={fetchData} />
                )}
            </div>

            {/* ================= MODAL TẠO TOPPING MỚI ================= */}
            {createModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-md w-full overflow-hidden shadow-2xl relative animate-scale-up">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#a26b9c]" />

                        <div className="p-6 border-b border-[#f7f0e9] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Coffee className="text-[#a26b9c]" size={20} />
                                <h3 className="font-black text-lg text-[#26170f]">Thêm Topping mới</h3>
                            </div>
                            <button
                                onClick={() => setCreateModalOpen(false)}
                                className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTopping} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#a26b9c] uppercase tracking-widest ml-1 block">
                                    Tên Topping (*)
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3.5 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a26b9c]/10 focus:border-[#a26b9c] focus:bg-white outline-none transition-all placeholder:text-stone-300 text-sm"
                                    placeholder="Ví dụ: Trân châu đen, Thạch nha đam..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#a26b9c] uppercase tracking-widest ml-1 block">
                                    Giá bán (VND) (*)
                                </label>
                                <input
                                    type="number"
                                    className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3.5 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a26b9c]/10 focus:border-[#a26b9c] focus:bg-white outline-none transition-all placeholder:text-stone-300 text-sm"
                                    placeholder="Ví dụ: 5000, 10000..."
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2 text-sm">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2.5 bg-[#a26b9c] hover:bg-[#8c5a86] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#a26b9c]/10 transition-all disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                                    Tạo mới
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCreateModalOpen(false)}
                                    className="px-5 py-2.5 bg-stone-150 text-stone-700 rounded-xl font-bold hover:bg-stone-200"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToppingPage;