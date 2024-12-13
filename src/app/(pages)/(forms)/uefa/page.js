"use client"

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import ReCAPTCHA from 'react-google-recaptcha';
import { useState } from 'react';

const recaptchaSiteKeyV3 = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3;
const recaptchaSiteKeyV2 = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2;

export default function UEFA() {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [showRecaptchaV2, setShowRecaptchaV2] = useState(true);
    const [recaptchaV2Token, setRecaptchaV2Token] = useState(null);


    const handleV2Verify = (token) => {
        setRecaptchaV2Token(token);
    };

    const handleVerify = async () => {
        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }

        const token = await executeRecaptcha('yourAction');
        // 发送 token 到你的服务器进行验证
        // console.log(token);
    };

    const handleV2Submit = async () => {
        if (!recaptchaV2Token) {
            console.log('Please complete the reCAPTCHA');
            return;
        }
    }

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
                {/* {showRecaptchaV2 && (
                    <div>
                        <ReCAPTCHA
                            sitekey={recaptchaSiteKeyV2}
                            onChange={handleV2Verify}
                        />
                    </div>
                )} */}
            </div>
            <br />
            <br />
        </>
    )
}