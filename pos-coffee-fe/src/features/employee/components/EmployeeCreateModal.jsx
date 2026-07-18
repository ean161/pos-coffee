import { useState } from 'react';
import { Users, Loader2, X, UserPlus } from 'lucide-react';
import employeeApi from "../api/employeeApi";

const EmployeeCreateModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        role: 'STAFF',
        status: true,
        phoneNumber: '',
        hourlyWage: '',
        hireDate: new Date().toISOString().split('T')[0]
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const reset = () => {
        setFormData({
            username: '',
            password: '',
            fullName: '',
            role: 'STAFF',
            status: true,
            phoneNumber: '',
            hourlyWage: '',
            hireDate: new Date().toISOString().split('T')[0]
        });
        setError('');
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const payload = {
                username: formData.username.trim(),
                password: formData.password,
                fullName: formData.fullName.trim(),
                role: formData.role,
                status: formData.status,
                phoneNumber: formData.phoneNumber.trim() || null,
                hourlyWage: parseFloat(formData.hourlyWage),
                hireDate: new Date(formData.hireDate).toISOString()
            };
            await employeeApi.create(payload);
            reset();
            onSuccess?.();
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || 'Tạo nhân viên thất bại';
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-lg w-full overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#a27b5c]" />

                <div className="p-6 border-b border-[#f7f0e9] flex justify-between items-center sticky top-0 bg-white">
                    <div className="flex items-center gap-2">
                        <Users className="text-[#a27b5c]" size={20} />
                        <h3 className="font-black text-lg text-[#26170f]">Thêm nhân viên mới</h3>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleCreate} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="bg-[#FAF6F0] border border-[#ebdcd0] p-4 rounded-xl space-y-4">
                        <h4 className="text-[11px] font-black text-[#a27b5c] uppercase tracking-widest flex items-center gap-1.5">
                            <UserPlus size={12} /> Tài khoản đăng nhập
                        </h4>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#26170f] block">
                                Tên đăng nhập <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full bg-white border border-[#ebdcd0] p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#a27b5c]/20 focus:border-[#a27b5c] outline-none"
                                placeholder="vd: nguyenvana"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                minLength={3}
                                maxLength={50}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#26170f] block">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                className="w-full bg-white border border-[#ebdcd0] p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#a27b5c]/20 focus:border-[#a27b5c] outline-none"
                                placeholder="Tối thiểu 6 ký tự"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                minLength={6}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#26170f] block">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full bg-white border border-[#ebdcd0] p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#a27b5c]/20 focus:border-[#a27b5c] outline-none"
                                placeholder="vd: Nguyễn Văn A"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#26170f] block">
                                    Vai trò <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-white border border-[#ebdcd0] p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#a27b5c]/20 focus:border-[#a27b5c] outline-none"
                                    required
                                >
                                    <option value="STAFF">Nhân viên</option>
                                    <option value="ADMIN">Quản lý</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#26170f] block">
                                    Trạng thái
                                </label>
                                <select
                                    value={formData.status ? 'true' : 'false'}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                                    className="w-full bg-white border border-[#ebdcd0] p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#a27b5c]/20 focus:border-[#a27b5c] outline-none"
                                >
                                    <option value="true">Hoạt động</option>
                                    <option value="false">Khóa</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#26170f] block">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#a27b5c]/20 focus:border-[#a27b5c] focus:bg-white outline-none"
                                placeholder="vd: 0901234567"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#26170f] block">
                                Lương theo giờ (VND) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1000"
                                className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#a27b5c]/20 focus:border-[#a27b5c] focus:bg-white outline-none"
                                placeholder="vd: 25000"
                                value={formData.hourlyWage}
                                onChange={(e) => setFormData({ ...formData, hourlyWage: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#26170f] block">
                                Ngày vào làm <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full bg-[#FAF6F0]/40 border border-[#ebdcd0] p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#a27b5c]/20 focus:border-[#a27b5c] focus:bg-white outline-none"
                                value={formData.hireDate}
                                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2 text-sm">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-bold hover:bg-stone-200"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                        >
                            {saving && <Loader2 size={14} className="animate-spin" />}
                            Tạo mới
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeCreateModal;
