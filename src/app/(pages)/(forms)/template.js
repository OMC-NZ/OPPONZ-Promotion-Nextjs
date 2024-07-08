"use client"

import { ReCaptchaProvider } from 'react-grecaptcha-v3';

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function Template({ children }) {
    return (
        <>
            <ReCaptchaProvider siteKey={recaptchaSiteKey}>
                {children}
            </ReCaptchaProvider>

        </>
    )
}