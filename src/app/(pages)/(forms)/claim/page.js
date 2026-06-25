"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiFileText, FiGift, FiMail, FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import { FaAngleRight } from "react-icons/fa";
import style from "./style.module.css";
import DetailsModal from "./modal/index";
import useRecaptchaAction from "@hooks/useRecaptchaAction";
import {
    DeliveryAddressCard,
    PurchaseInformationCard,
    YourDetailsCard,
    useDeliveryAddressSection,
    usePurchaseInformationSection,
    useYourDetailsSection,
} from "@app/components/claim-form";

const defaultPromotion = {
    image: "",
    title: "",
    subtitle: "",
    giftItems: [],
    promotionPeriodLabel: "",
    promotionPeriod: "",
    purchaseDate: "",
    imei: "",
    termsUrl: "/terms",
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

const normalizeSlug = (value) => {
    const slug = Array.isArray(value) ? value.join("/") : value;
    if (!slug) return "";

    try {
        return decodeURIComponent(slug).trim().replace(/^\/+|\/+$/g, "").toLowerCase();
    } catch {
        return String(slug).trim().replace(/^\/+|\/+$/g, "").toLowerCase();
    }
};

function TermsLink({ href, children }) {
    const termsHref = href || "/terms";
    const isExternalTerms = /^https?:\/\//i.test(termsHref);

    if (isExternalTerms) {
        return (
            <a href={termsHref} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }

    return (
        <Link href={termsHref} target="_blank" rel="noopener noreferrer">
            {children}
        </Link>
    );
}

export default function Claim() {
    const router = useRouter();
    const { slug: routeSlug } = useParams();
    const [selectedPromotion, setSelectedPromotion] = useState(defaultPromotion);
    const [isClaimReady, setIsClaimReady] = useState(false);
    const [claimAccessExpired, setClaimAccessExpired] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewDocument, setPreviewDocument] = useState(null);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [termsError, setTermsError] = useState(false);
    const verifyRecaptcha = useRecaptchaAction();
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

    const yourDetailsSection = useYourDetailsSection();
    const deliveryAddressSection = useDeliveryAddressSection();
    const purchaseInformationSection = usePurchaseInformationSection();

    const termsRef = useRef(null);
    const selectedGifts = giftItems.map((giftItem) => {
        const selectedOption = giftItem.options.find((option) => option.id === selectedGiftOptions[giftItem.id]);
        return {
            name: giftItem.name,
            color: selectedOption?.color || "",
            alias: selectedOption?.alias || "",
            label: selectedOption?.label || "Included",
        };
    });
    const selectedGiftLabels = selectedGifts.map((gift) => (
        gift.label !== "Included" ? `${gift.name} (${gift.label})` : gift.name
    ));

    const reviewData = {
        promotion: selectedPromotion,
        verifiedImei: selectedPromotion.imei,
        verifiedPurchaseDate: selectedPromotion.purchaseDate,
        selectedGifts,
        giftName: selectedGiftLabels.join(" + "),
        ...yourDetailsSection.getReviewData(),
        ...deliveryAddressSection.getReviewData(),
        ...purchaseInformationSection.getReviewData(),
    };

    useEffect(() => {
        if (claimInitializedRef.current) return undefined;

        claimInitializedRef.current = true;
        const claimDraft = sessionStorage.getItem("oppoClaimDraft");
        if (!claimDraft) {
            setClaimAccessExpired(true);
            return undefined;
        }

        try {
            const parsedDraft = JSON.parse(claimDraft);
            const draftPromotion = parsedDraft.promotion || {};
            const promotionSlug = draftPromotion.slugUrl || draftPromotion.slug || "";

            if (normalizeSlug(routeSlug) && normalizeSlug(promotionSlug) !== normalizeSlug(routeSlug)) {
                setClaimAccessExpired(true);
                return undefined;
            }

            const nextPromotion = {
                ...defaultPromotion,
                ...draftPromotion,
                image: draftPromotion.image || draftPromotion.bannerUrl || draftPromotion.url || defaultPromotion.image,
                title: draftPromotion.campaignTitle || draftPromotion.title || defaultPromotion.title,
                subtitle: draftPromotion.description || draftPromotion.subtitle || draftPromotion.gift || defaultPromotion.subtitle,
                promotionPeriodLabel: draftPromotion.promotionPeriodLabel || defaultPromotion.promotionPeriodLabel,
                promotionPeriod: draftPromotion.promotionPeriod || draftPromotion.channel?.period || draftPromotion.date || defaultPromotion.promotionPeriod,
                purchaseDate: parsedDraft.purchaseDate || defaultPromotion.purchaseDate,
                imei: parsedDraft.imei || defaultPromotion.imei,
                termsUrl: draftPromotion.terms_url || defaultPromotion.termsUrl,
            };

            const nextGiftItems = getPromotionGiftItems(nextPromotion);
            setSelectedPromotion(nextPromotion);
            setSelectedGiftOptions(getInitialGiftOptions(nextGiftItems));
            setIsClaimReady(true);
            sessionStorage.removeItem("oppoClaimDraft");
        } catch {
            setClaimAccessExpired(true);
        }
    }, [routeSlug]);

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

        const sectionResults = [
            yourDetailsSection.validate(),
            deliveryAddressSection.validate(),
            purchaseInformationSection.validate(),
            { isValid: isTermsAccepted, firstInvalidRef: termsRef },
        ];

        const firstInvalid = sectionResults.find((result) => !result.isValid);

        if (firstInvalid) {
            firstInvalid.firstInvalidRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setIsReviewing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleConfirmSubmit = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            await verifyRecaptcha("claim_submit");
            // TODO: Replace this with the claim submission API call.
            console.log("Claim confirmed");
        } catch (error) {
            setIsSubmitting(false);
            console.error(error);
        }
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
                                {selectedPromotion.image && (
                                    <Image
                                        src={selectedPromotion.image}
                                        alt={selectedPromotion.title}
                                        width={260}
                                        height={260}
                                        quality={100}
                                        unoptimized={selectedPromotion.image.startsWith("http")}
                                        className={style.promotionImage}
                                        priority
                                    />
                                )}
                                <button type="button" className={style.detailsButton} onClick={handleModalOpen}>
                                    View Details
                                    <FaAngleRight />
                                </button>
                            </div>
                            <div className={style.promotionInfo}>
                                <h3>{selectedPromotion.title}</h3>
                                <p>{selectedPromotion.subtitle}</p>
                                <dl>
                                    {selectedPromotion.promotionPeriod && (
                                        <div>
                                            <dt>{selectedPromotion.promotionPeriodLabel || "Promotion Period:"}</dt>
                                            <dd>{selectedPromotion.promotionPeriod}</dd>
                                        </div>
                                    )}
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

                    <YourDetailsCard fields={yourDetailsSection.fields} />

                    <DeliveryAddressCard fields={deliveryAddressSection.fields} />

                    <PurchaseInformationCard fields={purchaseInformationSection.fields} />

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
                                I agree to the <TermsLink href={selectedPromotion.termsUrl}>Terms and Conditions of Promotions</TermsLink> *
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
            {modalShow && <DetailsModal promotion={selectedPromotion} setModalShow={setModalShow} />}
        </>
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

