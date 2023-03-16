import { AxiosResponse } from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap-v5";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { GetInformeTransmision, ObtenerListadoCLientes } from "../data/Reporte";
import { ClienteDTO, InicioCliente, TablaDTO } from "../models/ReporteModels";
import FileSaver from "file-saver";
import XLSX from 'sheetjs-style';
import moment from "moment";
export interface ReporteContextModel {
    Clientes? : ClienteDTO[];
    ClienteSeleccionado? : ClienteDTO;
    setClientes:(Cliente: ClienteDTO[]) => void;
    setClienteSeleccionado:(Cliente: ClienteDTO) => void;
    Data?:TablaDTO[];
    setData:(data:any) =>void;
    Cargando?:boolean;
    setCargando:(Cargando:boolean) => void;
    DataFiltrada?:TablaDTO[];
    setDataFiltrada:(data:any) =>void;
    Filtrado?:boolean;
    setFiltrado:(Filtrado:boolean) => void;
}
const ReporteContext = createContext<ReporteContextModel>({
    setClientes: (Cliente: any) => {},
    setClienteSeleccionado: (Data: any) => {},
    setData:(data:any) => {},
    setDataFiltrada:(data:any) => {},
    setCargando:(Cargando:boolean) => {},
    setFiltrado:(Filtrado:boolean)  => {}
});
const ReporteProvider: React.FC = ({ children }) => {
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [Data, setData] = useState<TablaDTO[]>([]);
    const [DataFiltrada, setDataFiltrada] = useState<TablaDTO[]>([]);
    const [Cargando, setCargando] = useState<boolean>(false);
    const [Filtrado, setFiltrado] = useState<boolean>(false);
    const value: ReporteContextModel = {
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
        setFiltrado
    };
    return (
        <ReporteContext.Provider value={value}>
            {children}
        </ReporteContext.Provider>
    );
};

function useDataReporte() {
    return useContext(ReporteContext);
};


const CargaClientes: React.FC = ({children}) => {
    const { setClienteSeleccionado, setClientes, ClienteSeleccionado, Clientes, setCargando, setFiltrado, Filtrado, Data, setDataFiltrada, setData} = useDataReporte();
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
   
     const ConsultarDatos  = ()=>{
                let FechaActual = moment().add("hours",10).add("minutes",30).format("YYYY/MM/DD").toString();
          let Cliente = "0";
         GetInformeTransmision(Cliente,FechaActual).then((response:AxiosResponse) =>{
              setData(response.data);
             
          }).catch(() =>{
              errorDialog("Ha ocurrido un error al intentar consultar el informe","");
          })
       }
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

            if(Cliente?.clienteIdS != 0)
            {
                setFiltrado(true);
                let Filtrado = Data.filter((val:any, index:any) =>{
                    return (val.clienteIdS == Cliente?.clienteIdS);
                })
                setDataFiltrada(Filtrado);
            }
            else
            {
                setFiltrado(false);
                ConsultarDatos();
            }

        }} aria-label="Default select example">
            <option value={0}>Todos</option>
            {           
                Clientes?.map((element:any,i:any) => {
                        let flag = (element.clienteIdS === (ClienteSeleccionado!= undefined?ClienteSeleccionado?.clienteIdS:0 ))
                    return (<option key={element.clienteIdS}  value={(element.clienteIdS != null ? element.clienteIdS:0)}>{element.clienteNombre}</option>)
                })
            }
        </Form.Select>               
    );
}

const ExportarExcelBoton = () =>{
    
    const {  Data, setCargando } = useDataReporte();
 
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;carset=UTF-8';
    const fileExtension = '.XLSX';
    const exportarExcel = async() =>{
        setCargando(true);
        if(Data!= undefined && Data.length > 0){
            let NombreArchivo = "Reporte"
            const ws = XLSX.utils.json_to_sheet(Data);
            const wb = { Sheets: { 'data' :ws }, SheetNames:['data']};
            const excelBuffer = XLSX.write(wb,{ bookType:'xlsx', type: 'array'});
            const data = new Blob([excelBuffer],{type: fileType});
            FileSaver(data,`${NombreArchivo}${fileExtension}`);
            setCargando(false);
        }else{
            setCargando(false);
            errorDialog("No hay datos que exportar","");
        }
    }
    return(
            <button title='Exportar datos a excel' className='btn btn-sm btn-primary' onClick={(e) =>{exportarExcel()}}>
                <i className='bi-file-earmark-excel-fill' style={{color:'#b6fffe'}}></i>
            </button>
    )
}
export { ReporteProvider, useDataReporte, CargaClientes, ExportarExcelBoton }