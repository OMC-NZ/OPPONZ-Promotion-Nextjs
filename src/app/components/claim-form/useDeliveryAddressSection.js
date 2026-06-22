"use client";

import { useRef, useState } from "react";
import useClaimValidation from "@hooks/validations/useClaimValidation";

export default function useDeliveryAddressSection() {
    const [companyName, setCompanyName] = useState("");
    const address = useClaimValidation("street");
    const suburb = useClaimValidation("suburb");
    const city = useClaimValidation("city");
    const postcode = useClaimValidation("postcode");

    const addressRef = useRef(null);
    const suburbRef = useRef(null);
    const cityRef = useRef(null);
    const postcodeRef = useRef(null);

    const validate = () => {
        const results = [
            [address.validate(address.value), addressRef],
            [suburb.validate(suburb.value), suburbRef],
            [city.validate(city.value), cityRef],
            [postcode.validate(postcode.value), postcodeRef],
        ];
        const firstInvalid = results.find(([isValid]) => !isValid);

        return {
            isValid: !firstInvalid,
            firstInvalidRef: firstInvalid?.[1] || null,
        };
    };

    const getReviewData = () => ({
        addressLines: [
            companyName ? `Company Name: ${companyName}` : "",
            address.value,
            suburb.value,
            `${city.value} ${postcode.value}`.trim(),
            "New Zealand",
        ].filter(Boolean),
    });

    return {
        fields: {
            address: { validation: address, fieldRef: addressRef },
            company: { value: companyName, onChange: setCompanyName },
            suburb: { validation: suburb, fieldRef: suburbRef },
            city: { validation: city, fieldRef: cityRef },
            postcode: { validation: postcode, fieldRef: postcodeRef },
        },
        validate,
        getReviewData,
    };
}
