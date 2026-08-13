"use client";

import { useCallback, useEffect, useRef } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3;
const RECAPTCHA_READY_TIMEOUT = 8000;
const RECAPTCHA_READY_INTERVAL = 200;
const RECAPTCHA_EXECUTE_RETRIES = 1;

const wait = (ms) => new Promise((resolve) => {
    window.setTimeout(resolve, ms);
});

export default function useRecaptchaAction() {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const executeRecaptchaRef = useRef(executeRecaptcha);

    useEffect(() => {
        executeRecaptchaRef.current = executeRecaptcha;
    }, [executeRecaptcha]);

    return useCallback(async (action) => {
        if (!recaptchaSiteKey) {
            throw new Error("reCAPTCHA site key is not configured.");
        }

        const startTime = Date.now();

        while (!executeRecaptchaRef.current && Date.now() - startTime < RECAPTCHA_READY_TIMEOUT) {
            await wait(RECAPTCHA_READY_INTERVAL);
        }

        if (!executeRecaptchaRef.current) {
            throw new Error(
                `reCAPTCHA is not ready for action "${action}". Check that GoogleReCaptchaProvider is mounted, the site key allows this domain, and CSP/network access is not blocking reCAPTCHA.`
            );
        }

        try {
            let token = "";
            let lastError = null;

            for (let attempt = 0; attempt <= RECAPTCHA_EXECUTE_RETRIES; attempt += 1) {
                try {
                    token = await executeRecaptchaRef.current(action);
                    lastError = null;
                    break;
                } catch (error) {
                    lastError = error;
                    if (attempt < RECAPTCHA_EXECUTE_RETRIES) {
                        await wait(300);
                    }
                }
            }

            if (lastError) {
                throw lastError;
            }

            if (!token) {
                throw new Error("reCAPTCHA returned an empty token.");
            }

            return { success: true, token, action };
        } catch (error) {
            throw new Error(`reCAPTCHA failed for action "${action}": ${error?.message || "Unknown error"}`);
        }
    }, []);
}
