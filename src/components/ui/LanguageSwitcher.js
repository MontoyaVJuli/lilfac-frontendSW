import { useTranslation } from "react-i18next";

const LANGUAGES = [
    { code: "es", label: "ES" },
    { code: "en", label: "EN" },
    { code: "it", label: "IT" },
    { code: "ptBr", label: "PT" },
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const current = LANGUAGES.find((l) => i18n.language?.startsWith(l.code))?.code || "es";

    return (
        <div className="flex items-center gap-1">
            {LANGUAGES.map(({ code, label }) => (
                <button
                    key={code}
                    onClick={() => i18n.changeLanguage(code)}
                    className={`font-mono text-xs px-2 py-1 rounded transition-all duration-200
                        ${current === code
                        ? "bg-[#7c6fcd] text-white border border-[#7c6fcd]"
                        : "text-[#8b86a0] border border-[#d6cfc4] hover:border-[#7c6fcd]/50 hover:text-[#7c6fcd]"
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}