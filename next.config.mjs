/** @type {import('next').NextConfig} */
const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://static.zdassets.com https://*.zendesk.com https://*.zdassets.com https://pod-15-sunco-ws.zendesk.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://*.zendesk.com https://*.zdassets.com https://pod-15-sunco-ws.zendesk.com wss://pod-15-sunco-ws.zendesk.com https://*.ingest.de.sentry.io https://your-backend-domain.com",
    "frame-src https://www.google.com https://www.recaptcha.net https://*.zendesk.com https://*.zdassets.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
].join("; ");

const nextConfig = {
    poweredByHeader: false,
    images: {
        qualities: [50, 75, 100],
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: csp,
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=(), payment=()",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=31536000; includeSubDomains",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
