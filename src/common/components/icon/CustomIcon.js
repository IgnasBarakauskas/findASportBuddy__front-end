import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./CustomIcon.module.css";
const CustomIcon = ({ icon, size, color, bordered, className }) => {
	return (
		<FontAwesomeIcon
			icon={icon}
			size={size}
			color={color}
			className={`${bordered && styles.bordered} ${className}`}
		/>
	);
};

export default CustomIcon;
