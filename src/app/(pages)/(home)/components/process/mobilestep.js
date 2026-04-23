"use client";

import React, { useState } from "react";
import Image from "next/image";
import style from "./style.module.css";
import { FaLeftLong, FaRightLong } from "react-icons/fa6";

const steps = [
    {
        icon: "/imgs/Icons-step1.png",
        alt: "step-1",
        title: "Enter IMEI &\nPurchase Date",
        description:
            "Click on the “Redeem My Gift” button and enter your IMEI-1 and Purchase Date.",
    },
    {
        icon: "/imgs/Icons-step2.png",
        alt: "step-2",
        title: "Complete\nYour Details",
        description:
            "Please complete all required fields accurately and upload the necessary documents.",
    },
    {
        icon: "/imgs/Icons-step3.png",
        alt: "step-3",
        title: "Submit\nYour Claim",
        description:
            "Submit your claim and you will receive a confirmation email.",
    },
    {
        icon: "/imgs/Icons-step4.png",
        alt: "step-4",
        title: "Claim Approved &\nGift Dispatched",
        description:
            "Once approved, your gift will be processed and dispatched to your registered address.",
    },
];

export default function MobileSteps() {
    const [currentStep, setCurrentStep] = useState(0);

    const isFirst = currentStep === 0;
    const isLast = currentStep === steps.length - 1;
    const step = steps[currentStep];

    const handlePrev = () => {
        if (!isFirst) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (!isLast) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    return (
        <>
            <div className={style.pro_content}>
                <div className={style.pro_step}>
                    <div className={style.step_head}>
                        <div className={style.step_no}>
                            <Image
                                src={step.icon}
                                alt={step.alt}
                                width={35}
                                height={35}
                            />
                        </div>
                    </div>

                    <div className={style.feature_box}>
                        <h4 className={style.pro_h4}>{step.title}</h4>
                        <p className={style.pro_words}>{step.description}</p>
                    </div>
                </div>
            </div>

            <div className={style.mobileDots}>
                {steps.map((item, index) => (
                    <button
                        key={item.alt}
                        type="button"
                        className={`${style.mobileDot} ${index === currentStep ? style.mobileDotActive : ""
                            }`}
                        onClick={() => setCurrentStep(index)}
                        aria-label={`Go to step ${index + 1}`}
                    />
                ))}
            </div>

            <div className={style.showButtonSl}>
                <button
                    type="button"
                    className={`${style.showButton} ${isFirst ? style.disabled : ""}`}
                    onClick={handlePrev}
                    disabled={isFirst}
                >
                    <FaLeftLong size={28} />
                </button>

                <button
                    type="button"
                    className={`${style.showButton} ${isLast ? style.disabled : ""}`}
                    onClick={handleNext}
                    disabled={isLast}
                >
                    <FaRightLong size={28} />
                </button>
            </div>
        </>
    );
}
