import style from "./modal.module.css";

export default function DetailsModal({ setModalShow }) {
    const handleModalClose = () => {
        setModalShow(false);
        document.body.style.overflow = 'auto';
    }
    return (
        <>
            <div className={style.modal_overlay}>
                <div className={style.modal_content}>
                    <div className={style.modal_title}>
                        <p>OPPO Enco Air3 Pro for OPPO A98</p>
                    </div>
                    <div className={style.modal_text}>
                        <p>Prize: one (1) x OPPO Enco Air3 Pro White</p>
                        <p>This offer applies to during the period commencing:</p>
                        <ul>
                            <li>Harvey Norman/Heathcote/JB HIFI/Mighty Ape/Noel Leeming/PB Tech/Smith City - From 3rd July 2024 to 31st July 2024.</li>
                            <li>OneNZ - From 1st July 2024 to 31st July 2024.</li>
                        </ul>
                    </div>
                    <div className={style.modal_close}>
                        <button className={style.close_button} onClick={handleModalClose}>Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}