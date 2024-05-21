import style from "./home.module.css";
import Noname from "./components/noname";

export const metadata = {
    title: 'OPPO NZ Promotions'
}

export default function Home() {
    return (
        <>
            <div className={`${style.oc_container}`}>
                <Noname />
            </div>
        </>

    )
}