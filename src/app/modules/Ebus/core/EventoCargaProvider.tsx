import { AxiosResponse } from "axios";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap-v5";
import DualListBox from "react-dual-listbox";
import { CirclesWithBar, Watch } from "react-loader-spinner";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { PostEventActiveRecargaByDayAndClient } from "../data/Eventocarga";
import { GetClientesEsomos, GetVehiculos, ValidarTiempoActualizacion } from "../data/NivelCarga";
import { ClienteDTO, dualListDTO, InicioCliente, TablaDTO } from "../models/EventoCargaModels";
import { AssetsDTO } from "../models/NivelcargaModels";
import 'react-dual-listbox/lib/react-dual-listbox.css'
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import { ExportarExcel } from "../components/EventoCarga/ExportarExcel";
export interface EventoCargaContextModel {
    dataTable?:any;
    Clientes? : ClienteDTO[];
    ClienteSeleccionado? : ClienteDTO;
    setClientes:(Cliente: ClienteDTO[]) => void;
    setdataTable:(Tabla:TablaDTO[]) => void;
    setClienteSeleccionado:(Cliente: ClienteDTO) => void;
    Visible?:boolean;
    setVisible : (visible:boolean)  => void;
    IsFiltrado?:boolean;
    setIsFiltrado:(IsFiltrado:boolean) => void;
    VehiculosFiltrados?: any;
    setVehiculosFiltrados: (Vehiculos:any) => void;
    dataTableFiltrada?:any;
    setdataTableFiltrada:(Tabla:any) => void;
    showVehiculos?:boolean;
    setShowVehiculos : (showVehiculos:boolean) =>void;
    MinSocCarga?:string;
    MaxSocCarga?:string;
    setMinSocCarga:(MinSoc:any) => void;
    setMaxSocCarga:(MaxSoc:any) =>void;
    contador?:boolean;
    setContador : (contador:boolean) =>void;
}
const EventoCargaContext = createContext<EventoCargaContextModel>({
    setClientes: (Cliente: any) => {},
    setClienteSeleccionado: (Data: any) => {},
    setdataTable:(Data:any) => {},
    setVisible:(Visible:boolean) =>{},
    setIsFiltrado:(IsFiltrado:boolean) =>{},
    setdataTableFiltrada:(Tabla:TablaDTO[]) =>{},
    setVehiculosFiltrados: (Vehiculos:any) =>{},
    setShowVehiculos:(showVehiculos:boolean) => {},
    setMinSocCarga:(MinSoc:any) => {},
    setMaxSocCarga:(MaxSoc:any) => {},
    setContador:(Contador:boolean) => {}
});
const EventoCargaProvider: React.FC = ({ children }) => {
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [dataTable, setdataTable] = useState<TablaDTO[]>([])
    const [Visible, setVisible] = useState<boolean>(true);
    const [IsFiltrado, setIsFiltrado] = useState<boolean>(false);
    const [dataTableFiltrada, setdataTableFiltrada] = useState<TablaDTO[]>([])
    const [VehiculosFiltrados, setVehiculosFiltrados] = useState<any[]>([])
    const [showVehiculos, setShowVehiculos] = useState<boolean>(false);
    const [MaxSocCarga, setMaxSocCarga] = useState<string>("")
    const [MinSocCarga, setMinSocCarga] = useState<string>("")
    const [contador, setContador] = useState<boolean>(false)

    const value: EventoCargaContextModel = {
       setClientes,
       setClienteSeleccionado,
       ClienteSeleccionado,
       Clientes,
       dataTable,
       setdataTable,
       Visible,
       setVisible,
       IsFiltrado,
       setIsFiltrado,
       setdataTableFiltrada,
       dataTableFiltrada,
       VehiculosFiltrados,
       setVehiculosFiltrados,
       showVehiculos,
       setShowVehiculos,
       MaxSocCarga,
       setMaxSocCarga,
       MinSocCarga,
       setMinSocCarga,
       contador,
       setContador
    };
    return (
        <EventoCargaContext.Provider value={value}>
            {children}
        </EventoCargaContext.Provider>
    );
};
function useDataEventoCarga() {
    return useContext(EventoCargaContext);
}
const DataRecargaTiempoClientes: React.FC = ({ children }) => {
    const { Visible, Clientes, ClienteSeleccionado, dataTable,  setVisible,  setClienteSeleccionado, setClientes, setdataTable } = useDataEventoCarga();
    const CargarEventos = (clienteIdS:string,Periodo: string) =>{
        setVisible(true)
        PostEventActiveRecargaByDayAndClient(clienteIdS,Periodo).then((response:AxiosResponse<any>) =>{
            setdataTable(response.data);
            setVisible(false);
        }).catch((error) =>{
            console.log(error);
            setVisible(false);
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
            GetTiempo(response.data[0].clienteIdS);
        }).catch((error) =>{
            console.log(error);
            errorDialog("<i>Eror al consultar los clientes</i>","")
        })
    }
    useEffect(() => {
        
            consulta(children);
        
    }, [children]);
    return <>{(CargaListadoClientes(Clientes,ClienteSeleccionado, setClienteSeleccionado))}</>;
};
const Indicador : React.FC = ({children}) =>{
    return <>{CargarIndicador({children})}</>
};
const IndicadorCargado : React.FC = ({children}) =>{
    return <>{CargarIndicadorCargado({children})}</>
};
//props filtros vehiculos
type Props = {
    clienteIds:any;
    show:boolean;
    handleClose:() => void;
    datatable:any;
    setdataTableFiltrada:(dataTableFiltrada:any) =>void;
    setIsFiltrado:(IsFiltrado:boolean) =>void;
    IsFiltrado:boolean;
}

