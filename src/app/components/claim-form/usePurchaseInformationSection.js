"use client";

import { useRef } from "react";
import useClaimValidation from "@hooks/validations/useClaimValidation";

const getFileName = (fileList) => fileList?.[0]?.name || "";

export default function usePurchaseInformationSection() {
    const invoice = useClaimValidation("text");
    const imeiScreenshot = useClaimValidation("file");
    const proofOfPurchase = useClaimValidation("file");

    const invoiceRef = useRef(null);
    const imeiScreenshotRef = useRef(null);
    const proofOfPurchaseRef = useRef(null);

    const validate = () => {
        const results = [
            [invoice.validate(invoice.value), invoiceRef],
            [imeiScreenshot.validate(imeiScreenshot.value), imeiScreenshotRef],
            [proofOfPurchase.validate(proofOfPurchase.value), proofOfPurchaseRef],
        ];
        const firstInvalid = results.find(([isValid]) => !isValid);

        return {
            isValid: !firstInvalid,
            firstInvalidRef: firstInvalid?.[1] || null,
        };
    };

    const getReviewData = () => ({
        invoiceNumber: invoice.value,
        receiptFileName: getFileName(proofOfPurchase.value),
        screenshotFileName: getFileName(imeiScreenshot.value),
        documents: [
            {
                label: "IMEI Screenshot",
                fileName: getFileName(imeiScreenshot.value),
                file: imeiScreenshot.value?.[0],
            },
            {
                label: "Proof of Purchase",
                fileName: getFileName(proofOfPurchase.value),
                file: proofOfPurchase.value?.[0],
            },
        ],
    });

    return {
        fields: {
            invoice: { validation: invoice, fieldRef: invoiceRef },
            imeiScreenshot: { validation: imeiScreenshot, fieldRef: imeiScreenshotRef },
            proofOfPurchase: { validation: proofOfPurchase, fieldRef: proofOfPurchaseRef },
        },
        validate,
        getReviewData,
    };
}
