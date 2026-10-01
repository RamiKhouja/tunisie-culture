// Approximate locations for the original catalog examples, not conversions of image pixels.
const catalogLocations = {
    'carthage-archaeological-site': [10.3233, 36.8528],
    'great-mosque-kairouan': [10.1033, 35.6814],
    'sejnane-pottery': [9.2386, 37.0572],
    'malouf-testour': [9.4431, 36.5513],
    'el-jem-amphitheatre': [10.7069, 35.2964],
    'djerba-wedding-traditions': [10.8575, 33.8758],
    'matmata-troglodyte-houses': [9.9675, 33.5428],
    'saharan-oral-poetry': [9.0203, 33.4664],
};

export function hasCoordinates(item) {
    return [item?.longitude, item?.latitude].every(value => value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value)))
        && Math.abs(Number(item.longitude)) <= 180 && Math.abs(Number(item.latitude)) <= 90;
}

export function culturalItemPosition(item) {
    if (hasCoordinates(item)) return item;
    const location = catalogLocations[item.url];
    return location ? { ...item, longitude: location[0], latitude: location[1], approximate_position: true } : item;
}
