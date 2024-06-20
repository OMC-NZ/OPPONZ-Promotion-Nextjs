import style from "./home.module.css";
import Noname from "./components/noname";
import Process from "./components/process";
import MonthlyPromotions from "./components/monthly";
import CurrentEvents from "./components/currentevents";
import FAQ from "./components/faq";

export const metadata = {
    title: 'OPPO NZ Promotions'
}

export default function Home() {
    return (
        <>
            <div className={style.oc_container}>
                <Noname />
                <div className={style.oc_subcontents}>
                    <Process />
                    <MonthlyPromotions id="monthlyPromo" />
                    <CurrentEvents id="currentEvs" />
                    <FAQ id="faQues" />
                </div>
            </div>
        </>
    )
}