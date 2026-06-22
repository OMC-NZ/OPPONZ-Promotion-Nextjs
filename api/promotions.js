import { fetchHomePromos } from "./homePromos";

const CURRENT_PROMOTIONS_ENDPOINT = "/api/backend/promotions/current";
const LOCAL_PROMOTION_IMAGE_COUNT = 9;

const buildPromotionImageUrl = (index) => {
    const imageNumber = (index % LOCAL_PROMOTION_IMAGE_COUNT) + 1;
    return `/temporary/img/promo${String(imageNumber).padStart(2, "0")}.jpg`;
};

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
            imageUrl: buildPromotionImageUrl(index),
            channels: Array.isArray(promotion.channels) ? promotion.channels : [],
        };
    });
};

export const fetchCurrentPromotions = async (options = {}) => {
    const response = await fetchHomePromos(CURRENT_PROMOTIONS_ENDPOINT, {
        method: "GET",
        baseUrl: "",
        ...options,
    });

    return {
        items: normalizeCurrentPromotions(response),
        requestId: response?.requestId || null,
    };
};
