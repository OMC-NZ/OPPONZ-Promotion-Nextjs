"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiCalendar, FiChevronDown, FiUploadCloud, FiInfo } from "react-icons/fi";
import { GiCheckMark, GiCrossMark } from "react-icons/gi";
import { fetchCurrentEvents, fetchEventForm, verifyEventImeiChannel } from "@api/events";
import {
    DeliveryAddressCard,
    useDeliveryAddressSection,
} from "@app/components/claim-form";
import useRecaptchaAction from "@hooks/useRecaptchaAction";
import style from "./style.module.css";

const PERSONAL_FIELD_KEYS = new Set([
    "first_name",
    "firstName",
    "last_name",
    "lastName",
    "email",
    "email_address",
    "mobile",
    "mobile_number",
    "phone",
    "contact",
]);

const isEnabledFlag = (value) => value === 1 || value === "1" || value === true;
const isImeiField = (field) => (
    field.validation === "imei"
    || String(field.id || "").toLowerCase().includes("imei")
);

const fixedYourDetailsSection = {
    id: "yourDetails",
    title: "Your Details",
    rows: [
        {
            layout: "twoGrid",
            fields: [
                { id: "first_name", type: "text", label: "First Name", required: true, placeholder: "Enter your first name", validation: "name" },
                { id: "last_name", type: "text", label: "Last Name", required: true, placeholder: "Enter your last name", validation: "name" },
            ],
        },
        {
            layout: "twoGrid",
            fields: [
                { id: "email", type: "text", label: "Email Address", required: true, placeholder: "Enter your email address", inputMode: "email", validation: "email" },
                { id: "contact", type: "phone", label: "Mobile Number", required: true, placeholder: "Enter mobile number", countryCode: "+64", validation: "phone" },
            ],
        },
    ],
};

const fixedImeiSection = {
    id: "imeiVerification",
    title: "IMEI Verification",
    rows: [
        {
            layout: "oneGrid",
            fields: [
                {
                    id: "imei",
                    type: "text",
                    label: "IMEI-1",
                    required: true,
                    placeholder: "Enter IMEI-1",
                    inputMode: "numeric",
                    validation: "imei",
                    helpText: "You can obtain your IMEI number by going to Settings > About Phone > Status",
                },
            ],
        },
    ],
};

const fixedPreferencesSection = {
    id: "preferences",
    title: "Preferences & Declaration",
    rows: [
        {
            layout: "oneGrid",
            fields: [
                { id: "termsAccepted", type: "checkbox", label: "By entering this claim, you accept and agree to all Terms and Conditions.", termsLink: true, required: true },
            ],
        },
    ],
};

const toCamelCase = (value) => (
    String(value || "")
        .replace(/[_\s-]+(.)?/g, (_, next) => (next ? next.toUpperCase() : ""))
);

const toTitleCase = (value) => (
    String(value || "")
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map((word) => (
            word ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : word
        ))
        .join(" ")
);

const normalizeOptions = (options = []) => (
    options.map((option) => {
        if (typeof option === "string") return { label: option, value: option };
        return {
            label: option.label || option.option_label || option.name || option.value || "",
            value: option.value || option.option_value || option.id || option.label || option.name || "",
        };
    }).filter((option) => option.label && option.value)
);

const normalizeFieldType = (type, options) => {
    const fieldType = String(type || "text").toLowerCase();
    if (fieldType === "file") return "upload";
    if (fieldType === "dropdown") return "select";
    if (fieldType === "checkbox_group") return "checkbox";
    if (fieldType === "radio_group") return "radio";
    if (fieldType === "text" && options?.length) return "select";
    return fieldType;
};

const normalizeBackendField = (field) => {
    const options = normalizeOptions(field.options || []);
    const key = field.field_key || `field_${field.id}`;
    const id = toCamelCase(key) || String(field.id);

    return {
        id,
        sourceKey: key,
        type: normalizeFieldType(field.field_type, options),
        label: toTitleCase(field.field_label || key),
        placeholder: field.placeholder || "",
        required: isEnabledFlag(field.is_required),
        validation: field.validation || null,
        options,
        sortOrder: field.sort_order || 0,
    };
};

const getLayoutForFieldCount = (count) => {
    if (count >= 4) return "fourGrid";
    if (count === 3) return "threeGrid";
    if (count === 2) return "twoGrid";
    return "oneGrid";
};

