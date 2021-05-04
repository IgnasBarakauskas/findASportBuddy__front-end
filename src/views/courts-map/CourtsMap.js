import React, { useState, useEffect } from "react";
import { CustomSnackbar, Map } from "../../common/components/index.js";
import { addCourt, deleteCourt, getCourt, getCourts, updateCourt } from "../../services/courtServices.js";
import { getUser } from "../../services/userServices.js";
import { getTokenData } from "../../utils/token-utils/getToken.js";
import styles from "./CourtsMap.module.css";
import { CourtInformationDialog, NewCourtDialog } from "./components";
import { getBase64 } from "../../utils";

const CourtsMap = (props) => {
	const [coordinates, setCoordinates] = useState(null);
	const [isUpdateWindowOpen, setIsUpdateWindowOpen] = useState(false);
	const [notificationType, setNotificationType] = useState(null);
	const [notificationText, setNotificationtext] = useState(null);
	const [courtDetails, setCourtDetails] = useState(null);
	const [courtError, setCourtError] = useState(null);
	const [court, setCourt] = useState({
		type: "",
		ammountOfCourts: "",
		price: "",
		photo: ""
	});
	const [me, setMe] = useState({
		latitude: null,
		longitude: null,
		type: "me"
	});
	const [courts, setCourts] = useState([]);
	const fetchUser = async (id) => {
		return getUser(id);
	};
	const fetchUpdateCourt = async (id, updatedCourt) => {
		return updateCourt(id, updatedCourt);
	};
	const handleCloseNotification = () => {
		setNotificationType(null);
		setNotificationtext(null);
	};
	const handleOpenNotification = (type, color) => {
		setNotificationType(type);
		setNotificationtext(color);
	};
	useEffect(() => {
		const tokenData = getTokenData();
		if (tokenData === "token expired") {
			window.location.href = "/login";
		}
		if (coordinates === null) {
			getCourts().then((data) => {
				setCourts(data.data);
			});
		}
		fetchUser(tokenData._id).then((data) => {
			setMe({ _id: data.data._id, latitude: data.data.latitude, longitude: data.data.longitude, type: "me" });
		});
	}, [coordinates, props.history, courtDetails]);

	const handleMapClick = (e) => {
		const tokenData = getTokenData();
		if (tokenData?.role === "1") setCoordinates(e.lngLat);
	};
	const handleClose = () => {
		setCoordinates(null);
	};
	const handleAddAtribute = (e, type) => {
		let newCourt = { ...court };
		let newCourtError = { ...courtError };
		const { value } = e.target;
		switch (type) {
			case "type":
				newCourt.type = value;
				if (value) {
					newCourtError["type"] = "";
				} else {
					newCourtError["type"] = "You must choose a court";
				}
				break;
			case "ammountOfCourts":
				newCourt.ammountOfCourts = value;
				if (value >= 1) {
					newCourtError["ammountOfCourts"] = "";
				} else {
					newCourtError["ammountOfCourts"] = "Place must have at least one Court";
				}
				break;
			case "price":
				newCourt.price = value;
				if (value >= 0) {
					newCourtError["price"] = "";
				} else {
					newCourtError["price"] = "Price can not be negative";
				}
				break;
			case "photo":
				getBase64(e.target.files[0], (result) => {
					newCourt.photo = result;
				});
				if (e.target.files[0].type.includes("image")) {
					newCourtError["photo"] = "";
				} else {
					newCourtError["photo"] = "File must be an image";
				}
				break;
			default:
				break;
		}
		setCourtError(newCourtError);
		setCourt(newCourt);
	};
	const fetchCourtData = async (newCourt) => {
		return addCourt(newCourt);
	};
	const handleAddCourt = () => {
		if (
			!courtError.price &&
			!courtError.ammountOfCourts &&
			!courtError.type &&
			!courtError.photo &&
			coordinates.length === 2 &&
			court.type &&
			court.ammountOfCourts > 0 &&
			court.price !== ""
		) {
			fetchCourtData({
				type: court.type,
				ammountOfCourts: court.ammountOfCourts,
				price: court.price,
				longitude: coordinates[0],
				latitude: coordinates[1],
				photo: court.photo
			})
				.then(() => {
					handleClose();
					handleOpenNotification("success", "Court was added successfully");
					setCourt({
						type: "",
						ammountOfCourts: "",
						price: "",
						photo: ""
					});
				})
				.catch(() => handleOpenNotification("danger", "There was an error while adding court"));
		}
	};
	const getCourtDetails = async (id) => {
		return getCourt(id);
	};
	const handleMarkerClick = (type, id) => {
		if (type !== "me") {
			getCourtDetails(id).then((data) => setCourtDetails(data.data));
		} else {
			setCourtDetails(null);
		}
	};
	const handleDelete = (id) => {
		deleteCourt(id)
			.then(() => {
				handleCloseDetails();
				handleOpenNotification("success", "Court was deleted successfully");
			})
			.catch(() => handleOpenNotification("danger", "There was an error while deleting court"));
	};
	const handleCloseDetails = () => {
		setCourtDetails(null);
	};
	const handleOpenUpdateWindow = () => {
		setIsUpdateWindowOpen(true);
	};
	const handleCloseUpdateWindow = () => {
		setIsUpdateWindowOpen(false);
	};
	const handleUpdateCourt = (updatedCourt) => {
		if (updatedCourt.price >= 0 && updatedCourt.ammountOfCourts >= 1) {
			fetchUpdateCourt(updatedCourt._id, updatedCourt)
				.then(() => {
					handleOpenNotification("success", "Court was updated successfully");
					handleCloseUpdateWindow();
				})
				.catch(() => {
					handleOpenNotification("danger", "There was an error while updating court");
				});
		}
	};
	return (
		<div className={styles.mapBox}>
			{me.latitude && (
				<Map
					zoom={14}
					centerLat={me.latitude}
					centerLng={me.longitude}
					width="80vw"
					height="70vh"
					onMarkerClick={handleMarkerClick}
					courts={[me, ...courts]}
					onClick={handleMapClick}
				/>
			)}
			<NewCourtDialog
				coordinates={coordinates}
				errors={courtError}
				onClose={handleClose}
				onAddAtributes={handleAddAtribute}
				court={court}
				onAddCourt={handleAddCourt}
			/>
			{courtDetails && (
				<CourtInformationDialog
					onUpdateCourt={handleUpdateCourt}
					onCloseUpdateWindow={handleCloseUpdateWindow}
					onOpenUpdateWindow={handleOpenUpdateWindow}
					isUpdateWindowOpen={isUpdateWindowOpen}
					onClose={handleCloseDetails}
					onDelete={handleDelete}
					courtId={courtDetails._id}
				/>
			)}
			<CustomSnackbar onClose={handleCloseNotification} color={notificationType} message={notificationText} />
		</div>
	);
};

export default CourtsMap;
