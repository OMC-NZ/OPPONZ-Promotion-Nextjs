"use client"
import { forwardRef, useState, useEffect } from 'react';
import style from "./style.module.css";
import { FiCalendar } from "react-icons/fi";
import { PiQuestionBold } from "react-icons/pi";
import { GiCheckMark, GiCrossMark } from "react-icons/gi";
import { IoInformationCircleOutline } from "react-icons/io5";
import { LuGift, LuSearch } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import useWindowSize from "@hooks/useWindowSize";
import useIMEIValidation from "@hooks/validations/useIMEIValidation";
import useDateValidation from "@hooks/validations/useDateValidation";
import { verifyPromotionEligibility } from "@api/promotionEligibility";

const ReadOnlyDateInput = forwardRef(function ReadOnlyDateInput({ value, onClick, placeholder }, ref) {
    return (
        <input
            ref={ref}
            type="text"
            value={value}
            placeholder={placeholder}
            onClick={onClick}
            onKeyDown={(event) => event.preventDefault()}
            readOnly
        />
    );
});

export default function Redeem({ isVisible, onClose, onOpenTrack }) {
    const [imeiInput, setIMEIInput] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [popperStatus, setPopperStatus] = useState('bottom');
    const [searchStatus, setSearchStatus] = useState('idle');
    const [matchedPromotion, setMatchedPromotion] = useState(null);
    const size = useWindowSize();
    const { imeiError, setIMEIError, errorIMEIMsg, validateIMEI } = useIMEIValidation();
    const { dateError, setDateError, errorDateMsg, validateDate } = useDateValidation();

    //临时声明一个
    const [imeiCorrect, setIMEICorrect] = useState(false);

    const maxDate = new Date();

    const resetForm = () => {
        setIMEIInput('');
        setSelectedDate(null);
        setIMEIError(false);
        setDateError(false);
        setIMEICorrect(false);
        setSearchStatus('idle');
        setMatchedPromotion(null);
        document.body.style.overflowY = '';
    };

    const resetSearchInputs = () => {
        setIMEIInput('');
        setSelectedDate(null);
        setIMEIError(false);
        setDateError(false);
        setIMEICorrect(false);
        setMatchedPromotion(null);
        setSearchStatus('idle');
    };

    const handleOpenTrack = () => {
        onClose();
        resetForm();
        onOpenTrack?.();
    };

    const maskIMEI = (value) => {
        const cleanedValue = value.replace(/\s+/g, '');
        if (cleanedValue.length <= 4) return cleanedValue;
        return `${cleanedValue.slice(0, 2)}${'*'.repeat(Math.max(0, cleanedValue.length - 4))}${cleanedValue.slice(-2)}`;
    };

    const formatPurchaseDate = (date) => {
        if (!date) return '';
        return new Intl.DateTimeFormat('en-NZ', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };

    const isSubmitValid = () => {
        const cleanedIMEI = imeiInput.replace(/\s+/g, '');
        let isValid = true;

        if (!cleanedIMEI) {
            setIMEIError(true);
            setIMEICorrect(false);
            isValid = false;
        } else if (!/^86\d{13}$/.test(cleanedIMEI)) {
            setIMEIError(true);
            setIMEICorrect(false);
            isValid = false;
        } else {
            setIMEIError(false);
            setIMEICorrect(true);
        }

        if (!selectedDate) {
            setDateError(true);
            isValid = false;
        } else {
            const today = new Date();
            const givenDate = new Date(selectedDate);
            today.setHours(0, 0, 0, 0);
            if (today.getTime() - givenDate.getTime() > 31536000000) {
                setDateError(true);
                isValid = false;
            } else {
                setDateError(false);
            }
        }

        return isValid;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setDateError(false);
    };

    const handleIMEIInputChange = (event) => {
        setIMEIInput(event.target.value);
        setIMEIError(false);
        setIMEICorrect(false);
    }

    const handleIMEIBlur = () => {
        validateIMEI(imeiInput, 'input');
        const cleanedIMEI = imeiInput.replace(/\s+/g, '');
        setIMEICorrect(/^86\d{13}$/.test(cleanedIMEI));
    };

    const submitValidate = () => {
        if (searchStatus === 'searching') return;

        validateIMEI(imeiInput, 'submit');
        validateDate(selectedDate);

        if (!isSubmitValid()) return;

        handleSearchPromotion();
    }

    const handleSearchPromotion = async () => {
        setSearchStatus('searching');
        setMatchedPromotion(null);

        try {
            const result = await verifyPromotionEligibility({
                imei: imeiInput,
                purchaseDate: formatPurchaseDate(selectedDate),
            });

            setMatchedPromotion(result.promotion);
            setSearchStatus(result.eligible ? 'success' : 'empty');
        } catch {
            setMatchedPromotion(null);
            setSearchStatus('empty');
        }
    };


    useEffect(() => {
        if (size.width < 768 || size.width < size.height) {
            setPopperStatus('top');
        }
    }, [size.width, size.height]);

    if (!isVisible) return null;

    const purchaseDateLabel = formatPurchaseDate(selectedDate);
    const showSearchOverlay = searchStatus !== 'idle';

    return (
        <>
            <div className={style.modalOverlay}>
                <div className={`${style.modal} ${showSearchOverlay ? style.modalResult : ''}`}>
                    <button className={style.closeButton} onClick={() => { onClose(); resetForm(); }}>
                        &times;
                    </button>
                    <p className={`${style.modalTitle}`}>Find Your Promotion</p>
                    <div className={`${style.conForm}`}>
                        <div className={`${style.conInput}`}>
                            <label>What is your phone&apos;s IMEI-1?</label>
                            <div className={`${style.search} ${imeiError ? style.search_red : style.search_normal}`}>
                                <div className={`${style.search_box}`}>
                                    <span className={`${style.conIcon} ${style.conPiIcon}`}>
                                        <PiQuestionBold onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => hovered ? setHovered(false) : setHovered(true)} />
                                        <i className={`${style.tipText} ${hovered ? style.visible : ''}`}>
                                            Ways to find the IMEI-1: <br />
                                            1. Dial *#06# on the keypad to retrieve.<br />
                                            2. Check the bottom of product packing box.<br />
                                            3. Go to [Settings] &gt; [About Phone] &gt; [Status] &gt; [IMEI-1].
                                        </i>
                                    </span>
                                    <input type="type" placeholder="Input an IMEI-1" value={imeiInput} onChange={handleIMEIInputChange} onBlur={handleIMEIBlur} required />
                                    {imeiCorrect && <p className={`${style.validatetick}`}><GiCheckMark /></p>}
                                    {imeiError && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                </div>
                            </div>
                            {imeiError && <p className={`${style.validateError}`}>{errorIMEIMsg}</p>}
                        </div>
                        <div className={`${style.conInput}`}>
                            <label>When did you purchase the device?</label>
                            <div className={`${style.search} ${dateError ? style.search_red : style.search_normal}`}>
                                <div className={`${style.search_box}`}>
                                    <span className={`${style.conIcon}`}>
                                        <FiCalendar />
                                    </span>
                                    <DatePicker
                                        wrapperClassName={`${style.datepicker}`}
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="Select a Date"
                                        maxDate={maxDate}
                                        popperPlacement={popperStatus}
                                        customInput={<ReadOnlyDateInput />}
                                        required
                                    />
                                    {dateError && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                </div>
                            </div>
                            {dateError && <p className={`${style.validateError}`}>{errorDateMsg}</p>}
                        </div>
                    </div>
                    <div className={`${style.conBtn}`}>
                        <button onClick={() => { onClose(); resetForm(); }}>Close</button>
                        <button onClick={submitValidate} disabled={searchStatus === 'searching'}>
                            {searchStatus === 'searching' ? 'Searching' : 'Search'}
                        </button>
                    </div>

                    {showSearchOverlay && (
                        <div className={style.searchOverlay}>
                            {searchStatus === 'searching' && (
                                <div className={style.searchingPanel}>
                                    <span className={style.searchingSpinner} />
                                    <p>Searching</p>
                                </div>
                            )}

                            {searchStatus === 'success' && matchedPromotion && (
                                <div className={`${style.resultPanel} ${style.resultPanelIn}`}>
                                    <p className={style.resultTitle}>Find Your Promotion</p>

                                    <div className={style.searchSummary}>
                                        <span><IoInformationCircleOutline /></span>
                                        <p>IMEI-1: {maskIMEI(imeiInput)}</p>
                                        <span><FiCalendar /></span>
                                        <p>Purchase Date: {purchaseDateLabel}</p>
                                    </div>

                                    <div className={style.promotionResultCard}>
                                        <Image
                                            src={matchedPromotion.url}
                                            alt={matchedPromotion.title}
                                            width={300}
                                            height={300}
                                            quality={100}
                                            className={style.promotionResultImage}
                                        />
                                        <div className={style.promotionResultInfo}>
                                            <h3>{matchedPromotion.campaignTitle || matchedPromotion.title}</h3>
                                            <p>{matchedPromotion.subtitle}</p>
                                            <dl>
                                                <div>
                                                    <dt>Gift:</dt>
                                                    <dd>{matchedPromotion.gift || matchedPromotion.subtitle}</dd>
                                                </div>
                                                <div>
                                                    <dt>Valid:</dt>
                                                    <dd>{matchedPromotion.validFrom} - {matchedPromotion.validTo}</dd>
                                                </div>
                                            </dl>
                                            <div className={style.resultActions}>
                                                <Link href="/claim">Claim Now</Link>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="button" className={style.backButton} onClick={resetSearchInputs}>
                                        Back
                                    </button>
                                </div>
                            )}

                            {searchStatus === 'empty' && (
                                <div className={`${style.resultPanel} ${style.resultPanelIn}`}>
                                    <p className={style.resultTitle}>Find Your Promotion</p>

                                    <div className={style.searchSummary}>
                                        <span><IoInformationCircleOutline /></span>
                                        <p>IMEI-1: {maskIMEI(imeiInput)}</p>
                                        <span><FiCalendar /></span>
                                        <p>Purchase Date: {purchaseDateLabel}</p>
                                    </div>

                                    <div className={style.noPromotionCard}>
                                        <div className={style.noPromotionIcon}>
                                            <LuGift />
                                            <LuSearch />
                                        </div>
                                        <h3>No eligible promotion found</h3>
                                        <p>
                                            Please check the information you provided, or contact{' '}
                                            <strong><a href="mailto:service@oppomobile.nz">us</a></strong>
                                            {' '}for assistance.
                                        </p>
                                    </div>

                                    <p className={style.trackHint}>
                                        If you already submitted a claim, please use{' '}
                                        <button type="button" onClick={handleOpenTrack}>
                                            Track My Claim.
                                        </button>
                                    </p>

                                    <div className={style.emptyActions}>
                                        <button type="button" onClick={resetSearchInputs}>Back</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
