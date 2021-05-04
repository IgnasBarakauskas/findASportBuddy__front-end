import axios from "axios";
import config from "./config.json";

const courtAPI = config.API + "courts/";

export function addCourt(court) {
	return axios.post(`${courtAPI}`, court);
}
export function getCourts() {
	return axios.get(`${courtAPI}`);
}
export function getCourt(id) {
	return axios.get(`${courtAPI}/${id}`);
}
export function deleteCourt(courtId) {
	return axios.delete(`${courtAPI}/${courtId}`);
}
export function getGroupsByCourt(courtId) {
	return axios.get(`${courtAPI}/${courtId}/getGroups`);
}
export function updateCourt(courtId, court) {
	return axios.patch(`${courtAPI}/${courtId}`, court);
}
