/* eslint-disable no-useless-escape */
import { makeStyles, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { CustomButton, CustomSnackbar, Form, FormContent, FormFooter, FormHeader } from "../../common/components";
import { AddUserLocation, LoginUser } from "../../services/userServices.js";
import { getToken } from "../../utils";
//import { getToken } from "../../utils";
import styles from "./Login.module.css";

const useStyles = makeStyles({
	root: {
		background: "var(--color-white)",
		width: "100%"
	},
	input: {
		color: "var(--color-black)"
	}
});

const Login = () => {
	const [errors, setErrors] = useState({});
	const [user, setUser] = useState({});
	const [location, setLocation] = useState({});
	const [notificationType, setNotificationType] = useState(null);
	const [notificationText, setNotificationtext] = useState(null);
	const fetchData = async () => {
		return LoginUser(user);
	};
	const AddCoordinates = async (data, token) => {
		return AddUserLocation(data, token).catch((err) => {
			console.error(err);
		});
	};
	const sucess = (pos) => {
		setLocation({
			latitude: pos.coords.latitude,
			longitude: pos.coords.longitude
		});
	};
	const error = (err) => {
		localStorage.removeItem("token");
		console.error(err);
	};
	const handleLogin = () => {
		if (!errors.email && !errors.password && user.email && user.password) {
			fetchData()
				.then((data) => {
					localStorage.setItem("token", data.data.Token);
				})
				.then(async () => {
					await AddCoordinates(location, getToken());
				})
				.then(() => {
					window.location.href = "/";
				})
				.catch((err) => {
					console.error(err);
					handleOpenNotification("danger", "Privided login data is incorrect");
				});
		}
	};
	const handleInputCheck = (e, name) => {
		const value = e.target.value;
		// eslint-disable-next-line max-len
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let error = errors;
		let userTemp = { ...user };
		switch (name) {
			case "email":
				if (!regex.test(value)) {
					error = { ...error, email: "Email must be a valid email" };
					setErrors(error);
				} else {
					error = { ...error, email: "" };
					userTemp = { ...userTemp, email: value };
					setErrors(error);
					setUser(userTemp);
				}
				break;
			case "password":
				if (value.length < 6) {
					error = {
						...error,
						password: "Password must be 6 characters length"
					};
					setErrors(error);
				} else {
					error = { ...error, password: "" };
					userTemp = { ...userTemp, password: value };
					setErrors(error);
					setUser(userTemp);
				}
				break;
			default:
		}
	};
	const handleCloseNotification = () => {
		setNotificationType(null);
		setNotificationtext(null);
	};
	const handleOpenNotification = (type, color) => {
		setNotificationType(type);
		setNotificationtext(color);
	};
	const getLocation = () => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				sucess(position);
			},
			(err) => {
				error(err);
			},
			{ enableHighAccuracy: true }
		);
	};
	const classes = useStyles();
	return (
		<Form>
			<FormHeader title="Login" />
			{
				<FormContent>
					<Typography className={styles.cardContent__typography}>Email</Typography>
					<TextField
						className={classes.root}
						required
						InputProps={{
							className: classes.input
						}}
						onChange={(event) => handleInputCheck(event, "email")}
						placeholder="Email"
						variant="outlined"
						type="email"
					/>
					{errors.email && <span className={styles.errorMessage}>*{errors.email}</span>}
					<Typography className={styles.cardContent__typography}>Password</Typography>
					<TextField
						className={classes.root}
						required
						onChange={(event) => handleInputCheck(event, "password")}
						InputProps={{
							className: classes.input
						}}
						placeholder="Password"
						variant="outlined"
						type="password"
					/>
					{errors.password && <span className={styles.errorMessage}>*{errors.password}</span>}
					<FormFooter>
						{!location.latitude && !location.longitude ? (
							<CustomButton color="green" contained className={styles.form__button} onClick={getLocation}>
								Get Location
							</CustomButton>
						) : (
							<CustomButton color="green" contained className={styles.form__button} onClick={handleLogin}>
								Login
							</CustomButton>
						)}
					</FormFooter>
				</FormContent>
			}
			<CustomSnackbar onClose={handleCloseNotification} color={notificationType} message={notificationText} />
		</Form>
	);
};

export default Login;
