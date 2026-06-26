"use client"
import { useState } from 'react';

export default function useClaimValidation(type) {
    const [error, setError] = useState("");
    const [value, setValue] = useState("");

    const validate = (value) => {
        let error = "";

        if (!value) {
            error = "Required";
        } else {
            if (type === "name") {
                const nameRegex = /^[A-Za-z ]+$/;
                if (!nameRegex.test(value)) {
                    error = "Invalid Information";
                }
            } else if (type === "email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const spaceRegex = /\s/;
                if (!emailRegex.test(value) || spaceRegex.test(value)) {
                    error = "Invalid Email";
                }
            } else if (type === "phone") {
                const contactRegex = /^[0-9]+$/;
                const spaceRegex = /\s/;
                if (!contactRegex.test(value) || spaceRegex.test(value)) {
                    error = "Invalid Phone Number";
                }
            } else if (type === "street") {
                const alphanumericRegex = /^[A-Za-z0-9\'-,/ ]+$/;
                if (!alphanumericRegex.test(value)) {
                    error = "Invalid Information";
                }
            } else if (type === "suburb") {
                const alphanumericRegex = /^[A-Za-z0-9ĀāĒēĪīŌōŪū'\- ]+$/;
                if (!alphanumericRegex.test(value)) {
                    error = "Invalid Information";
                }
            } else if (type === "city") {
                const alphanumericRegex = /^[A-Za-z0-9ĀāĒēĪīŌōŪū'\- ]+$/;
                if (!alphanumericRegex.test(value)) {
                    error = "Invalid Information";
                }
            } else if (type === "postcode") {
                const postcodeRegex = /^\d{4}$/;
                if (!postcodeRegex.test(value)) {
                    error = "Invalid Information";
                }
            } else if (type === "text") {
                const alphanumericRegex = /^[a-zA-Z0-9]+$/;
                if (!alphanumericRegex.test(value)) {
                    error = "Invalid Information";
                }
            } else if (type === "file") {
                const file = value[0];
                const maxImageSize = 5 * 1024 * 1024; // 5MB
                const maxPdfSize = 10 * 1024 * 1024; // 10MB
                const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                const allowedPdfType = 'application/pdf';
                if (file) {
                    if (!allowedImageTypes.includes(file.type) && file.type !== allowedPdfType) {
                        error = "File type must be in JPEG, JPG, PNG, or PDF format";
                    } else if (allowedImageTypes.includes(file.type) && file.size > maxImageSize) {
                        error = "Image file size must be 5MB or less";
                    } else if (file.type === allowedPdfType && file.size > maxPdfSize) {
                        error = "PDF file size must be 10MB or less";
                    }
                }
            }
        }

        setError(error);
        return error === "";
    };

    const handleChange = (event) => {
        const { type, value, files } = event.target;
        const newValue = type === "file" ? files : value;
        setValue(newValue);
        setError("");
    };

    return {
        value,
        error,
        handleChange,
        handleBlur: () => validate(value),
        validate
    };
}
