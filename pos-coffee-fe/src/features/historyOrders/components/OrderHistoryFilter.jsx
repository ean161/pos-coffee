import { Search } from "lucide-react";

export default function OrderHistoryFilter() {

    return (

        <div className="bg-white rounded-2xl shadow-sm p-5">

            <div className="relative">

                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                />

                <input
                    placeholder="Tìm mã hóa đơn..."
                    className="w-full h-12 pl-12 rounded-full text-stone-700 bg-stone-100 outline-none"
                />

            </div>

        </div>

    );

}