"use client"

import { useState, useEffect } from "react";
import Main from "./main/main";
import Bottom from "./bottom/bottom";
import ChatPop from "@/app/components/chatpop/index";

export default function Footer() {
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
        const handleBeforeUnload = () => {
            zE('messenger', 'close');
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <>
            <footer className='block bg-black text-[rgba(255,255,255,0.55)]'>
                <Main isShow={isShow} toggleWidget={toggleWidget} />
                <Bottom />
            </footer>

            <ChatPop toggleWidget={toggleWidget} />
        </>
    )
}