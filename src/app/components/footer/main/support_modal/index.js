"use client"

import React from "react";
import Image from 'next/image';
import style from "./support.module.css";
import chatIcon from "@/public/svg/Chat.svg";
import phoneIcon from "@/public/svg/Hotline.svg";
import whatsAppIcon from "@/public/svg/WhatsApp.svg";

export default function SupportModal({ isShow, setIsChatVisible, toggleWidget, handleSupportModal }) {
    const closeModal = () => {
        if (!isShow) {
            setIsChatVisible(false);
        }
    }

    return (
        <div className={`${style.live_chat_wrap}`} onClick={handleSupportModal}>
            <ul className={`${style.group_list}`}>
                <li className={`${style.group_item}`}>
                    <div className={`${style.item_box}`}>
                        <Image src={chatIcon} alt="Livechat" className={`${style.chat_icon}`} />
                        <span className={`${style.ft_body_2_1} ${style.live_chat}`} onClick={() => { toggleWidget(); closeModal() }}>Livechat</span>
                    </div>
                    <div className={`${style.sub_list}`}>
                        <p className={`${style.subtitle}`}>9:00-18:00 Mon-Fri</p>
                        <p className={`${style.subtitle}`}>Excluding public holidays</p>
                    </div>
                </li>
                <li className={`${style.group_item}`} style={{ display: "none" }}>
                    <div className={`${style.item_box}`}>
                        <Image src={phoneIcon} alt="Call: 0800450333" className={`${style.chat_icon}`} />
                        <span className={`${style.ft_body_2_1}`}>
                            Hotline &nbsp;
                            <i className={`${style.phone_number}`}>0800450333</i>
                        </span>
                    </div>
                    <div className={`${style.sub_list}`}>
                        <p className={`${style.subtitle}`}>9:00-18:00 Mon-Fri</p>
                        <p className={`${style.subtitle}`}>Excluding public holidays</p>
                    </div>
                </li>
                <li className={`${style.group_item}`}>
                    <div className={`${style.item_box}`}>
                        <a href="https://api.whatsapp.com/message/25XWFRQE7CWHB1?autoload=1&app_absent=0"
                            target="_blank"
                            rel="noopener noreferrer">
                            <Image src={whatsAppIcon} alt="" className={`${style.chat_icon}`} />
                            <span className={`${style.ft_body_2_1}`}>
                                WhatsApp
                            </span>
                        </a>
                    </div>
                    <div className={`${style.sub_list}`}>
                        <p className={`${style.subtitle}`}>9:00-18:00 Mon-Fri</p>
                        <p className={`${style.subtitle}`}>Excluding public holidays</p>
                    </div>
                </li>
            </ul>
        </div>
    )
}