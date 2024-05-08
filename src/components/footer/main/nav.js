import React from "react";
import Link from "next/link";
import style from "./footer_main.module.css";

export default function FooterNav() {
    return(
        <nav className={`${style.ft_body_3_1} ${style.bottom_line}`}>
            <ul className={`flex flex-wrap justify-between ${style.footer_nav_ul}`}>
                <li className="min-w-[169px] mb-[40px]">
                  <Link href="/" className={`${style.ft_body_2_1}`}>Home</Link>
                </li>
                <li className="min-w-[169px] mb-[40px]">
                  <Link href="/" className={`${style.ft_body_2_1}`}>Current Promotions</Link>
                </li>
                <li className="min-w-[169px] mb-[40px]">
                  <Link href="/" className={`${style.ft_body_2_1}`}>FAQ</Link>
                </li>
                <li className="min-w-[169px] mb-[40px]">
                  <Link href="/" className={`${style.ft_body_2_1}`}>Terms & Conditions</Link>
                </li>
                <li className="min-w-[169px] mb-[40px]">
                  <Link href="https://www.oppocare.co.nz/oppocare" target="_blank" className={`${style.ft_body_2_1}`}>OPPO Care</Link>
                </li>
            </ul>
        </nav>
    );
}