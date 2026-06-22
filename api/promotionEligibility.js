import { monthlyPromotions } from "@data/monthlyPromotions";

const eligibleTestImeis = new Set([
    "861234567890123",
    "861234567890130",
    "861234567890147",
    "861234567890154",
    "861234567890161",
]);

export const verifyPromotionEligibility = async ({ imei, purchaseDate }) => {
    // Replace this mock with the real eligibility endpoint when it is ready.
    await new Promise((resolve) => setTimeout(resolve, 900));

    const cleanedImei = imei.replace(/\s+/g, "");
    const hasEligiblePromotion = eligibleTestImeis.has(cleanedImei);

    if (!hasEligiblePromotion) {
        return {
            eligible: false,
            promotion: null,
        };
    }

    return {
        eligible: true,
        promotion: {
            ...monthlyPromotions[1],
            campaignTitle: "OPPO Reno10 5G Gift Campaign",
            gift: "OPPO Enco Air2",
            validFrom: "01 Jan 2026",
            validTo: "31 Jan 2026",
            purchaseDate,
        },
    };
};
