import { fetchHomePromos } from "./homePromos";

const VERIFY_ELIGIBILITY_ENDPOINT = "/api/backend/promotions/verify-imei-purchase";

const buildGiftItems = (gifts, promotionId) => {
    const groups = new Map();

    gifts.forEach((gift) => {
        const name = gift.name || "Gift";
        const nameKey = name.trim().toLowerCase();
        const color = gift.color || "";
        const colorKey = color.trim().toLowerCase() || "included";

        if (!groups.has(nameKey)) {
            groups.set(nameKey, { name, options: new Map() });
        }

        const group = groups.get(nameKey);
        if (!group.options.has(colorKey)) {
            group.options.set(colorKey, {
                label: color || "Included",
                color,
                alias: gift.alias || "",
            });
        }
    });

    return Array.from(groups.values()).map((group, groupIndex) => ({
        id: `gift-${promotionId}-${groupIndex}`,
        name: group.name,
        options: Array.from(group.options.values()).map((option, optionIndex) => ({
            id: `gift-${promotionId}-${groupIndex}-${optionIndex}`,
            ...option,
        })),
    }));
};

const normalizePromotion = (promotion) => {
    const channelName = promotion.channel?.name || "";
    const channelPeriod = promotion.channel?.period || "";
    const gifts = Array.isArray(promotion.gifts)
        ? promotion.gifts.map((gift) => ({
            ...gift,
            name: gift.name || "Gift",
            alias: gift.alias || "",
            color: gift.color || "",
        }))
        : [];

    return {
        ...promotion,
        id: promotion.promotion_id,
        promotionId: promotion.promotion_id,
        title: promotion.title || "Eligible Promotion",
        campaignTitle: promotion.title || "Eligible Promotion",
        subtitle: promotion.description || "",
        description: promotion.description || "",
        channelName,
        promotionPeriodLabel: channelName ? `${channelName} Period:` : "Promotion Period:",
        promotionPeriod: channelPeriod || promotion.date || "",
        gift: promotion.description || "",
        gifts,
        giftItems: buildGiftItems(gifts, promotion.promotion_id),
        url: promotion.banner_url || "",
        bannerUrl: promotion.banner_url || "",
        slug: promotion.slug_url || "",
        slugUrl: promotion.slug_url || "",
    };
};

export const verifyPromotionEligibility = async ({
    imei,
    purchaseDate,
    recaptchaToken,
    recaptchaAction,
}) => {
    const response = await fetchHomePromos(VERIFY_ELIGIBILITY_ENDPOINT, {
        method: "POST",
        baseUrl: "",
        body: {
            imei: imei.replace(/\s+/g, ""),
            purchase_date: purchaseDate,
            ...(recaptchaToken ? { recaptcha_token: recaptchaToken } : {}),
            ...(recaptchaAction ? { recaptcha_action: recaptchaAction } : {}),
        },
    });

    if (!response?.success) {
        throw new Error(response?.message || "Unable to verify promotion eligibility.");
    }

    const promotions = Array.isArray(response.data?.promotions)
        ? response.data.promotions.map(normalizePromotion)
        : [];
    const eligible = Boolean(response.data?.eligible && promotions.length > 0);

    return {
        eligible,
        promotion: eligible ? promotions[0] : null,
        promotions,
        reason: response.data?.reason || null,
        message: response.data?.message || null,
        requestId: response.requestId || null,
    };
};
