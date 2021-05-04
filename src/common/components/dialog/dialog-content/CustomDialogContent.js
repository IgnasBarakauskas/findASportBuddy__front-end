import { DialogContent } from "@material-ui/core";
import React from "react";
import styles from "./CustomDialogContent.module.css";

const CustomDialogContent = ({ children, className = "", dividers = false }) => {
	return (
		<DialogContent dividers={dividers} className={`${styles.dialogContent} ${className}`}>
			<div>{children}</div>
		</DialogContent>
	);
};

export default CustomDialogContent;
