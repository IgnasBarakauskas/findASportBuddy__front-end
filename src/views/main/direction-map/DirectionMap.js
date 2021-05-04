import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import styles from "./DirectionMap.module.css";
mapboxgl.accessToken = process.env.REACT_APP_KEY_MAPBOX;

class DirectionMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			zoom: 14
		};
	}
	componentDidMount() {
		const { user, court } = this.props;
		const map = new mapboxgl.Map({
			container: this.mapContainer,
			style: "mapbox://styles/sp1ash/cklsgwhqp1grn17lqjteu4i90",
			center: [user.longitude, user.latitude],
			zoom: this.state.zoom
		});
		var start = document.createElement("div");
		start.className = styles.startMarker;
		var end = document.createElement("div");
		end.className = styles.endMarker;
		new mapboxgl.Marker(start).setLngLat([user.longitude, user.latitude]).addTo(map);
		new mapboxgl.Marker(end).setLngLat([court.longitude, court.latitude]).addTo(map);
		var directions = new MapboxDirections({
			accessToken: mapboxgl.accessToken,
			unit: "metric"
		});

		map.addControl(directions, "top-left");
		map.on("load", function () {
			directions.setOrigin([user.longitude, user.latitude]);
			directions.setDestination([court.longitude, court.latitude]);
		});
	}
	render() {
		return (
			<div
				ref={(el) => {
					this.mapContainer = el;
				}}
				className={styles.map}
			/>
		);
	}
}

export default DirectionMap;
