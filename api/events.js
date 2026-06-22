import { defaultEventFormConfig } from "@data/currentEvents";
import { fetchHomePromos } from "./homePromos";

const CURRENT_EVENTS_ENDPOINT = "/api/backend/events/current";

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
            formConfig: defaultEventFormConfig,
        };
    }).filter((event) => event.imageUrl);
};

export const fetchCurrentEvents = async (options = {}) => {
    const response = await fetchHomePromos(CURRENT_EVENTS_ENDPOINT, {
        method: "GET",
        baseUrl: "",
        ...options,
    });

    return {
        items: normalizeCurrentEvents(response),
        requestId: response?.requestId || null,
    };
};
