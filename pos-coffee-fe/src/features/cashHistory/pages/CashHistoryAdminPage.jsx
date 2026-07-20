import { useEffect, useState } from "react";
import cashHistoryApi from "../api/cashHistoryApi.js";
import { formatDateTime, formatCurrency } from "../utils/format.js";

export default function CashHistoryAdminPage() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await cashHistoryApi.listAll();
            setRecords(res.data || []);
        } catch (e) {
            console.error(e);
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black">Lịch sử đóng mở két</h1>
                <button
                    onClick={load}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-sm font-semibold"
                >
                    Tải lại
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-stone-100 text-stone-700">
                        <tr>
                            <th className="p-4 text-left">STT</th>
                            <th className="p-4 text-left">Nhân viên</th>
                            <th className="p-4 text-right">Tiền mở</th>
                            <th className="p-4 text-right">Tiền đóng</th>
                            <th className="p-4 text-right">Doanh thu</th>
                            <th className="p-4 text-left">Giờ mở</th>
                            <th className="p-4 text-left">Giờ đóng</th>
                            <th className="p-4 text-left">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="p-6 text-center text-stone-500">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : records.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-6 text-center text-stone-500">
                                    Chưa có lịch sử đóng mở két.
                                </td>
                            </tr>
                        ) : (
                            records.map((r, idx) => (
                                <tr key={r.id} className="border-t border-stone-100">
                                    <td className="p-4">{idx + 1}</td>
                                    <td className="p-4 font-medium">{r.username}</td>
                                    <td className="p-4 text-right text-green-700 font-semibold">
                                        {formatCurrency(r.openAmount)}
                                    </td>
                                    <td className="p-4 text-right text-green-700 font-semibold">
                                        {formatCurrency(r.closeAmount)}
                                    </td> 
                                    <td className="p-4 text-right text-green-700 font-semibold">
                                        {formatCurrency(r.closeAmount - r.openAmount)}
                                    </td>
                                    <td className="p-4">{formatDateTime(r.openTime)}</td>
                                    <td className="p-4">{formatDateTime(r.closeTime)}</td>
                                   
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                r.status === "OPEN"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-stone-200 text-stone-600"
                                            }`}
                                        >
                                            {r.status === "OPEN" ? "Đang mở" : "Đã đóng"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
