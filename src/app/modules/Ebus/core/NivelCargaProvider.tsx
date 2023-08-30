import { AxiosResponse } from "axios";
import moment from "moment";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { PostEventActiveViajesByDayAndClient, ValidarTiempoActualizacion } from "../data/NivelCarga";
import { ClienteDTO, InicioCliente, TablaDTO } from "../models/NivelcargaModels";

import { FechaServidor } from "../../../../_start/helpers/Helper";

// clase con los funciones  y datos a utiilizar
type Props = {
    Visible: boolean;
}
export interface NivelCargaContextModel {
    DatosMapa?: TablaDTO[];
    dataTable?: TablaDTO[];
    setDatosMapa: (Data: TablaDTO[]) => void;
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
    markerSeleccionado?: TablaDTO,
    setmarkerSeleccionado: (marker: TablaDTO) => void;
    lstFiltroVehiculo?: TablaDTO[],
    setlstFiltroVehiculo: (marker: TablaDTO[]) => void;
    VehiculosFiltrados?: string[];
    setVehiculosFiltrados: (Vehiculos: string[]) => void;
    MinSocCarga?: number;
    MaxSocCarga?: number;
    setMinSocCarga: (MinSoc: number) => void;
    setMaxSocCarga: (MaxSoc: number) => void;
    showVehiculos?: boolean;
    setShowVehiculos: (showVehiculos: boolean) => void;
    ShowSoc?: boolean;
    setShowSoc: (Soc: boolean) => void;
    IsFiltrado?: boolean;
    setIsFiltrado: (IsFiltrado: boolean) => void;
    isExpandido?: boolean;
    setisExpandido: (isExpandido: boolean) => void;
}
const NivelCargaContext = createContext<NivelCargaContextModel>({
    setDatosMapa: (Data: TablaDTO[]) => { },
    setClientes: (Cliente: any) => { },
    setClienteSeleccionado: (Data: any) => { },
    setPeriodo: (Periodo: string) => { },
    setdataTable: (Data: TablaDTO[]) => { },
    setVisible: (Visible: boolean) => { },
    setDatosMapaIndividual: (MapaIndividual: any) => { },
    setEstotal: (EsTotal: any) => { },
    setResetearValores: (Resetear: any) => { },
    setmarkerSeleccionado: (marker: TablaDTO) => { },
    setlstFiltroVehiculo: (marker: TablaDTO[]) => { },
    setVehiculosFiltrados: (Vehiculos: string[]) => { },
    setMinSocCarga: (MinSoc: number) => { },
    setMaxSocCarga: (MaxSoc: number) => { },
    setShowVehiculos: (showVehiculos: boolean) => { },
    setShowSoc: (Soc: boolean) => { },
    setIsFiltrado: (IsFiltrado: boolean) => { },
    setisExpandido: (isExpandido: boolean) => { }

});
const NivelCargaProvider: React.FC = ({ children }) => {
    const [DatosMapa, setDatosMapa] = useState<TablaDTO[]>([]);
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [dataTable, setdataTable] = useState<TablaDTO[]>([])
    const [Periodo, setPeriodo] = useState<string>("");
    const [Visible, setVisible] = useState<boolean>(true);
    const [DatosMapaIndividual, setDatosMapaIndividual] = useState<[]>([]);
    const [EsTotal, setEstotal] = useState<boolean>(false);
    const [ResetearValores, setResetearValores] = useState<boolean>(false);
    const [markerSeleccionado, setmarkerSeleccionado] = useState<TablaDTO>();
    const [lstFiltroVehiculo, setlstFiltroVehiculo] = useState<TablaDTO[]>();
    const [VehiculosFiltrados, setVehiculosFiltrados] = useState<string[]>([]);
    const [MaxSocCarga, setMaxSocCarga] = useState<number>(100)
    const [MinSocCarga, setMinSocCarga] = useState<number>(0);
    const [ShowSoc, setShowSoc] = useState<boolean>(false);
    const [showVehiculos, setShowVehiculos] = useState<boolean>(false);
    const [IsFiltrado, setIsFiltrado] = useState<boolean>(false);
    const [isExpandido, setisExpandido] = useState<boolean>(false);

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
        markerSeleccionado, setmarkerSeleccionado,
        lstFiltroVehiculo, setlstFiltroVehiculo,
        VehiculosFiltrados, setVehiculosFiltrados, MaxSocCarga, MinSocCarga, setMaxSocCarga, setMinSocCarga,
        showVehiculos, setShowVehiculos, ShowSoc, setShowSoc, IsFiltrado, setIsFiltrado,
        isExpandido, setisExpandido
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

//Hace toda la magia de ir al servidor, traerse los datos y setearlos
const DataEventosTiempoClientes: React.FC = ({ children }) => {
    const { Clientes, ClienteSeleccionado, setVisible, setEstotal, setClienteSeleccionado, setClientes, setPeriodo, setdataTable } = useDataNivelCarga();

    // consultamos la fecha actual
    const Periodo = moment(FechaServidor()).format("MYYYY").toString();

    const interval = useRef<any>();
    const CargarEventos = (clienteIdS: string, Periodo: string) => {
        setVisible(true)
        PostEventActiveViajesByDayAndClient(clienteIdS, Periodo).then((response: AxiosResponse<TablaDTO[]>) => {

            setdataTable(response.data);

            setVisible(false);
            setEstotal(true);
        }).catch((error) => {

            setVisible(false);
            // errorDialog("<i>Eror al consultar los eventos</i>", "")
        })
    }


    const GetTiempo = (ClienteId: string) => {
        ValidarTiempoActualizacion(ClienteId).then((response: AxiosResponse<any>) => {
            let tiempo = (response.data.length != 0) ? response.data[0].valor : 60000;

            CargarEventos(ClienteId, Periodo);
            interval.current = setInterval(() => {
                CargarEventos(ClienteId, Periodo);
            }, tiempo);

        }).catch((error) => {
            errorDialog("<i>Eror al el tiempo de actualización</i>", "")
        })
    }
    //CONSULTA VEHICULOS OPERANDO
    let consulta = (children: any) => {
        // consultamos en la base de datos la informacion de vehiculos operando
        setPeriodo(Periodo);
        setEstotal(true);
        GetTiempo(children.toString());
    }
    useEffect(() => {

        if (interval.current != 0)
            clearInterval(interval.current)
        if (children) {
            consulta(children);
        }

        return () => {
            clearInterval(interval.current);
            setdataTable([]);
            setClientes([]);
            // limpiamos todas las variables a ser detruidas

        };
    }, [children]);
    return <></>;
};

export { NivelCargaProvider, useDataNivelCarga, DataEventosTiempoClientes }