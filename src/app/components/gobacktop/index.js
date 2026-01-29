"use client"
import { useState, useEffect } from "react";
import style from "./gobacktop.module.css";
import Image from "next/image";
import gobacktopicon from "/public/svg/com-back-top.svg";

export default function GoBackTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 250);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div
            className={`${style.cmp_float_item} ${style.goback_top}`}
            id="goback-top"
            tabIndex={0}
            aria-label="Go Back Top"
            data-index="100"
            onClick={scrollToTop}
            style={{ display: visible ? "flex" : "none" }}
        >
            <Image src={gobacktopicon} alt="Go Back Top" width={24} height={24} />
        </div>
    );
}

