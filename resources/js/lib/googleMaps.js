export function extractGoogleMapsCoordinates(value) {
    if (!value) return null;
    let decoded;
    try {
        decoded = decodeURIComponent(value);
    } catch {
        decoded = value;
    }
    const patterns = [
        /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
        /(?:@|[?&](?:q|ll|query)=)(-?\d+(?:\.\d+)?)[, ](-?\d+(?:\.\d+)?)/,
    ];

    for (const pattern of patterns) {
        const match = decoded.match(pattern);
        if (!match) continue;
        const latitude = Number(match[1]);
        const longitude = Number(match[2]);
        if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
            return { latitude, longitude };
        }
    }

    return null;
}

export function googleMapsUrl(latitude, longitude, fallback = '') {
    return fallback || (latitude !== '' && longitude !== '' ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}` : '');
}