const normalizeBackendSections = (sections = []) => (
    sections
        .filter((section) => {
            const title = String(section.section_title || "").trim().toLowerCase();
            return title !== "preferences" && title !== "preferences & declaration";
        })
        .map((section) => {
            const fields = [...(section.fields || [])]
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(normalizeBackendField)
                .filter((field) => !PERSONAL_FIELD_KEYS.has(field.sourceKey) && !PERSONAL_FIELD_KEYS.has(field.id));

            return {
                id: `section_${section.id}`,
                title: toTitleCase(section.section_title || "Event Details"),
                sortOrder: section.sort_order || 0,
                rows: fields.length
                    ? [{ layout: getLayoutForFieldCount(fields.length), fields }]
                    : [],
            };
        })
        .filter((section) => section.rows.length > 0)
        .sort((a, b) => a.sortOrder - b.sortOrder)
);

const normalizeUploadsSection = (uploads = []) => {
    if (!uploads.length) return null;

    return {
        id: "uploadDocuments",
        title: "Upload Documents",
        rows: [
            {
                layout: "uploadGrid",
                fields: uploads.map((upload) => ({
                    id: toCamelCase(upload.upload_key || `upload_${upload.id}`),
                    sourceKey: upload.upload_key,
                    type: "upload",
                    label: upload.upload_label || "Upload Document",
                    required: true,
                    helperText: "PDF, JPG or PNG. Max 10MB.",
                })),
            },
        ],
    };
};

const buildFormConfig = (eventFormData) => {
    const event = eventFormData?.event || {};
    const sections = [fixedYourDetailsSection];

    if (isEnabledFlag(event.requires_imei)) {
        sections.push(fixedImeiSection);
    }

    if (isEnabledFlag(event.requires_delivery)) {
        sections.push({
            id: "deliveryAddress",
            title: "Delivery Address",
            rows: [],
        });
    }

    sections.push(...normalizeBackendSections(eventFormData?.sections || []));

    const uploadsSection = normalizeUploadsSection(eventFormData?.uploads || []);
    if (uploadsSection) sections.push(uploadsSection);

    sections.push(fixedPreferencesSection);

    return {
        pageTitle: event.name || "Claim Your Event Gift",
        pageSubtitle: "Complete your details to submit your event claim.",
        selectedEventNote: "Please make sure you are claiming the correct event.",
        requiresDelivery: isEnabledFlag(event.requires_delivery),
        event,
        sections,
    };
};

const emptyFormConfig = {
    pageTitle: "Claim Your Event Gift",
    pageSubtitle: "Complete your details to submit your event claim.",
    selectedEventNote: "Please make sure you are claiming the correct event.",
    requiresDelivery: false,
    event: {},
    sections: [],
};

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

const validatePattern = (field, value) => {
    const pattern = field.validation?.pattern;
    if (!pattern || !value) return "";

    try {
        return new RegExp(pattern).test(value)
            ? ""
            : field.validation?.message || "Invalid format";
    } catch {
        return "";
    }
};

const validateUploadFile = (file) => {
    if (!file) return "";

    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = new Set([
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
    ]);

    if (!allowedTypes.has(file.type)) {
        return "File type must be PDF, JPG, JPEG, or PNG";
    }

    if (file.size > maxSize) {
        return "File size must be 10MB or less";
    }

    return "";
};

const getEventSlug = (formConfig, event, routeSlug) => {
    const eventData = formConfig.event || {};
    return eventData.slug_url || eventData.slug || event?.slug || routeSlug || "";
};

