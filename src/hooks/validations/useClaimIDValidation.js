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

        const newClaimReferencePattern = /^OPNZPROCLM-\d{6}-.+/i;
        const legacyUuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!newClaimReferencePattern.test(cleanedValue) && !legacyUuidPattern.test(cleanedValue)) {
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
