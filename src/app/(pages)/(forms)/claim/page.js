"use client"

import Head from 'next/head';
import GoogleReCaptchaValidator from '@/hooks/useGoogleReCaptchaValidator';

export default function Claim() {
    const verifyReCaptcha = GoogleReCaptchaValidator();
    const handleVerify = async () => {
        const token = await verifyReCaptcha();
        console.log(token)
    };

    return (
        <>
            <Head>
                <title>Claim | OPPO NZ Promotions</title>
            </Head>
            Hi Claim!

            <button onClick={handleVerify}>dfgdfgertegdfgdgdf</button>
        </>
    )
}