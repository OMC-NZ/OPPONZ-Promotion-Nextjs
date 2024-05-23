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
            } else {
                console.log("下一步就是等链接后端的时候再说了");
            }
        }
    }

    return { dateError, setDateError, errorDateMsg, validateDate };
}