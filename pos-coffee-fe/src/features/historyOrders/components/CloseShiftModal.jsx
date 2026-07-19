import { useState } from "react";
import axiosClient from "../../../shared/axios/axiosClient";

export default function CloseShiftModal({
                                            open,
                                            onClose,
                                            onSuccess,
                                        }) {

    const [actualCash, setActualCash] = useState("");
    const [loading, setLoading] = useState(false);
    const [businessError, setBusinessError] = useState("");

    if (!open) return null;

    const handleCashChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setActualCash(formatted);
    };

    const handleSubmit = async () => {

        // validate
        if (!actualCash) {
            setBusinessError("Hãy nhập số tiền thực tế.");
            return;
        }

        try {

            setLoading(true);
            setBusinessError("");

            await axiosClient.put("/shifts/close", {
                actualCash: Number(actualCash.replace(/\./g, ""))
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

            <div className="bg-white rounded-2xl w-[430px] p-6 text-black">

                <h2 className="text-2xl font-bold mb-5">
                    Kết ca làm việc
                </h2>

                <label className="block font-semibold mb-2">
                    Tiền thực tế cuối ca
                </label>

                <div className="relative">

                    <input
                        type="text"
                        inputMode="numeric"
                        value={actualCash}
                        onChange={handleCashChange}
                        placeholder="Nhập tiền thực tế"
                        className="w-full border rounded-xl p-3 pr-10"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500">
                        đ
                    </span>

                </div>

                {businessError && (

                    <div className="mt-4 rounded-xl bg-red-50 border border-red-300 px-4 py-3">

                        <p className="text-red-600 font-medium">
                            {businessError}
                        </p>

                    </div>

                )}

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 rounded-xl border"
                    >
                        Hủy
                    </button>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                    >
                        {loading ? "Đang kết ca..." : "Kết ca"}
                    </button>

                </div>

            </div>

        </div>
    );
}