import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { getCSSVariableValue } from "../../../../../_start/assets/ts/_utils";
import { useDataNivelCarga } from "../../core/NivelCargaProvider";
import { MapaDTO, MapaInicial } from "../../models/NivelcargaModels";

type Props =  {
    ListadoVehiculos : MapaDTO[];
};

const Mapa : React.FC<Props> =  ({ListadoVehiculos}) =>{

   // datos del provider
   const {DatosMapa, markerSeleccionado} = useDataNivelCarga()
   const [map, setMap] = useState<MapaDTO[]>([]);

   const [activePark, setActivePark] = useState<MapaDTO>();
    
   // actiualiza la informacion de todos los vehiculos
    useEffect(
        () => {

            setMap(DatosMapa);
        }
        , [DatosMapa]
     );

     // selecciona el marker
     useEffect(
        () => {

            setActivePark(markerSeleccionado);
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
    const CapaHibrida = `https://2.traffic.maps.ls.hereapi.com/maptile/2.1/traffictile/newest/hybrid.traffic.day/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320`;
    const CapaTraficoDia = `https://2.traffic.maps.ls.hereapi.com/maptile/2.1/traffictile/newest/normal.traffic.day/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320`;

    const skater = new Icon({
        iconUrl: "/skateboarding.svg",
        iconSize: [25, 25]
    });
   
    


    //Funcion que ubica los iconos para el soc
    const getIconSoc = (data:any) => {
        return (
          (data <= 100 && data >= 80)? <><i className="bi-battery-full" style={{ color:'#00B050'}}></i><span style={{fontSize:"15px"}}> {data == null ? "" : data.toFixed(0)}%</span></>:
           data <= 79 && data >= 60 ? <><i className="bi-battery-full rotate-45-verde" style={{color:'#92D050'}}></i><span style={{fontSize:"15px"}}>{data == null ? "" : data.toFixed(0)}%</span></>:
          (data <= 59 && data >= 40 ? <><span><i className="bi-battery-half rotate-45-yellow" style={{fontSize:"15px", color:'#ff0'}}></i></span><span style={{fontSize:"15px"}}>{data == null ? "" : data.toFixed(0)}%</span></>:
          (data <= 39 && data >= 20 ? <><span><i className="bi-battery-half rotate-45-naranja" style={{color:'#ffa500'}}></i></span><span style={{fontSize:"15px"}}>{data == null ? "" : data.toFixed(0)}%</span></>:
          (data <= 19 && data >= 0 ? <><span><i className="bi-battery-half" ></i></span><span style={{fontSize:"15px"}}>{data == null ? "" : data.toFixed(0)}%</span></>:
          <><span><i className="bi-battery-half"></i></span> <span style={{fontSize:"15px"}}>{data == null ? "" : data.toFixed(0)}%</span></>)))
        );
    }


    return ( <> {(ListadoVehiculos != undefined) && ( 
    <MapContainer
     id="mapcontainter" 
     center={[Number.parseFloat(ListadoVehiculos[0].latitud), Number.parseFloat(ListadoVehiculos[0].longitud)]} zoom={12}
  
    className= ""
>
   
    <TileLayer
        url={CapaBasicNight}
    />
    {activePark && (
        <Popup
            position={[
                Number.parseFloat(activePark.latitud),
                Number.parseFloat(activePark.longitud)
            ]}
            onClose={() => {
                let evento = {}
               // setActivePark();
            }}
        >
            <div>
                <p>Soc: {getIconSoc(activePark.soc)}</p>
                <p>Movil:{activePark.placa}</p>
                <p>Operador:{activePark.driver}</p>
            </div>
        </Popup>
    )}
    { ListadoVehiculos.map(park => (
        <Marker

            key={park.assetId}
            position={[
                Number.parseFloat(park.latitud),
                Number.parseFloat(park.longitud)
            ]}
            eventHandlers={{
                click: (e: any) => {
                    setActivePark(park);
                },
            }}



        />
    ))}
</MapContainer>)} </>
       );    
      
}

export {Mapa};
