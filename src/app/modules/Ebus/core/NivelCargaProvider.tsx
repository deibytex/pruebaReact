import { AxiosResponse } from "axios";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap-v5";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { GetClientesEsomos, PostEventActiveViajesByDayAndClient, ValidarTiempoActualizacion } from "../data/NivelCarga";
import { ClienteDTO, InicioCliente, InicioTabla, MapaDTO, MapaInicial, TablaDTO } from "../models/NivelcargaModels";
import { CirclesWithBar, Vortex, Watch } from "react-loader-spinner";

// clase con los funciones  y datos a utiilizar
type Props = {
    Visible: boolean;
}
export interface NivelCargaContextModel {
    DatosMapa?: any;
    dataTable?: any;
    setDatosMapa: (Data: any) => void;
    Clientes?: ClienteDTO[];
    ClienteSeleccionado?: ClienteDTO;
    setClientes: (Cliente: ClienteDTO[]) => void;
    setdataTable: (Tabla: TablaDTO[]) => void;
    setClienteSeleccionado: (Cliente: ClienteDTO) => void;
    Periodo?: string;
    setPeriodo: (Periodo: string) => void;
    Visible?: boolean;
    setVisible: (visible: boolean) => void;
    DatosMapaIndividual?: any;
    setDatosMapaIndividual: (MapaIndividual: any) => void;
    EsTotal?: any;
    setEstotal: (EsTotal: any) => void;
    ResetearValores?: boolean;
    setResetearValores: (Resetear: any) => void;
    markerSeleccionado? : MapaDTO,
    setmarkerSeleccionado: (marker: MapaDTO) => void;
}
const NivelCargaContext = createContext<NivelCargaContextModel>({
    setDatosMapa: (Data: any) => { },
    setClientes: (Cliente: any) => { },
    setClienteSeleccionado: (Data: any) => { },
    setPeriodo: (Periodo: string) => { },
    setdataTable: (Data: any) => { },
    setVisible: (Visible: boolean) => { },
    setDatosMapaIndividual: (MapaIndividual: any) => { },
    setEstotal: (EsTotal: any) => { },
    setResetearValores: (Resetear: any) => { },
    setmarkerSeleccionado: (marker: MapaDTO) => { }

});
const NivelCargaProvider: React.FC = ({ children }) => {
    const [DatosMapa, setDatosMapa] = useState<[]>([]);
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [dataTable, setdataTable] = useState<TablaDTO[]>([])
    const [Periodo, setPeriodo] = useState<string>("");
    const [Visible, setVisible] = useState<boolean>(true);
    const [DatosMapaIndividual, setDatosMapaIndividual] = useState<[]>([]);
    const [EsTotal, setEstotal] = useState<boolean>(false);
    const [ResetearValores, setResetearValores] = useState<boolean>(false);
    const [markerSeleccionado, setmarkerSeleccionado] = useState<MapaDTO>();
    const value: NivelCargaContextModel = {
        DatosMapa,
        setClientes,
        setClienteSeleccionado,
        ClienteSeleccionado,
        Clientes,
        setDatosMapa,
        setPeriodo,
        Periodo,
        dataTable,
        setdataTable,
        Visible,
        setVisible,
        DatosMapaIndividual,
        setDatosMapaIndividual,
        EsTotal,
        setEstotal,
        ResetearValores,
        setResetearValores,
        markerSeleccionado, setmarkerSeleccionado
    };
    return (
        <NivelCargaContext.Provider value={value}>
            {children}
        </NivelCargaContext.Provider>
    );
};
function useDataNivelCarga() {
    return useContext(NivelCargaContext);
}
const Indicador: React.FC = ({ children }) => {
    return <>{CargarIndicador({ children })}</>
}
const IndicadorCargado: React.FC = ({ children }) => {
    return <>{CargarIndicadorCargado({ children })}</>
}
//Hace toda la magia de ir al servidor, traerse los datos y setearlos
const DataEventosTiempoClientes: React.FC = ({ children }) => {
    const { ResetearValores, Visible, DatosMapa, Clientes, ClienteSeleccionado, dataTable, DatosMapaIndividual, setResetearValores, setDatosMapaIndividual, setVisible, setEstotal, setDatosMapa, setClienteSeleccionado, setClientes, setPeriodo, setdataTable } = useDataNivelCarga();
    const CargarEventos = (clienteIdS: string, Periodo: string) => {
        setVisible(true)
        PostEventActiveViajesByDayAndClient(clienteIdS, Periodo).then((response: AxiosResponse<any>) => {
            setDatosMapa(response.data);
            setdataTable(response.data);
            setVisible(false);
            setEstotal(true);
        }).catch((error) => {
            console.log(error);
            setVisible(false);
            errorDialog("<i>Eror al consultar los eventos</i>", "")
        })
    }


    const GetTiempo = (ClienteId: string, timer: any) => {
        ValidarTiempoActualizacion(ClienteId).then((response: AxiosResponse<any>) => {
            let tiempo = (response.data.length != 0) ? response.data[0].valor : 60000;
            let periodo = moment().format("MYYYY").toString();

            CargarEventos(ClienteId, periodo);
            timer = setInterval(() => {
                CargarEventos(ClienteId, periodo);
            }, tiempo);
   }).catch((error) => {
            errorDialog("<i>Eror al el tiempo de actualización</i>", "")
        })
    }
    //CONSULTA VEHICULOS OPERANDO
    let consulta = (children: any, timer: number) => {
        // consultamos en la base de datos la informacion de vehiculos operando
        GetClientesEsomos().then((response: AxiosResponse<any>) => {
            setClientes(response.data);
            setClienteSeleccionado(response.data[0])
            setPeriodo(children);
            GetTiempo(response.data[0].clienteIdS, timer);
            setEstotal(true);
        }).catch((error) => {
            errorDialog("<i>Eror al consultar los clientes</i>", "")
        })
    }
    useEffect(() => {
        let timer = 0;
        if (children) {
            consulta(children, timer);
        }

        return () => clearInterval(timer);
    }, [children]);
    return <>{(CargaListadoClientes(Clientes, ClienteSeleccionado, setClienteSeleccionado))}</>;
};

//Carga el listado de los clientes
function CargaListadoClientes(Clientes: any, ClienteSeleccionado: any, setClienteSeleccionado: ((arg0: ClienteDTO) => void)) {
    return (
        <Form.Select className="card card-rounded mb-3 " onChange={(e) => {
            // buscamos el objeto completo para tenerlo en el sistema
            let lstClientes = Clientes?.filter((value: any, index: any) => {
                return value.clienteIdS === Number.parseInt(e.currentTarget.value)
            })
            if (lstClientes)
                setClienteSeleccionado(lstClientes[0]);
        }} aria-label="Default select example">
            <option value={0} disabled={true} >Todos</option>
            {
                Clientes?.map((element: any, i: any) => {
                    let flag = (element.clienteIdS === ClienteSeleccionado?.clienteIdS)
                    return (<option key={element.clienteIdS} selected={flag} value={(element.clienteIdS != null ? element.clienteIdS : 0)}>{element.clienteNombre}</option>)
                })
            }
        </Form.Select>
    );
}
//para indicar que esta cargando
function CargarIndicador(children: any) {
    const { Visible } = useDataNivelCarga();
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
    const { Visible } = useDataNivelCarga();
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
}
export { NivelCargaProvider, useDataNivelCarga, DataEventosTiempoClientes, Indicador, IndicadorCargado }