import { TableHead } from "@material-ui/core";
import React from "react";

const CustomTableHead = ({ children, className = "" }) => {
	return <TableHead className={className}>{children}</TableHead>;
};

export default CustomTableHead;
