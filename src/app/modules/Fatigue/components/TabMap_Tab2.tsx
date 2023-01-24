import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { datamapa } from "../dataFatigue";
import { useDataFatigue } from "../core/provider";
import { EventoActivo } from "../models/EventosActivos";

export function MapTab() {
    const {listadoEventosActivos} = useDataFatigue();
    const [dataEventos, handlerdataEventos] = useState<EventoActivo[]>(listadoEventosActivos ?? []);
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
    const [activePark, setActivePark] = useState<EventoActivo>();


    setTimeout(function () {      
        if(map != null)
        map.invalidateSize();
    }, 1000);

    return (
        <MapContainer id="mapcontainter" center={[dataEventos[0].Latitud, dataEventos[0].Longitud]} zoom={15}
            whenCreated={setMap}
        >
            <TileLayer
                url={CapaBasicNight}
            />
            {activePark && (
                <Popup
                    position={[
                        activePark.Latitud,
                        activePark.Longitud
                    ]}
                    onClose={() => {
                        let evento = {}
                       // setActivePark();
                    }}
                >
                    <div>
                        <h2>Evento: {activePark.descriptionevent}</h2>
                        <p>Placa:{activePark.description}</p>
                        <p>Conductor:{activePark.name}</p>
                        <p>FechaHora:{activePark.EventDateTime}</p>
                        <p>Velocidad:N/A</p>
                        <p> Videos:
                           
                        </p>
                    </div>
                </Popup>
            )}
            {dataEventos.map(park => (
                <Marker

                    key={park.EventId}
                    position={[
                        park.Latitud,
                        park.Longitud
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