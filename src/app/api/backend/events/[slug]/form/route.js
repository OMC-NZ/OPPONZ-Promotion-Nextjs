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

export async function GET(request, { params }) {
    const { slug } = await params;

    try {
        const response = await fetch(`${BACKEND_API_URL}/api/events/${encodeURIComponent(slug)}/form`, {
            headers: {
                Accept: "application/json",
                ...getRecaptchaHeaders(request),
            },
            cache: "no-store",
        });
        const body = await response.text();

        return new NextResponse(body, {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("content-type") || "application/json",
            },
        });
    } catch (error) {
        console.error("Event form proxy error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to reach the event form service." },
            { status: 502 }
        );
    }
}
