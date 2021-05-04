import axios from "axios";
import config from "./config.json";

const userAPI = config.API + "users/";

export function RegisterUser(user) {
	return axios.post(`${userAPI}`, user);
}
export function LoginUser(user) {
	return axios.post(`${userAPI}login`, user);
}
export function AddUserLocation(user, token) {
	return axios.patch(`${userAPI}location`, user, { headers: { Token: token } });
}
export function getUser(userId) {
	return axios.get(`${userAPI}${userId}`);
}
export function getGroupsByUser(userId) {
	return axios.get(`${userAPI}${userId}/getGroups`);
}
export function updateUser(userId, user) {
	return axios.patch(`${userAPI}${userId}`, user);
}
export function deleteUser(userId, user) {
	return axios.delete(`${userAPI}${userId}`, user);
}
