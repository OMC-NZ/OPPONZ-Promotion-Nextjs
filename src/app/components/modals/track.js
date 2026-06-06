"use client"
import { useEffect, useState, Suspense } from 'react';
import style from "./style.module.css";
import { PiQuestionBold } from "react-icons/pi";
import { GiCrossMark } from "react-icons/gi";
import { FiCheckSquare, FiClock, FiHelpCircle, FiRefreshCcw, FiSearch, FiTruck, FiXCircle } from "react-icons/fi";
import useClaimIDValidation from "@hooks/validations/useClaimIDValidation";
import { getClaimTrackingRecord } from "@data/claimTracking";

const statusIcons = {
    pending: FiClock,
    approved: FiCheckSquare,
    dispatched: FiTruck,
    returned: FiRefreshCcw,
    rejected: FiXCircle,
    trackingUnavailable: FiHelpCircle,
    notFound: FiSearch,
};

export default function Track({ isVisible, onClose }) {
    const [claimID, setClaimID] = useState('');
    const [result, setResult] = useState(null);
    const [hovered, setHovered] = useState(false);
    const { claimIDError, setClaimIDError, errorClaimIDMsg, validateClaimID } = useClaimIDValidation();

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

    const submitValidate = () => {
        if (!validateClaimID(claimID)) return;

        const normalizedClaimId = claimID.trim().replace(/\s+/g, "").toUpperCase();
        const record = getClaimTrackingRecord(normalizedClaimId);
        setResult(record ? { ...record, claimId: normalizedClaimId } : {
            status: "notFound",
            label: "Not Found",
            claimId: normalizedClaimId,
            title: "We couldn’t find a claim with this Claim ID.",
            description: "Please recheck the Claim ID and try again.",
        });
    }

    const handleInputChange = (e) => {
        setClaimID(e.target.value);
        setClaimIDError(false);
    }

    const resetTrack = () => {
        setClaimID('');
        setResult(null);
        setClaimIDError(false);
    }

    const closeTrack = () => {
        onClose();
        resetTrack();
    }

    if (!isVisible) return null;

    return (
        <>
            <Suspense fallback={<Loading />}>
                <div className={`${style.modalOverlay}`}>
                    <div className={`${style.modal} ${style.modal_track} ${result ? style.trackResultModal : ""}`}>
                        <button className={`${style.closeButton}`} onClick={closeTrack}>
                            &times;
                        </button>
                        {result ? (
                            <TrackResult result={result} onClose={closeTrack} onSearchAgain={() => setResult(null)} />
                        ) : (
                            <>
                                <p className={`${style.modalTitle}`}>Track Your Claim Process</p>
                                <div className={`${style.conForm} ${style.conForm_track}`}>
                                    <div className={`${style.conInput}`}>
                                        <label>What is your Claim ID?</label>
                                        <div className={`${style.search} ${claimIDError ? style.search_red : style.search_normal}`}>
                                            <div className={`${style.search_box}`}>
                                                <span className={`${style.conIcon} ${style.conPiIcon}`}>
                                                    <PiQuestionBold onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => hovered ? setHovered(false) : setHovered(true)} />
                                                    <i className={`${style.tipText} ${hovered ? style.visible : ''}`}>
                                                        Find the Claim ID: <br />
                                                        Please check the Confirmation Email you received during the successful redemption.
                                                    </i>
                                                </span>
                                                <input type="text" value={claimID} onChange={handleInputChange} placeholder="Type a Claim ID" required />
                                                {claimIDError && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                            </div>
                                        </div>
                                        {claimIDError && <p className={`${style.validateError}`}>{errorClaimIDMsg}</p>}
                                    </div>
                                </div>
                                <div className={`${style.conBtn}`}>
                                    <button onClick={closeTrack}>Close</button>
                                    <button onClick={submitValidate}>Search</button>
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
    const descriptionParts = result.contactEmail && result.description
        ? result.description.split(result.contactEmail)
        : null;

    return (
        <div className={`${style.trackResult} ${style[`trackStatus_${result.status}`]}`}>
            <p className={`${style.modalTitle}`}>Track Your Claim Process</p>
            <p className={`${style.trackClaimId}`}>Claim ID: {result.claimId}</p>

            <div className={`${style.trackStatusRow}`}>
                <span className={`${style.trackStatusIcon}`}><Icon /></span>
                <span className={`${style.trackStatusBadge}`}>{result.label}</span>
            </div>

            <h3>{result.title}</h3>
            {result.description && (
                <p className={`${style.trackDescription}`}>
                    {descriptionParts ? (
                        <>
                            {descriptionParts[0]}
                            <a href={`mailto:${result.contactEmail}`}>{result.contactEmail}</a>
                            {descriptionParts[1]}
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
                {result.status === "notFound" && (
                    <>
                        <button type="button" onClick={onClose}>Close</button>
                        <button type="button" onClick={onSearchAgain}>Search Again</button>
                    </>
                )}
                {result.status !== "notFound" && (
                    <>
                        <button type="button" onClick={onClose}>Close</button>
                        <button type="button" onClick={onSearchAgain}>Search Again</button>
                    </>
                )}
            </div>
        </div>
    );
}
