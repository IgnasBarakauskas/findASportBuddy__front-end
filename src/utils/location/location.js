export function distance(lat1, long1, lat2, long2) {
	var earthRadius = 6371.2; // Radius of the Earth in miles
	var lat1Radians = lat1 * (Math.PI / 180); // Convert degrees to radians
	var lat2Radians = lat2 * (Math.PI / 180); // Convert degrees to radians
	var latDifference = lat2Radians - lat1Radians; // Radian difference (latitudes)
	var longDifference = (long2 - long1) * (Math.PI / 180); // Radian difference (longitudes)

	return (
		2 *
		earthRadius *
		Math.asin(
			Math.sqrt(
				Math.sin(latDifference / 2) * Math.sin(latDifference / 2) +
					Math.cos(lat1Radians) *
						Math.cos(lat2Radians) *
						Math.sin(longDifference / 2) *
						Math.sin(longDifference / 2)
			)
		)
	);
}
export function distanceLessThen(lat1, long1, lat2, long2, givenDist) {
	return givenDist > distance(lat1, long1, lat2, long2);
}
