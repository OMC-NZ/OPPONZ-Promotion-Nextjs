import { useState } from 'react';

export default function useNonEmpty() {
    const [imeiError, setIMEIError] = useState(false);
    const [errorIMEIMsg, setErrorIMEIMsg] = useState('');

    const validateIMEI = (value) => {
        if (!value) {
            setErrorIMEIMsg('Required');
        } else {
            console.log('Go Next Step A');
        }
    };

    return { imeiError, setIMEIError, errorIMEIMsg, validateIMEI };
}