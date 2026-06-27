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

        if (!/^OPNZPROCLM-\d{6}-.+/i.test(cleanedValue)) {
            setClaimIDError(true);
            setErrorClaimIDMsg('Incorrect Claim Reference');
            return false;
        }

        setClaimIDError(false);
        setErrorClaimIDMsg('');
        return true;
    }

    return { claimIDError, setClaimIDError, errorClaimIDMsg, validateClaimID };
}
