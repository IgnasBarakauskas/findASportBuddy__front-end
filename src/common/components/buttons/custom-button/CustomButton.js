import { Button } from "@material-ui/core";
import React from "react";
import styles from "./CustomButton.module.css";

const CustomButton = ({ children, color = "green", contained = false, onClick, disabled = false, className = "" }) => {
	return (
		<Button
			disabled={disabled}
			onClick={onClick}
			className={`${(contained && styles.button__contained) || styles.button} ${className}`}
			data-color={color}
		>
			{children}
		</Button>
	);
};

export default CustomButton;
