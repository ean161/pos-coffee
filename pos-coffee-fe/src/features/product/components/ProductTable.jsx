import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SquarePen, ToggleLeft, ToggleRight, FolderOpen, Layers, Eye } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";
import ProductDetailModal from "./ProductDetailModal";
import ProductVariantModal from "./ProductVariantModal";

const ProductTable = ({ data, onRefresh }) => {
    const navigate = useNavigate();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [variantModalOpen, setVariantModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const handleOpenDetail = (product) => {
        setSelectedProduct(product);
        setDetailModalOpen(true);
    };

    const handleOpenVariants = (product) => {
        setSelectedProduct(product);
        setVariantModalOpen(true);
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await axiosClient.patch(`/products/${id}/status?status=${!currentStatus}`);
            onRefresh();
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[#a27b5c] bg-white rounded-2xl p-8 text-center animate-fade-in">
                <FolderOpen size={48} className="mb-4 text-stone-200" />
                <p className="text-base font-bold text-[#26170f]">Chưa có sản phẩm nào</p>
                <p className="text-xs text-stone-400 mt-1">Bấm nút "Thêm sản phẩm" phía trên để bắt đầu</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                <tr className="bg-[#FAF6F0]/60 border-b border-[#ebdcd0] text-[11px] text-[#a27b5c] uppercase font-bold tracking-widest">
                    <th className="px-8 py-5">Tên sản phẩm</th>
                    <th className="px-6 py-5">Giá cơ bản</th>
                    <th className="px-6 py-5">Kích thước (Size)</th>
                    <th className="px-6 py-5">Trạng thái</th>
                    <th className="px-8 py-5 text-right">Tùy chọn</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-[#f7f0e9]">
                {data.map((item) => (
                    <tr
                        key={item.productId}
                        className="group hover:bg-[#fcf8f2] transition-all duration-300 hover:translate-x-1.5"
                    >
                        <td className="px-8 py-5">
                                <span
                                    onClick={() => handleOpenDetail(item)}
                                    className="font-bold text-[#26170f] text-base hover:text-[#a27b5c] transition-colors cursor-pointer"
                                >
                                    {item.name}
                                </span>
                        </td>
                        <td className="px-6 py-5">
                                <span className="font-semibold text-stone-600">
                                    {formatCurrency(item.basePrice)}
                                </span>
                        </td>
                        <td className="px-6 py-5">
                            <button
                                onClick={() => handleOpenVariants(item)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#a27b5c] bg-[#a27b5c]/10 border border-[#a27b5c]/20 hover:bg-[#4a3728] hover:text-white transition-all duration-300"
                            >
                                <Layers size={14} />
                                Cấu hình Size
                            </button>
                        </td>
                        <td className="px-6 py-5">
                            <button
                                onClick={() => toggleStatus(item.productId, item.status)}
                                className="flex items-center gap-2 group/toggle focus:outline-none"
                            >
                                {item.status ? (
                                    <ToggleRight size={30} className="text-[#a27b5c]" />
                                ) : (
                                    <ToggleLeft size={30} className="text-stone-300" />
                                )}
                                <span className={`text-xs font-bold ${item.status ? "text-[#a27b5c]" : "text-stone-400"}`}>
                                        {item.status ? "Đang bán" : "Tạm ẩn"}
                                    </span>
                            </button>
                        </td>
                        <td className="px-8 py-5 text-right flex justify-end gap-2">
                            <button
                                onClick={() => handleOpenDetail(item)}
                                className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-stone-400 bg-stone-50 border border-stone-200 hover:bg-stone-100 hover:text-stone-700 transition-all duration-300"
                                title="Xem chi tiết"
                            >
                                <Eye size={17} />
                            </button>
                            <button
                                onClick={() => navigate(`/products/edit/${item.productId}`)}
                                className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-[#a27b5c] bg-[#fbf9f7] border border-[#ebdcd0] hover:bg-[#4a3728] hover:text-white hover:border-[#4a3728] active:scale-90 transition-all duration-300 shadow-sm"
                                title="Sửa sản phẩm"
                            >
                                <SquarePen size={17} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <ProductDetailModal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                product={selectedProduct}
                onEdit={(id) => navigate(`/products/edit/${id}`)}
            />

            <ProductVariantModal
                isOpen={variantModalOpen}
                onClose={() => setVariantModalOpen(false)}
                product={selectedProduct}
            />
        </div>
    );
};

export default ProductTable;