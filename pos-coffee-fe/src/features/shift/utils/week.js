export const toISODate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday as first day
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

export const buildWeek = (anchorDate) => {
    const start = startOfWeek(anchorDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const formatShortDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

export const formatWeekday = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('vi-VN', { weekday: 'short' });
};

export const isSameDay = (a, b) => toISODate(a) === toISODate(b);
