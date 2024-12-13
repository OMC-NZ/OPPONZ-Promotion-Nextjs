"use client"

import React from "react";
import Link from "next/link";
import style from "./bottom.module.css";
import { IoIosArrowUp } from "react-icons/io";

export default function Bottom() {
    const currentYear = new Date().toLocaleString('en-NZ', { year: 'numeric', timeZone: 'Pacific/Auckland' });

    const handleBackToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth'});
    };

    return (
        <section className={`${style.bottom}`}>
            <ul className={`${style.links} ${style.ft_body_3}`}>
                <li>
                    <Link href="https://www.oppo.com/nz/privacy/" target="_blank">Privacy</Link>
                </li>
                <li>
                    <Link href="https://www.oppo.com/nz/terms/" target="_blank">Terms of Use</Link>
                </li>                
                <li>
                    <Link href="/terms" target="_blank">Terms and Conditions of Promotions</Link>
                </li>
                <li>
                    <Link href="https://www.oppo.com/nz/cookies/" target="_blank">Cookies</Link>
                </li>
                <li>
                    <Link href="https://www.oppo.com/en/legal/" target="_blank">Legal & Compliance</Link>
                </li>
                <li>
                    Copyright © 2004-{currentYear} OPPO. All rights reserved.
                </li>
            </ul>
            <Link href="/" className={`${style.back_top_btn} ${style.ft_body_3_1}`} onClick={handleBackToTop}>
                Back to Top
                <IoIosArrowUp className={`${style.arrow_icon}`} />
            </Link>
        </section>
    )
}