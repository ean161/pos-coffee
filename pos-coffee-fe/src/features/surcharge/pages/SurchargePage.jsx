import { useState, useEffect } from 'react';
import { Coffee, Plus, Sparkles, Loader2, X } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import SurchargeTable from "../components/SurchargeTable";

const SurchargePage = () => {
    const [surcharges, setSurcharges] = useState([]);
    const [loading, setLoading] = useState(true);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [surchargeType, setSurchargeType] = useState('AMOUNT');
    const [value, setValue] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/surcharges`);
            setSurcharges(res.data.content || []);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSurcharge = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axiosClient.post("/surcharges", {
                name,
                surchargeType,
                value: parseFloat(value),
                startTime,
                endTime
            });
            setName('');
            setSurchargeType('AMOUNT');
            setValue('');
            setStartTime('');
            setEndTime('');
            setCreateModalOpen(false);
            fetchData();
        } catch (error) {
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
                            Quản lý Phụ thu
                            <Sparkles size={16} className="text-[#a27b5c]" />
                        </h4>
                        <p className="text-stone-500 text-sm mt-1">Cấu hình các khoản phụ thu ngày lễ, ngày nghỉ hoặc ngoài giờ</p>
                    </div>
                </div>

                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="px-6 py-3.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#4a3728]/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
                >
                    <Plus size={18} className="stroke-[3]" /> Thêm Phụ thu
                </button>
            </div>

            <div className="bg-white border border-[#ebdcd0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-[#a27b5c] h-8 w-8" />
                    </div>
                ) : (
                    <SurchargeTable data={surcharges} onRefresh={fetchData} />
                )}
            </div>

            {createModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-md w-full overflow-hidden shadow-2xl relative">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#a27b5c]" />

                        <div className="p-6 border-b border-[#f7f0e9] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Coffee className="text-[#a27b5c]" size={20} />
                                <h3 className="font-black text-lg text-[#26170f]">Thêm phụ thu mới</h3>
                            </div>
                            <button
                                onClick={() => setCreateModalOpen(false)}
                                className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSurcharge} className="p-6 space-y-4 max-h-[450px] overflow-y-auto">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                    Tên phụ thu (*)
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none text-sm"
                                    placeholder="Ví dụ: Phụ thu Tết Nguyên Đán..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                        Loại phụ thu (*)
                                    </label>
                                    <select
                                        className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none text-sm appearance-none"
                                        value={surchargeType}
                                        onChange={(e) => setSurchargeType(e.target.value)}
                                        required
                                    >
                                        <option value="AMOUNT">Tiền mặt (VND)</option>
                                        <option value="PERCENT">Phần trăm (%)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                        Giá trị (*)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none text-sm"
                                        placeholder="Vd: 10000 hoặc 10..."
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                    Thời gian bắt đầu (*)
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none text-sm"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                    Thời gian kết thúc (*)
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none text-sm"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
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
                                    Tạo phụ thu
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

export default SurchargePage;