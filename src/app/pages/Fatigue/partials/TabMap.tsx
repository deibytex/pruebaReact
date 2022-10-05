import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { datamapa } from "../dataFatigue";
import { eventos } from "../dataFatigue";
export function MapTab() {

    const [dataEventos, handlerdataEventos] = useState<any[]>(eventos);
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
    const [map, setMap] = useState<any>(null);
    const [activePark, setActivePark] = useState<any>(null);


    setTimeout(function () {      
        if(map != null)
        map.invalidateSize();
    }, 1000);

    return (
        <MapContainer id="mapcontainter" center={[dataEventos[0]["Latitud"], dataEventos[0]["Longitud"]]} zoom={15}
            whenCreated={setMap}
        >
            <TileLayer
                url={CapaBasicNight}
            />
            {activePark && (
                <Popup
                    position={[
                        activePark["Latitud"],
                        activePark["Longitud"]
                    ]}
                    onClose={() => {
                        setActivePark(null);
                    }}
                >
                    <div>
                        <h2>Evento: {activePark["Evento"]}</h2>
                        <p>Placa:{activePark["RegistrationNumber"]}</p>
                        <p>Conductor:{activePark["driver"]}</p>
                        <p>FechaHora:{activePark["StartDateTime"]}</p>
                        <p>Velocidad:{activePark["SpeedKilometresPerHour"]}</p>
                        <p> Videos:
                            {
                                Object.entries(JSON.parse(activePark["MediaUrls"])).map((element, index) => {

                                    return (
                                        <a
                                            className={`nav-link btn btn-active-light btn-color-muted py-2 px-4 fw-bolder me-2`}
                                            target="_blank"
                                            href={element[1] as string}

                                        >
                                            {element[0]}
                                        </a>
                                    )
                                })

                            }
                        </p>
                    </div>
                </Popup>
            )}
            {dataEventos.map(park => (
                <Marker

                    key={park["EventId"]}
                    position={[
                        park["Latitud"],
                        park["Longitud"]
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