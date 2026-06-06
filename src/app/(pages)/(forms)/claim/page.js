"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiFileText, FiGift, FiMail, FiMapPin, FiPhone, FiUploadCloud, FiUser } from "react-icons/fi";
import { FaAngleRight } from "react-icons/fa";
import { PiQuestionBold } from "react-icons/pi";
import style from "./style.module.css";
import DetailsModal from "./modal/index";
import useClaimValidation from "@hooks/validations/useClaimValidation";

const defaultPromotion = {
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

const getPromotionGiftItems = (promotion) => {
    if (promotion.giftItems?.length) return promotion.giftItems;

    return [{
        id: "default-gift",
        name: promotion.giftName || promotion.gift || promotion.subtitle || "Included Gift",
        options: [{ id: "default-gift-option", label: promotion.giftOption || "Included" }],
    }];
};

const getInitialGiftOptions = (giftItems) => (
    Object.fromEntries(giftItems.map((giftItem) => [giftItem.id, giftItem.options[0]?.id]))
);

export default function Claim() {
    const router = useRouter();
    const [selectedPromotion, setSelectedPromotion] = useState(defaultPromotion);
    const [isClaimReady, setIsClaimReady] = useState(false);
    const [claimAccessExpired, setClaimAccessExpired] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewDocument, setPreviewDocument] = useState(null);
    const [companyName, setCompanyName] = useState("");
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [termsError, setTermsError] = useState(false);
    const claimInitializedRef = useRef(false);
    const claimHasLeftRef = useRef(false);
    const giftItems = getPromotionGiftItems(selectedPromotion);
    const canSelectGift = giftItems.some((giftItem) => giftItem.options.length > 1);
    const [selectedGiftOptions, setSelectedGiftOptions] = useState(() => (
        getInitialGiftOptions(getPromotionGiftItems(defaultPromotion))
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
    const termsRef = useRef(null);
    const selectedGiftLabels = giftItems.map((giftItem) => {
        const selectedOption = giftItem.options.find((option) => option.id === selectedGiftOptions[giftItem.id]);
        return selectedOption?.label && selectedOption.label !== "Included"
            ? `${giftItem.name} (${selectedOption.label})`
            : giftItem.name;
    });

    const getFileName = (fileList) => fileList?.[0]?.name || "";

    const reviewData = {
        giftName: selectedGiftLabels.join(" + "),
        fullName: `${firstNameValidation.value} ${lastNameValidation.value}`.trim(),
        mobileNumber: contactValidation.value ? `+64 ${contactValidation.value}` : "",
        email: emailValidation.value,
        addressLines: [
            companyName ? `Company Name: ${companyName}` : "",
            streetValidation.value,
            suburbValidation.value,
            `${cityValidation.value} ${postCodeValidation.value}`.trim(),
            "New Zealand",
        ].filter(Boolean),
        documents: [
            {
                label: "IMEI Screenshot",
                fileName: getFileName(receiptValidation.value),
                file: receiptValidation.value?.[0],
            },
            {
                label: "Proof of Purchase",
                fileName: getFileName(screenshotValidation.value),
                file: screenshotValidation.value?.[0],
            },
        ],
    };

    useEffect(() => {
        if (claimInitializedRef.current) return undefined;

        claimInitializedRef.current = true;
        const claimDraft = sessionStorage.getItem("oppoClaimDraft");
        if (!claimDraft) {
            setClaimAccessExpired(true);
            return undefined;
        }

        sessionStorage.removeItem("oppoClaimDraft");

        try {
            const parsedDraft = JSON.parse(claimDraft);
            const draftPromotion = parsedDraft.promotion || {};
            const nextPromotion = {
                ...defaultPromotion,
                ...draftPromotion,
                image: draftPromotion.image || draftPromotion.url || defaultPromotion.image,
                title: draftPromotion.campaignTitle || draftPromotion.title || defaultPromotion.title,
                subtitle: draftPromotion.subtitle || draftPromotion.gift || defaultPromotion.subtitle,
                purchaseDate: parsedDraft.purchaseDate || defaultPromotion.purchaseDate,
                imei: parsedDraft.imei || defaultPromotion.imei,
            };

            const nextGiftItems = getPromotionGiftItems(nextPromotion);
            setSelectedPromotion(nextPromotion);
            setSelectedGiftOptions(getInitialGiftOptions(nextGiftItems));
            setIsClaimReady(true);
        } catch {
            setClaimAccessExpired(true);
        }
    }, [router]);

    useEffect(() => {
        if (!isClaimReady) return undefined;

        const handlePageHide = () => {
            claimHasLeftRef.current = true;
            sessionStorage.removeItem("oppoClaimDraft");
        };

        const handlePageShow = (event) => {
            if (claimHasLeftRef.current || event.persisted) {
                setIsClaimReady(false);
                setClaimAccessExpired(true);
            }
        };

        window.addEventListener("pagehide", handlePageHide);
        window.addEventListener("pageshow", handlePageShow);

        return () => {
            window.removeEventListener("pagehide", handlePageHide);
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, [isClaimReady, router]);

    useEffect(() => {
        document.body.style.overflowY = modalShow ? "hidden" : "";

        return () => {
            document.body.style.overflowY = "";
        };
    }, [modalShow]);

    useEffect(() => {
        if (!claimAccessExpired) return;

        window.scrollTo({ top: 0, behavior: "auto" });
    }, [claimAccessExpired]);

    const handleModalOpen = () => {
        setModalShow(true);
        document.body.style.overflowY = "hidden";
    };

    const handleBackToEdit = () => {
        setIsReviewing(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const validateFields = () => {
        if (isSubmitting) return;

        setTermsError(!isTermsAccepted);

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
            [isTermsAccepted, termsRef],
        ];

        const firstInvalid = validations.find(([isValid]) => !isValid);

        if (firstInvalid) {
            firstInvalid[1].current?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setIsReviewing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleConfirmSubmit = () => {
        setIsSubmitting(true);
        // TODO: Replace this with the claim submission API call.
        console.log("Claim confirmed");
    };

    if (claimAccessExpired) {
        return (
            <>
                <title>Verify Again | OPPO NZ Promotions</title>
                <main className={style.claimAccessNotice}>
                    <section>
                        <h1>Verification Required</h1>
                        <p>
                            This claim session has expired. Please verify your IMEI-1 and purchase date again before continuing.
                        </p>
                        <button type="button" className={style.primaryButton} onClick={() => router.replace("/")}>
                            Back to Home
                        </button>
                    </section>
                </main>
            </>
        );
    }

    if (!isClaimReady) return null;

    if (isReviewing) {
        return (
            <>
                <title>Review Your Claim | OPPO NZ Promotions</title>
                <ReviewClaimPage
                    data={reviewData}
                    onBack={handleBackToEdit}
                    onConfirm={handleConfirmSubmit}
                    isSubmitting={isSubmitting}
                    onPreviewDocument={setPreviewDocument}
                />
                {previewDocument && (
                    <DocumentPreviewModal
                        document={previewDocument}
                        onClose={() => setPreviewDocument(null)}
                    />
                )}
            </>
        );
    }

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
                    <section className={style.formSection}>
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
                                value={companyName}
                                onChange={setCompanyName}
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

                    <section className={style.formSection} ref={termsRef}>
                        <h2>Declaration</h2>
                        <label className={style.declarationRow}>
                            <input
                                type="checkbox"
                                checked={isTermsAccepted}
                                onChange={(event) => {
                                    setIsTermsAccepted(event.target.checked);
                                    setTermsError(false);
                                }}
                            />
                            <span>
                                I agree to the <Link href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions of Promotions</Link> *
                            </span>
                        </label>
                        {termsError && <p className={style.inlineFieldError}>Required</p>}
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
                            {isSubmitting ? "Submitting" : "Next"}
                        </button>
                    </div>
                </form>
            </main>
            {modalShow && <DetailsModal setModalShow={setModalShow} />}
        </>
    );
}

function Field({ label, validation, fieldRef, type = "text", prefix, inputMode, helpText, value, onChange }) {
    const inputValue = value ?? validation?.value ?? "";

    const handleChange = (event) => {
        if (type === "phone") {
            event.target.value = event.target.value.replace(/\D/g, "");
        }

        onChange?.(event.target.value);
        validation?.handleChange(event);
    };

    const input = (
        <input
            type="text"
            data-type={type}
            inputMode={inputMode}
            onChange={handleChange}
            onBlur={validation?.handleBlur}
            value={inputValue}
            className={validation?.error ? style.inputError : ""}
        />
    );

    return (
        <div className={style.fieldGroup} ref={fieldRef}>
            <label className={style.fieldLabel}>
                <span>{label}</span>
                {validation?.error && <span className={style.inlineFieldError}>{validation.error}</span>}
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
        </div>
    );
}

function ReviewClaimPage({ data, onBack, onConfirm, isSubmitting, onPreviewDocument }) {
    return (
        <main className={style.reviewPage}>
            <section className={style.reviewHero}>
                <h1>Review Your Claim</h1>
                <p>Please check your details carefully before confirming your claim.</p>
            </section>

            <div className={style.reviewFlow}>
                <section className={style.giftReviewCard}>
                    <div className={style.reviewCardTitleRow}>
                        <h2><FiGift />Your Gift</h2>
                    </div>
                    <strong>{data.giftName}</strong>
                    <p>This is the gift that will be sent once your claim is approved.</p>
                </section>

                <section className={style.reviewInfoCard}>
                    <h2>Contact Details</h2>
                    <div className={style.contactSummary}>
                        <InfoPair icon={<FiUser />} label="Full Name:" value={data.fullName} />
                        <InfoPair icon={<FiPhone />} label="Mobile Number:" value={data.mobileNumber} />
                    </div>
                    <div className={style.emailFeature}>
                        <span><FiMail /></span>
                        <div>
                            <p>Email Address</p>
                            <strong>{data.email}</strong>
                            <small>Claim updates will be sent to this email.</small>
                        </div>
                    </div>
                </section>

                <section className={style.reviewInfoCard}>
                    <h2>Delivery Address</h2>
                    <div className={style.addressFeature}>
                        <span><FiMapPin /></span>
                        <div>
                            {data.addressLines.map((line) => (
                                <strong key={line}>{line}</strong>
                            ))}
                            <small>Please make sure this is the correct delivery address for your gift.</small>
                        </div>
                    </div>
                </section>

                <section className={style.reviewInfoCard}>
                    <h2>Purchase Documents</h2>
                    <div className={style.documentList}>
                        {data.documents.map((document) => (
                            <div className={style.documentRow} key={document.label}>
                                <FiFileText />
                                <p>{document.label}</p>
                                <span>{document.fileName || "Not provided"}</span>
                                <button
                                    type="button"
                                    onClick={() => onPreviewDocument(document)}
                                    disabled={!document.file}
                                >
                                    View
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className={style.reviewBottomBar}>
                <p>Please confirm your gift, email and delivery address carefully.</p>
                <div>
                    <button type="button" className={style.secondaryButton} onClick={onBack}>
                        Back to Edit
                    </button>
                    <button type="button" className={style.primaryButton} onClick={onConfirm} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting" : "Confirm & Submit"}
                    </button>
                </div>
            </div>
        </main>
    );
}

function DocumentPreviewModal({ document: previewDocument, onClose }) {
    const [fileUrl, setFileUrl] = useState("");
    const fileType = previewDocument.file?.type || "";
    const isImage = fileType.startsWith("image/");
    const isPdf = fileType === "application/pdf";

    useEffect(() => {
        if (!previewDocument.file) return undefined;

        const nextFileUrl = URL.createObjectURL(previewDocument.file);
        setFileUrl(nextFileUrl);
        window.document.body.style.overflowY = "hidden";

        return () => {
            URL.revokeObjectURL(nextFileUrl);
            window.document.body.style.overflowY = "";
        };
    }, [previewDocument.file]);

    return (
        <div className={style.documentPreviewOverlay}>
            <div className={style.documentPreviewModal} role="dialog" aria-modal="true" aria-labelledby="document-preview-title">
                <button type="button" className={style.documentPreviewClose} onClick={onClose} aria-label="Close document preview">
                    &times;
                </button>

                <div className={style.documentPreviewHeader}>
                    <h2 id="document-preview-title">{previewDocument.label}</h2>
                    <p>{previewDocument.fileName}</p>
                </div>

                <div className={style.documentPreviewBody}>
                    {isImage && fileUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={fileUrl} alt={previewDocument.fileName} />
                    )}

                    {isPdf && fileUrl && (
                        <iframe src={fileUrl} title={previewDocument.fileName} />
                    )}

                    {!isImage && !isPdf && (
                        <p>Preview is not available for this file type.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoPair({ icon, label, value }) {
    return (
        <div className={style.infoPair}>
            {icon}
            <span>{label}</span>
            <strong>{value || "Not provided"}</strong>
        </div>
    );
}

function UploadField({ label, inputId, validation, fieldRef }) {
    const [isDraggingFile, setIsDraggingFile] = useState(false);
    const selectedFileName = validation.value?.[0]?.name;

    const handleFiles = (files) => {
        validation.handleChange({
            target: {
                type: "file",
                files,
            },
        });
        validation.validate(files);
    };

    const handleFileChange = (event) => {
        handleFiles(event.target.files);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDraggingFile(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDraggingFile(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDraggingFile(false);

        if (!event.dataTransfer.files?.length) return;
        handleFiles(event.dataTransfer.files);
    };

    return (
        <div className={style.fieldGroup} ref={fieldRef}>
            <label className={style.fieldLabel}>
                <span>{label}</span>
                {validation.error && <span className={style.inlineFieldError}>{validation.error}</span>}
            </label>
            <label
                className={`${style.uploadBox} ${validation.error ? style.uploadError : ""} ${isDraggingFile ? style.uploadBoxDragging : ""}`}
                htmlFor={inputId}
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <FiUploadCloud />
                {selectedFileName ? (
                    <>
                        <span className={style.selectedFileName}>{selectedFileName}</span>
                        <small>Click to choose a different file.</small>
                    </>
                ) : (
                    <>
                        <span>Drag and drop file here or <strong>browse</strong></span>
                        <small>JPG or PNG max 5MB. PDF max 10MB.</small>
                    </>
                )}
                <input
                    id={inputId}
                    type="file"
                    accept=".jpeg,.jpg,.png,.pdf"
                    onChange={handleFileChange}
                    required
                />
            </label>
        </div>
    );
}
