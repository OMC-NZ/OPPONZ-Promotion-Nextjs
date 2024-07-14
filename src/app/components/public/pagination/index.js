import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import style from "./publicCompo.module.css";

export default function PaginationButtons({ currentPage, totalPages, onPageChange }) {
    return (
        <div className={style.showButtonSl}>
            <button
                className={`${style.showButton} ${currentPage === 0 ? style.disabled : ''}`}
                onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}
            >
                <FaArrowLeftLong />
                <p>Previous</p>
            </button>
            <span>{currentPage + 1} / {totalPages}</span>
            <button
                className={`${style.showButton} ${currentPage === totalPages - 1 ? style.disabled : ''}`}
                onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}
            >
                <p>Next</p>
                <FaArrowRightLong />
            </button>
        </div>
    )
}