"use client"

import { useState, useEffect } from "react";
import style from "./chatpop.module.css";
import Image from "next/image";

export default function ChatPop({ toggleWidget, iconSrc }) {
    useEffect(() => {
        const widgetLauncher = document.querySelector('.ze-snippet-launcher');
        if (widgetLauncher) {
            widgetLauncher.remove();
        }
    }, []);

    return (
        <div className={`${style.contact_pop}`}>
            <div className={`${style.contact_pop_icon}`} onClick={toggleWidget}>
                <Image src={iconSrc} alt="Chat Pop Icon" />
            </div>
        </div>
    );
}