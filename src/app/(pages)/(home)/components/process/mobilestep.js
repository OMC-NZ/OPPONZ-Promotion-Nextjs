"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import style from "./style.module.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const steps = [
    {
        icon: "/imgs/Icons-step1.png",
        alt: "step-1",
        title: "Enter IMEI &\nPurchase Date",
        description:
            "Click on the \"Redeem My Gift\" button and enter your IMEI-1 and Purchase Date.",
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
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });

    const isFirst = currentStep === 0;
    const isLast = currentStep === steps.length - 1;

    const handleStepChange = (stepIndex) => {
        if (stepIndex >= 0 && stepIndex < steps.length) {
            setCurrentStep(stepIndex);
        }
    };

    const handlePrev = () => {
        handleStepChange(currentStep - 1);
    };

    const handleNext = () => {
        handleStepChange(currentStep + 1);
    };

    const handleDragStart = (event) => {
        dragStartRef.current = { x: event.clientX, y: event.clientY };
        setIsDragging(true);
        setDragOffset(0);
    };

    const handleDragMove = (event) => {
        if (!isDragging) return;

        const deltaX = event.clientX - dragStartRef.current.x;
        const deltaY = event.clientY - dragStartRef.current.y;

        if (Math.abs(deltaX) < Math.abs(deltaY)) return;

        const isPullingPastStart = isFirst && deltaX > 0;
        const isPullingPastEnd = isLast && deltaX < 0;

        setDragOffset(isPullingPastStart || isPullingPastEnd ? deltaX * 0.28 : deltaX);
    };

    const finishDrag = (event) => {
        if (!isDragging) return;

        const deltaX = event.clientX - dragStartRef.current.x;
        const deltaY = event.clientY - dragStartRef.current.y;
        const isHorizontalSwipe = Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY);

        setIsDragging(false);
        setDragOffset(0);

        if (!isHorizontalSwipe) return;

        if (deltaX < 0) {
            handleNext();
        } else {
            handlePrev();
        }
    };

    const cancelDrag = (event) => {
        if (!isDragging) return;

        setIsDragging(false);
        setDragOffset(0);
    };

    return (
        <>
            <div
                className={style.mobileStepViewport}
                onPointerDown={handleDragStart}
                onPointerMove={handleDragMove}
                onPointerUp={finishDrag}
                onPointerCancel={cancelDrag}
                onPointerLeave={(event) => {
                    if (event.pointerType === "mouse") {
                        cancelDrag(event);
                    }
                }}
            >
                <div
                    className={`${style.mobileStepTrack} ${isDragging ? style.mobileStepTrackDragging : ""}`}
                    style={{
                        transform: `translateX(calc(-${currentStep * 100}% + ${dragOffset}px))`,
                    }}
                >
                    {steps.map((step) => (
                        <div className={style.mobileStepPage} key={step.alt}>
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
                        </div>
                    ))}
                </div>
            </div>

            <div className={style.mobileDots}>
                {steps.map((item, index) => (
                    <button
                        key={item.alt}
                        type="button"
                        className={`${style.mobileDot} ${index === currentStep ? style.mobileDotActive : ""
                            }`}
                        onClick={() => handleStepChange(index)}
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
                    <FaAngleLeft size={28} />
                </button>

                <button
                    type="button"
                    className={`${style.showButton} ${isLast ? style.disabled : ""}`}
                    onClick={handleNext}
                    disabled={isLast}
                >
                    <FaAngleRight size={28} />
                </button>
            </div>
        </>
    );
}
