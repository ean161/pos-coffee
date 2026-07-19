import { useState, useEffect, useMemo } from 'react';
import { Users, Plus, Loader2, Search, X } from 'lucide-react';
import employeeApi from "../api/employeeApi";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeCreateModal from "../components/EmployeeCreateModal";

const normalizeText = (value) =>
    (value || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

const EmployeePage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [search, setSearch] = useState('');

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await employeeApi.getAll();
            setEmployees(res.data || []);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                const res = await employeeApi.getAll();
                if (!cancelled) setEmployees(res.data || []);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const filteredEmployees = useMemo(() => {
        const keyword = normalizeText(search);
        if (!keyword) return employees;
        return employees.filter((emp) =>
            normalizeText(emp.fullName).includes(keyword) ||
            normalizeText(emp.username).includes(keyword) ||
            normalizeText(emp.phoneNumber).includes(keyword)
        );
    }, [employees, search]);

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto space-y-6 max-w-7xl mx-auto">
            <div className="bg-white border border-[#ebdcd0] p-6 lg:p-8 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#FAF6F0] rounded-tl-full pointer-events-none -z-10" />

                <div className="flex items-center gap-4">
                    <div className="bg-[#FAF6F0] border border-[#e5dcd3] p-3.5 rounded-xl text-[#a27b5c]">
                        <Users size={24} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-[#26170f] tracking-tight">
                            Quản lý Nhân viên
                        </h4>
                        <p className="text-stone-500 text-sm mt-1">
                            Thêm, sửa, khóa/mở tài khoản nhân viên
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="px-6 py-3.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#4a3728]/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
                >
                    <Plus size={18} className="stroke-[3]" /> Thêm nhân viên
                </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative w-full sm:w-80">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm theo tên, username, SĐT…"
                        className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#ebdcd0] rounded-xl text-sm font-medium text-[#26170f] placeholder:text-stone-400 focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none transition-all"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                            title="Xóa tìm kiếm"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
                <span className="text-xs text-stone-500 font-medium">
                    Hiển thị {filteredEmployees.length}/{employees.length} nhân viên
                </span>
            </div>

            <div className="bg-white border border-[#ebdcd0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-[#a27b5c] h-8 w-8" />
                    </div>
                ) : (
                    <EmployeeTable data={filteredEmployees} onRefresh={fetchEmployees} />
                )}
            </div>

            <EmployeeCreateModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={fetchEmployees}
                onRefresh={fetchEmployees}
            />
        </div>
    );
};

export default EmployeePage;