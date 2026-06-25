"use client"

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from "next/link";
import style from "./footer_main.module.css";
import LoadingModal from "@app/components/public/loadingModal";
import usePromotionContent from "@hooks/usePromotionContent";

const emptyPromotionContent = {
  monthly: { items: [], loading: false },
  currentEvents: { items: [], loading: false },
};

export default function FooterNav() {
  const pathname = usePathname();

  if (pathname === "/terms") {
    return <FooterNavContent pathname={pathname} {...emptyPromotionContent} />;
  }

  return <FooterNavWithPromotionContent pathname={pathname} />;
}

function FooterNavWithPromotionContent({ pathname }) {
  const promotionContent = usePromotionContent();

  return <FooterNavContent pathname={pathname} {...promotionContent} />;
}

function FooterNavContent({ pathname, monthly, currentEvents }) {
  const router = useRouter();
  const [scrollTo, setScrollTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const showMonthlyPromotions = monthly.loading || monthly.items.length > 0;
  const showCurrentEvents = !currentEvents.loading && currentEvents.items.length > 0;

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
        <ul className={`${style.footer_nav_ul}`}>
          <li className="min-w-[169px] mb-[40px]">
            <Link href="/" className={`${style.ft_body_2_1}`}>Home</Link>
          </li>

          {showMonthlyPromotions && (
            <li className="min-w-[169px] mb-[40px]">
              <span className={`${style.ft_body_2_1}`}>
                <button onClick={() => handleNavigation('monthlyPromo')}>Monthly Promotions</button>
              </span>
            </li>
          )}

          {showCurrentEvents && (
            <li className="min-w-[169px] mb-[40px]">
              <span className={`${style.ft_body_2_1}`}>
                <button onClick={() => handleNavigation('currentEvs')}>Current Events</button>
              </span>
            </li>
          )}
          <li className="min-w-[169px] mb-[40px]">
            <span className={`${style.ft_body_2_1}`}>
              <button onClick={() => handleNavigation('faQues')}>FAQ</button>
            </span>
          </li>
          <li className="min-w-[169px] mb-[40px]">
            <Link href="https://oppostore.co.nz/" target="_blank" className={`${style.ft_body_2_1}`}>Shop Now</Link>
          </li>
        </ul>
      </nav>
      {loading && (<LoadingModal />)}
    </>
  );
}