export default function EventClaimPage() {
    const router = useRouter();
    const verifyRecaptcha = useRecaptchaAction();
    const { slug } = useParams();
    const [event, setEvent] = useState(null);
    const [eventFormData, setEventFormData] = useState(null);
    const [isEventLoading, setIsEventLoading] = useState(true);
    const formConfig = useMemo(() => (
        eventFormData ? buildFormConfig(eventFormData) : emptyFormConfig
    ), [eventFormData]);
    const fields = useMemo(() => getAllFields(formConfig), [formConfig]);
    const eventBanner = (
        event?.bannerUrl
        || event?.imageUrl
        || event?.url
        || formConfig.event?.banner_url
        || formConfig.event?.bannerUrl
        || ""
    );
    const eventTermsUrl = formConfig.event?.terms_url || "";
    const [form, setForm] = useState(() => buildInitialForm(formConfig));
    const [errors, setErrors] = useState({});
    const [eventImeiVerification, setEventImeiVerification] = useState({
        value: "",
        status: "idle",
        message: "",
    });
    const [termsVisible, setTermsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const deliveryAddressSection = useDeliveryAddressSection();

    useEffect(() => {
        let isActive = true;
        setIsEventLoading(true);

        const loadEventForm = async () => {
            try {
                const formRecaptcha = await verifyRecaptcha("event_form");
                const formResult = await fetchEventForm(slug, { recaptcha: formRecaptcha });

                if (!isActive) return;

                setEventFormData(formResult.data);

                const eventsRecaptcha = await verifyRecaptcha("events_current");
                const eventsResult = await fetchCurrentEvents({ recaptcha: eventsRecaptcha })
                    .catch(() => ({ items: [] }));

                if (!isActive) return;

                const formEvent = formResult.data?.event || {};
                const selectedEvent = eventsResult.items.find((item) => item.slug === slug);
                setEvent(selectedEvent || {
                    slug: formEvent.slug_url || slug,
                    title: formEvent.name || "Event",
                    bannerUrl: formEvent.banner_url || "",
                    termsUrl: formEvent.terms_url || "",
                });
            } catch (error) {
                console.warn("Unable to load event form:", error.message);
            } finally {
                if (isActive) setIsEventLoading(false);
            }
        };

        loadEventForm();

        return () => {
            isActive = false;
        };
    }, [slug, verifyRecaptcha]);

    useEffect(() => {
        setForm(buildInitialForm(formConfig));
        setErrors({});
        setEventImeiVerification({ value: "", status: "idle", message: "" });
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
        const fieldConfig = fields.find((item) => item.id === field);
        if (fieldConfig && isImeiField(fieldConfig)) {
            setEventImeiVerification({ value: "", status: "idle", message: "" });
        }
    };

    const verifyEventImeiOnBlur = async (field, value) => {
        if (!isImeiField(field)) return;

        const cleanedImei = String(value || "").replace(/\s+/g, "");
        if (!cleanedImei) return;

        if (!/^86\d{13}$/.test(cleanedImei)) {
            setEventImeiVerification({ value: cleanedImei, status: "invalid", message: "Incorrect IMEI-1" });
            setErrors((current) => ({ ...current, [field.id]: "Incorrect IMEI-1" }));
            return;
        }

        setEventImeiVerification({ value: cleanedImei, status: "checking", message: "" });
        setErrors((current) => ({ ...current, [field.id]: "" }));

        try {
            const recaptcha = await verifyRecaptcha("event_verify_imei_channel");
            const result = await verifyEventImeiChannel({
                imei: cleanedImei,
                slug: getEventSlug(formConfig, event, slug),
                recaptchaToken: recaptcha.token,
                recaptchaAction: recaptcha.action,
            });

            setEventImeiVerification({
                value: cleanedImei,
                status: result.verified ? "valid" : "invalid",
                message: result.verified ? "" : result.message || "Incorrect IMEI-1",
            });

            if (!result.verified) {
                setErrors((current) => ({
                    ...current,
                    [field.id]: result.message || "Incorrect IMEI-1",
                }));
            }
        } catch (error) {
            setEventImeiVerification({
                value: cleanedImei,
                status: "invalid",
                message: error?.message || "Unable to verify IMEI-1",
            });
            setErrors((current) => ({
                ...current,
                [field.id]: error?.message || "Unable to verify IMEI-1",
            }));
        }
    };

    const validate = () => {
        const nextErrors = {};

        fields.forEach((field) => {
            if (field.required && !form[field.id]) {
                nextErrors[field.id] = "Required";
            }

            const patternError = validatePattern(field, form[field.id]);
            if (patternError) {
                nextErrors[field.id] = patternError;
            }

            if (field.validation === "email" && form[field.id] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[field.id])) {
                nextErrors[field.id] = "Invalid Email";
            }

            if (field.validation === "name" && form[field.id] && !/^[A-Za-z ]+$/.test(form[field.id])) {
                nextErrors[field.id] = "Invalid Information";
            }

            if (field.validation === "phone" && form[field.id] && !/^\d+$/.test(form[field.id])) {
                nextErrors[field.id] = "Invalid Phone Number";
            }

            if (field.validation === "postcode" && form[field.id] && !/^\d{4}$/.test(form[field.id])) {
                nextErrors[field.id] = "Invalid Information";
            }

            const cleanedImei = isImeiField(field)
                ? String(form[field.id] || "").replace(/\s+/g, "")
                : "";
            if (isImeiField(field) && form[field.id] && !/^86\d{13}$/.test(cleanedImei)) {
                nextErrors[field.id] = "IMEI must be 15 digits and start with 86";
            }

            if (isImeiField(field) && form[field.id] && /^86\d{13}$/.test(cleanedImei)) {
                if (eventImeiVerification.value !== cleanedImei || eventImeiVerification.status !== "valid") {
                    nextErrors[field.id] = eventImeiVerification.status === "checking"
                        ? "Verifying IMEI-1"
                        : eventImeiVerification.message || "Please verify IMEI-1";
                }
            }

            if (field.type === "upload") {
                const fileError = validateUploadFile(form[field.id]);
                if (fileError) {
                    nextErrors[field.id] = fileError;
                }
            }
        });

        setErrors(nextErrors);
        const deliveryAddressResult = formConfig.requiresDelivery
            ? deliveryAddressSection.validate()
            : { isValid: true };
        return Object.keys(nextErrors).length === 0 && deliveryAddressResult.isValid;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!validate()) return;

        setIsSubmitting(true);

        try {
            await verifyRecaptcha("event_claim_submit");
            // TODO: Replace this with the event-specific submission endpoint.
            console.log("Event claim submitted", {
                event: formConfig.event?.slug_url || event.slug,
                form,
                deliveryAddress: formConfig.requiresDelivery ? deliveryAddressSection.getReviewData() : null,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isEventLoading) {
        return (
            <main className={`${style.eventPage} ${style.loadingEventPage}`}>
                <section className={style.loadingEventState}>
                    <h1>Loading Event</h1>
                </section>
            </main>
        );
    }

    if (!eventFormData) {
        return (
            <main className={style.eventPage}>
                <section className={style.heroTitle}>
                    <h1>Event Not Found</h1>
                </section>
            </main>
        );
    }

    return (
        <>
            <title>{formConfig.event?.name || event?.title} | OPPO NZ Promotions</title>
            <main className={style.eventPage}>
                <section className={style.heroTitle}>
                    <h1>{formConfig.pageTitle}</h1>
                    <p>{formConfig.pageSubtitle}</p>
                </section>

                <div className={style.eventForm}>
                    <section className={`${style.selectedEventCard} ${!eventBanner ? style.selectedEventCardNoMedia : ""}`}>
                        {eventBanner && (
                            <>
                                <div className={style.selectedEventMedia}>
                                    <Image
                                        src={eventBanner}
                                        alt={formConfig.event?.name || event?.title || "Event"}
                                        width={520}
                                        height={310}
                                        quality={100}
                                        unoptimized
                                        priority
                                    />
                                </div>
                                <div className={style.selectedEventDivider} />
                            </>
                        )}
                        <div className={style.selectedEventInfo}>
                            <h2>{formConfig.event?.name || event?.title}</h2>
                            <p>
                                {formConfig.selectedEventNote} Review the{" "}
                                {eventTermsUrl ? (
                                    <a href={eventTermsUrl} target="_blank" rel="noopener noreferrer">
                                        Terms and Conditions
                                    </a>
                                ) : (
                                    <button type="button" onClick={() => setTermsVisible(true)}>
                                        Terms and Conditions
                                    </button>
                                )}
                                .
                            </p>
                        </div>
                    </section>

                    {formConfig.sections.map((section) => (
                        section.id === "deliveryAddress" ? (
                            <DeliveryAddressCard fields={deliveryAddressSection.fields} key={section.id} />
                        ) : (
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
                                            onBlur={() => verifyEventImeiOnBlur(field, form[field.id])}
                                            imeiVerification={isImeiField(field) ? eventImeiVerification : null}
                                            onShowTerms={() => setTermsVisible(true)}
                                            termsUrl={eventTermsUrl}
                                        />
                                        ))}
                                    </div>
                                ))}
                                {section.note && <p className={style.infoNote}><FiInfo />{section.note}</p>}
                            </FormSection>
                        )
                    ))}

                    <div className={style.actions}>
                        <button type="button" className={style.secondaryButton} onClick={() => router.back()} disabled={isSubmitting}>Back</button>
                        <button type="button" className={style.primaryButton} onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Submitting" : "Submit Claim"}
                        </button>
                    </div>
                </div>
            </main>
            {termsVisible && (
                <EventTermsModal event={formConfig.event} onClose={() => setTermsVisible(false)} />
            )}
        </>
    );
}

