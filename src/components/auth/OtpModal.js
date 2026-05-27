import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Modal, OtpInput, Spinner } from "../ui";
import { otpService } from "../../services/api";
import { Mail, Phone } from "lucide-react";

export function OtpModal({ type, value, open, onClose, onSuccess }) {
    const { t } = useTranslation();
    const [code,      setCode]      = useState("");
    const [loading,   setLoading]   = useState(false);
    const [sending,   setSending]   = useState(false);
    const [countdown, setCountdown] = useState(0);

    const isPhone = type === "phone";
    const Icon    = isPhone ? Phone : Mail;

    const startCountdown = () => {
        setCountdown(60);
        const interval = setInterval(() => {
            setCountdown((c) => {
                if (c <= 1) { clearInterval(interval); return 0; }
                return c - 1;
            });
        }, 1000);
    };

    const handleSend = async () => {
        if (!value) return toast.error(isPhone ? t("otp.needPhone") : t("otp.needEmail"));
        setSending(true);
        try {
            if (isPhone) await otpService.sendPhone(value);
            else         await otpService.sendEmail(value);
            toast.success(t("otp.sent", { value }));
            startCountdown();
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSending(false);
        }
    };

    const handleVerify = async () => {
        if (code.length < 6) return toast.error(t("otp.needDigits"));
        setLoading(true);
        try {
            if (isPhone) await otpService.verifyPhone(value, code);
            else         await otpService.verifyEmail(value, code);
            toast.success(isPhone ? t("otp.phoneVerified") : t("otp.emailVerified"));
            onSuccess();
            onClose();
        } catch (e) {
            toast.error(e.message || t("otp.wrongCode"));
            setCode("");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => { setCode(""); onClose(); };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title={isPhone ? t("otp.verifyPhone") : t("otp.verifyEmail")}
            size="sm"
        >
            <div className="space-y-6 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#7c6fcd]/10 border border-[#7c6fcd]/30
                          flex items-center justify-center">
                        <Icon size={24} className="text-[#7c6fcd]" />
                    </div>
                    <div>
                        <p className="text-[#1e1b2e] text-sm">{t("otp.description")}</p>
                        <p className="font-mono text-[#7c6fcd] font-semibold mt-0.5">{value}</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSend}
                    disabled={sending || countdown > 0}
                    className="btn-ghost w-full flex items-center justify-center gap-2"
                >
                    {sending ? <Spinner size={16} /> : null}
                    {countdown > 0
                        ? t("otp.resend", { seconds: countdown })
                        : sending
                            ? t("otp.sending")
                            : t("otp.send")}
                </button>

                <div className="space-y-2">
                    <p className="text-xs text-[#8b86a0] font-mono uppercase tracking-widest">
                        {t("otp.enterCode")}
                    </p>
                    <OtpInput value={code} onChange={setCode} />
                </div>

                <button
                    type="button"
                    onClick={handleVerify}
                    disabled={loading || code.length < 6}
                    className="btn-primary flex items-center justify-center gap-2"
                >
                    {loading ? <Spinner size={16} /> : null}
                    {t("otp.confirm")}
                </button>
            </div>
        </Modal>
    );
}