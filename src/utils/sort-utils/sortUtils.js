import { distance } from "../location/location";

export function sortArray(array, order, orderBy, user) {
	let len = array.length;
	if (order === "desc") {
		for (let i = 0; i < len - 1; i++) {
			for (let j = 0; j < len - 1; j++) {
				let left = array[j];
				let right = array[j + 1];
				if (orderBy === "distance") {
					left = distance(user.latitude, user.longitude, left.latitude, left.longitude);
					right = distance(user.latitude, user.longitude, right.latitude, right.longitude);
				}
				if (orderBy === "participants") {
					left = left.participants.length;
					right = right.participants.length;
				}
				if (orderBy === "time") {
					left = left.appointmentTime;
					right = right.appointmentTime;
				}
				if (left > right) {
					let tmp = array[j];
					array[j] = array[j + 1];
					array[j + 1] = tmp;
				}
			}
		}
	} else {
		for (let i = 0; i < len - 1; i++) {
			for (let j = 0; j < len - 1; j++) {
				let left = array[j];
				let right = array[j + 1];
				if (orderBy === "distance") {
					left = distance(user.latitude, user.longitude, left.latitude, left.longitude);
					right = distance(user.latitude, user.longitude, right.latitude, right.longitude);
				}
				if (orderBy === "participants") {
					left = left.participants.length;
					right = right.participants.length;
				}
				if (orderBy === "time") {
					left = left.appointmentTime;
					right = right.appointmentTime;
				}
				if (left < right) {
					let tmp = array[j];
					array[j] = array[j + 1];
					array[j + 1] = tmp;
				}
			}
		}
	}
	return array;
}
