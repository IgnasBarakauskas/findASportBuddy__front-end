import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import {
	CustomButton,
	CustomCheckbox,
	CustomDialogFooter,
	CustomDialogHeader,
	CustomDialog,
	CustomDialogContent,
	ListOfGroups,
	icon,
	CustomSnackbar,
	CustomIconButton
} from "../../common/components";
import { deleteGroup, getGroups, joinGroup, leaveGroup } from "../../services/groupServices";
import { getUser } from "../../services/userServices";
import { dateTimeUtils, distanceLessThen, getTokenData } from "../../utils";
import { sortArray } from "../../utils/sort-utils/sortUtils";
import DirectionMap from "./direction-map/DirectionMap";
import styles from "./Main.module.css";

const Main = () => {
	const [loading, setLoading] = useState(true);
	const [groupToJoin, setGroupToJoin] = useState(null);
	const [doingApiCall, setDoingApiCall] = useState(false);
	const [finalLocation, setFinalLocation] = useState(null);
	const [userHasEquipment, setUserHasEquipment] = useState(false);
	const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
	const [groups, setGroups] = useState(null);
	const [notificationType, setNotificationType] = useState(null);
	const [notificationText, setNotificationtext] = useState(null);
	const [shownGroups, setShownGroups] = useState(null);
	const [user, setUser] = useState(null);
	const [distanceToShow, setDistanceToShow] = useState(10);
	const [sportToShow, setSportToShow] = useState(" ");
	const [orderBy, setOrderBy] = useState("time");
	const [order, setOrder] = useState("asc");
	const [haveEquipment, setHaveEquipment] = useState(true);
	const fetchGroupsData = async () => {
		return await getGroups();
	};
	const fetchDeleteGroup = async (id) => {
		return await deleteGroup(id);
	};
	const fetchUserData = async (id) => {
		return await getUser(id);
	};
	const fetchJoinGroup = async (userId, groupId, equipment = { equipment: true }) => {
		return await joinGroup(userId, groupId, equipment);
	};
	const fetchLeaveGroup = async (userId, groupId) => {
		return await leaveGroup(userId, groupId);
	};
	useEffect(() => {
		if (!doingApiCall) {
			setLoading(true);
			fetchGroupsData()
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
				if (
					distanceLessThen(user.latitude, user.longitude, group.latitude, group.longitude, distanceToShow) &&
					haveEquipment === group.equipment &&
					(sportToShow === " " || sportToShow === group.sport)
				) {
					newShownGroups.push(group);
				}
			});
		}
		setShownGroups(sortArray(newShownGroups, order, orderBy, user));
	}, [distanceToShow, sportToShow, haveEquipment, groups, user, order, orderBy]);
	const handleDistanceChange = (e) => {
		setDistanceToShow(e.target.value);
	};
	const handleSportChange = (e) => {
		setSportToShow(e.target.value);
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

	const handleDeleteGroup = (id) => {
		setDoingApiCall(true);
		fetchDeleteGroup(id).then(() => {
			setDoingApiCall(false);
		});
	};
	const handleJoindGroupWithoutEquipmnet = () => {
		setDoingApiCall(true);
		if (groupToJoin) {
			fetchJoinGroup(groupToJoin._id, user._id, { equipment: userHasEquipment })
				.then(() => {
					setDoingApiCall(false);
					setGroupToJoin(null);
					setIsQuestionDialogOpen(false);
					handleOpenNotification("success", "You successfully joined a group");
				})
				.catch(() => handleOpenNotification("danger", "There was an error while joining group"));
		}
	};
	const handleJoin = (group) => {
		if (group.equipment) {
			setDoingApiCall(true);
			fetchJoinGroup(group._id, user._id)
				.then(() => {
					setDoingApiCall(false);
					handleOpenNotification("success", "You successfully joined a group");
				})
				.catch(() => handleOpenNotification("danger", "There was an error while joining group"));
		} else {
			setGroupToJoin(group);
			setIsQuestionDialogOpen(true);
		}
	};
	const handleCloseQuestionDialog = () => {
		setIsQuestionDialogOpen(false);
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
	const handleHasEquipment = (e) => {
		setUserHasEquipment(e.target.checked);
	};
	const handleCloseMap = () => {
		setFinalLocation(null);
	};
	const handleShowDirection = (group) => {
		setFinalLocation(group);
	};
	const handleCloseNotification = () => {
		setNotificationType(null);
		setNotificationtext(null);
	};
	const handleOpenNotification = (type, color) => {
		setNotificationType(type);
		setNotificationtext(color);
	};
	return (
		<div className={styles.mainContainer}>
			<div className={styles.filtersBlock}>
				<span className={styles.filters__hasEquipment}>
					Has equipment: <CustomCheckbox checked={haveEquipment} onChange={handleEquipment} />
				</span>
				<span className={styles.filters__distance}>
					<FormControl>
						<InputLabel
							className={styles.filter__selectors__120}
							shrink
							id="demo-simple-select-placeholder-label-label"
						>
							Sort by distance
						</InputLabel>
						<Select
							className={styles.filter__selectors}
							value={distanceToShow}
							onChange={handleDistanceChange}
						>
							<MenuItem value={1}>1 Km</MenuItem>
							<MenuItem value={2}>2 Km</MenuItem>
							<MenuItem value={5}>5 Km</MenuItem>
							<MenuItem value={10}>10 Km</MenuItem>
						</Select>
					</FormControl>
				</span>
				<FormControl className={styles.filters__sport}>
					<InputLabel
						className={styles.filter__selectors}
						shrink
						id="demo-simple-select-placeholder-label-label"
					>
						Sort by sport
					</InputLabel>
					<Select className={styles.filter__selectors} value={sportToShow} onChange={handleSportChange}>
						<MenuItem value={" "}>All</MenuItem>
						<MenuItem value={"basketball"}>Basketball</MenuItem>
						<MenuItem value={"golf"}>Golf</MenuItem>
						<MenuItem value={"football"}>Football</MenuItem>
						<MenuItem value={"volleyball"}>Volleyball</MenuItem>
					</Select>
				</FormControl>

				<FormControl className={styles.filters__sport}>
					<InputLabel
						className={styles.filter__selectors}
						shrink
						id="demo-simple-select-placeholder-label-label"
					>
						Order by
					</InputLabel>
					<Select className={styles.filter__selectors} value={orderBy} onChange={handleOrderByChange}>
						<MenuItem value={"time"}>Time</MenuItem>
						<MenuItem value={"distance"}>Distance</MenuItem>
						<MenuItem value={"participants"}>Participants</MenuItem>
					</Select>
				</FormControl>
				<CustomIconButton
					onClick={handleOrderChange}
					color={"var(--color-darkgrey)"}
					icon={order === "asc" ? icon.faArrowUp : icon.faArrowDown}
				/>
			</div>
			{user && (
				<ListOfGroups
					data={shownGroups}
					onDeleteGroup={handleDeleteGroup}
					onJoin={handleJoin}
					onLeave={handleLeave}
					onShowDirection={handleShowDirection}
					user={user}
					loading={loading}
				/>
			)}
			<CustomDialog open={isQuestionDialogOpen} onClose={handleCloseQuestionDialog}>
				<CustomDialogHeader>
					Do you have equipment <CustomCheckbox checked={userHasEquipment} onChange={handleHasEquipment} />
				</CustomDialogHeader>
				<CustomDialogFooter>
					<CustomButton onClick={handleCloseQuestionDialog} color="red">
						Cancel
					</CustomButton>
					<CustomButton
						disabled={groupToJoin?.maxParticipants > groupToJoin?.participants.length && !userHasEquipment}
						onClick={handleJoindGroupWithoutEquipmnet}
						color="green"
					>
						Join
					</CustomButton>
				</CustomDialogFooter>
			</CustomDialog>
			<CustomDialog open={!!finalLocation} onClose={handleCloseMap}>
				<CustomDialogContent className={styles.mapContainer}>
					<DirectionMap onClose={handleCloseMap} user={user} court={finalLocation} />
				</CustomDialogContent>
			</CustomDialog>
			<CustomSnackbar onClose={handleCloseNotification} color={notificationType} message={notificationText} />
		</div>
	);
};

export default Main;
