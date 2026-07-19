import React from "react";
import { X, Plus, Minus } from "lucide-react";

const SIZES = ["S", "M", "L"];
const SUGAR_LEVELS = ["0%", "30%", "50%", "70%", "100%"];
const ICE_LEVELS = ["0%", "30%", "50%", "70%", "100%"];

const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

export default function CustomizeModal({ product, variants, toppings, onAdd, onClose }) {
    const [selectedSize, setSelectedSize] = React.useState("M");
    const [selectedVariant, setSelectedVariant] = React.useState(null);
    const [sugar, setSugar] = React.useState("50%");
    const [ice, setIce] = React.useState("100%");
    const [selectedToppings, setSelectedToppings] = React.useState([]);
    const [quantity, setQuantity] = React.useState(1);

    React.useEffect(() => {
        if (variants?.length > 0) {
            const defaultVar = variants.find((v) => v.sizeName === "M") || variants[0];
            setSelectedVariant(defaultVar);
            setSelectedSize(defaultVar.sizeName);
        }
    }, [variants]);

    const priceAdjustment = selectedVariant?.priceAdjustment || 0;
    const toppingTotal = selectedToppings.reduce((sum, t) => sum + Number(t.price), 0);
    const unitPrice = Number(product.basePrice) + priceAdjustment;
    const totalPrice = (unitPrice + toppingTotal) * quantity;

    const toggleTopping = (topping) => {
        setSelectedToppings((prev) =>
            prev.find((t) => t.toppingId === topping.toppingId)
                ? prev.filter((t) => t.toppingId !== topping.toppingId)
                : [...prev, topping]
        );
    };

    const handleAdd = () => {
        onAdd({
            productId: product.productId || product.id,
            productName: product.name,
            variantId: selectedVariant?.variantId || selectedVariant?.id,
            variantName: selectedVariant ? `${selectedVariant.sizeName}` : null,
            unitPrice,
            quantity,
            sizeName: selectedSize,
            sugarLevel: sugar,
            iceLevel: ice,
            lineTotal: unitPrice * quantity,
            toppingTotal: toppingTotal * quantity,
            toppings: selectedToppings,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1f120c] to-[#4a3728] text-white p-6 pb-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-extrabold">{product.name}</h2>
                            <p className="text-[#c5a880] text-sm mt-0.5">Tùy chỉnh chi tiết món</p>
                        </div>
                        <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="mt-3 text-2xl font-black text-[#c5a880]">
                        {formatPrice(product.basePrice)}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Size */}
                    <div>
                        <h3 className="font-bold text-sm text-stone-700 uppercase tracking-wide mb-3">Kích thước</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {SIZES.map((size) => {
                                const variant = variants?.find((v) => v.sizeName === size);
                                const adjustment = variant?.priceAdjustment || 0;
                                return (
                                    <button
                                        key={size}
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setSelectedVariant(variant);
                                        }}
                                        className={`py-3 px-2 rounded-2xl border-2 font-bold text-sm transition-all ${
                                            selectedSize === size
                                                ? "border-[#4a3728] bg-[#4a3728] text-white"
                                                : "border-stone-200 text-stone-600 hover:border-stone-300"
                                        }`}
                                    >
                                        {size}
                                        {adjustment !== 0 && (
                                            <span className={`block text-xs font-normal ${selectedSize === size ? "text-white/70" : "text-stone-400"}`}>
                                                {adjustment > 0 ? "+" : ""}{formatPrice(adjustment)}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sugar */}
                    <div>
                        <h3 className="font-bold text-sm text-stone-700 uppercase tracking-wide mb-3">Mức đường</h3>
                        <div className="flex gap-2">
                            {SUGAR_LEVELS.map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setSugar(level)}
                                    className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-xs transition-all ${
                                        sugar === level
                                            ? "border-[#a27b5c] bg-[#a27b5c] text-white"
                                            : "border-stone-200 text-stone-500 hover:border-stone-300"
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ice */}
                    <div>
                        <h3 className="font-bold text-sm text-stone-700 uppercase tracking-wide mb-3">Mức đá</h3>
                        <div className="flex gap-2">
                            {ICE_LEVELS.map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setIce(level)}
                                    className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-xs transition-all ${
                                        ice === level
                                            ? "border-[#a27b5c] bg-[#a27b5c] text-white"
                                            : "border-stone-200 text-stone-500 hover:border-stone-300"
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Topping */}
                    {toppings?.length > 0 && (
                        <div>
                            <h3 className="font-bold text-sm text-stone-700 uppercase tracking-wide mb-3">Topping</h3>
                            <div className="space-y-2">
                                {toppings.map((t) => (
                                    <button
                                        key={t.toppingId || t.id}
                                        onClick={() => toggleTopping(t)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${
                                            selectedToppings.find((s) => (s.toppingId || s.id) === (t.toppingId || t.id))
                                                ? "border-[#4a3728] bg-[#4a3728]/5"
                                                : "border-stone-200 hover:border-stone-300"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                selectedToppings.find((s) => (s.toppingId || s.id) === (t.toppingId || t.id))
                                                    ? "border-[#4a3728] bg-[#4a3728]"
                                                    : "border-stone-300"
                                            }`}>
                                                {selectedToppings.find((s) => (s.toppingId || s.id) === (t.toppingId || t.id)) && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="font-bold text-sm text-stone-700">{t.name}</span>
                                        </div>
                                        <span className="font-bold text-sm text-[#a27b5c]">+{formatPrice(t.price)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quantity & Add */}
                <div className="border-t border-stone-100 p-5 bg-stone-50">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-stone-600 text-sm">Số lượng</span>
                        <div className="flex items-center gap-3 bg-white rounded-2xl border border-stone-200 px-1 py-1">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-2 rounded-xl  text-black hover:bg-stone-100 transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="font-extrabold text-lg text-black w-8 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-2 rounded-xl text-black hover:bg-stone-100 transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="w-full bg-gradient-to-r from-[#4a3728] to-[#26170f] text-white py-4 rounded-2xl font-extrabold text-base tracking-wide hover:from-[#26170f] hover:to-[#4a3728] transition-all shadow-lg shadow-[#4a3728]/30 active:scale-95"
                    >
                        Thêm vào giỏ — {formatPrice(totalPrice)}
                    </button>
                </div>
            </div>
        </div>
    );
}
