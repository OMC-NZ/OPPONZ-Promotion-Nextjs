"use client"
import Image from "next/image";
import style from "./style.module.css";
import globalStyle from "@/app/publicstyle.module.css";
import MobileSteps from "./mobilestep";
import PCSteps from "./pcstep";
import useWindowSize from "@/hooks/useWindowSize";

export default function Process() {
    const windowSize = useWindowSize();
    return (
        <div className={style.claim_process}>
            <div className={globalStyle.itemsBlock}>
                <div className={style.pro_title}>Gift with Purchase Redemption Process</div>
                {typeof windowSize.width !== 'number' ? (
                    <p style={{ textAlign: 'center' }}>Loading...</p> 
                ) : windowSize.width < 767.98 ? (
                    <MobileSteps />
                ) : (
                    <PCSteps />
                )}
            </div>
        </div>
    )
}