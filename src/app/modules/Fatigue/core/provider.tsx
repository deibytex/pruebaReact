import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { FechaServidor } from "../../../../_start/helpers/Helper";
import { GetAlarmas, GetDetalladoEventos, getAlertas, getEventosActivosPorDia, getVehiculosOperando } from "../data/dashBoardData";
import { EventoActivo } from "../models/EventosActivos";
import { AxiosResponse } from "axios";

// clase con los funciones  y datos a utiilizar
export interface FatigueContextModel {
    vehiculosOperacion?: any;
    setvehiculosOperacion: (vehiculos: any) => void;
    listadoEventosActivos?: EventoActivo[];
    setlistadoEventosActivos: (eventos: EventoActivo[]) => void;
    ListadoVehiculoSinOperacion?: any[];
    setListadoVehiculoSinOperacion: (lstvehiculos: any[]) => void;
    alertas?: any;
    setalertas: (lstalertas: any[]) => void;
    iserror?: any;
    setError: (error: any) => void;
    DataAlertas?: any;
    setDataAlertas: (DataAlertas: any) => void;
    DataDetallado?: any;
    DataDetalladoFiltrado?: any;
    Filtrado?: any
    setDataDetallado: (DataAlertas: any) => void;
    setDataDetalladoFiltrado: (DataAlertas: any) => void;
    setFiltrado: (Filtrado: boolean) => void;
    activeTab?: string;
    setActiveTab: (tabGlobal: string) => void;
    loader?: boolean;
    setloader: (loader: boolean) => void;
    UserId?: string;
    setUserId: (id: string) => void;


}

const FatigueContext = createContext<FatigueContextModel>({
    setvehiculosOperacion: (vehiculos: any) => { },
    setlistadoEventosActivos: (eventos: EventoActivo[]) => { },
    setListadoVehiculoSinOperacion: (lstvehiculos: any[]) => { },
    setalertas: (lstalertas: any[]) => { },
    setError: (error: any) => { },
    setDataAlertas: (DataAlertas: any) => { },
    setDataDetallado: (DataDetallado: any) => { },
    setFiltrado: (Filtrado: boolean) => { },
    setDataDetalladoFiltrado: (DataAlertas: any) => { },
    setActiveTab: (tabGlobal: string) => { },
    setUserId: (id: string) => "",
    setloader: (loader: boolean) => { }
});


const FatigueProvider: React.FC = ({ children }) => {
    const [vehiculosOperacion, setvehiculosOperacion] = useState<any>({});
    const [listadoEventosActivos, setlistadoEventosActivos] = useState<EventoActivo[]>([]);
    const [ListadoVehiculoSinOperacion, setListadoVehiculoSinOperacion] = useState<any[]>([]);
    const [alertas, setalertas] = useState<any[]>([]);
    const [iserror, setError] = useState<any>({});
    const [DataAlertas, setDataAlertas] = useState<any[]>([]);
    const [DataDetallado, setDataDetallado] = useState<any[]>([]);
    const [DataDetalladoFiltrado, setDataDetalladoFiltrado] = useState<any[]>([]);
    const [Filtrado, setFiltrado] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("#tab1");
    const [loader, setloader] = useState<boolean>(false);
    const [UserId, setUserId] = useState("");
    const value: FatigueContextModel = {
        vehiculosOperacion,
        setvehiculosOperacion,
        listadoEventosActivos,
        setlistadoEventosActivos,
        ListadoVehiculoSinOperacion,
        setListadoVehiculoSinOperacion,
        alertas,
        setalertas,
        iserror,
        setError,
        DataAlertas,
        setDataAlertas,
        DataDetallado,
        setDataDetallado,
        setDataDetalladoFiltrado,
        DataDetalladoFiltrado,
        setFiltrado,
        Filtrado,
        activeTab,
        setActiveTab,
        loader,
        setloader ,UserId,
        setUserId

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
    const { setvehiculosOperacion, setlistadoEventosActivos, setListadoVehiculoSinOperacion, setalertas, setError, iserror, setDataAlertas, setDataDetallado, loader, setloader } = useDataFatigue();
    let idinterval: number = 0;

    //CONSULTA VEHICULOS OPERANDO
    let consulta = (children: string) => {
        // consultamos en la base de datos la informacion de vehiculos operando
        getVehiculosOperando(children, FechaServidor).then(
            (response) => {
                let datos = response.data[0];
                // traemos la informacion del  objeto a traer y la seteamos 
                // al objeto que tendrá la información en el contexto                 
                setvehiculosOperacion({
                    "Operando": datos["TotalOperando"],
                    "No Operando": datos["TotalVehiculosSinOpera"]
                });
                setListadoVehiculoSinOperacion(response.data);
            }
        ).catch((error) => {
            setError({ accion: "DataVehiculoOperando", error });
        });
         //let datetemp = moment("2023-06-06 09:19:05.990").toDate()
        GetAlarmas(children, FechaServidor, moment(FechaServidor).add("8", "hours").toDate()).then((response: AxiosResponse<any>) => {
            setDataAlertas(response.data);
        }).catch((error: any) => {
            console.log("Error : ", error);
        });

        GetDetalladoEventos(children, FechaServidor).then((response: AxiosResponse<any>) => {
            let Data = new Array()
            response.data.map((e: any) => {
                Data = [...Data, ...JSON.parse(e.DetalladoEventos)]
            })
            setDataDetallado(Data);
        }).catch((error: any) => {
            console.log("Error detallado de evento: ", error);
        });

    }

    // CONSULTA EVENTOS ACTIVOS POR MINUTO
    let consultaEventsActivos = (children: string) => {
        var params: { [id: string]: string; } = {};
        params["Clienteids"] = children;
        params["period"] = moment(FechaServidor).format("MYYYY");
        params["Fecha"] = moment(FechaServidor).add(-1, 'days').format("YYYYMMDD");
        getEventosActivosPorDia({
            Clase: "FATGQueryHelper",
            NombreConsulta: "GetEventosActivosDiario", Pagina: null, RecordsPorPagina: null
        },
            params).
            then((response) => {

                setlistadoEventosActivos(response.data);
                // cuando tengamos los datos activamos todo el trabajo pesado
            }).catch((e) => {
                setError({ accion: "consultaEventsActivos", error: "No hay datos para este cliente" });
                errorDialog("Consulta eventos Activos", "No hay datos que mostrar");
            });

    }

    // CONSULTA EVENTOS ACTIVOS POR MINUTO
    let consultaAlertas = () => {
        setloader(true);
        // consultamos en la base de datos la informacion de vehiculos operando
        getAlertas().then(
            (response) => {
                setalertas(response.data);
                setloader(false);
            }
        ).catch((error) => {
            setError({ accion: "alertas", error });
            setloader(false);
        })

    }

    useEffect(() => {

        if (children) {

            consulta(children.toString());
            consultaEventsActivos(children.toString());
            consultaAlertas();
            // si no tiene error hace el interval
            if (iserror === null || iserror === undefined)
                if (idinterval === 0) {
                    idinterval = window.setInterval(() => {
                        consulta(children.toString());
                        consultaEventsActivos(children.toString());
                        consultaAlertas();
                    }, 120000)
                }
        }
        return () => {
            setvehiculosOperacion([]);
        };
    }, [children]);
    return <></>;
};


export { FatigueProvider, useDataFatigue, DataVehiculoOperando }