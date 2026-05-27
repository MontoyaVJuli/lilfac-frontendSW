import { forwardRef } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export const FormField = forwardRef(function FormField(
    { label, error, success, hint, className = "", ...props },
    ref
) {
    return (
        <div className={`space-y-0 ${className}`}>
            {label && <label className="label">{label}</label>}
            <input
                ref={ref}
                className={`field ${error ? "field-error" : ""} ${success ? "!border-[#34d399]" : ""}`}
                {...props}
            />
            {error && (
                <p className="err-msg">
                    <AlertCircle size={12} className="shrink-0" />
                    {error}
                </p>
            )}
            {!error && success && (
                <p className="flex items-center gap-1.5 text-[#34d399] text-xs mt-1.5">
                    <CheckCircle2 size={12} /> {success}
                </p>
            )}
            {!error && !success && hint && (
                <p className="text-[#8b86a0] text-xs mt-1.5">{hint}</p>
            )}
        </div>
    );
});

export const SelectField = forwardRef(function SelectField(
    { label, error, options = [], placeholder = "Selecciona…", ...props },
    ref
) {
    return (
        <div>
            {label && <label className="label">{label}</label>}
            <select
                ref={ref}
                className={`field ${error ? "field-error" : ""} appearance-none`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map(({ value, label: l }) => (
                    <option key={value} value={value}>{l}</option>
                ))}
            </select>
            {error && (
                <p className="err-msg">
                    <AlertCircle size={12} className="shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
});

export function Spinner({ size = 20, className = "" }) {
    return <Loader2 size={size} className={`animate-spin text-[#7c6fcd] ${className}`} />;
}

export function Modal({ open, onClose, title, children, size = "md" }) {
    if (!open) return null;
    const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#1e1b2e]/50 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative card w-full ${widths[size]} max-h-[90vh] overflow-y-auto shadow-2xl`}>
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#d6cfc4]">
                        <h2 className="font-bold text-xl text-[#1e1b2e]">{title}</h2>
                        <button onClick={onClose} className="text-[#8b86a0] hover:text-[#1e1b2e] text-xl">✕</button>
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

export function OtpInput({ length = 6, value = "", onChange }) {
    const vals = Array.from({ length }, (_, i) => value[i] || "");

    const handleChange = (e, idx) => {
        const input = e.target.value.replace(/\D/g, "").slice(-1);
        const digits = vals.slice();
        digits[idx] = input;
        onChange(digits.join(""));
        if (input && idx < length - 1) {
            document.getElementById(`otp-${idx + 1}`)?.focus();
        }
    };

    const handleKey = (e, idx) => {
        if (e.key === "Backspace") {
            const digits = vals.slice();
            digits[idx] = "";
            onChange(digits.join(""));
            if (idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        const digits = Array.from({ length }, (_, i) => pasted[i] || "");
        onChange(digits.join(""));
        const nextIdx = Math.min(pasted.length, length - 1);
        document.getElementById(`otp-${nextIdx}`)?.focus();
    };

    return (
        <div className="flex gap-2 justify-center">
            {vals.map((d, i) => (
                <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKey(e, i)}
                    onPaste={handlePaste}
                    className="w-10 h-12 text-center font-mono text-lg font-semibold
                     bg-[#faf7f2] border border-[#d6cfc4] rounded-lg text-[#1e1b2e]
                     focus:outline-none focus:border-[#7c6fcd] transition-all duration-200"
                />
            ))}
        </div>
    );
}


export function VerifyButton({ verified, loading, onClick, label, verifiedLabel }) {
    if (verified)
        return (
            <span className="flex items-center gap-1.5 text-[#34d399] text-xs font-mono">
                <CheckCircle2 size={14} /> {verifiedLabel || "Verificado"}
            </span>
        );
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-mono text-[#7c6fcd]
                 hover:text-[#9d92d8] underline underline-offset-2 disabled:opacity-50"
        >
            {loading ? <Spinner size={12} /> : null}
            {label || "Enviar código"}
        </button>
    );
}

export { LanguageSwitcher } from "./LanguageSwitcher";