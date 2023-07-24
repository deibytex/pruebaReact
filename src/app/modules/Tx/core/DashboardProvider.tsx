import { AxiosError, AxiosResponse } from "axios";
import FileSaver from "file-saver";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap-v5";
import confirmarDialog, { errorDialog, successDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { GetListadoSemanas, SetActualizaUnidadesActivas } from "../data/Dashboard";
import { ObtenerListadoCLientes } from "../data/Reporte";
import { ClienteDTO, InicioCliente } from "../models/DasboardModels";
import XLSX from 'sheetjs-style';
export interface DashboardContextModel {
    Clientes? : ClienteDTO[];
    ClienteSeleccionado? : ClienteDTO;
    setClientes:(Cliente: ClienteDTO[]) => void;
    setClienteSeleccionado:(Cliente: ClienteDTO) => void;
    TabActive?:string;
    setTabActive:(Tab:string) =>void;
    Data?:any[];
    setData:(data:any) =>void;
    DataTx?:any;
    setDataTx:(data:any) =>void;
    DataTk?:any;
    setDataTk:(data:any) =>void;
    Cargando?:boolean;
    setCargando:(Cargando:boolean) => void;
    DataFiltrada?:any[];
    setDataFiltrada:(data:any) =>void;
    DataFiltradaTx?:any[];
    setDataFiltradaTx:(data:any) =>void;
    DataFiltradaTk?:any[];
    setDataFiltradaTk:(data:any) =>void;
    Filtrado?:boolean;
    setFiltrado:(Filtrado:boolean) => void;
    FiltradoTx?:boolean;
    setFiltradoTx:(Filtrado:boolean) => void;
    FiltradoTk?:boolean;
    setFiltradoTk:(Filtrado:boolean) => void;
    Semanas?:any[];
    setSemanas:(Semanas:any[]) => void;
    SemanaSeleccionada?:any[];
    setSemanaSeleccionada:(SemanaSeleccionada:any[]) => void;
    SemanaTipo ? : string;
    setSemanaTipo:(SemanaTipo:string) => void;
    DataAcumulado?:any[],
    setDataAcumulado:(DataAcumulado:any[]) => void;
    DataAcumuladoChurn?:any[],
    setDataAcumuladoChurn:(DataAcumulado:any[]) => void;
    showChurn?:boolean;
    setshowChurn:(showChurn:boolean) =>void;
    DataChurn?:any[];
    setDataChurn:(Data:any[]) =>void;
    Consulta?:boolean;
    setConsulta:(Consulta:boolean) =>void;
}
const DashboardContext = createContext<DashboardContextModel>({
    setClientes: (Cliente: any) => {},
    setClienteSeleccionado: (Data: any) => {},
    setData:(data:any) => {},
    setDataTx:(data:any) => {},
    setDataTk:(data:any) => {},
    setDataFiltrada:(data:any) => {},
    setDataFiltradaTx:(data:any) => {},
    setDataFiltradaTk:(data:any) => {},
    setCargando:(Cargando:boolean) => {},
    setFiltrado:(Filtrado:boolean)  => {},
    setFiltradoTx:(Filtrado:boolean)  => {},
    setFiltradoTk:(Filtrado:boolean)  => {},
    setSemanas:(Semanas:any[]) => {},
    setSemanaSeleccionada:(SemanaSeleccionada:any[])  => {},
    setSemanaTipo:(SemanaTipo:string) =>  {},
    setTabActive:(Tab:string) =>  {},
    setDataAcumulado:(DataAcumulado:any[]) => {},
    setshowChurn:(showChurn:boolean) =>{},
    setDataChurn:(DataAcumulado:any[]) => {},
    setConsulta:(Consulta:boolean) =>{},
    setDataAcumuladoChurn:(DataAcumulado:any[]) => {},
});
const DashboardProvider: React.FC = ({ children }) => {
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [Data, setData] = useState<any[]>([]);
    const [DataTx, setDataTx] = useState<any>();
    const [DataTk, setDataTk] = useState<any>();
    const [DataFiltrada, setDataFiltrada] = useState<any[]>([]);
    const [DataFiltradaTx, setDataFiltradaTx] = useState<any[]>([]);
    const [DataFiltradaTk, setDataFiltradaTk] = useState<any[]>([]);
    const [Cargando, setCargando] = useState<boolean>(true);
    const [Filtrado, setFiltrado] = useState<boolean>(false);
    const [FiltradoTx, setFiltradoTx] = useState<boolean>(false);
    const [FiltradoTk, setFiltradoTk] = useState<boolean>(false);
    const [Semanas, setSemanas] = useState<any[]>([]);
    const [SemanaSeleccionada, setSemanaSeleccionada] = useState<any[]>([]);
    const [SemanaTipo, setSemanaTipo] = useState<string>("1");
    const [TabActive, setTabActive] = useState<string>("Tab1");
    const [DataChurn, setDataChurn] = useState<any[]>([]);
    const [DataAcumulado, setDataAcumulado] = useState<any[]>([]);
    const [showChurn, setshowChurn] = useState<boolean>(false);
    const [Consulta, setConsulta] = useState<boolean>(false);
    const [DataAcumuladoChurn, setDataAcumuladoChurn] = useState<any[]>([]);
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
        DataFiltradaTx, 
        setDataFiltradaTx,
        DataFiltradaTk, 
        setDataFiltradaTk,
        Filtrado,
        setFiltrado,
        FiltradoTx,
        setFiltradoTx,
        FiltradoTk,
        setFiltradoTk,
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
        TabActive,
        setTabActive,
        DataAcumulado,
        setDataAcumulado,
        showChurn,
        setshowChurn,
        DataChurn,
        setDataChurn,
        DataAcumuladoChurn,
        setDataAcumuladoChurn,
        Consulta,
        setConsulta,
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
    const { setClienteSeleccionado, setClientes, ClienteSeleccionado,setFiltradoTx, setDataFiltradaTx, DataTx,  Clientes, setCargando, setFiltrado, Filtrado, Data, setDataFiltrada, setData} = useDataDashboard();
    useEffect(() =>{
        ObtenerListadoCLientes().then((response:AxiosResponse<any>) => {
            setClientes(response.data);
            setClienteSeleccionado(InicioCliente);
        }
        ).catch((error) => {
            errorDialog("Consultar clientes", "Error al consultar los clientes, no se puede desplegar informacion");
        });
    return () => setClientes([]);
    },[]);

    return <>{(ClienteSeleccionado !== undefined && Clientes != undefined && Data != undefined ) && SeleccionClientes(Clientes,ClienteSeleccionado,setClienteSeleccionado, setFiltrado, Data, setDataFiltrada, setData,setFiltradoTx, DataTx, setDataFiltradaTx)}</>;
}

function SeleccionClientes (Clientes:any, ClienteSeleccionado:any, setClienteSeleccionado: ((arg0: ClienteDTO) => void) , setFiltrado: ((arg0: boolean) => void),Data:any, setDataFiltrada: ((arg0: any) => void), setData:((arg0: any) => void), setFiltradoTx:(arg0:any) =>void, DataTx:any, setDataFiltradaTx:(arg0:any) => void)  {
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

           switch(Cliente.clienteIdS) {
            case 0:
                setFiltradoTx(false);
                setFiltrado(false);
                break;
            default:
                setFiltrado(true);
                setFiltradoTx(true);
                if(DataTx != undefined){
                    let DataResult = DataTx['Transmision'].filter((val:any) =>{
                        return (val.ClienteId == Cliente.clienteId)
                    });
                    setDataFiltradaTx(DataResult);
                }
                if(DataTx != undefined){
                    let DataResultU = Data['Unidades'].filter((val:any) =>{
                        return (val.ClienteId == Cliente.clienteId)
                    });
                    setDataFiltrada(DataResultU);
                }
                 break;
          }
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
    const { setSemanas, Semanas, setSemanaSeleccionada, SemanaSeleccionada, SemanaTipo, setSemanaTipo, setFiltrado, setDataFiltrada,setFiltradoTx, setDataFiltradaTx, Data, DataTx, setConsulta } = useDataDashboard();
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
    return <>{(SemanaSeleccionada != undefined && Semanas != undefined && SemanaTipo != undefined ) && (CargarListadoSemanas(setSemanas,Semanas,setSemanaSeleccionada,SemanaSeleccionada, SemanaTipo, setSemanaTipo, setFiltrado, setDataFiltrada,setDataFiltradaTx, Data, DataTx, setConsulta))}</>
}

function CargarListadoSemanas (
    setSemanas:(arg0:any)=>void, 
    Semanas:any, 
    setSemanaSeleccionada: (arg0:any) => void, 
    SemanaSeleccionada:any, 
    SemanaTipo:any, 
    setSemanaTipo:(arg0:any) =>void, 
    setFiltrado:(arg0:any) => void, 
    setDataFiltrada:(arg0:any) => void,
    setDataFiltradaTx:(arg0:any) => void,
    Data:any, 
    DataTx:any,
    setConsulta:(arg0:any) =>void, 
){
    return (           
        <Form.Select defaultValue={0}  className=" mb-3 " onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                let lstSemanas =  Semanas?.filter((value:any, index:any) => {
                    return value.fecha === e.currentTarget.value
                })  
                setSemanaSeleccionada(lstSemanas[0]);
                setConsulta(true);
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
function ExportarExcel() {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;carset=UTF-8';
    const fileExtension = '.XLSX';
    const { Data, DataTx, TabActive } = useDataDashboard()
    const ExportarData = async () =>{
        switch(TabActive) {
            case 'Tab2':

            if(DataTx != undefined && DataTx['Transmision'].length > 0){
                let datosTemp:any[] = [];
                   DataTx['Transmision'].map((value:any) =>{
                    let Objeto = {};
                    Objeto['Semana'] = value.Fecha;
                    Objeto['Matricula'] = value.Matricula;
                    Objeto['Base'] = value.Mase;
                    Objeto['Vertical'] = value.Vertical;
                    Objeto['Descripcion'] = value.Descripcion;
                    Objeto['Sitio'] = value.Sitio;
                    Objeto['Equipo'] = value.Equipo;
                    Objeto['Imei'] = value.Imei;
                    Objeto['Serial'] = value.SerialSim;
                    Objeto['Administrador'] = value.Administrador;
                    Objeto['ID Cliente'] = "'" + value.ClienteId;
                    Objeto['Clasificacion'] = value.ClasificacionId;
                    datosTemp.push(Objeto);
                   }) 
                let NombreArchivo = "ReporteTransmision"
                const ws = XLSX.utils.json_to_sheet(DataTx['Transmision']);
                const wb = { Sheets: { 'data' :ws }, SheetNames:['data']};
                const excelBuffer = XLSX.write(wb,{ bookType:'xlsx', type: 'array'});
                const data = new Blob([excelBuffer],{type: fileType});
                FileSaver(data,`${NombreArchivo}${fileExtension}`);
            }else{
                errorDialog("No hay datos que exportar","");
            }
            break;
            default:
                if(Data != undefined && Data['Unidades'].length > 0){
                    let ExportData:any = [];
                    Data['Unidades'].map((item:any) =>{
                        let Objeto = {};
                        Objeto['Semana'] = item.Fecha;
                        Objeto['Fecha'] = moment(item.FechaSnapShot).format("DD/MM/YYYY");
                        Objeto['Matricula'] = item.Matricula;
                        Objeto['Base'] = item.Base;
                        Objeto['Vertical'] = item.Vertical;
                        Objeto['Descripcion'] = item.Descripcion;
                        Objeto['Sitio'] = item.Sitio;
                        Objeto['Equipo'] = item.Equipo;
                        Objeto['SerialSimOBC'] = item.SerialSimOBC;
                        Objeto['SerialSimMV'] = item.SerialSimMV;
                        Objeto['Administrador'] = item.Administrador;
                        Objeto['ID Cliente'] = "'" + item.ClienteId;
                        Objeto['ActivoFacturable'] = (item.ActivoFacturable);
                        Objeto['LineaMV'] = item.LineaMV;
                        Objeto['OBCSyscaf'] = item.OBCSyscaf;
                        Objeto['MVSyscaf'] = item.MVSyscaf;
                        Objeto['Paquete Comercial'] = item.PaqueteComercial;
                        Objeto['MixVision'] = item.MixVision;
                        ExportData.push(Objeto);
                    })
                    let NombreArchivo = "ReporteUnidadesActivas"
                    const ws = XLSX.utils.json_to_sheet(ExportData);
                    const wb = { Sheets: { 'data' :ws }, SheetNames:['data']};
                    const excelBuffer = XLSX.write(wb,{ bookType:'xlsx', type: 'array'});
                    const data = new Blob([excelBuffer],{type: fileType});
                    FileSaver(data,`${NombreArchivo}${fileExtension}`);
                }else{
                    errorDialog("No hay datos que exportar","");
                }
                break;
          }
    }
    return (
            <button type="button" className="btn btn-sm btn-success mt-8" onClick={ExportarData}><i className="bi-file-earmark-excel"></i>Exportar</button>
    )
}
function ActualizarUnidades() {
    const { TabActive, SemanaSeleccionada, setSemanaSeleccionada, setFiltrado } = useDataDashboard()
    const ActualizarUnidadesActivas = (e:any) =>{
        confirmarDialog(() => {
            let Fecha = (SemanaSeleccionada != undefined  ?  (SemanaSeleccionada?.length != 0 ?moment(SemanaSeleccionada['fecha'] ).format("YYYY/MM/DD").toString(): moment().format("YYYY/MM/DD").toString()): moment().format("YYYY/MM/DD").toString());
            SetActualizaUnidadesActivas(Fecha).then((response:AxiosResponse<any>) =>{
                successDialog("Unidades actualizadas éxitosamente","");

            }).catch((error: AxiosError<any>) =>{
                errorDialog("Ha ocurrido un error","");
            });
        }, `Esta seguro que desea actualizar las unidades activas`, 'Actualizar');
    }

    return(
        <button style={{display: (TabActive == "Tab1" ? 'inline':'none')}} type="button" className="btn btn-sm btn-danger mt-8" onClick={ActualizarUnidadesActivas}> <i className="bi-border-width"></i>Actualizar</button>
    )
}
export { DashboardProvider, useDataDashboard, CargaClientes, CargarSemanas, ExportarExcel, ActualizarUnidades }