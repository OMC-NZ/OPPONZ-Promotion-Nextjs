import { fetchHomePromos } from "./homePromos";

const CLAIMS_ENDPOINT = "/api/backend/claims";

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
