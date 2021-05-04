import { Card } from "@material-ui/core";
import React from "react";
import styles from "./Form.module.css";

const Form = ({ children }) => {
	return <Card className={styles.card}>{children}</Card>;
};
export default Form;
