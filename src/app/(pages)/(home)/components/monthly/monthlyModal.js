"use client";

import { useEffect } from "react";
import style from "./style.module.css";

export default function MonthlyModal({ promotion, onClose }) {
    useEffect(() => {
        if (!promotion) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [promotion, onClose]);

    if (!promotion) return null;

    return (
        <div className={style.modalMask} onClick={onClose}>
            <div
                className={style.modalCard}
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className={style.modalClose}
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ×
                </button>

                <h3 className={style.modalTitle}>{promotion.title}</h3>
                <p className={style.modalSubtitle}>{promotion.subtitle}</p>
                <p className={style.modalDescription}>{promotion.description}</p>

                <div className={style.modalActions}>
                    <button type="button" className={style.btn} onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}