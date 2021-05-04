import { CircularProgress, Tooltip } from "@material-ui/core";
import React from "react";
import { convertTime, distance } from "../../../utils";
import { CustomIconButton } from "../buttons";
import { CustomIcon, icon } from "../icon";
import { CustomTable, CustomTableBody, CustomTableCell, CustomTableRow } from "../table";
import styles from "./ListOfGroups.module.css";
const ListOfGroups = ({
	loading = true,
	data,
	user,
	onLeave,
	onJoin,
	onShowDirection,
	onDeleteGroup,
	onOpenInfo,
	infoButton = false
}) => {
	const CourtIcon = (type) => {
		switch (type) {
			case "me":
				return <CustomIcon icon={icon.faChild} />;
			case "basketball":
				return <CustomIcon color="#E15E27" icon={icon.faBasketballBall} />;
			case "golf":
				return <CustomIcon bordered color="white" icon={icon.faGolfBall} />;
			case "football":
				return <CustomIcon icon={icon.faFutbol} />;
			case "volleyball":
				return <CustomIcon bordered color="white" icon={icon.faVolleyballBall} />;
			default:
				break;
		}
	};
	return (
		<>
			{!loading &&
				Array.isArray(data) &&
				data.length > 0 &&
				user &&
				data.map((group) => (
					<div key={group._id} className={styles.groupBlock}>
						<CustomTable>
							<CustomTableBody>
								<CustomTableRow>
									<CustomTableCell className={styles.groupBlock__firstColumn}>
										<span className={styles.groupBlock__type}>
											{CourtIcon(group.sport)} {group.sport}
										</span>
									</CustomTableCell>
									<CustomTableCell className={styles.groupBlock__secondColumn}>
										<span className={styles.timeBlock__date}>
											{convertTime(group.appointmentTime).date}
										</span>
										<span className={styles.timeBlock__time}>
											{convertTime(group.appointmentTime).time}
										</span>
									</CustomTableCell>
								</CustomTableRow>
								<CustomTableRow>
									<CustomTableCell className={styles.groupBlock__firstColumn}>
										<span className={styles.groupBlock__equipment}>
											Participants: {`${group.participants.length}/${group.maxParticipants}`}
										</span>
									</CustomTableCell>
									<CustomTableCell className={styles.groupBlock__secondColumn}>
										<span className={styles.groupBlock__distance}>
											{distance(user.latitude, user.longitude, group.latitude, group.longitude) <
												1 && "Less then 1 km away"}
											{distance(user.latitude, user.longitude, group.latitude, group.longitude) >
												1 &&
												`${distance(
													user.latitude,
													user.longitude,
													group.latitude,
													group.longitude
												).toFixed(2)}km`}
										</span>
									</CustomTableCell>
								</CustomTableRow>
								<CustomTableRow>
									<CustomTableCell className={styles.groupBlock__firstColumn}>
										<span className={styles.groupBlock__equipment}>
											Equipment:{" "}
											<CustomIcon
												icon={group.equipment ? icon.faCheck : icon.faTimes}
												color={group.equipment ? "var(--color-darkgreen)" : "var(--color-red)"}
											/>
										</span>
									</CustomTableCell>
									<CustomTableCell className={styles.groupBlock__secondColumn}>
										<span>
											{group.ownerId !== user._id &&
												(group.participants.includes(user._id) ? (
													<Tooltip title="Leave group" placement="top">
														<span>
															<CustomIconButton
																icon={icon.faSignOutAlt}
																color="var(--color-red)"
																size="sm"
																onClick={() => {
																	onLeave(group._id);
																}}
															/>
														</span>
													</Tooltip>
												) : (
													group.maxParticipants > group.participants.length && (
														<Tooltip title="Join group" placement="top">
															<span>
																<CustomIconButton
																	icon={icon.faSignInAlt}
																	color="var(--color-darkgreen)"
																	size="sm"
																	onClick={() => {
																		onJoin(group);
																	}}
																/>
															</span>
														</Tooltip>
													)
												))}
											<Tooltip title="Show direction" placement="top">
												<span>
													<CustomIconButton
														icon={icon.faMapMarkerAlt}
														onClick={() => {
															onShowDirection(group);
														}}
														color="var(--color-black)"
													/>
												</span>
											</Tooltip>
											{(group.ownerId === user._id || user.role === "1") && (
												<Tooltip title="Delete group" placement="top">
													<span>
														<CustomIconButton
															icon={icon.faTrash}
															onClick={() => {
																onDeleteGroup(group._id);
															}}
															color="var(--color-red)"
														/>
													</span>
												</Tooltip>
											)}
											{infoButton && (
												<Tooltip title="Participants information" placement="top">
													<span>
														<CustomIconButton
															icon={icon.faInfo}
															onClick={() => {
																onOpenInfo(group);
															}}
															color="var(--color-blue)"
														/>
													</span>
												</Tooltip>
											)}
										</span>
									</CustomTableCell>
								</CustomTableRow>
							</CustomTableBody>
						</CustomTable>
					</div>
				))}
			{(!Array.isArray(data) || !data.length) && !loading && (
				<div className={`${styles.groupBlock} ${styles.empty}`}>
					<h3>There is no groups to show by given filters</h3>
				</div>
			)}
			{loading && (
				<div className={`${styles.groupBlock} ${styles.empty}`}>
					<CircularProgress size={100} className={styles.loader} />
				</div>
			)}
		</>
	);
};

export default ListOfGroups;
