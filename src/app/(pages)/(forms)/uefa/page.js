"use client"

import Head from 'next/head';
import GoogleReCaptchaValidator from '@/hooks/useGoogleReCaptchaValidator';

export default function UEFA() {
    const verifyReCaptcha = GoogleReCaptchaValidator();
    const handleVerify = async () => {
        const token = await verifyReCaptcha();
        console.log(token)
    };

    return (
        <>
            <Head>
                <title>UEFA | OPPO NZ Promotions</title>
            </Head>
            Hi UEFA!

            <button onClick={handleVerify}>dfgdfgertegdfgdgdf</button>
        </>
    )
}