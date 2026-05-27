/** Normaliza a E.164 para Twilio Verify (+57 para móviles colombianos). */
export function normalizePhone(phone) {
    const value = (phone || "").replace(/\s/g, "");
    if (/^\+57[3]\d{9}$/.test(value)) return value;
    if (/^[3]\d{9}$/.test(value)) return `+57${value}`;
    if (/^\+\d{7,15}$/.test(value)) return value;
    return value;
}
