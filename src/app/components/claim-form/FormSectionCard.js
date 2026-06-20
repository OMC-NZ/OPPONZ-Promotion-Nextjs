import style from "./style.module.css";

export default function FormSectionCard({ title, children, sectionRef }) {
    return (
        <section className={style.formSection} ref={sectionRef}>
            <h2>{title}</h2>
            {children}
        </section>
    );
}
