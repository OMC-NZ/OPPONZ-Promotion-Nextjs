"use client";

import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import style from "./style.module.css";

export default function UploadField({ label, inputId, validation, fieldRef }) {
    const [isDraggingFile, setIsDraggingFile] = useState(false);
    const selectedFileName = validation.value?.[0]?.name;

    const handleFiles = (files) => {
        validation.handleChange({
            target: {
                type: "file",
                files,
            },
        });
        validation.validate(files);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDraggingFile(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDraggingFile(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDraggingFile(false);

        if (event.dataTransfer.files?.length) {
            handleFiles(event.dataTransfer.files);
        }
    };

    return (
        <div className={style.fieldGroup} ref={fieldRef}>
            <label className={style.fieldLabel}>
                <span>{label}</span>
                {validation.error && <span className={style.inlineFieldError}>{validation.error}</span>}
            </label>
            <label
                className={`${style.uploadBox} ${validation.error ? style.uploadError : ""} ${isDraggingFile ? style.uploadBoxDragging : ""}`}
                htmlFor={inputId}
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <FiUploadCloud />
                {selectedFileName ? (
                    <>
                        <span className={style.selectedFileName}>{selectedFileName}</span>
                        <small>Click to choose a different file.</small>
                    </>
                ) : (
                    <>
                        <span>Drag and drop file here or <strong>browse</strong></span>
                        <small>JPG, JPEG, PNG, HEIC or HEIF max 5MB. PDF max 10MB.</small>
                    </>
                )}
                <input
                    id={inputId}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf,.heic,.heif"
                    onChange={(event) => handleFiles(event.target.files)}
                    required
                />
            </label>
        </div>
    );
}
