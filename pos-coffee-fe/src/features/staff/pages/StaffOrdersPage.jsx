import React, { useState } from "react";
import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import {
    getStaffOrders,
    updateStaffOrderStatus,
} from "../api/staffOrderApi.js";
import {
    Clock,
    Package,
    ChefHat,
    CheckCircle2,
    CircleCheckBig,
    XCircle,
    ChevronDown,
    ChevronUp,
    Loader2,
    User,
    Phone,
    Hash,
    Trash2,
} from "lucide-react";
const STATUS_OPTIONS = [
    { value: "PENDING", label: "Chờ xác nhận", Icon: Clock, color: "amber" },
    { value: "CONFIRMED", label: "Đã xác nhận", Icon: Package, color: "blue" },
    { value: "PREPARING", label: "Đang pha chế", Icon: ChefHat, color: "orange" },
    { value: "READY", label: "Sẵn sàng", Icon: CheckCircle2, color: "sky" },
    { value: "COMPLETED", label: "Hoàn thành", Icon: CircleCheckBig, color: "green" },
];

const COLOR_MAP = {
    amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
    orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-500" },
    sky: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", dot: "bg-sky-500" },
    green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-500" },
};

const FORBIDDEN_TRANSITIONS = new Set(["COMPLETED", "CANCELLED"]);

