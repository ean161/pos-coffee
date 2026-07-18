import { useState, useEffect } from 'react';
import { User, Phone, Clock, X, SquarePen, Loader2, Lock, Unlock } from 'lucide-react';
import employeeApi from "../api/employeeApi";

const EmployeeDetailModal = ({ isOpen, onClose, employee, isEdit, onRefresh, onBack }) => {
    const [formData, setFormData] = useState({
        phoneNumber: '',
        hourlyWage: '',
        hireDate: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [togglingStatus, setTogglingStatus] = useState(false);

    useEffect(() => {
        if (employee) {
            setFormData({
                phoneNumber: employee.phoneNumber || '',
                hourlyWage: employee.hourlyWage?.toString() || '',
                hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : ''
            });
            setError('');
        }
    }, [employee]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const payload = {
                phoneNumber: formData.phoneNumber.trim() || null,
                hourlyWage: parseFloat(formData.hourlyWage),
                hireDate: new Date(formData.hireDate).toISOString()
            };
            await employeeApi.update(employee.id, payload);
            onRefresh?.();
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || 'Cập nhật thất bại';
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async () => {
        setTogglingStatus(true);
        try {
            const newStatus = !employee.userStatus;
            const payload = {
                phoneNumber: employee.phoneNumber || null,
                hourlyWage: typeof employee.hourlyWage === 'number'
                    ? employee.hourlyWage
                    : parseFloat(employee.hourlyWage),
                hireDate: employee.hireDate
            };
            await employeeApi.update(employee.id, payload);
            onRefresh?.();
            setTimeout(() => {
                setTogglingStatus(false);
                onClose();
            }, 200);
        } catch (err) {
            const msg = err.response?.data?.message || 'Thao tác thất bại';
            setError(msg);
            setTogglingStatus(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (!isOpen || !employee) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-lg w-full overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#a27b5c]" />

                <div className="p-6 border-b border-[#f7f0e9] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <User className="text-[#a27b5c]" size={20} />
                        <h3 className="font-black text-lg text-[#26170f]">
                            {isEdit ? 'Sửa thông tin nhân viên' : 'Chi tiết nhân viên'}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={isEdit ? onBack : onClose}
                        className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {isEdit ? (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                                {error}
                            </div>
                        )}

                        <div className="p-3 bg-[#FAF6F0] rounded-xl text-xs text-stone-600">
                            <span className="font-bold text-[#26170f]">{employee.fullName}</span>
                            <span className="mx-2">•</span>
                            <span>@{employee.username}</span>
                            <span className="mx-2">•</span>
                            <span>{employee.role === 'ADMIN' ? 'Quản lý' : 'Nhân viên'}</span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3.5 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] focus:bg-white outline-none transition-all placeholder:text-stone-300 text-sm"
                                placeholder="vd: 0901234567"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                Lương theo giờ (VND) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1000"
                                className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3.5 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] focus:bg-white outline-none transition-all placeholder:text-stone-300 text-sm"
                                placeholder="vd: 25000"
                                value={formData.hourlyWage}
                                onChange={(e) => setFormData({ ...formData, hourlyWage: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest ml-1 block">
                                Ngày vào làm <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3.5 rounded-xl text-[#25160f] font-bold focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] focus:bg-white outline-none transition-all text-sm"
                                value={formData.hireDate}
                                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                                required
                            />
                        </div>

                        <div className="pt-2 flex justify-end gap-2 text-sm">
                            <button
                                type="button"
                                onClick={onBack}
                                className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-bold hover:bg-stone-200"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={saving || !formData.hourlyWage || !formData.hireDate}
                                className="px-5 py-2.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                            >
                                {saving && <Loader2 size={14} className="animate-spin" />}
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-6 space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center gap-4 p-4 bg-[#FAF6F0] rounded-xl">
                            <div className="bg-[#a27b5c] text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-black">
                                {employee?.fullName?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-lg text-[#26170f]">{employee?.fullName}</h4>
                                <p className="text-stone-500 text-sm">@{employee?.username}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                employee?.userStatus
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {employee?.userStatus ? 'Hoạt động' : 'Đã khóa'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-[#a27b5c] uppercase tracking-widest">Vai trò</span>
                                <p className="font-bold text-[#26170f]">
                                    {employee?.role === 'ADMIN' ? 'Quản lý' : 'Nhân viên'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-[#a27b5c] uppercase tracking-widest flex items-center gap-1">
                                    <Phone size={10} /> Số điện thoại
                                </span>
                                <p className="font-bold text-[#26170f]">{employee?.phoneNumber || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-[#a27b5c] uppercase tracking-widest flex items-center gap-1">
                                    <Clock size={10} /> Ngày vào làm
                                </span>
                                <p className="font-bold text-[#26170f]">{formatDate(employee?.hireDate)}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-[#4a3728] to-[#5c4535] rounded-xl text-white">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Lương theo giờ</span>
                            <p className="font-black text-2xl mt-1">{formatCurrency(employee?.hourlyWage)}</p>
                        </div>

                        <div className="flex justify-between gap-2 pt-2">
                            <button
                                type="button"
                                onClick={handleToggleStatus}
                                disabled={togglingStatus}
                                className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50 ${
                                    employee?.userStatus
                                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                                }`}
                            >
                                {togglingStatus ? <Loader2 size={14} className="animate-spin" /> :
                                    employee?.userStatus ? <Lock size={14} /> : <Unlock size={14} />
                                }
                                {employee?.userStatus ? 'Khóa tài khoản' : 'Mở khóa'}
                            </button>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-bold hover:bg-stone-200"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    onClick={onEdit}
                                    className="px-5 py-2.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md transition-all"
                                >
                                    <SquarePen size={14} />
                                    Sửa thông tin
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeDetailModal;
