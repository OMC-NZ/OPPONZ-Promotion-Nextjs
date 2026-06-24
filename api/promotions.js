import { fetchHomePromos } from "./homePromos";

const CURRENT_PROMOTIONS_ENDPOINT = "/api/backend/promotions/current";

export const normalizeCurrentPromotions = (response) => {
    if (!response?.success || !Array.isArray(response.data)) return [];

    return response.data.map((promotion, index) => {
        const slug = promotion.url || `promotion-${index + 1}`;

        return {
            id: slug,
            slug,
            title: promotion.title || "Current Promotion",
            subtitle: promotion.gifts || "",
            description: promotion.gifts || "",
            banner: promotion.banner || "",
            imageUrl: promotion.banner || "",
            channels: Array.isArray(promotion.channels) ? promotion.channels : [],
        };
    }).filter((promotion) => promotion.imageUrl);
};

export const fetchCurrentPromotions = async (options = {}) => {
    const { recaptcha, headers, ...fetchOptions } = options;
    const response = await fetchHomePromos(CURRENT_PROMOTIONS_ENDPOINT, {
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
        items: normalizeCurrentPromotions(response),
        requestId: response?.requestId || null,
    };
};
