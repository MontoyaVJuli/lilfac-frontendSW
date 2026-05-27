import { useTranslation } from "react-i18next";
import { Pencil, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";

export function EmployeeTable({
                                  employees = [], total = 0, page = 0, pageSize = 10,
                                  searchTerm = "", onSearch, onPageChange, onEdit, onDelete, loading = false, isAdmin = () => false,
                              }){
    const { t } = useTranslation();
    const totalPages = Math.ceil(total / pageSize);

    const COLUMNS = [
        t("employees.columns.name"),
        t("employees.columns.idType"),
        t("employees.columns.idNumber"),
        t("employees.columns.phone"),
        t("employees.columns.email"),
        t("employees.columns.address"),
        t("employees.columns.actions"),
    ];

    return (
        <div className="card overflow-hidden">
            {/* Toolbar */}
            <div className="px-5 py-4 border-b border-[#d6cfc4] flex flex-col sm:flex-row gap-3
                      items-start sm:items-center justify-between">
                <p className="font-mono text-xs text-[#8b86a0] uppercase tracking-wider">
                    {t("employees.count", { count: total })}
                </p>
                <div className="relative w-full sm:w-72">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b86a0]" />
                    <input
                        type="search"
                        placeholder={t("common.search")}
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="field pl-9 py-2 text-sm"
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-[#d6cfc4]">
                        {COLUMNS.map((h) => (
                            <th key={h} className="px-4 py-3 text-left font-mono text-xs uppercase
                                           tracking-wider text-[#8b86a0] whitespace-nowrap">
                                {h}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={7} className="py-16 text-center text-[#8b86a0] font-mono text-xs">
                                {t("common.loading")}
                            </td>
                        </tr>
                    ) : employees.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="py-16 text-center text-[#8b86a0] font-mono text-xs">
                                {t("employees.noData")}
                            </td>
                        </tr>
                    ) : (
                        employees.map((emp, i) => (
                            <tr key={emp.id}
                                className={`border-b border-[#d6cfc4]/50 hover:bg-[#ede8df]/60
                                    transition-colors ${i % 2 === 0 ? "" : "bg-[#ede8df]/30"}`}>
                                <td className="px-4 py-3 text-[#1e1b2e] font-medium whitespace-nowrap">{emp.fullName}</td>
                                <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs
                                                 font-mono bg-[#7c6fcd]/10 text-[#7c6fcd] border border-[#7c6fcd]/20">
                                            {t(`employees.idLabels.${emp.idType}`, { defaultValue: emp.idType })}
                                        </span>
                                </td>
                                <td className="px-4 py-3 font-mono text-[#4a4560] text-xs">{emp.idNumber}</td>
                                <td className="px-4 py-3 font-mono text-[#4a4560] text-xs">{emp.phone}</td>
                                <td className="px-4 py-3 font-mono text-[#4a4560] text-xs truncate max-w-[160px]">{emp.email}</td>
                                <td className="px-4 py-3 text-[#8b86a0] text-xs truncate max-w-[180px]">{emp.address}</td>
                                <td className="px-4 py-3">
                                    {isAdmin() ? (
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => onEdit(emp)}
                                                    className="p-1.5 rounded text-[#8b86a0] hover:text-[#7c6fcd] hover:bg-[#7c6fcd]/10 transition-all"
                                                    title={t("employees.edit")}>
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => onDelete(emp)}
                                                    className="p-1.5 rounded text-[#8b86a0] hover:text-red-600 hover:bg-red-500/10 transition-all"
                                                    title={t("employees.deleteConfirm")}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-[#8b86a0] text-xs font-mono">—</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="px-5 py-3 border-t border-[#d6cfc4] flex items-center justify-between">
                    <p className="text-xs text-[#8b86a0] font-mono">
                        {t("common.page", { current: page + 1, total: totalPages })}
                    </p>
                    <div className="flex gap-1">
                        <button onClick={() => onPageChange(page - 1)} disabled={page === 0}
                                className="p-1.5 rounded text-[#8b86a0] hover:text-[#1e1b2e]
                                   disabled:opacity-30 hover:bg-[#ede8df] transition-all">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}
                                className="p-1.5 rounded text-[#8b86a0] hover:text-[#1e1b2e]
                                   disabled:opacity-30 hover:bg-[#ede8df] transition-all">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}