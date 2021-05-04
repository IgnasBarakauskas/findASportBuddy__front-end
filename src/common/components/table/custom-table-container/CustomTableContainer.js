import { TableContainer } from "@material-ui/core";
import React from "react";
import styles from "./CustomTableContainer.module.css";

const CustomTableContainer = ({ children, className = "" }) => {
	return <TableContainer className={`${styles.tableContainer} ${className}`}>{children}</TableContainer>;
};

export default CustomTableContainer;
