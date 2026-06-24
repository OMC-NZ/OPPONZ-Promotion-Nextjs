"use client"
import { useState } from 'react';

// validate IMEI
export default function useIMEIValidation() {
    const [imeiError, setIMEIError] = useState(false);
    const [errorIMEIMsg, setErrorIMEIMsg] = useState('');

    const validateIMEI = (value, status) => {
        const cleanedValue = value.replace(/\s+/g, '');
        if (!cleanedValue) {
            setIMEIError(status === 'input' ? false : true);
            setErrorIMEIMsg(status === 'input' ? '' : 'Required');
        } else if (!/^86\d{13}$/.test(cleanedValue)) {
            setIMEIError(true);
            setErrorIMEIMsg('Incorrect IMEI-1');
        }
    };

    return { imeiError, setIMEIError, errorIMEIMsg, validateIMEI };
}
