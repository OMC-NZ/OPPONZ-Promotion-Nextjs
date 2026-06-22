"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import style from "./style.module.css";
import globalStyle from "@app/publicstyle.module.css";
import useWindowSize from "@hooks/useWindowSize";
import usePagination from "@hooks/usePagination";
import usePromotionContent from "@hooks/usePromotionContent";
import Redeem from "../../../../components/modals/redeem";
import Track from "../../../../components/modals/track";
import MonthlyModal from "./monthlyModal";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const TABLET_LAYOUT_MAX_WIDTH = 1100;

export default function MonthlyPromotions() {
    const { width: windowWidth } = useWindowSize();
    const { monthly } = usePromotionContent();
    const monthlyItems = monthly.items;
    const isMonthlyLoading = monthly.loading;
    const [windowWidthValid, setWindowWidthValid] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [loadedImages, setLoadedImages] = useState({});
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isPageReady, setIsPageReady] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const didSwipeRef = useRef(false);
    const [isVisible, setIsVisible] = useState({
        redeem: false,
        track: false,
    });

    const { imgsPerPage, currentPage, setCurrentPage, totalPages } =
        usePagination(windowWidth, monthlyItems.length, "MonthlyPromotions");

    useEffect(() => {
        if (!Number.isNaN(windowWidth) && windowWidth > 0) {
            setWindowWidthValid(true);
        }
    }, [windowWidth]);

    useEffect(() => {
        if (document.readyState === "complete") {
            setIsPageReady(true);
            return;
        }

        const handleLoad = () => setIsPageReady(true);
        window.addEventListener("load", handleLoad, { once: true });

        return () => window.removeEventListener("load", handleLoad);
    }, []);

    useEffect(() => {
        const shouldLockBody =
            isVisible.redeem || isVisible.track || Boolean(selectedPromotion);

        document.body.style.overflowY = shouldLockBody ? "hidden" : "";

        return () => {
            document.body.style.overflowY = "";
        };
    }, [isVisible, selectedPromotion]);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDragStart = (event) => {
        if (totalPages <= 1) return;

        dragStartRef.current = { x: event.clientX, y: event.clientY };
        setIsDragging(true);
        setDragOffset(0);
        didSwipeRef.current = false;
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
    };

    const toggleVisibility = (type, state) => {
        setIsVisible((prev) => ({ ...prev, [type]: state }));
    };

    const openPromotionModal = (promotion) => {
        if (didSwipeRef.current) return;
        setSelectedPromotion(promotion);
    };

    const handleImageLoad = (promotionUrl) => {
        setLoadedImages((prev) => ({ ...prev, [promotionUrl]: true }));
    };

    const closeMonthlyModal = () => {
        setSelectedPromotion(null);
    };

    const promotionPages = Array.from({ length: totalPages }, (_, pageIndex) => {
        const startIndex = pageIndex * imgsPerPage;
        const endIndex = startIndex + imgsPerPage;
        return monthlyItems.slice(startIndex, endIndex);
    });

    const showPaginationDots = totalPages > 1;

    const getLoadingCardCount = () => {
        if (windowWidth > TABLET_LAYOUT_MAX_WIDTH) return 3;
        if (windowWidth > 768) return 2;
        return 1;
    };

    const getCardSizeClass = (itemsPerRow) => {
        if (itemsPerRow === 3) return style.cpimg_th;
        if (itemsPerRow === 2) return style.cpimg_t;
        return style.cpimg_o;
    };

    const loadingCardCount = getLoadingCardCount();
    const loadingCardSizeClass = getCardSizeClass(loadingCardCount);
    const shouldShow = isMonthlyLoading || monthlyItems.length > 0;

    if (!shouldShow) return null;

    return (
        <>
            <Redeem
                isVisible={isVisible.redeem}
                onClose={() => toggleVisibility("redeem", false)}
                onOpenTrack={() => toggleVisibility("track", true)}
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

                {isMonthlyLoading ? (
                    <div className={style.mostthree} aria-hidden="true">
                        {Array.from({ length: loadingCardCount }).map((_, index) => (
                            <div
                                key={index}
                                className={`${style.promoCard} ${loadingCardSizeClass} ${style.imgBorder} ${style.imgSize} ${style.loadingCard}`}
                            >
                                <div className={style.imageLoading}>
                                    <span className={style.loadingSpinner} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
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
                                transform: `translateX(calc(-${currentPage * 100}% + ${dragOffset}px))`,
                            }}
                        >
                            {promotionPages.map((pagePromotions, pageIndex) => (
                                <div className={style.carouselPage} key={pageIndex}>
                                    <div className={style.mostthree}>
                                        {pagePromotions.map((promotion) => (
                                            <div
                                                key={promotion.url}
                                                className={`${style.promoCard} ${getCardSizeClass(imgsPerPage)} ${style.imgBorder} ${style.imgSize}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openPromotionModal(promotion);
                                                }}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        openPromotionModal(promotion);
                                                    }
                                                }}
                                            >
                                                {!loadedImages[promotion.url] && (
                                                    <div className={style.imageLoading}>
                                                        <span className={style.loadingSpinner} />
                                                    </div>
                                                )}

                                                <Image
<<<<<<< HEAD
                                                    src={promotion.banner}
=======
                                                    src={promotion.imageUrl}
>>>>>>> 5eb32891f151cb34e88ae7acece4b2f93f24991d
                                                    alt={promotion.title}
                                                    width={620}
                                                    height={420}
                                                    quality={100}
<<<<<<< HEAD
                                                    unoptimized
                                                    className={`${style.promoImage} ${loadedImages[promotion.url] ? style.imageLoaded : style.imagePending}`}
                                                    onLoad={() => handleImageLoad(promotion.url)}
                                                    onError={() => handleImageLoad(promotion.url)}
=======
                                                    unoptimized={promotion.imageUrl?.startsWith("http")}
                                                    className={`${style.promoImage} ${loadedImages[promotion.id] ? style.imageLoaded : style.imagePending}`}
                                                    onLoad={() => handleImageLoad(promotion.id)}
                                                    onError={() => handleImageLoad(promotion.id)}
>>>>>>> 5eb32891f151cb34e88ae7acece4b2f93f24991d
                                                    priority
                                                />

                                                <div className={style.promoOverlay}>
                                                    <button
                                                        type="button"
                                                        className={style.overlayBtn}
                                                        onPointerDown={(e) => e.stopPropagation()}
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
                )}

                {!isMonthlyLoading && (
                    <div className={style.claim_button}>
                        <button
                            type="button"
                            className={style.btn}
                            disabled={!isPageReady}
                            onClick={() => toggleVisibility("redeem", true)}
                        >
                            {!isPageReady && <span className={style.buttonSpinner} />}
                            {isPageReady ? "Redeem My Gift" : "Loading"}
                        </button>
                    </div>
                )}

                {!isMonthlyLoading && showPaginationDots && (
                    <>
                        <div className={style.carouselDots}>
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`${style.carouselDot} ${index === currentPage ? style.carouselDotActive : ""}`}
                                    onClick={() => handlePageChange(index)}
                                    aria-label={`Go to promotion page ${index + 1}`}
                                />
                            ))}
                        </div>

                        <div className={style.carouselArrowButtons}>
                            <button
                                type="button"
                                className={`${style.carouselArrowButton} ${currentPage === 0 ? style.carouselArrowButtonDisabled : ""}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                aria-label="Previous promotion page"
                            >
                                <FaAngleLeft size={28} />
                            </button>

                            <button
                                type="button"
                                className={`${style.carouselArrowButton} ${currentPage === totalPages - 1 ? style.carouselArrowButtonDisabled : ""}`}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                                aria-label="Next promotion page"
                            >
                                <FaAngleRight size={28} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
