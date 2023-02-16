import { AxiosResponse } from "axios";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap-v5";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { FechaServidor } from "../../../../_start/helpers/Helper";
import { getEventosActivosPorDia } from "../../Fatigue/data/dashBoardData";
import { GetClientesEsomos, PostEventActiveViajesByDayAndClient, ValidarTiempoActualizacion } from "../data/NivelCarga";
import { ClienteDTO, InicioCliente, InicioTabla, MapaDTO, MapaInicial, TablaDTO } from "../models/NivelcargaModels";
import { Watch } from "react-loader-spinner";
import { type } from "os";
// clase con los funciones  y datos a utiilizar
type Props  = {
    Visible:boolean;
}
export interface NivelCargaContextModel {
    DatosMapa?: any;
    dataTable?:any;
    setDatosMapa: (Data:any) =>void;
    Clientes? : ClienteDTO[];
    ClienteSeleccionado? : ClienteDTO;
    setClientes:(Cliente: ClienteDTO[]) => void;
    setdataTable:(Tabla:TablaDTO[]) => void;
    setClienteSeleccionado:(Cliente: ClienteDTO) => void;
    Periodo?:string;
    setPeriodo: (Periodo:string) => void;
    Visible?:boolean;
    setVisible : (visible:boolean)  => void;
}
const NivelCargaContext = createContext<NivelCargaContextModel>({
    setDatosMapa: (Data: any) => {},
    setClientes: (Cliente: any) => {},
    setClienteSeleccionado: (Data: any) => {},
    setPeriodo: (Periodo: string) => {},
    setdataTable:(Data:any) => {},
    setVisible:(Visible:boolean) =>{}
});
const NivelCargaProvider: React.FC = ({ children }) => {
    const [DatosMapa, setDatosMapa] = useState<[]>([]);
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [dataTable, setdataTable] = useState<TablaDTO[]>([])
    const [Periodo, setPeriodo] = useState<string>("");
    const [Visible, setVisible] = useState<boolean>(true);

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
       setVisible
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

const Indicador : React.FC <Props>= ({Visible}) =>{
    return <>{CargarIndicador(Visible)}</>
}
const DataEventosTiempoClientes: React.FC = ({ children }) => {
    const { Visible, DatosMapa, Clientes, ClienteSeleccionado, dataTable,setVisible,  setDatosMapa, setClienteSeleccionado, setClientes, setPeriodo, setdataTable } = useDataNivelCarga();
    const CargarEventos = (clienteIdS:string,Periodo: string) =>{
        setVisible(true)
        PostEventActiveViajesByDayAndClient(clienteIdS,Periodo).then((response:AxiosResponse<any>) =>{
            setDatosMapa(response.data);
            setdataTable(response.data);
            setVisible(false);
        }).catch((error) =>{
            console.log(error);
            errorDialog("<i>Eror al consultar los eventos</i>","")
        })
    }

    const Setimeout = (tiempo:any, cliente:string, Periodo:string) =>{
        if (tiempo == undefined || tiempo == null)
            tiempo = 60000;
        CargarEventos(cliente,Periodo);
        const timer = setTimeout(() => {
            CargarEventos(cliente,Periodo);
          }, tiempo);
          return () => clearTimeout(timer);
    }
    const GetTiempo = (ClienteId:string) =>{
        ValidarTiempoActualizacion(ClienteId).then((response:AxiosResponse<any>) =>{
            if (response.data.length != 0) {
                Setimeout(response.data[0].valor, ClienteId,moment().format("MYYYY").toString());
            } else
                Setimeout(60000,ClienteId,moment().format("MYYYY").toString());//Si no llega a encontrar un tiempo configurado para el cliente, le da un minuto para actualizar.
        }).catch((error) =>{
            errorDialog("<i>Eror al el tiempo de actualización</i>","")
        })
    }
    //CONSULTA VEHICULOS OPERANDO
    let consulta = (children:any) => {
        // consultamos en la base de datos la informacion de vehiculos operando
        GetClientesEsomos().then((response:AxiosResponse<any>) =>{
            setClientes(response.data);
            setClienteSeleccionado(response.data[0])
            setPeriodo(children);
            GetTiempo(response.data[0].clienteIdS);
        }).catch((error) =>{
            console.log(error);
            errorDialog("<i>Eror al consultar los clientes</i>","")
        })
    }
    useEffect(() => {
        if (children) {
            consulta(children);
        }
    }, [children]);
    return <>{(CargaListadoClientes(Clientes,ClienteSeleccionado, setClienteSeleccionado))}</>;
};
function CargaListadoClientes(Clientes:any, ClienteSeleccionado:any, setClienteSeleccionado: ((arg0: ClienteDTO) => void) ) {
    return (           
            <Form.Select   className=" mb-3 " onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                let lstClientes =  Clientes?.filter((value:any, index:any) => {
                    return value.clienteIdS === Number.parseInt(e.currentTarget.value)
                })  
                if(lstClientes)
                    setClienteSeleccionado(lstClientes[0]);
            }} aria-label="Default select example">
                <option value={0} disabled={true} >Todos</option>
                {                        
                    Clientes?.map((element:any,i:any) => {
                            let flag = (element.clienteIdS === ClienteSeleccionado?.clienteIdS)
                        return (<option key={element.clienteIdS} selected={flag}  value={(element.clienteIdS != null ? element.clienteIdS:0)}>{element.clienteNombre}</option>)
                    })
                }
            </Form.Select>               
    );
  }
  function CargarIndicador (Visible:boolean){
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

export { NivelCargaProvider, useDataNivelCarga, DataEventosTiempoClientes, Indicador}