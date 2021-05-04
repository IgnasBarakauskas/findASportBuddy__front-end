export default function getBase64(file, func) {
	let reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function () {
		func(reader.result);
	};
	reader.onerror = function (error) {
		console.error("Error: ", error);
	};
}
