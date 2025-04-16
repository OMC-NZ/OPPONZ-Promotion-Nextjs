"use client"
import FAQ from "./components/faq";
import style from "./home.module.css";
import Noname from "./components/noname";
import Process from "./components/process";
import MonthlyPromotions from "./components/monthly";
import CurrentEvents from "./components/currentevents";

export default function Home() {
    return (
        <>
            <title>OPPO NZ Promotions</title>
            <div className={style.oc_container}>
                <Noname />
                <svg viewBox="0 0 300 100" preserveAspectRatio="none" className={`hidden md:block ${style.top_radian}`}>
                    <path d="M0,75 Q150,0 300,75 L300,150 L0,150 Z" fill="white" />
                </svg>
                <div className={style.oc_subcontents}>
                    <Process />
                    <div id="monthlyPromo">
                        <MonthlyPromotions />
                    </div>
                    <div id="currentEvs">
                        <CurrentEvents />
                    </div>
                    <div id="faQues">
                        <FAQ />
                    </div>
                </div>
            </div>
        </>
    )
}