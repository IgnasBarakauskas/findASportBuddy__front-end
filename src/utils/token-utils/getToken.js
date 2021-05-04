import jwt from "jwt-decode";

export function getTokenData() {
	const tokenString = localStorage.getItem("token");
	if (!tokenString || isExpired(tokenString)) {
		return "token expired";
	}
	let token = undefined;
	if (tokenString) {
		try {
			token = jwt(tokenString);
		} catch (error) {
			token = undefined;
		}
	}
	return token;
}
export function getToken() {
	const token = localStorage.getItem("token");
	if (!token || isExpired(token)) {
		return "token expired";
	}
	return token;
}
export function deleteToken() {
	localStorage.removeItem("token");
}
function isExpired(tokenString) {
	let token = undefined;
	try {
		token = jwt(tokenString);
	} catch (error) {
		token = undefined;
	}
	if (new Date().getTime() / 1000 - token.iat > 3600) {
		localStorage.clear();
		return true;
	}
	return false;
}