function formatPrice(v) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(v);
}

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function StaffOrdersPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["staffOrders"],
        queryFn: getStaffOrders,
        refetchInterval: 15000,
    });

    const qc = useQueryClient();
    const statusMutation = useMutation({
        mutationFn: ({ orderId, status }) =>
            updateStaffOrderStatus(orderId, status),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["staffOrders"] }),
    });

    const [filter, setFilter] = useState("ALL");
    const [expandedId, setExpandedId] = useState(null);

    const orders = data?.data || data || [];
    const filtered =
        filter === "ALL"
            ? orders
            : orders.filter((o) => o.status === filter);

    const counts = {
        PENDING: orders.filter((o) => o.status === "PENDING").length,
        CONFIRMED: orders.filter((o) => o.status === "CONFIRMED").length,
        PREPARING: orders.filter((o) => o.status === "PREPARING").length,
        READY: orders.filter((o) => o.status === "READY").length,
        COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
    };

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[#a27b5c] mr-3" size={32} />
                <span className="text-stone-500 font-medium">
                    Đang tải đơn hàng...
                </span>
            </div>
        );

    if (error)
        return (
            <div className="text-center text-red-500 py-12">
                <p className="font-bold">Không thể tải danh sách đơn hàng</p>
                <p className="text-sm mt-1">{error.message}</p>
            </div>
        );

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-black text-[#26170f]">
                    Quản lý Đơn hàng
                </h1>
            </div>

            {/* Status filter pills */}
            <div className="flex flex-wrap gap-2">
                <FilterPill label="Tất cả" count={orders.length} active={filter === "ALL"} onClick={() => setFilter("ALL")} />
                <FilterPill label="Chờ xác nhận" count={counts.PENDING} active={filter === "PENDING"} onClick={() => setFilter("PENDING")} color="amber" />
                <FilterPill label="Đã xác nhận" count={counts.CONFIRMED} active={filter === "CONFIRMED"} onClick={() => setFilter("CONFIRMED")} color="blue" />
                <FilterPill label="Đang pha chế" count={counts.PREPARING} active={filter === "PREPARING"} onClick={() => setFilter("PREPARING")} color="orange" />
                <FilterPill label="Sẵn sàng" count={counts.READY} active={filter === "READY"} onClick={() => setFilter("READY")} color="sky" />
                <FilterPill label="Hoàn thành" count={counts.COMPLETED} active={filter === "COMPLETED"} onClick={() => setFilter("COMPLETED")} color="green" />
            </div>

            {/* Orders list */}
            {filtered.length === 0 ? (
                <div className="text-center text-stone-400 py-16 bg-white rounded-2xl border border-stone-100">
                    <Package size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold">Chưa có đơn hàng nào</p>
                    <p className="text-sm mt-1">
                        {filter === "ALL"
                            ? "Bắt đầu bán hàng tại trang POS"
                            : "Không có đơn hàng ở trạng thái này"}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((order) => {
                        const statusMeta = STATUS_OPTIONS.find(
                            (s) => s.value === order.status
                        );
                        const colors =
                            COLOR_MAP[statusMeta?.color] || COLOR_MAP.amber;
                        const isExpanded = expandedId === order.orderId;
                        const canAdvance =
                            order.status !== "COMPLETED" &&
                            order.status !== "CANCELLED";

                        return (
                            <div
                                key={order.orderId}
                                className={`bg-white rounded-2xl border ${colors.border} ${colors.bg} shadow-sm transition-all`}
                            >
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-black text-sm text-stone-800">
                                                    #
                                                    {order.orderId?.slice(0, 8).toUpperCase()}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colors.text} bg-white/60`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                                                    {statusMeta?.label || order.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {formatDate(order.createdAt)}
                                                </span>
                                                {order.customerName && (
                                                    <span className="flex items-center gap-1">
                                                        <User size={12} />
                                                        {order.customerName}
                                                    </span>
                                                )}
                                                {order.tableNumber && (
                                                    <span className="flex items-center gap-1">
                                                        <Hash size={12} />
                                                        Bàn {order.tableNumber}
                                                    </span>
                                                )}
                                                <span className="font-black text-[#4a3728] text-sm ml-auto">
                                                    {formatPrice(order.totalAmount)}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setExpandedId(
                                                    isExpanded
                                                        ? null
                                                        : order.orderId
                                                )
                                            }
                                            className="p-1.5 rounded-lg text-stone-400 hover:text-[#4a3728] hover:bg-white/60 transition-colors flex-shrink-0"
                                        >
                                            {isExpanded ? (
                                                <ChevronUp size={18} />
                                            ) : (
                                                <ChevronDown size={18} />
                                            )}
                                        </button>
                                    </div>

                                    {/* Expanded detail */}
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-stone-200/60">
                                            {/* Items */}
                                            <div className="space-y-2 mb-4">
                                                {(order.items || []).map(
                                                    (item, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-center justify-between text-sm bg-white/70 rounded-xl px-3 py-2"
                                                        >
                                                            <div>
                                                                <span className="font-bold text-stone-800">
                                                                    {item.productName}
                                                                </span>
                                                                {item.variantName && (
                                                                    <span className="text-stone-400 ml-1">
                                                                        (
                                                                        {item.variantName}
                                                                        )
                                                                    </span>
                                                                )}
                                                                <span className="text-stone-400 ml-2">
                                                                    x{item.quantity}
                                                                </span>
                                                            </div>
                                                            <span className="font-bold text-stone-700">
                                                                {formatPrice(
                                                                    item.lineTotal
                                                                )}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            {/* Totals */}
                                            <div className="space-y-1 mb-4 text-sm">
                                                <div className="flex justify-between text-stone-500">
                                                    <span>Tạm tính</span>
                                                    <span className="font-bold">
                                                        {formatPrice(
                                                            order.subtotal
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between font-black text-[#26170f] text-base">
                                                    <span>Thành tiền</span>
                                                    <span>
                                                        {formatPrice(
                                                            order.totalAmount
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap gap-2">
                                                {STATUS_OPTIONS.filter(
                                                    (s) =>
                                                        s.value !==
                                                        order.status
                                                ).map((s) => {
                                                    const isAfterCurrent =
                                                        STATUS_OPTIONS.findIndex(
                                                            (x) =>
                                                                x.value ===
                                                                s.value
                                                        ) >
                                                        STATUS_OPTIONS.findIndex(
                                                            (x) =>
                                                                x.value ===
                                                                order.status
                                                        );
                                                    return (
                                                        <button
                                                            key={s.value}
                                                            disabled={
                                                                !canAdvance ||
                                                                statusMutation.isPending
                                                            }
                                                            onClick={() =>
                                                                statusMutation.mutate(
                                                                    {
                                                                        orderId: order.orderId,
                                                                        status: s.value,
                                                                    }
                                                                )
                                                            }
                                                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                                                                isAfterCurrent
                                                                    ? "bg-[#4a3728] text-white hover:bg-[#26170f] shadow-md"
                                                                    : "bg-white border border-stone-200 text-stone-600 hover:border-[#4a3728]"
                                                            }`}
                                                        >
                                                            {s.Icon({
                                                                size: 14,
                                                            })}
                                                            {s.label}
                                                        </button>
                                                    );
                                                })}
                                                {order.status === "PENDING" && (
                                                    <button
                                                        disabled={
                                                            statusMutation.isPending
                                                        }
                                                        onClick={() =>
                                                            statusMutation.mutate(
                                                                {
                                                                    orderId: order.orderId,
                                                                    status: "CANCELLED",
                                                                }
                                                            )
                                                        }
                                                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-40"
                                                    >
                                                        <Trash2 size={14} />
                                                        Hủy
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function FilterPill({ label, count, active, onClick, color }) {
    if (color) {
        const c = COLOR_MAP[color];
        return (
            <button
                onClick={onClick}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    active
                        ? `${c.bg} ${c.border} border ${c.text}`
                        : "bg-white border border-stone-200 text-stone-500 hover:border-stone-300"
                }`}
            >
                {label}
                <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                        active ? `${c.dot} text-white` : "bg-stone-100 text-stone-500"
                    }`}
                >
                    {count}
                </span>
            </button>
        );
    }
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                active
                    ? "bg-[#1f120c] text-white"
                    : "bg-white border border-stone-200 text-stone-500 hover:border-stone-300"
            }`}
        >
            {label}
            <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    active ? "bg-[#a27b5c] text-white" : "bg-stone-100 text-stone-500"
                }`}
            >
                {count}
            </span>
        </button>
    );
}
