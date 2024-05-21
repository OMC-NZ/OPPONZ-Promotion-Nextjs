import { useState, useEffect } from 'react';
import style from "../style.module.css";
import { FiCalendar } from "react-icons/fi";
import { PiQuestionBold } from "react-icons/pi";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import useWindowSize from "@/hooks/useWindowSize";

export default function Redeem({ isVisible, onClose }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [popperStatus, setPopperStatus] = useState('bottom');
    const size = useWindowSize();

    const maxDate = new Date();

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        if (size.width < 768 || size.width < size.height) {
            setPopperStatus('top');
        } else {
            setPopperStatus('bottom');
        }
    }, [size.width, size.height]);

    if (!isVisible) return null;

    return (
        <>
            <div className={style.modalOverlay}>
                <div className={style.modal}>
                    <button className={style.closeButton} onClick={onClose}>
                        &times;
                    </button>
                    <p className={`${style.modalTitle}`}>Search a Promotion</p>
                    <div className={`${style.conForm}`}>
                        <div className={`${style.conInput}`}>
                            <label>What is your phone&apos;s IMEI-1?</label>
                            <div className={`${style.search}`}>
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
                                    <input type="type" placeholder="Type the IMEI-1" required />

                                </div>
                            </div>

                        </div>
                        <div className={`${style.conInput}`}>
                            <label>When did you purchase the device?</label>
                            <div className={`${style.search}`}>
                                <div className={`${style.search_box}`}>
                                    <span className={`${style.conIcon}`}>
                                        <FiCalendar />
                                    </span>
                                    <DatePicker wrapperClassName={`${style.datepicker}`} selected={selectedDate} onChange={handleDateChange} dateFormat="yyyy-MM-dd" placeholderText="Select a date" maxDate={maxDate} popperPlacement={popperStatus} required />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.conBtn}`}>
                        <button onClick={onClose}>Close</button>
                        <button>Search</button>
                    </div>
                </div>
            </div>
        </>
    )
}