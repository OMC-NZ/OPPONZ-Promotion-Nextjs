"use client"

import { ReCaptchaProvider } from 'react-grecaptcha-v3';

export default function Template({ children }) {
    return (
        <>
            <ReCaptchaProvider siteKey={process.env.RECAPTCHA_SITE_KEY}>
                {children}
            </ReCaptchaProvider>

        </>
    )
}