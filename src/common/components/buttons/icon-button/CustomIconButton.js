import { Button } from "@material-ui/core";
import React from "react";
import { CustomIcon } from "../../icon";
import styles from "./CustomIconButton.module.css";

const CustomIconButton = ({ onClick, icon, size, color, className = "" }) => {
	return (
		<Button className={`${styles.button} ${className}`} onClick={onClick}>
			<CustomIcon size={size} className={styles.button__icon} icon={icon} color={color} />
		</Button>
	);
};
export default CustomIconButton;
