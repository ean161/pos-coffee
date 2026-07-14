import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import OrderHistoryFilter from "../components/OrderHistoryFilter";
import OrderHistoryTable from "../components/OrderHistoryTable";

export default function HistoryOrderFormPage() {

    const navigate = useNavigate();

    return (

        <div className="space-y-6">

            <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => navigate("/pos")}
                        className="p-2 rounded-full hover:bg-stone-100"
                    >
                        <ArrowLeft />
                    </button>

                    <h1 className="text-3xl font-black">
                        Lịch sử bán hàng
                    </h1>

                </div>



            </div>

            <OrderHistoryFilter />

            <OrderHistoryTable />

        </div>

    );

}