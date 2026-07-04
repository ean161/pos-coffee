import { useNavigate } from "react-router-dom";
import { SquarePen, ToggleLeft, ToggleRight, FolderOpen } from "lucide-react";
import axiosClient from "../../../shared/axios/axiosClient.js";

const CategoryTable = ({ data, onRefresh }) => {
    const navigate = useNavigate();

    const toggleStatus = async (id, currentStatus) => {
        await axiosClient.patch(`/categories/${id}/status?status=${!currentStatus}`);
        onRefresh();
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[#a27b5c] bg-white rounded-2xl border border-[#efe6dc] p-8 text-center animate-fade-in">
                <FolderOpen size={48} className="mb-4 text-stone-200" />
                <p className="text-base font-bold text-[#25160F]">Chưa có danh mục nào được tạo</p>
                <p className="text-xs text-stone-400 mt-1">Khởi động thực đơn bằng cách thêm danh mục đầu tiên</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                <tr className="bg-[#FAF6F0]/60 border-b border-[#efe6dc] text-[11px] text-[#a27b5c] uppercase font-bold tracking-widest">
                    <th className="px-8 py-5">Tên danh mục</th>
                    <th className="px-6 py-5">Trạng thái hiển thị</th>
                    <th className="px-8 py-5 text-right">Tùy chọn</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-[#f7f0e9]">
                {data.map((item) => (
                    <tr
                        key={item.categoryId}
                        className="group hover:bg-[#FAF6F0]/30 transition-all duration-300 hover:translate-x-1.5"
                    >
                        {/* Tên danh mục */}
                        <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-[#a27b5c]/40 group-hover:bg-[#a27b5c] group-hover:scale-125 transition-all duration-300" />
                                <span className="font-bold text-[#25160F] text-base group-hover:text-[#a27b5c] transition-colors duration-250">
                                        {item.name}
                                    </span>
                            </div>
                        </td>

                        {/* Toggle trạng thái hiển thị */}
                        <td className="px-6 py-5">
                            <button
                                onClick={() => toggleStatus(item.categoryId, item.status)}
                                className="flex items-center gap-2.5 group/toggle focus:outline-none"
                            >
                                {item.status ? (
                                    <ToggleRight size={30} className="text-[#a27b5c] transition-all group-hover/toggle:scale-105" />
                                ) : (
                                    <ToggleLeft size={30} className="text-stone-300 transition-all group-hover/toggle:scale-105" />
                                )}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                                    item.status
                                        ? "bg-[#f5ece4] text-[#a27b5c] border border-[#efe0d3]"
                                        : "bg-stone-100 text-stone-400 border border-stone-200"
                                }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${item.status ? 'bg-[#a27b5c] animate-pulse' : 'bg-stone-300'}`} />
                                    {item.status ? "Hoạt động" : "Tạm ẩn"}
                                    </span>
                            </button>
                        </td>

                        {/* Nút sửa */}
                        <td className="px-8 py-5 text-right">
                            <button
                                onClick={() => navigate(`/categories/edit/${item.categoryId}`)}
                                className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-[#a27b5c] bg-[#FAF6F0] border border-[#efe6dc] hover:bg-[#a27b5c] hover:text-white hover:border-[#a27b5c] active:scale-90 hover:rotate-6 transition-all duration-300 shadow-sm"
                                title="Sửa"
                            >
                                <SquarePen size={17} className="stroke-[2.2]" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryTable;