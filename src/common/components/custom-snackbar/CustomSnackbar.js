import { Snackbar } from "@material-ui/core";
import styles from "./CustomSnackbar.module.css";
import React from "react";

const CustomSnackbar = ({ onClose, color = "success", message = "" }) => {
	return (
		<Snackbar
			autoHideDuration={5000}
			open={!!color}
			onClose={onClose}
			data-color={color}
			className={styles.snackbar}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
		>
			<div data-color={color} className={styles.snackbarContent}>
				{message}
			</div>
		</Snackbar>
	);
};

export default CustomSnackbar;
