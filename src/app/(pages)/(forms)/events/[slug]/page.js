"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiCalendar, FiChevronDown, FiUploadCloud, FiInfo } from "react-icons/fi";
import { currentEvents, defaultEventFormConfig } from "@data/currentEvents";
import style from "./style.module.css";

const getEventConfig = (event) => event.formConfig || defaultEventFormConfig;

const getAllFields = (formConfig) => (
    formConfig.sections.flatMap((section) => (
        section.rows.flatMap((row) => row.fields)
    ))
);

const buildInitialForm = (formConfig) => (
    Object.fromEntries(getAllFields(formConfig).map((field) => [
        field.id,
        field.defaultValue ?? (field.type === "upload" ? null : field.type === "checkbox" ? false : ""),
    ]))
);

export default function EventClaimPage() {
    const router = useRouter();
    const { slug } = useParams();
    const event = currentEvents.find((item) => item.slug === slug) || currentEvents[0];
    const formConfig = useMemo(() => getEventConfig(event), [event]);
    const fields = useMemo(() => getAllFields(formConfig), [formConfig]);
    const eventBanner = event.bannerUrl || event.imageUrl || event.url;
    const [form, setForm] = useState(() => buildInitialForm(formConfig));
    const [errors, setErrors] = useState({});
    const [termsVisible, setTermsVisible] = useState(false);

    useEffect(() => {
        setForm(buildInitialForm(formConfig));
        setErrors({});
    }, [formConfig, slug]);

    useEffect(() => {
        const previousScrollRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";
        window.scrollTo({ top: 0, behavior: "auto" });

        return () => {
            window.history.scrollRestoration = previousScrollRestoration;
        };
    }, [slug]);

    const setField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: "" }));
    };

    const validate = () => {
        const nextErrors = {};

        fields.forEach((field) => {
            if (field.required && !form[field.id]) {
                nextErrors[field.id] = "Required";
            }

            if (field.validation === "email" && form[field.id] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[field.id])) {
                nextErrors[field.id] = "Invalid email";
            }

            if (field.validation === "phone" && form[field.id] && !/^\d+$/.test(form[field.id])) {
                nextErrors[field.id] = "Invalid number";
            }

            if (field.validation === "postcode" && form[field.id] && !/^\d{4}$/.test(form[field.id])) {
                nextErrors[field.id] = "Invalid postcode";
            }
        });

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        // TODO: Replace this with the event-specific submission endpoint.
        console.log("Event claim submitted", { event: event.slug, form });
    };

    return (
        <>
            <title>{event.title} | OPPO NZ Promotions</title>
            <main className={style.eventPage}>
                <section className={style.heroTitle}>
                    <h1>{formConfig.pageTitle || event.title}</h1>
                    <p>{formConfig.pageSubtitle || "Complete your details to submit your event claim."}</p>
                </section>

                <div className={style.eventForm}>
                    {formConfig.selectedEventCard !== false && (
                        <section className={style.selectedEventCard}>
                            <div className={style.selectedEventMedia}>
                                <Image
                                    src={eventBanner}
                                    alt={event.title}
                                    width={520}
                                    height={310}
                                    quality={100}
                                    priority
                                />
                            </div>
                            <div className={style.selectedEventDivider} />
                            <div className={style.selectedEventInfo}>
                                <h2>{event.title}</h2>
                                <p>
                                    {formConfig.selectedEventNote || "Please make sure you are claiming the correct event."} Review the{" "}
                                    <button type="button" onClick={() => setTermsVisible(true)}>
                                        Terms and Conditions
                                    </button>
                                    .
                                </p>
                            </div>
                        </section>
                    )}

                    {formConfig.sections.map((section) => (
                        <FormSection title={section.title} sectionId={section.id} key={section.id}>
                            {section.rows.map((row, rowIndex) => (
                                <div className={style[row.layout] || style.oneGrid} key={`${section.id}-${rowIndex}`}>
                                    {row.fields.map((field) => (
                                        <DynamicField
                                            key={field.id}
                                            field={field}
                                            value={form[field.id]}
                                            error={errors[field.id]}
                                            onChange={(value) => setField(field.id, value)}
                                            onShowTerms={() => setTermsVisible(true)}
                                        />
                                    ))}
                                </div>
                            ))}
                            {section.note && <p className={style.infoNote}><FiInfo />{section.note}</p>}
                        </FormSection>
                    ))}

                    <div className={style.actions}>
                        <button type="button" className={style.secondaryButton} onClick={() => router.back()}>Back</button>
                        <button type="button" className={style.primaryButton} onClick={handleSubmit}>Submit Claim</button>
                    </div>
                </div>
            </main>
            {termsVisible && (
                <EventTermsModal event={event} onClose={() => setTermsVisible(false)} />
            )}
        </>
    );
}

function DynamicField({ field, value, error, onChange, onShowTerms }) {
    if (field.type === "phone") {
        return <PhoneField field={field} value={value} error={error} onChange={onChange} />;
    }

    if (field.type === "radio") {
        return <RadioGroup field={field} value={value} error={error} onChange={onChange} />;
    }

    if (field.type === "select") {
        return <SelectField field={field} value={value} error={error} onChange={onChange} />;
    }

    if (field.type === "textarea") {
        return <TextareaField field={field} value={value} error={error} onChange={onChange} />;
    }

    if (field.type === "date") {
        return <DateField field={field} value={value} error={error} onChange={onChange} />;
    }

    if (field.type === "upload") {
        return <UploadField field={field} file={value} error={error} onFile={onChange} />;
    }

    if (field.type === "checkbox") {
        return <CheckboxField field={field} checked={value} error={error} onChange={onChange} onShowTerms={onShowTerms} />;
    }

    return <TextField field={field} value={value} error={error} onChange={onChange} />;
}

