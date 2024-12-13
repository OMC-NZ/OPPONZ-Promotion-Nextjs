"use client"

import { useState, useEffect } from "react";
import style from "./chatpop.module.css";
import Image from "next/image";
import chatpopicon from "/public/imgs/chatpop_icon.png";
import activeIcon from "/public/imgs/active-icon.png";

export default function ChatPop({ toggleWidget }) {
    const [iconSrc, setIconSrc] = useState(chatpopicon);

    useEffect(() => {
        // 在组件加载时，移除或隐藏 Zendesk Web Widget 的 DOM 元素
        const widgetLauncher = document.querySelector('.ze-snippet-launcher');
        if (widgetLauncher) {
            widgetLauncher.remove(); // 或者使用 widgetLauncher.style.display = 'none'; 隐藏元素
        }
    }, []);

    const handleIconClick = () => {
        setIconSrc((prevIconSrc) =>
            prevIconSrc === chatpopicon ? activeIcon : chatpopicon
        );
    };

    const handleClick = () => {
        toggleWidget();
        handleIconClick();
    };

    return (
        <div className={`${style.contact_pop}`}>
            <div className={`${style.contact_pop_icon}`} onClick={handleClick}>
                <Image src={iconSrc} alt="Chat Pop Icon" />
            </div>
            <div className={`${style.chat_pop_box}`}>fghfghfgh</div>
        </div>
    )
}