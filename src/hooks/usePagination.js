import { useState, useEffect } from 'react';

const usePagination = (windowWidth, imgsLength, callerIdentifier) => {
    const [imgsPerPage, setImgsPerPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(imgsLength / imgsPerPage);

    useEffect(() => {
        const updateImgsPerPage = () => {
            if (callerIdentifier === 'CurrentEvents') {
                if (windowWidth > 768 && imgsLength >= 2 || windowWidth > 1024 && imgsLength === 2) {
                    setImgsPerPage(2);
                } else {
                    setImgsPerPage(1);
                }
            } else if (callerIdentifier === 'MonthlyPromotions') {
                if (windowWidth > 1024 && imgsLength >= 3) {
                    setImgsPerPage(3);
                } else if (windowWidth <= 1024 && windowWidth > 768 && imgsLength >= 2 || windowWidth > 1024 && imgsLength == 2) {
                    setImgsPerPage(2);
                } else {
                    setImgsPerPage(1);
                }
            }
        };

        updateImgsPerPage();

        if (currentPage >= totalPages) {
            setCurrentPage(totalPages - 1);
        }
    }, [windowWidth, imgsLength, currentPage, totalPages, callerIdentifier]);

    return { imgsPerPage, currentPage, setCurrentPage, totalPages };
};

export default usePagination;