import { useCallback, useState } from "react";
import { FolderOpen, Eye, SquarePen, Trash2 } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";
import EmployeeDetailModal from "./EmployeeDetailModal";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import { formatVND } from "../../../shared/utils/formatters";

const EmployeeTable = ({ data, onRefresh }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const closeDetailModal = useCallback(() => {
        setDetailModalOpen(false);
        onRefresh?.();
    }, [onRefresh]);

    const closeEditModal = useCallback(() => {
        setEditModalOpen(false);
        onRefresh?.();
    }, [onRefresh]);

    const closeDeleteModal = useCallback(() => {
        setDeleteModalOpen(false);
        onRefresh?.();
    }, [onRefresh]);

    const handleOpenDetail = (employee) => {
        setSelectedEmployee(employee);
        setDetailModalOpen(true);
    };

    const handleOpenEdit = (employee) => {
        setSelectedEmployee(employee);
        setEditModalOpen(true);
    };

    const handleOpenDelete = (employee) => {
        setEmployeeToDelete(employee);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!employeeToDelete) return;
        setDeleting(true);
        try {
            await axiosClient.delete(`/employees/${employeeToDelete.id}`);
            setDeleteModalOpen(false);
            setEmployeeToDelete(null);
            onRefresh?.();
        } catch (error) {
            console.error("Lỗi xóa:", error);
        } finally {
            setDeleting(false);
        }
    };

    const formatCurrency = (amount) => formatVND(amount);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[#a27b5c] bg-white rounded-2xl p-8 text-center animate-fade-in">
                <FolderOpen size={48} className="mb-4 text-stone-200" />
                <p className="text-base font-bold text-[#26170f]">Chưa có nhân viên nào</p>
                <p className="text-xs text-stone-400 mt-1">Bấm nút "Thêm nhân viên" để bắt đầu</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                    <tr className="bg-[#FAF6F0]/60 border-b border-[#ebdcd0] text-[11px] text-[#a27b5c] uppercase font-bold tracking-widest">
                        <th className="px-6 py-5">Họ tên</th>
                        <th className="px-4 py-5">Tài khoản</th>
                        <th className="px-4 py-5">Vai trò</th>
                        <th className="px-4 py-5">SĐT</th>
                        <th className="px-4 py-5">Lương/giờ</th>
                        <th className="px-4 py-5">Ngày vào làm</th>
                        <th className="px-4 py-5">Trạng thái</th>
                        <th className="px-4 py-5 text-right">Tùy chọn</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#f7f0e9]">
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            className="group hover:bg-[#fcf8f2] transition-all duration-300"
                        >
                            <td className="px-6 py-5">
                                <span
                                    onClick={() => handleOpenDetail(item)}
                                    className="font-bold text-[#26170f] text-base hover:text-[#a27b5c] transition-colors cursor-pointer"
                                >
                                    {item.fullName}
                                </span>
                            </td>
                            <td className="px-4 py-5">
                                <span className="text-stone-600 font-medium">{item.username}</span>
                            </td>
                            <td className="px-4 py-5">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    item.role === 'ADMIN'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {item.role === 'ADMIN' ? 'Quản lý' : 'Nhân viên'}
                                </span>
                            </td>
                            <td className="px-4 py-5">
                                <span className="text-stone-600">{item.phoneNumber || '-'}</span>
                            </td>
                            <td className="px-4 py-5">
                                <span className="font-semibold text-[#4a3728]">
                                    {formatCurrency(item.hourlyWage)}
                                </span>
                            </td>
                            <td className="px-4 py-5">
                                <span className="text-stone-600">{formatDate(item.hireDate)}</span>
                            </td>
                            <td className="px-4 py-5">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    item.userStatus
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {item.userStatus ? 'Hoạt động' : 'Đã khóa'}
                                </span>
                            </td>
                            <td className="px-4 py-5 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleOpenDetail(item)}
                                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-stone-400 bg-stone-50 border border-stone-200 hover:bg-stone-100 hover:text-stone-700 transition-all duration-300"
                                        title="Xem chi tiết"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleOpenEdit(item)}
                                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-[#a27b5c] bg-[#FAF6F0] border border-[#e5dcd3] hover:bg-[#f0ebe5] transition-all duration-300"
                                        title="Sửa thông tin"
                                    >
                                        <SquarePen size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleOpenDelete(item)}
                                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-red-500 bg-red-50 border border-red-200 hover:bg-red-100 transition-all duration-300"
                                        title="Xóa nhân viên"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <EmployeeDetailModal
                isOpen={detailModalOpen}
                onClose={closeDetailModal}
                employee={selectedEmployee}
                onEdit={() => {
                    setDetailModalOpen(false);
                    setEditModalOpen(true);
                }}
            />

            <EmployeeDetailModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                employee={selectedEmployee}
                isEdit={true}
                onRefresh={onRefresh}
                onBack={() => {
                    setEditModalOpen(false);
                    setDetailModalOpen(true);
                }}
            />

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Xóa nhân viên"
                message={`Bạn có chắc muốn xóa hồ sơ nhân viên "${employeeToDelete?.fullName}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                cancelText="Hủy"
                loading={deleting}
                type="danger"
            />
        </div>
    );
};

export default EmployeeTable;