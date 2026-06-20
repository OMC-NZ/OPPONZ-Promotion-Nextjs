import ClaimField from "./ClaimField";
import FormSectionCard from "./FormSectionCard";
import style from "./style.module.css";

export default function YourDetailsCard({ fields }) {
    const { firstName, lastName, email, mobile } = fields;

    return (
        <FormSectionCard title="Your Details">
            <div className={style.twoColumnGrid}>
                <ClaimField label="First Name *" {...firstName} type="name" />
                <ClaimField label="Last Name *" {...lastName} type="name" />
                <ClaimField label="Email Address *" {...email} type="email" />
                <ClaimField label="Mobile Number *" {...mobile} type="phone" prefix="+64" inputMode="numeric" />
            </div>
        </FormSectionCard>
    );
}
