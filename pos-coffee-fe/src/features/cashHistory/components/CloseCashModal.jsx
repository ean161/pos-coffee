import { useState } from "react";
import cashHistoryApi from "../api/cashHistoryApi.js";

export default function CloseCashModal({ open, onClose, onSuccess }) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [businessError, setBusinessError] = useState("");

    if (!open) return null;

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setAmount(formatted);
    };

    const handleSubmit = async () => {
        if (!amount) {
            setBusinessError("Hãy nhập số tiền đóng két.");
            return;
        }
        try {
            setLoading(true);
            setBusinessError("");
            await cashHistoryApi.close(Number(amount.replace(/\./g, "")));
            setAmount("");
            onSuccess();
        } catch (e) {
            setBusinessError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAmount("");
        setBusinessError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-[430px] p-6 text-black">
                <h2 className="text-2xl font-bold mb-5">Đóng két tiền</h2>

                <label className="block font-semibold mb-2">
                    Số tiền cuối ca (thực tế)
                </label>
                <div className="relative">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={amount}
                        onChange={handleChange}
                        placeholder="Nhập số tiền cuối ca"
                        className="w-full border rounded-xl p-3 pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500">
                        đ
                    </span>
                </div>

                {businessError && (
                    <div className="mt-4 rounded-xl bg-red-50 border border-red-300 px-4 py-3">
                        <p className="text-red-600 font-medium">{businessError}</p>
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="px-5 py-2 rounded-xl border"
                    >
                        Hủy
                    </button>
                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Đang đóng..." : "Đóng két"}
                    </button>
                </div>
            </div>
        </div>
    );
}
