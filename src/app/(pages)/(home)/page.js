import style from "./home.module.css";
import Noname from "./components/noname";
import Process from "./components/process";
import MonthlyPromotions from "./components/monthly";
import CurrentEvents from "./components/events";
import FAQ from "./components/faq";

export const metadata = {
    title: 'OPPO NZ Promotions'
}

export default function Home() {
    return (
        <div className={style.oc_container}>
            <Noname />
            <div className={style.oc_subcontents}>
                <Process />
                <MonthlyPromotions />
                <CurrentEvents />
                <FAQ />
            </div>
        </div>
    )
}