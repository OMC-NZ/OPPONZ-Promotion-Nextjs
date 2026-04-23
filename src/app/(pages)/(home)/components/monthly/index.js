"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import style from "./style.module.css";
import globalStyle from "@app/publicstyle.module.css";
import useWindowSize from "@hooks/useWindowSize";
import usePagination from "@hooks/usePagination";
import PaginationButtons from "@app/components/public/pagination/index";
import Redeem from "../../../../components/modals/redeem";
import Track from "../../../../components/modals/track";
import { monthlyPromotions, hasMonthlyPromotions } from "@data/monthlyPromotions";

export default function MonthlyPromotions() {
    const { width: windowWidth } = useWindowSize();
    const [windowWidthValid, setWindowWidthValid] = useState(false);
    const { imgsPerPage, currentPage, setCurrentPage, totalPages } = usePagination(windowWidth, monthlyPromotions.length, 'MonthlyPromotions');
    const [isVisible, setIsVisible] = useState({ redeem: false, track: false });

    useEffect(() => {
        if (!isNaN(windowWidth) && windowWidth > 0) {
            setWindowWidthValid(true);
        }
    }, [windowWidth]);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const startIndex = currentPage * imgsPerPage;
    const endIndex = startIndex + imgsPerPage;
    const currentImages = monthlyPromotions.slice(startIndex, endIndex);

    const showPaginationButtons =
        (windowWidth <= 1024 && monthlyPromotions.length > 2) ||
        (windowWidth <= 768 && monthlyPromotions.length === 2) ||
        monthlyPromotions.length > 3;

    const toggleVisibility = (type, state) => {
        setIsVisible(prev => ({ ...prev, [type]: state }));
        document.body.style.overflow = 'hidden';
    };

    const shouldShow = windowWidthValid && hasMonthlyPromotions;

    if (!shouldShow) return null;

    return (
        <>
            <Redeem isVisible={isVisible.redeem} onClose={() => toggleVisibility('redeem', false)} />
            <Track isVisible={isVisible.track} onClose={() => toggleVisibility('track', false)} />
            <div className={`${globalStyle.itemsBlock}`}>
                <div className={globalStyle.itemsTitle}>
                    <p>Monthly Promotion</p>
                </div>
                <div className={style.mostthree}>
                    {currentImages.map((step, index) => (
                        <Image
                            key={index}
                            src={step.url}
                            alt={`Promo ${index}`}
                            width={620}
                            height={420}
                            quality={100}
                            className={ `${imgsPerPage === 3 ? style.cpimg_th : imgsPerPage === 2 ? style.cpimg_t : style.cpimg_o} ${style.imgBorder} ${style.imgSize}` }
                            priority
                        />
                    ))}
                </div>
                <div className={style.claim_button}>
                    <button
                        className={style.btn}
                        onClick={() => toggleVisibility('redeem', true)}
                    >
                        Redeem My Gift
                    </button>
                </div>
                {showPaginationButtons && (
                    <PaginationButtons
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </>
    );
}
