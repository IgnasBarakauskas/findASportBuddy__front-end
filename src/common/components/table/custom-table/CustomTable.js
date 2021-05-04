import { Table } from "@material-ui/core";
import React from "react";
const CustomTable = ({ children, stickyHeader = false, dense = false, className = "" }) => {
	return (
		<Table size={dense ? "small" : "medium"} stickyHeader={stickyHeader} className={className}>
			{children}
		</Table>
	);
};

export default CustomTable;
