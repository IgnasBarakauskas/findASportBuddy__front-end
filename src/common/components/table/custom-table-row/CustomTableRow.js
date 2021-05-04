import { TableRow } from "@material-ui/core";
import React from "react";

const CustomtableRow = ({ children, hover = false, className = "" }) => {
	return (
		<TableRow className={className} hover={hover}>
			{children}
		</TableRow>
	);
};

export default CustomtableRow;
