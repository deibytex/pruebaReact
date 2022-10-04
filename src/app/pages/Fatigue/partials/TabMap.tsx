import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { datamapa } from "../dataFatigue";

export function MapTab() {


    const here = {
        apiKey: 'h7cWVY3eEiZeilhreUhv07kKMJMizDl6elWoN7cb8wg'
    }
    //h7cWVY3eEiZeilhreUhv07kKMJMizDl6elWoN7cb8wg
    const style = 'reduced.night';
    const CapaBasicNight = `https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${style}/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320`;
    const CapaHibrida = `https://2.traffic.maps.ls.hereapi.com/maptile/2.1/traffictile/newest/hybrid.traffic.day/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320`;
    const CapaTraficoDia = `https://2.traffic.maps.ls.hereapi.com/maptile/2.1/traffictile/newest/normal.traffic.day/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320`;

    const skater = new Icon({
        iconUrl: "/skateboarding.svg",
        iconSize: [25, 25]
    });

    const [activePark, setActivePark] = useState<any>(null);
    return (
        <MapContainer id="mapcontainter" center={[4.6828744, -74.1131842]} zoom={15} >
            <TileLayer
                url={CapaBasicNight}
            />
            {activePark && (
                <Popup
                    position={[
                        activePark.geometry.coordinates[1],
                        activePark.geometry.coordinates[0]
                    ]}
                    onClose={() => {
                        setActivePark(null);
                    }}
                >
                    <div>
                        <h2>{activePark.properties.NAME}</h2>
                        <p>{activePark.properties.DESCRIPTIO}</p>
                    </div>
                </Popup>
            )}
            {datamapa.features.map(park => (
                <Marker

                    key={park.properties.PARK_ID}
                    position={[
                        park.geometry.coordinates[1],
                        park.geometry.coordinates[0]
                    ]}
                    eventHandlers={{
                        click: (e: any) => {
                            setActivePark(park);
                        },
                    }}



                />
            ))}
        </MapContainer>);
}