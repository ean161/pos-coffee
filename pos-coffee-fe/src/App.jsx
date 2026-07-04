import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './shared/layout/AppLayout';
import CategoryPage from './features/category/pages/CategoryPage';
import CategoryFormPage from './features/category/pages/CategoryFormPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route path="categories" element={<CategoryPage />} />
                    <Route path="categories/create" element={<CategoryFormPage />} />
                    <Route path="/categories/edit/:id" element={<CategoryFormPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
export default App;