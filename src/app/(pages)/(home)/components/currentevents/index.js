"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import eventStyle from "./style.module.css";
import globalStyle from "@app/publicstyle.module.css";
import useWindowSize from "@hooks/useWindowSize";
import usePagination from "@hooks/usePagination";
import usePromotionContent from "@hooks/usePromotionContent";

export default function CurrentEvents() {
    const router = useRouter();
    const { width: windowWidth } = useWindowSize();
    const { currentEvents } = usePromotionContent();
    const currentEventItems = currentEvents.items;
    const isCurrentEventsLoading = currentEvents.loading;
    const [windowWidthValid, setWindowWidthValid] = useState(false);
    const [loadedImages, setLoadedImages] = useState({});
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [navigatingEventId, setNavigatingEventId] = useState(null);
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
        if (navigatingEventId) return;
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDragStart = (event) => {
        if (navigatingEventId) return;
        if (totalPages <= 1) return;

        dragStartRef.current = { x: event.clientX, y: event.clientY };
        setIsDragging(true);
        setDragOffset(0);
        didSwipeRef.current = false;
    };

    const handleDragMove = (event) => {
        if (navigatingEventId) return;
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
        if (navigatingEventId) return;
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
        if (navigatingEventId) return;
        if (!isDragging) return;

        setIsDragging(false);
        setDragOffset(0);
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

    const navigateToEvent = (eventId, eventHref) => {
        if (navigatingEventId || didSwipeRef.current) return;
        setNavigatingEventId(eventId);
        router.push(eventHref);
    };

    const shouldShow =
        windowWidthValid && !isCurrentEventsLoading && currentEventItems.length > 0;

    if (!shouldShow) return null;

    return (
        <div className={globalStyle.itemsBlock}>
            <div className={globalStyle.itemsTitle}>
                <p>Current Events</p>
            </div>

            <div
                className={eventStyle.carouselViewport}
                onPointerDown={handleDragStart}
                onPointerMove={handleDragMove}
                onPointerUp={finishDrag}
                onPointerCancel={cancelDrag}
                onPointerLeave={cancelDrag}
            >
                <div
                    className={`${eventStyle.carouselTrack} ${isDragging ? eventStyle.carouselTrackDragging : ""}`}
                    style={{
                        transform: `translateX(calc(-${currentPage * 100}% + ${dragOffset}px))`,
                    }}
                >
                    {eventPages.map((pageEvents, pageIndex) => (
                        <div className={eventStyle.carouselPage} key={pageIndex}>
                            <div className={eventStyle.mostthree}>
                                {pageEvents.map((event, index) => {
                                    const eventId = event.id;
                                    const eventHref = event.claimUrl;
                                    const isCurrentEventLoading = navigatingEventId === eventId;
                                    const isEventNavigationLocked = Boolean(navigatingEventId);

                                    return (
                                        <div
                                            key={eventId}
                                            className={`${eventStyle.promoCard} ${eventStyle.eventCard} ${isEventNavigationLocked ? eventStyle.eventCardNavigating : ""} ${isCurrentEventLoading ? eventStyle.eventCardLoading : ""} ${isEventNavigationLocked && !isCurrentEventLoading ? eventStyle.eventCardDisabled : ""} ${imgsPerPage === 3
                                                ? eventStyle.cpimg_th
                                                : imgsPerPage === 2
                                                    ? eventStyle.cpimg_t
                                                    : eventStyle.cpimg_o
                                                } ${eventStyle.imgBorder} ${eventStyle.imgSize}`}
                                            role="link"
                                            tabIndex={0}
                                            onClick={() => {
                                                navigateToEvent(eventId, eventHref);
                                            }}
                                            onKeyDown={(e) => {
                                                if (navigatingEventId) return;
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    navigateToEvent(eventId, eventHref);
                                                }
                                            }}
                                        >
                                            {!loadedImages[eventId] && (
                                                <div className={eventStyle.imageLoading}>
                                                    <span className={eventStyle.loadingSpinner} />
                                                </div>
                                            )}

                                            <Image
                                                src={event.imageUrl}
                                                alt={event.title || `Current Event ${index + 1}`}
                                                width={620}
                                                height={420}
                                                quality={100}
                                                unoptimized
                                                className={`${eventStyle.promoImage} ${loadedImages[eventId] ? eventStyle.imageLoaded : eventStyle.imagePending}`}
                                                onLoad={() => handleImageLoad(eventId)}
                                                onError={() => handleImageLoad(eventId)}
                                                priority
                                            />

                                            <div className={eventStyle.eventOverlay}>
                                                <Link
                                                    href={eventHref}
                                                    className={`${eventStyle.eventClaimButton} ${isCurrentEventLoading ? eventStyle.eventClaimButtonLoading : ""}`}
                                                    aria-disabled={isEventNavigationLocked}
                                                    tabIndex={isEventNavigationLocked && !isCurrentEventLoading ? -1 : 0}
                                                    onPointerDown={(e) => e.stopPropagation()}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        navigateToEvent(eventId, eventHref);
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
                                                        {isCurrentEventLoading && <span className={eventStyle.buttonSpinner} />}
                                                        <span>{isCurrentEventLoading ? "Loading" : "Claim Now"}</span>
                                                        {!isCurrentEventLoading && <FaAngleRight style={{ display: "unset" }} />}
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
                    <div className={eventStyle.carouselDots}>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`${eventStyle.carouselDot} ${index === currentPage ? eventStyle.carouselDotActive : ""}`}
                                disabled={Boolean(navigatingEventId)}
                                onClick={() => handlePageChange(index)}
                                aria-label={`Go to event page ${index + 1}`}
                            />
                        ))}
                    </div>

                    <div className={eventStyle.carouselArrowButtons}>
                        <button
                            type="button"
                            className={`${eventStyle.carouselArrowButton} ${currentPage === 0 ? eventStyle.carouselArrowButtonDisabled : ""}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            aria-label="Previous event page"
                        >
                            <FaAngleLeft size={28} />
                        </button>

                        <button
                            type="button"
                            className={`${eventStyle.carouselArrowButton} ${currentPage === totalPages - 1 ? eventStyle.carouselArrowButtonDisabled : ""}`}
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
