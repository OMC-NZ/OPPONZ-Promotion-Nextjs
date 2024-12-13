import styles from "./loading.module.css";

export default function LoadingModal() {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.loader}></div>
        </div>
    );
}