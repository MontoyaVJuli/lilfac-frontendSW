import { useEffect, useRef } from "react";

const SITE_KEY = process.env.REACT_APP_CF_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

export function TurnstileWidget({ onVerify, onError, onExpire }) {
    const containerRef = useRef(null);
    const widgetIdRef  = useRef(null);

    useEffect(() => {
        const render = () => {
            if (!containerRef.current) return;
            if (widgetIdRef.current !== null) return;

            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey:            SITE_KEY,
                theme:              "dark",
                callback:           onVerify,
                "error-callback":   onError,
                "expired-callback": onExpire,
            });
        };

        if (window.turnstile) {
            render();
        } else {
            const existing = document.getElementById("cf-turnstile-script");
            if (!existing) {
                const script  = document.createElement("script");
                script.id     = "cf-turnstile-script";
                script.src    = "https://challenges.cloudflare.com/turnstile/v0/api.js";
                script.async  = true;
                script.defer  = true;
                script.onload = render;
                document.head.appendChild(script);
            } else {
                existing.addEventListener("load", render);
            }
        }

        return () => {
            if (widgetIdRef.current !== null && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, []);

    return <div ref={containerRef} className="flex justify-center mt-2" />;
}