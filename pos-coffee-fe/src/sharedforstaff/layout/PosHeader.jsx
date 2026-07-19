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
                                      setSelectedCategory,
                                      shiftOpened,
                                      onOpenShift,
                                      onCloseShift
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
                    Lịch sử
                </button>
                {!shiftOpened ? (
                    <button
                        onClick={onOpenShift}
                        className="px-5 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700"
                    >
                        Mở ca
                    </button>
                ) : (
                    <button
                        onClick={onCloseShift}
                        className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700"
                    >
                        Kết ca
                    </button>
                )}

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
                    disabled={!shiftOpened}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                        shiftOpened
                            ? "Tìm kiếm sản phẩm..."
                            : "Hãy mở ca để bắt đầu bán hàng"
                    }
                    className={`w-full pl-11 pr-4 py-3 rounded-2xl border
        ${
                        shiftOpened
                            ? "bg-stone-100 border-stone-200 text-black"
                            : "bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed"
                    }`}
                />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">

                <button
                    disabled={!shiftOpened}
                    onClick={() => setSelectedCategory("ALL")}
                    className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap
        ${
                        !shiftOpened
                            ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                            : selectedCategory === "ALL"
                                ? "bg-[#4a3728] text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                >
                    Tất cả
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.categoryId}
                        disabled={!shiftOpened}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap
            ${
                            !shiftOpened
                                ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                                : selectedCategory === cat.name
                                    ? "bg-[#4a3728] text-white"
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