import React, { useEffect, useState } from "react";
import { deleteUser, getUser, updateUser } from "../../services/userServices";
import { getTokenData } from "../../utils";
import styles from "./Profile.module.css";
import profileImage from "../../common/images/profile.png";
import { TextField } from "@material-ui/core";
import {
	CustomButton,
	CustomDialog,
	CustomDialogContent,
	CustomDialogFooter,
	CustomDialogHeader
} from "../../common/components";
import getBase64 from "../../utils/file-convert/fileConvert";

const Profile = () => {
	const [user, setUser] = useState("");
	const [errors, setErrors] = useState("");
	const [dialogTitle, setDialogTitle] = useState("");
	const [rePassword, setRePassword] = useState("");
	const [password, setpassword] = useState("");
	const [wait, setWait] = useState("");
	useEffect(() => {
		if (!dialogTitle) {
			fetchUserData().then((data) => {
				setUser(data.data);
			});
		}
	}, [dialogTitle]);
	const fetchUserData = () => {
		return getUser(getTokenData()._id);
	};
	const fetchUpdateUser = async (data) => {
		return updateUser(user._id, data);
	};
	const fetchDeleteUser = async (data) => {
		return deleteUser(user._id, data);
	};
	const handleDelete = () => {
		fetchDeleteUser({ currentPassword: password })
			.then(() => {
				localStorage.removeItem("token");
				window.location.href = "/";
			})
			.catch((err) => {
				console.error(err);
			});
	};
	const handleUpdateUser = () => {
		setWait("We are updating your profile...");
		if (
			(user.fullName && !errors.fullName) ||
			(user.password && !errors.password && rePassword) ||
			(user.height && !errors.height) ||
			(user.weight && !errors.weight) ||
			(user.photo && !errors.photo)
		) {
			if (rePassword) {
				fetchUpdateUser({
					currentPassword: password,
					fullName: user.fullName,
					height: user.height,
					newPassword: user.password,
					weight: user.weight,
					photo: user.photo
				})
					.then(() => {
						handleCloseDialog();
						setWait("");
					})
					.catch((err) => {
						console.error(err);
					});
			} else {
				fetchUpdateUser({
					currentPassword: password,
					fullName: user.fullName,
					height: user.height,
					weight: user.weight,
					photo: user.photo
				})
					.then(() => {
						handleCloseDialog();
						setWait("");
					})
					.catch((err) => {
						console.error(err);
					});
			}
		}
	};
	const handleChange = (e, type) => {
		const newUser = { ...user };
		const newErrors = { ...errors };
		const { value } = e.target;
		switch (type) {
			case "fullName":
				newUser.fullName = value;
				if (value.length > 5) {
					newErrors.fullName = "";
				} else {
					newErrors.fullName = "At least 6 letters";
				}
				break;
			case "picture":
				getBase64(e.target.files[0], (result) => {
					newUser.photo = result;
				});
				if (e.target.files[0].type.includes("image")) {
					newErrors["photo"] = "";
				} else {
					newErrors["photo"] = "File must be an image";
				}
				break;
			case "height":
				newUser.height = value;
				if (value > 50 && value < 250) {
					newErrors.height = "";
				} else {
					newErrors.height = "Enter a valid height";
				}
				break;
			case "weight":
				newUser.weight = value;
				if (value > 20 && value < 300) {
					newErrors.weight = "";
				} else {
					newErrors.weight = "Enter a valid weight";
				}
				break;
			case "password":
				newUser.password = value;
				if (value.length > 5) {
					newErrors.password = "";
				} else {
					newErrors.password = "At least 6 letters";
				}
				break;
			case "rePassword":
				setRePassword(value);
				if (value === user.password) {
					newErrors.rePassword = "";
				} else {
					newErrors.rePassword = "Passwords must match";
				}
				break;
			default:
				break;
		}
		setErrors(newErrors);
		setUser(newUser);
	};
	const handleConfirmPassword = (e) => {
		setpassword(e.target.value);
	};
	const handleOpenDialog = (value) => {
		setDialogTitle(value);
	};
	const handleCloseDialog = () => {
		setDialogTitle("");
	};
	return (
		<>
			<div className={styles.mainContainer}>
				<div className={styles.profile}>
					<span className={styles.profileImageContainer}>
						<img
							className={styles.profileImageContainer__image}
							src={user.photo ? user.photo : profileImage}
							alt="profile"
						/>
					</span>
					<span className={styles.profileInfo}>
						<div>
							<span className={styles.profileInfo__title}>Full name: </span>
							<span className={styles.profileInfo__info}>{user.fullName}</span>
						</div>
						<div>
							<span className={styles.profileInfo__title}>Email: </span>
							<span className={styles.profileInfo__info}>{user.email}</span>
						</div>
						<div>
							<span className={styles.profileInfo__title}>Height: </span>
							<span className={styles.profileInfo__info}>{`${user.height ? user.height : "-"} cm`}</span>
						</div>
						<div>
							<span className={styles.profileInfo__title}>Height: </span>
							<span className={styles.profileInfo__info}>{`${user.weight ? user.weight : "-"} kg`}</span>
						</div>
					</span>
				</div>
				<div className={styles.infoFields}>
					<div className={styles.inputBlock}>
						<div className={styles.input__title}>Your full name: </div>
						<TextField
							onChange={(e) => handleChange(e, "fullName")}
							value={user.fullName}
							variant="outlined"
						/>
						{errors.fullName ? (
							<span className={styles.errorMessage}>*{errors.fullName}</span>
						) : (
							<span className={styles.infoMessage}>*This field id optional</span>
						)}
					</div>
					<div className={styles.inputBlock}>
						<div className={styles.input__title}>Your profile picture: </div>
						<TextField onChange={(e) => handleChange(e, "picture")} type="file" variant="outlined" />
						{errors.photo ? (
							<span className={styles.errorMessage}>*{errors.photo}</span>
						) : (
							<span className={styles.infoMessage}>*This field id optional</span>
						)}
					</div>
				</div>
				<div className={styles.infoFields}>
					<div className={styles.inputBlock}>
						<div className={styles.input__title}>Your height in cm: </div>
						<TextField
							onChange={(e) => handleChange(e, "height")}
							value={user.height}
							type="number"
							variant="outlined"
						/>
						{errors.height ? (
							<span className={styles.errorMessage}>*{errors.height}</span>
						) : (
							<span className={styles.infoMessage}>*This field id optional</span>
						)}
					</div>
					<div className={styles.inputBlock}>
						<div className={styles.input__title}>Your weight in kg: </div>
						<TextField
							onChange={(e) => handleChange(e, "weight")}
							value={user.weight}
							type="number"
							variant="outlined"
						/>
						{errors.weight ? (
							<span className={styles.errorMessage}>*{errors.weight}</span>
						) : (
							<span className={styles.infoMessage}>*This field id optional</span>
						)}
					</div>
				</div>
				<div className={styles.infoFields__last}>
					<div className={styles.inputBlock}>
						<div className={styles.input__title}>New password: </div>
						<TextField onChange={(e) => handleChange(e, "password")} type="password" variant="outlined" />
						{errors.password ? (
							<span className={styles.errorMessage}>*{errors.password}</span>
						) : (
							<span className={styles.infoMessage}>*This field id optional</span>
						)}
					</div>
					<div className={styles.inputBlock}>
						<div className={styles.input__title}>Re-enter new password: </div>
						<TextField onChange={(e) => handleChange(e, "rePassword")} type="password" variant="outlined" />
						{errors.rePassword ? (
							<span className={styles.errorMessage}>*{errors.rePassword}</span>
						) : (
							<span className={styles.infoMessage}>*This field id optional</span>
						)}
					</div>
				</div>
				<div className={styles.buttons}>
					<CustomButton
						onClick={() => {
							handleOpenDialog("delete");
						}}
						className={styles.deleteButton}
						contained
						color="red"
					>
						Delete
					</CustomButton>
					<CustomButton
						onClick={() => {
							handleOpenDialog("update");
						}}
						contained
						color="green"
					>
						Update
					</CustomButton>
				</div>
			</div>
			<CustomDialog open={!!dialogTitle} onClose={handleCloseDialog}>
				<CustomDialogHeader>
					{dialogTitle === "update"
						? "Are you sure you want to update your profile"
						: "Are you sure you want to delete your profile"}
				</CustomDialogHeader>
				<CustomDialogContent>
					<span className={styles.confirmDialog}>To confirm write your password: </span>
					<TextField
						value={password}
						onChange={(e) => handleConfirmPassword(e)}
						type="password"
						variant="outlined"
					/>
					{wait && <div className={styles.infoMessageLoading}>{wait}</div>}
				</CustomDialogContent>
				<CustomDialogFooter>
					<CustomButton
						onClick={dialogTitle === "update" ? () => handleUpdateUser() : () => handleDelete()}
						color={dialogTitle === "update" ? "green" : "red"}
					>
						{dialogTitle}
					</CustomButton>
				</CustomDialogFooter>
			</CustomDialog>
		</>
	);
};

export default Profile;
