"use client";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
<<<<<<< HEAD
const canBypassRecaptcha =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_RECAPTCHA_DEV_BYPASS === "true";
=======
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3;
>>>>>>> 5eb32891f151cb34e88ae7acece4b2f93f24991d

export default function useRecaptchaAction() {
    const { executeRecaptcha } = useGoogleReCaptcha();

    return async (action) => {
<<<<<<< HEAD
        if (canBypassRecaptcha) {
            return {
                success: true,
                action,
                bypassed: true,
            };
=======
        if (!recaptchaSiteKey) {
            return { success: true, skipped: true };
>>>>>>> 5eb32891f151cb34e88ae7acece4b2f93f24991d
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
