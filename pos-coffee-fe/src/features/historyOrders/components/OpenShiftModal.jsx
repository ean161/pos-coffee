import { useState } from "react";
import axiosClient from "../../../shared/axios/axiosClient";
import ErrorModal from "../../historyOrders/components/ErrorModal.jsx";

export default function OpenShiftModal({
                                           open,
                                           onClose,
                                           onSuccess,
                                       }) {

    const [initialCash, setInitialCash] = useState("");

    const [loading, setLoading] = useState(false);
    const [inputError, setInputError] = useState("");

    const handleCashChange = (e) => {
        // Chỉ giữ lại số
        const value = e.target.value.replace(/\D/g, "");

        // Format 1.000.000
        const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        setInitialCash(formatted);
    };

    const [businessError, setBusinessError] = useState("");
    if (!open) return null;

    const handleSubmit = async () => {

        if (!initialCash.trim()) {
            setInputError("Vui lòng nhập tiền đầu ca.");
            return;
        }

        try {
            setLoading(true);

            setInputError("");
            setBusinessError("");

            await axiosClient.post("/shifts/open", {
                initialCash: Number(initialCash.replace(/\./g, ""))
            });

            onSuccess();

        } catch (e) {
            setBusinessError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl w-[420px] p-6 text-black">

                <h2 className="text-2xl font-bold mb-5">
                    Mở ca làm việc
                </h2>

                <label className="block text-sm font-semibold mb-2">
                    Tiền đầu ca
                </label>

                <div className="relative">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={initialCash}
                        onChange={handleCashChange}
                        placeholder="Nhập tiền đầu ca"
                        className="w-full border rounded-xl p-3 pr-10"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500">
        đ
    </span>
                </div>

                {inputError && (
                    <p className="mt-2 text-sm text-red-600">
                        {inputError}
                    </p>
                )}

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border"
                    >
                        Hủy
                    </button>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-5 py-2 rounded-xl bg-green-600 text-white"
                    >
                        {loading ? "Đang mở..." : "Mở ca"}
                    </button>
                </div>

            </div>

            {businessError && (
                <ErrorModal
                    message={businessError}
                    onClose={() => setBusinessError("")}
                />
            )}
        </div>
    );
}