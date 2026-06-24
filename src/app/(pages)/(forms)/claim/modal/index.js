"use client";
import Link from "next/link";
import style from "./modal.module.css";

const MONTH_NAMES = {
    jan: "January",
    january: "January",
    feb: "February",
    february: "February",
    mar: "March",
    march: "March",
    apr: "April",
    april: "April",
    may: "May",
    jun: "June",
    june: "June",
    jul: "July",
    july: "July",
    aug: "August",
    august: "August",
    sep: "September",
    sept: "September",
    september: "September",
    oct: "October",
    october: "October",
    nov: "November",
    november: "November",
    dec: "December",
    december: "December",
};

const getOrdinalDay = (day) => {
    const dayNumber = Number(day);
    const mod100 = dayNumber % 100;

    if (mod100 >= 11 && mod100 <= 13) return `${dayNumber}th`;

    if (dayNumber % 10 === 1) return `${dayNumber}st`;
    if (dayNumber % 10 === 2) return `${dayNumber}nd`;
    if (dayNumber % 10 === 3) return `${dayNumber}rd`;

    return `${dayNumber}th`;
};

const formatPeriodDate = (dateText) => {
    const match = dateText.trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (!match) return dateText.trim();

    const [, day, month, year] = match;
    const monthName = MONTH_NAMES[month.toLowerCase()] || month;

    return `${getOrdinalDay(day)} ${monthName} ${year}`;
};

const formatOfferPeriod = (promotion) => {
    const period = promotion.promotionPeriod || "";
    const channelLabel = promotion.channelName
        ? `${promotion.channelName} period:`
        : (promotion.promotionPeriodLabel || "Promotion period:").replace(/period:/i, "period:");
    const [startDate, endDate] = period.split(/\s+[-\u2013]\s+/).map((date) => date.trim());

    if (!startDate || !endDate) {
        return `${channelLabel} ${period}`;
    }

    return `${channelLabel} 00:00 (NZT) on ${formatPeriodDate(startDate)} and closing at 23:59 (NZT) on ${formatPeriodDate(endDate)} for Availably Purchasing;`;
};

function TermsLink({ href, children }) {
    const termsHref = href || "/terms";
    const isExternalTerms = /^https?:\/\//i.test(termsHref);

    if (isExternalTerms) {
        return (
            <a href={termsHref} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }

    return <Link href={termsHref}>{children}</Link>;
}

export default function DetailsModal({ promotion, setModalShow }) {
    const offerPeriodText = formatOfferPeriod(promotion);
    const termsHref = promotion.termsUrl || "/terms";

    const handleModalClose = () => {
        setModalShow(false);
        document.body.style.overflowY = "auto";
    };

    return (
        <>
            <div className={style.modal_overlay}>
                <div className={style.modal_content}>
                    <div className={style.modal_title}>
                        <p>{promotion.title}</p>
                    </div>
                    <div className={style.modal_text}>
                        <p>{promotion.description || promotion.gift || promotion.subtitle}</p>
                        {promotion.promotionPeriod && (
                            <p className={style.periodText}>
                                This offer applies to during the period commencing:
                                <span>
                                    {offerPeriodText}
                                </span>
                            </p>
                        )}
                        <p className={style.termsText}>
                            Please read carefully{" "}
                            <TermsLink href={termsHref}>
                                Terms and Conditiions
                            </TermsLink>{" "}
                            during claiming for your device you accept and agree to all of them.
                        </p>
                    </div>
                    <div className={style.modal_close}>
                        <button className={style.close_button} onClick={handleModalClose}>Close</button>
                    </div>
                </div>
            </div>
        </>
    );
}
