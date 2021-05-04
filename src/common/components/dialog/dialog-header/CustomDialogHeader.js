import { DialogTitle } from "@material-ui/core";
import React from "react";
import styles from "./CustomDialogHeader.module.css";
const CustomDialogHeader = ({ children, className = "" }) => {
	return <DialogTitle className={`${styles.dialogTitle} ${className}`}>{children}</DialogTitle>;
};

export default CustomDialogHeader;
