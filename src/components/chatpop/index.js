"use client"

import { React, useState, useEffect } from "react";
import style from "./chatpop.module.css";
import Image from "next/image";
import chatpopicon from "../../../public/imgs/chatpop_icon.png";

export default function ChatPop() {
    const [isShow, setIsShow] = useState(false);
    const toggleWidget = () => {
        setIsShow(!isShow);
        if (isShow) {
            zE('messenger', 'close');
        } else {
            zE('messenger', 'open');
        }
    };

    useEffect(() => {
        // 在组件加载时，移除或隐藏 Zendesk Web Widget 的 DOM 元素
        const widgetLauncher = document.querySelector('.ze-snippet-launcher');
        if (widgetLauncher) {
            widgetLauncher.remove(); // 或者使用 widgetLauncher.style.display = 'none'; 隐藏元素
        }
    }, []);

    return (
        <div className={`${style.contact_pop}`}>
            <div className={`${style.contact_pop_icon}`} onClick={toggleWidget}>
                <Image src={chatpopicon} alt="Chat Pop Icon" />
            </div>
            <div className={`${style.chat_pop_box}`}>fghfghfgh</div>
        </div>
    )
}