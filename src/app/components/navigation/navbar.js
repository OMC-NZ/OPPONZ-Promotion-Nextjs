"use client"

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from "next/link";
import style from "./navbar.module.css";
import LoadingModal from "@/app/components/public/loadingModal";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [scrollTo, setScrollTo] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleNavigation = (id) => {
        if (pathname === '/') {
            setScrollTo(id);
        } else {
            setLoading(true);
            localStorage.setItem('scrollTo', id);
            router.push('/');
        }
    };

    useEffect(() => {
        if (pathname === '/') {
            const storedScrollTo = localStorage.getItem('scrollTo');
            if (storedScrollTo) {
                setScrollTo(storedScrollTo);
                localStorage.removeItem('scrollTo');
            }
            setLoading(false);
        }

        if (scrollTo) {
            const element = document.getElementById(scrollTo);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                setScrollTo(null);
            }
        }

        if (loading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [pathname, scrollTo, loading]);

    return (
        <>
            <div className="max-lg:hidden relative flex justify-between items-center box-border border-b-[1px] border-solid border-[#ececec] h-full px-[64px] py-0">
                <div id="logo" className="mr-[12px] flex items-center">
                    <span className="mr-[26px]">
                        <Link href="https://www.oppo.com/nz/" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" width="85" height="22" viewBox="0 0 85 22" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10.0905 13.7856H10.0898H10.0888C5.80572 13.7403 3.03806 11.7032 3.03806 8.59604C3.03806 5.48888 5.80572 3.45175 10.0888 3.40651C14.3738 3.45175 17.1411 5.48888 17.1411 8.59604C17.1411 11.7032 14.3738 13.7403 10.0905 13.7856ZM10.2155 0.898183C10.2144 0.89832 10.1292 0.896816 10.0863 0.895996C10.0424 0.896543 9.95715 0.898183 9.95715 0.898183C4.09395 0.993718 0 4.1591 0 8.5961C0 13.0331 4.09395 16.1986 9.95578 16.294C9.95578 16.294 10.0424 16.2948 10.0851 16.2946C10.1299 16.295 10.2157 16.294 10.2157 16.294C16.0774 16.1986 20.1712 13.0331 20.1712 8.5961C20.1712 4.1591 16.0774 0.993718 10.2155 0.898183Z" fill="black" className="fill"></path> <path fillRule="evenodd" clipRule="evenodd" d="M74.9195 13.7856H74.9188H74.9177C70.6348 13.7403 67.8671 11.7032 67.8671 8.59604C67.8671 5.48888 70.6348 3.45175 74.9177 3.40651C79.2027 3.45175 81.9701 5.48888 81.9701 8.59604C81.9701 11.7032 79.2027 13.7403 74.9195 13.7856ZM75.0445 0.898183C75.0434 0.89832 74.9584 0.896816 74.9152 0.895996C74.8715 0.896543 74.7862 0.898183 74.7862 0.898183C68.923 0.993718 64.829 4.1591 64.829 8.5961C64.829 13.0331 68.923 16.1986 74.785 16.294C74.785 16.294 74.8715 16.2948 74.9141 16.2946C74.9591 16.295 75.0448 16.294 75.0448 16.294C80.9065 16.1986 85.0003 13.0331 85.0003 8.5961C85.0003 4.1591 80.9065 0.993718 75.0445 0.898183Z" fill="black" className="fill"></path> <path fillRule="evenodd" clipRule="evenodd" d="M53.3494 13.7856H53.3487H53.3477C49.0648 13.7403 46.2971 11.7032 46.2971 8.59604C46.2971 5.48888 49.0648 3.45175 53.3477 3.40651C57.6326 3.45175 60.4001 5.48888 60.4001 8.59604C60.4001 11.7032 57.6326 13.7403 53.3494 13.7856ZM53.4745 0.898183C53.4734 0.89832 53.3884 0.896816 53.3452 0.895996C53.3015 0.896543 53.2162 0.898183 53.2162 0.898183C50.423 0.943695 48.032 1.68638 46.2932 2.93081V1.61846H43.2591V21.1043H46.2932V14.2617C48.0317 15.506 50.4223 16.2486 53.2149 16.294C53.2151 16.2942 53.3015 16.2948 53.344 16.2946C53.3891 16.295 53.4747 16.294 53.4747 16.294C59.3364 16.1986 63.4303 13.0331 63.4303 8.5961C63.4303 4.1591 59.3364 0.993718 53.4745 0.898183Z" fill="black" className="fill"></path> <path fillRule="evenodd" clipRule="evenodd" d="M31.7169 13.7856H31.7162H31.7154C27.4323 13.7403 24.6646 11.7032 24.6646 8.59604C24.6646 5.48888 27.4323 3.45175 31.7154 3.40651C36.0003 3.45175 38.7677 5.48888 38.7677 8.59604C38.7677 11.7032 36.0003 13.7403 31.7169 13.7856ZM31.8472 0.898183C31.8459 0.89832 31.7609 0.896816 31.7179 0.895996C31.674 0.896543 31.5887 0.898183 31.5887 0.898183C28.7955 0.943695 26.4045 1.68638 24.6657 2.93081V1.61846H21.6317V21.1043H24.6657V14.2617C26.4044 15.506 28.7949 16.2486 31.5873 16.294C31.5873 16.294 31.674 16.2948 31.7166 16.2946C31.7616 16.295 31.8473 16.294 31.8473 16.294C37.709 16.1986 41.8028 13.0331 41.8028 8.5961C41.8028 4.1591 37.709 0.993718 31.8472 0.898183Z" fill="black" className="fill"></path>
                            </svg>
                        </Link>
                    </span>
                    <ul className="flex">
                        <li className="m-0 p-0 list-none font-normal">
                            <span className={style.item_span}>
                                <Link href="/">Home</Link>
                            </span>
                        </li>
                        <li className="m-0 p-0 list-none font-normal">
                            <span className={style.item_span}>
                                <button onClick={() => handleNavigation('monthlyPromo')}>Monthly Promotions</button>
                            </span>
                        </li>
                        <li className="m-0 p-0 list-none font-normal">
                            <span className={style.item_span}>
                                <button onClick={() => handleNavigation('currentEvs')}>Current Events</button>
                            </span>
                        </li>
                        <li className="m-0 p-0 list-none font-normal">
                            <span className={style.item_span}>
                                <button onClick={() => handleNavigation('faQues')}>FAQ</button>
                            </span>
                        </li>
                        <li className="m-0 p-0 list-none font-normal">
                            <span className={style.item_span}>
                                <Link href="https://shop.oppomobile.nz/" target="_blank">Shop Now</Link>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            {loading && (<LoadingModal />)}
        </>
    );
};