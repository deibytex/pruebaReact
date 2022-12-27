import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { FechaServidor } from "../../../../_start/helpers/Helper";
import { getEventosActivosPorDia, getVehiculosOperando } from "../data/dashBoardData";
import { EventoActivo } from "../models/EventosActivos";

export interface FatigueContextModel {
    vehiculosOperacion?: any;
    setvehiculosOperacion: (vehiculos: any) => void;  
    listadoEventosActivos? : EventoActivo[];
    setlistadoEventosActivos: (eventos: EventoActivo[]) => void;
    ListadoVehiculoSinOperacion? :  any[];
    setListadoVehiculoSinOperacion: (lstvehiculos: any[]) => void;
}

const FatigueContext = createContext<FatigueContextModel>({
    setvehiculosOperacion: (vehiculos: any) => { },   
    setlistadoEventosActivos: (eventos: EventoActivo[]) => { },
    setListadoVehiculoSinOperacion: (lstvehiculos: any[]) => {}
});


const FatigueProvider: React.FC = ({ children }) => {
    const [vehiculosOperacion, setvehiculosOperacion] = useState<any>({});
    const [listadoEventosActivos, setlistadoEventosActivos] = useState<EventoActivo[]>([]);
    const [ListadoVehiculoSinOperacion, setListadoVehiculoSinOperacion] = useState<any[]>([]);
    const value: FatigueContextModel = {
        vehiculosOperacion,
        setvehiculosOperacion,
        listadoEventosActivos,
        setlistadoEventosActivos,
        ListadoVehiculoSinOperacion,
        setListadoVehiculoSinOperacion
    };
    return (
        <FatigueContext.Provider value={value}>
            {children}
        </FatigueContext.Provider>
    );
};

function useDataFatigue() {
    return useContext(FatigueContext);
}

// se encarga de consultar la información 
// de los vehiculos operando y en una frecuencia de 5 min 
// segun parametrización que debe realizarse

const DataVehiculoOperando: React.FC = ({ children }) => {
    const { setvehiculosOperacion, setlistadoEventosActivos,setListadoVehiculoSinOperacion } = useDataFatigue();
    let idinterval: number = 0;

 
    //CONSULTA VEHICULOS OPERANDO
    let consulta = (children: string) => {
        // consultamos en la base de datos la informacion de vehiculos operando
        getVehiculosOperando(children, FechaServidor).then(

            (response) => {
                let datos = response.data[0];
                console.log(datos)
                // traemos la informacion del  objeto a traer y la seteamos 
                // al objeto que tendrá la información en el contexto                 
                setvehiculosOperacion({
                    "Operando": datos["TotalOperando"],
                    "No Operando": datos["TotalVehiculosSinOpera"]
                });
                setListadoVehiculoSinOperacion(response.data);
            }

        ).catch((error) => {

            console.log("Error en traer informacion chart vehiculos operando", error)
        })

    }

    // CONSULTA EVENTOS ACTIVOS POR MINUTO
    let consultaEventsActivos = (children: string) => {
        var params: { [id: string]: string; } = {};
        params["Clienteids"] = children;
        params["period"] = moment(FechaServidor).format("MMYYYY");
        params["Fecha"] = moment(FechaServidor).add(-4, 'days').format("YYYYMMDD");

        getEventosActivosPorDia({
            Clase: "FATGQueryHelper",
            NombreConsulta: "GetEventosActivosDiario", Pagina : null, RecordsPorPagina : null
          },
            params).
            then((response) => {
          
                setlistadoEventosActivos(response.data);
              // cuando tengamos los datos activamos todo el trabajo pesado
             
            }).catch((e) => { console.log(e) });;

    }
  
    useEffect(() => {
        
        if (children) {
            consulta(children.toString());
            consultaEventsActivos(children.toString());
            if (idinterval === 0) {
                idinterval = window.setInterval(() => {
                    consulta(children.toString());
                    consultaEventsActivos(children.toString());
                }, 60000)
            }
        }

        return () => {
            setvehiculosOperacion([]);
        };
    }, [children]);
    return <></>;
};


export { FatigueProvider, useDataFatigue, DataVehiculoOperando }