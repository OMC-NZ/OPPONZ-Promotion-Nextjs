"use client";

import { useEffect } from "react";
import style from "./style.module.css";

const formatDate = (value) => {
    if (!value) return "";

    return new Intl.DateTimeFormat("en-NZ", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
};

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
            <div className={style.modalCard} onClick={(event) => event.stopPropagation()}>
                <button
                    type="button"
                    className={style.modalClose}
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    &times;
                </button>

                <h3 className={style.modalTitle}>{promotion.title}</h3>
                <p className={style.modalSubtitle}>{promotion.subtitle}</p>

                {promotion.channels?.length > 0 && (
                    <div className={style.channelList}>
                        <h4>Participating Retailers</h4>
                        {promotion.channels.map((channel, index) => (
                            <div className={style.channelRow} key={`${channel.names?.join("-") || "channel"}-${index}`}>
                                <strong>{channel.names?.join(", ") || "Participating retailer"}</strong>
                                <span>{formatDate(channel.start_date)} - {formatDate(channel.end_date)}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className={style.modalActions}>
                    <button type="button" className={style.btn} onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
