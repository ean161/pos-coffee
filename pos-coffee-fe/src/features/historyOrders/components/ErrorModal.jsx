import { AlertCircle } from "lucide-react";

export default function ErrorModal({ message, onClose }) {
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">

            <div className="w-[380px] rounded-2xl bg-white shadow-2xl p-6">

                <div className="flex flex-col items-center">

                    <AlertCircle
                        size={60}
                        className="text-red-500 mb-3"
                    />

                    <h2 className="text-2xl font-bold text-red-600">
                        Thông báo
                    </h2>

                    <p className="text-center text-stone-600 mt-3">
                        Hiện nhân viên chưa có ca
                    </p>

                    <button
                        onClick={onClose}
                        className="mt-6 w-full rounded-xl bg-red-600 py-3 text-white font-semibold hover:bg-red-700"
                    >
                        Đóng
                    </button>

                </div>

            </div>

        </div>
    );
}