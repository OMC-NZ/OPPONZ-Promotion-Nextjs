"use client"

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from 'next/link';
import style from "./style.module.css";
import DetailsModal from "./modal/index";
import useWindowSize from "@/hooks/useWindowSize";
import { LuAsterisk } from "react-icons/lu";
import { GiCrossMark } from "react-icons/gi";
import useClaimValidation from "@/hooks/validations/useClaimValidation";
import useSearchStreet from "@/hooks/useSearchStreet";

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
    const [modalShow, setModalShow] = useState(false);
    const [bannerURL, setBannerURL] = useState(imgs.url.tablet);
    const { width: windowWidth } = useWindowSize();
    const [isChecked, setIsChecked] = useState(true);
    // Using custom hook for validation
    const screenshotValidation = useClaimValidation('file');
    const receiptValidation = useClaimValidation('file');
    const firstNameValidation = useClaimValidation('name');
    const lastNameValidation = useClaimValidation('name');
    const emailValidation = useClaimValidation('email');
    const contactValidation = useClaimValidation('phone');
    const streetValidation = useClaimValidation('street');
    const suburbValidation = useClaimValidation('suburb');
    const cityValidation = useClaimValidation('city');
    const postCodeValidation = useClaimValidation('postcode');

    // Refs for each input field
    const screenshotRef = useRef(null);
    const receiptRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const contactRef = useRef(null);
    const streetRef = useRef(null);
    const suburbRef = useRef(null);
    const cityRef = useRef(null);
    const postCodeRef = useRef(null);
    
    const { data, error } = useSearchStreet('120 Albert street')

    console.log(data)

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

    const validateFields = () => {
        const isScreenshotValid = screenshotValidation.validate(screenshotValidation.value);
        const isReceiptValid = receiptValidation.validate(receiptValidation.value);
        const isFirstNameValid = firstNameValidation.validate(firstNameValidation.value);
        const isLastNameValid = lastNameValidation.validate(lastNameValidation.value);
        const isEmailValid = emailValidation.validate(emailValidation.value);
        const isContactValid = contactValidation.validate(contactValidation.value);
        const isStreetValid = streetValidation.validate(streetValidation.value);
        const isSuburbValid = suburbValidation.validate(suburbValidation.value);
        const isCityValid = cityValidation.validate(cityValidation.value);
        const isPostCodeValid = postCodeValidation.validate(postCodeValidation.value);

        if (isScreenshotValid && isReceiptValid && isFirstNameValid && isLastNameValid && isEmailValid && isContactValid && isStreetValid && isSuburbValid && isCityValid && isPostCodeValid) {
            // Perform form submission or next actions
            console.log('All fields are valid');
        } else {
            // Scroll to the first error
            if (!isScreenshotValid) {
                screenshotRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (!isReceiptValid) {
                receiptRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (!isFirstNameValid) {
                firstNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (!isLastNameValid) {
                lastNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (!isEmailValid) {
                emailRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (!isContactValid) {
                contactRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (!isStreetValid) {
                streetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (!isSuburbValid) {
                suburbRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (!isCityValid) {
                cityRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (!isPostCodeValid) {
                postCodeRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
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
                                        <div className={style.card_main} ref={screenshotRef}>
                                            <label className={style.card_label}>Screenshot of IMEI-1<LuAsterisk className={style.card_icon} /></label>
                                            <div className={`w-full`}>
                                                <input type="file" id="screenshot" data-type="file" accept=".jpeg,.jpg,.png,.pdf" onChange={screenshotValidation.handleChange} required />
                                            </div>
                                        </div>
                                        {screenshotValidation.error && <p className={style.card_error}>{screenshotValidation.error}</p>}
                                    </div>
                                    <div className={style.card_cell}>
                                        <div className={style.card_main} ref={receiptRef}>
                                            <label className={style.card_label}>Proof of Purchase<LuAsterisk className={style.card_icon} /></label>
                                            <div className={`w-full`}>
                                                <input type="file" id="receipt" data-type="file" accept=".jpeg,.jpg,.png,.pdf" onChange={receiptValidation.handleChange} required />
                                            </div>
                                        </div>
                                        {receiptValidation.error && <p className={style.card_error}>{receiptValidation.error}</p>}
                                    </div>
                                    <div className={style.card_cell}>
                                        <div className={style.card_main}>
                                            <label className={style.card_label}>Order Number</label>
                                            <div className={`w-full ${style.card_border} ${style.normalBorder}`}>
                                                <input type="type" id="order_no" data-type="text" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={style.modal_card}>
                                    <div className={style.card_cell}>  {/* First Name */}
                                        <div className={style.card_main} ref={firstNameRef}>
                                            <label className={style.card_label}>First Name<LuAsterisk className={style.card_icon} /></label>
                                            <div className={`w-full ${style.card_border} ${firstNameValidation.error ? style.errorBorder : style.normalBorder}`}>
                                                <input type="type" id="first_name" data-type="name" onBlur={firstNameValidation.handleChange} required />
                                                {firstNameValidation.error && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                            </div>
                                        </div>
                                        {firstNameValidation.error && <p className={style.card_error}>{firstNameValidation.error}</p>}
                                    </div>
                                    <div className={style.card_cell}>  {/* Last Name */}
                                        <div className={style.card_main} ref={lastNameRef}>
                                            <label className={style.card_label}>Last Name<LuAsterisk className={style.card_icon} /></label>
                                            <div className={`w-full ${style.card_border} ${lastNameValidation.error ? style.errorBorder : style.normalBorder}`}>
                                                <input type="type" id="last_name" data-type="name" onBlur={lastNameValidation.handleChange} required />
                                                {lastNameValidation.error && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                            </div>
                                        </div>
                                        {lastNameValidation.error && <p className={style.card_error}>{lastNameValidation.error}</p>}
                                    </div>
                                    <div className={style.card_cell}>  {/* Email */}
                                        <div className={style.card_main} ref={emailRef}>
                                            <label className={style.card_label}>Email<LuAsterisk className={style.card_icon} /></label>
                                            <div className={`w-full ${style.card_border} ${emailValidation.error ? style.errorBorder : style.normalBorder}`}>
                                                <input type="type" id="email" data-type="email" onBlur={emailValidation.handleChange} required />
                                                {emailValidation.error && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                            </div>
                                        </div>
                                        {emailValidation.error && <p className={style.card_error}>{emailValidation.error}</p>}
                                    </div>
                                    <div className={style.card_cell}>  {/* Phone Number */}
                                        <div className={style.card_main} ref={contactRef}>
                                            <label className={style.card_label}>Phone Number<LuAsterisk className={style.card_icon} /></label>
                                            <div className={`w-full ${style.card_border} ${contactValidation.error ? style.errorBorder : style.normalBorder}`}>
                                                <input type="type" id="contact" data-type="phone" onBlur={contactValidation.handleChange} required />
                                                {contactValidation.error && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                            </div>
                                        </div>
                                        {contactValidation.error && <p className={style.card_error}>{contactValidation.error}</p>}
                                    </div>
                                </div>

                                <div className={style.modal_card}>
                                    <div className={style.card_cell}>  {/* Street */}
                                        <div className={style.card_main} ref={streetRef}>
                                            <label className={style.card_label}>Street<LuAsterisk className={style.card_icon} /></label>
                                            <div className={`w-full ${style.card_border} ${streetValidation.error ? style.errorBorder : style.normalBorder}`}>
                                                <input type="type" id="street" onBlur={streetValidation.handleChange} placeholder="Type and select an address" required />
                                                {streetValidation.error && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                            </div>
                                        </div>
                                        {streetValidation.error && <p className={style.card_error}>{streetValidation.error}</p>}
                                    </div>
                                    <div className={style.card_cell}>
                                        <div className={style.card_main}>
                                            <label className={style.card_label}>Company(Optional)</label>
                                            <div className={`w-full ${style.card_border} ${style.normalBorder}`}>
                                                <input type="type" id="instructions" placeholder="If your address is a business place." />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.card_cell}>  {/* Suburb */}
                                        <div className={style.card_main} ref={suburbRef}>
                                            <label className={style.card_label}>Suburb<LuAsterisk className={style.card_icon} /></label>
                                            <div className={`w-full ${style.card_border} ${suburbValidation.error ? style.errorBorder : style.normalBorder}`}>
                                                <input type="type" id="suburb" onBlur={suburbValidation.handleChange} required />
                                                {suburbValidation.error && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                            </div>
                                        </div>
                                        {suburbValidation.error && <p className={style.card_error}>{suburbValidation.error}</p>}
                                    </div>
                                    <div className={style.card_cell}>  {/* City */}
                                        <div className={style.card_main} ref={cityRef}>
                                            <label className={style.card_label}>City<LuAsterisk className={style.card_icon} /></label>
                                            <div className={`w-full ${style.card_border} ${cityValidation.error ? style.errorBorder : style.normalBorder}`}>
                                                <input type="type" id="city" onBlur={cityValidation.handleChange} required />
                                                {cityValidation.error && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                            </div>
                                        </div>
                                        {cityValidation.error && <p className={style.card_error}>{cityValidation.error}</p>}
                                    </div>
                                    <div className={style.card_cell}>  {/* Post Code */}
                                        <div className={style.card_main} ref={postCodeRef}>
                                            <label className={style.card_label}>Post Code<LuAsterisk className={style.card_icon} /></label>
                                            <div className={`w-full ${style.card_border} ${postCodeValidation.error ? style.errorBorder : style.normalBorder}`}>
                                                <input type="type" id="postcode" data-type="postcode" onBlur={postCodeValidation.handleChange} required />
                                                {postCodeValidation.error && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                            </div>
                                        </div>
                                        {postCodeValidation.error && <p className={style.card_error}>{postCodeValidation.error}</p>}
                                    </div>
                                </div>

                                <div className={style.modal_card} style={{ 'flex-direction': 'row' }}>
                                    <div className={`${style.card_cell} ${style.card_checkbox}`}>
                                        <label className={style.card_label}>I agree to receive marketing and promotion communications from OPPO</label>
                                        <div className={``}>
                                            <input type="checkbox" id="subscription" checked={isChecked} onChange={(event) => setIsChecked(event.target.checked)} required />
                                        </div>
                                    </div>
                                </div>

                                <button type="button" onClick={validateFields} className={style.submit_button}>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {modalShow && (<DetailsModal setModalShow={setModalShow} />)}
        </>
    )
}