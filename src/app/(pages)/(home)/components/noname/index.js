"use client"

import { useEffect, useState } from 'react';
import Image from "next/image";
import Redeem from "../../../../components/modals/redeem";
import Track from "../../../../components/modals/track";
import style from "./style.module.css";

export default function Noname() {
    const [isVisible, setIsVisible] = useState({ redeem: false, track: false });
    const [isPageReady, setIsPageReady] = useState(false);

    useEffect(() => {
        if (document.readyState === "complete") {
            setIsPageReady(true);
            return;
        }

        const handleLoad = () => setIsPageReady(true);
        window.addEventListener("load", handleLoad, { once: true });

        return () => window.removeEventListener("load", handleLoad);
    }, []);

    const toggleVisibility = (type, state) => {
        if (!isPageReady) return;
        setIsVisible(prev => ({ ...prev, [type]: state }));
        document.body.style.overflowY = state ? 'hidden' : '';
    };

    //Handle preventing Wheel control over the main page after opening Modals.
    

    return (
        <>
            <Redeem
                isVisible={isVisible.redeem}
                onClose={() => toggleVisibility('redeem', false)}
                onOpenTrack={() => toggleVisibility('track', true)}
            />
            <Track isVisible={isVisible.track} onClose={() => toggleVisibility('track', false)} />
            <div className='relative xl:h-[500px] md:h-[400px] h-[500px]'>
                <div className={`${style.dark_overlay}`}></div>
                <picture className={`${style.main_banner}`}>
                    <source srcSet="/imgs/imagine-if_720-1060.jpg" media="(max-width: 650px)" />
                    <source srcSet="/imgs/imagine-if_1536-800.jpg" media="(max-width: 1439px)" />
                    <Image src="/imgs/imagine-if_5120-1280.jpg" alt="Banner" className={`${style.lazyloaded}`} fill priority />
                </picture>
                <div className={`${style.content_container} ${style.content_center} ${style.responsive_layout}`}>
                    <div className={`${style.top_layout}`}>
                        <div className={`${style.ft_headline}`}>Welcome to<br/>OPPO Promotions</div>
                    </div>
                    <div className={`${style.claim_button}`}>
                        <button className={`${style.btn}`} onClick={() => toggleVisibility('redeem', true)} disabled={!isPageReady}>
                            {!isPageReady && <span className={style.buttonSpinner} />}
                            {isPageReady ? 'Redeem My Gift' : 'Loading'}
                        </button>
                        <button className={`${style.btn}`} onClick={() => toggleVisibility('track', true)} disabled={!isPageReady}>
                            {!isPageReady && <span className={style.buttonSpinner} />}
                            {isPageReady ? 'Track My Claim' : 'Loading'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
