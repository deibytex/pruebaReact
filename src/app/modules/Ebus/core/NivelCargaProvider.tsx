import { AxiosResponse } from "axios";
import moment from "moment";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap-v5";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { GetClientesEsomos, GetClientesEsomos1, PostEventActiveViajesByDayAndClient, ValidarTiempoActualizacion } from "../data/NivelCarga";
import { ClienteDTO, dualListDTO, InicioCliente, TablaDTO } from "../models/NivelcargaModels";
import { CirclesWithBar, Vortex, Watch } from "react-loader-spinner";
import Nouislider from "nouislider-react";
import DualListBox from "react-dual-listbox";
import { ExportarExcel } from "../components/EventoCarga/ExportarExcel";
import { useSelector } from "react-redux";
import { RootState } from "../../../../setup";
import { UserModelSyscaf } from "../../auth/models/UserModel";

// clase con los funciones  y datos a utiilizar
type Props = {
    Visible: boolean;
}
export interface NivelCargaContextModel {
    DatosMapa?: TablaDTO[];
    dataTable?:TablaDTO[];
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
    markerSeleccionado? : TablaDTO,
    setmarkerSeleccionado: (marker: TablaDTO) => void;
    lstFiltroVehiculo? : TablaDTO[],
    setlstFiltroVehiculo: (marker: TablaDTO[]) => void;
    VehiculosFiltrados?: string[];
    setVehiculosFiltrados: (Vehiculos:string[]) => void;
    MinSocCarga?:number;
    MaxSocCarga?:number;
    setMinSocCarga:(MinSoc:number) => void;
    setMaxSocCarga:(MaxSoc:number) =>void;
    showVehiculos?:boolean;
    setShowVehiculos : (showVehiculos:boolean) =>void;
    ShowSoc?:boolean;
    setShowSoc:(Soc:boolean) =>void;
    IsFiltrado?:boolean;
    setIsFiltrado:(IsFiltrado:boolean) => void;
    isExpandido?:boolean;
    setisExpandido:(isExpandido:boolean) => void;
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
    setVehiculosFiltrados: (Vehiculos:string[])=> { },
     setMinSocCarga:(MinSoc:number) => { },
    setMaxSocCarga:(MaxSoc:number) => {},
    setShowVehiculos : (showVehiculos:boolean)=> { },
    setShowSoc:(Soc:boolean)=> { },
    setIsFiltrado:(IsFiltrado:boolean)=> { },
    setisExpandido:(isExpandido:boolean)=> { }

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
        showVehiculos, setShowVehiculos,ShowSoc, setShowSoc, IsFiltrado, setIsFiltrado,
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
const Indicador: React.FC = ({ children }) => {
    return <>{CargarIndicador({ children })}</>
}
const IndicadorCargado: React.FC = ({ children }) => {
    return <>{CargarIndicadorCargado({ children })}</>
}
//Hace toda la magia de ir al servidor, traerse los datos y setearlos
const DataEventosTiempoClientes: React.FC = ({ children }) => {
    const {Clientes, ClienteSeleccionado, setVisible, setEstotal,  setClienteSeleccionado, setClientes, setPeriodo, setdataTable } = useDataNivelCarga();
       // informacion del usuario almacenado en el sistema
       const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );

    // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
    const model = (isAuthorized as UserModelSyscaf);

   
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
            let periodo = moment().format("MYYYY").toString();

            CargarEventos(ClienteId, periodo);
            interval.current = setInterval(() => {
                CargarEventos(ClienteId, periodo);
            }, tiempo);

          
   }).catch((error) => {
            errorDialog("<i>Eror al el tiempo de actualización</i>", "")
        })
    }
    //CONSULTA VEHICULOS OPERANDO
    let consulta = (children: any) => {
        // consultamos en la base de datos la informacion de vehiculos operando


        GetClientesEsomos1(model.Id).then((response: AxiosResponse<any>) => {
            setClientes(response.data);
            setClienteSeleccionado(response.data[0])
            setPeriodo(children);
            setEstotal(true);
             GetTiempo(response.data[0].clienteIdS);
          
        }).catch((error) => {
            errorDialog("<i>Eror al consultar los clientes</i>", "")
        })
    }
    useEffect(() => {
      
        if(interval.current != 0)
        clearInterval(interval.current)
        if (children) {
             consulta(children);
        }

        return () =>  {  
            clearInterval(interval.current);
            setdataTable([]);
            setClientes([]);
            // limpiamos todas las variables a ser detruidas
        
        };
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
            if (Clientes)
                setClienteSeleccionado(lstClientes[0]);
        }} aria-label="Default select example">
         
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


