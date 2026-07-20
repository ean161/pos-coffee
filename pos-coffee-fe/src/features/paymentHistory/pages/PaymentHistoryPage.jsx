import { useEffect, useState } from "react";
import { CreditCard, Loader2, Search } from "lucide-react";
import { getPaymentHistory } from "../api/paymentHistoryApi.js";

const PAYMENT_LABELS = {
    CASH: "Tiền mặt",
    TRANSFER: "Chuyển khoản",
    MOMO: "MoMo",
    QR_CODE: "QR Code",
};

const formatMoney = (value) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(Number(value || 0));

export default function PaymentHistoryPage() {
    const [filters, setFilters] = useState({
        keyword: "",
        paymentMethod: "",
        fromDate: "",
        toDate: "",
    });
    const [query, setQuery] = useState(filters);
    const [page, setPage] = useState(0);
    const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadPayments = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getPaymentHistory({
                    ...query,
                    page,
                    size: 15,
                    sort: "orderDate,desc",
                });
                if (!cancelled) setData(response.data);
            } catch (requestError) {
                if (!cancelled) {
                    setError(requestError?.message || "Không thể tải lịch sử thanh toán.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadPayments();
        return () => { cancelled = true; };
    }, [page, query]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setPage(0);
        setQuery(filters);
    };

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-black text-stone-900">Lịch sử thanh toán</h1>
                <p className="mt-1 text-sm text-stone-500">
                    Theo dõi toàn bộ giao dịch đã ghi nhận từ POS.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-4 grid gap-3 md:grid-cols-5 shadow-sm">
                <label className="relative md:col-span-2">
                    <Search size={17} className="absolute left-3 top-3 text-stone-400" />
                    <input
                        value={filters.keyword}
                        onChange={(event) => setFilters({ ...filters, keyword: event.target.value })}
                        placeholder="Mã hóa đơn hoặc nhân viên"
                        className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-3 text-sm text-stone-800 outline-none focus:border-[#a27b5c]"
                    />
                </label>
                <select
                    value={filters.paymentMethod}
                    onChange={(event) => setFilters({ ...filters, paymentMethod: event.target.value })}
                    className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-[#a27b5c]"
                >
                    <option value="">Tất cả phương thức</option>
                    {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(event) => setFilters({ ...filters, fromDate: event.target.value })}
                    className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-[#a27b5c]"
                    title="Từ ngày"
                />
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={filters.toDate}
                        onChange={(event) => setFilters({ ...filters, toDate: event.target.value })}
                        className="min-w-0 flex-1 rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-[#a27b5c]"
                        title="Đến ngày"
                    />
                    <button className="rounded-xl bg-[#4a3728] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#26170f]">
                        Lọc
                    </button>
                </div>
            </form>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 border-b border-stone-100 px-5 py-4">
                    <CreditCard size={19} className="text-[#a27b5c]" />
                    <span className="font-bold text-stone-800">{data.totalElements} giao dịch</span>
                </div>

                {error ? (
                    <p role="alert" className="p-8 text-center text-red-600">{error}</p>
                ) : loading ? (
                    <div className="flex items-center justify-center gap-2 p-12 text-stone-500">
                        <Loader2 size={22} className="animate-spin" /> Đang tải...
                    </div>
                ) : data.content.length === 0 ? (
                    <p className="p-12 text-center text-stone-500">Chưa có giao dịch phù hợp.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-sm">
                            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                                <tr>
                                    <th className="px-5 py-3">Mã hóa đơn</th>
                                    <th className="px-5 py-3">Nhân viên</th>
                                    <th className="px-5 py-3">Thời gian</th>
                                    <th className="px-5 py-3">Phương thức</th>
                                    <th className="px-5 py-3 text-right">Tổng tiền</th>
                                    <th className="px-5 py-3 text-right">Giảm giá</th>
                                    <th className="px-5 py-3 text-right">Thực thu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {data.content.map((payment) => (
                                    <tr key={payment.orderId} className="hover:bg-[#fbf8f4]">
                                        <td className="px-5 py-4 font-bold text-stone-800">{payment.invoiceNumber}</td>
                                        <td className="px-5 py-4 text-stone-600">{payment.staffName}</td>
                                        <td className="px-5 py-4 text-stone-600">{new Date(payment.orderDate).toLocaleString("vi-VN")}</td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-[#efe6dc] px-2.5 py-1 text-xs font-bold text-[#4a3728]">
                                                {PAYMENT_LABELS[payment.paymentMethod] || payment.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right text-stone-600">{formatMoney(payment.totalAmount)}</td>
                                        <td className="px-5 py-4 text-right text-green-700">-{formatMoney(payment.discountAmount)}</td>
                                        <td className="px-5 py-4 text-right font-black text-stone-900">{formatMoney(payment.finalAmount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {data.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-stone-100 px-5 py-4">
                        <button
                            onClick={() => setPage((current) => Math.max(0, current - 1))}
                            disabled={page === 0 || loading}
                            className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-bold text-stone-600 disabled:opacity-40"
                        >
                            Trước
                        </button>
                        <span className="text-sm text-stone-500">Trang {page + 1} / {data.totalPages}</span>
                        <button
                            onClick={() => setPage((current) => Math.min(data.totalPages - 1, current + 1))}
                            disabled={page >= data.totalPages - 1 || loading}
                            className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-bold text-stone-600 disabled:opacity-40"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
