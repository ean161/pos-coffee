export const formatVND = (amount) => {
    if (amount === null || amount === undefined || amount === '') return '-';
    const number = typeof amount === 'number' ? amount : Number(amount);
    if (Number.isNaN(number)) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

export const parseWageInput = (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isNaN(number) ? null : number;
};