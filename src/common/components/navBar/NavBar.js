import { AppBar, Toolbar } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { CustomIcon, icon } from "../icon";
import { deleteToken, getTokenData } from "../../../utils/token-utils/getToken";
import { getUser } from "../../../services/userServices";

const NavBar = () => {
	const [user, setUser] = useState(null);
	const [userData, setUserData] = useState(null);
	useEffect(() => {
		setUser(getTokenData());
	}, []);
	const fetchUserData = () => {
		return getUser(user._id);
	};
	useEffect(() => {
		if (user) {
			fetchUserData().then((data) => setUserData(data.data));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);
	const handleLogout = () => {
		deleteToken();
	};
	return (
		<AppBar className={styles.navBar} position="static">
			<Toolbar>
				<Link className={styles.navBar__button} to="/">
					<CustomIcon
						icon={icon.faHandshake}
						size="2x"
						color={"var(--color-white)"}
						className={styles.icon}
					/>
				</Link>
				<div className={styles.mainRoutes}>
					{user?._id && (
						<Link className={styles.navBar__button} to="/courts-map">
							Map
						</Link>
					)}
					{user?._id && (
						<Link className={styles.navBar__button} to="/your-groups">
							Your groups
						</Link>
					)}
				</div>

				<div className={styles.secondaryMenu}>
					{user?.role && (
						<>
							<Link className={styles.profile} to="/profile">
								{userData?.photo ? (
									<img className={styles.profile__image} src={userData.photo} alt="profile" />
								) : (
									<span className={styles.profile__letter}>{user.name[0]}</span>
								)}
							</Link>
							<a
								href="/"
								className={`${styles.navBar__button} ${
									userData?.photo && styles["logout--ifprofilePhoto"]
								}`}
								onClick={handleLogout}
							>
								Logout
							</a>
						</>
					)}
					{user === "token expired" && (
						<div>
							<Link className={styles.navBar__button} to="/">
								Login
							</Link>
							<Link className={styles.navBar__button} to="/register">
								Register
							</Link>
						</div>
					)}
				</div>
			</Toolbar>
		</AppBar>
	);
};
export default NavBar;
