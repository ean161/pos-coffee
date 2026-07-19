// src/features/top-selling-product/components/TopSellingProducts.jsx
import { Coffee, Loader2, Layers } from 'lucide-react';

const TopSellingProducts = ({ data = [], loading, page = 0, size = 5 }) => {
    return (
        <div className="w-full bg-white rounded-2xl border border-[#ebdcd0] overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="p-6 bg-[#FAF6F0]/10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#a27b5c]">
                        <Loader2 className="animate-spin mb-3" size={32} />
                        <span className="text-xs text-stone-400 font-bold uppercase tracking-widest">Đang tính toán món bán chạy...</span>
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#a27b5c] text-center">
                        <Layers size={44} className="mb-3 text-stone-200" />
                        <p className="text-sm font-bold text-[#26170f]">Chưa có dữ liệu bán hàng</p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto border border-[#ebdcd0] rounded-xl bg-white shadow-sm overflow-hidden">
                        <table className="w-full border-collapse min-w-[500px]">
                            <thead>
                            <tr className="bg-[#FAF6F0]/80 border-b border-[#ebdcd0] text-xs text-[#a27b5c] uppercase font-black tracking-wider">
                                <th className="px-6 py-4 text-center w-24">Thứ hạng</th>
                                <th className="px-6 py-4 text-left">Tên món nước / sản phẩm</th>
                                <th className="px-6 py-4 text-right w-48">Tổng số lượng đã bán</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f7f0e9]">
                            {data.map((item, index) => {
                                const absoluteRank = page * size + index + 1;

                                return (
                                    <tr key={index} className="group hover:bg-[#fcf8f2] transition-all duration-200">
                                        <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center justify-center h-6 w-6 rounded-lg text-xs font-black border shadow-sm
                                                    ${absoluteRank === 1 ? 'bg-[#26170f] text-[#f7f0e9] border-[#26170f]' : ''}
                                                    ${absoluteRank === 2 ? 'bg-[#4a3728] text-[#f7f0e9] border-[#4a3728]' : ''}
                                                    ${absoluteRank === 3 ? 'bg-[#a27b5c] text-white border-[#a27b5c]' : ''}
                                                    ${absoluteRank > 3 ? 'bg-stone-50 text-stone-500 border-stone-200' : ''}
                                                `}>
                                                    {absoluteRank}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-[#FAF6F0] rounded-lg border border-[#f2e6dc] text-[#a27b5c]">
                                                    <Coffee size={15} />
                                                </div>
                                                <span className="font-bold text-[#26170f] text-sm group-hover:text-[#a27b5c] transition-colors">
                                                        {item.productName}
                                                    </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                                <span className="font-extrabold text-[#4a3728] text-sm bg-[#FAF6F0] px-3 py-1 rounded-lg border border-[#efe6dc]">
                                                    {Number(item.totalQuantitySold).toLocaleString('vi-VN')} món
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopSellingProducts;