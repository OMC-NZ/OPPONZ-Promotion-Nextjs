"use client"

import { useState } from "react";
import Image from "next/image";
import Link from 'next/link';
import style from "./style.module.css";
import DetailsModal from "./modal/index";

const imgs = {
    alt: 'temp banner',
    url: '/temporary/claimBanners/1b88a02090abbdb2b6af7cd64088157.jpg'
}

const items = {

}

export default function Claim() {
    {/* <div className={style.}> */ }
    const [modalShow, setModalShow] = useState(false);

    const handleModalOpen = () => {
        setModalShow(true);
        document.body.style.overflow = 'hidden';
    }

    return (
        <>
            <title>Claim | OPPO NZ Promotions</title>
            <div className={style.claim_main}>
                <div className={style.claim_banner}>
                    <Image src={imgs.url} alt={imgs.alt} width={1920} height={480} quality={50} priority={true} className={style.banner} />
                </div>
                <div className={style.claim_content}>
                    <div className={style.claim_title}>
                        <p className={style.title}>Claim Your Gift</p>
                        <span>Please note that fields marked with <span style={{ color: '#BB0929', verticalAlign: 'middle' }}>*</span> are mandatory.</span>
                        <span style={{ fontSize: '14px' }}>To learn more <button className={style.specWords} onClick={handleModalOpen}>Details</button> and <Link className={style.specWords} href="/terms" target="_blank">Terms</Link>.</span>
                    </div>
                    <div className={style.claim_form}>
                        <div className={style.form_container}>werwerwer</div>
                    </div>
                </div>
            </div>
            {modalShow && (<DetailsModal setModalShow={setModalShow} />)}
        </>
    )
}