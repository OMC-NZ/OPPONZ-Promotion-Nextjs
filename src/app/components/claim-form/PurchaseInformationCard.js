import ClaimField from "./ClaimField";
import FormSectionCard from "./FormSectionCard";
import UploadField from "./UploadField";
import style from "./style.module.css";

export default function PurchaseInformationCard({ fields }) {
    const { invoice, imeiScreenshot, proofOfPurchase } = fields;

    return (
        <FormSectionCard title="Purchase Information">
            <div className={style.singleColumnGrid}>
                <ClaimField label="Invoice Number *" {...invoice} type="text" />
            </div>
            <div className={style.twoColumnGrid}>
                <UploadField label="IMEI-1 Screenshot *" inputId="receipt" {...imeiScreenshot} />
                <UploadField label="Proof of Purchase *" inputId="screenshot" {...proofOfPurchase} />
            </div>
        </FormSectionCard>
    );
}
