import React, { useEffect,useState } from "react";
import { Search, Coffee, LayoutGrid, UtensilsCrossed, Loader2, CupSoda } from "lucide-react";
import { usePosMenu } from "../api/usePosMenu.js";
import { useCreateOrder } from "../api/useCreateOrder.js";
import CustomizeModal from "../components/CustomizeModal.jsx";
import CartSidebar from "../components/CartSidebar.jsx";
import { History as HistoryIcon } from "lucide-react";
import PosHeader from "../../../sharedforstaff/layout/PosHeader.jsx";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../shared/axios/axiosClient";
const formatPrice = (price) =>

    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

export default function POSPage() {

    //----------check ca----------------/

    const navigate = useNavigate();
    const [checkingShift, setCheckingShift] = useState(true);
    const [shiftOpened, setShiftOpened] = useState(false);
    const [shiftInfo, setShiftInfo] = useState(null);
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [checkOutLoading, setCheckOutLoading] = useState(false);

    //--------------------------------/


    const { data: menuData, isLoading, error } = usePosMenu();
    const createOrderMutation = useCreateOrder();

    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cart, setCart] = useState([]);

    const categories = menuData?.categories || [];
    const toppings = menuData?.toppings || [];

    const allProducts = categories.flatMap((cat) =>
        (cat.products || []).map((p) => ({ ...p, categoryName: cat.name }))
    );

    const filteredProducts = allProducts.filter((p) => {
        const matchCategory = selectedCategory === "ALL" || p.categoryName === selectedCategory;
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    useEffect(() => {
        checkCurrentShift();
    }, []);

    const checkCurrentShift = async () => {
        try {
            const res = await axiosClient.get("/shifts/status");
            setShiftInfo(res.data);
            setShiftOpened(res.data.checkedIn);
        } catch (e) {
            console.error(e);
        } finally {
            setCheckingShift(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            setCheckInLoading(true);
            await axiosClient.post("/shifts/check-in", {});
            await checkCurrentShift();
        } catch (e) {
            console.error("Check-in failed:", e);
            alert(e?.response?.data?.message || "Check-in thất bại. Vui lòng thử lại.");
        } finally {
            setCheckInLoading(false);
        }
    };

    const handleCheckOut = async () => {
        const note = window.prompt("Nhập ghi chú kết ca (tuỳ chọn):", "") || "";
        try {
            setCheckOutLoading(true);
            await axiosClient.put("/shifts/check-out", { note });
            setShiftOpened(false);
            setShiftInfo(null);
            await checkCurrentShift();
        } catch (e) {
            console.error("Check-out failed:", e);
            alert(e?.response?.data?.message || "Check-out thất bại. Vui lòng thử lại.");
        } finally {
            setCheckOutLoading(false);
        }
    };

    const handleAddToCart = (item) => {
        setCart((prev) => [...prev, item]);
    };

    const handleRemoveItem = (index) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateQuantity = (index, newQty) => {
        if (newQty <= 0) {
            handleRemoveItem(index);
            return;
        }
        setCart((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                          ...item,
                          quantity: newQty,
                          lineTotal: item.unitPrice * newQty,
                          toppingTotal: (item.toppings?.reduce((s, t) => s + Number(t.price), 0) || 0) * newQty,
                      }
                    : item
            )
        );
    };

    const handlePlaceOrder = async ({
        customerName,
        customerPhone,
        orderType,
        tableNumber,
        paymentMethod,
        voucherCode,
    }) => {
        try {
            const payload = {
                customerName,
                customerPhone,
                orderType,
                tableNumber: orderType === "AT_TABLE" ? tableNumber : null,
                paymentMethod,
                voucherCode: voucherCode || null,
                items: cart.map((item) => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    productName: item.productName,
                    variantName: item.variantName,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    sizeName: item.sizeName,
                    sugarLevel: item.sugarLevel,
                    iceLevel: item.iceLevel,
                    lineTotal: item.lineTotal,
                    toppingTotal: item.toppingTotal,
                    toppingIds: item.toppings?.map((t) => t.toppingId || t.id),
                })),
            };

            const result = await createOrderMutation.mutateAsync(payload);
            setCart([]);
            return result.data;
        } catch (err) {
            console.error("Order failed:", err);
            return null;
        }
    };

    if (checkingShift) {
        return (
            <div className="flex items-center justify-center h-screen">
                Đang kiểm tra ca làm việc...
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={40} className="animate-spin text-[#a27b5c]" />
                <span className="ml-3 text-stone-500 font-medium">Đang tải thực đơn...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-stone-500">
                <p className="font-bold">Không thể tải thực đơn</p>
                <p className="text-sm mt-1">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="flex h-full" style={{ height: "calc(100vh - 64px)" }}>
            {/* Left: Menu area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <PosHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    shiftOpened={shiftOpened}
                    onCheckIn={handleCheckIn}
                    checkInLoading={checkInLoading}
                    onCheckOut={handleCheckOut}
                    checkOutLoading={checkOutLoading}
                />

                {/* Product grid */}
                <div className="relative  flex-1 overflow-y-auto p-6 bg-[#FAF6F0]">
                    {!shiftOpened && (
                        <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                            <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">

                                <Coffee
                                    size={56}
                                    className="mx-auto text-[#a27b5c] mb-4"
                                />

                                {/* Không được phân ca */}
                                {!shiftInfo?.assigned ? (
                                    <>
                                        <h2 className="text-3xl font-bold text-red-600">
                                            Không có ca làm
                                        </h2>

                                        <p className="mt-3 text-stone-500">
                                            {shiftInfo?.message}
                                        </p>
                                    </>
                                ) : !shiftInfo?.inShiftTime ? (
                                    <>
                                        <h2 className="text-3xl font-bold text-yellow-600">
                                            Chưa tới giờ làm
                                        </h2>

                                        <p className="mt-3 text-stone-500">
                                            {shiftInfo?.message}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-3xl font-bold text-[#26170f]">
                                            Chưa check-in
                                        </h2>

                                        <p className="mt-3 text-stone-500">
                                            Bạn đã được phân ca.
                                            <br />
                                            Bấm <b>Check-in</b> ở thanh trên cùng để bắt đầu bán hàng.
                                        </p>
                                    </>
                                )}

                            </div>
                        </div>
                    )}
                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-stone-400">
                            <CupSoda size={64} className="mb-3 opacity-20" />
                            <p className="font-bold text-lg">Không có sản phẩm</p>
                            <p className="text-sm mt-1">Thử chọn danh mục khác hoặc thêm sản phẩm mới</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredProducts.map((product) => (
                                <button
                                    key={product.productId}
                                    disabled={!shiftOpened}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`group rounded-2xl p-4 shadow-sm border
        ${
                                        shiftOpened
                                            ? "bg-white hover:shadow-xl hover:-translate-y-1"
                                            : "bg-stone-100 opacity-60 cursor-not-allowed"
                                    }`}
                                >
                                    <div className="w-full h-28 rounded-xl bg-gradient-to-br from-[#f5ece1] to-[#efe6dc] flex items-center justify-center mb-3 overflow-hidden">
                                        <Coffee size={40} className="text-[#a27b5c] opacity-40 group-hover:opacity-70 transition-opacity" />
                                    </div>
                                    <p className="font-bold text-sm text-stone-800 leading-tight line-clamp-2 mb-1">{product.name}</p>
                                    <p className="text-xs text-stone-400 mb-2">{product.categoryName}</p>
                                    <p className="font-black text-[#4a3728] text-base">{formatPrice(product.basePrice)}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Cart sidebar */}
            {shiftOpened && (
                <div
                    className={!shiftOpened ? "pointer-events-none opacity-40" : ""}
                >
                    <CartSidebar
                        cart={cart}
                        onRemoveItem={handleRemoveItem}
                        onUpdateQuantity={handleUpdateQuantity}
                        onPlaceOrder={handlePlaceOrder}
                        isSubmitting={createOrderMutation.isPending}
                    />
                </div>
            )}

            {/* Customize Modal */}
            {shiftOpened && selectedProduct && (
                <CustomizeModal
                    product={selectedProduct}
                    variants={selectedProduct.variants || []}
                    toppings={toppings}
                    onAdd={handleAddToCart}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}
