"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import style from "../monthly/style.module.css";
import selfStyle from "./style.module.css";
import globalStyle from "@/app/publicstyle.module.css";
import useWindowSize from "@/hooks/useWindowSize";
import usePagination from "@/hooks/usePagination";
import PaginationButtons from "@/app/components/public/pagination/index";

const imgs = [
    { url: '/temporary/events/2ds/events01.jpg' },
    { url: '/temporary/events/2ds/events02.jpg' },
    { url: '/temporary/events/2ds/events03.jpg' },
    { url: '/temporary/events/2ds/events04.jpg' },
]

export default function CurrentEvents() {
    const { width: windowWidth } = useWindowSize();
    const [windowWidthValid, setWindowWidthValid] = useState(false);
    const { imgsPerPage, currentPage, setCurrentPage, totalPages } = usePagination(windowWidth, imgs.length, 'CurrentEvents');

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
    const currentImages = imgs.slice(startIndex, endIndex);

    const showPaginationButtons = (windowWidth <= 1024 && imgs.length > 2) || (windowWidth <= 768 && imgs.length === 2) || imgs.length > 3;

    return (
        <div className={`${globalStyle.itemsBlock}`}>
            <div className={globalStyle.itemsTitle}>
                <p>Current Events</p>
            </div>
            {windowWidthValid ? (
                <>
                    <div className={style.mostthree}>
                        {currentImages.map((step, index) => (
                            <Image
                                key={index}
                                src={step.url}
                                alt={`Promo ${index}`}
                                width={620}
                                height={420}
                                quality={100}
                                className={`${imgsPerPage == 3 ? style.cpimg_th : imgsPerPage == 2 ? style.cpimg_t : style.cpimg_o} ${style.imgBorder}`}
                            />
                        ))}
                    </div>
                    {showPaginationButtons && (
                        <PaginationButtons
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>)
                : null}
        </div>
    )
}