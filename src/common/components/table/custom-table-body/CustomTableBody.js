import { TableBody } from "@material-ui/core";
import React from "react";

const CustomTableBody = ({ children, className = "" }) => {
	return <TableBody className={className}>{children}</TableBody>;
};

export default CustomTableBody;
