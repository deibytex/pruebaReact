import React, { createRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L, { LatLng } from "leaflet";
import "leaflet.heat";
type Props = {
  Data:any[];
}
const MapTest: React.FC<Props> = ({Data}) =>{
  useEffect(() => {
    var container = L.DomUtil.get('map');
    if(container != null){
        container["_leaflet_id"] = null
    }
    var map = L.map("map",{
      minZoom: 0,
      maxZoom: 18,
      zoomSnap: 0,
      zoomDelta: 0.25
    }).setView([Data[0][0], Data[0][1]], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const points : LatLng[] = Data
      ? Data.map((p) => {
          return [p[0] as number, p[1] as number] as unknown as LatLng;
        }).filter((e) =>{
          if(e[0] != null && e[1] != null)
            return e;
        })
      : [];

      // points.map((e) => {
      //   L.marker(e).addTo(map).bindPopup("AAAAAA");
      // });
    
    L.heatLayer(points, { radius: 25 }).addTo(map);
  }, [Data]);
  return <div id="map" style={{ height: "100vh" }}></div>;
}
export default MapTest;
