import { CardActions } from "@material-ui/core";
import React from "react";
import styles from "./FormFooter.module.css";

const FormFooter = ({ children }) => {
	return <CardActions className={styles.footer}>{children}</CardActions>;
};

export default FormFooter;
