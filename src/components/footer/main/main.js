import FooterNav from "./nav";
import FooterContact from "./contact";
import React from "react";
import style from "../footer.module.css";

export default function Main({ toggleWidget }) {
    return (
        <section className={`pt-[48px] flex flex-col relative box-border ${style.footer_main}`}>
            <FooterNav />
            <FooterContact toggleWidget={toggleWidget} />
        </section>
    )
}