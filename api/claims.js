import { fetchHomePromos } from "./homePromos";

const CLAIMS_ENDPOINT = "/api/backend/claims";
const CLAIM_STATUS_ENDPOINT = "/api/backend/claims/status";

export const submitClaim = async (claimBody, recaptcha) => {
    try {
        return await fetchHomePromos(CLAIMS_ENDPOINT, {
            method: "POST",
            baseUrl: "",
            headers: {
                ...(recaptcha?.token ? { "x-recaptcha-token": recaptcha.token } : {}),
                ...(recaptcha?.action ? { "x-recaptcha-action": recaptcha.action } : {}),
            },
            body: claimBody,
        });
    } catch (error) {
        if (error?.body && typeof error.body === "object") {
            return error.body;
        }

        throw error;
    }
};

export const fetchClaimStatus = async ({
    claimId,
    email,
    recaptchaToken,
    recaptchaAction,
}) => {
    try {
        return await fetchHomePromos(CLAIM_STATUS_ENDPOINT, {
            method: "POST",
            baseUrl: "",
            body: {
                claim_id: claimId,
                email,
                ...(recaptchaToken ? { recaptcha_token: recaptchaToken } : {}),
                ...(recaptchaAction ? { recaptcha_action: recaptchaAction } : {}),
            },
        });
    } catch (error) {
        if (error?.body && typeof error.body === "object") {
            return error.body;
        }

        throw error;
    }
};
