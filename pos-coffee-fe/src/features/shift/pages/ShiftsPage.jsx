import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Loader2,
    X,
    Trash2,
    Plus,
    Edit,
    Wallet,
    Search,
    Clock,
    Users,
} from 'lucide-react';
import employeeApi from "../../employee/api/employeeApi";
import shiftApi from "../api/shiftApi";
import { addDays, buildWeek, formatShortDate, formatWeekday, startOfWeek, toISODate } from "../utils/week";

// Template 3 ca cố định — luôn hiển thị trong mọi ô (NV × ngày) bất kể DB có slot chưa.
// Khi click + trên template mà chưa có slot thật, hệ thống tự tạo slot theo template
// rồi mới xếp nhân viên.
const DEFAULT_SHIFTS = [
    { name: 'Sáng',  startTime: '07:00', endTime: '12:00' },
    { name: 'Chiều', startTime: '12:00', endTime: '17:00' },
    { name: 'Tối',   startTime: '17:00', endTime: '23:59' },
];

const normalizeText = (value) =>
    (value || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

const ShiftsPage = () => {
    const [anchorDate, setAnchorDate] = useState(() => new Date());
    const [employees, setEmployees] = useState([]);
    const [slots, setSlots] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    // Modal state — 3 loại:
    // 'assign'  : xếp nhiều NV vào 1 slot của 1 ngày
    // 'slot'    : CRUD slot (create/update)
    const [modal, setModal] = useState(null);

    const week = useMemo(() => buildWeek(anchorDate), [anchorDate]);
    const fromDate = useMemo(() => toISODate(week[0]), [week]);
    const toDate = useMemo(() => toISODate(week[6]), [week]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Đảm bảo luôn có 3 ca mặc định (Sáng/Chiều/Tối) cho tuần đang xem.
            // Endpoint này idempotent — mỗi tuần reload sẽ lấp slot còn thiếu.
            try {
                await shiftApi.seedDefaultSlots(60);
            } catch (seedErr) {
                console.warn('seedDefaultSlots failed:', seedErr?.message || seedErr);
            }

            const [empRes, slotRes, assignRes] = await Promise.all([
                employeeApi.getAll(),
                shiftApi.getSlots(fromDate, toDate),
                shiftApi.getInRange(fromDate, toDate),
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
        fetchData().then(() => {
            if (cancelled) setLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, [fetchData]);

    const filteredEmployees = useMemo(() => {
        const keyword = normalizeText(search);
        if (!keyword) return employees;
        return employees.filter(
            (emp) =>
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

    const openAssignModal = (slot, date, employee) => {
        setModal({ type: 'assign', slot, date, employee });
    };

    const openCreateSlot = () => {
        const today = toISODate(week[0]);
        setModal({
            type: 'slot',
            mode: 'create',
            form: { name: '', startTime: '20:00', endTime: '22:00', workDate: today, active: true },
        });
    };

    const openEditSlot = (slot) => {
        setModal({
            type: 'slot',
            mode: 'edit',
            slotId: slot.id,
            form: {
                name: slot.name,
                startTime: (slot.startTime || '').slice(0, 5),
                endTime: (slot.endTime || '').slice(0, 5),
                workDate: slot.workDate || toISODate(week[0]),
                active: slot.active !== false,
            },
        });
    };

    const closeModal = () => setModal(null);

    // ───── handlers ─────
    const handleAssign = async () => {
        if (!modal?.employee) {
            setError('Không xác định được nhân viên cho ô này');
            return;
        }
        try {
            // Nếu bấm vào ô template (chưa có slot thật trong DB), tạo slot trước
            // rồi mới gọi assign. Idempotent phía server nhờ existsByNameAndWorkDate.
            let slot = modal.slot;
            if (!slot.id) {
                const created = await shiftApi.createSlot({
                    name: slot.name,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    workDate: toISODate(modal.date),
                    active: true,
                });
                slot = created.data;
            }
            await shiftApi.assign({
                slotId: slot.id,
                employeeUserIds: [modal.employee.userId],
                workDate: toISODate(modal.date),
            });
            closeModal();
            await fetchData();
        } catch (err) {
            const msg =
                err?.response?.data?.message || err.message || 'Xếp ca thất bại';
            setError(msg);
        }
    };

    const handleRemove = async (assignmentId) => {
        try {
            await shiftApi.remove(assignmentId);
            await fetchData();
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Xóa ca thất bại');
        }
    };

    const handleDeleteSlot = async (slotId) => {
        if (!window.confirm('Xóa ca này? (Nếu đang có assignment sẽ thất bại)')) return;
        try {
            await shiftApi.deleteSlot(slotId);
            await fetchData();
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Xóa ca thất bại');
        }
    };

    const handleSaveSlot = async () => {
        const { mode, slotId, form } = modal;
        if (!form.name?.trim()) {
            setError('Tên ca không được trống');
            return;
        }
        if (!form.workDate) {
            setError('Ngày của ca không được trống');
            return;
        }
        try {
            const payload = {
                name: form.name.trim(),
                startTime: form.startTime,
                endTime: form.endTime,
                workDate: form.workDate,
                active: form.active,
            };
            if (mode === 'create') {
                await shiftApi.createSlot(payload);
            } else {
                await shiftApi.updateSlot(slotId, payload);
            }
            closeModal();
            await fetchData();
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Lưu ca thất bại');
        }
    };

    useEffect(() => {
        if (!modal) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [modal]);

    const weekLabel = `${formatShortDate(week[0])} – ${formatShortDate(week[6])}`;

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto space-y-6 max-w-7xl mx-auto">
            {/* HEADER */}
            <div className="bg-white border border-[#ebdcd0] p-6 lg:p-8 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#FAF6F0] rounded-tl-full pointer-events-none -z-10" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#FAF6F0] border border-[#e5dcd3] p-3.5 rounded-xl text-[#a27b5c]">
                            <CalendarDays size={24} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-[#26170f] tracking-tight">
                                Xếp ca làm việc
                            </h4>
                            <p className="text-stone-500 text-sm mt-1">
                                Bấm vào ô để gán nhiều nhân viên vào ca, hoặc tạo ca tùy chỉnh
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={openCreateSlot}
                            className="px-3 py-2 rounded-xl bg-[#a27b5c] text-white hover:bg-[#8a6849] font-bold text-sm flex items-center gap-1.5"
                        >
                            <Plus size={16} /> Thêm ca
                        </button>
                        <button
                            onClick={() => setAnchorDate(startOfWeek(addDays(week[0], -7)))}
                            className="p-2.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => setAnchorDate(new Date())}
                            className="px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#e5dcd3] text-sm font-bold text-[#4a3728] hover:bg-[#f0ebe5]"
                        >
                            Tuần này
                        </button>
                        <span className="px-4 py-2 rounded-xl bg-white border border-[#ebdcd0] text-sm font-bold text-[#26170f]">
                            {weekLabel}
                        </span>
                        <button
                            onClick={() => setAnchorDate(addDays(week[0], 7))}
                            className="p-2.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm theo tên hoặc username…"
                            className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#ebdcd0] rounded-xl text-sm font-medium text-[#26170f] placeholder:text-stone-400 focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none"
                        />
                    </div>
                    <span className="text-xs text-stone-500 font-medium">
                        Hiển thị {filteredEmployees.length}/{employees.length} nhân viên
                    </span>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex justify-between gap-2">
                    <span>{error}</span>
                    <button onClick={() => setError('')}>
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* SLOT BAR */}
            {slots.length > 0 && (
                <div className="bg-white border border-[#ebdcd0] rounded-2xl shadow-sm p-4 flex flex-wrap gap-2">
                    {slots.map((slot) => (
                        <div
                            key={slot.id}
                            className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF6F0] border border-[#ebdcd0] rounded-lg text-sm"
                        >
                            <Clock size={14} className="text-[#a27b5c]" />
                            <span className="font-bold text-[#26170f]">{slot.name}</span>
                            <span className="text-xs text-stone-500">
                                {(slot.startTime || '').slice(0, 5)}–
                                {(slot.endTime || '').slice(0, 5)}
                            </span>
                            {!slot.active && (
                                <span className="text-[10px] text-stone-400">(tắt)</span>
                            )}
                            <button
                                onClick={() => openEditSlot(slot)}
                                className="p-1 rounded hover:bg-white text-stone-500"
                                title="Sửa ca"
                            >
                                <Edit size={12} />
                            </button>
                            <button
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="p-1 rounded hover:bg-red-50 text-red-500"
                                title="Xóa ca"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* TIMETABLE */}
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
                                    <th className="px-4 py-4 text-left sticky left-0 bg-[#FAF6F0]/60 z-10">
                                        Nhân viên
                                    </th>
                                    {week.map((day) => (
                                        <th
                                            key={toISODate(day)}
                                            className="px-2 py-3 text-center min-w-[120px]"
                                        >
                                            <div className="text-[10px] text-stone-500">
                                                {formatWeekday(day)}
                                            </div>
                                            <div className="text-base text-[#26170f] font-black mt-0.5">
                                                {formatShortDate(day)}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f7f0e9]">
                                {filteredEmployees.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-6 py-12 text-center text-stone-400"
                                        >
                                            {search
                                                ? `Không tìm thấy nhân viên phù hợp với "${search}".`
                                                : 'Chưa có nhân viên đang hoạt động.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEmployees.map((emp) => (
                                        <tr
                                            key={emp.userId}
                                            className="hover:bg-[#fcf8f2]"
                                        >
                                            <td className="px-4 py-4 sticky left-0 bg-white z-10">
                                                <div className="font-bold text-[#26170f]">
                                                    {emp.fullName}
                                                </div>
                                                <div className="text-xs text-stone-500">
                                                    @{emp.username}
                                                </div>
                                            </td>
                                            {week.map((day) => {
                                                const dayISO = toISODate(day);
                                                // Mỗi ô (NV × ngày) gồm:
                                                //   - 3 ca cố định (Sáng/Chiều/Tối). Nếu DB có slot thật
                                                //     trùng name + workDate thì dùng slot thật (giờ đã sửa).
                                                //   - Cộng thêm các slot thật của ngày đó nhưng có tên
                                                //     nằm ngoài 3 ca cố định (ca user tự tạo).
                                                // Dedupe theo (name, workDate) để nếu DB có nhiều slot trùng
                                                // (do import cũ / seed chạy nhiều lần) vẫn chỉ hiển thị 1.
                                                const extraRaw = slots.filter(
                                                    (s) =>
                                                        toISODate(s.workDate) === dayISO &&
                                                        !DEFAULT_SHIFTS.some((t) => t.name === s.name)
                                                );
                                                const seenExtra = new Set();
                                                const extraSlots = extraRaw.filter((s) => {
                                                    if (seenExtra.has(s.name)) return false;
                                                    seenExtra.add(s.name);
                                                    return true;
                                                });

                                                const cells = [];
                                                DEFAULT_SHIFTS.forEach((tpl) => {
                                                    // Trong 3 ca cố định cũng dedupe — lấy slot thật đầu tiên
                                                    // trùng name + workDate để tránh render trùng khi DB bẩn.
                                                    const realSlot = slots.find(
                                                        (s) =>
                                                            toISODate(s.workDate) === dayISO &&
                                                            s.name === tpl.name
                                                    );
                                                    const slot = realSlot || {
                                                        id: null,
                                                        name: tpl.name,
                                                        startTime: tpl.startTime,
                                                        endTime: tpl.endTime,
                                                        workDate: dayISO,
                                                        active: true,
                                                        _template: true,
                                                    };
                                                    const key = `${emp.userId}|${dayISO}|${slot.id ?? `tpl:${tpl.name}`}`;
                                                    const existing = slot.id
                                                        ? assignmentsByCell.get(
                                                              `${emp.userId}|${dayISO}|${slot.id}`
                                                          )
                                                        : null;
                                                    cells.push({ key, slot, existing, template: !realSlot });
                                                });
                                                extraSlots.forEach((slot) => {
                                                    const key = `${emp.userId}|${dayISO}|${slot.id}`;
                                                    const existing = assignmentsByCell.get(key);
                                                    cells.push({ key, slot, existing, template: false });
                                                });
                                                return (
                                                    <td
                                                        key={dayISO}
                                                        className="px-2 py-3 align-top"
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            {cells.map(({ key, slot, existing, template }) => (
                                                                <div
                                                                    key={key}
                                                                    className={`w-full text-left px-2 py-1.5 rounded-lg border text-[11px] font-bold flex flex-col gap-0.5 ${
                                                                        existing
                                                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                                            : template
                                                                                ? 'bg-amber-50 text-amber-800 border-amber-200 border-dashed'
                                                                                : 'bg-stone-50 text-stone-500 border-stone-200'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between gap-1">
                                                                        <span className="truncate">
                                                                            {slot.name}
                                                                        </span>
                                                                        {existing ? (
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleRemove(
                                                                                        existing.id
                                                                                    )
                                                                                }
                                                                                className="opacity-70 hover:opacity-100"
                                                                                title="Hủy ca này"
                                                                            >
                                                                                <X size={12} />
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() =>
                                                                                    openAssignModal(
                                                                                        slot,
                                                                                        day,
                                                                                        emp
                                                                                    )
                                                                                }
                                                                                className="opacity-70 hover:opacity-100"
                                                                                title={
                                                                                    template
                                                                                        ? 'Tạo ca và xếp NV'
                                                                                        : 'Xếp NV vào ca này'
                                                                                }
                                                                            >
                                                                                <Plus size={12} />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-[10px] font-medium text-stone-500">
                                                                        {(slot.startTime || '').slice(0, 5)}
                                                                        <span className="opacity-50 mx-1">–</span>
                                                                        {(slot.endTime || '').slice(0, 5)}
                                                                    </div>
                                                                </div>
                                                            ))}
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

            {/* MODAL: ASSIGN (NV theo row đang click) */}
            {modal?.type === 'assign' && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-md w-full overflow-hidden shadow-2xl">
                        <div className="p-5 border-b border-[#f7f0e9] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Users className="text-[#a27b5c]" size={18} />
                                <h3 className="font-black text-base text-[#26170f]">
                                    Xếp ca {modal.slot.name}
                                </h3>
                            </div>
                            <button onClick={closeModal} className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="text-xs text-stone-600 bg-[#FAF6F0] rounded-xl p-3">
                                <div className="font-bold text-[#26170f]">
                                    Ngày: {formatShortDate(modal.date)}/{modal.date.getFullYear()}
                                </div>
                                <div>
                                    Khung giờ: {(modal.slot.startTime || '').slice(0, 5)} –{' '}
                                    {(modal.slot.endTime || '').slice(0, 5)}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs font-bold text-stone-600 mb-2">
                                    Nhân viên
                                </div>
                                <div className="flex items-center justify-between border border-[#ebdcd0] rounded-xl px-3 py-2.5 bg-[#FAF6F0]">
                                    <div>
                                        <div className="text-sm font-bold text-[#26170f]">
                                            {modal.employee.fullName}
                                        </div>
                                        <div className="text-xs text-stone-500">
                                            @{modal.employee.username}
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-bold text-[#a27b5c] uppercase tracking-wider">
                                        Đã chọn
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleAssign}
                                className="w-full px-4 py-2.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold transition-colors"
                            >
                                Xếp ca cho {modal.employee.fullName}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: SLOT CRUD */}
            {modal?.type === 'slot' && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-sm w-full overflow-hidden shadow-2xl">
                        <div className="p-5 border-b border-[#f7f0e9] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Wallet className="text-[#a27b5c]" size={18} />
                                <h3 className="font-black text-base text-[#26170f]">
                                    {modal.mode === 'create' ? 'Tạo ca mới' : 'Sửa ca'}
                                </h3>
                            </div>
                            <button onClick={closeModal} className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-5 space-y-3">
                            <div>
                                <label className="text-xs font-bold text-stone-600">Tên ca</label>
                                <input
                                    type="text"
                                    value={modal.form.name}
                                    onChange={(e) =>
                                        setModal({
                                            ...modal,
                                            form: { ...modal.form, name: e.target.value },
                                        })
                                    }
                                    placeholder="VD: Ca sáng, Ca tối cuối tuần…"
                                    className="w-full mt-1 px-3 py-2 border border-[#ebdcd0] rounded-lg outline-none focus:ring-2 focus:ring-[#a27b5c]/20 focus:border-[#a27b5c]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-stone-600">Giờ bắt đầu</label>
                                    <input
                                        type="time"
                                        value={modal.form.startTime}
                                        onChange={(e) =>
                                            setModal({
                                                ...modal,
                                                form: { ...modal.form, startTime: e.target.value },
                                            })
                                        }
                                        className="w-full mt-1 px-3 py-2 border border-[#ebdcd0] rounded-lg outline-none focus:ring-2 focus:ring-[#a27b5c]/20 focus:border-[#a27b5c]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-stone-600">Giờ kết thúc</label>
                                    <input
                                        type="time"
                                        value={modal.form.endTime}
                                        onChange={(e) =>
                                            setModal({
                                                ...modal,
                                                form: { ...modal.form, endTime: e.target.value },
                                            })
                                        }
                                        className="w-full mt-1 px-3 py-2 border border-[#ebdcd0] rounded-lg outline-none focus:ring-2 focus:ring-[#a27b5c]/20 focus:border-[#a27b5c]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-600">Ngày của ca</label>
                                <input
                                    type="date"
                                    value={modal.form.workDate}
                                    onChange={(e) =>
                                        setModal({
                                            ...modal,
                                            form: { ...modal.form, workDate: e.target.value },
                                        })
                                    }
                                    className="w-full mt-1 px-3 py-2 border border-[#ebdcd0] rounded-lg outline-none focus:ring-2 focus:ring-[#a27b5c]/20 focus:border-[#a27b5c]"
                                />
                                <p className="text-[10px] text-stone-500 mt-1">
                                    Ca này chỉ hiển thị ở đúng cột ngày đã chọn.
                                </p>
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={modal.form.active}
                                    onChange={(e) =>
                                        setModal({
                                            ...modal,
                                            form: { ...modal.form, active: e.target.checked },
                                        })
                                    }
                                />
                                <span>Đang hoạt động</span>
                            </label>
                            <button
                                onClick={handleSaveSlot}
                                className="w-full px-4 py-2.5 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl font-bold"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftsPage;