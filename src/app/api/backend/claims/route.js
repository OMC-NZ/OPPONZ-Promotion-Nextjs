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

export async function POST(request) {
    try {
        const body = await request.formData();
        const response = await fetch(`${BACKEND_API_URL}/api/claims`, {
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
        console.error("Claim submission proxy error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to reach the claim submission service." },
            { status: 502 }
        );
    }
}
