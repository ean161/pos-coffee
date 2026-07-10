import { useState, useEffect } from "react";
import { X, ArrowUpRight, ArrowDownLeft, Calendar, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

const InventoryLogDrawer = ({ isOpen, onClose, stockItem }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (isOpen && stockItem?.id) {
            const fetchLogs = async () => {
                setLoading(true);
                try {
                    String;
                    const res = await axiosClient.get(`/admin/inventory/${stockItem.id}/logs`, {
                        params: { page, size: 8 }
                    });
                    setLogs(res.data.content || []);
                    setTotalPages(res.data.totalPages || 0);
                } catch (error) {
                    console.error("Lỗi lấy nhật ký kho:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchLogs();
        }
    }, [isOpen, stockItem, page]);

    useEffect(() => { setPage(0); }, [stockItem]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
                <div className="w-screen max-w-md bg-white border-l border-[#ebdcd0] shadow-2xl flex flex-col h-full animate-slide-in-right">

                    <div className="p-6 border-b border-[#f7f0e9] flex items-center justify-between bg-[#FAF6F0]">
                        <div>
                            <span className="text-[10px] text-[#a27b5c] font-black uppercase tracking-widest block">Thẻ Kho Lịch Sử</span>
                            <h3 className="text-base font-black text-[#26170f]">{stockItem?.itemName}</h3>
                        </div>
                        <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1.5 rounded-xl hover:bg-stone-200/50 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {loading ? (
                            <div className="h-40 flex items-center justify-center text-stone-400 gap-2 font-medium text-sm">
                                <Loader2 size={18} className="animate-spin text-[#a27b5c]" /> Đang tải lịch sử...
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="text-center py-12 text-stone-400 text-sm font-medium">
                                Chưa có lịch sử nhập xuất nào cho mặt hàng này.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {logs.map((log) => {
                                    const isImport = log.logType === "IMPORT";
                                    return (
                                        <div key={log.id} className="p-4 rounded-xl border border-[#ebdcd0] bg-white flex items-start gap-3 shadow-2xs">
                                            <div className={`p-2 rounded-lg ${isImport ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                {isImport ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-baseline">
                                                    <span className={`text-xs font-black uppercase tracking-wider ${isImport ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {isImport ? "Nhập kho" : "Xuất hủy"}
                                                    </span>
                                                    <span className="text-sm font-black text-stone-800">
                                                        {isImport ? "+" : "-"}{log.quantity} {stockItem?.unit}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-bold text-[#4a3728]">{log.reason || "Không có ghi chú"}</p>
                                                <div className="flex items-center gap-1 text-[10px] text-stone-400 font-semibold">
                                                    <Calendar size={11} />
                                                    {new Date(log.createdAt).toLocaleString('vi-VN')}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="p-4 border-t border-[#f7f0e9] flex items-center justify-between bg-[#FAF6F0]/40 text-xs font-bold text-stone-600">
                            <span>Trang {page + 1} / {totalPages}</span>
                            <div className="flex gap-1">
                                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-[#ebdcd0] bg-white hover:bg-stone-50 disabled:opacity-40"><ChevronLeft size={14} /></button>
                                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-[#ebdcd0] bg-white hover:bg-stone-50 disabled:opacity-40"><ChevronRight size={14} /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryLogDrawer;