import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState } from "react";
import ReactMapGl, { Marker } from "react-map-gl";
import { CustomIcon, icon } from "../icon";
import styles from "./Map.module.css";
const Map = ({
	centerLat = 54.898946,
	centerLng = 23.883987,
	zoom = 15,
	width = "600px",
	height = "600px",
	onClick = null,
	onMarkerClick = null,
	courts = []
}) => {
	const [viewPort, setViewPort] = useState({
		latitude: centerLat,
		longitude: centerLng,
		zoom: zoom,
		width: width,
		height: height
	});
	const CourtIcon = (court) => {
		switch (court) {
			case "me":
				return <CustomIcon size="lg" icon={icon.faChild} />;
			case "basketball":
				return <CustomIcon size="lg" color="#E15E27" icon={icon.faBasketballBall} />;
			case "golf":
				return <CustomIcon size="lg" bordered color="white" icon={icon.faGolfBall} />;
			case "football":
				return <CustomIcon size="lg" icon={icon.faFutbol} />;
			case "volleyball":
				return <CustomIcon size="lg" bordered color="white" icon={icon.faVolleyballBall} />;
			default:
				break;
		}
	};
	return (
		<ReactMapGl
			{...viewPort}
			className={styles.mapBox}
			mapboxApiAccessToken={process.env.REACT_APP_KEY_MAPBOX}
			onViewportChange={(viewPort) => {
				setViewPort(viewPort);
			}}
			mapStyle="mapbox://styles/sp1ash/cklsgwhqp1grn17lqjteu4i90"
			onClick={(e) => {
				onClick(e);
			}}
		>
			{Array.isArray(courts) &&
				courts.length > 0 &&
				courts.map(
					(court) =>
						court.latitude &&
						court.longitude && (
							<Marker
								className={styles.marker}
								key={court._id || court.type}
								onClick={() => onMarkerClick(court.type, court._id)}
								latitude={court.latitude}
								longitude={court.longitude}
							>
								{CourtIcon(court.type)}
							</Marker>
						)
				)}
		</ReactMapGl>
	);
};

export default Map;
