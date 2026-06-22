"use client";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const canBypassRecaptcha =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_RECAPTCHA_DEV_BYPASS === "true";

export default function useRecaptchaAction() {
    const { executeRecaptcha } = useGoogleReCaptcha();

    return async (action) => {
        if (canBypassRecaptcha) {
            return {
                success: true,
                action,
                bypassed: true,
            };
        }

        if (!executeRecaptcha) {
            throw new Error("reCAPTCHA is not ready. Please try again.");
        }

        const token = await executeRecaptcha(action);
        const response = await fetch(`${apiBaseUrl}/api/recaptcha/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, action }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "reCAPTCHA verification failed.");
        }

        return result;
    };
}
