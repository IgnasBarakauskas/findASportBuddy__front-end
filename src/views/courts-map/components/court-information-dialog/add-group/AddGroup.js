import { TextField } from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";
import React, { useState } from "react";
import {
	CustomDialog,
	CustomDialogContent,
	CustomDialogFooter,
	CustomDialogHeader,
	CustomCheckbox,
	CustomButton
} from "../../../../../common/components";
import { addGroup } from "../../../../../services/groupServices";
import { dateTimeUtils, getTokenData } from "../../../../../utils";
import styles from "./AddGroup.module.css";

const AddGroup = ({ open = false, onClose = null, court = null }) => {
	const [appointmentTime, setAppointmentTime] = useState(dateTimeUtils({ year: 0 }, true));
	const [maxParticipants, setMaxParticipants] = useState(0);
	const [haveEquipment, setHaveEquipment] = useState(false);
	const [errors, setErrors] = useState({});
	const handleTimeSelect = (e) => {
		const value = e._d;
		let newErrors = { ...errors };
		setAppointmentTime(value);
		if (value > dateTimeUtils({ year: 0 }, true)) {
			newErrors.appointmentTime = "";
		} else {
			newErrors.appointmentTime = "Meeting must be created at least 1h before actual meeting";
		}
		setErrors(newErrors);
	};
	const handleEquipment = (e) => {
		setHaveEquipment(e.target.checked);
	};
	const handleMaxParticipants = (e) => {
		const value = e.target.value;
		let newErrors = { ...errors };
		setMaxParticipants(e.target.value);
		if (value >= 2) {
			newErrors.maxParticipants = "";
		} else {
			newErrors.maxParticipants = "Event must have at least 2 participants";
		}
		setErrors(newErrors);
	};
	const fetchData = async () => {
		return addGroup(getTokenData()._id, court._id, {
			sport: court.type,
			equipment: haveEquipment,
			latitude: court.latitude,
			longitude: court.longitude,
			appointmentTime,
			maxParticipants
		});
	};
	const handleSubmit = () => {
		if (
			!errors.maxParticipants &&
			!errors.appointmentTime &&
			!errors.haveEquipment &&
			court &&
			maxParticipants &&
			appointmentTime
		) {
			fetchData()
				.then(() => onClose())
				.catch((err) => {
					console.error(err);
				});
		}
	};
	return (
		court && (
			<CustomDialog stickyHeader open={open} onClose={onClose}>
				<CustomDialogHeader className={styles.addGroupDialog}>Create a sport group</CustomDialogHeader>
				<CustomDialogContent className={styles.dialog__content} dividers>
					<div className={styles.formBox}>
						<div className={styles.formField}>
							<DateTimePicker
								ampm={false}
								value={appointmentTime}
								label="Time of appointment"
								onChange={handleTimeSelect}
								minDateMessage={"You need to choose future time"}
								disablePast
							/>
							{errors.appointmentTime && (
								<span className={styles.errorMessage}>*{errors.appointmentTime}</span>
							)}
						</div>
						<div className={styles.formField}>
							<span>Do you have equipment:</span>
							<CustomCheckbox checked={haveEquipment} onChange={handleEquipment} />
						</div>
						<div className={styles.formField}>
							<TextField
								className={styles.input}
								required
								value={maxParticipants}
								label="Maximum participants with you:"
								variant="outlined"
								onChange={handleMaxParticipants}
								type="number"
							/>
						</div>
						{errors.maxParticipants && (
							<span className={styles.errorMessage}>*{errors.maxParticipants}</span>
						)}
					</div>
				</CustomDialogContent>
				<CustomDialogFooter>
					<CustomButton color="green" onClick={handleSubmit}>
						Create
					</CustomButton>
					<CustomButton color="red" onClick={onClose}>
						Cancel
					</CustomButton>
				</CustomDialogFooter>
			</CustomDialog>
		)
	);
};

export default AddGroup;
