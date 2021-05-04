import axios from "axios";
import config from "./config.json";

const groupAPI = config.API + "groups/";
export function getGroup(id) {
	return axios.get(`${groupAPI}/${id}`);
}
export function getGroups() {
	return axios.get(`${groupAPI}`);
}
export function addGroup(userId, courtId, group) {
	return axios.post(`${groupAPI}/${userId}/${courtId}`, group);
}
export function deleteGroup(id) {
	return axios.delete(`${groupAPI}/${id}`);
}
export function joinGroup(groupId, userId, equipment = { equipment: true }) {
	return axios.patch(`${groupAPI}/join/${groupId}/${userId}`, equipment);
}
export function leaveGroup(groupId, userId) {
	return axios.patch(`${groupAPI}/leave/${groupId}/${userId}`);
}
export function getGroupParticipants(id) {
	return axios.get(`${groupAPI}/${id}/getParticipants`);
}
export function addMessage(groupId, userId, message) {
	return axios.post(`${groupAPI}/${groupId}/messages/${userId}`, message);
}
export function getMessages(groupId) {
	return axios.get(`${groupAPI}/${groupId}/messages`);
}
export function deleteMessage(groupId, messageId) {
	return axios.delete(`${groupAPI}/${groupId}/messages/${messageId}`);
}
