import React, { useState } from "react";
import { Search, Coffee, LayoutGrid, UtensilsCrossed, Loader2, CupSoda } from "lucide-react";
import { usePosMenu } from "../api/usePosMenu.js";
import { useCreateOrder } from "../api/useCreateOrder.js";
import CustomizeModal from "../components/CustomizeModal.jsx";
import CartSidebar from "../components/CartSidebar.jsx";

const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

export default function POSPage() {
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
                <div className="bg-white border-b border-stone-200 px-6 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <h1 className="text-2xl font-black text-[#26170f] flex items-center gap-2">
                            <Coffee size={28} className="text-[#a27b5c]" />
                            POS Coffee
                        </h1>
                        <div className="ml-auto flex items-center gap-2 text-xs text-stone-500">
                            <UtensilsCrossed size={14} />
                            <span>Bán hàng</span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-4">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-100 border border-stone-200 focus:outline-none focus:border-[#a27b5c] text-sm font-medium placeholder:text-stone-400"
                        />
                    </div>

                    {/* Category tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        <button
                            onClick={() => setSelectedCategory("ALL")}
                            className={`flex-shrink-0 px-5 py-2 rounded-2xl font-bold text-xs transition-all ${
                                selectedCategory === "ALL"
                                    ? "bg-[#4a3728] text-white shadow-md"
                                    : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                            }`}
                        >
                            Tất cả
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.categoryId || cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`flex-shrink-0 px-5 py-2 rounded-2xl font-bold text-xs transition-all ${
                                    selectedCategory === cat.name
                                        ? "bg-[#4a3728] text-white shadow-md"
                                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#FAF6F0]">
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
                                    key={product.productId || product.id}
                                    onClick={() => setSelectedProduct(product)}
                                    className="group bg-white rounded-2xl p-4 shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
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
            <CartSidebar
                cart={cart}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
                onPlaceOrder={handlePlaceOrder}
                isSubmitting={createOrderMutation.isPending}
            />

            {/* Customize Modal */}
            {selectedProduct && (
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
