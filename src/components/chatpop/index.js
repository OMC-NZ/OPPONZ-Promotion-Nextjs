"use client"

import { React } from "react";
import style from "./chatpop.module.css";
import Image from "next/image";
import chatpopicon from "../../../public/imgs/chatpop_icon.png";

export default function ChatPop() {
    return (
        <div className={`${style.contact_pop}`}>
            <div className={`${style.contact_pop_icon}`}>
                <Image src={chatpopicon} alt="Chat Pop Icon" />
            </div>
            <div className={`${style.chat_pop_box}`}>fghfghfgh</div>
        </div>
    )
}