"use client"
import { Suspense, useEffect, useState } from 'react';
import style from "./style.module.css";
import { PiQuestionBold } from "react-icons/pi";
import { GiCrossMark } from "react-icons/gi";
import { FiCheckSquare, FiClock, FiHelpCircle, FiRefreshCcw, FiSearch, FiTruck, FiXCircle } from "react-icons/fi";
import useClaimIDValidation from "@hooks/validations/useClaimIDValidation";
import useRecaptchaAction from "@hooks/useRecaptchaAction";
import { fetchClaimStatus } from "@api/claims";

const statusIcons = {
    pending: FiClock,
    approved: FiCheckSquare,
    dispatched: FiTruck,
    returned: FiRefreshCcw,
    rejected: FiXCircle,
    trackingUnavailable: FiHelpCircle,
    notFound: FiSearch,
};

const trackStatusByCode = {
    0: {
        status: "pending",
        label: "Pending Review",
        title: "Your claim has been received and is waiting to be processed.",
        description: "Please check back later for updates.",
    },
    1: {
        status: "approved",
        label: "Approved - Preparing Dispatch",
        title: "Your claim has been approved and is being prepared for dispatch.",
        description: "We'll update the status again once it has been shipped.",
    },
    2: {
        status: "dispatched",
        label: "Dispatched",
        title: "Your gift has been dispatched.",
    },
    3: {
        status: "returned",
        label: "Returned to Office",
        title: "Your parcel has been returned to our office.",
        descriptionPrefix: "Please contact ",
        contactEmail: "service@oppomobile.nz",
        descriptionSuffix: " for assistance.",
    },
    4: {
        status: "rejected",
        label: "Rejected",
        title: "Your claim has been rejected.",
        descriptionPrefix: "Please contact ",
        contactEmail: "service@oppomobile.nz",
        descriptionSuffix: " for more information.",
    },
    5: {
        status: "trackingUnavailable",
        label: "Tracking Unavailable",
        title: "Your claim was found, but there is no tracking URL available to display.",
        descriptionPrefix: "Please contact ",
        contactEmail: "service@oppomobile.nz",
        descriptionSuffix: " for assistance.",
    },
    6: {
        status: "notFound",
        label: "Not Found",
        title: "We couldn't find a claim with this Claim Reference.",
        description: "Please recheck the Claim Reference and try again.",
    },
};

const getTrackResult = (response, normalizedClaimId) => {
    if (!response?.success || response?.data?.verified === false) {
        return {
            ...trackStatusByCode[6],
            claimId: normalizedClaimId,
            description: response?.message || trackStatusByCode[6].description,
        };
    }

    const statusCode = Number(response.data?.status);
    const result = trackStatusByCode[statusCode] || trackStatusByCode[5];

    return {
        ...result,
        claimId: normalizedClaimId,
        trackingUrl: statusCode === 2 ? response.data?.track_link || "" : "",
    };
};

