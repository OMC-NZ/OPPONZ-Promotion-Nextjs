import style from "./home/home.module.css";
import Head from 'next/head';

export default function Home() {
    return (
        <div className={`${style.oc_container} h-screen`}>
            <Head>
                <title>OPPO NZ Promotions</title>
            </Head>
            <div className={`${style.main_banner}`}>
                welcome to OPPO Promotion
            </div>
        </div>
    )
}