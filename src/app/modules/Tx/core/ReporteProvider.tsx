import { AxiosResponse } from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap-v5";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { ObtenerListadoCLientes } from "../data/Reporte";
import { ClienteDTO, InicioCliente, TablaDTO } from "../models/ReporteModels";
import FileSaver from "file-saver";
import XLSX from 'sheetjs-style';
export interface ReporteContextModel {
    Clientes? : ClienteDTO[];
    ClienteSeleccionado? : ClienteDTO;
    setClientes:(Cliente: ClienteDTO[]) => void;
    setClienteSeleccionado:(Cliente: ClienteDTO) => void;
    Data?:TablaDTO[];
    setData:(data:any) =>void;
    Cargando?:boolean;
    setCargando:(Cargando:boolean) => void;
}
const ReporteContext = createContext<ReporteContextModel>({
    setClientes: (Cliente: any) => {},
    setClienteSeleccionado: (Data: any) => {},
    setData:(data:any) => {},
    setCargando:(Cargando:boolean) => {}
});
const ReporteProvider: React.FC = ({ children }) => {
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [Data, setData] = useState<TablaDTO[]>([]);
    const [Cargando, setCargando] = useState<boolean>(false);
    const value: ReporteContextModel = {
        setClientes,
        setClienteSeleccionado,
        ClienteSeleccionado,
        Clientes,
        Data, 
        setData,
        Cargando,
        setCargando
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
    const { setClienteSeleccionado, setClientes, ClienteSeleccionado, Clientes, setCargando } = useDataReporte();
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

    return <>{(ClienteSeleccionado !== undefined && Clientes != undefined ) && SeleccionClientes(Clientes,ClienteSeleccionado,setClienteSeleccionado)}</>;
}

function SeleccionClientes (Clientes:any, ClienteSeleccionado:any, setClienteSeleccionado: ((arg0: ClienteDTO) => void) )  {
    return (           
        <Form.Select defaultValue={0}  className=" mb-3 " onChange={(e) => {
            // buscamos el objeto completo para tenerlo en el sistema
            let lstClientes =  Clientes?.filter((value:any, index:any) => {
                return value.clienteIdS === Number.parseInt(e.currentTarget.value)
            })  
            if(lstClientes != undefined )  
                setClienteSeleccionado(lstClientes[0]); 
          
        }} aria-label="Default select example">
            <option value={0} disabled>Todos</option>
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