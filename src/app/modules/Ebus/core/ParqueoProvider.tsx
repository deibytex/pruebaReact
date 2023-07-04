import { AxiosResponse } from "axios";
import moment from "moment";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { CirclesWithBar, Watch } from "react-loader-spinner";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { GetClientesEsomos, ValidarTiempoActualizacion } from "../data/NivelCarga";
import { GetUltimaPosicionVehiculos } from "../data/Parqueo";
import { ClienteDTO, InicioCliente, TablaDTO } from "../models/ParqueoModels";
import { FechaServidor } from "../../../../_start/helpers/Helper";

export interface ParqueoContextModel {
    DatosMapa?: any;
    dataTable?: any;
    setDatosMapa: (Data: any) => void;
    Clientes?: ClienteDTO[];
    ClienteSeleccionado?: ClienteDTO;
    setClientes: (Cliente: ClienteDTO[]) => void;
    setdataTable: (Tabla: TablaDTO[]) => void;
    setClienteSeleccionado: (Cliente: ClienteDTO) => void;
    Visible?: boolean;
    setVisible: (visible: boolean) => void;
    markerSeleccionado?: TablaDTO,
    setmarkerSeleccionado: (marker: TablaDTO) => void;

}
const ParqueoContext = createContext<ParqueoContextModel>({
    setDatosMapa: (Data: any) => { },
    setClientes: (Cliente: any) => { },
    setClienteSeleccionado: (Data: any) => { },
    setVisible: (Visible: boolean) => { },
    setdataTable: (Data: any) => { },
    setmarkerSeleccionado: (marker: TablaDTO) => { }
});
const ParqueoProvider: React.FC = ({ children }) => {
    const [DatosMapa, setDatosMapa] = useState<[]>([]);
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [dataTable, setdataTable] = useState<TablaDTO[]>([])
    const [Visible, setVisible] = useState<boolean>(true);
    const [markerSeleccionado, setmarkerSeleccionado] = useState<TablaDTO>();
    const value: ParqueoContextModel = {
        DatosMapa,
        setClientes,
        setClienteSeleccionado,
        ClienteSeleccionado,
        Clientes,
        setDatosMapa,
        dataTable,
        setdataTable,
        Visible,
        setVisible, markerSeleccionado, setmarkerSeleccionado
    };
    return (
        <ParqueoContext.Provider value={value}>
            {children}
        </ParqueoContext.Provider>
    );
};
function useDataParqueo() {
    return useContext(ParqueoContext);
};
const DataClientes: React.FC = ({ children }) => {
    const { setVisible, setDatosMapa, setClienteSeleccionado, setClientes, setdataTable } = useDataParqueo();
    const interval = useRef<any>();
    const Periodo = moment(FechaServidor()).format("MYYYY").toString();

    let consulta = (clienteIdS: string) => {
        // consultamos en la base de datos la informacion de vehiculos operando
        const CargarPosiciones = (clienteIdS: string, Periodo: string) => {
            setVisible(true)
            //las posiciones
            GetUltimaPosicionVehiculos(clienteIdS, Periodo).then((response: AxiosResponse<any>) => {
                setdataTable(response.data);
                setDatosMapa(response.data);
                setVisible(false);
            }).catch((error) => {
                errorDialog("<i>Ha ocurrido un error en la consulta de las posiciones</i>", "")
            })
        }
  // valida el tiempo de actualizacion y  crea el interval para traer datos
        ValidarTiempoActualizacion(clienteIdS).then((response: AxiosResponse<any>) => {
            let tiempo = (response.data.length != 0) ? response.data[0].valor : 60000;

            CargarPosiciones(clienteIdS, Periodo);
            interval.current = setInterval(() => {
                CargarPosiciones(clienteIdS, Periodo);
            }, tiempo);
        }).catch((error) => {
            errorDialog("<i>Eror al el tiempo de actualización</i>", "")
        })
    }
    useEffect(() => {
        //verifica el interval y crea uno nuevo si se cambia de cliente
        if (interval.current != 0)
            clearInterval(interval.current)
        if (children)
            consulta(children.toString());

        return () => clearInterval(interval.current);
    }, [children]);
    return <></>;
}


const Indicador: React.FC = ({ children }) => {
    return <>{CargarIndicador({ children })}</>
};

const IndicadorCargado: React.FC = ({ children }) => {
    return <>{CargarIndicadorCargado({ children })}</>
};

//para indicar que esta cargando
function CargarIndicador(children: any) {
    const { Visible } = useDataParqueo();
    return (
        <> <Watch
            height={30}
            width={30}
            color="#F90E07"
            ariaLabel="watch-loading"
            wrapperStyle={{}}
            visible={Visible}

        /></>
    )
}
//para rellenar el espacio de cargado
function CargarIndicadorCargado(children: any) {
    const { Visible } = useDataParqueo();
    return (
        <>
            <CirclesWithBar
                height="30"
                width="30"
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={!Visible}
                outerCircleColor=""
                innerCircleColor=""
                barColor=""
                ariaLabel='circles-with-bar-loading'
            /></>
    )
};



export { ParqueoProvider, useDataParqueo, DataClientes, Indicador, IndicadorCargado }