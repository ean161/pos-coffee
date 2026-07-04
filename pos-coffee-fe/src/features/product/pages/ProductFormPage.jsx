import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ArrowLeft, Coffee } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";

const ProductFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [name, setName] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosClient.get('/categories');
                setCategories(res.data.content || []);
            } catch (error) {
                console.error("Lỗi:", error);
            }
        };

        fetchCategories();

        if (!isEditMode) return;

        const fetchProduct = async () => {
            try {
                const res = await axiosClient.get(`/products/${id}`);
                setName(res.data.name);
                setBasePrice(res.data.basePrice);
                setCategoryId(res.data.categoryId);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, isEditMode]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const requestPayload = {
                name,
                basePrice: parseFloat(basePrice),
                categoryId
            };

            if (isEditMode) {
                await axiosClient.put(`/products/${id}`, requestPayload);
            } else {
                await axiosClient.post("/products", requestPayload);
            }
            navigate('/products');
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
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
                onClick={() => navigate('/products')}
                className="group flex items-center gap-2 px-4.5 py-2.5 bg-white border border-[#ebdcd0] rounded-xl text-xs font-bold text-[#a27b5c] hover:text-[#25160F] hover:bg-[#FAF6F0]/50 transition-all duration-300 mb-8 shadow-sm"
            >
                <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
                Quay lại danh sách
            </button>

            <div className="relative p-8 bg-white rounded-2xl border border-[#ebdcd0] shadow-xl shadow-stone-200/40 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#a27b5c] via-[#ebdcd0] to-[#26170f]" />

                <div className="flex items-center gap-2.5 mb-7">
                    <Coffee size={18} className="text-[#a27b5c]" />
                    <h1 className="text-xl font-black text-[#25160F] tracking-tight">
                        {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h1>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                            Tên sản phẩm (*)
                        </label>
                        <input
                            type="text"
                            className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-4 rounded-xl text-[#25160F] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] focus:bg-white outline-none transition-all placeholder:text-stone-300 text-sm"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ví dụ: Cà phê pha máy, Trà sữa..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                            Danh mục (*)
                        </label>
                        <select
                            className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-4 rounded-xl text-[#25160F] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] focus:bg-white outline-none transition-all text-sm appearance-none"
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">-- Chọn danh mục sản phẩm --</option>
                            {categories.map((cat) => (
                                <option key={cat.categoryId} value={cat.categoryId}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                            Giá cơ bản (VND) (*)
                        </label>
                        <input
                            type="number"
                            className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-4 rounded-xl text-[#25160F] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] focus:bg-white outline-none transition-all placeholder:text-stone-300 text-sm"
                            value={basePrice}
                            onChange={e => setBasePrice(e.target.value)}
                            placeholder="Ví dụ: 29000, 45000..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-[#4a3728]/20 active:scale-98 transition-all duration-350 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Đang lưu...</span>
                            </>
                        ) : (
                            <span>Lưu thông tin</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductFormPage;