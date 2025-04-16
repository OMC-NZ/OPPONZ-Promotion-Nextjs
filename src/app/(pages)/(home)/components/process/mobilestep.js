import React, { useState } from 'react';
import Image from "next/image";
import style from "./style.module.css"
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

export default function MobileSteps() {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = 4; // Assuming there are 4 steps

    const steps = [
        {
            icon: "/imgs/Icons-step1.png",
            alt: "step-1",
            title: "Step 1",
            description: "Click on the “Redeem My Gift” button and enter your IMEI-1 and Purchase Date"
        },
        {
            icon: "/imgs/Icons-step2.png",
            alt: "step-2",
            title: "Step 2",
            description: "Fill and upload the required details"
        },
        {
            icon: "/imgs/Icons-step3.png",
            alt: "step-3",
            title: "Step 3",
            description: "Submit the claim and then you will receive a confirmation email"
        },
        {
            icon: "/imgs/Icons-step4.png",
            alt: "step-4",
            title: "Step 4",
            description: "Once the claim has been approved it will be processed and dispatched"
        }
    ];

    const handleButtonClick = (direction) => {
        if (direction === 'previous') {
            setCurrentStep(prevStep => Math.max(prevStep - 1, 0));
        } else if (direction === 'next') {
            setCurrentStep(prevStep => Math.min(prevStep + 1, totalSteps - 1));
        }
    };

    return (
        <>
            <div className={style.pro_content}>
                {steps.map((step, index) => (
                    index === currentStep && (
                        <div className={style.pro_step} key={index}>
                            <div className={style.feature_box}>
                                <div className={style.feature_icon}>
                                    <Image src={step.icon} alt={step.alt} width={20} height={20} />
                                </div>
                                <p className={style.pro_h4}>{step.title}</p>
                                <p className={style.pro_words}>{step.description}</p>
                            </div>
                        </div>
                    )
                ))}
            </div>
            <div className={style.showButtonSl}>
                <div className={`${style.showButton} ${currentStep === 0 ? style.disabled : ''}`} onClick={() => handleButtonClick('previous')}>
                    <FaArrowLeftLong />
                    <p>Previous</p>
                </div>
                <div className={`${style.showButton} ${currentStep === 3 ? style.disabled : ''}`} onClick={() => handleButtonClick('next')}>
                    <p>Next</p>
                    <FaArrowRightLong />
                </div>
            </div>
        </>
    )
}