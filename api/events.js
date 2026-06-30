import { fetchHomePromos } from "./homePromos";

const CURRENT_EVENTS_ENDPOINT = "/api/backend/events/current";
const EVENT_FORM_ENDPOINT = (slug) => `/api/backend/events/${encodeURIComponent(slug)}/form`;

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
