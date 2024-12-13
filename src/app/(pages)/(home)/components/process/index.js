"use client"
import Image from "next/image";
import style from "./style.module.css";
import MobileSteps from "./mobilestep";
import useWindowSize from "@/hooks/useWindowSize";

export default function Process() {
    const windowSize = useWindowSize();

    return (
        <div className={style.claim_process}>
            <div className={style.pro_title}>Gift with Purchase Redemption Process</div>            
            <svg viewBox="0 0 300 100" preserveAspectRatio="none" className={`${style.top_radian}`}>
                <path d="M0,50 Q150,0 300,50 L300,100 L0,100 Z" fill="white" />
            </svg>
            {windowSize.width < 575.98 ? (
                <MobileSteps />
            ) : (
                <div className={style.pro_content}>
                    {[...Array(4)].map((_, index) => (
                        <div className={style.pro_step} key={index}>
                            <div className={style.feature_box}>
                                <div className={style.feature_icon}>
                                    <Image src={`/imgs/Icons-step${index + 1}.png`} alt={`step-${index + 1}`} width={40} height={40} />
                                </div>
                                <p className={style.pro_h4}>STEP {index + 1}</p>
                                <p className={style.pro_words}>
                                    {index === 0 && "Click on the “Redeem My Gift” button and enter your IMEI-1 and Purchase Date"}
                                    {index === 1 && "Fill the required details and upload the IMEI-1 screenshot & the copy of purchase proof"}
                                    {index === 2 && "Submit the claim and then you will receive a confirmation email"}
                                    {index === 3 && "Once the claim has been approved it will be processed and dispatched"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}