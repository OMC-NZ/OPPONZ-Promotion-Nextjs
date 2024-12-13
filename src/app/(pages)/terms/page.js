import style from "./terms.module.css";

export const metadata = {
    title: 'OPPO NZ Promotions | Terms and Comditions'
}

export default function TermsAndConditions() {
    return (
        <div className={style.termsMain}>
            <div className={style.termsCenter}>
                <div className={style.termsTitle}>
                    <p>Terms and Conditions of OPPO NZ Promotion</p>
                </div>
                <div className={style.termsSection}>
                    <div className={style.termsSectionTitle}>I. Declaration</div>
                    <ul className={style.termsSectionContent}>
                        <li>All offers are provided by OPPO New Zealand Ltd of Level 10, 87 Albert Street, Auckland 1010 (OPPO).</li>
                        <li>You can contact OPPO on 0800 23 6776 between the hours of 10AM and 5PM (NZT) Monday to Friday or at service@oppomobile.nz.</li>
                        <li>By purchasing any model of OPPO through the specified cooperative you accept and agree to all terms and conditions of the promotion.</li>
                        <li>OPPO is not liable for any loss, damage or personal injury suffered or sustained as a result of, in connection with, or arising out of, this promotional offer.</li>
                        <li>OPPO reserves the right in their sole discretion to cancel, terminate, modify or suspend this promotional offer at any time for any reason.</li>
                    </ul>
                </div>
                <div className={style.termsSection}>
                    <div className={style.termsSectionTitle}>II. Redeem and Personal</div>
                    <ul className={style.termsSectionContent}>
                        <li>By purchasing an Eligible Product, you may submit a claim for the free gift. You may submit a claim for the free gift by visiting the website at Home Page, completing all requested information in the online redemption form, including providing your personal details (such as name, number and address), and submitting the completed redemption form together with the proof of purchase (scan or copy of receipt) and a screenshot of the &apos;about phone&apos; page from their newly purchased Eligible Product which clearly shows the IMEI of the Eligible Product.</li>
                        <li>You should allow up to twenty (20) working days for the delivery of the gift from the date you receive notification from OPPO that it has received your valid redemption form and proof of purchase and your claim has been accepted.</li>
                        <li>OPPO will collect, hold, use and disclose your personal information in accordance with its Privacy Policy available at https://www.oppo.com/nz/privacy/.</li>
                        <li>Without limiting the foregoing, you agree that OPPO may use and disclose your personal information for the purposes of conducting this promotional offer and supplying the gift.</li>
                        <li>Uploaded files must be in JPEG, JPG, PNG, or PDF format and less than 10MB in size.</li>
                        <li>Your contact information and the delivery range are limited to within New Zealand.</li>
                        <li>We accept only one delivery address, which can be either a residential or a business address.</li>
                    </ul>
                </div>
                <div className={style.termsSection}>
                    <div className={style.termsSectionTitle}>III. Available Purchaser</div>
                    <ul className={style.termsSectionContent}>
                        <li>This promotion is only available to New Zealand resident is aged 18 years and over at the time of sale of the Eligible Product, excluding business customers and employees of OPPO, employees of Participating Retailers and/or Agencies and their immediate family members.</li>
                        <li>This promotional offer is available to the original purchaser of the Eligible Product only and cannot be transferred to any other person, and it also cannot be exchanged for cash or any other products.</li>
                        <li>An individual may submit a maximum of one prize, and OPPO may at its sole discretion reject any second or subsequent claim for the prize.</li>
                    </ul>
                </div>
                <div className={style.termsSection}>
                    <div className={style.termsSectionTitle}>IV. Stock</div>
                    <ul className={style.termsSectionContent}>
                        <li>Stock for the free gift is limited and will be provided to the individuals that submit a valid and eligible claim while stocks last and in accordance with all terms.</li>
                        <li>Without limiting all terms, OPPO may cancel, terminate, modify or suspend this promotional offer at any time if all gifts have been claimed.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}