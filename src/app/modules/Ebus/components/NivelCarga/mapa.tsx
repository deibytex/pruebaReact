import { Icon } from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { getCSSVariableValue } from "../../../../../_start/assets/ts/_utils";
import { MapaDTO } from "../../models/NivelcargaModels";

type Props =  {
    ListadoVehiculos : MapaDTO[];
};

const Mapa : React.FC<Props> =  ({ListadoVehiculos}) =>{
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
    const [activePark, setActivePark] = useState<MapaDTO>();


    setTimeout(function () {      
        if(map != null)
        map.invalidateSize();
    }, 1000);

    return (
        <MapContainer id="mapcontainter" center={[Number.parseFloat(ListadoVehiculos[0].Latitud), Number.parseFloat(ListadoVehiculos[0].Longitud)]} zoom={15}
            whenCreated={setMap}
        >
            <TileLayer
                url={CapaBasicNight}
            />
            {activePark && (
                <Popup
                    position={[
                        Number.parseFloat(activePark.Latitud),
                        Number.parseFloat(activePark.Longitud)
                    ]}
                    onClose={() => {
                        let evento = {}
                       // setActivePark();
                    }}
                >
                    <div>
                        <h2>Soc: {activePark.Soc}</h2>
                        <p>Movil:{activePark.Placa}</p>
                        <p>Operador:{activePark.Driver}</p>
                    </div>
                </Popup>
            )}
            {ListadoVehiculos.map(park => (
                <Marker

                    key={park.AssetId}
                    position={[
                        Number.parseFloat(park.Latitud),
                        Number.parseFloat(park.Longitud)
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

export {Mapa};