"use client"

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from "next/link";
import style from "./footer_main.module.css";
import LoadingModal from "@/app/components/public/loadingModal";

export default function FooterNav() {
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
  }, [pathname, scrollTo]);

  return (
    <>
      <nav className={`${style.ft_body_3_1} ${style.bottom_line}`}>
        <ul className={`flex flex-wrap justify-between ${style.footer_nav_ul}`}>
          <li className="min-w-[169px] mb-[40px]">
            <Link href="/" className={`${style.ft_body_2_1}`}>Home</Link>
          </li>
          <li className="min-w-[169px] mb-[40px]">
            <span className={`${style.ft_body_2_1}`}>
              <button onClick={() => handleNavigation('monthlyPromo')}>Monthly Promotions</button>
            </span>
          </li>
          <li className="min-w-[169px] mb-[40px]">
            <span className={`${style.ft_body_2_1}`}>
              <button onClick={() => handleNavigation('currentEvs')}>Current Events</button>
            </span>
          </li>
          <li className="min-w-[169px] mb-[40px]">
            <span className={`${style.ft_body_2_1}`}>
              <button onClick={() => handleNavigation('faQues')}>FAQ</button>
            </span>
          </li>
          <li className="min-w-[169px] mb-[40px]">
            <Link href="https://shop.oppomobile.nz/" target="_blank" className={`${style.ft_body_2_1}`}>Shop Now</Link>
          </li>
        </ul>
      </nav>
      {loading && (<LoadingModal />)}
    </>
  );
}