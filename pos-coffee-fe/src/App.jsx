import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './shared/layout/AppLayout';
import CategoryPage from './features/category/pages/CategoryPage';
import CategoryFormPage from './features/category/pages/CategoryFormPage';
import ProductPage from './features/product/pages/ProductPage';
import ProductFormPage from './features/product/pages/ProductFormPage';
import ToppingPage from './features/topping/pages/ToppingPage';
import SurchargePage from './features/surcharge/pages/SurchargePage';
import VoucherPage from './features/voucher/pages/VoucherPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route path="/categories" element={<CategoryPage />} />
                    <Route path="/categories/create" element={<CategoryFormPage />} />
                    <Route path="/categories/edit/:id" element={<CategoryFormPage />} />
                    <Route path="/products" element={<ProductPage />} />
                    <Route path="/products/create" element={<ProductFormPage />} />
                    <Route path="/products/edit/:id" element={<ProductFormPage />} />
                    <Route path="/toppings" element={<ToppingPage />} />
                    <Route path="/surcharges" element={<SurchargePage />} />
                    <Route path="/vouchers" element={<VoucherPage />} />

                    <Route path="/orders" element={<div className="p-8 text-center text-stone-500 font-black uppercase text-sm tracking-wider">Tính năng Quản lý Đơn hàng đang được phát triển</div>} />
                    <Route path="/staff" element={<div className="p-8 text-center text-stone-500 font-black uppercase text-sm tracking-wider">Tính năng Quản lý Nhân viên đang được phát triển</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;