import React from "react";
import Image from 'next/image';
import Link from "next/link";
import style from "./support.module.css";
import chatIcon from "../../../../../public/svg/Chat.svg";
import phoneIcon from "../../../../../public/svg/Hotline.svg";

// eslint-disable-next-line react/display-name
export default function SupportModal({handleSupportModal}) {
    return (
        <div className={`${style.live_chat_wrap}`} onClick={handleSupportModal}>
            <ul className={`${style.group_list}`}>
                <li className={`${style.group_item}`}>
                    <div className={`${style.item_box}`}>
                        <Image src={chatIcon} alt="Livechat" className={`${style.chat_icon}`} />
                        <span className={`${style.ft_body_2_1}`}>
                            <Link href="https://chat-sg.oppo.com/chat/h5/v2/index.html?sysnum=73caa836de224c89b03afe215fbe801b&channelid=2" target="_blank">Livechat</Link>
                        </span>
                    </div>
                    <div className={`${style.sub_list}`}>
                        <p className={`${style.subtitle}`}>9:00-17:00 Mon-Fri</p>
                        <p className={`${style.subtitle}`}>Excluding public holidays</p>
                    </div>
                </li>
                <li className={`${style.group_item}`}>
                    <div className={`${style.item_box}`}>
                        <Image src={phoneIcon} alt="Call: 0800450333" className={`${style.chat_icon}`} />
                        <span className={`${style.ft_body_2_1}`}>
                            Hotline &nbsp;
                            <i className={`${style.phone_number}`}>0800450333</i>
                        </span>
                    </div>
                    <div className={`${style.sub_list}`}>
                        <p className={`${style.subtitle}`}>9:00-17:00 Mon-Fri</p>
                        <p className={`${style.subtitle}`}>Excluding public holidays</p>
                    </div>
                </li>
            </ul>
        </div>
    )
}