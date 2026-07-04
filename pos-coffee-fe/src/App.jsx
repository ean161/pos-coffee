import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './shared/layout/AppLayout';
import CategoryPage from './features/category/pages/CategoryPage';
import CategoryFormPage from './features/category/pages/CategoryFormPage';
import ProductPage from './features/product/pages/ProductPage';
import ProductFormPage from './features/product/pages/ProductFormPage';
import ToppingPage from './features/topping/pages/ToppingPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    {/* Danh mục (Category) */}
                    <Route path="/categories" element={<CategoryPage />} />
                    <Route path="/categories/create" element={<CategoryFormPage />} />
                    <Route path="/categories/edit/:id" element={<CategoryFormPage />} />

                    {/* Sản phẩm (Product) */}
                    <Route path="/products" element={<ProductPage />} />
                    <Route path="/products/create" element={<ProductFormPage />} />
                    <Route path="/products/edit/:id" element={<ProductFormPage />} />

                    {/* Topping - Thêm tuyến đường mới */}
                    <Route path="/toppings" element={<ToppingPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;