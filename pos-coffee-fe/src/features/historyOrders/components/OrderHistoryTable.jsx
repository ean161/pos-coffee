import OrderRow from "./OrderRow";
import axiosClient from "../../../shared/axios/axiosClient.js";
import { useEffect, useState } from "react";



export default function OrderHistoryTable(){


    //------------detail------//
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
//------------detail------//
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

    //------------detail------//
    const handleView = async (id) => {
        try {
            const res = await axiosClient.get(`/orders/${id}`);
            setSelectedOrder(res.data);
            setIsOpen(true);
        } catch (error) {
            console.error(error);
        }
    };
//------------detail------//
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
                        onView={handleView}
                    />

                )}

                </tbody>

            </table>
            {isOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-[500px]">
                        <h2 className="text-xl font-bold mb-4 text-black">Chi tiết hóa đơn</h2>

                        <p className="text-xl  mb-4 text-black">Mã hóa đơn: {selectedOrder.invoiceNumber}</p>
                        <p className="text-xl  mb-4 text-black">Ngày tạo: {new Date(selectedOrder.orderDate).toLocaleString("vi-VN")}</p>
                        <p className="text-xl  mb-4 text-black">Tổng tiền: {selectedOrder.totalAmount}</p>
                        <p className="text-xl  mb-4 text-black">Giảm giá: {selectedOrder.discountAmount}</p>
                        <p className="text-xl  mb-4 text-black">Thành tiền: {selectedOrder.finalAmount}</p>
                        <p className="text-xl  mb-4 text-black">Thanh toán: {selectedOrder.paymentMethod}</p>

                        <button
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                            onClick={() => setIsOpen(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>

    )

}