const VehiculosFiltros : React.FC = () =>{
  
const { VehiculosFiltrados, setVehiculosFiltrados,  dataTable,  setIsFiltrado, MinSocCarga,MaxSocCarga 
, showVehiculos, setShowVehiculos
} = useDataNivelCarga();
const [vehiculos, setvehiculos] = useState<dualListDTO[]>([]);
    
    function Widget () {
        return (
            <DualListBox
                options={vehiculos}
                selected={VehiculosFiltrados}
                onChange={(selected:string[]) => {setVehiculosFiltrados(selected);    setIsFiltrado( true); }}
            />
        );
    }  

// llenamos la informacion de vehkiculos basados en la informacion del datatable
    useEffect(() =>{
        if(dataTable != undefined && dataTable.length > 0)
        {
            let dual = dataTable.map((item)=>{
                 const itemd : dualListDTO = { label :item.placa ?? "", value : item.placa ?? "" }; 
                return itemd;
            })
            setvehiculos(dual)
        }
       
    },[dataTable])

 
    const cerrarModal = (e:any) => { 
        
        //IsFiltrado
        if(VehiculosFiltrados != undefined)
        setIsFiltrado( (VehiculosFiltrados?.length > 0));
        setShowVehiculos(false);
       
    };

    const cancelar = (e:any) => { 
        
        //IsFiltrado
        setVehiculosFiltrados([])
        if( !(MinSocCarga != 0 || MaxSocCarga != 100))
        setIsFiltrado( false);
        setShowVehiculos(false);
    };
    
    
    return (
            <Modal 
            show={showVehiculos} 
            onHide={cerrarModal} 
            size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{(`Filtro por vehiculos`)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                        <Widget/>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button type="button" variant="primary" onClick={cerrarModal}>
                Filtrar
                </Button>  
                <Button type="button" variant="secondary" onClick={cancelar}>
                Cancelar
                </Button>    
                           
            </Modal.Footer>
            </Modal>
       
    )
};


const SocFiltro : React.FC= () =>{
    const { MinSocCarga, MaxSocCarga, setMaxSocCarga, setMinSocCarga , setIsFiltrado, setShowSoc, ShowSoc} = useDataNivelCarga();

    const End = (a:any) =>{     
        
         setMinSocCarga(Number.parseInt(a[0]))
         setMaxSocCarga(Number.parseInt(a[1]))
    }
    const handleClose = (e:any) => {     
        setIsFiltrado((MinSocCarga != 0 || MaxSocCarga != 100));
        setShowSoc(false);
    };
   
   
    function Slider () {
        return(
            <Nouislider range={{
                min: [0],
                max: [100]
              }}  start={[MinSocCarga ?? 0, MaxSocCarga ?? 100]} tooltips={true}  onSet={End}/>
        )
     }

 return(
    <>  <Modal 
    show={ShowSoc} 
    onHide={handleClose} 
     size="sm">
      <Modal.Header closeButton style={{height:'20px'}}>
      <Modal.Title>{"Soc"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <div className="row">
              <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                {/* <div className="dropright" id="ventanaSoc" style={{transform: 'translate3d(110px, -85px, 0px) !important'}} data-keyboard="false" data-backdrop="static"> */}
                     <div style={{height:'80px',textAlign: 'center'}}> 
                        <div style={{margin: '7px'}}>
                            <span className="control-label font-weight-bold" style={{textAlign:'center', fontSize:'10px'}}>Soc:</span>
                            <div className="row" style={{width:'100%'}}>
                                <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                                    <Slider/>
                                </div>
                            </div>
                            <div id="result" style={{ background: 'red' }} />
                        </div>
                     </div> 
                {/* </div> */}
              </div>
          </div>
      </Modal.Body>
    </Modal></>
 )
}

function BotonesFiltros () {
    const { setIsFiltrado, IsFiltrado, setShowSoc, setShowVehiculos,   setMinSocCarga, setMaxSocCarga, setVehiculosFiltrados} = useDataNivelCarga()
  
   
    const AbrirModalVehiculos = () =>{
      
        setShowVehiculos(true);
        // (IsFiltrado == false ? setIsFiltrado(true):setIsFiltrado(false));
    }

    const AbrirModalSoc = () =>{
        setShowSoc(true);
    }
    const QuitarFiltros = () =>{
     
        setIsFiltrado(false);
        setMinSocCarga(0);
        setMaxSocCarga(100);
        setVehiculosFiltrados([]);
    }
    return (
        <>
            <button type="button" title="Soc" className="btn btn-sm btn-primary" onClick={AbrirModalSoc}><i className="bi-battery-charging" ></i></button>
            {<>&nbsp;</>}
            <button type="button" title="Vehiculos" className="btn btn-sm btn-info" onClick={AbrirModalVehiculos}><i className="bi-car-front-fill" ></i></button>
            {<>&nbsp;</>}
         
            <button  style={{display:`${IsFiltrado==false ? 'none':'inline'}`}} type="button" title="Quitar filtros" className="btn btn-sm btn-danger" onClick={QuitarFiltros}><i className="bi-filter" >{(IsFiltrado==true ? <span>&times;</span>:"")}</i></button>
        </>
    )
  }

export { NivelCargaProvider, useDataNivelCarga, DataEventosTiempoClientes, Indicador, IndicadorCargado , VehiculosFiltros, SocFiltro, BotonesFiltros}