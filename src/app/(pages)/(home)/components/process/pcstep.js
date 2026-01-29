import Image from "next/image";
import style from "./style.module.css";

export default function PCSteps() {
    return (
        <div className={style.pro_content}>
            {[...Array(4)].map((_, index) => (
                <div className={style.pro_step} key={index}>
                    <div className={style.feature_box}>
                        <div className={style.feature_icon}>
                            <Image
                                src={`/imgs/Icons-step${index + 1}.png`}
                                alt={`step-${index + 1}`}
                                width={30}
                                height={30}
                            />
                        </div>
                        <p className={style.pro_h4}>STEP {index + 1}</p>
                        <p className={style.pro_words}>
                            {index === 0 &&
                                "Click on the “Redeem My Gift” button and enter your IMEI-1 and Purchase Date"}
                            {index === 1 &&
                                "Please complete all required fields accurately and upload the necessary details as instructed"}
                            {index === 2 &&
                                "Submit the claim and then you will receive a confirmation email"}
                            {index === 3 &&
                                "Once the claim has been approved it will be processed and dispatched"}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
