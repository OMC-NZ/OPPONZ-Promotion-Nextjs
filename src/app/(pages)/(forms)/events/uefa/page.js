"use client"

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const recaptchaSiteKeyV3 = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3;

export default function UEFA() {
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleVerify = async () => {
        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }

        const token = await executeRecaptcha('yourAction');
        // send token to server for verification
        // console.log(token);
    };

    return (
        <>
            <title>UEFA | OPPO NZ Promotions</title>
            <div>
                Hi UEFA!
                <br />
                <br />
                {/* <button onClick={handleVerify}>Submit me</button> */}
                <br />
                <br />
            </div>
            <br />
            <br />
        </>
    )
}