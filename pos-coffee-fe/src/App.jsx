import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import AppLayout from "./shared/layout/AppLayout";
import CategoryPage from "./features/category/pages/CategoryPage";
import CategoryFormPage from "./features/category/pages/CategoryFormPage";
import ProductPage from "./features/product/pages/ProductPage";
import ProductFormPage from "./features/product/pages/ProductFormPage";
import ToppingPage from "./features/topping/pages/ToppingPage";
import SurchargePage from "./features/surcharge/pages/SurchargePage";
import VoucherPage from "./features/voucher/pages/VoucherPage";
import InventoryPage from "./features/inventory/pages/InventoryPage";
import UpdateStockPage from "./features/inventory/pages/UpdateStockPage";
import LoginPage from "./features/auth/login/LoginPage";
import ProtectedRoute from "./features/auth/login/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<AppLayout />}>
                        <Route
                            index
                            element={<Navigate to="/categories" replace />}
                        />
                        <Route path="/categories" element={<CategoryPage />} />
                        <Route
                            path="/categories/create"
                            element={<CategoryFormPage />}
                        />
                        <Route
                            path="/categories/edit/:id"
                            element={<CategoryFormPage />}
                        />
                        <Route path="/products" element={<ProductPage />} />
                        <Route
                            path="/products/create"
                            element={<ProductFormPage />}
                        />
                        <Route
                            path="/products/edit/:id"
                            element={<ProductFormPage />}
                        />
                        <Route path="/toppings" element={<ToppingPage />} />
                        <Route
                            path="/admin/inventory"
                            element={<InventoryPage />}
                        />
                        <Route
                            path="/admin/inventory/edit/:id"
                            element={<UpdateStockPage />}
                        />
                        <Route path="/surcharges" element={<SurchargePage />} />
                        <Route path="/vouchers" element={<VoucherPage />} />

                        <Route
                            path="/orders"
                            element={
                                <div className="p-8 text-center text-stone-500 font-black uppercase text-sm tracking-wider">
                                    Tính năng Quản lý Đơn hàng đang được phát
                                    triển
                                </div>
                            }
                        />
                        <Route
                            path="/staff"
                            element={
                                <div className="p-8 text-center text-stone-500 font-black uppercase text-sm tracking-wider">
                                    Tính năng Quản lý Nhân viên đang được phát
                                    triển
                                </div>
                            }
                        />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
