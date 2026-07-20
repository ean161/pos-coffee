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
import ProtectedRoute, { StaffRoute } from "./features/auth/login/ProtectedRoute";
import POSPage from "./features/pos/pages/POSPage.jsx";
import StaffOrdersPage from "./features/staff/pages/StaffOrdersPage.jsx";
import StaffLayout from "./features/staff/layout/StaffLayout.jsx";
import HistoryOrderFormPage from "./features/historyOrders/page/HistoryOrderFormPage.jsx";
import StatisticPage from "./features/statistics/pages/StatisticPage.jsx";
import EmployeePage from "./features/employee/pages/EmployeePage";
import ShiftsPage from "./features/shift/pages/ShiftsPage";
import PayrollPage from "./features/payroll/pages/PayrollPage";
import CashControlPage from "./features/cashHistory/pages/CashControlPage";
import CashHistoryAdminPage from "./features/cashHistory/pages/CashHistoryAdminPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Staff routes — separate layout, no admin sidebar */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<StaffRoute />}>
                        <Route path="/staff" element={<StaffLayout />}>
                            <Route index element={<Navigate to="pos" replace />} />
                            <Route path="pos" element={<POSPage />} />
                            <Route path="orders" element={<StaffOrdersPage />} />
                            <Route
                                path="sales-history"
                                element={<HistoryOrderFormPage/>}
                            />
                            <Route path="cash" element={<CashControlPage />} />
                        </Route>
                    </Route>
                </Route>

                {/* Admin routes — shared layout with sidebar */}
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
                        <Route path="/orders" element={<POSPage />} />
                        <Route path="/top-selling" element={<StatisticPage />} />
                        <Route path="/employees" element={<EmployeePage />} />
                        <Route path="/shifts" element={<ShiftsPage />} />
                        <Route path="/payroll" element={<PayrollPage />} />
                        <Route path="/admin/cash-history" element={<CashHistoryAdminPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;