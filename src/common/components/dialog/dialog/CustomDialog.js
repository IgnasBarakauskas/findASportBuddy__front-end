import { Dialog } from "@material-ui/core";
import React from "react";
const CustomDialog = ({ children, onClose = null, open = false }) => {
	return (
		<Dialog maxWidth={false} open={open} onClose={onClose}>
			{children}
		</Dialog>
	);
};

export default CustomDialog;
