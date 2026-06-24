"use client";

import { useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3;
const canBypassRecaptcha =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_RECAPTCHA_DEV_BYPASS === "true";

export default function useRecaptchaAction() {
    const { executeRecaptcha } = useGoogleReCaptcha();

    return useCallback(async (action) => {
        if (canBypassRecaptcha) {
            return {
                success: true,
                action,
                bypassed: true,
            };
        }

        if (!recaptchaSiteKey) {
            throw new Error("reCAPTCHA site key is not configured.");
        }

        if (!executeRecaptcha) {
            throw new Error("reCAPTCHA is not ready. Please try again.");
        }

        const token = await executeRecaptcha(action);
        return { success: true, token, action };
    }, [executeRecaptcha]);
}
