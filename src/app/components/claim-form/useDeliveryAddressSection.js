"use client";

import { useRef, useState } from "react";
import useClaimValidation from "@hooks/validations/useClaimValidation";

const ADDRESS_SUGGESTIONS = [
    { id: "addr-1", street: "123 Queen Street", suburb: "Auckland Central", city: "Auckland", postcode: "1010" },
    { id: "addr-2", street: "188 Queen Street", suburb: "Auckland Central", city: "Auckland", postcode: "1010" },
    { id: "addr-3", street: "205 Queen Street", suburb: "Auckland Central", city: "Auckland", postcode: "1010" },
    { id: "addr-4", street: "12 Lambton Quay", suburb: "Wellington Central", city: "Wellington", postcode: "6011" },
    { id: "addr-5", street: "55 Willis Street", suburb: "Wellington Central", city: "Wellington", postcode: "6011" },
    { id: "addr-6", street: "88 Hereford Street", suburb: "Christchurch Central", city: "Christchurch", postcode: "8011" },
    { id: "addr-7", street: "120 Riccarton Road", suburb: "Riccarton", city: "Christchurch", postcode: "8041" },
    { id: "addr-8", street: "21 George Street", suburb: "Dunedin Central", city: "Dunedin", postcode: "9016" },
    { id: "addr-9", street: "9 Grey Street", suburb: "Hamilton East", city: "Hamilton", postcode: "3216" },
    { id: "addr-10", street: "45 Devon Street East", suburb: "New Plymouth Central", city: "New Plymouth", postcode: "4310" },
    { id: "addr-11", street: "76 Cameron Road", suburb: "Tauranga", city: "Tauranga", postcode: "3110" },
    { id: "addr-12", street: "101 Marine Parade", suburb: "Napier South", city: "Napier", postcode: "4110" },
];

const ADDRESS_PAGE_SIZE = 10;

const updateValidationValue = (validation, nextValue) => {
    validation.handleChange({ target: { type: "text", value: nextValue } });
};

export default function useDeliveryAddressSection() {
    const [companyName, setCompanyName] = useState("");
    const [addressSuggestionPage, setAddressSuggestionPage] = useState(0);
    const [isAddressSuggestionsOpen, setIsAddressSuggestionsOpen] = useState(false);
    const address = useClaimValidation("street");
    const suburb = useClaimValidation("suburb");
    const city = useClaimValidation("city");
    const postcode = useClaimValidation("postcode");

    const addressRef = useRef(null);
    const suburbRef = useRef(null);
    const cityRef = useRef(null);
    const postcodeRef = useRef(null);

    const addressQuery = address.value.trim().toLowerCase();
    const addressSuggestions = addressQuery.length < 2
        ? []
        : ADDRESS_SUGGESTIONS.filter((suggestion) => (
            `${suggestion.street} ${suggestion.suburb} ${suggestion.city} ${suggestion.postcode}`
                .toLowerCase()
                .includes(addressQuery)
        ));
    const addressSuggestionTotalPages = Math.max(1, Math.ceil(addressSuggestions.length / ADDRESS_PAGE_SIZE));
    const safeAddressSuggestionPage = Math.min(addressSuggestionPage, addressSuggestionTotalPages - 1);
    const visibleAddressSuggestions = addressSuggestions.slice(
        safeAddressSuggestionPage * ADDRESS_PAGE_SIZE,
        (safeAddressSuggestionPage + 1) * ADDRESS_PAGE_SIZE
    );
    const showAddressSuggestions = isAddressSuggestionsOpen && visibleAddressSuggestions.length > 0;

    const handleAddressChange = (event) => {
        address.handleChange(event);
        updateValidationValue(suburb, "");
        updateValidationValue(city, "");
        updateValidationValue(postcode, "");
        setAddressSuggestionPage(0);
        setIsAddressSuggestionsOpen(true);
    };

    const handleAddressSelect = (suggestion) => {
        updateValidationValue(address, suggestion.street);
        updateValidationValue(suburb, suggestion.suburb);
        updateValidationValue(city, suggestion.city);
        updateValidationValue(postcode, suggestion.postcode);
        setIsAddressSuggestionsOpen(false);
    };

    const handleAddressBlur = () => {
        address.handleBlur();
        window.setTimeout(() => setIsAddressSuggestionsOpen(false), 120);
    };

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
            address: {
                validation: {
                    ...address,
                    handleChange: handleAddressChange,
                    handleBlur: handleAddressBlur,
                },
                fieldRef: addressRef,
                suggestions: visibleAddressSuggestions,
                suggestionsOpen: showAddressSuggestions,
                suggestionPage: safeAddressSuggestionPage,
                suggestionTotalPages: addressSuggestionTotalPages,
                onSelectSuggestion: handleAddressSelect,
                onPreviousSuggestionPage: () => setAddressSuggestionPage((currentPage) => Math.max(0, currentPage - 1)),
                onNextSuggestionPage: () => setAddressSuggestionPage((currentPage) => Math.min(addressSuggestionTotalPages - 1, currentPage + 1)),
                onFocus: () => setIsAddressSuggestionsOpen(addressSuggestions.length > 0),
            },
            company: { value: companyName, onChange: setCompanyName },
            suburb: { validation: suburb, fieldRef: suburbRef, disabled: true },
            city: { validation: city, fieldRef: cityRef, disabled: true },
            postcode: { validation: postcode, fieldRef: postcodeRef, disabled: true },
        },
        validate,
        getReviewData,
    };
}
