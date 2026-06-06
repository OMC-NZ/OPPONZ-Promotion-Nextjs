"use client"
import { useState } from 'react';

export default function useClaimIDValidation() {
    const [claimIDError, setClaimIDError] = useState(false);
    const [errorClaimIDMsg, setErrorClaimIDMsg] = useState('');

    const validateClaimID = (value) => {
        const cleanedValue = value.replace(/\s+/g, '');
        if (!cleanedValue) {
            setClaimIDError(true);
            setErrorClaimIDMsg('Required');
            return false;
        }

        if (!/^(?=.*[0-9])(?=.*[A-Za-z])(?=.*-)[A-Za-z0-9-]+$/.test(cleanedValue)) {
            setClaimIDError(true);
            setErrorClaimIDMsg('Incorrect Claim ID');
            return false;
        }

        setClaimIDError(false);
        setErrorClaimIDMsg('');
        return true;
    }

    return { claimIDError, setClaimIDError, errorClaimIDMsg, validateClaimID };
}
