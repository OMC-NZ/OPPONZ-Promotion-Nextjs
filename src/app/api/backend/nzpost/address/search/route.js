import { NextResponse } from "next/server";

const BACKEND_API_URL = (
    process.env.API_PREFIX
    || process.env.NEXT_PUBLIC_API_PREFIX
    || "http://localhost:3000"
).replace(/\/$/, "");

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
        return NextResponse.json({ success: true, addresses: [] });
    }

    try {
        const response = await fetch(`${BACKEND_API_URL}/api/nzpost/address/search?q=${encodeURIComponent(query)}`, {
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
        console.error("NZ Post address search proxy error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to reach the address search service.", addresses: [] },
            { status: 502 }
        );
    }
}
