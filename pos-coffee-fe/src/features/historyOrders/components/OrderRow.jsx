import { Eye } from "lucide-react";

export default function OrderRow({order}){

    return(

        <tr className="border-b hover:bg-stone-50">

            <td className="p-4 text-stone-700">{order.invoiceNumber}</td>
            


            <td className="p-4 text-stone-700">
                {order.finalAmount
                    ? order.finalAmount.toLocaleString("vi-VN")
                    : 0} đ
            </td>

            <td className="p-4 text-stone-700">
                {new Date(order.orderDate).toLocaleString("vi-VN")}
            </td>

            <td className="p-4 text-stone-700">

                <button className="p-2 rounded-lg hover:bg-stone-200">

                    <Eye size={18}/>

                </button>

            </td>

        </tr>

    )

}