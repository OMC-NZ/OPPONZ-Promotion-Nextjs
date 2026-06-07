"use client"

import { useState, useEffect, useRef, React } from "react";
import Image from 'next/image';
import robot from "/public/imgs/robot.png";
import Link from "next/link";
import style from "./footer_main.module.css";
import SupportModal from "./support_modal/index";

export default function FooterContact({ isShow, toggleWidget }) {
    const [isChatVisible, setIsChatVisible] = useState(false);
    const divGetSptRef = useRef(null);
    const divChatPopRef = useRef(null);

    const handleSupportClick = () => {
        setIsChatVisible(!isChatVisible);
    };

    const handleSupportModal = (event) => {
        event.stopPropagation();
    };

    const handleOutsideClick = (event) => {
        if (
            !divGetSptRef.current?.contains(event.target) &&
            !divChatPopRef.current?.contains(event.target)
        ) {
            setIsChatVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <>
            <section className="flex flex-col relative">
                <div className={`${style.contact_bar} ${style.top_line}`}>
                    <div ref={divGetSptRef} className={`${style.contact_us_btn}`} onClick={handleSupportClick}>
                        <div className={`${style.robot_icon}`}>
                            <Image className={`${style.lazyloaded}`} src={robot} width={34} height={34} alt="" />
                        </div>
                        <span className={`${style.contact_text} ${style.ft_body_2_1}`}>
                            Get Support From OPPO New Zealand
                            <span className={`${style.arrow_icon} ${isChatVisible ? style.open : ''}`}></span>
                        </span>

                    </div>
                    {isChatVisible && (
                        <div ref={divChatPopRef} className={`${style.live_chat_pop}`} onClick={handleSupportClick}>
                            <SupportModal isShow={isShow} setIsChatVisible={setIsChatVisible} toggleWidget={toggleWidget} handleSupportModal={handleSupportModal} />
                        </div>
                    )}

                    <div className={`${style.contact_bottom}`}>
                        <ul className={`${style.social_media}`}>
                            <li name="Facebook">
                                <Link href="https://www.facebook.com/OPPONewZealand" target="_blank" className={`${style.media_link}`}>
                                    <Image src="/svg/Facebook.svg" alt="Facebook" width={24} height={24} className={`${style.social_icon}`} />
                                </Link>
                            </li>
                            <li name="Twitter">
                                <Link href="https://twitter.com/OPPONewZealand" target="_blank" className={`${style.media_link}`}>
                                    <Image src="/svg/Twitter.svg" alt="Twitter" width={24} height={24} className={`${style.social_icon}`} />
                                </Link>
                            </li>
                            <li name="Youtube">
                                <Link href="https://www.youtube.com/channel/UC0twtNru9HeQiF1EVf31IQA" target="_blank" className={`${style.media_link}`}>
                                    <Image src="/svg/YouTube.svg" alt="YouTube" width={24} height={24} className={`${style.social_icon}`} />
                                </Link>
                            </li>
                            <li name="Instagram">
                                <Link href="https://instagram.com/opponewzealand" target="_blank" className={`${style.media_link}`}>
                                    <Image src="/svg/Instagram.svg" alt="Instagram" width={24} height={24} className={`${style.social_icon}`} />
                                </Link>
                            </li>
                            <li name="Threads">
                                <Link href="https://www.threads.com/@opponewzealand" target="_blank" className={`${style.media_link}`}>
                                    <Image src="/svg/Threads.svg" alt="Threads" width={24} height={24} className={`${style.social_icon}`} />
                                </Link>
                            </li>
                            <li name="TikTok">
                                <Link href="https://www.tiktok.com/@opponewzealand" target="_blank" className={`${style.media_link}`}>
                                    <Image src="/svg/TikTok.svg" alt="TikTok" width={24} height={24} className={`${style.social_icon}`} />
                                </Link>
                            </li>
                        </ul>
                        <div className={`${style.copyright} ${style.mobile_region}`}>
                            <p>
                                <Link href="https://www.oppo.com/en/choose-site/" className={`${style.languages} ${style.ft_body_3_1}`}>New Zealand (English)</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
