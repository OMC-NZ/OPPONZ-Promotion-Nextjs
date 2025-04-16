import { useState, Suspense } from 'react';
import style from "./style.module.css";
import { PiQuestionBold } from "react-icons/pi";
import { GiCrossMark } from "react-icons/gi";
import useClaimIDValidation from "@/hooks/validations/useClaimIDValidation";

export default function Track({ isVisible, onClose }) {
    const [claimID, setClaimID] = useState('');
    const [hovered, setHovered] = useState(false);
    const { claimIDError, setClaimIDError, errorClaimIDMsg, validateClaimID } = useClaimIDValidation();

    const submitValidate = () => {
        validateClaimID(claimID);
    }

    const handleInputChange = (e) => {
        setClaimID(e.target.value);
        setClaimIDError(false);
    }

    if (!isVisible) return null;

    return (
        <>
            <Suspense fallback={<Loading />}>
                <div className={`${style.modalOverlay}`}>
                    <div className={`${style.modal} ${style.modal_track}`}>
                        <button className={`${style.closeButton}`} onClick={() => { onClose(); setClaimID(''); setClaimIDError(false); document.body.style.overflow = '';}}>
                            &times;
                        </button>
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
                                        <input type="type" onChange={handleInputChange} placeholder="Type a Claim ID" required />
                                        {claimIDError && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                    </div>
                                </div>
                                {claimIDError && <p className={`${style.validateError}`}>{errorClaimIDMsg}</p>}
                            </div>
                        </div>
                        <div className={`${style.conBtn}`}>
                            <button onClick={() => { onClose(); setClaimID(''); setClaimIDError(false); document.body.style.overflow = '';}}>Close</button>
                            <button onClick={submitValidate}>Search</button>
                        </div>
                    </div>
                </div>
            </Suspense>
        </>
    )
}

function Loading() {
    return <h2>Loading...</h2>;
}