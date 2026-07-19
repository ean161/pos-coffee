import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Loader2, X, Trash2, Wallet, Search } from 'lucide-react';
import employeeApi from "../../employee/api/employeeApi";
import shiftApi from "../api/shiftApi";
import { addDays, buildWeek, formatShortDate, formatWeekday, startOfWeek, toISODate } from "../utils/week";

const normalizeText = (value) =>
    (value || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

const slotColors = {
    "Sáng": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200", solid: "bg-amber-500" },
    "Chiều": { bg: "bg-sky-100", text: "text-sky-800", border: "border-sky-200", solid: "bg-sky-500" },
    "Tối": { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200", solid: "bg-indigo-500" }
};

const defaultSlotColors = { bg: "bg-[#a27b5c]/10", text: "text-[#4a3728]", border: "border-[#a27b5c]/30", solid: "bg-[#a27b5c]" };

const ShiftsPage = () => {
    const [anchorDate, setAnchorDate] = useState(() => new Date());
    const [employees, setEmployees] = useState([]);
    const [slots, setSlots] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cellModal, setCellModal] = useState(null); // { employee, slot, date }
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const week = useMemo(() => buildWeek(anchorDate), [anchorDate]);
    const fromDate = useMemo(() => toISODate(week[0]), [week]);
    const toDate = useMemo(() => toISODate(week[6]), [week]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [empRes, slotRes, assignRes] = await Promise.all([
                employeeApi.getAll(),
                shiftApi.getSlots(),
                shiftApi.getInRange(fromDate, toDate)
            ]);
            setEmployees((empRes.data || []).filter((e) => e.userStatus));
            setSlots(slotRes.data || []);
            setAssignments(assignRes.data || []);
        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu xếp ca');
        } finally {
            setLoading(false);
        }
    }, [fromDate, toDate]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError('');
            try {
                const [empRes, slotRes, assignRes] = await Promise.all([
                    employeeApi.getAll(),
                    shiftApi.getSlots(),
                    shiftApi.getInRange(fromDate, toDate)
                ]);
                if (cancelled) return;
                setEmployees((empRes.data || []).filter((e) => e.userStatus));
                setSlots(slotRes.data || []);
                setAssignments(assignRes.data || []);
            } catch (err) {
                if (!cancelled) setError(err.message || 'Không thể tải dữ liệu xếp ca');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [fromDate, toDate]);

    const filteredEmployees = useMemo(() => {
        const keyword = normalizeText(search);
        if (!keyword) return employees;
        return employees.filter((emp) =>
            normalizeText(emp.fullName).includes(keyword) ||
            normalizeText(emp.username).includes(keyword)
        );
    }, [employees, search]);

    const assignmentsByCell = useMemo(() => {
        const map = new Map();
        for (const a of assignments) {
            const key = `${a.employeeUserId}|${toISODate(a.workDate)}|${a.slotId}`;
            map.set(key, a);
        }
        return map;
    }, [assignments]);

    const assignmentsByEmployeeDay = useMemo(() => {
        const map = new Map();
        for (const a of assignments) {
            const key = `${a.employeeUserId}|${toISODate(a.workDate)}`;
            const list = map.get(key) || [];
            list.push(a);
            map.set(key, list);
        }
        return map;
    }, [assignments]);

    const openCell = (employee, slot, date) => {
        const key = `${employee.userId}|${toISODate(date)}|${slot.id}`;
        const existing = assignmentsByCell.get(key) || null;
        setCellModal({ employee, slot, date, existing });
    };

    const closeCell = useCallback(() => {
        setCellModal(null);
        fetchData();
    }, [fetchData]);

    const handleAssign = async () => {
        if (!cellModal) return;
        try {
            await shiftApi.assign({
                slotId: cellModal.slot.id,
                employeeUserId: cellModal.employee.userId,
                workDate: toISODate(cellModal.date)
            });
            setCellModal(null);
            await fetchData();
        } catch (err) {
            setError(err.message || 'Xếp ca thất bại');
        }
    };

    const handleRemove = async (assignmentId) => {
        try {
            await shiftApi.remove(assignmentId);
            setCellModal(null);
            await fetchData();
        } catch (err) {
            setError(err.message || 'Xóa ca thất bại');
        }
    };

    useEffect(() => {
        if (!cellModal) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') closeCell();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [cellModal, closeCell]);

    const colorFor = (slotName) => slotColors[slotName] || defaultSlotColors;

    const weekLabel = `${formatShortDate(week[0])} – ${formatShortDate(week[6])}`;

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto space-y-6 max-w-7xl mx-auto">
            <div className="bg-white border border-[#ebdcd0] p-6 lg:p-8 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#FAF6F0] rounded-tl-full pointer-events-none -z-10" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#FAF6F0] border border-[#e5dcd3] p-3.5 rounded-xl text-[#a27b5c]">
                            <CalendarDays size={24} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-[#26170f] tracking-tight">Xếp ca làm việc</h4>
                            <p className="text-stone-500 text-sm mt-1">Bấm vào ô để gán hoặc xóa ca theo từng nhân viên</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setAnchorDate(startOfWeek(addDays(week[0], -7)))}
                            className="p-2.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                            title="Tuần trước"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => setAnchorDate(new Date())}
                            className="px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#e5dcd3] text-sm font-bold text-[#4a3728] hover:bg-[#f0ebe5] transition-colors"
                        >
                            Tuần này
                        </button>
                        <span className="px-4 py-2 rounded-xl bg-white border border-[#ebdcd0] text-sm font-bold text-[#26170f]">
                            {weekLabel}
                        </span>
                        <button
                            onClick={() => setAnchorDate(addDays(week[0], 7))}
                            className="p-2.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                            title="Tuần sau"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm theo tên hoặc username…"
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
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                    {error}
                </div>
            )}

            <div className="bg-white border border-[#ebdcd0] rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-[#a27b5c] h-8 w-8" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-[#FAF6F0]/60 border-b border-[#ebdcd0] text-[11px] text-[#a27b5c] uppercase font-bold tracking-widest">
                                    <th className="px-4 py-4 text-left sticky left-0 bg-[#FAF6F0]/60 z-10">Nhân viên</th>
                                    {week.map((day) => (
                                        <th key={toISODate(day)} className="px-2 py-3 text-center min-w-[120px]">
                                            <div className="text-[10px] text-stone-500">{formatWeekday(day)}</div>
                                            <div className="text-base text-[#26170f] font-black mt-0.5">{formatShortDate(day)}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f7f0e9]">
                                {filteredEmployees.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-stone-400">
                                            {search ? `Không tìm thấy nhân viên phù hợp với "${search}".` : 'Chưa có nhân viên đang hoạt động.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEmployees.map((emp) => (
                                        <tr key={emp.userId} className="hover:bg-[#fcf8f2] transition-colors">
                                            <td className="px-4 py-4 sticky left-0 bg-white group-hover:bg-[#fcf8f2] z-10">
                                                <div className="font-bold text-[#26170f]">{emp.fullName}</div>
                                                <div className="text-xs text-stone-500">@{emp.username}</div>
                                            </td>
                                            {week.map((day) => {
                                                const dayKey = `${emp.userId}|${toISODate(day)}`;
                                                const list = assignmentsByEmployeeDay.get(dayKey) || [];
                                                return (
                                                    <td key={dayKey} className="px-2 py-3 align-top">
                                                        <div className="flex flex-col gap-1">
                                                            {slots.map((slot) => {
                                                                const cellKey = `${dayKey}|${slot.id}`;
                                                                const existing = assignmentsByCell.get(cellKey);
                                                                const color = colorFor(slot.name);
                                                                return (
                                                                    <button
                                                                        key={cellKey}
                                                                        onClick={() => openCell(emp, slot, day)}
                                                                        className={`w-full text-left px-2 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                                                                            existing
                                                                                ? `${color.solid} text-white border-transparent shadow-sm hover:opacity-90`
                                                                                : `${color.bg} ${color.text} ${color.border} hover:brightness-95`
                                                                        }`}
                                                                        title={existing ? 'Bấm để xem/xóa' : 'Bấm để xếp ca'}
                                                                    >
                                                                        <div className="flex items-center justify-between gap-1">
                                                                            <span>{slot.name}</span>
                                                                            <span className="opacity-80 font-medium">{slot.startTime.slice(0, 5)}</span>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                            {list.length === 0 && (
                                                                <div className="text-[10px] text-stone-300 text-center">—</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {cellModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeCell();
                    }}
                >
                    <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-sm w-full overflow-hidden shadow-2xl relative">
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${colorFor(cellModal.slot.name).solid}`} />
                        <div className="p-5 border-b border-[#f7f0e9] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Wallet className="text-[#a27b5c]" size={18} />
                                <h3 className="font-black text-base text-[#26170f]">Chi tiết ca</h3>
                            </div>
                            <button
                                type="button"
                                onClick={closeCell}
                                className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="p-3 bg-[#FAF6F0] rounded-xl text-xs text-stone-600 space-y-1">
                                <div>
                                    <span className="font-bold text-[#26170f]">{cellModal.employee.fullName}</span>
                                    <span className="mx-1">•</span>
                                    <span>@{cellModal.employee.username}</span>
                                </div>
                                <div>
                                    Ngày: <span className="font-bold text-[#26170f]">{formatShortDate(cellModal.date)}/{cellModal.date.getFullYear()}</span>
                                </div>
                                <div>
                                    Ca: <span className="font-bold text-[#26170f]">{cellModal.slot.name}</span>
                                    <span className="mx-1">•</span>
                                    <span>{cellModal.slot.startTime.slice(0, 5)} – {cellModal.slot.endTime.slice(0, 5)}</span>
                                </div>
                            </div>

                            {cellModal.existing ? (
                                <button
                                    onClick={() => handleRemove(cellModal.existing.id)}
                                    className="w-full px-4 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                                >
                                    <Trash2 size={14} /> Hủy ca này
                                </button>
                            ) : (
                                <button
                                    onClick={handleAssign}
                                    className="w-full px-4 py-2.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold transition-colors"
                                >
                                    Xếp ca này
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftsPage;
