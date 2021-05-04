export function dateUtils({ year = 0, month, day }) {
	const today = new Date();
	let yyyy = today.getFullYear();
	if (year) {
		yyyy = yyyy + year;
	}
	let mm = today.getMonth() + 1;
	if (month) {
		mm = mm + month;
		if (mm < 1) {
			yyyy = yyyy - 1;
			mm = 12 + mm;
		}
		if (mm > 12) {
			yyyy += 1;
			mm -= 12;
		}
	}
	if (mm / 10 < 1) {
		mm = "0" + mm;
	}
	let dd = today.getDate();
	if (day) {
		dd = dd + day;
		if (dd < 1) {
			dd = 28 + dd;
			mm -= 1;
		}
	}
	if (dd / 10 < 1) {
		dd = "0" + dd;
	}
	return yyyy + "-" + mm + "-" + dd;
}
export function timeUtils(inFuture) {
	const today = new Date();
	let hh = today.getHours();
	if (inFuture) {
		hh += 1;
	}
	let minutes = today.getMinutes();
	if (minutes / 10 < 1) {
		minutes = `0${minutes}`;
	}
	if (hh / 10 < 1) {
		hh = `0${hh}`;
	}
	return `${hh}:${minutes}:00`;
}
export function dateTimeUtils({ year = 0, month, day }, inFuture) {
	return new Date(`${dateUtils({ year, month, day })}/${timeUtils(inFuture)}`);
}
export function convertTime(string) {
	return { date: string.substring(0, 10), time: string.substring(11, 16) };
}
