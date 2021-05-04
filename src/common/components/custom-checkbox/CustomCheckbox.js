import { Checkbox } from "@material-ui/core";
import React from "react";
import styles from "./CustomCheckbox.module.css";
const CustomCheckbox = ({ checked = false, onChange = null, disabled = false }) => {
	return (
		<Checkbox
			className={disabled ? styles.checkbox : ""}
			disableRipple={disabled}
			checked={checked}
			style={{ color: "var(--color-darkgreen)" }}
			onChange={onChange}
		/>
	);
};

export default CustomCheckbox;
