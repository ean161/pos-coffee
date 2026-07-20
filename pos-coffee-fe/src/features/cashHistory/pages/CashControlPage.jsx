import { useEffect, useState } from "react";
import { Coffee, Wallet, Clock, User as UserIcon, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import cashHistoryApi from "../api/cashHistoryApi.js";
import OpenCashModal from "../components/OpenCashModal.jsx";
import CloseCashModal from "../components/CloseCashModal.jsx";
import { formatDateTime, formatCurrency } from "../utils/format.js";

export default function CashControlPage() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [closeModal, setCloseModal] = useState(false);

    const loadCurrent = async () => {
        setLoading(true);
        try {
            const res = await cashHistoryApi.getCurrent();
            setCurrent(res.data);
        } catch (e) {
            console.error(e);
            setCurrent(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCurrent();
    }, []);

    const isOpen = current?.status === "OPEN";

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate("/staff/pos")}
                    className="p-2 rounded-full hover:bg-stone-100"
                >
                    <ArrowLeft />
                </button>
                <h1 className="text-3xl text-gray-700 font-black">Quản lý két tiền</h1>
            </div>

            {loading ? (
                <div className="bg-white rounded-2xl p-8 text-center text-stone-500">
                    Đang tải...
                </div>
            ) : isOpen ? (
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            ĐANG MỞ
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-xl bg-stone-50 p-4">
                            <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
                                <UserIcon size={14} /> Nhân viên mở
                            </div>
                            <div className="font-bold text-gray-700 text-lg">{current.username}</div>
                        </div>
                        <div className="rounded-xl bg-stone-50 text-gray-700 p-4">
                            <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
                                <Clock size={14} /> Giờ mở
                            </div>
                            <div className="font-bold">{formatDateTime(current.openTime)}</div>
                        </div>
                        <div className="rounded-xl bg-stone-50 p-4">
                            <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
                                <Wallet size={14} /> Tiền đầu ca
                            </div>
                            <div className="font-bold text-lg text-green-700">
                                {formatCurrency(current.openAmount)}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={() => setCloseModal(true)}
                            className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700"
                        >
                            Đóng két
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center space-y-4">
                    <Coffee className="mx-auto text-stone-400" size={48} />
                    <p className="text-stone-600">
                        Hiện chưa có ca mở. Bấm "Mở két" để bắt đầu.
                    </p>
                    <button
                        onClick={() => setOpenModal(true)}
                        className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700"
                    >
                        Mở két
                    </button>
                </div>
            )}

            <OpenCashModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={() => {
                    setOpenModal(false);
                    navigate("/staff/pos");
                }}
            />
            <CloseCashModal
                open={closeModal}
                onClose={() => setCloseModal(false)}
                onSuccess={() => {
                    setCloseModal(false);
                    loadCurrent();
                }}
            />
        </div>
    );
}
