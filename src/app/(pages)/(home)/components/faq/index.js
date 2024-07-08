"use client"
import { useState, useRef } from "react";
import style from "./style.module.css";
import globalStyle from "@/app/publicstyle.module.css";
import { FaArrowRightLong } from "react-icons/fa6";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);
    const contentRefs = useRef([]);

    const handleClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "When is the promotional period?",
            answer: "Promotional periods may vary depending on the eligible product and participating retailers. Please refer to individual T&Cs page for more information."
        },
        {
            question: "When can I redeem?",
            answer: "Redemption periods may vary depending on the eligible product and participating retailers. Please refer to individual T&Cs page for more information."
        },
        {
            question: "What do I need to redeem?",
            answer: "Please submit the following through the individual eligible OPPO product promotion claim page: your personal details and address for us to send you your gift with purchase, an uploaded scan or photocopy of your proof of purchase and a screenshot of the IMEI page on your eligible OPPO product."
        },
        {
            question: "What is an IMEI-1 number and where can I find it?",
            answer: "The IMEI (International Mobile Equipment Identity) number is a unique set of 15 digits used on GSM phones to identify each device. Your IMEI-1 number can be commonly found on the packaging box of your OPPO device, beneath the product name and above the barcode."
        },
        {
            question: "How long will it take for me to receive my gift with purchase?",
            answer: "You should allow up to twenty (20) workdays for the delivery of your gift from the date you receive notification from OPPO that it has received your valid claim form with proof of purchase and IMEI number and your claim has been accepted."
        },
        {
            question: "How do I track my gift?",
            answer: "You will receive an email notification from OPPO that it has received your valid claim form with proof of purchase and IMEI number and your claim has been accepted. A tracking number will be provided in this notification and you will be able to use Track My Claim page in oppopromotions.co.nz for delivery status updates on your gift."
        }
    ];

    return (
        <div className={`${globalStyle.itemsBlock} ${style.faqlayout}`}>
            <div className={`${globalStyle.itemsTitle} ${style.faqtitle}`}>
                <p>Frequently Asked Questions</p>
            </div>
            <div className={style.faqcontent}>
                <ul>
                    {faqs.map((faq, index) => (
                        <li key={index} className={style.faq_listitem}>
                            <div className="flex items-center justify-between mr-[1rem] cursor-pointer" onClick={() => handleClick(index)}>
                                <h2>{faq.question}</h2>
                                <FaArrowRightLong className={`${style.faqicon} ${openIndex === index ? style.faqrotate : ''}`} />
                            </div>
                            <div ref={el => contentRefs.current[index] = el} className={`${style.answer} ${openIndex === index ? style.show : ''}`} style={{ maxHeight: openIndex === index ? `${contentRefs.current[index].scrollHeight}px` : '0' }}>
                                <p>{faq.answer}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}