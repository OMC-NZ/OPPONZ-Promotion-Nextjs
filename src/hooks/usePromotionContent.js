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

export default function usePromotionContent() {
    const [content, setContent] = useState(initialContent);
    const verifyRecaptcha = useRecaptchaAction();

    useEffect(() => {
        let isActive = true;
        let retryTimer = null;

        const loadPromotionContent = async () => {
            const [promotionsRecaptcha, eventsRecaptcha] = await Promise.all([
                verifyRecaptcha("promotions_current"),
                verifyRecaptcha("events_current"),
            ]);

            if (promotionsRecaptcha?.unavailable || eventsRecaptcha?.unavailable) {
                retryTimer = window.setTimeout(loadPromotionContent, 1000);
                return;
            }

            const [promotionsResult, eventsResult] = await Promise.allSettled([
                fetchCurrentPromotions({ recaptcha: promotionsRecaptcha }),
                fetchCurrentEvents({ recaptcha: eventsRecaptcha }),
            ]);

            if (!isActive) return;

            const currentPromotions = promotionsResult.status === "fulfilled"
                ? promotionsResult.value.items
                : [];
            const currentEvents = eventsResult.status === "fulfilled"
                ? eventsResult.value.items
                : [];

            setContent({
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
            });
        };

        loadPromotionContent();

        return () => {
            isActive = false;
            if (retryTimer) {
                window.clearTimeout(retryTimer);
            }
        };
    }, [verifyRecaptcha]);

    return content;
}
