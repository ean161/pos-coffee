import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

const UpdateStockPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fetching, setFetching] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");

    useEffect(() => {
        const fetchStockDetail = async () => {
            try {
                const res = await axiosClient.get(`/admin/inventory`, { params: { size: 1000 } });
                const currentItem = res.data.content?.find(item => String(item.id) === String(id));

                if (currentItem) {
                    setItemName(currentItem.itemName || "");
                    setQuantity(currentItem.quantity || 0);
                    setUnit(currentItem.unit || "");
                } else {
                    navigate("/admin/inventory");
                }
            } catch (error) {
                console.error("Lỗi tải thông tin mặt hàng:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchStockDetail();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                itemName,
                quantity: parseFloat(quantity),
                unit
            };
            await axiosClient.put(`/admin/inventory/edit/${id}`, payload);
            navigate("/admin/inventory");
        } catch (error) {
            console.error("Lỗi cập nhật kho:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col justify-center items-center py-28 space-y-4">
                <Loader2 className="animate-spin text-[#a27b5c] stroke-[2.5]" size={32} />
                <span className="text-xs font-bold text-[#a27b5c] uppercase tracking-wider animate-pulse">Vui lòng chờ giây lát...</span>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto mt-6 px-4">
            <button
                onClick={() => navigate('/admin/inventory')}
                className="group flex items-center gap-2 px-4.5 py-2.5 bg-white border border-[#ebdcd0] rounded-xl text-xs font-bold text-[#a27b5c] hover:text-[#25160F] hover:bg-[#FAF6F0]/50 transition-all duration-300 mb-8 shadow-sm"
            >
                <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
                Quay lại danh sách kho
            </button>

            <div className="relative p-8 bg-white rounded-2xl border border-[#ebdcd0] shadow-xl shadow-stone-200/40 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#a27b5c] via-[#ebdcd0] to-[#26170f]" />

                <div className="flex items-center gap-2.5 mb-7">
                    <Package size={18} className="text-[#a27b5c]" />
                    <h1 className="text-xl font-black text-[#25160F] tracking-tight">
                        Cập nhật hàng tồn kho
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                            Tên hàng hóa / Nguyên vật liệu (*)
                        </label>
                        <input
                            type="text"
                            className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-4 rounded-xl text-[#25160F] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] focus:bg-white outline-none transition-all placeholder:text-stone-300 text-sm"
                            value={itemName}
                            onChange={e => setItemName(e.target.value)}
                            placeholder="Ví dụ: Hạt cà phê Robusta, Sữa tươi..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                            Số lượng tồn thực tế (*)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-4 rounded-xl text-[#25160F] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] focus:bg-white outline-none transition-all placeholder:text-stone-300 text-sm"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            placeholder="Ví dụ: 50, 12.5..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                            Đơn vị tính (*)
                        </label>
                        <input
                            type="text"
                            className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-4 rounded-xl text-[#25160F] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] focus:bg-white outline-none transition-all placeholder:text-stone-300 text-sm"
                            value={unit}
                            onChange={e => setUnit(e.target.value)}
                            placeholder="Ví dụ: Kg, Lít, Túi, Hộp..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-[#4a3728]/20 active:scale-98 transition-all duration-350 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Đang lưu...</span>
                            </>
                        ) : (
                            <span>Lưu thay đổi</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateStockPage;