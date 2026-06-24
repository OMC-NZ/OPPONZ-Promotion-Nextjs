import { PiQuestionBold } from "react-icons/pi";
import style from "./style.module.css";

export default function ClaimField({
    label,
    validation,
    fieldRef,
    type = "text",
    prefix,
    inputMode,
    helpText,
    value,
    onChange,
    onFocus,
    disabled = false,
    placeholder,
}) {
    const inputValue = value ?? validation?.value ?? "";

    const handleChange = (event) => {
        if (type === "phone" || type === "postcode") {
            event.target.value = event.target.value.replace(/\D/g, "");
        }

        onChange?.(event.target.value);
        validation?.handleChange(event);
    };

    const input = (
        <input
            type="text"
            data-type={type}
            inputMode={inputMode}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={validation?.handleBlur}
            value={inputValue}
            className={validation?.error ? style.inputError : ""}
            disabled={disabled}
            placeholder={placeholder}
        />
    );

    return (
        <div className={style.fieldGroup} ref={fieldRef}>
            <label className={style.fieldLabel}>
                <span>{label}</span>
                {helpText && (
                    <span className={style.helpWrap}>
                        <button type="button" className={style.helpButton} aria-label={`${label} help`}>
                            <PiQuestionBold />
                        </button>
                        <span className={style.helpText}>{helpText}</span>
                    </span>
                )}
                {validation?.error && <span className={style.inlineFieldError}>{validation.error}</span>}
            </label>
            {prefix ? (
                <div className={`${style.prefixedInput} ${validation?.error ? style.inputError : ""}`}>
                    <span>{prefix}</span>
                    {input}
                </div>
            ) : input}
        </div>
    );
}
