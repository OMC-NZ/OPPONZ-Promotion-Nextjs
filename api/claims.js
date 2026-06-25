import { fetchHomePromos } from "./homePromos";

const CLAIMS_ENDPOINT = "/api/backend/claims";

export const submitClaim = async (claimBody) => {
    try {
        return await fetchHomePromos(CLAIMS_ENDPOINT, {
            method: "POST",
            baseUrl: "",
            body: claimBody,
        });
    } catch (error) {
        if (error?.body && typeof error.body === "object") {
            return error.body;
        }

        throw error;
    }
};
