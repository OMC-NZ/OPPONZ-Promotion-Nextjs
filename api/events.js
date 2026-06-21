import { defaultEventFormConfig } from "@data/currentEvents";
import { fetchHomePromos } from "./homePromos";

const CURRENT_EVENTS_ENDPOINT = "/api/backend/events/current";
const LOCAL_EVENT_IMAGE_COUNT = 4;

const buildEventImageUrl = (index) => {
    const imageNumber = (index % LOCAL_EVENT_IMAGE_COUNT) + 1;
    return `/temporary/events/2ds/events${String(imageNumber).padStart(2, "0")}.jpg`;
};

export const normalizeCurrentEvents = (response) => {
    if (!response?.success || !Array.isArray(response.data)) return [];

    return response.data.map((event, index) => {
        const slug = event.slug_url || `event-${index + 1}`;
        const imageUrl = buildEventImageUrl(index);

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
    });
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
