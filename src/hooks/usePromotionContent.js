"use client";

import { useEffect, useState } from "react";
import { fetchCurrentEvents } from "@api/events";
import { fetchCurrentPromotions } from "@api/promotions";
import useRecaptchaAction from "@hooks/useRecaptchaAction";

const initialContent = {
    monthly: {
        items: [],
        loading: true,
    },
    currentEvents: {
        items: [],
        loading: true,
    },
};

let promotionContentRequest = null;

export default function usePromotionContent() {
    const [content, setContent] = useState(initialContent);
    const verifyRecaptcha = useRecaptchaAction();

    useEffect(() => {
        let isActive = true;

        const loadPromotionContent = async () => {
            if (!promotionContentRequest) {
                promotionContentRequest = (async () => {
                    const promotionsRecaptcha = await verifyRecaptcha("promotions_current");
                    const eventsRecaptcha = await verifyRecaptcha("events_current");

                    const [promotionsResult, eventsResult] = await Promise.allSettled([
                        fetchCurrentPromotions({ recaptcha: promotionsRecaptcha }),
                        fetchCurrentEvents({ recaptcha: eventsRecaptcha }),
                    ]);

                    const currentPromotions = promotionsResult.status === "fulfilled"
                        ? promotionsResult.value.items
                        : [];
                    const currentEvents = eventsResult.status === "fulfilled"
                        ? eventsResult.value.items
                        : [];

                    return {
                        monthly: {
                            items: currentPromotions,
                            loading: false,
                            error: promotionsResult.status === "rejected" ? promotionsResult.reason : null,
                        },
                        currentEvents: {
                            items: currentEvents,
                            loading: false,
                            error: eventsResult.status === "rejected" ? eventsResult.reason : null,
                        },
                    };
                })();
            }

            const currentRequest = promotionContentRequest;
            let nextContent = null;

            try {
                nextContent = await currentRequest;
            } catch (error) {
                if (promotionContentRequest === currentRequest) {
                    promotionContentRequest = null;
                }

                if (!isActive) return;

                console.error("Failed to load promotion content:", error);
                setContent({
                    monthly: {
                        items: [],
                        loading: false,
                        error,
                    },
                    currentEvents: {
                        items: [],
                        loading: false,
                        error,
                    },
                });
                return;
            }

            if (promotionContentRequest === currentRequest) {
                promotionContentRequest = null;
            }

            if (!isActive) return;

            setContent(nextContent);
        };

        loadPromotionContent();

        return () => {
            isActive = false;
        };
    }, [verifyRecaptcha]);

    return content;
}
