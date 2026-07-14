import {
    Coffee,
    Search,
    UtensilsCrossed,
    History as HistoryIcon
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function PosHeader({
                                      searchQuery,
                                      setSearchQuery,
                                      categories,
                                      selectedCategory,
                                      setSelectedCategory
                                  }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white border-b border-stone-200 px-6 py-4">
            <div className="flex items-center gap-4 mb-4">

                <h1 className="text-2xl font-black text-[#26170f] flex items-center gap-2">
                    <Coffee size={28} className="text-[#a27b5c]" />
                    POS Coffee
                </h1>

                <button
                    onClick={() => navigate("/staff/sales-history")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4a3728] text-white hover:bg-[#26170f]"
                >
                    <HistoryIcon size={18}/>
                    Lịch sử bán hàng
                </button>

                <div className="ml-auto flex items-center gap-2 text-black text-stone-500">
                    <UtensilsCrossed size={14}/>
                    <span>Bán hàng</span>
                </div>

            </div>

            <div className="relative mb-4">
                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                />

                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl text-black bg-stone-100 border border-stone-200"
                />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">

                <button
                    onClick={() => setSelectedCategory("ALL")}
                    className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                        selectedCategory === "ALL"
                            ? "bg-[#4a3728] text-white shadow-lg"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                >
                    Tất cả
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.categoryId}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                            selectedCategory === cat.name
                                ? "bg-[#4a3728] text-white shadow-lg"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}

            </div>
        </div>
    );
}