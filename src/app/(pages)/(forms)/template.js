"use client"

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const recaptchaSiteKeyV3 = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3;

export default function Template({ children }) {
    return (
        <>
            <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKeyV3}>
                {children}
            </GoogleReCaptchaProvider>
        </>
    )
}