import { AxiosResponse } from "axios";
import moment from "moment";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap-v5";
import { CirclesWithBar, Watch } from "react-loader-spinner";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { GetClientesEsomos, ValidarTiempoActualizacion } from "../data/NivelCarga";
import { GetUltimaPosicionVehiculos } from "../data/Parqueo";
import { ClienteDTO, InicioCliente, TablaDTO } from "../models/ParqueoModels";

export interface ParqueoContextModel {
    DatosMapa?: any;
    dataTable?:any;
    setDatosMapa: (Data:any) =>void;
    Clientes? : ClienteDTO[];
    ClienteSeleccionado? : ClienteDTO;
    setClientes:(Cliente: ClienteDTO[]) => void;
    setdataTable:(Tabla:TablaDTO[]) => void;
    setClienteSeleccionado:(Cliente: ClienteDTO) => void;
    Visible?:boolean;
    setVisible : (visible:boolean)  => void;
    markerSeleccionado? : TablaDTO,
    setmarkerSeleccionado: (marker: TablaDTO) => void;
   
}
const ParqueoContext = createContext<ParqueoContextModel>({
    setDatosMapa: (Data: any) => {},
    setClientes: (Cliente: any) => {},
    setClienteSeleccionado: (Data: any) => {},
    setVisible:(Visible:boolean) =>{},
    setdataTable:(Data:any) => {},
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
       setVisible,markerSeleccionado, setmarkerSeleccionado
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
    const { Visible, DatosMapa, Clientes, ClienteSeleccionado, dataTable, setVisible, setDatosMapa, setClienteSeleccionado, setClientes, setdataTable } = useDataParqueo();
    const interval = useRef<any>();
    let consulta = ( timer: any) => {
        // consultamos en la base de datos la informacion de vehiculos operando
        GetClientesEsomos().then((response:AxiosResponse<any>) =>{
            setClientes(response.data);
            setClienteSeleccionado(response.data[0])
            GetTiempo(response.data[0].clienteIdS, timer);
        }).catch((error) =>{
          
            errorDialog("<i>Eror al consultar los clientes</i>","")
        })
       

        const GetTiempo = (ClienteId: string, timer: any) => {
            ValidarTiempoActualizacion(ClienteId).then((response: AxiosResponse<any>) => {
                let tiempo = (response.data.length != 0) ? response.data[0].valor : 60000;
                let periodo = moment().format("MYYYY").toString();
    
                CargarPosiciones(ClienteId, periodo);
                interval.current = setInterval(() => {
                    CargarPosiciones(ClienteId, periodo);
                }, tiempo);
       }).catch((error) => {
                errorDialog("<i>Eror al el tiempo de actualización</i>", "")
            })
        }
  
        const CargarPosiciones = (clienteIdS:string,Periodo: string) =>{
            setVisible(true)
           //las posiciones
            GetUltimaPosicionVehiculos(clienteIdS, moment().format("MYYYY").toString()).then((response:AxiosResponse<any>) =>{
                setdataTable(response.data);      
                setDatosMapa(response.data);        
                setVisible(false);
            }).catch((error) =>{
                errorDialog("<i>Ha ocurrido un error en la consulta de las posiciones</i>","")
            })
        }

    }
    useEffect(() => {
        let timer: any;
        if(interval.current != 0)
         clearInterval(interval.current)
            consulta( timer);
    

        return () => clearInterval(interval.current);
    }, [children]);
    return <>{(CargaListadoClientes(Clientes,ClienteSeleccionado, setClienteSeleccionado))}</>;
}


const Indicador : React.FC = ({children}) =>{
    return <>{CargarIndicador({children})}</>
};

const IndicadorCargado : React.FC = ({children}) =>{
    return <>{CargarIndicadorCargado({children})}</>
};

//para indicar que esta cargando
function CargarIndicador (children:any){
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
)}
 //para rellenar el espacio de cargado
 function CargarIndicadorCargado (children:any){
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
 //Carga el listado de los clientes
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



export { ParqueoProvider, useDataParqueo, DataClientes,  Indicador, IndicadorCargado}