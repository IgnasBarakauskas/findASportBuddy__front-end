import { FormControl, InputLabel, Select, TextField } from "@material-ui/core";
import React from "react";
import {
	CustomButton,
	CustomDialog,
	CustomDialogContent,
	CustomDialogFooter,
	CustomDialogHeader,
	Form
} from "../../../../common/components";
import styles from "./NewCourtDialog.module.css";

export default function NewCourtDialog({ coordinates, errors, onClose, onAddAtributes, court, onAddCourt }) {
	return (
		<>
			<Form>
				<CustomDialog open={Array.isArray(coordinates) && !!coordinates[0]} onClose={onClose}>
					<CustomDialogHeader>Add a new court</CustomDialogHeader>
					<CustomDialogContent className={styles.dialog__content} dividers>
						<div className={styles.formBox}>
							<FormControl className={styles.input} variant="outlined">
								<InputLabel htmlFor="type">Type:</InputLabel>
								<Select
									fullWidth
									native
									required
									value={court?.type}
									onChange={(e) => onAddAtributes(e, "type")}
									label="Type"
									inputProps={{
										name: "type",
										id: "type"
									}}
								>
									<option aria-label="None" value="" />
									<option value="basketball">Basketball</option>
									<option value="golf">Golf</option>
									<option value="football">Football</option>
									<option value="volleyball">VolleyBall</option>
								</Select>
							</FormControl>
							{errors?.type && <span className={styles.errorMessage}>*{errors.type}</span>}
							<div>
								<TextField
									className={styles.input}
									required
									value={court?.ammountOfCourts}
									label="Ammount of courts:"
									variant="outlined"
									onChange={(e) => onAddAtributes(e, "ammountOfCourts")}
									type="number"
								/>
							</div>
							{errors?.ammountOfCourts && (
								<span className={styles.errorMessage}>*{errors.ammountOfCourts}</span>
							)}
							<div>
								<TextField
									value={court?.price}
									className={styles.input}
									required
									onChange={(e) => onAddAtributes(e, "price")}
									label="Price in €:"
									variant="outlined"
									type="number"
								/>
							</div>
							{errors?.price && <span className={styles.errorMessage}>*{errors.price}</span>}
							<div>
								<div className={styles.input__text}>Choose a picture of court:</div>
								<TextField
									onChange={(e) => onAddAtributes(e, "photo")}
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
						<CustomButton color="green" onClick={onAddCourt}>
							Submit
						</CustomButton>
					</CustomDialogFooter>
				</CustomDialog>
			</Form>
		</>
	);
}
