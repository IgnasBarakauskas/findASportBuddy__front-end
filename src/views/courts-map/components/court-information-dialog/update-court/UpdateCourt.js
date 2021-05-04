import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import {
	CustomButton,
	CustomDialog,
	CustomDialogContent,
	CustomDialogFooter,
	CustomDialogHeader,
	Form
} from "../../../../../common/components";
import { getBase64 } from "../../../../../utils";
import styles from "./UpdateCourt.module.css";

const UpdateCourt = ({ open, onClose = null, onUpdateCourt = null, oldCourt = null }) => {
	const [newCourt, setNewCourt] = useState(oldCourt);
	const [errors, setNewErrors] = useState(null);

	const handleAddAtribute = (e, type) => {
		let newCourtData = { ...newCourt };
		let newCourtError = { ...errors };
		const { value } = e.target;
		switch (type) {
			case "ammountOfCourts":
				newCourtData.ammountOfCourts = value;
				if (value >= 1) {
					newCourtError["ammountOfCourts"] = "";
				} else {
					newCourtError["ammountOfCourts"] = "Place must have at least one Court";
				}
				break;
			case "price":
				newCourtData.price = value;
				if (value && value >= 0) {
					newCourtError["price"] = "";
				} else {
					newCourtError["price"] = "Price must be a valid positive number";
				}
				break;
			case "photo":
				getBase64(e.target.files[0], (result) => {
					newCourtData.photo = result;
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
		setNewCourt(newCourtData);
		setNewErrors(newCourtError);
	};
	return (
		newCourt && (
			<Form>
				<CustomDialog open={open} onClose={onClose}>
					<CustomDialogHeader>Update court information</CustomDialogHeader>
					<CustomDialogContent className={styles.dialog__content} dividers>
						<div className={styles.formBox}>
							<div>
								<TextField
									value={newCourt.ammountOfCourts}
									className={styles.input}
									required
									onChange={(e) => handleAddAtribute(e, "ammountOfCourts")}
									label="Ammount of courts:"
									variant="outlined"
									type="number"
								/>
							</div>
							{errors?.ammountOfCourts && (
								<span className={styles.errorMessage}>*{errors.ammountOfCourts}</span>
							)}
							<div>
								<TextField
									value={newCourt.price}
									className={styles.input}
									required
									onChange={(e) => handleAddAtribute(e, "price")}
									label="Price in €:"
									variant="outlined"
									type="number"
								/>
							</div>
							{errors?.price && <span className={styles.errorMessage}>*{errors.price}</span>}
							<div>
								<div className={styles.input__text}>Choose a picture of court:</div>
								<TextField
									onChange={(e) => handleAddAtribute(e, "photo")}
									className={styles.input}
									required
									variant="outlined"
									type="file"
								/>
							</div>
							{errors?.photo && <span className={styles.errorMessage}>*{errors.photo}</span>}
						</div>
					</CustomDialogContent>
					<CustomDialogFooter>
						<CustomButton color="red" onClick={onClose}>
							Close
						</CustomButton>
						<CustomButton
							color="green"
							disabled={errors?.price || errors?.ammountOfCourts || errors?.price}
							onClick={() => onUpdateCourt(newCourt)}
						>
							Update
						</CustomButton>
					</CustomDialogFooter>
				</CustomDialog>
			</Form>
		)
	);
};

export default UpdateCourt;
