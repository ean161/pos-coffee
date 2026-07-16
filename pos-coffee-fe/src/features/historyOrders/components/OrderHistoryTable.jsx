import OrderRow from "./OrderRow";
import axiosClient from "../../../shared/axios/axiosClient.js";
import { useEffect, useState } from "react";



export default function OrderHistoryTable(){



    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axiosClient.get("/orders/history");
            setOrders(res.data);
        } catch (error) {
            console.error("Lỗi lấy lịch sử đơn hàng:", error);
        }
    };
    return(

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            <table className="w-full">

                <thead className="bg-stone-100 text-stone-700">

                <tr>

                    <th className="p-4 text-left">Mã HD</th>




                    <th className="p-4 text-left">Tổng tiền</th>

                    <th className="p-4 text-left">Thời gian</th>

                    <th></th>

                </tr>

                </thead>

                <tbody>

                {orders.map(order=>

                    <OrderRow
                        key={order.id}
                        order={order}
                    />

                )}

                </tbody>

            </table>

        </div>

    )

}