import React from 'react';
import Image from 'next/image';
import Link from "next/link";
import style from './not-found.module.css';

export const metadata = {
  title: '404 | OPPO NZ Promotions',
}

export default function Custom404() {
  return (
    <section className={`${style.oppo_error_page_container}`}>
      <div className={`${style.responsive_layout}`}>
        <Image src="/imgs/404.png" width={550} height={240} alt="404" className={`${style.oppo_error_page_container_img}`} />
        <div className={`${style.oppo_error_page_container_text}`}>The page you&apos;re looking for can&apos;t be found.</div>
        <div className={`${style.back_button}`}>
          <Link href="/" className={`${style.back_button_content}`} >Back to Home</Link>
        </div>

      </div>
    </section>
  );
};