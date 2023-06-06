import { AxiosResponse } from "axios";
import moment from "moment";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap-v5";
import DualListBox from "react-dual-listbox";
import { CirclesWithBar, Watch } from "react-loader-spinner";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { PostEventActiveRecargaByDayAndClient } from "../data/Eventocarga";
import { GetClientesEsomos, ValidarTiempoActualizacion } from "../data/NivelCarga";
import { ClienteDTO, dualListDTO, InicioCliente, TablaDTO } from "../models/EventoCargaModels";
import 'react-dual-listbox/lib/react-dual-listbox.css'
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import { ExportarExcel } from "../components/EventoCarga/ExportarExcel";
import { FechaServidor } from "../../../../_start/helpers/Helper";
export interface EventoCargaContextModel {
    dataTable?: TablaDTO[];
    Clientes?: ClienteDTO[];
    ClienteSeleccionado?: ClienteDTO;
    setClientes: (Cliente: ClienteDTO[]) => void;
    setdataTable: (Tabla: TablaDTO[]) => void;
    setClienteSeleccionado: (Cliente: ClienteDTO) => void;
    Visible?: boolean;
    setVisible: (visible: boolean) => void;
    IsFiltrado?: boolean;
    setIsFiltrado: (IsFiltrado: boolean) => void;
    VehiculosFiltrados?: string[];
    setVehiculosFiltrados: (Vehiculos: string[]) => void;
    dataTableFiltrada?: TablaDTO[];
    setdataTableFiltrada: (Tabla: TablaDTO[]) => void;
    showVehiculos?: boolean;
    setShowVehiculos: (showVehiculos: boolean) => void;
    MinSocCarga?: number;
    MaxSocCarga?: number;
    setMinSocCarga: (MinSoc: number) => void;
    setMaxSocCarga: (MaxSoc: number) => void;
    contador?: boolean;
    setContador: (contador: boolean) => void;
    ShowSoc?: boolean;
    setShowSoc: (Soc: boolean) => void;
}
const EventoCargaContext = createContext<EventoCargaContextModel>({
    setClientes: (Cliente: any) => { },
    setClienteSeleccionado: (Data: any) => { },
    setdataTable: (Data: TablaDTO[]) => { },
    setVisible: (Visible: boolean) => { },
    setIsFiltrado: (IsFiltrado: boolean) => { },
    setdataTableFiltrada: (Tabla: TablaDTO[]) => { },
    setVehiculosFiltrados: (Vehiculos: any) => { },
    setShowVehiculos: (showVehiculos: boolean) => { },
    setMinSocCarga: (MinSoc: number) => { },
    setMaxSocCarga: (MaxSoc: number) => { },
    setContador: (Contador: boolean) => { },
    setShowSoc: (Soc: boolean) => { }
});
const EventoCargaProvider: React.FC = ({ children }) => {
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [dataTable, setdataTable] = useState<TablaDTO[]>([])
    const [Visible, setVisible] = useState<boolean>(true);
    const [IsFiltrado, setIsFiltrado] = useState<boolean>(false);
    const [dataTableFiltrada, setdataTableFiltrada] = useState<TablaDTO[]>([])
    const [VehiculosFiltrados, setVehiculosFiltrados] = useState<string[]>([])
    const [showVehiculos, setShowVehiculos] = useState<boolean>(false);
    const [MaxSocCarga, setMaxSocCarga] = useState<number>(100)
    const [MinSocCarga, setMinSocCarga] = useState<number>(0)
    const [contador, setContador] = useState<boolean>(false)
    const [ShowSoc, setShowSoc] = useState<boolean>(false)

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
        setContador,
        ShowSoc,
        setShowSoc
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
    const { setVisible, setdataTable } = useDataEventoCarga();
    const interval = useRef<any>();
    const Periodo = moment(FechaServidor).format("MYYYY").toString();

    const CargarEventos = (clienteIdS: string, Periodo: string) => {
        setVisible(true)
        PostEventActiveRecargaByDayAndClient(clienteIdS, Periodo).then((response: AxiosResponse<any>) => {
            setdataTable(response.data);
            setVisible(false);
        }).catch((error) => {
            console.log(error);
            setVisible(false);
            errorDialog("<i>Eror al consultar los eventos</i>", "")
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

    useEffect(() => {
        if (interval.current != 0)
            clearInterval(interval.current)
        if (children)
            GetTiempo(children.toString());
        return () => clearInterval(interval.current);
    }, [children]);
    return <></>;
};
const Indicador: React.FC = ({ children }) => {
    return <>{CargarIndicador({ children })}</>
};
const IndicadorCargado: React.FC = ({ children }) => {
    return <>{CargarIndicadorCargado({ children })}</>
};
//props filtros vehiculos

///Para consultar los filtros por vehiculos.

const VehiculosFiltros: React.FC = () => {
    const [vehiculos, setvehiculos] = useState<dualListDTO[]>([]);



    const { VehiculosFiltrados, setVehiculosFiltrados, dataTable, IsFiltrado, setIsFiltrado, MinSocCarga, MaxSocCarga
        , showVehiculos, setShowVehiculos
    } = useDataEventoCarga();


    function Widget() {
        return (
            <DualListBox
                options={vehiculos}
                selected={VehiculosFiltrados}
                onChange={(selected: string[]) => { setVehiculosFiltrados(selected); setIsFiltrado(true); }}
            />
        );
    }

    // llenamos la informacion de vehkiculos basados en la informacion del datatable
    useEffect(() => {
        if (dataTable != undefined && dataTable.length > 0) {
            let dual = dataTable.map((item) => {
                return { "value": item.placa, "label": item.placa };
            })
            setvehiculos(dual)
        }

    }, [dataTable])


    const cerrarModal = (e: any) => {

        //IsFiltrado
        if (VehiculosFiltrados != undefined)
            setIsFiltrado((VehiculosFiltrados?.length > 0));
        setShowVehiculos(false);

    };

    const cancelar = (e: any) => {

        //IsFiltrado
        setVehiculosFiltrados([])
        if (!(MinSocCarga != 0 || MaxSocCarga != 100))
            setIsFiltrado(false);
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
                        <Widget />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="secondary" onClick={cancelar}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>

    )
};

type PropsSoc = {
    show: boolean;
    setShowSoc: (soc: boolean) => void;
    datatable: any;
    setdataTableFiltrada: (data: any) => void;
    setIsFiltrado: (data: boolean) => void;
    IsFiltrado: boolean;
}
const SocFiltro: React.FC<PropsSoc> = ({ show, setdataTableFiltrada, IsFiltrado, datatable, setIsFiltrado, setShowSoc }) => {
    const { MinSocCarga, MaxSocCarga, setMaxSocCarga, setMinSocCarga, dataTableFiltrada } = useDataEventoCarga();

    const End = (a: any) => {

        setMinSocCarga(Number.parseInt(a[0]))
        setMaxSocCarga(Number.parseInt(a[1]))
    }
    const handleClose = (e: any) => {
        setIsFiltrado((MinSocCarga != 0 || MaxSocCarga != 100));
        setShowSoc(false);
    };


    function Slider() {
        return (
            <Nouislider range={{
                min: [0],
                max: [100]
            }} start={[MinSocCarga ?? 0, MaxSocCarga ?? 100]} tooltips={true} onSet={End} />
        )
    }

    return (
        <>  <Modal
            show={show}
            onHide={handleClose}
            size="sm">
            <Modal.Header closeButton style={{ height: '20px' }}>
                <Modal.Title>{"Soc"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                        {/* <div className="dropright" id="ventanaSoc" style={{transform: 'translate3d(110px, -85px, 0px) !important'}} data-keyboard="false" data-backdrop="static"> */}
                        <div style={{ height: '80px', textAlign: 'center' }}>
                            <div style={{ margin: '7px' }}>
                                <span className="control-label font-weight-bold" style={{ textAlign: 'center', fontSize: '10px' }}>Soc:</span>
                                <div className="row" style={{ width: '100%' }}>
                                    <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                                        <Slider />
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
function CargarIndicador(children: any) {
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
    )
}


//para rellenar el espacio de cargado
function CargarIndicadorCargado(children: any) {
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
function CargaListadoClientes(Clientes: any, ClienteSeleccionado: any, setClienteSeleccionado: ((arg0: ClienteDTO) => void)) {
    return (
        <Form.Select className=" mb-3 " onChange={(e) => {
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

function BotonesFiltros() {
    const { setIsFiltrado, IsFiltrado, setShowSoc, setShowVehiculos, setContador, setMinSocCarga, setMaxSocCarga, setVehiculosFiltrados } = useDataEventoCarga()


    const AbrirModalVehiculos = () => {
        setContador(true);
        setShowVehiculos(true);
        // (IsFiltrado == false ? setIsFiltrado(true):setIsFiltrado(false));
    }

    const AbrirModalSoc = () => {
        setShowSoc(true);
    }
    const QuitarFiltros = () => {
        setContador(false);
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
            <ExportarExcel NombreArchivo={"EventoCarga"} ></ExportarExcel>
            {<>&nbsp;</>}
            <button style={{ display: `${IsFiltrado == false ? 'none' : 'inline'}` }} type="button" title="Quitar filtros" className="btn btn-sm btn-danger" onClick={QuitarFiltros}><i className="bi-filter" >{(IsFiltrado == true ? <span>&times;</span> : "")}</i></button>
        </>
    )
}


export { EventoCargaProvider, useDataEventoCarga, DataRecargaTiempoClientes, Indicador, IndicadorCargado, VehiculosFiltros, SocFiltro, BotonesFiltros }