import { CourtsMap, Login, Register, Main, Profile } from "./views";
import React, { useState, useEffect } from "react";
import { Redirect, Switch, Route } from "react-router";
import { NavBar } from "./common/components";
import styles from "./App.module.css";
import { getTokenData } from "./utils";
import YourGroups from "./views/your-groups/YourGroups";

const App = () => {
	const [user, setUser] = useState(null);
	useEffect(() => {
		setUser(getTokenData());
	}, []);
	return (
		<>
			<NavBar />
			<div className={styles.backGround}>
				<Switch>
					{user === "token expired" && <Route exact path={"/login"} component={Login} />}
					{user === "token expired" && <Route exact path="/register" component={Register} />}
					{user?._id && <Route path="/courts-map" component={CourtsMap} />}
					{user?._id && <Route path="/your-groups" component={YourGroups} />}
					{user?._id && <Route path="/profile" component={Profile} />}
					{user?.role && <Route exact path="/" component={Main} />}
					{user === "token expired" && <Redirect exact to="/login" />}
				</Switch>
			</div>
		</>
	);
};

export default App;
