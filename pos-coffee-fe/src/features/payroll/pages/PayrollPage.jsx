import { useEffect, useMemo, useState } from 'react';
import { Banknote, Calendar, FileSpreadsheet, Loader2, Search, X, AlertTriangle, Clock } from 'lucide-react';
import payrollApi from "../api/payrollApi";
import { endOfMonth, formatCurrency, formatDateTime, startOfMonth, toISODate } from "../utils/date";

const PayrollPage = () => {
    const today = useMemo(() => new Date(), []);
    const [from, setFrom] = useState(() => toISODate(startOfMonth(today)));
    const [to, setTo] = useState(() => toISODate(endOfMonth(today)));
    const [rangeMode, setRangeMode] = useState('month'); // 'month' | 'range'
    const [month, setMonth] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [detailEmployee, setDetailEmployee] = useState(null); // { employee, entries }
    const [detailLoading, setDetailLoading] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [editClockOut, setEditClockOut] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError('');
            try {
                const res = await payrollApi.getSummary(from, to);
                if (!cancelled) setSummary(res.data || []);
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'Không thể tải bảng lương');
                    setSummary([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [from, to]);

    const handleMonthChange = (value) => {
        setMonth(value);
        const [yearStr, monthStr] = value.split('-');
        const y = parseInt(yearStr, 10);
        const m = parseInt(monthStr, 10);
        setFrom(toISODate(new Date(y, m - 1, 1)));
        setTo(toISODate(endOfMonth(new Date(y, m - 1, 1))));
    };

    const totals = useMemo(() => {
        return summary.reduce(
            (acc, row) => ({
                hours: acc.hours + Number(row.totalHours || 0),
                wage: acc.wage + Number(row.grossSalary || 0),
                shifts: acc.shifts + Number(row.validShiftCount || 0)
            }),
            { hours: 0, wage: 0, shifts: 0 }
        );
    }, [summary]);

    const filteredSummary = useMemo(() => {
        const keyword = (search || '').toLowerCase().trim();
        if (!keyword) return summary;
        return summary.filter((row) =>
            (row.fullName || '').toLowerCase().includes(keyword) ||
            (row.username || '').toLowerCase().includes(keyword) ||
            (row.employeeCode || '').toLowerCase().includes(keyword) ||
            (row.phoneNumber || '').toLowerCase().includes(keyword)
        );
    }, [summary, search]);

    const openDetail = async (employee) => {
        setDetailEmployee({ employee, entries: [] });
        setDetailLoading(true);
        try {
            const res = await payrollApi.getDetail(employee.employeeId, from, to);
            setDetailEmployee({ employee, entries: res.data || [] });
        } catch (err) {
            setDetailEmployee({ employee, entries: [], error: err.message || 'Lỗi tải chi tiết' });
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetail = () => setDetailEmployee(null);

    const beginEdit = (entry) => {
        setEditingEntry(entry);
        setEditClockOut(entry.clockOutTime ? toLocalDateTimeInput(entry.clockOutTime) : '');
    };

    const saveEdit = async () => {
        if (!editingEntry || !editClockOut) return;
        setError('Chức năng chỉnh sửa giờ check-out đã được thay thế bằng logic tự động.');
        setEditingEntry(null);
        setEditClockOut('');
    };

    useEffect(() => {
        if (!detailEmployee) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') closeDetail();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [detailEmployee]);

    const handleExport = async () => {
        try {
            const res = await fetch(payrollApi.exportUrl(from, to), {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}` }
            });
            if (!res.ok) {
                throw new Error('Xuất báo cáo thất bại');
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Bang-Luong-${from}_${to}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.message || 'Không thể xuất file');
        }
    };

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto space-y-6 max-w-7xl mx-auto">
            <div className="bg-white border border-[#ebdcd0] p-6 lg:p-8 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#FAF6F0] rounded-tl-full pointer-events-none -z-10" />
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#FAF6F0] border border-[#e5dcd3] p-3.5 rounded-xl text-[#a27b5c]">
                            <Banknote size={24} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-[#26170f] tracking-tight">Bảng tính lương tổng hợp</h4>
                            <p className="text-stone-500 text-sm mt-1">UC23 — Tổng hợp lương dựa trên chấm công thực tế × mức lương giờ</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex rounded-xl bg-[#FAF6F0] border border-[#e5dcd3] p-1 text-xs font-bold">
                            <button
                                onClick={() => {
                                    setRangeMode('month');
                                    handleMonthChange(month);
                                }}
                                className={`px-3 py-1.5 rounded-lg ${rangeMode === 'month' ? 'bg-white shadow text-[#26170f]' : 'text-stone-500'}`}
                            >
                                Theo tháng
                            </button>
                            <button
                                onClick={() => setRangeMode('range')}
                                className={`px-3 py-1.5 rounded-lg ${rangeMode === 'range' ? 'bg-white shadow text-[#26170f]' : 'text-stone-500'}`}
                            >
                                Khoảng ngày
                            </button>
                        </div>

                        {rangeMode === 'month' ? (
                            <input
                                type="month"
                                value={month}
                                onChange={(e) => handleMonthChange(e.target.value)}
                                className="px-3 py-2 bg-white border border-[#ebdcd0] rounded-xl text-sm font-bold text-[#26170f] focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none"
                            />
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="px-3 py-2 bg-white border border-[#ebdcd0] rounded-xl text-sm font-bold text-[#26170f] focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none"
                                />
                                <span className="text-stone-400 text-xs">→</span>
                                <input
                                    type="date"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="px-3 py-2 bg-white border border-[#ebdcd0] rounded-xl text-sm font-bold text-[#26170f] focus:ring-4 focus:ring-[#a27b5c]/10 focus:border-[#a27b5c] outline-none"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-[#4a3728] hover:bg-[#35271c] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                        >
                            <FileSpreadsheet size={14} /> Xuất Excel
                        </button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#FAF6F0] border border-[#e5dcd3] rounded-xl p-4">
                        <div className="text-xs text-stone-500 font-bold uppercase tracking-wide">Tổng giờ làm</div>
                        <div className="mt-1 text-2xl font-black text-[#26170f]">{formatCurrency(totals.hours)}<span className="text-sm font-medium text-stone-500 ml-1">giờ</span></div>
                    </div>
                    <div className="bg-[#FAF6F0] border border-[#e5dcd3] rounded-xl p-4">
                        <div className="text-xs text-stone-500 font-bold uppercase tracking-wide">Tổng ca hợp lệ</div>
                        <div className="mt-1 text-2xl font-black text-[#26170f]">{totals.shifts}<span className="text-sm font-medium text-stone-500 ml-1">ca</span></div>
                    </div>
                    <div className="bg-[#FAF6F0] border border-[#e5dcd3] rounded-xl p-4">
                        <div className="text-xs text-stone-500 font-bold uppercase tracking-wide">Tổng tiền lương</div>
                        <div className="mt-1 text-2xl font-black text-[#4a3728]">{formatCurrency(totals.wage)}<span className="text-sm font-medium text-stone-500 ml-1">đ</span></div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                    {error}
                </div>
            )}

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
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
                <span className="text-xs text-stone-500 font-medium">
                    Hiển thị {filteredSummary.length}/{summary.length} nhân viên
                </span>
            </div>

            <div className="bg-white border border-[#ebdcd0] rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-[#a27b5c] h-8 w-8" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[900px]">
                            <thead>
                            <tr className="bg-[#FAF6F0]/60 border-b border-[#ebdcd0] text-[11px] text-[#a27b5c] uppercase font-bold tracking-widest">
                                <th className="px-4 py-4 text-left">Mã NV</th>
                                <th className="px-4 py-4 text-left">Nhân viên</th>
                                <th className="px-4 py-4 text-left">SĐT</th>
                                <th className="px-4 py-4 text-center">Số ca hợp lệ</th>
                                <th className="px-4 py-4 text-right">Tổng giờ</th>
                                <th className="px-4 py-4 text-right">Lương/giờ</th>
                                <th className="px-4 py-4 text-right">Thành tiền</th>
                                <th className="px-4 py-4 text-center">Chi tiết</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f7f0e9]">
                            {filteredSummary.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-stone-400">
                                        {summary.length === 0 ? 'Chưa có dữ liệu chấm công trong khoảng này.' : 'Không tìm thấy nhân viên phù hợp.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredSummary.map((row) => (
                                    <tr key={row.employeeId} className="hover:bg-[#fcf8f2] transition-colors">
                                        <td className="px-4 py-4 font-bold text-[#26170f]">{row.employeeCode}</td>
                                        <td className="px-4 py-4">
                                            <div className="font-bold text-[#26170f]">{row.fullName}</div>
                                            <div className="text-xs text-stone-500">@{row.username}</div>
                                        </td>
                                        <td className="px-4 py-4 text-stone-700">{row.phoneNumber || '—'}</td>
                                        <td className="px-4 py-4 text-center">
                                                <span className="px-2 py-0.5 bg-[#a27b5c]/10 text-[#4a3728] rounded-md font-bold text-xs">
                                                    {row.validShiftCount} ca
                                                </span>
                                        </td>
                                        <td className="px-4 py-4 text-right font-bold text-[#26170f]">{formatCurrency(row.totalHours)}</td>
                                        <td className="px-4 py-4 text-right text-stone-700">{formatCurrency(row.hourlyWage)} đ</td>
                                        <td className="px-4 py-4 text-right font-black text-[#4a3728]">{formatCurrency(row.grossSalary)} đ</td>
                                        <td className="px-4 py-4 text-center">
                                            <button
                                                onClick={() => openDetail(row)}
                                                className="px-3 py-1.5 text-xs font-bold text-[#4a3728] bg-[#FAF6F0] hover:bg-[#f0ebe5] border border-[#e5dcd3] rounded-lg"
                                            >
                                                Xem
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {detailEmployee && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeDetail();
                    }}
                >
                    <div className="bg-white rounded-2xl border border-[#ebdcd0] max-w-3xl w-full overflow-hidden shadow-2xl relative">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#a27b5c]" />
                        <div className="p-5 border-b border-[#f7f0e9] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Calendar className="text-[#a27b5c]" size={18} />
                                <div>
                                    <h3 className="font-black text-base text-[#26170f]">{detailEmployee.employee.fullName}</h3>
                                    <div className="text-xs text-stone-500">
                                        {detailEmployee.employee.employeeCode} • Lương/giờ {formatCurrency(detailEmployee.employee.hourlyWage)} đ
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeDetail}
                                className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                            {detailLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="animate-spin text-[#a27b5c] h-6 w-6" />
                                </div>
                            ) : (detailEmployee.entries || []).length === 0 ? (
                                <div className="text-center py-12 text-stone-400 text-sm">
                                    Không có ca chấm công trong khoảng này.
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="text-[11px] uppercase text-stone-500 font-bold tracking-widest">
                                    <tr className="border-b border-[#f7f0e9]">
                                        <th className="py-2 text-left">Ca</th>
                                        <th className="py-2 text-left">Clock-in</th>
                                        <th className="py-2 text-left">Clock-out</th>
                                        <th className="py-2 text-right">Giờ</th>
                                        <th className="py-2 text-center">Trạng thái</th>
                                        <th className="py-2 text-right"></th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f7f0e9]">
                                    {detailEmployee.entries.map((entry) => {
                                        const closed = !!entry.clockOutTime;
                                        return (
                                            <tr key={entry.shiftId}>
                                                <td className="py-2.5 text-stone-600 font-medium">
                                                    {entry.slotName || '—'}
                                                </td>
                                                <td className="py-2.5 font-medium text-[#26170f]">
                                                    {formatDateTime(entry.clockInTime)}
                                                </td>
                                                <td className="py-2.5">
                                                    {editingEntry?.shiftId === entry.shiftId ? (
                                                        <input
                                                            type="datetime-local"
                                                            value={editClockOut}
                                                            onChange={(e) => setEditClockOut(e.target.value)}
                                                            className="px-2 py-1 border border-[#ebdcd0] rounded-lg text-xs"
                                                        />
                                                    ) : (
                                                        <span className={entry.clockOutTime ? 'text-stone-700' : 'text-red-600 italic'}>
                                                                {entry.clockOutTime ? formatDateTime(entry.clockOutTime) : 'Chưa chốt'}
                                                            </span>
                                                    )}
                                                </td>
                                                <td className="py-2.5 text-right font-bold text-[#26170f]">{formatCurrency(entry.workedHours)}</td>
                                                <td className="py-2.5 text-center">
                                                    {closed ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                                                                Hợp lệ
                                                            </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 rounded-md">
                                                                <AlertTriangle size={12} /> Chưa chốt
                                                            </span>
                                                    )}
                                                </td>
                                                <td className="py-2.5 text-right">
                                                    {editingEntry?.shiftId === entry.shiftId ? (
                                                        <div className="flex justify-end gap-1">
                                                            <button onClick={saveEdit} className="px-2 py-1 text-xs font-bold bg-[#4a3728] text-white rounded-md">
                                                                Lưu
                                                            </button>
                                                            <button onClick={() => setEditingEntry(null)} className="px-2 py-1 text-xs font-bold bg-stone-100 text-stone-700 rounded-md">
                                                                Hủy
                                                            </button>
                                                        </div>
                                                    ) : !closed ? (
                                                        <button
                                                            onClick={() => beginEdit(entry)}
                                                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-[#4a3728] bg-[#FAF6F0] border border-[#e5dcd3] rounded-md hover:bg-[#f0ebe5]"
                                                        >
                                                            <Clock size={12} /> Chốt giờ
                                                        </button>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="p-4 border-t border-[#f7f0e9] flex justify-between items-center text-xs text-stone-500">
                            <span>Nhân viên bất thường có thể được chỉnh Clock-out thủ công trước khi tính lương.</span>
                            <button onClick={closeDetail} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg font-bold">Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const toLocalDateTimeInput = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default PayrollPage;