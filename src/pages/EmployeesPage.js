import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Plus, Users, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { employeeService } from "../services/api";
import { EmployeeTable } from "../components/employees/EmployeeTable";
import { EmployeeForm } from "../components/employees/EmployeeForm";
import { Modal, Spinner, LanguageSwitcher } from "../components/ui";

export default function EmployeesPage() {
    const { user, logout, isAdmin } = useAuth();
    const { t } = useTranslation();

    const [employees,    setEmployees]    = useState([]);
    const [total,        setTotal]        = useState(0);
    const [page,         setPage]         = useState(0);
    const [search,       setSearch]       = useState("");
    const [loading,      setLoading]      = useState(false);
    const [formOpen,     setFormOpen]     = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting,     setDeleting]     = useState(false);

    const debouncedSearch = useDebounce(search, 400);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await employeeService.getAll({
                page,
                size: 10,
                search: debouncedSearch || undefined,
            });
            setEmployees(data.content || data);
            setTotal(data.totalElements || data.length);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

    const handleNew  = () => { setEditEmployee(null); setFormOpen(true); };
    const handleEdit = (emp) => { setEditEmployee(emp); setFormOpen(true); };
    const handleFormSuccess = () => { setFormOpen(false); fetchEmployees(); };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await employeeService.delete(deleteTarget.id);
            toast.success(t("employees.deleted"));
            setDeleteTarget(null);
            fetchEmployees();
        } catch (e) {
            toast.error(e.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f0e8]">
            {/* Nav */}
            <header className="border-b border-[#d6cfc4] bg-[#f5f0e8]/80 backdrop-blur-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-[#7c6fcd] rounded flex items-center justify-center">
                            <Users size={14} className="text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-widest text-[#1e1b2e] uppercase">LilFac</span>
                        <span className="hidden sm:block text-[#8b86a0] text-sm">|</span>
                        <span className="hidden sm:block font-mono text-xs text-[#8b86a0] uppercase tracking-wider">
                            {t("employees.subtitle")}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <span className="hidden sm:block font-mono text-xs text-[#8b86a0]">{user?.username} · {t(`roles.${user?.role?.toLowerCase()}`,
                              { defaultValue: user?.role })}</span>
                        <button
                            onClick={logout}
                            className="flex items-center gap-1.5 text-[#8b86a0] hover:text-red-600 transition-colors text-xs font-mono"
                        >
                            <LogOut size={14} /> {t("common.logout")}
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-black text-3xl text-[#1e1b2e] uppercase tracking-wide">
                            {t("employees.title")}
                        </h1>
                        <p className="text-[#8b86a0] text-sm mt-0.5">{t("employees.subtitle")}</p>
                    </div>
                    {isAdmin() && (
                        <button onClick={handleNew} className="btn-primary w-auto flex items-center gap-2 px-5 py-2.5">
                            <Plus size={16} /> {t("employees.register")}
                        </button>
                    )}
                </div>

                <EmployeeTable
                    employees={employees}
                    total={total}
                    page={page}
                    pageSize={10}
                    searchTerm={search}
                    onSearch={(v) => { setSearch(v); setPage(0); }}
                    onPageChange={setPage}
                    onEdit={handleEdit}
                    onDelete={setDeleteTarget}
                    loading={loading}
                    isAdmin={isAdmin}
                />
            </main>

            {/* Modal formulario */}
            <Modal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                title={editEmployee ? t("employees.edit") : t("employees.registerTitle")}
                size="lg"
            >
                <EmployeeForm
                    initialData={editEmployee}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setFormOpen(false)}
                />
            </Modal>

            {/* Modal eliminar */}
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title={t("employees.deleteTitle")} size="sm">
                <div className="space-y-5 text-center">
                    <div className="w-14 h-14 rounded-full bg-red-100 border border-red-300
                          mx-auto flex items-center justify-center text-2xl">⚠️</div>
                    <div>
                        <p className="text-[#1e1b2e] text-sm">{t("employees.deleteMsg")}</p>
                        <p className="font-bold text-xl text-[#1e1b2e] mt-1">{deleteTarget?.fullName}</p>
                        <p className="text-[#8b86a0] text-xs mt-1">{t("employees.deleteWarn")}</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="btn-ghost flex-1" onClick={() => setDeleteTarget(null)}>
                            {t("common.cancel")}
                        </button>
                        <button className="btn-danger flex-1 flex items-center justify-center gap-2"
                                onClick={handleDelete} disabled={deleting}>
                            {deleting ? <Spinner size={14} /> : null}
                            {deleting ? t("employees.deleting") : t("employees.deleteConfirm")}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}