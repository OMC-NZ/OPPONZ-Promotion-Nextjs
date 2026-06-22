import { NextResponse } from "next/server";

const BACKEND_API_URL = (
    process.env.API_PREFIX
    || process.env.NEXT_PUBLIC_API_PREFIX
    || "http://localhost:3000"
).replace(/\/$/, "");

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_API_URL}/api/events/current`, {
            headers: { Accept: "application/json" },
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
        console.error("Current events proxy error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to reach the events service." },
            { status: 502 }
        );
    }
}
