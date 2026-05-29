"use client";

import { useEffect, useState } from "react";
import { monthlyPromotions } from "@data/monthlyPromotions";
import { currentEvents } from "@data/currentEvents";

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
            // Replace these Promise wrappers with real API calls when the endpoints are ready.
            const [monthlyItems, currentEventItems] = await Promise.all([
                Promise.resolve(monthlyPromotions),
                Promise.resolve(currentEvents),
            ]);

            if (!isActive) return;

            setContent({
                monthly: {
                    items: monthlyItems,
                    loading: false,
                },
                currentEvents: {
                    items: currentEventItems,
                    loading: false,
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
