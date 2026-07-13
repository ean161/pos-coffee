import { useState, useEffect } from "react";
import { X, Plus, Loader2, Trash2, Edit2, Check } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";
import ConfirmModal from "../../../shared/components/ConfirmModal.jsx";

const ProductVariantModal = ({ isOpen, onClose, product }) => {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sizeName, setSizeName] = useState("");
    const [priceAdjustment, setPriceAdjustment] = useState("");
    const [adding, setAdding] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [editSizeName, setEditSizeName] = useState("");
    const [editPriceAdjustment, setEditPriceAdjustment] = useState("");
    const [savingId, setSavingId] = useState(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [variantIdToDelete, setVariantIdToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        if (isOpen && product?.productId) {
            fetchVariants();
        }
    }, [isOpen, product]);

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

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!sizeName || !priceAdjustment || parseFloat(priceAdjustment) < 0) return;
        setAdding(true);
        try {
            await axiosClient.post(`/products/${product.productId}/variants`, {
                sizeName,
                priceAdjustment: parseFloat(priceAdjustment)
            });
            setSizeName("");
            setPriceAdjustment("");
            fetchVariants();
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setAdding(false);
        }
    };

    const triggerDeleteVariant = (variantId) => {
        setVariantIdToDelete(variantId);
        setDeleteError("");
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axiosClient.delete(`/products/variants/${variantIdToDelete}`);
            setDeleteModalOpen(false);
            setVariantIdToDelete(null);
            fetchVariants();
        } catch (error) {
            setDeleteError("Không thể xóa kích thước này. Vui lòng thử lại!");
            console.error("Lỗi:", error);
        }
    };

    const startEdit = (v) => {
        const vId = v.variantId || v.id;
        setEditingId(vId);
        setEditSizeName(v.sizeName);
        setEditPriceAdjustment(v.priceAdjustment);
    };

    const handleUpdate = async (variantId) => {
        if (!editSizeName || !editPriceAdjustment || parseFloat(editPriceAdjustment) < 0) return;
        setSavingId(variantId);
        try {
            await axiosClient.put(`/products/variants/${variantId}`, {
                sizeName: editSizeName,
                priceAdjustment: parseFloat(editPriceAdjustment)
            });
            setEditingId(null);
            fetchVariants();
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setSavingId(null);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-lg w-full overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#a27b5c]" />

                <div className="p-6 border-b border-[#f7f0e9] flex justify-between items-center">
                    <div>
                        <h3 className="font-black text-lg text-[#26170f]">{product.name}</h3>
                        <p className="text-xs text-stone-400">Danh sách các kích thước và chênh lệch giá</p>
                    </div>
                    <button
                        onClick={() => {
                            onClose();
                            setEditingId(null);
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-6">
                            <Loader2 className="animate-spin text-[#a27b5c]" size={24} />
                        </div>
                    ) : variants.length === 0 ? (
                        <p className="text-sm text-center text-stone-400 py-4">Chưa có biến thể kích thước nào.</p>
                    ) : (
                        <div className="space-y-2">
                            {variants.map((v, index) => {
                                const vId = v.variantId || v.id;
                                return (
                                    <div key={vId || index} className="flex justify-between items-center bg-[#FAF6F0] p-3 rounded-xl border border-[#efe6dc]">
                                        {editingId === vId ? (
                                            <div className="flex items-center gap-2 flex-1 mr-2">
                                                <input
                                                    type="text"
                                                    className="w-20 bg-white border border-[#ebdcd0] p-1.5 rounded-lg text-xs font-bold"
                                                    value={editSizeName}
                                                    onChange={(e) => setEditSizeName(e.target.value)}
                                                />
                                                <div className="flex flex-col">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className={`w-24 bg-white border ${parseFloat(editPriceAdjustment) < 0 ? 'border-red-500' : 'border-[#ebdcd0]'} p-1.5 rounded-lg text-xs font-bold`}
                                                        value={editPriceAdjustment}
                                                        onChange={(e) => setEditPriceAdjustment(e.target.value)}
                                                    />
                                                    {parseFloat(editPriceAdjustment) < 0 && (
                                                        <span className="text-[10px] text-red-500 font-bold block mt-0.5">Không được âm</span>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center flex-1 mr-4">
                                                <span className="font-bold text-[#26170f] text-sm">Size: {v.sizeName}</span>
                                                <span className="text-[#a27b5c] font-bold text-sm">+{formatCurrency(v.priceAdjustment)}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {editingId === vId ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdate(vId)}
                                                        disabled={savingId === vId || parseFloat(editPriceAdjustment) < 0}
                                                        className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                                    >
                                                        {savingId === vId ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="p-1.5 bg-stone-100 text-stone-500 rounded-lg hover:bg-stone-200 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(v)}
                                                        className="p-1.5 bg-white text-stone-600 border border-[#ebdcd0] rounded-lg hover:bg-stone-50 transition-colors"
                                                    >
                                                        <Edit2 size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => triggerDeleteVariant(vId)}
                                                        className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <form onSubmit={handleAdd} className="border-t border-[#f7f0e9] pt-4 space-y-4">
                        <h4 className="text-xs font-bold text-[#a27b5c] uppercase tracking-wider">Thêm kích thước mới</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input
                                    type="text"
                                    className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-2.5 rounded-xl text-stone-850 font-bold focus:border-[#a27b5c] outline-none text-xs"
                                    placeholder="Tên Size (Vd: M, L)"
                                    value={sizeName}
                                    onChange={(e) => setSizeName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <input
                                    type="number"
                                    min="0"
                                    className={`w-full bg-[#FAF6F0]/40 border ${parseFloat(priceAdjustment) < 0 ? 'border-red-500' : 'border-[#ebdcd0]'} p-2.5 rounded-xl text-stone-850 font-bold focus:border-[#a27b5c] outline-none text-xs`}
                                    placeholder="Bù giá (Vd: 5000)"
                                    value={priceAdjustment}
                                    onChange={(e) => setPriceAdjustment(e.target.value)}
                                    required
                                />
                                {parseFloat(priceAdjustment) < 0 && (
                                    <span className="text-[10px] text-red-500 font-bold block mt-1">Không được âm</span>
                                )}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={adding || parseFloat(priceAdjustment) < 0}
                            className="w-full py-2.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all disabled:opacity-50"
                        >
                            {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                            Thêm Size
                        </button>
                    </form>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa kích thước này khỏi sản phẩm?"
                error={deleteError}
            />
        </div>
    );
};

export default ProductVariantModal;