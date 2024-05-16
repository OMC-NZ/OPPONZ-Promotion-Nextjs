"use client"

import React, { useState } from "react";
import Navbar from '@/components/navigation/navbar';
import Sidebar from '@/components/navigation/sidebar';
import Main from "@/components/footer/main/main";
import Bottom from "@/components/footer/bottom/bottom";
import ChatPop from "@/components/chatpop/index";
import style from './layout.module.css';
import { ReCaptchaProvider } from 'react-grecaptcha-v3';

export default function PageLayout({ children }) {
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
        <main className={style.oc_wrapper}>
            <header className="block lg:h-[52px] h-[50px] opacity-100 transition-opacity duration-420 ease-cubic-custom ">
                <Navbar />
                <Sidebar />
            </header>

            <ReCaptchaProvider siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
                {children}
            </ReCaptchaProvider>

            <footer className='block bg-black text-[rgba(255,255,255,0.55)]'>
                <Main isShow={isShow} toggleWidget={toggleWidget} />
                <Bottom />
            </footer>

            <ChatPop toggleWidget={toggleWidget} />
        </main>
    )
}