function EventTermsModal({ event, onClose }) {
    return (
        <div className={style.termsOverlay}>
            <div className={style.termsModal} role="dialog" aria-modal="true" aria-labelledby="event-terms-title">
                <button type="button" className={style.termsClose} onClick={onClose} aria-label="Close event terms">
                    &times;
                </button>
                <h2 id="event-terms-title">{event.termsTitle || `${event.title} Terms and Conditions`}</h2>
                <p>{event.termsSummary || "Claims are subject to eligibility, verification, and availability."}</p>
                <div className={style.termsActions}>
                    <button type="button" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

function FormSection({ title, sectionId, children }) {
    return (
        <section className={`${style.formSection} ${style[sectionId] || ""}`}>
            <h2>{title}</h2>
            {children}
        </section>
    );
}

function Label({ label, required, error }) {
    return (
        <label className={style.fieldLabel}>
            <span>{label} {required && <b>*</b>}</span>
            {error && <strong>{error}</strong>}
        </label>
    );
}

function TextField({ field, value, error, onChange }) {
    return (
        <div className={style.fieldGroup}>
            <Label label={field.label} required={field.required} error={error} />
            <input
                type="text"
                value={value || ""}
                inputMode={field.inputMode}
                onChange={(event) => onChange(event.target.value)}
                placeholder={field.placeholder}
                className={error ? style.inputError : ""}
            />
        </div>
    );
}

function DateField({ field, value, error, onChange }) {
    return (
        <div className={style.fieldGroup}>
            <Label label={field.label} required={field.required} error={error} />
            <div className={style.dateWrap}>
                <input
                    type="text"
                    value={value || ""}
                    inputMode="numeric"
                    onChange={(event) => onChange(event.target.value.replace(/[^\d/]/g, ""))}
                    placeholder={field.placeholder || "DD/MM/YYYY"}
                    className={error ? style.inputError : ""}
                />
                <FiCalendar />
            </div>
        </div>
    );
}

function PhoneField({ field, value, error, onChange }) {
    return (
        <div className={style.fieldGroup}>
            <Label label={field.label} required={field.required} error={error} />
            <div className={`${style.phoneInput} ${error ? style.inputError : ""}`}>
                <button type="button">{field.countryCode || "+61"} <FiChevronDown /></button>
                <input
                    type="text"
                    value={value || ""}
                    inputMode="numeric"
                    onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
                    placeholder={field.placeholder}
                />
            </div>
        </div>
    );
}

function RadioGroup({ field, value, error, onChange }) {
    return (
        <fieldset className={style.radioGroup}>
            <legend>{field.label} {field.required && <b>*</b>} {error && <strong>{error}</strong>}</legend>
            {field.options.map((option) => (
                <label key={option.value}>
                    <input type="radio" name={field.id} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
                    {option.label}
                </label>
            ))}
        </fieldset>
    );
}

function SelectField({ field, value, error, onChange }) {
    return (
        <div className={style.fieldGroup}>
            <Label label={field.label} required={field.required} error={error} />
            <div className={style.selectWrap}>
                <select value={value || ""} onChange={(event) => onChange(event.target.value)} className={error ? style.inputError : ""}>
                    <option value="">{field.placeholder}</option>
                    {field.options.map((option) => {
                        const optionValue = typeof option === "string" ? option : option.value;
                        const optionLabel = typeof option === "string" ? option : option.label;
                        return <option value={optionValue} key={optionValue}>{optionLabel}</option>;
                    })}
                </select>
                <FiChevronDown />
            </div>
        </div>
    );
}

function TextareaField({ field, value, error, onChange }) {
    return (
        <div className={style.fieldGroup}>
            <Label label={field.label} required={field.required} error={error} />
            <textarea
                value={value || ""}
                maxLength={field.maxLength}
                onChange={(event) => onChange(event.target.value)}
                placeholder={field.placeholder}
            />
            {field.maxLength && <small className={style.charCount}>{(value || "").length}/{field.maxLength}</small>}
        </div>
    );
}

function UploadField({ field, file, error, onFile }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = (files) => {
        if (!files?.[0]) return;
        onFile(files[0]);
    };

    return (
        <label
            className={`${style.uploadBox} ${isDragging ? style.uploadDragging : ""} ${error ? style.uploadError : ""}`}
            onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
            }}
            onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFiles(event.dataTransfer.files);
            }}
        >
            <span>
                {field.label} {field.required && <b>*</b>}
                {error && <strong>{error}</strong>}
            </span>
            <FiUploadCloud />
            <p>{file ? file.name : "Drag and drop file here\nor click to browse"}</p>
            <small>{field.helperText || "PDF, JPG or PNG. Max 10MB."}</small>
            <input type="file" accept={field.accept || ".pdf,.jpg,.jpeg,.png"} onChange={(event) => handleFiles(event.target.files)} />
        </label>
    );
}

function CheckboxField({ field, checked, error, onChange, onShowTerms }) {
    const parts = field.termsLink ? field.label.split("Terms and Conditions") : [field.label];

    return (
        <label className={style.checkboxRow}>
            <input type="checkbox" checked={Boolean(checked)} onChange={(event) => onChange(event.target.checked)} />
            <span>
                {field.termsLink ? (
                    <>
                        {parts[0]}
                        <button type="button" className={style.inlineTermsButton} onClick={(event) => {
                            event.preventDefault();
                            onShowTerms();
                        }}>
                            Terms and Conditions
                        </button>
                        {parts[1]}
                    </>
                ) : field.label}
            </span>
            {error && <strong>{error}</strong>}
        </label>
    );
}
