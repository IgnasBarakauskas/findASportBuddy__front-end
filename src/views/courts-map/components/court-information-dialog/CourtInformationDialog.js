import React, { useEffect, useState } from "react";
import {
	CustomButton,
	CustomCheckbox,
	CustomDialog,
	CustomDialogContent,
	CustomDialogFooter,
	CustomDialogHeader,
	CustomTable,
	CustomTableBody,
	CustomTableCell,
	CustomTableContainer,
	CustomTableHead,
	CustomTableRow,
	icon
} from "../../../../common/components";
import CustomIconButton from "../../../../common/components/buttons/icon-button/CustomIconButton";
import { getCourt, getGroupsByCourt } from "../../../../services/courtServices";
import { deleteGroup } from "../../../../services/groupServices";
import { convertTime, dateTimeUtils, getTokenData } from "../../../../utils";
import AddGroup from "./add-group/AddGroup";
import styles from "./CourtInformationDialog.module.css";
import UpdateCourt from "./update-court/UpdateCourt";

export default function CourtInformationDialog({
	courtId,
	onClose,
	onDelete,
	onOpenUpdateWindow,
	onCloseUpdateWindow,
	isUpdateWindowOpen,
	onUpdateCourt
}) {
	const [open, setOpen] = useState(false);
	const [groups, setGroups] = useState(null);
	const [isDeleteInitialized, setIsDeleteInitialized] = useState(false);
	const [court, setCourt] = useState(null);
	const fetchCourtData = async (id) => {
		return getCourt(id);
	};
	const fetchGroupsData = async (id) => {
		return getGroupsByCourt(id);
	};
	const fetchDeleteGroups = async (id) => {
		deleteGroup(id);
	};
	useEffect(() => {
		if (courtId && !open) {
			fetchCourtData(courtId).then((data) => {
				setCourt(data.data);
				if (data.data.groups.length > 0) {
					fetchGroupsData(courtId)
						.then((data) => {
							let newGroups = [];
							if (data.data) {
								data.data.forEach(async (group) => {
									if (dateTimeUtils({ year: 0 }) > new Date(group.appointmentTime)) {
										await fetchDeleteGroups(group._id);
									} else {
										newGroups.push(group);
									}
								});
								return newGroups;
							}
						})
						.then((data) => setGroups(data));
				}
			});
		}
	}, [courtId, open, isUpdateWindowOpen]);

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	return (
		court && (
			<>
				<CustomDialog open={!!court} onClose={onClose}>
					<CustomDialogHeader>
						Court information
						{getTokenData().role === "1" && (
							<span className={styles.headerIcons}>
								<CustomIconButton
									className={styles.editIcon}
									onClick={onOpenUpdateWindow}
									color="var(--color-darkgreen)"
									icon={icon.faPen}
								/>
								<CustomIconButton
									onClick={() => {
										setIsDeleteInitialized(true);
									}}
									color={"var(--color-red)"}
									icon={icon.faTrash}
								/>
							</span>
						)}
					</CustomDialogHeader>
					<CustomDialogContent dividers>
						<div className={styles.courtInformation__block}>
							<div className={styles.courtType}>{court.type} Court</div>
							<div>
								<span className={styles.courtHelperText}>Ammount of courts:</span>
								{court.ammountOfCourts}
							</div>
							<div>
								<span className={styles.courtHelperText}>Price:</span>
								{(court.price && `${court.price}€`) || "Free"}
							</div>
							{court.groups?.length > 0 ? (
								<div>
									<span className={styles.courtHelperText}>Number of groups:</span>
									{court.groups.length}
								</div>
							) : (
								<div className={styles.addGroup}>
									<div className={styles.noGroup}>There is no groups!</div>
									<div>
										Do you want to create one?
										<CustomButton
											className={styles.addGroupButton}
											onClick={handleOpen}
											color="green"
										>
											Click me
										</CustomButton>
									</div>
								</div>
							)}
						</div>
						{court.photo && <img className={styles.courtImage} src={court.photo} alt="Court" />}
						{Array.isArray(groups) && groups.length > 0 && (
							<CustomTableContainer>
								<CustomTable stickyHeader>
									<CustomTableHead>
										<CustomTableRow>
											<CustomTableCell header>Appointment time</CustomTableCell>
											<CustomTableCell header>Participants</CustomTableCell>
											<CustomTableCell header>Equipment</CustomTableCell>
										</CustomTableRow>
									</CustomTableHead>
									<CustomTableBody>
										{groups.map((row) => (
											<CustomTableRow key={row._id}>
												<CustomTableCell>
													<div>{convertTime(row.appointmentTime).date}</div>
													<div>Time: {convertTime(row.appointmentTime).time}</div>
												</CustomTableCell>
												<CustomTableCell>{`${row.participants.length}/${row.maxParticipants}`}</CustomTableCell>
												<CustomTableCell>
													<CustomCheckbox disabled checked={row.equipment} />
												</CustomTableCell>
											</CustomTableRow>
										))}
									</CustomTableBody>
								</CustomTable>
							</CustomTableContainer>
						)}
					</CustomDialogContent>
					<CustomDialogFooter>
						<CustomButton onClick={handleOpen} color="green">
							Add
						</CustomButton>
						<CustomButton onClick={onClose} color="red">
							Close
						</CustomButton>
					</CustomDialogFooter>
				</CustomDialog>
				<AddGroup open={open} onClose={handleClose} court={court} />
				<UpdateCourt
					onUpdateCourt={onUpdateCourt}
					open={isUpdateWindowOpen}
					onClose={onCloseUpdateWindow}
					oldCourt={court}
				/>
				<CustomDialog open={isDeleteInitialized} onClose={() => setIsDeleteInitialized(false)}>
					<CustomDialogHeader> Are you sure you want to delete this court?</CustomDialogHeader>
					<CustomDialogFooter>
						<CustomButton className={styles.cancelButton} onClick={() => setIsDeleteInitialized(false)}>
							Cancel
						</CustomButton>
						<CustomButton
							color="red"
							onClick={() => {
								setIsDeleteInitialized(false);
								onDelete(court._id);
							}}
						>
							Delete
						</CustomButton>
					</CustomDialogFooter>
				</CustomDialog>
			</>
		)
	);
}
