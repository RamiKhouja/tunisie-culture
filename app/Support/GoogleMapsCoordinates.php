<?php

namespace App\Support;

class GoogleMapsCoordinates
{
    /** @return array{latitude: float, longitude: float}|null */
    public static function extract(?string $url): ?array
    {
        if (! $url) {
            return null;
        }

        $decoded = urldecode($url);
        $patterns = [
            '/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/',
            '/(?:@|[?&](?:q|ll|query)=)(-?\d+(?:\.\d+)?)[, ](-?\d+(?:\.\d+)?)/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $decoded, $matches)) {
                $latitude = (float) $matches[1];
                $longitude = (float) $matches[2];

                if ($latitude >= -90 && $latitude <= 90 && $longitude >= -180 && $longitude <= 180) {
                    return ['latitude' => $latitude, 'longitude' => $longitude];
                }
            }
        }

        return null;
    }
}
