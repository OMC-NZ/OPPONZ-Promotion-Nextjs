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