export default function Track({ isVisible, onClose }) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [claimID, setClaimID] = useState('');
    const [result, setResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [emailHovered, setEmailHovered] = useState(false);
    const [hovered, setHovered] = useState(false);
    const verifyRecaptcha = useRecaptchaAction();
    const { claimIDError, setClaimIDError, errorClaimIDMsg, validateClaimID } = useClaimIDValidation();

    const validateEmail = (value) => {
        const trimmedEmail = value.trim();

        if (!trimmedEmail) {
            setEmailError('Required');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setEmailError('Invalid Email');
            return false;
        }

        setEmailError('');
        return true;
    };

    useEffect(() => {
        if (!isVisible) return;

        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, [isVisible]);

    const submitValidate = async () => {
        if (isSearching) return;
        const isEmailValid = validateEmail(email);
        const isClaimReferenceValid = validateClaimID(claimID);
        if (!isEmailValid || !isClaimReferenceValid) return;

        const normalizedClaimId = claimID.trim().replace(/\s+/g, "").toUpperCase();
        setIsSearching(true);

        try {
            const recaptcha = await verifyRecaptcha("track_claim_search");
            const response = await fetchClaimStatus({
                claimId: normalizedClaimId,
                email: email.trim(),
                recaptchaToken: recaptcha.token,
                recaptchaAction: recaptcha.action,
            });
            setResult(getTrackResult(response, normalizedClaimId));
        } catch (error) {
            setResult({
                ...trackStatusByCode[6],
                claimId: normalizedClaimId,
                description: error?.message || "Unable to check claim status. Please try again later.",
            });
        } finally {
            setIsSearching(false);
        }
    }

    const handleInputChange = (e) => {
        setClaimID(e.target.value);
        setClaimIDError(false);
    }

    const handleEmailInputChange = (e) => {
        setEmail(e.target.value);
        setEmailError('');
    }

    const resetTrack = () => {
        setEmail('');
        setEmailError('');
        setClaimID('');
        setResult(null);
        setIsSearching(false);
        setClaimIDError(false);
    }

    const closeTrack = () => {
        if (isSearching) return;
        onClose();
        resetTrack();
    }

    if (!isVisible) return null;

    return (
        <>
            <Suspense fallback={<Loading />}>
                <div className={`${style.modalOverlay}`}>
                    <div className={`${style.modal} ${style.modal_track} ${result ? style.trackResultModal : ""}`}>
                        <button className={`${style.closeButton}`} onClick={closeTrack} disabled={isSearching}>
                            &times;
                        </button>
                        {result ? (
                            <TrackResult result={result} onClose={closeTrack} onSearchAgain={() => setResult(null)} />
                        ) : (
                            <>
                                <p className={`${style.modalTitle}`}>Track Your Claim Process</p>
                                <div className={`${style.conForm} ${style.conForm_track}`}>
                                    <div className={`${style.conInput}`}>
                                        <label>Claim Reference</label>
                                        <div className={`${style.search} ${claimIDError ? style.search_red : style.search_normal}`}>
                                            <div className={`${style.search_box}`}>
                                                <span className={`${style.conIcon} ${style.conPiIcon}`}>
                                                    <PiQuestionBold onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => hovered ? setHovered(false) : setHovered(true)} />
                                                    <i className={`${style.tipText} ${hovered ? style.visible : ''}`}>
                                                        Find the Claim Reference: <br />
                                                        Please check the Confirmation Email you received during the successful redemption.
                                                    </i>
                                                </span>
                                                <input type="text" value={claimID} onChange={handleInputChange} placeholder="Type a Claim Reference" disabled={isSearching} required />
                                                {claimIDError && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                            </div>
                                        </div>
                                        {claimIDError && <p className={`${style.validateError}`}>{errorClaimIDMsg}</p>}
                                    </div>
                                    <div className={`${style.conInput}`}>
                                        <label>Email Address</label>
                                        <div className={`${style.search} ${emailError ? style.search_red : style.search_normal}`}>
                                            <div className={`${style.search_box}`}>
                                                <span className={`${style.conIcon} ${style.conPiIcon}`}>
                                                    <PiQuestionBold onMouseEnter={() => setEmailHovered(true)} onMouseLeave={() => setEmailHovered(false)} onClick={() => emailHovered ? setEmailHovered(false) : setEmailHovered(true)} />
                                                    <i className={`${style.tipText} ${emailHovered ? style.visible : ''}`}>
                                                        The email address used when submitting your claim.
                                                    </i>
                                                </span>
                                                <input type="email" value={email} onChange={handleEmailInputChange} placeholder="Type your email address" disabled={isSearching} required />
                                                {emailError && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                            </div>
                                        </div>
                                        {emailError && <p className={`${style.validateError}`}>{emailError}</p>}
                                    </div>
                                </div>
                                <div className={`${style.conBtn}`}>
                                    <button onClick={closeTrack} disabled={isSearching}>Close</button>
                                    <button onClick={submitValidate} disabled={isSearching}>
                                        {isSearching && <span className={style.buttonSpinner} />}
                                        {isSearching ? 'Searching' : 'Search'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Suspense>
        </>
    )
}

function Loading() {
    return <h2>Loading...</h2>;
}

function TrackResult({ result, onClose, onSearchAgain }) {
    const Icon = statusIcons[result.status] || FiHelpCircle;
    const canSearchAgain = result.status === "notFound";

    return (
        <div className={`${style.trackResult} ${style[`trackStatus_${result.status}`]}`}>
            <p className={`${style.modalTitle}`}>Track Your Claim Process</p>
            <p className={`${style.trackClaimId}`}>Claim Reference: {result.claimId}</p>

            <div className={`${style.trackStatusRow}`}>
                <span className={`${style.trackStatusIcon}`}><Icon /></span>
                <span className={`${style.trackStatusBadge}`}>{result.label}</span>
            </div>

            <h3>{result.title}</h3>
            {(result.description || result.contactEmail) && (
                <p className={`${style.trackDescription}`}>
                    {result.contactEmail ? (
                        <>
                            {result.descriptionPrefix}
                            <a href={`mailto:${result.contactEmail}`}>{result.contactEmail}</a>
                            {result.descriptionSuffix}
                        </>
                    ) : result.description}
                </p>
            )}

            {result.trackingUrl && (
                <div className={`${style.trackingBox}`}>
                    <span>Tracking URL</span>
                    <a href={result.trackingUrl} target="_blank" rel="noopener noreferrer">{result.trackingUrl}</a>
                </div>
            )}

            <div className={`${style.trackResultActions}`}>
                <button type="button" onClick={onClose}>Close</button>
                {canSearchAgain && (
                    <button type="button" onClick={onSearchAgain}>Search Again</button>
                )}
            </div>
        </div>
    );
}
