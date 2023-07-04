import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L, { LatLng } from "leaflet";
import "leaflet.heat";
import { addressPoints } from "./data";


export default function MapTest() {
  useEffect(() => {
    var map = L.map("map").setView([-37.87, 175.475], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const points : LatLng[] = addressPoints
      ? addressPoints.map((p) => {
          return [p[0] as number, p[1] as number] as unknown as LatLng;
        })
      : [];

    L.heatLayer(points, { radius: 25 }).addTo(map);
  }, []);

  return <div id="map" style={{ height: "100vh" }}></div>;
}
