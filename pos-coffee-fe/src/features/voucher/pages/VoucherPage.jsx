import { useState, useEffect } from 'react';
import { Coffee, Plus, Sparkles, Loader2, X } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import VoucherTable from "../components/VoucherTable";

const VoucherPage = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState('PERCENT');
    const [discountValue, setDiscountValue] = useState('');
    const [minOrderValue, setMinOrderValue] = useState('');
    const [maxDiscount, setMaxDiscount] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/vouchers`);
            setVouchers(res.data.content || []);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVoucher = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrorMsg('');
        try {
            await axiosClient.post("/vouchers", {
                code,
                discountType,
                discountValue: parseFloat(discountValue),
                minOrderValue: parseFloat(minOrderValue),
                maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
                expiryDate
            });
            setCode('');
            setDiscountType('PERCENT');
            setDiscountValue('');
            setMinOrderValue('');
            setMaxDiscount('');
            setExpiryDate('');
            setCreateModalOpen(false);
            fetchData();
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
            console.error("Lỗi:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto space-y-6 max-w-7xl mx-auto">
            <div className="bg-white border border-[#ebdcd0] p-6 lg:p-8 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#FAF6F0] rounded-tl-full pointer-events-none -z-10" />

                <div className="flex items-center gap-4">
                    <div className="bg-[#FAF6F0] border border-[#e5dcd3] p-3.5 rounded-xl text-[#a27b5c]">
                        <Coffee size={24} className="animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-[#26170f] tracking-tight flex items-center gap-2">
                            Quản lý Khuyến mãi
                            <Sparkles size={16} className="text-[#a27b5c]" />
                        </h4>
                        <p className="text-stone-500 text-sm mt-1">Cấu hình mã giảm giá, voucher chiết khấu cho khách hàng</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setErrorMsg('');
                        setCreateModalOpen(true);
                    }}
                    className="px-6 py-3.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#4a3728]/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
                >
                    <Plus size={18} className="stroke-[3]" /> Tạo Voucher
                </button>
            </div>

            <div className="bg-white border border-[#ebdcd0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-[#a27b5c] h-8 w-8" />
                    </div>
                ) : (
                    <VoucherTable data={vouchers} onRefresh={fetchData} />
                )}
            </div>

            {createModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-md w-full overflow-hidden shadow-2xl relative">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#a27b5c]" />

                        <div className="p-6 border-b border-[#f7f0e9] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Coffee className="text-[#a27b5c]" size={20} />
                                <h3 className="font-black text-lg text-[#26170f]">Thêm Voucher mới</h3>
                            </div>
                            <button
                                onClick={() => setCreateModalOpen(false)}
                                className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateVoucher} className="p-6 space-y-4 max-h-[480px] overflow-y-auto">
                            {errorMsg && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                    Mã Voucher (*)
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none text-sm uppercase"
                                    placeholder="Ví dụ: CAFE30, GIAM20K..."
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                        Loại giảm giá (*)
                                    </label>
                                    <select
                                        className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none text-sm appearance-none"
                                        value={discountType}
                                        onChange={(e) => setDiscountType(e.target.value)}
                                        required
                                    >
                                        <option value="PERCENT">Phần trăm (%)</option>
                                        <option value="AMOUNT">Tiền mặt (VND)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                        Giá trị giảm (*)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none text-sm"
                                        placeholder="Vd: 30 hoặc 20000..."
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                        Đơn hàng tối thiểu (*)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none text-sm"
                                        placeholder="Ví dụ: 50000..."
                                        value={minOrderValue}
                                        onChange={(e) => setMinOrderValue(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                        Giảm tối đa (Lẻ)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none text-sm"
                                        placeholder="Ví dụ: 30000..."
                                        value={maxDiscount}
                                        onChange={(e) => setMaxDiscount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                    Ngày hết hạn (*)
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none text-sm"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2 text-sm">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                                    Tạo Voucher
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

export default VoucherPage;