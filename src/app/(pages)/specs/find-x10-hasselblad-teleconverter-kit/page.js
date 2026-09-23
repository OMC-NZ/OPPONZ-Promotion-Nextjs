import Image from "next/image";
import style from "./style.module.css";
import { FaArrowRight, FaRegHandshake } from "react-icons/fa";
import { FiCrosshair } from "react-icons/fi";
import { GiTheaterCurtains } from "react-icons/gi";

export const metadata = {
  title: "Find X10 Hasselblad Teleconverter Kit | OPPO NZ Promotions",
  description: "Find X10 Hasselblad Teleconverter Kit specifications.",
};

export default function FindX10HasselbladTeleconverterKitPage() {
  return (
    <div className={style.specPage}>
      <section className={style.banner} aria-label="Find X10 Hasselblad Teleconverter Kit">
        <div className={style.bannerInner}>
          <div className={style.copyBlock}>
            <h1>
              Find X10 Pro Max
              <br />
              Hasselblad Teleconverter Kit
            </h1>
            <p className={style.lead}>Bring the stage closer.</p>
            <p className={style.description}>
              A professional imaging expansion system built for Find X10 Pro Max.
              Co-engineered and finely tuned for a steadier telephoto live-stage
              shooting experience.
            </p>

            <a className={style.buyButton} href="#buy-now" aria-label="Buy now">
              <span>BUY NOW</span>
              <FaArrowRight aria-hidden="true" />
            </a>
          </div>

          <Image
            className={style.productImage}
            src="/imgs/events/findx10-teleconverter/teleconverter.webp"
            alt="Find X10 Pro Max with Hasselblad teleconverter kit"
            width={6123}
            height={4082}
            priority
          />

          <div className={style.tagline} aria-hidden="true">
            <span>A closer</span>
            <span>stage for a brighter</span>
            <span>tomorrow</span>
          </div>

          <div className={style.features} aria-label="Key features">
            <div className={style.feature}>
              <FaRegHandshake className={style.featureIcon} aria-hidden="true" />
              <strong>Co-Engineered</strong>
              <span>OPPO x Hasselblad</span>
            </div>
            <div className={style.feature}>
              <FiCrosshair className={style.featureIcon} aria-hidden="true" />
              <strong>Dual Stabilization</strong>
              <span>Steadier telephoto shooting</span>
            </div>
            <div className={style.feature}>
              <GiTheaterCurtains className={style.featureIcon} aria-hidden="true" />
              <strong>Stage-Tuned</strong>
              <span>Optimized for live performances</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
