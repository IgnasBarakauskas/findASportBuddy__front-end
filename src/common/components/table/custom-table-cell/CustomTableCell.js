import { TableCell } from "@material-ui/core";
import styles from "./CustomTableCell.module.css";
import React from "react";

const CustomTableCell = ({ children, className = "", align = "inherit", header }) => {
	const cellClassName = `${header ? styles.headerCell : styles.regularCell} ${className}`;
	return (
		<TableCell align={align} className={cellClassName}>
			{children}
		</TableCell>
	);
};

export default CustomTableCell;
