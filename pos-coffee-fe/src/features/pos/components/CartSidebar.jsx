import React from "react";
import { Trash2, ShoppingCart, Receipt, CreditCard, Banknote, Truck, Tag, X, Ticket } from "lucide-react";
import { useValidateVoucher } from "../api/useValidateVoucher.js";

const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

const PAYMENT_METHODS = [
    { value: "CASH", label: "Tiền mặt", icon: <Banknote size={18} /> },
    { value: "TRANSFER", label: "Chuyển khoản", icon: <CreditCard size={18} /> },
    { value: "MOMO", label: "MoMo", icon: <Truck size={18} /> },
];

const ORDER_TYPES = [
    { value: "AT_TABLE", label: "Tại quầy" },
    { value: "TAKEAWAY", label: "Mang đi" },
];

export default function CartSidebar({ cart, onRemoveItem, onUpdateQuantity, onPlaceOrder, isSubmitting }) {
    const [customerName, setCustomerName] = React.useState("");
    const [customerPhone, setCustomerPhone] = React.useState("");
    const [orderType, setOrderType] = React.useState("AT_TABLE");
    const [tableNumber, setTableNumber] = React.useState("");
    const [paymentMethod, setPaymentMethod] = React.useState("CASH");
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [orderResult, setOrderResult] = React.useState(null);

    const [voucherCode, setVoucherCode] = React.useState("");
    const [appliedVoucher, setAppliedVoucher] = React.useState(null);
    const [voucherError, setVoucherError] = React.useState("");
    const validateVoucherMutation = useValidateVoucher();

    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.lineTotal) + Number(item.toppingTotal || 0),
        0
    );
    const discountAmount = appliedVoucher ? Number(appliedVoucher.discountAmount || 0) : 0;
    const finalTotal = Math.max(subtotal - discountAmount, 0);
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return;
        if (cart.length === 0) {
            setVoucherError("Vui lòng thêm món trước khi áp voucher");
            return;
        }
        setVoucherError("");
        try {
            const res = await validateVoucherMutation.mutateAsync({
                code: voucherCode.trim(),
                orderTotal: subtotal,
            });
            const data = res.data;
            if (data.message !== "OK") {
                setVoucherError(data.message);
                setAppliedVoucher(null);
            } else {
                setAppliedVoucher(data);
                setVoucherError("");
            }
        } catch (err) {
            setVoucherError(
                err?.response?.data?.message || err?.message || "Không thể kiểm tra voucher"
            );
            setAppliedVoucher(null);
        }
    };

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null);
        setVoucherCode("");
        setVoucherError("");
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        const result = await onPlaceOrder({
            customerName,
            customerPhone,
            orderType,
            tableNumber,
            paymentMethod,
            voucherCode: appliedVoucher ? appliedVoucher.code : null,
        });
        if (result) {
            setOrderResult(result);
            setShowSuccess(true);
            setAppliedVoucher(null);
            setVoucherCode("");
        }
    };

    if (showSuccess && orderResult) {
        return (
            <div className="w-96 bg-white h-full flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-extrabold text-stone-800 mb-1">Đặt hàng thành công!</h3>
                    <p className="text-stone-500 text-sm mb-6">
                        Mã đơn:{" "}
                        <span className="font-bold text-stone-700">
                            #{orderResult.orderId?.slice(0, 8).toUpperCase()}
                        </span>
                    </p>

                    <div className="w-full bg-stone-50 rounded-2xl p-4 mb-6 text-left space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-500">Tổng tiền</span>
                            <span className="font-bold text-stone-800">
                                {formatPrice(orderResult.totalAmount)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-500">Phương thức</span>
                            <span className="font-bold text-stone-700">
                                {PAYMENT_METHODS.find((m) => m.value === orderResult.paymentMethod)?.label}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-500">Loại</span>
                            <span className="font-bold text-stone-700">
                                {ORDER_TYPES.find((t) => t.value === orderResult.orderType)?.label}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setShowSuccess(false);
                            setOrderResult(null);
                            setCustomerName("");
                            setCustomerPhone("");
                            setTableNumber("");
                        }}
                        className="w-full bg-gradient-to-r from-[#4a3728] to-[#26170f] text-white py-3.5 rounded-2xl font-extrabold text-sm hover:from-[#26170f] hover:to-[#4a3728] transition-all shadow-lg"
                    >
                        Đặt đơn mới
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-96 bg-white h-full flex flex-col border-l border-stone-200">
            <div className="p-5 border-b border-stone-100 bg-gradient-to-r from-[#1f120c] to-[#4a3728] text-white">
                <div className="flex items-center gap-2">
                    <ShoppingCart size={20} className="text-[#c5a880]" />
                    <span className="font-extrabold text-lg">Giỏ hàng</span>
                    {cart.length > 0 && (
                        <span className="ml-auto bg-[#c5a880] text-[#1f120c] text-xs font-black px-2 py-0.5 rounded-full">
                            {totalQuantity}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-stone-400">
                        <ShoppingCart size={48} className="mb-3 opacity-30" />
                        <p className="text-sm font-medium">Giỏ hàng trống</p>
                        <p className="text-xs mt-1">Chọn món để bắt đầu</p>
                    </div>
                ) : (
                    cart.map((item, idx) => (
                        <div key={idx} className="bg-stone-50 rounded-2xl p-3 border border-stone-100">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="font-bold text-sm text-stone-800 leading-tight">
                                        {item.productName}
                                    </p>
                                    <p className="text-xs text-stone-400 mt-0.5">
                                        Size {item.sizeName} · {item.sugarLevel} đường · {item.iceLevel} đá
                                    </p>
                                    {item.toppings?.length > 0 && (
                                        <p className="text-xs text-[#a27b5c] mt-0.5">
                                            + {item.toppings.map((t) => t.name).join(", ")}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => onRemoveItem(idx)}
                                    className="p-1 text-stone-400 hover:text-red-500 transition-colors ml-2"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2 bg-white rounded-xl border border-stone-200">
                                    <button
                                        onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                                        className="px-2 py-1 text-xs font-bold text-stone-500 hover:bg-stone-100 rounded-l-xl"
                                    >
                                        -
                                    </button>
                                    <span className="font-bold text-sm w-5 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                                        className="px-2 py-1 text-xs font-bold text-stone-500 hover:bg-stone-100 rounded-r-xl"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="font-extrabold text-sm text-[#4a3728]">
                                    {formatPrice(Number(item.lineTotal) + Number(item.toppingTotal || 0))}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {cart.length > 0 && (
                <div className="p-4 border-t border-stone-100 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="text"
                            placeholder="Tên KH (tùy chọn)"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="col-span-1 text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:border-[#a27b5c]"
                        />
                        <input
                            type="tel"
                            placeholder="SĐT (tùy chọn)"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="col-span-1 text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:border-[#a27b5c]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <select
                            value={orderType}
                            onChange={(e) => setOrderType(e.target.value)}
                            className="col-span-1 text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:border-[#a27b5c]"
                        >
                            {ORDER_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                        {orderType === "AT_TABLE" && (
                            <input
                                type="text"
                                placeholder="Số bàn"
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                className="col-span-1 text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:border-[#a27b5c]"
                            />
                        )}
                    </div>

                    <div className="flex gap-1.5">
                        {PAYMENT_METHODS.map((m) => (
                            <button
                                key={m.value}
                                onClick={() => setPaymentMethod(m.value)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                                    paymentMethod === m.value
                                        ? "border-[#4a3728] bg-[#4a3728] text-white"
                                        : "border-stone-200 text-stone-500 hover:border-stone-300"
                                }`}
                            >
                                {m.icon}
                                <span className="hidden sm:inline">{m.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Voucher (UC07) */}
                    <div className="rounded-2xl border border-dashed border-[#a27b5c]/40 bg-[#fbf6ee] p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Ticket size={14} className="text-[#a27b5c]" />
                            <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                                Mã giảm giá
                            </span>
                            {appliedVoucher && (
                                <button
                                    onClick={handleRemoveVoucher}
                                    className="ml-auto text-stone-400 hover:text-red-500"
                                    title="Bỏ voucher"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        {appliedVoucher ? (
                            <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-[#a27b5c]/30">
                                <div>
                                    <p className="font-extrabold text-sm text-[#4a3728]">
                                        {appliedVoucher.code}
                                    </p>
                                    <p className="text-xs text-stone-500">
                                        Giảm {formatPrice(appliedVoucher.discountAmount)}
                                    </p>
                                </div>
                                <Tag size={16} className="text-[#a27b5c]" />
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nhập mã voucher"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#a27b5c] font-bold uppercase tracking-wider"
                                />
                                <button
                                    onClick={handleApplyVoucher}
                                    disabled={validateVoucherMutation.isPending || !voucherCode.trim()}
                                    className="px-3 py-2 rounded-xl bg-[#4a3728] text-white text-xs font-bold disabled:opacity-50"
                                >
                                    {validateVoucherMutation.isPending ? "..." : "Áp dụng"}
                                </button>
                            </div>
                        )}
                        {voucherError && (
                            <p className="text-xs text-red-600 mt-2 font-medium">{voucherError}</p>
                        )}
                    </div>
                </div>
            )}

            <div className="p-5 border-t border-stone-200 bg-stone-50">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-stone-500">Tạm tính</span>
                    <span className="font-bold text-stone-700">{formatPrice(subtotal)}</span>
                </div>
                {appliedVoucher && discountAmount > 0 && (
                    <div className="flex justify-between items-center mb-1 text-green-700">
                        <span className="text-sm font-medium flex items-center gap-1">
                            <Tag size={12} /> Voucher {appliedVoucher.code}
                        </span>
                        <span className="font-bold">-{formatPrice(discountAmount)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-stone-700">Thành tiền</span>
                    <span className="text-2xl font-black text-[#26170f]">
                        {formatPrice(finalTotal)}
                    </span>
                </div>
                <button
                    onClick={handlePlaceOrder}
                    disabled={cart.length === 0 || isSubmitting}
                    className={`w-full py-4 rounded-2xl font-extrabold text-base tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg ${
                        cart.length === 0
                            ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#4a3728] to-[#26170f] text-white hover:from-[#26170f] hover:to-[#4a3728] active:scale-95"
                    }`}
                >
                    {isSubmitting ? (
                        <span className="animate-pulse">Đang xử lý...</span>
                    ) : (
                        <>
                            <Receipt size={20} />
                            Đặt hàng
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
