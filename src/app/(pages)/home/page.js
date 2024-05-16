'use client';

import { usePathname, useRouter } from "next/navigation";
import style from "./home.module.css";

export default function Home() {
    const pathname = usePathname();
    const router = useRouter();

    // Check if the current path is "/home"
    if (pathname === '/home') {
        router.push('/404');
    }

    return (
        <div className={`${style.oc_container} h-screen`}>
            <div className={`${style.main_banner}`}>
                welcome to OPPO Promotion
            </div>
        </div>
    )
}