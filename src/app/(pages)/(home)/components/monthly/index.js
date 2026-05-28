"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import style from "./style.module.css";
import globalStyle from "@app/publicstyle.module.css";
import useWindowSize from "@hooks/useWindowSize";
import usePagination from "@hooks/usePagination";
import PaginationButtons from "@app/components/public/pagination/index";
import Redeem from "../../../../components/modals/redeem";
import Track from "../../../../components/modals/track";
import MonthlyModal from "./monthlyModal";
import { monthlyPromotions, hasMonthlyPromotions } from "@data/monthlyPromotions";
import { FaAngleRight } from "react-icons/fa";

const TOUCH_CAROUSEL_MAX_WIDTH = 1366;
const TABLET_LAYOUT_MAX_WIDTH = 1100;

export default function MonthlyPromotions() {
    const { width: windowWidth } = useWindowSize();
    const [windowWidthValid, setWindowWidthValid] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [loadedImages, setLoadedImages] = useState({});
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const didSwipeRef = useRef(false);
    const [isVisible, setIsVisible] = useState({
        redeem: false,
        track: false,
    });

    const { imgsPerPage, currentPage, setCurrentPage, totalPages } =
        usePagination(windowWidth, monthlyPromotions.length, "MonthlyPromotions");

    useEffect(() => {
        if (!Number.isNaN(windowWidth) && windowWidth > 0) {
            setWindowWidthValid(true);
        }
    }, [windowWidth]);

    useEffect(() => {
        const shouldLockBody =
            isVisible.redeem || isVisible.track || Boolean(selectedPromotion);

        document.body.style.overflow = shouldLockBody ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isVisible, selectedPromotion]);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const canDragCarousel = (event) => {
        const isTouchPointer = event.pointerType === "touch" || event.pointerType === "pen";

        return (
            totalPages > 1 &&
            (isTouchPointer || windowWidth <= TOUCH_CAROUSEL_MAX_WIDTH)
        );
    };

    const handleDragStart = (event) => {
        if (!canDragCarousel(event)) return;

        dragStartRef.current = { x: event.clientX, y: event.clientY };
        setIsDragging(true);
        setDragOffset(0);
        didSwipeRef.current = false;

        event.currentTarget.setPointerCapture?.(event.pointerId);
    };

    const handleDragMove = (event) => {
        if (!isDragging) return;

        const deltaX = event.clientX - dragStartRef.current.x;
        const deltaY = event.clientY - dragStartRef.current.y;

        if (Math.abs(deltaX) < Math.abs(deltaY)) {
            return;
        }

        const isFirstPage = currentPage === 0;
        const isLastPage = currentPage === totalPages - 1;
        const isPullingPastStart = isFirstPage && deltaX > 0;
        const isPullingPastEnd = isLastPage && deltaX < 0;

        setDragOffset(isPullingPastStart || isPullingPastEnd ? deltaX * 0.28 : deltaX);
    };

    const finishDrag = (event) => {
        if (!isDragging) return;

        const deltaX = event.clientX - dragStartRef.current.x;
        const deltaY = event.clientY - dragStartRef.current.y;
        const isHorizontalSwipe = Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY);

        setIsDragging(false);
        setDragOffset(0);
        event.currentTarget.releasePointerCapture?.(event.pointerId);

        if (!isHorizontalSwipe) return;

        didSwipeRef.current = true;

        if (deltaX < 0) {
            handlePageChange(currentPage + 1);
        } else {
            handlePageChange(currentPage - 1);
        }

        window.setTimeout(() => {
            didSwipeRef.current = false;
        }, 120);
    };

    const cancelDrag = (event) => {
        if (!isDragging) return;

        setIsDragging(false);
        setDragOffset(0);
        event.currentTarget.releasePointerCapture?.(event.pointerId);
    };

    const toggleVisibility = (type, state) => {
        setIsVisible((prev) => ({ ...prev, [type]: state }));
    };

    const openPromotionModal = (promotion) => {
        if (didSwipeRef.current) return;
        setSelectedPromotion(promotion);
    };

    const handleImageLoad = (promotionId) => {
        setLoadedImages((prev) => ({ ...prev, [promotionId]: true }));
    };

    const closeMonthlyModal = () => {
        setSelectedPromotion(null);
    };

    const promotionPages = Array.from({ length: totalPages }, (_, pageIndex) => {
        const startIndex = pageIndex * imgsPerPage;
        const endIndex = startIndex + imgsPerPage;
        return monthlyPromotions.slice(startIndex, endIndex);
    });

    const showPaginationButtons =
        (windowWidth <= TABLET_LAYOUT_MAX_WIDTH && monthlyPromotions.length > 2) ||
        (windowWidth <= 768 && monthlyPromotions.length === 2) ||
        monthlyPromotions.length > 3;

    const shouldShow = windowWidthValid && hasMonthlyPromotions;

    if (!shouldShow) return null;

    return (
        <>
            <Redeem
                isVisible={isVisible.redeem}
                onClose={() => toggleVisibility("redeem", false)}
            />

            <Track
                isVisible={isVisible.track}
                onClose={() => toggleVisibility("track", false)}
            />

            <MonthlyModal
                promotion={selectedPromotion}
                onClose={closeMonthlyModal}
            />

            <div className={globalStyle.itemsBlock}>
                <div className={globalStyle.itemsTitle}>
                    <p>Monthly Promotion</p>
                </div>

                <div
                    className={style.carouselViewport}
                    onPointerDown={handleDragStart}
                    onPointerMove={handleDragMove}
                    onPointerUp={finishDrag}
                    onPointerCancel={cancelDrag}
                    onPointerLeave={cancelDrag}
                >
                    <div
                        className={`${style.carouselTrack} ${isDragging ? style.carouselTrackDragging : ""}`}
                        style={{
                            transform: `translateX(calc(-${currentPage * 100}% - ${currentPage * 16}px + ${dragOffset}px))`,
                        }}
                    >
                        {promotionPages.map((pagePromotions, pageIndex) => (
                            <div className={style.carouselPage} key={pageIndex}>
                                <div className={style.mostthree}>
                                    {pagePromotions.map((promotion) => (
                                        <div
                                            key={promotion.id}
                                            className={`${style.promoCard} ${imgsPerPage === 3
                                                ? style.cpimg_th
                                                : imgsPerPage === 2
                                                    ? style.cpimg_t
                                                    : style.cpimg_o
                                                } ${style.imgBorder} ${style.imgSize}`}
                                            onClick={() => openPromotionModal(promotion)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    openPromotionModal(promotion);
                                                }
                                            }}
                                        >
                                            {!loadedImages[promotion.id] && (
                                                <div className={style.imageLoading}>
                                                    <span className={style.loadingSpinner} />
                                                </div>
                                            )}

                                            <Image
                                                src={promotion.url}
                                                alt={promotion.title}
                                                width={620}
                                                height={420}
                                                quality={100}
                                                className={`${style.promoImage} ${loadedImages[promotion.id] ? style.imageLoaded : style.imagePending}`}
                                                onLoad={() => handleImageLoad(promotion.id)}
                                                onError={() => handleImageLoad(promotion.id)}
                                                priority
                                            />

                                            <div className={style.promoOverlay}>
                                                <button
                                                    type="button"
                                                    className={style.overlayBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openPromotionModal(promotion);
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "10px",
                                                            lineHeight: 1,
                                                        }}
                                                    >
                                                        <span>View Details</span>
                                                        <FaAngleRight style={{ display: "unset" }} />
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={style.claim_button}>
                    <button
                        type="button"
                        className={style.btn}
                        onClick={() => toggleVisibility("redeem", true)}
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
