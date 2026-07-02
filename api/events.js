import { fetchHomePromos } from "./homePromos";

const CURRENT_EVENTS_ENDPOINT = "/api/backend/events/current";
const EVENT_FORM_ENDPOINT = (slug) => `/api/backend/events/${encodeURIComponent(slug)}/form`;
const EVENT_CLAIMS_ENDPOINT = (slug) => `/api/backend/events/${encodeURIComponent(slug)}/claims`;
const VERIFY_EVENT_IMEI_ENDPOINT = "/api/backend/events/verify-imei-channel";

export const normalizeCurrentEvents = (response) => {
    if (!response?.success || !Array.isArray(response.data)) return [];

    return response.data.map((event, index) => {
        const slug = event.slug_url || `event-${index + 1}`;
        const imageUrl = event.banner_url || "";

        return {
            id: slug,
            slug,
            title: event.name || "Current Event",
            url: imageUrl,
            imageUrl,
            bannerUrl: imageUrl,
            banner: event.banner_url || "",
            termsUrl: event.terms_url || "",
            termsTitle: `${event.name || "Event"} Terms and Conditions`,
            termsSummary: "Claims are subject to event eligibility, verification, and availability.",
            claimUrl: `/events/${encodeURIComponent(slug)}`,
            href: `/events/${encodeURIComponent(slug)}`,
        };
    }).filter((event) => event.imageUrl);
};

export const fetchCurrentEvents = async (options = {}) => {
    const { recaptcha, headers, ...fetchOptions } = options;
    const response = await fetchHomePromos(CURRENT_EVENTS_ENDPOINT, {
        method: "GET",
        baseUrl: "",
        headers: {
            ...headers,
            ...(recaptcha?.token ? { "x-recaptcha-token": recaptcha.token } : {}),
            ...(recaptcha?.action ? { "x-recaptcha-action": recaptcha.action } : {}),
        },
        ...fetchOptions,
    });

    return {
        items: normalizeCurrentEvents(response),
        requestId: response?.requestId || null,
    };
};

export const fetchEventForm = async (slug, options = {}) => {
    const { recaptcha, headers, ...fetchOptions } = options;
    const response = await fetchHomePromos(EVENT_FORM_ENDPOINT(slug), {
        method: "GET",
        baseUrl: "",
        headers: {
            ...headers,
            ...(recaptcha?.token ? { "x-recaptcha-token": recaptcha.token } : {}),
            ...(recaptcha?.action ? { "x-recaptcha-action": recaptcha.action } : {}),
        },
        ...fetchOptions,
    });

    return {
        data: response?.data || null,
        requestId: response?.requestId || null,
    };
};

export const submitEventClaim = async (slug, claimBody, recaptcha) => {
    try {
        return await fetchHomePromos(EVENT_CLAIMS_ENDPOINT(slug), {
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

export const verifyEventImeiChannel = async ({
    imei,
    slug,
    recaptchaToken,
    recaptchaAction,
}) => {
    const body = {
        imei: imei.replace(/\s+/g, ""),
        slug_url: slug,
        ...(recaptchaToken ? { recaptcha_token: recaptchaToken } : {}),
        ...(recaptchaAction ? { recaptcha_action: recaptchaAction } : {}),
    };

    const response = await fetchHomePromos(VERIFY_EVENT_IMEI_ENDPOINT, {
        method: "POST",
        baseUrl: "",
        body,
    });

    if (!response?.success) {
        throw new Error(response?.message || "Unable to verify IMEI-1.");
    }

    const verified = (
        response.data === true
        || response.data?.verified === true
        || response.data?.eligible === true
        || response.verified === true
        || response.eligible === true
    );

    return {
        verified,
        message: response?.message || null,
        requestId: response?.requestId || null,
    };
};
