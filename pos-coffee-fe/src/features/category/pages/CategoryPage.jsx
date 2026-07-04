import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Plus } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";
import CategoryTable from "../components/CategoryTable";
import { useState, useEffect } from 'react';

const CategoryPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await axiosClient.get(`/categories`);
            setCategories(res.data.content || []);
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto space-y-6 max-w-7xl mx-auto">
            {/* Header: Hiệu ứng chuyển màu hạt cà phê mượt mà */}
            <div className="bg-white border border-[#efe6dc] p-6 lg:p-8 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#FAF6F0] rounded-tl-full pointer-events-none -z-10" />

                <div className="flex items-center gap-4">
                    <div className="bg-[#FAF6F0] border border-[#e5dcd3] p-3.5 rounded-xl text-[#a27b5c] transition-transform duration-500 hover:scale-105">
                        <LayoutGrid size={24} className="animate-spin-slow" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-[#25160F] tracking-tight flex items-center gap-2">
                            Quản lý danh mục
                        </h4>
                        <p className="text-stone-500 text-sm mt-1">Sắp xếp các món trong menu theo nhóm chuyên nghiệp</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/categories/create')}
                    className="px-6 py-3.5 bg-[#a27b5c] hover:bg-[#866347] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#a27b5c]/25 hover:shadow-[#a27b5c]/45 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
                >
                    <Plus size={18} className="stroke-[3]" /> Thêm danh mục
                </button>
            </div>

            {/* Container bảng có viền mịn và đổ bóng sâu */}
            <div className="bg-white border border-[#efe6dc] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <CategoryTable data={categories} onRefresh={fetchData} />
            </div>
        </div>
    );
};

export default CategoryPage;