///Para consultar los filtros por vehiculos.

const VehiculosFiltros : React.FC<Props> = ({clienteIds, show, handleClose, datatable, setdataTableFiltrada, setIsFiltrado, IsFiltrado}) =>{
    const [vehiculos, setvehiculos] = useState<dualListDTO[]>([]);
    const [selected, setSelected] = useState([]);
const { setShowVehiculos, showVehiculos} = useDataEventoCarga();
    useEffect(()=>{
        console.log("cambio el filtrado");
    },[IsFiltrado])
    function Widget () {
        return (
            <DualListBox
                options={vehiculos}
                selected={selected}
                onChange={(selected:any) => setSelected(selected)}
            />
        );
    }
    const RetornarValor = () =>{
        let a:TablaDTO[]  = [];
        let b = filterObjeto(datatable, selected);
        if(b != undefined)
            a = b
        if(a?.length != 0)
            setdataTableFiltrada(a);
        if(IsFiltrado == undefined || IsFiltrado == false)
            setIsFiltrado(true);
        handleClose()
    }

    const filterObjeto = (list:TablaDTO[], compare:any)=> {
        if( compare == undefined || compare.length ==0 )
            return;
        var ArrayNew = [];
        var countProp = compare.length;
        var countMatch = 0;
        var valComp;
        var valList;
        for (var iList in list) {
            for (let alits in  compare)
                if (list[iList].placa == compare[alits])
                     ArrayNew.push(list[iList]);
        }
        return ArrayNew;
    }

    useEffect(() =>{
        GetVehiculos((clienteIds != undefined )? clienteIds: null).then((response:AxiosResponse<any>) =>{
            let dual = response.data.map((item:AssetsDTO)=>{
                return {"value":item.description, "label":item.description};
            })
            setvehiculos(dual);
        }).catch((error) =>{
            errorDialog("<i>Error al consultar los vehiculos</i>","");
        });
    },[clienteIds])
    
    return (
            <Modal 
            show={show} 
            onHide={handleClose} 
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
                <Button type="button" variant="secondary" onClick={handleClose}>
                Cancelar
                </Button>
                <Button type="button" variant="primary" onClick={RetornarValor}>
                    Filtrar
                </Button>
            </Modal.Footer>
            </Modal>
       
    )
};

type PropsSoc = {
    show:boolean;
    handleClose: () => void;
}
const SocFiltro : React.FC<PropsSoc>= ({show,handleClose}) =>{
    const { MinSocCarga, MaxSocCarga, setMaxSocCarga, setMinSocCarga } = useDataEventoCarga();
    let min = "";
    let max = "";
    const End = (a:any) =>{
        console.log(`Maximo:${a[1]} `);
        console.log(`Minimo: ${a[0]}`);
        min = a[0];
        max = a[1];
        setTimeout(() => {
            setMinSocCarga(min);
            setMaxSocCarga(max);
        }, 10000);
    }

    function Slider () {
        return(
            <Nouislider range={{
                min: [0],
                max: [100]
              }}   start={[0,100]} tooltips={true}  onUpdate={End}/>
        )
     }
     useEffect(() =>{
       
        
     },[min, max])
 return(
    <>  <Modal 
    show={show} 
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
//para indicar que esta cargando
function CargarIndicador (children:any){
const { Visible } = useDataEventoCarga();
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
    const { Visible } = useDataEventoCarga();
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

  function BotonesFiltros () {
    const { setIsFiltrado, IsFiltrado, setShowVehiculos, showVehiculos, setContador, contador} = useDataEventoCarga()
    const [show, setShow] = useState<boolean>(false)
   
    const AbrirModalVehiculos = () =>{
        setContador(true);
        setShowVehiculos(true);
        // (IsFiltrado == false ? setIsFiltrado(true):setIsFiltrado(false));
    }
    return (
        <>
            <button type="button" title="Soc" className="btn btn-sm btn-primary" onClick={() => setShow(true)}><i className="bi-battery-charging" ></i></button>
            {<>&nbsp;</>}
            <button type="button" title="Vehiculos" className="btn btn-sm btn-danger" onClick={AbrirModalVehiculos}><i className="bi-car-front-fill" >{(IsFiltrado==true ? <span>&times;</span>:<span>no</span>)}</i></button>
            {<>&nbsp;</>}
            <ExportarExcel NombreArchivo={"EventoCarga"} ></ExportarExcel>
        </>
    )
  }


export {EventoCargaProvider, useDataEventoCarga, DataRecargaTiempoClientes, Indicador, IndicadorCargado, VehiculosFiltros, SocFiltro, BotonesFiltros}