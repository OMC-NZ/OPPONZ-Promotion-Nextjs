"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function Providers({ children }) {
    if (!recaptchaSiteKey) return children;

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={recaptchaSiteKey}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: "head",
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}
