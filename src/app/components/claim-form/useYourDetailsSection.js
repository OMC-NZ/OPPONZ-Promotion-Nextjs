"use client";

import { useRef } from "react";
import useClaimValidation from "@hooks/validations/useClaimValidation";

export default function useYourDetailsSection() {
    const firstName = useClaimValidation("name");
    const lastName = useClaimValidation("name");
    const email = useClaimValidation("email");
    const mobile = useClaimValidation("phone");

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const mobileRef = useRef(null);

    const validate = () => {
        const results = [
            [firstName.validate(firstName.value), firstNameRef],
            [lastName.validate(lastName.value), lastNameRef],
            [email.validate(email.value), emailRef],
            [mobile.validate(mobile.value), mobileRef],
        ];
        const firstInvalid = results.find(([isValid]) => !isValid);

        return {
            isValid: !firstInvalid,
            firstInvalidRef: firstInvalid?.[1] || null,
        };
    };

    const getReviewData = () => ({
        firstName: firstName.value,
        lastName: lastName.value,
        fullName: `${firstName.value} ${lastName.value}`.trim(),
        contact: mobile.value,
        mobileNumber: mobile.value ? `+64 ${mobile.value}` : "",
        email: email.value,
    });

    return {
        fields: {
            firstName: { validation: firstName, fieldRef: firstNameRef },
            lastName: { validation: lastName, fieldRef: lastNameRef },
            email: { validation: email, fieldRef: emailRef },
            mobile: { validation: mobile, fieldRef: mobileRef },
        },
        validate,
        getReviewData,
    };
}
