import { Coffee, X } from 'lucide-react';

const SurchargeDetailModal = ({ isOpen, onClose, surcharge }) => {
    const formatValue = (item) => {
        if (!item) return "";
        if (item.surchargeType === 'PERCENT') {
            return `${item.value}%`;
        }
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.value);
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

    if (!isOpen || !surcharge) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-md w-full overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#a27b5c] to-[#4a3728]" />

                <div className="p-6 border-b border-[#f7f0e9] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Coffee className="text-[#a27b5c]" size={20} />
                        <h3 className="font-black text-lg text-[#26170f]">Chi tiết phụ thu</h3>
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
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Tên phụ thu</span>
                            <span className="font-extrabold text-[#26170f] text-sm">{surcharge.name}</span>
                        </div>
                        <hr className="border-[#ebdcd0]/60" />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Loại áp dụng</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                surcharge.surchargeType === 'PERCENT'
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-orange-50 text-orange-700 border-orange-200"
                            }`}>
                                {surcharge.surchargeType === 'PERCENT' ? 'Phần trăm' : 'Số tiền mặt'}
                            </span>
                        </div>
                        <hr className="border-[#ebdcd0]/60" />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Mức phụ thu</span>
                            <span className="font-extrabold text-[#a27b5c] text-sm">{formatValue(surcharge)}</span>
                        </div>
                        <hr className="border-[#ebdcd0]/60" />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Bắt đầu</span>
                            <span className="font-bold text-stone-600 text-xs">{formatDate(surcharge.startTime)}</span>
                        </div>
                        <hr className="border-[#ebdcd0]/60" />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Kết thúc</span>
                            <span className="font-bold text-stone-600 text-xs">{formatDate(surcharge.endTime)}</span>
                        </div>
                        <hr className="border-[#ebdcd0]/60" />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Trạng thái kích hoạt</span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                surcharge.status
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-stone-100 text-stone-500 border-stone-200"
                            }`}>
                                {surcharge.status ? "Đang hiệu lực" : "Tạm khóa"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-[#FAF6F0] border-t border-[#f7f0e9] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-300"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurchargeDetailModal;