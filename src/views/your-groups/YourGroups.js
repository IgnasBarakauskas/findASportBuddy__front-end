import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import {
	CustomCheckbox,
	CustomDialog,
	CustomDialogContent,
	icon,
	ListOfGroups,
	CustomSnackbar,
	CustomIconButton
} from "../../common/components";
import {
	deleteGroup,
	leaveGroup,
	getGroupParticipants,
	addMessage,
	getMessages,
	deleteMessage
} from "../../services/groupServices";
import { getGroupsByUser, getUser } from "../../services/userServices";
import { dateTimeUtils, getTokenData, sortArray } from "../../utils";
import DirectionMap from "../main/direction-map/DirectionMap";
import ParticipantsDialog from "./components/ParticipantsDialog";
import styles from "./YourGroups.module.css";
const YourGroups = () => {
	const [loading, setLoading] = useState(true);
	const [doingApiCall, setDoingApiCall] = useState(false);
	const [finalLocation, setFinalLocation] = useState(null);
	const [groupParticipants, setGroupParticipants] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [groups, setGroups] = useState(null);
	const [shownGroups, setShownGroups] = useState(null);
	const [user, setUser] = useState(null);
	const [haveEquipment, setHaveEquipment] = useState(true);
	const [orderBy, setOrderBy] = useState("time");
	const [order, setOrder] = useState("asc");
	const [notificationType, setNotificationType] = useState(null);
	const [notificationText, setNotificationtext] = useState(null);
	const [newMessage, setNewMessage] = useState("");
	const [messages, setMessages] = useState("");

	const fetchGroupsData = async (id) => {
		return getGroupsByUser(id);
	};
	const fetchGroupsParticipants = async (id) => {
		return getGroupParticipants(id);
	};
	const fetchDeleteGroup = async (id) => {
		return deleteGroup(id);
	};
	const fetchUserData = async (id) => {
		return getUser(id);
	};
	const fetchLeaveGroup = async (userId, groupId) => {
		return leaveGroup(userId, groupId);
	};
	const fetchNewMessage = async (groupId, userId, message) => {
		return addMessage(groupId, userId, message);
	};
	const fetchMessages = async (groupId) => {
		return getMessages(groupId);
	};
	const fetchDeleteMessage = async (groupId, messageId) => {
		return deleteMessage(groupId, messageId);
	};
	useEffect(() => {
		if (selectedGroup) {
			fetchGroupsParticipants(selectedGroup._id)
				.then((data) => {
					setGroupParticipants(data.data);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [selectedGroup]);
	useEffect(() => {
		if (selectedGroup) {
			fetchMessages(selectedGroup._id)
				.then((data) => setMessages(data.data))
				.catch((error) => {
					console.error(error);
				});
		}
	}, [doingApiCall, selectedGroup]);
	useEffect(() => {
		if (!doingApiCall) {
			setLoading(true);
			fetchGroupsData(getTokenData()._id)
				.then((data) => {
					let newGroups = [];
					if (data.data) {
						data.data.forEach(async (group) => {
							if (dateTimeUtils({ year: 0 }) > new Date(group.appointmentTime)) {
								fetchDeleteGroup(group._id);
							} else {
								newGroups.push(group);
							}
						});
						return newGroups;
					}
				})
				.then((data) => {
					setGroups(data);
					setLoading(false);
				})
				.catch((err) => {
					console.error(err);
					setLoading(false);
				});
		}
	}, [doingApiCall]);
	useEffect(() => {
		fetchUserData(getTokenData()._id).then((data) => setUser(data.data));
	}, []);
	const handleEquipment = (e) => {
		setHaveEquipment(e.target.checked);
	};

	useEffect(() => {
		const newShownGroups = [];
		if (user && Array.isArray(groups)) {
			groups.forEach((group) => {
				if (haveEquipment === group.equipment) {
					newShownGroups.push(group);
				}
			});
		}
		setShownGroups(sortArray(newShownGroups, order, orderBy, user));
	}, [haveEquipment, groups, user, order, orderBy]);

	const handleDeleteGroup = (id) => {
		setDoingApiCall(true);
		fetchDeleteGroup(id)
			.then(() => {
				setDoingApiCall(false);
				handleOpenNotification("success", "You successfully deleted a group");
			})
			.catch(() => handleOpenNotification("danger", "There was an error while deleting a group"));
	};

	const handleLeave = (groupId) => {
		setDoingApiCall(true);
		fetchLeaveGroup(groupId, user._id)
			.then(() => {
				setDoingApiCall(false);
				handleOpenNotification("success", "You successfully leaved a group");
			})
			.catch(() => handleOpenNotification("danger", "There was an error while leaving a group"));
	};
	const handleCickUser = (groupId, userId) => {
		fetchLeaveGroup(groupId, userId).then(() => {
			fetchGroupsParticipants(selectedGroup._id)
				.then((data) => {
					setGroupParticipants(data.data);
					handleOpenNotification("success", "You successfully removed a user from group");
				})
				.catch((error) => {
					console.error(error);
					handleOpenNotification("danger", "There was an error whileremoving user from group");
				});
		});
	};
	const handleCloseMap = () => {
		setFinalLocation(null);
	};
	const handleShowDirection = (group) => {
		setFinalLocation(group);
	};
	const handleInfoOpen = (group) => {
		setSelectedGroup(group);
	};
	const handleCloseInfo = () => {
		setSelectedGroup(null);
	};
	const handleCloseNotification = () => {
		setNotificationType(null);
		setNotificationtext(null);
	};
	const handleOpenNotification = (type, color) => {
		setNotificationType(type);
		setNotificationtext(color);
	};
	const handleWrite = (e) => {
		setNewMessage(e.target.value);
	};
	const handleSend = () => {
		setDoingApiCall(true);
		if (newMessage?.length > 0) {
			fetchNewMessage(selectedGroup._id, user._id, { name: user.fullName, content: newMessage })
				.then(() => {
					setDoingApiCall(false);
					setNewMessage("");
				})
				.catch((error) => {
					console.error(error);
					handleOpenNotification("danger", "Error occured when sending your message");
				});
		}
	};
	const handleDeleteMessage = (messageId) => {
		setDoingApiCall(true);
		fetchDeleteMessage(selectedGroup._id, messageId).then(() => setDoingApiCall(false));
	};
	const handleOrderByChange = (e) => {
		setOrderBy(e.target.value);
	};
	const handleOrderChange = () => {
		if (order === "asc") {
			setOrder("desc");
		} else {
			setOrder("asc");
		}
	};

	return (
		<div className={styles.mainContainer}>
			<div className={styles.filtersBlock}>
				<span className={styles.filters__hasEquipment}>
					Has equipment: <CustomCheckbox checked={haveEquipment} onChange={handleEquipment} />
				</span>
				<FormControl className={styles.filters__sport}>
					<InputLabel
						className={styles.filter__selectors}
						shrink
						id="demo-simple-select-placeholder-label-label"
					>
						Order
					</InputLabel>
					<Select className={styles.filter__selectors} value={orderBy} onChange={handleOrderByChange}>
						<MenuItem value={"time"}>Time</MenuItem>
						<MenuItem value={"distance"}>Distance</MenuItem>
						<MenuItem value={"participants"}>Participants</MenuItem>
					</Select>
				</FormControl>
				<CustomIconButton
					onClick={handleOrderChange}
					color="var(--color-darkgrey)"
					icon={order === "asc" ? icon.faArrowUp : icon.faArrowDown}
				/>
			</div>
			{user && (
				<ListOfGroups
					data={shownGroups}
					onDeleteGroup={handleDeleteGroup}
					onLeave={handleLeave}
					onShowDirection={handleShowDirection}
					user={user}
					loading={loading}
					infoButton={true}
					onOpenInfo={handleInfoOpen}
				/>
			)}
			<CustomDialog open={!!finalLocation} onClose={handleCloseMap}>
				<CustomDialogContent className={styles.mapContainer}>
					<DirectionMap onClose={handleCloseMap} user={user} court={finalLocation} />
				</CustomDialogContent>
			</CustomDialog>
			<ParticipantsDialog
				onWrite={handleWrite}
				onSend={handleSend}
				messages={messages}
				onDeleteMessage={handleDeleteMessage}
				selectedGroup={selectedGroup}
				onCloseInfo={handleCloseInfo}
				newMessage={newMessage}
				data={groupParticipants}
				onCickUser={handleCickUser}
				user={user}
			/>
			<CustomSnackbar onClose={handleCloseNotification} color={notificationType} message={notificationText} />
		</div>
	);
};

export default YourGroups;
