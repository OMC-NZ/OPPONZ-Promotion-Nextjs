"use client"
import { useState } from 'react';

export default function useDateValidation() {
    const [dateError, setDateError] = useState(false);
    const [errorDateMsg, setErrorDateMsg] = useState('');

    const validateDate = (value) => {
        if (!value) {
            setDateError(true);
            setErrorDateMsg('Required');
        } else {
            const givenDate = new Date(value)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (today.getTime() - givenDate.getTime() > 31536000000) {
                setDateError(true);
                setErrorDateMsg('The legal redemption has already ended');
            }
        }
    }

    return { dateError, setDateError, errorDateMsg, validateDate };
}
