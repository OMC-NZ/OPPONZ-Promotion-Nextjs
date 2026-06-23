import ClaimField from "./ClaimField";
import FormSectionCard from "./FormSectionCard";
import style from "./style.module.css";

export default function DeliveryAddressCard({ fields }) {
    const { address, company, suburb, city, postcode } = fields;

    return (
        <FormSectionCard title="Delivery Address">
            <div className={style.singleColumnGrid}>
                <ClaimField
                    label="Address Line *"
                    {...address}
                    helpText="New Zealand delivery addresses only."
                />
                <ClaimField
                    label="Company Name (Optional)"
                    {...company}
                    helpText="If your address is a business address, enter the company name here."
                />
            </div>
            <div className={style.threeColumnGrid}>
                <ClaimField label="Suburb *" {...suburb} />
                <ClaimField label="City *" {...city} />
                <ClaimField label="Postcode *" {...postcode} type="postcode" />
            </div>
        </FormSectionCard>
    );
}
