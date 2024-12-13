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
                const nameRegex = /^[A-Za-zĀāĒēĪīŌōŪū ]+$/;
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
                const alphanumericRegex = /^[A-Za-zĀāĒēĪīŌōŪū ]+$/;
                if (!alphanumericRegex.test(value)) {
                    error = "Invalid Information";
                }
            } else if (type === "city") {
                const alphanumericRegex = /^[A-Za-z0-9ĀāĒēĪīŌōŪū ]+$/;
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
                const maxSize = 10 * 1024 * 1024; // 10MB
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                if (file) {
                    if (!allowedTypes.includes(file.type)) {
                        error = "File type must be in JPEG, JPG, PNG, or PDF format";
                    } else if (file.size > maxSize) {
                        error = "File size must be less than 10MB";
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
        validate(newValue);
    };

    return {
        value,
        error,
        handleChange,
        validate
    };
}