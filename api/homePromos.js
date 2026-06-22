const DEFAULT_TIMEOUT = 10000; // ms
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;

export const fetchHomePromos = async (
    endpoint,
    { method = 'GET', headers = {}, body = null, timeout = DEFAULT_TIMEOUT, ...fetchOptions } = {}
) => {
    const url = endpoint;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const baseHeaders = {
            Accept: 'application/json',
            'Content-Type': body && typeof body === 'object' && !(body instanceof FormData) ? 'application/json' : undefined,
        };

        const mergedHeaders = Object.fromEntries(
            Object.entries({ ...baseHeaders, ...headers }).filter(([, v]) => v !== undefined)
        );

        const init = {
            method,
            headers: mergedHeaders,
            signal: controller.signal,
            ...fetchOptions,
        };

        if (body != null) {
            init.body = typeof body === 'object' && !(body instanceof FormData) ? JSON.stringify(body) : body;
        }

        const response = await fetch(url, init);
        clearTimeout(timeoutId);

        if (!response.ok) {
            // try to get response body for better errors
            let parsed = null;
            try {
                parsed = await response.json();
            } catch {
                try {
                    parsed = await response.text();
                } catch {
                    parsed = null;
                }
            }

            const error = new Error(`HTTP ${response.status} ${response.statusText}`);
            error.status = response.status;
            error.body = parsed;
            throw error;
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            return await response.json();
        }
        if (contentType.includes('text/')) {
            return await response.text();
        }
        // fallback to returning the raw response for blobs, streams, etc.
        return response;
    } catch (err) {
        if (err.name === 'AbortError') {
            const timeoutErr = new Error(`Request to ${url} aborted due to timeout (${timeout} ms)`);
            timeoutErr.code = 'ETIMEDOUT';
            throw timeoutErr;
        }
        console.warn('fetchHomePromos warning:', err.message);
        throw err;
    } finally {
        clearTimeout(timeoutId);
    }
};

export const fetchHomePromotionContent = async () => {
    if (!API_PREFIX) {
        throw new Error('NEXT_PUBLIC_API_PREFIX is not configured.');
    }

    const [promotionResponse, eventResponse] = await Promise.all([
        fetchHomePromos(`${API_PREFIX}/api/promotions/current`),
        fetchHomePromos(`${API_PREFIX}/api/events/current`),
    ]);

    return {
        monthlyPromotions: promotionResponse.data,
        currentEvents: eventResponse.data,
    };
};
