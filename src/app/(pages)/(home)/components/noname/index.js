"use client"

import { useState } from 'react';
import Image from "next/image";
import Redeem from "./modals/redeem";
import Track from "./modals/track";
import style from "./style.module.css";

export default function Noname() {
    const [isVisible, setIsVisible] = useState({ redeem: false, track: false });

    const toggleVisibility = (type, state) => {
        setIsVisible(prev => ({ ...prev, [type]: state }));
        document.body.style.overflow = 'hidden';
    };

    //Handle preventing Wheel control over the main page after opening Modals.
    

    return (
        <>
            <Redeem isVisible={isVisible.redeem} onClose={() => toggleVisibility('redeem', false)} />
            <Track isVisible={isVisible.track} onClose={() => toggleVisibility('track', false)} />
            <div className='relative lg:h-[600px] h-[500px] md:h-[400px]'>
                <div className={`${style.dark_overlay}`}></div>
                <picture className={`${style.main_banner}`}>
                    <source srcSet="/imgs/imagine-if_720-1060.jpg" media="(max-width: 650px)" />
                    <source srcSet="/imgs/imagine-if_1536-800.jpg" media="(max-width: 1439px)" />
                    <Image src="/imgs/imagine-if_5120-1280.jpg" alt="Banner" className={`${style.lazyloaded}`} fill priority />
                </picture>
                <div className={`${style.content_container} ${style.content_center} ${style.responsive_layout}`}>
                    <div className={`${style.top_layout}`}>
                        <div className={`${style.ft_headline}`}>Welcome to OPPO Promotions</div>
                    </div>
                    <div className={`${style.claim_button}`}>
                        <button className={`${style.btn}`} onClick={() => toggleVisibility('redeem', true)}>Redeem My Gift</button>
                        <button className={`${style.btn}`} onClick={() => toggleVisibility('track', true)}>Track My Claim</button>
                    </div>
                </div>
            </div>
        </>
    )
}