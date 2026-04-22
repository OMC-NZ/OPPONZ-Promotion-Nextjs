import Image from "next/image";
import style from "./style.module.css";

const steps = [
    {
        id: "01",
        icon: "/imgs/Icons-step1.png",
        title: "Enter IMEI &\nPurchase Date",
        desc: "Click on the “Redeem My Gift” button and enter your IMEI-1 and Purchase Date.",
    },
    {
        id: "02",
        icon: "/imgs/Icons-step2.png",
        title: "Complete\nYour Details",
        desc: "Please complete all required fields accurately and upload the necessary documents.",
    },
    {
        id: "03",
        icon: "/imgs/Icons-step3.png",
        title: "Submit\nYour Claim",
        desc: "Submit your claim and you will receive a confirmation email.",
    },
    {
        id: "04",
        icon: "/imgs/Icons-step4.png",
        title: "Claim Approved &\nGift Dispatched",
        desc: "Once approved, your gift will be processed and dispatched to your registered address.",
    },
];

export default function PCSteps() {
    return (
        <div className={style.pro_content}>
            {steps.map((step, index) => (
                <div className={style.pro_step} key={step.id}>
                    <div className={style.step_head}>
                        <div className={style.step_no}>
                            <Image
                                src={step.icon}
                                alt={step.title.replace(/\n/g, " ")}
                                width={34}
                                height={34}
                            />
                        </div>

                        {index !== steps.length - 1 && (
                            <>
                                <div className={style.step_line} />
                                <div className={style.step_arrow}>
                                    <Image
                                        src="/imgs/angle-right-11-64.png"
                                        alt="Next"
                                        width={45}
                                        height={45}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className={style.feature_box}>
                        <h4 className={style.pro_h4}>{step.title}</h4>
                        <p className={style.pro_words}>{step.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
