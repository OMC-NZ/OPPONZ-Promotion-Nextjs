'use client';

import { usePathname } from "next/navigation";
import ErrorPage from 'next/error';
import style from "./home.module.css";


export default function Home() {
    const pathname = usePathname();

    // Check if the current path is "/home"
    if (pathname === '/home') {
        return (<ErrorPage statusCode={404} />);
    }

    return (
        <div className={`${style.oc_container} h-screen`}>
            Welcome to Home Page
        </div>

    )
}