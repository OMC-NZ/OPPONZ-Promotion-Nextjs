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
                  <Link href="/" className={`${style.ft_body_2_1}`}>Monthly Promotions</Link>
                </li>
                <li className="min-w-[169px] mb-[40px]">
                  <Link href="/" className={`${style.ft_body_2_1}`}>Current Events</Link>
                </li>
                <li className="min-w-[169px] mb-[40px]">
                  <Link href="/" className={`${style.ft_body_2_1}`}>FAQ</Link>
                </li>
                <li className="min-w-[169px] mb-[40px]">
                  <Link href="https://shop.oppomobile.nz/" target="_blank" className={`${style.ft_body_2_1}`}>Shop Now</Link>
                </li>
            </ul>
        </nav>
    );
}