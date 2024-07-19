"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import style from "./style.module.css";
import DetailsModal from "./modal/index";
import useWindowSize from "@/hooks/useWindowSize";
import { LuAsterisk } from "react-icons/lu";
import { GiCrossMark } from "react-icons/gi";

const imgs = {
    alt: 'temp banner',
    url: {
        tablet: '/temporary/claimBanners/1b88a02090abbdb2b6af7cd64088157.jpg',
        mobile: '/temporary/img/promo09.jpg'
    }
}

const items = {
    imei: 868973072125098,
    purchase_date: '2024-07-16'
}

export default function Claim() {
    {/* <div className={style.}> */ }
    const [modalShow, setModalShow] = useState(false);
    const [bannerURL, setBannerURL] = useState(imgs.url.tablet);
    const { width: windowWidth } = useWindowSize();
    const [isChecked, setIsChecked] = useState(true);

    useEffect(() => {
        if (windowWidth < 576) {
            setBannerURL(imgs.url.mobile);
        } else {
            setBannerURL(imgs.url.tablet);
        }
    }, [windowWidth]);

    const handleModalOpen = () => {
        setModalShow(true);
        document.body.style.overflow = 'hidden';
    }



    return (
        <>
            <title>Claim | OPPO NZ Promotions</title>
            <div className={style.claim_main}>
                <div className={style.claim_banner}>
                    <Image src={bannerURL} alt={imgs.alt} width={1920} height={480} quality={50} priority={true} className={style.banner} />
                </div>
                <div className={style.claim_content}>
                    <div className={style.claim_title}>
                        <p className={style.title}>Claim Your Gift</p>
                        <span>Please note that fields marked with <span style={{ color: '#BB0929', verticalAlign: 'middle' }}>*</span> are mandatory.</span>
                        <span style={{ fontSize: '14px' }}>To learn more <button className={style.specWords} onClick={handleModalOpen}>Details</button> and <Link className={style.specWords} href="/terms" target="_blank">Terms</Link>.</span>
                    </div>
                    <form>
                        <div className={style.device_info}>
                            <div className={style.device_width}>
                                <div className={style.device_cell}>
                                    <p>IMEI-1:</p>
                                    <p id="imei" className={style.device_data}>{items.imei}</p>
                                </div>
                                <div className={style.device_cell}>
                                    <p>Purchase Date:</p>
                                    <p id="purchase_date" className={style.device_data}>{items.purchase_date}</p>
                                </div>
                            </div>
                        </div>
                        <div className={style.claim_form}>
                            <div className={style.form_container}>
                                <div className={style.modal_card}>
                                    <div className={style.card_cell}>
                                        <label className={style.card_label}>Screenshot of IMEI-1<LuAsterisk className={style.card_icon} /></label>
                                        <div className={style.card_file}>
                                            <input type="file" id="screenshot" accept=".jpeg,.jpg,.png,.pdf" required />
                                            <p>Required</p>
                                        </div>
                                    </div>
                                    <div className={style.card_cell}>
                                        <label className={style.card_label}>Proof of Purchase<LuAsterisk className={style.card_icon} /></label>
                                        <div className={style.card_file}>
                                            <input type="file" id="receipt" accept=".jpeg,.jpg,.png,.pdf" required />
                                            <p>Required</p>
                                        </div>
                                    </div>
                                    <div className={style.card_cell}>
                                        <label className={style.card_label}>Order Number</label>
                                        <input className={style.card_unrequired} type="type" id="receipt" />
                                    </div>
                                </div>
                                <div className={style.modal_card}>
                                    <div className={style.card_cell}>
                                        <label className={style.card_label}>First Name<LuAsterisk className={style.card_icon} /></label>
                                        <div className={style.card_fill}>
                                            <div className={style.card_input}>
                                                <input type="type" id="first_name" required />
                                                <p style={{ color: 'red' }}><GiCrossMark /></p>
                                            </div>
                                            <p style={{ color: 'red' }}>Required</p>
                                        </div>
                                    </div>
                                    <div className={style.card_cell}>
                                        <label className={style.card_label}>Last Name<LuAsterisk className={style.card_icon} /></label>
                                        <div className={style.card_fill}>
                                            <input type="type" id="last_name" required />
                                            <p>Required</p>
                                        </div>
                                    </div>
                                    <div className={style.card_cell}>
                                        <label className={style.card_label}>Email<LuAsterisk className={style.card_icon} /></label>
                                        <div className={style.card_fill}>
                                            <input type="type" id="contact" required />
                                            <p>Required</p>
                                        </div>
                                    </div>
                                    <div className={style.card_cell}>
                                        <label className={style.card_label}>Contact Number<LuAsterisk className={style.card_icon} /></label>
                                        <div className={style.card_fill}>
                                            <input type="type" id="first_name" required />
                                            <p>Required</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.modal_card}>
                                    <div className={style.card_cell}>
                                        <label className={style.card_label}>Street<LuAsterisk className={style.card_icon} /></label>
                                        <div className={style.card_fill}>
                                            <input type="type" id="street" placeholder="Type and select your address" required />
                                            <p>Required</p>
                                        </div>
                                    </div>
                                    <div className={style.card_cell}>
                                        <label className={style.card_label}>Company(Optional)</label>
                                        <input className={style.card_unrequired} type="type" id="instructions" placeholder="If your address is a business place" />
                                    </div>
                                    <div className={style.card_cell}>
                                        <label className={style.card_label}>Suburb<LuAsterisk className={style.card_icon} /></label>
                                        <div className={style.card_fill}>
                                            <input type="type" id="suburb" required />
                                            <p>Required</p>
                                        </div>
                                    </div>
                                    <div className={style.card_cell}>
                                        <label className={style.card_label}>City<LuAsterisk className={style.card_icon} /></label>
                                        <div className={style.card_fill}>
                                            <input type="type" id="city" required />
                                            <p>Required</p>
                                        </div>
                                    </div>
                                    <div className={style.card_cell}>
                                        <label className={style.card_label}>Post Code<LuAsterisk className={style.card_icon} /></label>
                                        <div className={style.card_fill}>
                                            <input type="type" id="postcode" required />
                                            <p>Required</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.modal_card}>
                                    <div className={`${style.card_cell} ${style.card_checkbox}`}>
                                        <label className={style.card_label}>I agree to receive marketing and promotion communications from OPPO</label>
                                        <input type="checkbox" id="claim_check" checked={isChecked} onChange={(event) => setIsChecked(event.target.checked)} required />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {modalShow && (<DetailsModal setModalShow={setModalShow} />)}
        </>
    )
}