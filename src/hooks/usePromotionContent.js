"use client";

import { useEffect, useState } from "react";
import { fetchHomePromotionContent } from "@api/homePromos";

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
            const { monthlyPromotions, currentEvents } = await fetchHomePromotionContent();

            if (!isActive) return;

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
        };

        loadPromotionContent();

        return () => {
            isActive = false;
        };
    }, []);

    return content;
}
