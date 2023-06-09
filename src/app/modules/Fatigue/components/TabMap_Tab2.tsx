import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import { Icon } from "leaflet";

import { useDataFatigue } from "../core/provider";
import { EventoActivo } from "../models/EventosActivos";
import { toAbsoluteUrl } from "../../../../_start/helpers";
import L from "leaflet";
import { Box, Typography } from "@mui/material";
import MarkerClusterGroup from "react-leaflet-markercluster";
export function MapTab() {
    const [show, setshowp] = useState<boolean>(false);
    const { DataDetallado, Filtrado, DataDetalladoFiltrado, setloader } = useDataFatigue();
    const [zoom, setzoom] = useState<number>(13);
    const [map, setMap] = useState<EventoActivo[]>([]);
    const [activePark, setActivePark] = useState<EventoActivo>();
    const [centerLatitud, setcenterLatitud] = useState<number>(0);
    const [centerLongitud, setcenterLongitud] = useState<number>(0);
    const [isClustering, setisClustering] = useState<boolean>(true);
    //  whenCreated={setMap}
    const here = {
        apiKey: 'h7cWVY3eEiZeilhreUhv07kKMJMizDl6elWoN7cb8wg'
    }
    //h7cWVY3eEiZeilhreUhv07kKMJMizDl6elWoN7cb8wg
    const style = 'reduced.night';
    const CapaBasicNight = `https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${style}/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320`;
    //const CapaHibrida = `https://2.traffic.maps.ls.hereapi.com/maptile/2.1/traffictile/newest/hybrid.traffic.day/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320`;
    // const CapaTraficoDia = `https://2.traffic.maps.ls.hereapi.com/maptile/2.1/traffictile/newest/normal.traffic.day/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320`;

    const skater = new Icon({
        iconUrl: "/skateboarding.svg",
        iconSize: [25, 25]
    });

    useEffect(() => {
        if(Filtrado){
            if (DataDetalladoFiltrado != undefined && DataDetalladoFiltrado.length > 0) {
                setMap(DataDetalladoFiltrado);
                setcenterLatitud(Number.parseFloat(DataDetalladoFiltrado[0].Latitud))
                setcenterLongitud(Number.parseFloat(DataDetalladoFiltrado[0].Longitud))
                setloader(false);
                setisClustering(false)
                setzoom(8)
                setshowp(true)
            }
        }else{
            if (DataDetallado != undefined && DataDetallado.length > 0) {
                setMap(DataDetallado);
                setcenterLatitud(Number.parseFloat(DataDetallado[0].Latitud))
                setcenterLongitud(Number.parseFloat(DataDetallado[0].Longitud))
                setloader(false);
                setisClustering(false)
                setzoom(8)
                setshowp(true)
            }
        }
       
    }, [DataDetallado, Filtrado, DataDetalladoFiltrado])

    function Puntos() {
        const mapa = useMap();
        return (<>
            {map != undefined && map.length > 0 &&
                map.map((park: any, index:any) => {
                    return (
                        <Marker
                            title={(park.evento == ""|| park.evento == null ?  park.EventTypeId : park.evento)}
                            // icon={L.icon({
                            //     iconUrl: toAbsoluteUrl('/media/syscaf/iconbus.png'),
                            //     iconSize: [40, 40]

                            // })}
                            key={index}
                            position={[
                                Number.parseFloat(park.Latitud),
                                Number.parseFloat(park.Longitud)
                            ]}
                            eventHandlers={{
                                click: (e: any) => {
                                    setActivePark(park);
                                },
                            }}>

                            <Tooltip className="bg-transparent border-0  text-white fs-8" direction="right" offset={[13, 0]} opacity={1} permanent>
                                {park.EventId}
                            </Tooltip>

                        </Marker>
                    );
                })}
        </>

        );
    }
    function RenderPopUp() {
        const mapa = useMap();
        return (<>
            {activePark && (
                <Popup
                    position={[
                        activePark.Latitud,
                        activePark.Longitud
                    ]}
                    onClose={() => {
                        setActivePark(undefined);
                        mapa.setView(
                            [
                                centerLatitud,
                                centerLongitud
                            ],
                            zoom
                        );

                        setisClustering(true)
                    }}
                    onOpen={() => {

                        mapa.setView(
                            [
                                activePark.Latitud,
                                activePark.Longitud
                            ],
                            zoom
                        );
                    }}
                >
                    <div className="card shadow-sm  border">
                        <div className="card-title fs-2 bg-secondary border "> <p className="text-center">{(activePark.evento == ""|| activePark.evento == null ?  activePark.EventId : activePark.evento)}</p></div>
                        <div className="card-body">
                            <Box
                                sx={{
                                    display: 'grid',
                                    margin: 'auto',
                                    gridTemplateColumns: '1fr 1fr ',
                                    gridTemplateRows: '10px',

                                }}
                            >
                                <Typography >Evento:{activePark.evento}</Typography>
                                {/* <Typography >{getIconSoc(activePark.soc)}</Typography>
                                <Typography>Operador:</Typography>
                                <Typography >{activePark.driver}</Typography> */}
                            </Box>

                        </div>

                    </div>
                </Popup>


            )}
        </>)
    }



    return (
        <>
            {(show) && (
                <MapContainer
                    id="mapcontainter"
                    center={[centerLatitud, centerLongitud]}
                    zoom={zoom}
                    className=" ml-4"
                    style={{ height: 700 }}
                >
                    <TileLayer
                        url={CapaBasicNight}
                    />
                    <RenderPopUp />
                    {/**  si son todos aplicamos el clustering, si se filtra lo desagregamos*/}
                    {(isClustering) && (<MarkerClusterGroup>
                        <Puntos />
                    </MarkerClusterGroup>)}
                    {(!isClustering) && (
                        <Puntos />
                    )}
                </MapContainer>
            )}
        </>
    );
}