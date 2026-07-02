import { NextResponse } from "next/server";

const BACKEND_API_URL = (
    process.env.API_PREFIX
    || process.env.NEXT_PUBLIC_API_PREFIX
    || "http://localhost:3000"
).replace(/\/$/, "");

const getRecaptchaHeaders = (request) => {
    const token = request.headers.get("x-recaptcha-token");
    const action = request.headers.get("x-recaptcha-action");

    return {
        ...(token ? { "x-recaptcha-token": token } : {}),
        ...(action ? { "x-recaptcha-action": action } : {}),
    };
};

const logEventClaimFormData = (slug, formData) => {
    const payloadPreview = {};

    formData.forEach((value, key) => {
        payloadPreview[key] = value instanceof File
            ? {
                fileName: value.name,
                fileType: value.type,
                fileSize: value.size,
            }
            : value;
    });

    console.log(`Event claim proxy payload (${slug})`, payloadPreview);
};

export async function POST(request, { params }) {
    const { slug } = await params;

    try {
        const body = await request.formData();
        logEventClaimFormData(slug, body);
        const response = await fetch(`${BACKEND_API_URL}/api/events/${encodeURIComponent(slug)}/claims`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                ...getRecaptchaHeaders(request),
            },
            body,
            cache: "no-store",
        });
        const responseBody = await response.text();

        return new NextResponse(responseBody, {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("content-type") || "application/json",
            },
        });
    } catch (error) {
        console.error("Event claim submission proxy error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to reach the event claim submission service." },
            { status: 502 }
        );
    }
}
