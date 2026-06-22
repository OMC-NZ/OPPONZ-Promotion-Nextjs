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
            try {
                const {
                    monthlyPromotions = [],
                    currentEvents = [],
                } = await fetchHomePromotionContent();

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
        };

        loadPromotionContent();

        return () => {
            isActive = false;
        };
    }, []);

    return content;
}
