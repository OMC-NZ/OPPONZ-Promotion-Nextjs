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
<<<<<<< HEAD
            try {
                const {
                    monthlyPromotions = [],
                    currentEvents = [],
                } = await fetchHomePromotionContent();
=======
            const [promotionsResult, eventsResult] = await Promise.allSettled([
                fetchCurrentPromotions(),
                fetchCurrentEvents(),
            ]);
>>>>>>> 5eb32891f151cb34e88ae7acece4b2f93f24991d

                if (!isActive) return;

<<<<<<< HEAD
                setContent({
                    monthly: {
                        items: monthlyPromotions,
                        loading: false,
                    },
                    currentEvents: {
                        items: currentEvents,
                        loading: false,
                    },
                });
            } catch (error) {
                console.warn("Failed to load promotion content:", error.message);

                if (!isActive) return;

                setContent({
                    monthly: {
                        items: [],
                        loading: false,
                    },
                    currentEvents: {
                        items: [],
                        loading: false,
                    },
                });
            }
=======
            const monthlyPromotions = promotionsResult.status === "fulfilled"
                ? promotionsResult.value.items
                : [];
            const currentEvents = eventsResult.status === "fulfilled"
                ? eventsResult.value.items
                : [];

            setContent({
                monthly: {
                    items: monthlyPromotions,
                    loading: false,
                    error: promotionsResult.status === "rejected" ? promotionsResult.reason : null,
                },
                currentEvents: {
                    items: currentEvents,
                    loading: false,
                    error: eventsResult.status === "rejected" ? eventsResult.reason : null,
                },
            });
>>>>>>> 5eb32891f151cb34e88ae7acece4b2f93f24991d
        };

        loadPromotionContent();

        return () => {
            isActive = false;
        };
    }, []);

    return content;
}
