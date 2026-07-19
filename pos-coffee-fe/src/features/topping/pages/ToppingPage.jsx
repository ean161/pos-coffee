import { useState, useEffect } from 'react';
import { Coffee, Plus, Sparkles, Loader2 } from 'lucide-react';
import axiosClient from "../../../shared/axios/axiosClient.js";
import ToppingTable from "../components/ToppingTable";
import ToppingModal from "../components/ToppingModal";

const ToppingPage = () => {
    const [toppings, setToppings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);


    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/toppings`);
            setToppings(res.data.content || []);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                            Quản lý Toppings
                            <Sparkles size={16} className="text-[#a27b5c]" />
                        </h4>
                        <p className="text-stone-500 text-sm mt-1">Quản lý các loại topping thêm vào trà sữa, cà phê và món phụ</p>
                    </div>
                </div>

                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="px-6 py-3.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#4a3728]/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
                >
                    <Plus size={18} className="stroke-[3]" /> Thêm Topping
                </button>
            </div>

            <div className="bg-white border border-[#ebdcd0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-[#a27b5c] h-8 w-8" />
                    </div>
                ) : (
                    <ToppingTable data={toppings} onRefresh={fetchData} />
                )}
            </div>

            <ToppingModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onRefresh={fetchData}
            />
        </div>
    );
};

export default ToppingPage;