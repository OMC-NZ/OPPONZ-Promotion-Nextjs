"use client"

import { ReCaptchaProvider } from 'react-grecaptcha-v3';

export default function Template({ children }) {
    return (
        <>
            <ReCaptchaProvider siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
                {children}
            </ReCaptchaProvider>

        </>
    )
}