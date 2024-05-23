import { useState } from 'react';

// validate IMEI
export default function useClaimIDValidation() {
    const [claimIDError, setClaimIDError] = useState(false);
    const [errorClaimIDMsg, setErrorClaimIDMsg] = useState('');

    const validateClaimID = (value) => {
        const cleanedValue = value.replace(/\s+/g, '');
        if (!cleanedValue) {
            setClaimIDError(true);
            setErrorClaimIDMsg('Required');
        } else if (!/^(?=.*[0-9])(?=.*[A-Za-z])(?=.*-)[A-Za-z0-9-]+$/.test(cleanedValue)) {
            setClaimIDError(true);
            setErrorClaimIDMsg('Incorrect Claim ID');
        } else {
            setClaimIDError(false);
            console.log('可以进行下一步了')
        }
    }

    return { claimIDError, setClaimIDError, errorClaimIDMsg, validateClaimID };
}