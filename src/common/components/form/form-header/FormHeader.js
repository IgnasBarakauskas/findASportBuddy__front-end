import { CardHeader } from "@material-ui/core";
import React from "react";
import styles from "./FormHeader.module.css";

const FormHeader = ({ title }) => {
	return <CardHeader className={styles.header} title={title}></CardHeader>;
};

export default FormHeader;
