import { CardContent } from "@material-ui/core";
import styles from "./FormContent.module.css";
const FormContent = ({ children }) => {
	return <CardContent className={styles.content}>{children}</CardContent>;
};

export default FormContent;
