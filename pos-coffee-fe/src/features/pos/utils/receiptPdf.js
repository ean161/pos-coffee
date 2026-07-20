let pdfMakePromise;

const getPdfMake = () => {
    if (!pdfMakePromise) {
        pdfMakePromise = Promise.all([
            import("pdfmake/build/pdfmake.js"),
            import("pdfmake/build/vfs_fonts.js"),
        ]).then(([pdfMakeModule, fontModule]) => {
            const pdfMake = pdfMakeModule.default;
            pdfMake.addVirtualFileSystem(fontModule.default);
            return pdfMake;
        });
    }
    return pdfMakePromise;
};

const PAYMENT_LABELS = {
    CASH: "Tiền mặt",
    TRANSFER: "Chuyển khoản",
    MOMO: "MoMo",
    QR_CODE: "QR Code",
};

const ORDER_TYPE_LABELS = {
    AT_TABLE: "Tại quầy",
    TAKEAWAY: "Mang đi",
};

const formatVnd = (value) =>
    `${new Intl.NumberFormat("vi-VN").format(Number(value || 0))} VND`;

const itemDescription = (item) => {
    const options = [
        item.sizeName ? `Size ${item.sizeName}` : null,
        item.sugarLevel ? `${item.sugarLevel} đường` : null,
        item.iceLevel ? `${item.iceLevel} đá` : null,
    ].filter(Boolean);
    const toppings = (item.toppings || []).map((topping) => topping.name).filter(Boolean);

    return [
        { text: item.productName, bold: true },
        options.length ? { text: options.join(" - "), fontSize: 8, color: "#666666" } : null,
        toppings.length ? { text: `Topping: ${toppings.join(", ")}`, fontSize: 8, color: "#7f5f45" } : null,
    ].filter(Boolean);
};

export const buildReceiptDefinition = (order) => {
    const items = order.items || [];
    const orderDate = order.orderDate ? new Date(order.orderDate) : new Date();
    const invoiceNumber = order.invoiceNumber || `#${String(order.orderId || "")}`;
    const discount = Number(order.discountAmount || 0);

    return {
        pageSize: "A5",
        pageMargins: [28, 28, 28, 28],
        defaultStyle: { font: "Roboto", fontSize: 9, color: "#2c1810" },
        info: {
            title: `Hoa-don-${invoiceNumber}`,
            subject: "Hóa đơn thanh toán POS Coffee",
            author: "POS Coffee",
        },
        content: [
            { text: "POS COFFEE", style: "brand" },
            { text: "HÓA ĐƠN THANH TOÁN", style: "title" },
            { text: "Espresso Bar", alignment: "center", color: "#7d6859", margin: [0, 0, 0, 14] },
            {
                table: {
                    widths: [72, "*"],
                    body: [
                        ["Mã hóa đơn", { text: invoiceNumber, bold: true }],
                        ["Thời gian", orderDate.toLocaleString("vi-VN")],
                        ["Nhân viên", order.userFullName || "-"] ,
                        ["Khách hàng", order.customerName || "Khách lẻ"],
                        ["Loại đơn", ORDER_TYPE_LABELS[order.orderType] || order.orderType || "-"] ,
                        ...(order.tableNumber ? [["Số bàn", order.tableNumber]] : []),
                    ],
                },
                layout: "noBorders",
                margin: [0, 0, 0, 10],
            },
            {
                table: {
                    headerRows: 1,
                    widths: ["*", 24, 62],
                    body: [
                        [
                            { text: "Món", style: "tableHeader" },
                            { text: "SL", style: "tableHeader", alignment: "center" },
                            { text: "Thành tiền", style: "tableHeader", alignment: "right" },
                        ],
                        ...items.map((item) => [
                            { stack: itemDescription(item), margin: [0, 2, 0, 2] },
                            { text: String(item.quantity || 0), alignment: "center", margin: [0, 2] },
                            {
                                text: formatVnd(Number(item.lineTotal || 0) + Number(item.toppingTotal || 0)),
                                alignment: "right",
                                margin: [0, 2],
                            },
                        ]),
                    ],
                },
                layout: {
                    hLineColor: () => "#d8cec6",
                    vLineColor: () => "#d8cec6",
                    fillColor: (rowIndex) => rowIndex === 0 ? "#f1e9e2" : null,
                    paddingLeft: () => 5,
                    paddingRight: () => 5,
                    paddingTop: () => 4,
                    paddingBottom: () => 4,
                },
                margin: [0, 0, 0, 12],
            },
            {
                columns: [
                    { width: "*", text: "Tạm tính" },
                    { width: 95, text: formatVnd(order.totalAmount), alignment: "right" },
                ],
                margin: [0, 2],
            },
            ...(discount > 0 ? [{
                columns: [
                    { width: "*", text: "Giảm giá", color: "#26734d" },
                    { width: 95, text: `-${formatVnd(discount)}`, alignment: "right", color: "#26734d" },
                ],
                margin: [0, 2],
            }] : []),
            {
                canvas: [{ type: "line", x1: 0, y1: 3, x2: 363, y2: 3, lineColor: "#a27b5c" }],
                margin: [0, 6, 0, 8],
            },
            {
                columns: [
                    { width: "*", text: "THỰC THU", bold: true, fontSize: 12 },
                    { width: 120, text: formatVnd(order.finalAmount ?? order.totalAmount), bold: true, fontSize: 12, alignment: "right" },
                ],
            },
            {
                text: `Thanh toán: ${PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod || "-"}`,
                margin: [0, 7, 0, 18],
            },
            { text: "Cảm ơn quý khách và hẹn gặp lại!", alignment: "center", bold: true },
        ],
        styles: {
            brand: { fontSize: 20, bold: true, alignment: "center", color: "#4a3728" },
            title: { fontSize: 12, bold: true, alignment: "center", margin: [0, 3, 0, 2] },
            tableHeader: { bold: true, color: "#4a3728" },
        },
        footer: (currentPage, pageCount) => ({
            text: `${currentPage} / ${pageCount}`,
            alignment: "center",
            fontSize: 7,
            color: "#999999",
            margin: [0, 8, 0, 0],
        }),
    };
};

export const openReceiptPdf = async (order) => {
    const pdfTab = window.open("", "_blank");
    if (!pdfTab) throw new Error("Trình duyệt đang chặn tab in hóa đơn.");
    pdfTab.opener = null;

    try {
        const pdfMake = await getPdfMake();
        const blob = await pdfMake.createPdf(buildReceiptDefinition(order)).getBlob();
        const pdfUrl = URL.createObjectURL(blob);
        pdfTab.location.href = pdfUrl;
        window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 300000);
    } catch (error) {
        pdfTab.close();
        throw error;
    }
};
