"use client";
import style from "./modal.module.css";

export default function DetailsModal({ promotion, setModalShow }) {
    const handleModalClose = () => {
        setModalShow(false);
        document.body.style.overflowY = 'auto';
    }
    return (
        <>
            <div className={style.modal_overlay}>
                <div className={style.modal_content}>
                    <div className={style.modal_title}>
                        <p>{promotion.title}</p>
                    </div>
                    <div className={style.modal_text}>
                        <p>{promotion.description || promotion.gift || promotion.subtitle}</p>
                    </div>
                    <div className={style.modal_close}>
                        <button className={style.close_button} onClick={handleModalClose}>Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}
