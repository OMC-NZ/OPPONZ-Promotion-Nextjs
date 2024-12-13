import { useState, useEffect } from 'react';
import style from "../style.module.css";
import { FiCalendar } from "react-icons/fi";
import { PiQuestionBold } from "react-icons/pi";
import { GiCheckMark, GiCrossMark } from "react-icons/gi";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import useWindowSize from "@/hooks/useWindowSize";
import useIMEIValidation from "@/hooks/validations/useIMEIValidation";
import useDateValidation from "@/hooks/validations/useDateValidation";

export default function Redeem({ isVisible, onClose }) {
    const [imeiInput, setIMEIInput] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [popperStatus, setPopperStatus] = useState('bottom');
    const size = useWindowSize();
    const { imeiError, setIMEIError, errorIMEIMsg, validateIMEI } = useIMEIValidation();
    const { dateError, setDateError, errorDateMsg, validateDate } = useDateValidation();

    //临时声明一个
    const [imeiCorrect, setIMEICorrect] = useState(false);

    const maxDate = new Date();

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setDateError(false);
    };

    const handleIMEIInputChange = (event) => {
        setIMEIInput(event.target.value);
        setIMEIError(false);
    }

    const handleIMEIBlur = () => {
        validateIMEI(imeiInput, 'input');
    };

    const submitValidate = () => {
        validateIMEI(imeiInput, 'submit');
        validateDate(selectedDate);
    }


    useEffect(() => {
        if (size.width < 768 || size.width < size.height) {
            setPopperStatus('top');
        }
    }, [size.width, size.height]);

    if (!isVisible) return null;

    return (
        <>
            <div className={style.modalOverlay}>
                <div className={style.modal}>
                    <button className={style.closeButton} onClick={() => { onClose(); setIMEIInput(''); setSelectedDate(null); setIMEIError(false); setDateError(false); document.body.style.overflow = '';}}>
                        &times;
                    </button>
                    <p className={`${style.modalTitle}`}>Search a Promotion</p>
                    <div className={`${style.conForm}`}>
                        <div className={`${style.conInput}`}>
                            <label>What is your phone&apos;s IMEI-1?</label>
                            <div className={`${style.search} ${imeiError ? style.search_red : style.search_normal}`}>
                                <div className={`${style.search_box}`}>
                                    <span className={`${style.conIcon} ${style.conPiIcon}`}>
                                        <PiQuestionBold onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => hovered ? setHovered(false) : setHovered(true)} />
                                        <i className={`${style.tipText} ${hovered ? style.visible : ''}`}>
                                            Three ways to find the IMEI-1: <br />
                                            1. Dial *#06# on the keypad to retrieve.<br />
                                            2. Check the bottom of product packing box.<br />
                                            3. Go to [Settings] &gt; [About Phone] &gt; [Status] &gt; [IMEI-1].
                                        </i>
                                    </span>
                                    <input type="type" placeholder="Input an IMEI-1" onChange={handleIMEIInputChange} onBlur={handleIMEIBlur} required />
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
                                    <DatePicker wrapperClassName={`${style.datepicker}`} selected={selectedDate} onChange={handleDateChange} dateFormat="yyyy-MM-dd" placeholderText="Select a Date" maxDate={maxDate} popperPlacement={popperStatus} required />
                                    {dateError && <p style={{ color: 'red' }}><GiCrossMark /></p>}
                                </div>
                            </div>
                            {dateError && <p className={`${style.validateError}`}>{errorDateMsg}</p>}
                        </div>
                    </div>
                    <div className={`${style.conBtn}`}>
                        <button onClick={() => { onClose(); setIMEIInput(''); setSelectedDate(null); setIMEIError(false); setDateError(false); document.body.style.overflow = '';}}>Close</button>
                        <button onClick={submitValidate}>Search</button>
                    </div>
                </div>
            </div>
        </>
    )
}