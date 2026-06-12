import { NextResponse } from "next/server";

const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

const minimumScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);

export async function POST(request) {
    if (!recaptchaSecretKey) {
        return NextResponse.json(
            { success: false, message: "reCAPTCHA secret key is not configured." },
            { status: 500 }
        );
    }

    const { token, action } = await request.json();

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Missing reCAPTCHA token." },
            { status: 400 }
        );
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            secret: recaptchaSecretKey,
            response: token,
        }),
    });

    const result = await response.json();
    const actionMatches = !action || !result.action || result.action === action;
    const scorePasses = typeof result.score !== "number" || result.score >= minimumScore;
    const success = Boolean(result.success && actionMatches && scorePasses);

    return NextResponse.json(
        {
            success,
            score: result.score,
            action: result.action,
            message: success ? "Verified" : "reCAPTCHA verification failed.",
        },
        { status: success ? 200 : 403 }
    );
}
