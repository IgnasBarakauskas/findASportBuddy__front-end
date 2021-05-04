/* eslint-disable no-useless-escape */
import { makeStyles, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { CustomButton, Form, FormContent, FormFooter, FormHeader } from "../../common/components";
import { RegisterUser } from "../../services/userServices.js";
import { dateUtils } from "../../utils/";
import styles from "./Register.module.css";

const useStyles = makeStyles({
	root: {
		background: "var(--color-white)",
		width: "100%"
	},
	input: {
		color: "var(--color-black)"
	}
});

const Register = (props) => {
	const [errors, setErrors] = useState({});
	const [user, setUser] = useState({});

	const classes = useStyles();
	const minDate = dateUtils({ year: -16 });

	const fetchData = async () => {
		return RegisterUser(user);
	};

	const handleRegister = () => {
		if (
			!errors.fullName &&
			!errors.email &&
			!errors.birthdayDate &&
			!errors.errPassword &&
			!errors.rePassword &&
			user.fullName &&
			user.email &&
			user.birthdayDate &&
			user.password
		) {
			fetchData()
				.then(() => {
					props.history.push("/login");
				})
				.catch((err) => {
					console.error(err);
				});
		}
	};

	const handleEmailCheck = (e) => {
		const value = e.target.value;
		let error = errors;
		let userTemp = { ...user };
		// eslint-disable-next-line max-len
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!regex.test(value)) {
			error = { ...error, email: "Email must be a valid email" };
			setErrors(error);
		} else {
			error = { ...error, email: "" };
			userTemp = { ...userTemp, email: value };
			setErrors(error);
			setUser(userTemp);
		}
	};
	const handleFullNameCheck = (e) => {
		const value = e.target.value;
		let error = errors;
		let userTemp = { ...user };
		if (value.length < 6) {
			error = {
				...error,
				fullName: "Full name must be at least 6 characters length"
			};
			setErrors(error);
		} else {
			error = { ...error, fullName: "" };
			userTemp = { ...userTemp, fullName: value };
			setErrors(error);
			setUser(userTemp);
		}
	};
	const handleBirthdayDateCheck = (e) => {
		const value = e.target.value;
		let error = errors;
		let userTemp = { ...user };
		if (value > minDate) {
			error = {
				...error,
				birthdayDate: "You must be at least 16 years old"
			};
			setErrors(error);
		} else {
			error = { ...error, birthdayDate: "" };
			userTemp = { ...userTemp, birthdayDate: value };
			setErrors(error);
			setUser(userTemp);
		}
	};
	const handlePasswordCheck = (e) => {
		const value = e.target.value;
		let error = errors;
		let userTemp = { ...user };
		if (value.length < 6) {
			error = {
				...error,
				errPassword: "Password must be 6 characters length"
			};
			setErrors(error);
		} else {
			error = { ...error, errPassword: "" };
			userTemp = { ...userTemp, password: value };
			setErrors(error);
			setUser(userTemp);
		}
	};
	const handleRePasswordCheck = (e) => {
		const value = e.target.value;
		let error = errors;
		let userTemp = { ...user };
		if (value !== user.password) {
			error = {
				...error,
				rePassword: "Password must match"
			};
			setErrors(error);
		} else {
			error = { ...error, rePassword: "" };
			setErrors(error);
			setUser(userTemp);
		}
	};
	return (
		<Form>
			<FormHeader title="Register" />
			{
				<FormContent>
					<Typography className={styles.cardContent__typography}>FullName</Typography>
					<TextField
						className={classes.root}
						required
						InputProps={{
							className: classes.input
						}}
						onChange={(event) => handleFullNameCheck(event)}
						placeholder="Name Surname"
						variant="outlined"
						type="email"
					/>
					{errors.fullName && <span className={styles.errorMessage}>*{errors.fullName}</span>}
					<Typography className={styles.cardContent__typography}>Email</Typography>
					<TextField
						className={classes.root}
						required
						InputProps={{
							className: classes.input
						}}
						onChange={(event) => handleEmailCheck(event)}
						placeholder="Email@mail.com"
						variant="outlined"
						type="email"
					/>
					{errors.email && <span className={styles.errorMessage}>*{errors.email}</span>}
					<Typography className={styles.cardContent__typography}>Birthday Date</Typography>
					<TextField
						className={classes.root}
						required
						onChange={(event) => handleBirthdayDateCheck(event)}
						InputProps={{
							className: classes.input,
							inputProps: { min: "1900-01-01", max: minDate }
						}}
						variant="outlined"
						type="date"
					/>
					{errors.birthdayDate && <span className={styles.errorMessage}>*{errors.birthdayDate}</span>}
					<Typography className={styles.cardContent__typography}>Password</Typography>
					<TextField
						className={classes.root}
						required
						InputProps={{
							className: classes.input
						}}
						onChange={(event) => handlePasswordCheck(event)}
						placeholder="Password"
						variant="outlined"
						type="password"
					/>
					{errors.errPassword && <span className={styles.errorMessage}>*{errors.errPassword}</span>}
					<Typography className={styles.cardContent__typography}>Re-Password</Typography>
					<TextField
						className={classes.root}
						required
						InputProps={{
							className: classes.input
						}}
						onChange={(event) => handleRePasswordCheck(event)}
						placeholder="Password"
						variant="outlined"
						type="password"
					/>
					{errors.rePassword && <span className={styles.errorMessage}>*{errors.rePassword}</span>}
					<FormFooter>
						<CustomButton color="green" contained onClick={handleRegister}>
							Register
						</CustomButton>
					</FormFooter>
				</FormContent>
			}
		</Form>
	);
};

export default Register;
