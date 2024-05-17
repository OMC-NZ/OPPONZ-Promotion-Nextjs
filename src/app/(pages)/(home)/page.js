import style from "./home.module.css";
import Image from "next/image";

export const metadata = {
    title: 'OPPO NZ Promotions'
}

export default function Home() {
    return (
        <>
            <div className={`${style.oc_container}`}>
                <div className={`${style.dark_overlay}`}></div>
                <picture className={`${style.main_banner}`}>
                    <Image src="/imgs/imagine-if_5120-1280.jpg" alt="Banner" layout="fill" className={`${style.lazyloaded}`}></Image>
                </picture>
                <div className={`${style.content_container} ${style.content_center} ${style.responsive_layout}`}>
                    <div className={`${style.top_layout}`}>
                        <div className={`${style.ft_headline}`}>Welcome to OPPO Promotions</div>
                        <div className={`${style.ft_subtitle}`}>Gift with Purchase Redemption Process</div>
                    </div>
                </div>
            </div>
        </>

    )
}