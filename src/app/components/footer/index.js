"use client";

import { useState, useEffect, useRef } from "react";
import Main from "./main/main";
import Bottom from "./bottom/bottom";
import ChatPop from "@app/components/chatpop/index";
import GoBackTop from "@app/components/gobacktop/index";
import chatpopicon from "@public/svg/online-service.svg";
import activeIcon from "@public/svg/Staffservice-oli.svg";
import zenDeskWidgetController from "@lib/zenDeskWidgetController";

export default function Footer() {
    const sourceId = "footer-widget";
    const [isShow, setIsShow] = useState(false);
    const [iconSrc, setIconSrc] = useState(chatpopicon);
    const chatPopRef = useRef(null);

    useEffect(() => {
        const handleBeforeUnload = () => {
            zenDeskWidgetController.close(sourceId);
        };

        const handleStateChange = (open, id) => {
            if (id === sourceId) {
                setIsShow(open);
                setIconSrc(open ? activeIcon : chatpopicon);
            } else {
                setIsShow(false);
                setIconSrc(chatpopicon);
            }
        };

        const handleClickOutside = (event) => {
            if (!isShow) return;

            if (chatPopRef.current && !chatPopRef.current.contains(event.target)) {
                zenDeskWidgetController.close(sourceId);
            }
        };

        // ✅ 监听 Zendesk 自身行为
        const handleZendeskClose = () => {
            zenDeskWidgetController.close(sourceId);
        };

        const handleZendeskOpen = () => {
            zenDeskWidgetController.open(sourceId);
        };

        zenDeskWidgetController.subscribe(handleStateChange);
        window.addEventListener("beforeunload", handleBeforeUnload);
        document.addEventListener("click", handleClickOutside, true);

        // ✅ 注册 Zendesk 事件（无 off）
        if (typeof zE !== "undefined") {
            zE('messenger:on', 'close', handleZendeskClose);
            zE('messenger:on', 'open', handleZendeskOpen);
        }

        return () => {
            zenDeskWidgetController.unsubscribe(handleStateChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.removeEventListener("click", handleClickOutside, true);

            // ❌ 不再尝试移除 Zendesk 事件
        };
    }, [isShow]);

    const toggleWidget = () => {
        zenDeskWidgetController.toggle(sourceId);
    };

    return (
        <>
            <footer className='block bg-black text-[rgba(255,255,255,0.55)]'>
                <Main isShow={isShow} toggleWidget={toggleWidget} />
                <Bottom />
            </footer>

            <div
                ref={chatPopRef}
                className="fixed bottom-5 z-[49] right-[64px] max-[649px]:right-[18px] min-[650px]:max-[1023.98px]:right-[24px] min-[1920px]:right-[64px]"
            >
                <GoBackTop />
                <ChatPop iconSrc={iconSrc} toggleWidget={toggleWidget} />
            </div>
        </>
    );
}
