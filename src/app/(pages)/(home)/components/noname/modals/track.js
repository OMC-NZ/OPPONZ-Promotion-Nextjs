import React from 'react';
import style from "../style.module.css";

export default function Track({ isVisible, onClose }) {
    if (!isVisible) return null;

    return (
        <>
            <div className={style.modalOverlay}>
                <div className={style.modal}>
                    <button className={style.closeButton} onClick={onClose}>
                        &times;
                    </button>
                    <h2>Track Title</h2>
                        <p>This is the modal content.</p>
                </div>
            </div>
        </>
    )
}