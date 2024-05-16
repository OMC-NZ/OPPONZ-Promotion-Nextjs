import { useCallback } from 'react';
import { useExecuteReCaptcha } from 'react-grecaptcha-v3';

const useGoogleReCaptchaValidator = () => {
    const executeRecaptcha = useExecuteReCaptcha();

    const verifyReCaptcha = useCallback(async () => {
        const token = await executeRecaptcha('userAction');
        return token;
        // 在这里可以对 token 做进一步处理
    }, [executeRecaptcha]);

    return verifyReCaptcha;
};

export default useGoogleReCaptchaValidator;
