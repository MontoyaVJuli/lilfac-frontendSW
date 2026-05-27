import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getLoginSchema } from "../utils/validations";
import { FormField, Spinner, LanguageSwitcher } from "../components/ui";
import { TurnstileWidget } from "../components/auth/TurnstileWidget";

export default function LoginPage() {
    const { login }                 = useAuth();
    const navigate                  = useNavigate();
    const { t }                     = useTranslation();
    const [showPwd, setShowPwd]     = useState(false);
    const [loading, setLoading]     = useState(false);
    const [turnToken, setTurnToken] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(getLoginSchema(t)),
    });

    const onSubmit = async (data) => {
        if (!turnToken) {
            toast.error(t("login.captchaRequired"));
            return;
        }
        setLoading(true);
        try {
            await login(data.username, data.password, turnToken);
            navigate("/employees");
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f0e8] flex">
            {/* Panel izquierdo decorativo */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(124,111,205,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,205,0.3) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#ede8df] via-[#f5f0e8] to-[#7c6fcd]/5" />
                <div className="relative z-10 flex flex-col justify-center px-16 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#7c6fcd] rounded-lg flex items-center justify-center">
                            <ShieldCheck size={22} className="text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-widest text-[#1e1b2e] uppercase">
                            LilFac
                        </span>
                    </div>
                    <div className="space-y-3">
                        <h1 className="font-black text-6xl text-[#1e1b2e] leading-none tracking-tight uppercase">
                            {t("login.hero.title1")}<br />
                            <span className="text-[#7c6fcd]">{t("login.hero.title2")}</span>
                        </h1>
                        <p className="text-[#4a4560] text-base leading-relaxed max-w-xs">
                            {t("login.hero.subtitle")}
                        </p>
                    </div>
                    <div className="flex gap-8 pt-6 border-t border-[#d6cfc4]">
                        {[
                        ]}
                    </div>
                </div>
            </div>

            {/* Panel derecho - formulario */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="lg:hidden flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#7c6fcd] rounded-lg flex items-center justify-center">
                                <ShieldCheck size={18} className="text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-widest text-[#1e1b2e] uppercase">LilFac</span>
                        </div>
                        <div className="lg:hidden">
                            <LanguageSwitcher />
                        </div>
                        <div className="hidden lg:block ml-auto">
                            <LanguageSwitcher />
                        </div>
                    </div>

                    <div>
                        <h2 className="font-bold text-3xl text-[#1e1b2e] uppercase tracking-wide">
                            {t("login.title")}
                        </h2>
                        <p className="text-[#8b86a0] text-sm mt-1">{t("login.subtitle")}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        <FormField
                            label={t("login.username")}
                            type="text"
                            placeholder={t("login.usernamePlaceholder")}
                            autoComplete="username"
                            error={errors.username?.message}
                            {...register("username")}
                        />

                        <div>
                            <label className="label">{t("login.password")}</label>
                            <div className="relative">
                                <input
                                    type={showPwd ? "text" : "password"}
                                    placeholder={t("login.passwordPlaceholder")}
                                    autoComplete="current-password"
                                    className={`field pr-12 ${errors.password ? "field-error" : ""}`}
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b86a0] hover:text-[#1e1b2e]"
                                >
                                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="err-msg">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="label">{t("login.security")}</label>
                            <div className={`rounded-lg overflow-hidden border ${!turnToken ? "border-[#d6cfc4]" : "border-[#7c6fcd]/40"}`}>
                                <TurnstileWidget
                                    onVerify={(tk) => setTurnToken(tk)}
                                    onError={() => { toast.error(t("login.captchaError")); setTurnToken(null); }}
                                    onExpire={() => setTurnToken(null)}
                                />
                            </div>
                            {!turnToken && (
                                <p className="text-[#8b86a0] text-xs font-mono">{t("login.securityHint")}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !turnToken}
                            className="btn-primary flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <Spinner size={18} /> : null}
                            {loading ? t("login.submitting") : t("login.submit")}
                        </button>
                    </form>

                    <p className="text-center text-[#8b86a0] text-xs font-mono">
                        {t("login.footer")}
                    </p>
                </div>
            </div>
        </div>
    );
}