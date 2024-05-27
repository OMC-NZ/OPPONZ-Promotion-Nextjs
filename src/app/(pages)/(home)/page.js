import style from "./home.module.css";
import Noname from "./components/noname";
import Process from "./components/process";
import CurrentPromotions from "./components/current";

export const metadata = {
    title: 'OPPO NZ Promotions'
}

export default function Home() {
    return (
        <div className={style.oc_container}>
            <Noname />
            <div className={style.oc_subcontents}>
                <Process />
                <CurrentPromotions />
            </div>
        </div>
    )
}