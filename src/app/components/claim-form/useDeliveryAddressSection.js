"use client";

import { useRef, useState } from "react";
import useClaimValidation from "@hooks/validations/useClaimValidation";
import useRecaptchaAction from "@hooks/useRecaptchaAction";
import useSearchStreet from "@hooks/useSearchStreet";
import useWindowSize from "@hooks/useWindowSize";

const getAddressPageSize = (width) => {
    if (width && width < 480) return 4;
    if (width && width < 768) return 5;
    if (width && width <= 1366) return 6;
    return 7;
};

const displayValue = (value) => {
    if (value === null || value === undefined || value === "") return "";
    return String(value).trim();
};

const normalizeSpaces = (value) => displayValue(value).replace(/\s+/g, " ").replace(/\s*,\s*/g, ", ");

const capitalizeWords = (value) => normalizeSpaces(value).replace(/\b([A-Za-zĀāĒēĪīŌōŪū])([A-Za-zĀāĒēĪīŌōŪū'-]*)/g, (match, firstLetter, rest) => (
    `${firstLetter.toUpperCase()}${rest}`
));

const normalizePostcode = (value) => displayValue(value).replace(/\D/g, "");
const isValidAddressSearchText = (value) => /^[\x20-\x7E]+$/.test(value);
const hasAddressSearchLetterAndNumber = (value) => /[A-Za-z]/.test(value) && /\d/.test(value);
const ADDRESS_SEARCH_INPUT_ERROR = "Please enter a valid address search";

const joinExisting = (parts) => parts.map(displayValue).filter(Boolean).join(" ");

const formatDeliveryAddressLine = (detail) => {
    const unitLine = joinExisting([
        detail.BoxBagType,
        detail.BoxBagNumber,
        detail.UnitType,
        detail.UnitValue,
    ]);
    const unitLineWithComma = displayValue(detail.UnitValue) && unitLine ? `${unitLine},` : unitLine;
    const streetNumber = joinExisting([detail.StreetNumber, detail.StreetAlpha]).replace(/\s+/g, "");
    const streetLine = joinExisting([
        streetNumber,
        detail.RoadName,
        detail.RoadTypeName,
        detail.RoadSuffixName,
    ]);

    return joinExisting([unitLineWithComma, streetLine]);
};

const formatAddressDetail = (detail) => ({
    addressLine: capitalizeWords(formatDeliveryAddressLine(detail)),
    suburb: capitalizeWords(detail.Suburb) || capitalizeWords(detail.Lobby),
    city: capitalizeWords(joinExisting([detail.CityTown, detail.RuralDelivery])),
    postcode: normalizePostcode(detail.Postcode),
});

const getAddressDetailFromResponse = (result) => {
    if (Array.isArray(result?.addresses)) return result.addresses[0] || null;
    if (result?.addresses && typeof result.addresses === "object") return result.addresses;
    if (Array.isArray(result?.address)) return result.address[0] || null;
    if (result?.address && typeof result.address === "object") return result.address;
    return null;
};

const fetchAddressDetail = async (dpid, recaptcha) => {
    const response = await fetch(`/api/backend/nzpost/address/autocomplete?dpid=${encodeURIComponent(dpid)}`, {
        headers: {
            Accept: "application/json",
            ...(recaptcha?.token ? { "x-recaptcha-token": recaptcha.token } : {}),
            ...(recaptcha?.action ? { "x-recaptcha-action": recaptcha.action } : {}),
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Unable to load address detail");
    }

    const result = await response.json();
    const detail = getAddressDetailFromResponse(result);

    if (!detail) {
        throw new Error("Address detail was empty");
    }

    return formatAddressDetail(detail);
};

const updateValidationValue = (validation, nextValue) => {
    validation.handleChange({ target: { type: "text", value: nextValue } });
};

export default function useDeliveryAddressSection() {
    const [companyName, setCompanyName] = useState("");
    const [addressSearchValue, setAddressSearchValue] = useState("");
    const [addressSearchError, setAddressSearchError] = useState("");
    const [isAddressSearchLocked, setIsAddressSearchLocked] = useState(false);
    const [selectedAddressDpid, setSelectedAddressDpid] = useState("");
    const [addressSuggestionPage, setAddressSuggestionPage] = useState(0);
    const [isAddressSuggestionsOpen, setIsAddressSuggestionsOpen] = useState(false);
    const street = useClaimValidation("street");
    const suburb = useClaimValidation("suburb");
    const city = useClaimValidation("city");
    const postcode = useClaimValidation("postcode");
    const size = useWindowSize();
    const verifyRecaptcha = useRecaptchaAction();

    const searchRef = useRef(null);
    const addressRef = useRef(null);
    const suburbRef = useRef(null);
    const cityRef = useRef(null);
    const postcodeRef = useRef(null);
    const addressDetailRequestRef = useRef(0);

    const addressQuery = addressSearchValue.trim();
    const addressQueryLength = addressQuery.replace(/\s+/g, "").length;
    const {
        data: addressSuggestions,
        loading: isSearchingAddress,
        search: searchAddresses,
        clear: clearAddressSuggestions,
    } = useSearchStreet();
    const addressPageSize = getAddressPageSize(size.width);
    const addressSuggestionTotalPages = Math.max(1, Math.ceil(addressSuggestions.length / addressPageSize));
    const safeAddressSuggestionPage = Math.min(addressSuggestionPage, addressSuggestionTotalPages - 1);
    const visibleAddressSuggestions = addressSuggestions.slice(
        safeAddressSuggestionPage * addressPageSize,
        (safeAddressSuggestionPage + 1) * addressPageSize
    );
    const showAddressSuggestions = isAddressSuggestionsOpen && visibleAddressSuggestions.length > 0;

    const handleAddressSearchChange = (nextValue) => {
        addressDetailRequestRef.current += 1;
        setAddressSearchValue(nextValue);
        setAddressSearchError("");
        setIsAddressSearchLocked(false);
        setSelectedAddressDpid("");
        clearAddressSuggestions();
        setAddressSuggestionPage(0);
        setIsAddressSuggestionsOpen(false);
    };

    const handleAddressSearch = async () => {
        if (isSearchingAddress || isAddressSearchLocked) return;

        if (!addressQuery) {
            setAddressSearchError(ADDRESS_SEARCH_INPUT_ERROR);
            setIsAddressSearchLocked(false);
            clearAddressSuggestions();
            setIsAddressSuggestionsOpen(false);
            return;
        }

        if (addressQueryLength < 5) {
            setAddressSearchError(ADDRESS_SEARCH_INPUT_ERROR);
            setIsAddressSearchLocked(false);
            clearAddressSuggestions();
            setIsAddressSuggestionsOpen(false);
            return;
        }

        if (!isValidAddressSearchText(addressQuery)) {
            setAddressSearchError(ADDRESS_SEARCH_INPUT_ERROR);
            setIsAddressSearchLocked(false);
            clearAddressSuggestions();
            setIsAddressSuggestionsOpen(false);
            return;
        }

        if (!hasAddressSearchLetterAndNumber(addressQuery)) {
            setAddressSearchError(ADDRESS_SEARCH_INPUT_ERROR);
            setIsAddressSearchLocked(false);
            clearAddressSuggestions();
            setIsAddressSuggestionsOpen(false);
            return;
        }

        setAddressSearchError("");
        setIsAddressSearchLocked(true);
        setAddressSuggestionPage(0);
        setIsAddressSuggestionsOpen(false);
        const result = await searchAddresses(addressQuery);

        if (result.error) {
            setAddressSearchError("Unable to search address");
            setIsAddressSearchLocked(false);
            setIsAddressSuggestionsOpen(false);
            return;
        }

        if (result.addresses.length === 0) {
            setAddressSearchError("No matching address found");
            setIsAddressSearchLocked(false);
            setIsAddressSuggestionsOpen(false);
            return;
        }

        setIsAddressSuggestionsOpen(true);
    };

    const handleAddressSelect = async (suggestion) => {
        setAddressSearchValue("");
        clearAddressSuggestions();
        const nextDpid = suggestion.dpid ? String(suggestion.dpid) : "";
        setSelectedAddressDpid(nextDpid);
        setIsAddressSuggestionsOpen(false);

        if (!nextDpid) return;

        const requestId = addressDetailRequestRef.current + 1;
        addressDetailRequestRef.current = requestId;

        try {
            const recaptcha = await verifyRecaptcha("address_autocomplete");
            const detail = await fetchAddressDetail(nextDpid, recaptcha);

            if (addressDetailRequestRef.current !== requestId) return;

            updateValidationValue(street, detail.addressLine || suggestion.fullAddress);
            updateValidationValue(suburb, detail.suburb);
            updateValidationValue(city, detail.city);
            updateValidationValue(postcode, detail.postcode);
            setIsAddressSearchLocked(false);
        } catch (error) {
            setIsAddressSearchLocked(false);
            console.warn(error);
        }
    };

    const validate = () => {
        const results = [
            [street.validate(street.value), addressRef],
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
        deliveryAddressDpid: selectedAddressDpid,
        street: street.value,
        suburb: suburb.value,
        city: city.value,
        postcode: postcode.value,
        instructions: "",
        addressLines: [
            companyName ? `Company Name: ${companyName}` : "",
            street.value,
            suburb.value,
            `${city.value} ${postcode.value}`.trim(),
            "New Zealand",
        ].filter(Boolean),
    });

    return {
        fields: {
            address: {
                validation: {
                    value: addressSearchValue,
                    error: addressSearchError,
                    handleChange: (event) => handleAddressSearchChange(event.target.value),
                    handleBlur: () => {},
                },
                fieldRef: searchRef,
                suggestions: visibleAddressSuggestions,
                suggestionsOpen: showAddressSuggestions,
                isSearching: isSearchingAddress || isAddressSearchLocked,
                canSearch: !isSearchingAddress && !isAddressSearchLocked,
                onSearch: handleAddressSearch,
                suggestionPage: safeAddressSuggestionPage,
                suggestionTotalPages: addressSuggestionTotalPages,
                selectedDpid: selectedAddressDpid,
                onSelectSuggestion: handleAddressSelect,
                onPreviousSuggestionPage: () => setAddressSuggestionPage((currentPage) => Math.max(0, currentPage - 1)),
                onNextSuggestionPage: () => setAddressSuggestionPage((currentPage) => Math.min(addressSuggestionTotalPages - 1, currentPage + 1)),
                onFocus: () => setIsAddressSuggestionsOpen(addressSuggestions.length > 0),
            },
            street: { validation: street, fieldRef: addressRef, disabled: true },
            company: { value: companyName, onChange: setCompanyName },
            suburb: { validation: suburb, fieldRef: suburbRef, disabled: true },
            city: { validation: city, fieldRef: cityRef, disabled: true },
            postcode: { validation: postcode, fieldRef: postcodeRef, disabled: true },
        },
        validate,
        getReviewData,
    };
}
