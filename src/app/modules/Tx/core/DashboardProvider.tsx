import { AxiosResponse } from "axios";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap-v5";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { GetListadoSemanas } from "../data/Dashboard";
import { ObtenerListadoCLientes } from "../data/Reporte";
import { ClienteDTO, InicioCliente } from "../models/DasboardModels";

export interface DashboardContextModel {
    Clientes? : ClienteDTO[];
    ClienteSeleccionado? : ClienteDTO;
    setClientes:(Cliente: ClienteDTO[]) => void;
    setClienteSeleccionado:(Cliente: ClienteDTO) => void;
    Data?:any[];
    setData:(data:any) =>void;
    DataTx?:any[];
    setDataTx:(data:any) =>void;
    DataTk?:any[];
    setDataTk:(data:any) =>void;
    Cargando?:boolean;
    setCargando:(Cargando:boolean) => void;
    DataFiltrada?:any[];
    setDataFiltrada:(data:any) =>void;
    Filtrado?:boolean;
    setFiltrado:(Filtrado:boolean) => void;
    Semanas?:any[];
    setSemanas:(Semanas:any[]) => void;
    SemanaSeleccionada?:any[];
    setSemanaSeleccionada:(SemanaSeleccionada:any[]) => void;
    SemanaTipo ? : string;
    setSemanaTipo:(SemanaTipo:string) => void;
}
const DashboardContext = createContext<DashboardContextModel>({
    setClientes: (Cliente: any) => {},
    setClienteSeleccionado: (Data: any) => {},
    setData:(data:any) => {},
    setDataTx:(data:any) => {},
    setDataTk:(data:any) => {},
    setDataFiltrada:(data:any) => {},
    setCargando:(Cargando:boolean) => {},
    setFiltrado:(Filtrado:boolean)  => {},
    setSemanas:(Semanas:any[]) => {},
    setSemanaSeleccionada:(SemanaSeleccionada:any[])  => {},
    setSemanaTipo:(SemanaTipo:string) =>  {},
});
const DashboardProvider: React.FC = ({ children }) => {
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [Data, setData] = useState<any[]>([]);
    const [DataTx, setDataTx] = useState<any[]>([]);
    const [DataTk, setDataTk] = useState<any[]>([]);
    const [DataFiltrada, setDataFiltrada] = useState<any[]>([]);
    const [Cargando, setCargando] = useState<boolean>(false);
    const [Filtrado, setFiltrado] = useState<boolean>(false);
    const [Semanas, setSemanas] = useState<any[]>([]);
    const [SemanaSeleccionada, setSemanaSeleccionada] = useState<any[]>([]);
    const [SemanaTipo, setSemanaTipo] = useState<string>("1");
    const value: DashboardContextModel = {
        setClientes,
        setClienteSeleccionado,
        ClienteSeleccionado,
        Clientes,
        Data, 
        setData,
        Cargando,
        setCargando,
        DataFiltrada, 
        setDataFiltrada,
        Filtrado,
        setFiltrado,
        Semanas,
        setSemanas,
        SemanaSeleccionada,
        setSemanaSeleccionada,
        SemanaTipo,
        setSemanaTipo,
        DataTx,
        setDataTx,
        DataTk,
        setDataTk,
    };
    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};
function useDataDashboard() {
    return useContext(DashboardContext);
};
const CargaClientes: React.FC = ({children}) => {
    const { setClienteSeleccionado, setClientes, ClienteSeleccionado, Clientes, setCargando, setFiltrado, Filtrado, Data, setDataFiltrada, setData} = useDataDashboard();
    useEffect(() =>{
        setCargando(true);
        ObtenerListadoCLientes().then((response:AxiosResponse<any>) => {
            setClientes(response.data);
            setClienteSeleccionado(InicioCliente);
            setCargando(false);
        }
        ).catch((error) => {
            errorDialog("Consultar clientes", "Error al consultar los clientes, no se puede desplegar informacion");
        });
    return () => setClientes([]);
    },[]);

    return <>{(ClienteSeleccionado !== undefined && Clientes != undefined && Data != undefined ) && SeleccionClientes(Clientes,ClienteSeleccionado,setClienteSeleccionado, setFiltrado, Data, setDataFiltrada, setData)}</>;
}

function SeleccionClientes (Clientes:any, ClienteSeleccionado:any, setClienteSeleccionado: ((arg0: ClienteDTO) => void) , setFiltrado: ((arg0: boolean) => void),Data:any, setDataFiltrada: ((arg0: any) => void), setData:((arg0: any) => void))  {
   return (           
       <Form.Select defaultValue={0}  className=" mb-3 " onChange={(e) => {
           // buscamos el objeto completo para tenerlo en el sistema
           let lstClientes =  Clientes?.filter((value:any, index:any) => {
               return value.clienteIdS === Number.parseInt(e.currentTarget.value)
           })  
           let Cliente = (lstClientes[0] ==  undefined ? {
               clienteIdS:0,
               ClienteId:"",
               clienteNombre:"Todos",
           }:lstClientes[0]);
           setClienteSeleccionado(Cliente); 
       }} aria-label="Default select example">
           <option value={0}>Todas las bases</option>
           {           
               Clientes?.map((element:any,i:any) => {
                       let flag = (element.clienteIdS === (ClienteSeleccionado!= undefined?ClienteSeleccionado?.clienteIdS:0 ))
                   return (<option key={element.clienteIdS}  value={(element.clienteIdS != null ? element.clienteIdS:0)}>{element.clienteNombre}</option>)
               })
           }
       </Form.Select>               
   );
}

const CargarSemanas : React.FC = ({children}) =>{
    const { setSemanas, Semanas, setSemanaSeleccionada, SemanaSeleccionada, SemanaTipo, setSemanaTipo } = useDataDashboard();
    useEffect(() =>{
        let Anio = moment().format("YYYY").toString();;
        GetListadoSemanas(Anio).then((response:AxiosResponse) =>{
            setSemanas(response.data.data.sort());
            setSemanaSeleccionada(response.data.data[0]);
            return () => setSemanas([]);
        }).catch((error) =>{
            errorDialog("Ha ocurrido un error al tratar de obtener las semanas","");
        });
    },[SemanaTipo])
    return <>{(SemanaSeleccionada != undefined && Semanas != undefined && SemanaTipo != undefined ) && (CargarListadoSemanas(setSemanas,Semanas,setSemanaSeleccionada,SemanaSeleccionada, SemanaTipo, setSemanaTipo))}</>
}

function CargarListadoSemanas (setSemanas:(arg0:any)=>void, Semanas:any, setSemanaSeleccionada: (arg0:any) => void, SemanaSeleccionada:any, SemanaTipo:any, setSemanaTipo:(arg0:any) =>void){
    return (           
        <Form.Select defaultValue={0}  className=" mb-3 " onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                let lstSemanas =  Semanas?.filter((value:any, index:any) => {
                    return value.fecha === e.currentTarget.value
                })  
                setSemanaSeleccionada(lstSemanas[0]);
            }} aria-label="Default select example">
            {           
                Semanas?.filter((e:any)=>{
                        return (e.tipo == Number.parseInt(SemanaTipo));
                }).map((element:any,i:any) => {
                    let flag = (element.fecha === (SemanaSeleccionada!= undefined?SemanaSeleccionada?.fecha:0 ))
                    return (<option key={i}  value={element.fecha}>{element.semana}</option>)
                })
            }
        </Form.Select>               
    );
}
export { DashboardProvider, useDataDashboard, CargaClientes, CargarSemanas }