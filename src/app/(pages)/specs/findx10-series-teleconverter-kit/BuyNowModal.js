"use client";

import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import style from "./style.module.css";

export default function BuyNowModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className={style.buyButton}
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        <span>BUY NOW</span>
        <FaArrowRight aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={style.buyModalOverlay} role="presentation">
          <div
            className={style.buyModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="findx10-buy-now-title"
          >
            <button
              type="button"
              className={style.buyModalClose}
              aria-label="Close buy now modal"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
            <h2 id="findx10-buy-now-title" className={style.buyModalTitle}>
              Buy Now
            </h2>
          </div>
        </div>
      )}
    </>
  );
}
