"use client";

import { useEffect, useState } from "react";
import { fetchCurrentEvents } from "@api/events";
import { fetchCurrentPromotions } from "@api/promotions";

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

    useEffect(() => {
        let isActive = true;

        const loadPromotionContent = async () => {
            const [promotionsResult, eventsResult] = await Promise.allSettled([
                fetchCurrentPromotions(),
                fetchCurrentEvents(),
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
        };
    }, []);

    return content;
}