function DynamicField({ field, value, error, onChange, onBlur, imeiVerification, onShowTerms, termsUrl }) {
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
        return <CheckboxField field={field} checked={value} error={error} onChange={onChange} onShowTerms={onShowTerms} termsUrl={termsUrl} />;
    }

    return <TextField field={field} value={value} error={error} onChange={onChange} onBlur={onBlur} imeiVerification={imeiVerification} />;
}

function EventTermsModal({ event, onClose }) {
    const termsUrl = event?.terms_url || event?.termsUrl || "";

    return (
        <div className={style.termsOverlay}>
            <div className={style.termsModal} role="dialog" aria-modal="true" aria-labelledby="event-terms-title">
                <button type="button" className={style.termsClose} onClick={onClose} aria-label="Close event terms">
                    &times;
                </button>
                <h2 id="event-terms-title">{event?.name || "Event"} Terms and Conditions</h2>
                <p>
                    {termsUrl ? (
                        <a href={termsUrl} target="_blank" rel="noopener noreferrer">
                            View Terms and Conditions
                        </a>
                    ) : "Terms and Conditions will be available soon."}
                </p>
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

function Label({ label, required, error, helpText }) {
    return (
        <label className={style.fieldLabel}>
            <span>{label} {required && <b>*</b>}</span>
            {helpText && (
                <span className={style.fieldHelpWrap}>
                    <button type="button" className={style.fieldHelpButton} aria-label={`${label} information`}>
                        <FiInfo />
                    </button>
                    <span className={style.fieldHelpText}>{helpText}</span>
                </span>
            )}
            {error && <strong>{error}</strong>}
        </label>
    );
}

function TextField({ field, value, error, onChange, onBlur, imeiVerification }) {
    return (
        <div className={style.fieldGroup}>
            <Label label={field.label} required={field.required} error={error} helpText={field.helpText} />
            <div className={`${style.textInputWrap} ${imeiVerification ? style.verifiableInputWrap : ""}`}>
                <input
                    type="text"
                    value={value || ""}
                    inputMode={field.inputMode}
                    onChange={(event) => onChange(event.target.value)}
                    onBlur={onBlur}
                    placeholder={field.placeholder}
                    className={error ? style.inputError : ""}
                />
                {imeiVerification?.status === "checking" && <span className={style.fieldSpinner} />}
                {imeiVerification?.status === "valid" && <span className={style.fieldValidIcon}><GiCheckMark /></span>}
                {imeiVerification?.status === "invalid" && <span className={style.fieldInvalidIcon}><GiCrossMark /></span>}
            </div>
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
                <button type="button">{field.countryCode || "+64"} <FiChevronDown /></button>
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
                    <option value="">{field.placeholder || "Select an option"}</option>
                    {field.options.map((option) => (
                        <option value={option.value} key={option.value}>{option.label}</option>
                    ))}
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
        <div className={style.uploadFieldGroup}>
            <Label label={field.label} required={field.required} error={error} />
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
                <FiUploadCloud />
                <p>{file ? file.name : "Drag and drop file here\nor click to browse"}</p>
                <small>{field.helperText || "PDF, JPG or PNG. Max 10MB."}</small>
                <input type="file" accept={field.accept || ".pdf,.jpg,.jpeg,.png"} onChange={(event) => handleFiles(event.target.files)} />
            </label>
        </div>
    );
}

function CheckboxField({ field, checked, error, onChange, onShowTerms, termsUrl }) {
    const parts = field.termsLink ? field.label.split("Terms and Conditions") : [field.label];

    return (
        <label className={style.checkboxRow}>
            <input type="checkbox" checked={Boolean(checked)} onChange={(event) => onChange(event.target.checked)} />
            {field.required && <b className={style.checkboxRequired}>*</b>}
            <span>
                {field.termsLink ? (
                    <>
                        {parts[0]}
                        {termsUrl ? (
                            <a href={termsUrl} target="_blank" rel="noopener noreferrer">
                                Terms and Conditions
                            </a>
                        ) : (
                            <button type="button" className={style.inlineTermsButton} onClick={(event) => {
                                event.preventDefault();
                                onShowTerms();
                            }}>
                                Terms and Conditions
                            </button>
                        )}
                        {parts[1]}
                    </>
                ) : field.label}
            </span>
            {error && <strong>{error}</strong>}
        </label>
    );
}
