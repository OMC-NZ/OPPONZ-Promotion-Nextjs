"use client"
import Image from "next/image";
import style from "./style.module.css";
import globalStyle from "@app/publicstyle.module.css";
import MobileSteps from "./mobilestep";
import PCSteps from "./pcstep";
import useWindowSize from "@hooks/useWindowSize";

export default function Process() {
    const windowSize = useWindowSize();
    return (
        <div className={style.claim_process}>
            <div className={globalStyle.itemsBlock}>
                <h2 className={style.pro_title}>Gift with Purchase Redemption Process</h2>
                <p className={style.pro_decs}>Follow these simple steps to redeem your gift.</p>
                <div className={style.pcOnly}>
                    <PCSteps />
                </div>
                <div className={style.mobileOnly}>
                    <MobileSteps />
                </div>
            </div>
        </div>
    )
}