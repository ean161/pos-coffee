import { useState, useEffect } from 'react';
import { Coffee, X, Loader2 } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";

const ProductDetailModal = ({ isOpen, onClose, product, onEdit }) => {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !product?.productId) return;

        const fetchVariants = async () => {
            setLoading(true);
            try {
                const res = await axiosClient.get(`/products/${product.productId}/variants`);
                setVariants(res.data || []);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVariants();
    }, [isOpen, product]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-lg w-full overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#a27b5c] to-[#26170f]" />

                <div className="p-6 border-b border-[#f7f0e9] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Coffee className="text-[#a27b5c]" size={20} />
                        <h3 className="font-black text-lg text-[#26170f]">Chi tiết sản phẩm</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#efe6dc]">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Tên món</span>
                            <span className="font-extrabold text-[#26170f] text-base mt-1 block">{product.name}</span>
                        </div>
                        <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#efe6dc]">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Giá cơ bản</span>
                            <span className="font-extrabold text-[#a27b5c] text-base mt-1 block">{formatCurrency(product.basePrice)}</span>
                        </div>
                        <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#efe6dc]">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Danh mục liên kết</span>
                            <span className="font-bold text-[#26170f] mt-1 block text-sm">{product.categoryName}</span>
                        </div>
                        <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#efe6dc]">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Trạng thái</span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold mt-2 border ${
                                product.status
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-stone-100 text-stone-500 border-stone-200"
                            }`}>
                                {product.status ? "Đang phục vụ" : "Tạm ngưng"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-black text-[#a27b5c] uppercase tracking-widest">Các size hiện có</h4>
                        {loading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="animate-spin text-[#a27b5c]" size={20} />
                            </div>
                        ) : variants.length === 0 ? (
                            <div className="text-center py-4 bg-stone-50 rounded-xl text-stone-400 text-xs">
                                Món này chưa thiết lập các size riêng (Bán theo giá mặc định).
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {variants.map((v, index) => (
                                    <div key={v.id || index} className="flex justify-between items-center bg-white border border-[#efe6dc] p-3 rounded-xl">
                                        <span className="font-bold text-stone-600 text-xs">Size: {v.sizeName}</span>
                                        <span className="text-stone-800 font-extrabold text-xs">
                                            {formatCurrency(product.basePrice + v.priceAdjustment)}
                                            <span className="text-[9px] text-[#a27b5c] ml-1 block font-normal text-right">
                                                (+{formatCurrency(v.priceAdjustment)})
                                            </span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-[#FAF6F0] border-t border-[#f7f0e9] flex justify-end gap-2">
                    <button
                        onClick={() => {
                            onClose();
                            onEdit(product.productId);
                        }}
                        className="px-4 py-2 bg-[#a27b5c] text-white rounded-lg text-xs font-bold hover:bg-[#8c5a86]"
                    >
                        Chỉnh sửa thông tin
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg text-xs font-bold hover:bg-stone-300"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;