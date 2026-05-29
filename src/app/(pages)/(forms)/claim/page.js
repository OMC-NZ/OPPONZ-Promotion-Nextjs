"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiUploadCloud } from "react-icons/fi";
import { FaAngleRight } from "react-icons/fa";
import { PiQuestionBold } from "react-icons/pi";
import style from "./style.module.css";
import DetailsModal from "./modal/index";
import useClaimValidation from "@hooks/validations/useClaimValidation";

const selectedPromotion = {
    image: "/temporary/img/promo02.jpg",
    title: "OPPO Reno10 5G Gift Campaign",
    subtitle: "With bonus OPPO Enco Air2",
    giftItems: [
        {
            id: "enco-air2",
            name: "OPPO Enco Air2",
            options: [
                { id: "enco-air2-white", label: "White" },
                { id: "enco-air2-black", label: "Black" },
            ],
        },
        {
            id: "watch",
            name: "Watch",
            options: [
                { id: "watch-black", label: "Black" },
                { id: "watch-blue", label: "Blue" },
            ],
        },
    ],
    purchaseDate: "12 Jan 2026",
    imei: "86*************23",
};

export default function Claim() {
    const router = useRouter();
    const [modalShow, setModalShow] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [declarationError, setDeclarationError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const giftItems = selectedPromotion.giftItems?.length
        ? selectedPromotion.giftItems
        : [{
            id: "default-gift",
            name: selectedPromotion.giftName || selectedPromotion.gift,
            options: [{ id: "default-gift-option", label: selectedPromotion.giftOption || "Included" }],
        }];
    const canSelectGift = giftItems.some((giftItem) => giftItem.options.length > 1);
    const [selectedGiftOptions, setSelectedGiftOptions] = useState(() => (
        Object.fromEntries(giftItems.map((giftItem) => [giftItem.id, giftItem.options[0].id]))
    ));

    const handleGiftOptionSelect = (giftItemId, optionId) => {
        setSelectedGiftOptions((currentOptions) => ({
            ...currentOptions,
            [giftItemId]: optionId,
        }));
    };

    const screenshotValidation = useClaimValidation("file");
    const receiptValidation = useClaimValidation("file");
    const firstNameValidation = useClaimValidation("name");
    const lastNameValidation = useClaimValidation("name");
    const emailValidation = useClaimValidation("email");
    const contactValidation = useClaimValidation("phone");
    const streetValidation = useClaimValidation("street");
    const suburbValidation = useClaimValidation("suburb");
    const cityValidation = useClaimValidation("city");
    const postCodeValidation = useClaimValidation("postcode");
    const invoiceValidation = useClaimValidation("text");

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
    const invoiceRef = useRef(null);
    const declarationRef = useRef(null);

    const handleModalOpen = () => {
        setModalShow(true);
        document.body.style.overflow = "hidden";
    };

    const validateFields = () => {
        if (isSubmitting) return;

        setDeclarationError(!isChecked);

        const validations = [
            [firstNameValidation.validate(firstNameValidation.value), firstNameRef],
            [lastNameValidation.validate(lastNameValidation.value), lastNameRef],
            [emailValidation.validate(emailValidation.value), emailRef],
            [contactValidation.validate(contactValidation.value), contactRef],
            [streetValidation.validate(streetValidation.value), streetRef],
            [suburbValidation.validate(suburbValidation.value), suburbRef],
            [cityValidation.validate(cityValidation.value), cityRef],
            [postCodeValidation.validate(postCodeValidation.value), postCodeRef],
            [invoiceValidation.validate(invoiceValidation.value), invoiceRef],
            [receiptValidation.validate(receiptValidation.value), receiptRef],
            [screenshotValidation.validate(screenshotValidation.value), screenshotRef],
            [isChecked, declarationRef],
        ];

        const firstInvalid = validations.find(([isValid]) => !isValid);

        if (firstInvalid) {
            firstInvalid[1].current?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setIsSubmitting(true);

        // TODO: Replace this with the claim submission API call.
        console.log("All fields are valid");
    };

    return (
        <>
            <title>Claim | OPPO NZ Promotions</title>
            <main className={style.claimPage}>
                <section className={style.heroTitle}>
                    <h1>Redeem Your Gift</h1>
                    <p>Complete your details to submit your claim.</p>
                    <small>* Required fields</small>
                </section>

                <form className={style.claimForm}>
                    <section className={style.formSection} ref={declarationRef}>
                        <h2>Your Promotion</h2>
                        <div className={style.promotionCard}>
                            <div className={style.promotionMedia}>
                                <Image
                                    src={selectedPromotion.image}
                                    alt={selectedPromotion.title}
                                    width={260}
                                    height={260}
                                    quality={100}
                                    className={style.promotionImage}
                                    priority
                                />
                                <button type="button" className={style.detailsButton} onClick={handleModalOpen}>
                                    View Details
                                    <FaAngleRight />
                                </button>
                            </div>
                            <div className={style.promotionInfo}>
                                <h3>{selectedPromotion.title}</h3>
                                <p>{selectedPromotion.subtitle}</p>
                                <dl>
                                    <div>
                                        <dt>Purchase Date:</dt>
                                        <dd>{selectedPromotion.purchaseDate}</dd>
                                    </div>
                                    <div>
                                        <dt>IMEI-1:</dt>
                                        <dd>{selectedPromotion.imei}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        <div className={style.giftOptionPanel}>
                            <p>{canSelectGift ? "Choose Your Gift *" : "Selected Gift *"}</p>
                            <div className={style.giftItems}>
                                {giftItems.map((giftItem) => {
                                    const itemCanSelect = giftItem.options.length > 1;
                                    return (
                                        <div className={style.giftItem} key={giftItem.id}>
                                            <strong>{giftItem.name}</strong>
                                            <div className={style.giftOptionButtons}>
                                                {giftItem.options.map((option) => (
                                                    <button
                                                        key={option.id}
                                                        type="button"
                                                        className={`${style.giftOptionButton} ${selectedGiftOptions[giftItem.id] === option.id ? style.giftOptionButtonActive : ""}`}
                                                        onClick={() => handleGiftOptionSelect(giftItem.id, option.id)}
                                                        disabled={!itemCanSelect}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <section className={style.formSection}>
                        <h2>Your Details</h2>
                        <div className={style.twoColumnGrid}>
                            <Field label="First Name *" validation={firstNameValidation} fieldRef={firstNameRef} type="name" />
                            <Field label="Last Name *" validation={lastNameValidation} fieldRef={lastNameRef} type="name" />
                            <Field label="Email Address *" validation={emailValidation} fieldRef={emailRef} type="email" />
                            <Field
                                label="Mobile Number *"
                                validation={contactValidation}
                                fieldRef={contactRef}
                                type="phone"
                                prefix="+64"
                                inputMode="numeric"
                            />
                        </div>
                    </section>

                    <section className={style.formSection}>
                        <h2>Delivery Address</h2>
                        <div className={style.singleColumnGrid}>
                            <Field
                                label="Address Line 1 *"
                                validation={streetValidation}
                                fieldRef={streetRef}
                                helpText="New Zealand delivery addresses only."
                            />
                            <Field
                                label="Company Name (Optional)"
                                helpText="If your address is a business address, enter the company name here."
                            />
                        </div>
                        <div className={style.threeColumnGrid}>
                            <Field label="Suburb *" validation={suburbValidation} fieldRef={suburbRef} />
                            <Field label="City *" validation={cityValidation} fieldRef={cityRef} />
                            <Field label="Postcode *" validation={postCodeValidation} fieldRef={postCodeRef} type="postcode" />
                        </div>
                    </section>

                    <section className={style.formSection}>
                        <h2>Purchase Information</h2>
                        <div className={style.singleColumnGrid}>
                            <Field
                                label="Invoice Number *"
                                validation={invoiceValidation}
                                fieldRef={invoiceRef}
                                type="text"
                            />
                        </div>
                        <div className={style.twoColumnGrid}>
                            <UploadField
                                label="IMEI-1 Screenshot *"
                                inputId="receipt"
                                validation={receiptValidation}
                                fieldRef={receiptRef}
                            />
                            <UploadField
                                label="Proof of Purchase *"
                                inputId="screenshot"
                                validation={screenshotValidation}
                                fieldRef={screenshotRef}
                            />
                        </div>
                    </section>

                    <section className={style.formSection}>
                        <h2>Declaration</h2>
                        <label className={style.declarationRow}>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(event) => {
                                    setIsChecked(event.target.checked);
                                    setDeclarationError(false);
                                }}
                            />
                            <span>
                                I agree to the <Link href="/terms" target="_blank">Terms and Conditions of Promotions</Link> *
                            </span>
                        </label>
                        {declarationError && <p className={style.fieldError}>Required</p>}
                    </section>

                    <div className={style.claimActions}>
                        <button type="button" className={style.secondaryButton} onClick={() => router.back()}>
                            Back
                        </button>
                        <button
                            type="button"
                            className={style.primaryButton}
                            onClick={validateFields}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting" : "Submit Claim"}
                        </button>
                    </div>
                </form>
            </main>
            {modalShow && <DetailsModal setModalShow={setModalShow} />}
        </>
    );
}

function Field({ label, validation, fieldRef, type = "text", prefix, inputMode, helpText }) {
    const handleChange = (event) => {
        if (type === "phone") {
            event.target.value = event.target.value.replace(/\D/g, "");
        }

        validation?.handleChange(event);
    };

    const input = (
        <input
            type="text"
            data-type={type}
            inputMode={inputMode}
            onChange={handleChange}
            className={validation?.error ? style.inputError : ""}
        />
    );

    return (
        <div className={style.fieldGroup} ref={fieldRef}>
            <label className={style.fieldLabel}>
                <span>{label}</span>
                {helpText && (
                    <span className={style.helpWrap}>
                        <button type="button" className={style.helpButton} aria-label={`${label} help`}>
                            <PiQuestionBold />
                        </button>
                        <span className={style.helpText}>{helpText}</span>
                    </span>
                )}
            </label>
            {prefix ? (
                <div className={`${style.prefixedInput} ${validation?.error ? style.inputError : ""}`}>
                    <span>{prefix}</span>
                    {input}
                </div>
            ) : input}
            {validation?.error && <p className={style.fieldError}>{validation.error}</p>}
        </div>
    );
}

function UploadField({ label, inputId, validation, fieldRef }) {
    return (
        <div className={style.fieldGroup} ref={fieldRef}>
            <label>{label}</label>
            <label className={`${style.uploadBox} ${validation.error ? style.uploadError : ""}`} htmlFor={inputId}>
                <FiUploadCloud />
                <span>Drag and drop file here or <strong>browse</strong></span>
                <small>PDF, JPG or PNG. Max 10MB.</small>
                <input
                    id={inputId}
                    type="file"
                    accept=".jpeg,.jpg,.png,.pdf"
                    onChange={validation.handleChange}
                    required
                />
            </label>
            {validation.error && <p className={style.fieldError}>{validation.error}</p>}
        </div>
    );
}
