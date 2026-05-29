"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import style from "../monthly/style.module.css";
import globalStyle from "@app/publicstyle.module.css";
import useWindowSize from "@hooks/useWindowSize";
import usePagination from "@hooks/usePagination";
import usePromotionContent from "@hooks/usePromotionContent";

export default function CurrentEvents() {
    const { width: windowWidth } = useWindowSize();
    const { currentEvents } = usePromotionContent();
    const currentEventItems = currentEvents.items;
    const isCurrentEventsLoading = currentEvents.loading;
    const [windowWidthValid, setWindowWidthValid] = useState(false);
    const [loadedImages, setLoadedImages] = useState({});
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const didSwipeRef = useRef(false);

    const { imgsPerPage, currentPage, setCurrentPage, totalPages } =
        usePagination(windowWidth, currentEventItems.length, "CurrentEvents");

    useEffect(() => {
        if (!Number.isNaN(windowWidth) && windowWidth > 0) {
            setWindowWidthValid(true);
        }
    }, [windowWidth]);

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

    const handleImageLoad = (eventId) => {
        setLoadedImages((prev) => ({ ...prev, [eventId]: true }));
    };

    const eventPages = Array.from({ length: totalPages }, (_, pageIndex) => {
        const startIndex = pageIndex * imgsPerPage;
        const endIndex = startIndex + imgsPerPage;
        return currentEventItems.slice(startIndex, endIndex);
    });

    const showPaginationDots = totalPages > 1;

    const shouldShow =
        windowWidthValid && !isCurrentEventsLoading && currentEventItems.length > 0;

    if (!shouldShow) return null;

    return (
        <div className={globalStyle.itemsBlock}>
            <div className={globalStyle.itemsTitle}>
                <p>Current Events</p>
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
                    {eventPages.map((pageEvents, pageIndex) => (
                        <div className={style.carouselPage} key={pageIndex}>
                            <div className={style.mostthree}>
                                {pageEvents.map((event, index) => {
                                    const eventId = event.id || `${pageIndex}-${index}-${event.url}`;

                                    return (
                                        <div
                                            key={eventId}
                                            className={`${style.promoCard} ${imgsPerPage === 3
                                                ? style.cpimg_th
                                                : imgsPerPage === 2
                                                    ? style.cpimg_t
                                                    : style.cpimg_o
                                                } ${style.imgBorder} ${style.imgSize}`}
                                        >
                                            {!loadedImages[eventId] && (
                                                <div className={style.imageLoading}>
                                                    <span className={style.loadingSpinner} />
                                                </div>
                                            )}

                                            <Image
                                                src={event.url}
                                                alt={event.title || `Current Event ${index + 1}`}
                                                width={620}
                                                height={420}
                                                quality={100}
                                                className={`${style.promoImage} ${loadedImages[eventId] ? style.imageLoaded : style.imagePending}`}
                                                onLoad={() => handleImageLoad(eventId)}
                                                onError={() => handleImageLoad(eventId)}
                                                priority
                                            />

                                            <div className={style.promoOverlay}>
                                                <Link
                                                    href={event.href || event.link || "/events/uefa"}
                                                    className={`${style.overlayBtn} ${style.currentEventOverlayBtn}`}
                                                    onClick={(e) => {
                                                        if (didSwipeRef.current) {
                                                            e.preventDefault();
                                                        }
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
                                                        <span>Claim Now</span>
                                                        <FaAngleRight style={{ display: "unset" }} />
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showPaginationDots && (
                <>
                    <div className={style.carouselDots}>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`${style.carouselDot} ${index === currentPage ? style.carouselDotActive : ""}`}
                                onClick={() => handlePageChange(index)}
                                aria-label={`Go to event page ${index + 1}`}
                            />
                        ))}
                    </div>

                    <div className={style.carouselArrowButtons}>
                        <button
                            type="button"
                            className={`${style.carouselArrowButton} ${currentPage === 0 ? style.carouselArrowButtonDisabled : ""}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            aria-label="Previous event page"
                        >
                            <FaAngleLeft size={28} />
                        </button>

                        <button
                            type="button"
                            className={`${style.carouselArrowButton} ${currentPage === totalPages - 1 ? style.carouselArrowButtonDisabled : ""}`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            aria-label="Next event page"
                        >
                            <FaAngleRight size={28} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
