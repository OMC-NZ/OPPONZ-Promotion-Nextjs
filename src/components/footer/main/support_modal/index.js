import React, { useState } from "react";
import Image from 'next/image';
import style from "./support.module.css";
import chatIcon from "../../../../../public/svg/Chat.svg";
import phoneIcon from "../../../../../public/svg/Hotline.svg";

// eslint-disable-next-line react/display-name
export default function SupportModal({ handleSupportModal }) {
    const [isShow, setIsShow] = useState(false);
    const toggleWidget = () => {
        setIsShow(!isShow);
        if (isShow) {
            zE('messenger', 'close');
        } else {
            zE('messenger', 'open');
        }
    };

    return (
        <div className={`${style.live_chat_wrap}`} onClick={handleSupportModal}>
            <ul className={`${style.group_list}`}>
                <li className={`${style.group_item}`}>
                    <div className={`${style.item_box}`}>
                        <Image src={chatIcon} alt="Livechat" className={`${style.chat_icon}`} />
                        <span className={`${style.ft_body_2_1}`}>
                            <button onClick={toggleWidget}>Livechat</button>
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