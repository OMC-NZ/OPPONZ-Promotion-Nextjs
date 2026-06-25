"use client";

import { useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3;

const wait = (ms) => new Promise((resolve) => {
    window.setTimeout(resolve, ms);
});

export default function useRecaptchaAction() {
    const { executeRecaptcha } = useGoogleReCaptcha();

    return useCallback(async (action) => {
        if (!recaptchaSiteKey) {
            throw new Error("reCAPTCHA site key is not configured.");
        }

        if (!executeRecaptcha) {
            await wait(600);

            return {
                success: false,
                action,
                unavailable: true,
            };
        }

        const token = await executeRecaptcha(action);
        return { success: true, token, action };
    }, [executeRecaptcha]);
}
