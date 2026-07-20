const formatNumber = (value) => {
    if (value === null || value === undefined) return "—";
    return new Intl.NumberFormat("vi-VN").format(value);
};

const formatDateTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatCurrency = (value) => {
    if (value === null || value === undefined) return "—";
    return `${formatNumber(value)} đ`;
};

export { formatNumber, formatDateTime, formatCurrency };
