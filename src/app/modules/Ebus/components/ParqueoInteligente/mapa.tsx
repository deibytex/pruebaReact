import { Box, Typography } from "@mui/material";

import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { toAbsoluteUrl } from "../../../../../_start/helpers";
import { TablaDTO } from "../../models/ParqueoModels";
import { useDataParqueo } from "../../core/ParqueoProvider";


const Mapa: React.FC = () => {
    // datos del provider
    const { DatosMapa, markerSeleccionado, dataTable } = useDataParqueo()
    const [map, setMap] = useState<TablaDTO[]>([]);
    const [mapReference, setmapReference] = useState<any>(null);
    const [show, setshowp] = useState<boolean>(false);
    const [activePark, setActivePark] = useState<TablaDTO>();

    const [centerLatitud, setcenterLatitud] = useState<number>(0);
    const [centerLongitud, setcenterLongitud] = useState<number>(0);
    const [zoom, setzoom] = useState<number>(13);
    const [isClustering, setisClustering] = useState<boolean>(true);


    // actiualiza la informacion de todos los vehiculos
    useEffect(
        () => {
           
            if (dataTable != undefined && dataTable.length > 0) {              
                setMap(dataTable);
                setshowp(true)
                setcenterLatitud(Number.parseFloat(dataTable[0].latitud))
                setcenterLongitud(Number.parseFloat(dataTable[0].longitud))
            }
           
        }
        , [dataTable, DatosMapa]
    );
  
    // selecciona el marker
    useEffect(
        () => {

            setActivePark(markerSeleccionado);
            if ((markerSeleccionado != undefined)) {
                setisClustering(false)
                setzoom(16)
            }
        }
        , [markerSeleccionado]
    );
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




    //Funcion que ubica los iconos para el soc
    const getIconSoc = (data: any) => {
        return (
            (data <= 100 && data >= 80) ? <><i className="bi-battery-full" style={{ color: '#00B050' }}></i><span style={{ fontSize: "15px" }}> {data == null ? "" : data.toFixed(0)}%</span></> :
                data <= 79 && data >= 60 ? <><i className="bi-battery-full rotate-45-verde" style={{ color: '#92D050' }}></i><span style={{ fontSize: "15px" }}>{data == null ? "" : data.toFixed(0)}%</span></> :
                    (data <= 59 && data >= 40 ? <><span><i className="bi-battery-half rotate-45-yellow" style={{ fontSize: "15px", color: '#ff0' }}></i></span><span style={{ fontSize: "15px" }}>{data == null ? "" : data.toFixed(0)}%</span></> :
                        (data <= 39 && data >= 20 ? <><span><i className="bi-battery-half rotate-45-naranja" style={{ color: '#ffa500' }}></i></span><span style={{ fontSize: "15px" }}>{data == null ? "" : data.toFixed(0)}%</span></> :
                            (data <= 19 && data >= 0 ? <><span><i className="bi-battery-half" ></i></span><span style={{ fontSize: "15px" }}>{data == null ? "" : data.toFixed(0)}%</span></> :
                                <><span><i className="bi-battery-half"></i></span> <span style={{ fontSize: "15px" }}>{data == null ? "" : data.toFixed(0)}%</span></>)))
        );
    }



    function Puntos() {
        const mapa = useMap();

        return (<>
            {map != undefined && map.length > 0 &&
                map.map((park) => {
                    return (
                        <Marker
                            title={park.placa}
                            icon={L.icon({
                                iconUrl: toAbsoluteUrl('/media/syscaf/iconbus.png'),
                                iconSize: [40, 40]

                            })}
                            key={park.assetId}
                            position={[
                                Number.parseFloat(park.latitud),
                                Number.parseFloat(park.longitud)
                            ]}
                            eventHandlers={{
                                click: (e: any) => {
                                    setActivePark(park);
                                },
                            }}>

                            <Tooltip className="bg-transparent border-0  text-white fs-8" direction="right" offset={[13, 0]} opacity={1} permanent>
                                {park.placa}
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
                        Number.parseFloat(activePark.latitud),
                        Number.parseFloat(activePark.longitud)
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
                                Number.parseFloat(activePark.latitud),
                                Number.parseFloat(activePark.longitud)
                            ],
                            zoom
                        );
                    }}
                >
                    <div className="card shadow-sm  border">
                        <div className="card-title fs-2 bg-secondary border "> <p className="text-center">{activePark.placa}</p></div>
                        <div className="card-body">
                            <Box
                                sx={{
                                    display: 'grid',
                                    margin: 'auto',
                                    gridTemplateColumns: '1fr 1fr ',
                                    gridTemplateRows: '30px',

                                }}
                            >
                                <Typography > Avl:</Typography>
                                <Typography >{activePark.avlString}</Typography>
                                <Typography>Localización:</Typography>
                                <Typography >{activePark.localizacion}</Typography>
                            </Box>

                        </div>

                    </div>
                </Popup>


            )}
        </>)
    }




    return (<> {(show) && (
        <MapContainer
            id="mapcontainter"
            center={[centerLatitud, centerLongitud]} zoom={zoom}
            className=" ml-4"
            whenCreated={setmapReference}
            
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

        </MapContainer>)} </>
    );

}

export { Mapa };
