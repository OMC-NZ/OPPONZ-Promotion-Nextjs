import { NextResponse } from "next/server";

const BACKEND_API_URL = (
    process.env.API_PREFIX
    || process.env.NEXT_PUBLIC_API_PREFIX
    || "http://localhost:3000"
).replace(/\/$/, "");

export async function POST(request) {
    try {
        const body = await request.text();
        const response = await fetch(`${BACKEND_API_URL}/api/claims/status`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
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
        console.error("Claim status proxy error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to reach the claim status service." },
            { status: 502 }
        );
    }
}
