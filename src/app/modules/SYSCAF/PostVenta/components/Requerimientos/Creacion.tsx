import BlockUi from "@availity/block-ui";
import { useEffect, useRef, useState } from "react";
import { PageTitle } from "../../../../../../_start/layout/core";
import { DeleteRequerimiento, FiltroData, GetEncabezado, GetEncabezadoFallas, GetRequerimientos, SetDiagnostico, SetNotificaciones, SetRequerimiento, listTabsRequerimientos } from "../../data/Requerimientos";
import { DrawDynamicIconMuiMaterial } from "../../../../../../_start/helpers/components/IconsMuiDynamic";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import moment from "moment";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { FiltrosReportes } from "../../Models/ModelRequerimientos";
import { FiltroDashBoardData } from "../../data/PostVentaData";
import { AxiosResponse } from "axios";
import { DateRangePicker, useToaster, Notification, Checkbox } from "rsuite";
import { Button, Form, FormControl, FormGroup, Modal } from "react-bootstrap-v5";
import { locateFormatPercentNDijitos } from "../../../../../../_start/helpers/Helper";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Assignment,  CallToActionSharp,  CheckBox,  ConstructionOutlined,  DeckTwoTone, Delete, Edit } from "@mui/icons-material";
import { DescargarExcel} from "../../../../../../_start/helpers/components/DescargarExcel";
import { EstadosRequerimientos, ListadoDLP, Usuarios } from "../../mockData/indicadores";
import { useSelector } from "react-redux";
import { UserModelSyscaf } from "../../../../auth/models/UserModel";
import { RootState } from "../../../../../../setup";
import confirmarDialog, { confirmarDialogText, successDialog } from "../../../../../../_start/helpers/components/ConfirmDialog";
import { set } from "rsuite/esm/utils/dateUtils";
export default function Creacion() {
    const toaster = useToaster();
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const message = (type: any, titulo: string, mensaje: React.ReactNode) => {
      return (<Notification className="bg-light-danger" type={type} header={titulo}
        closable duration={10000}>
        {mensaje}
      </Notification>)
    }
    
    const user = useSelector<RootState>(
        ({ auth }) => auth.user
    );
    const vUser = user as UserModelSyscaf;
    //Para saber que usuario ingreso a la cuenta,
    const [UserCount, setUserCount] = useState<any>(
        Usuarios.filter((e:any) =>{
            return e.UserId == vUser.Id;
        })
    );
    // DESCRIPCION PARA EL ENVIO DE NOTIFICACIONES.
    const [TextoNotificacion,setTextoNoticacion] = useState<string>("Hola {UsuarioDestino}, Estás siendo notificado porque el administrador {Admin} te ha asignado el requerimiento {Consecutivo}. Por favor, revisa información. Saludos cordiales.");
    const [NotificarCorreo,setNotificarCorreo] = useState<string>("1");
    const [NotificarPortal,setNotificarPortal] = useState<string>("1");
    //ESPACIO PARA LAS CONST
    const [loader, setloader] = useState<boolean>(false);
    const [lstIndicadores, setListIndicadores] = useState<any>([
        { "Estado": "Abiertos", "Descripcion": "Total de Requerimientos Abiertos", "Valor": 0 },
        { "Estado": "En Soporte", "Descripcion": "Total de Requerimientos en Soporte", "Valor": 0 },
        { "Estado": "Tasa de resolución", "Descripcion": "Tasa de resolución de los requerimientos de los últimos 7 días", "Valor": 0 },
        { "Estado": "Total resueltos", "Descripcion": "Total de requerimientos resueltos en los últimos 7 días.", "Valor": 0 }
    ]);
    const [Id, setId] = useState<string>("");
    const [Respuestas, setRespuestas] = useState<any[]>([]);
    const [val, setval] = useState<string>("");

    //Para el diagnostico
     let DiagnosticoCon:any[]= [];
    const [Diagnostico, setDiagnostico] = useState<any[]>([]);
    const [ConsecutivoNotificacion, setConsecutivoNotificacion] = useState<string>("");
    //Para saber cual es la que viene desde la tabla o DB
    const [CabeceraIncial, setCabeceraInicial] = useState<any>(
        {
            administrador: "",
            UsuarioId: "",
            assetid: "",
            clienteid: "",
            registrationNumber: "",
            nombrecliente: "",
            agente: ""
        }
    );
    //Para las observaciones Iniciales
    const [ObsInicial, setObsInicial] = useState<any>();
    const [ListadoDLPRespuesta,setListadoDLPRespuesta] = useState<any[]>([])
    const [tabSel, settabSel] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [isError, setIsError] = useState(false);
    const [DatosTabla, setDatosTabla] = useState<any[]>([]);
    const [DatosReporte, setDatosReporte] = useState<any[]>([]);
    const [DetallesDatos, setDetallesDatos] = useState<any[]>([]);
    const { allowedMaxDays, allowedRange, combine } = DateRangePicker;
    const [isCallData, setisCallData] = useState<boolean>(false);
    const [show, setshow] = useState<boolean>(false);
    const [ShowFiltros, setShowFiltros] = useState<boolean>(false);
    const [showedit, setshowedit] = useState<boolean>(false);
    const [GrandeModal, setGrandeModal] = useState<any>('');
    const [ShowAsignacion, setShowAsignacion] = useState<boolean>(false);
    const [Encabezado, setEncabezado] = useState<any>({});
    const [TipoRequerimientosSeleccionado, setTipoRequerimientosSeleccionado] = useState<any>({ Nombre: "", Value: "" });
    const [EstadoRequerimientos, setEstadoRequerimientos] = useState<any[]>([]);
    const [EstadoRequerimientosSeleccionado, setEstadoRequerimientosSeleccionado] = useState<any>({ label: "Seleccione", valor: "0" });
    const [EstadoRequerimientosSeleccionadoAnterior, setEstadoRequerimientosSeleccionadoAnterior] = useState<any>({ label: "Seleccione", valor: "0" });
    const [UsuarioSeleccionado, setUsuarioSeleccionado] = useState<any>({ Nombres: "Seleccione", UserId: "0" });
    const [ObservacionesModificar, setObservacionesModificar] = useState<string>("");
    const [Titulo, setTitulo] = useState<string>("Edición de requerimientos");
    const [Consecutivo, setConsecutivo] = useState<string>("Edición de requerimientos");
    const [Admin, setAdmin] = useState<any>({"Administrador":"", "Id":""});
    const FiltrosBase: FiltrosReportes = {
        FechaInicialInicial: moment().add(-30, 'days').startOf('day').toDate(),
        FechaFinalInicial: moment().startOf('day').toDate(),
        FechaInicial: moment().startOf('day').add(-30, 'days').toDate(),
        FechaFinal: moment().startOf('day').toDate(),
        limitdate: 30,
        Data: [],
        Consulta: true
    };
    const TipoReporteBase = [
        { reporte: "Todos", tabla: "tblTodos", tipoConsulta: "Todos", tituloFiltro: "Todos", filtros: { ...FiltrosBase, MaxDay: 30 }, Data: [], tipo: "Todos", Consultar: true },
        { reporte: "Asignados", tabla: "tblsAsignados", tipoConsulta: "asignados", tituloFiltro: "Asignados", filtros: { ...FiltrosBase, MaxDay: 30 }, Data: [], tipo: "Asignados" },
        { reporte: "Noasignados", tabla: "tblsNoasignados", tipoConsulta: "Noasignados", tituloFiltro: "Noasignados", filtros: { ...FiltrosBase, MaxDay: 30 }, Data: [], tipo: "Noasignados" },
        { reporte: "Cerrados", tabla: "tblCerrados", tipoConsulta: "cerrados", tituloFiltro: "Cerrados", filtros: { ...FiltrosBase, MaxDay: 7 }, Data: [], tipo: "Cerrados" },
        { reporte: "Reporte", tabla: "tblReporte", tipoConsulta: "reporte", tituloFiltro: "Reporte", filtros: { ...FiltrosBase, MaxDay: 7 }, Data: [], tipo: "Reporte" },
    ]
    const [TipoReporte, setTipoReporte] = useState(TipoReporteBase);
    const [Clientes, setClientes] = useState<any[]>([]);
    const [Agentes, setAgentes] = useState<any[]>([]);
    const [Estados, setEstados] = useState<any[]>([]);

    const [AgentesSeleccionado, setAgentesSeleccionado] = useState<any>({ "Agente": "Todos", "UsuarioId": "Todos" });
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<any>({ "Cliente": "Todos", "ClienteId": "Todos" });
    const [EstadoSeleccionado, setEstadoSeleccionado] = useState<any>({ "Estado": "Todos" });
    const [showTablaTodos, setShowTablaTodos] = useState<boolean>(false);
    const [showTablaCerradas, setShowTablaCerradas] = useState<boolean>(false);
    const [showTablaAsginadas, setShowTablaAsignadas] = useState<boolean>(false);
    const [showTablaSinAsginar, setshowTablaSinAsginar] = useState<boolean>(false);
    const [showTablaReporte, setShowTablaReporte] = useState<boolean>(false);
    let EstadosColores = EstadosRequerimientos.map((e:any) =>{
        return {"label":e.label, "color":(e.tipo =="admin" ?"badge bg-warning":(e.tipo == "soporte" ? "badge bg-info" :"badge bg-primary" ) )};
    })
    //Para los flujos
    const [Flujos, setFlujos] = useState<any>([]);
    const [disable, setdisable] = useState<boolean>(false);
/*============================================================================================================================================================================== */
/** ESpacio para los tipos de estados a usar por el momento usare estos porque fueron los que se habian definido si en un posterior evento se dinamiza cambiar por estos.        */
/*============================================================================================================================================================================== */
    const EventosCreados =   EstadosRequerimientos.filter(f => !["8","6"].includes(f.valor)).map((e:any) =>e.label).join();
    const EventosEnSoporte = EstadosRequerimientos.filter(f => ["3","4","5"].includes(f.valor)).map((e:any) =>e.label).join();
    const Asignados = EstadosRequerimientos.filter((e:any) =>{
        return e.valor == "4"
    })[0].label;
    const SinAsignar  = EstadosRequerimientos.filter((e:any) =>{
        return e.valor == "3"
    })[0].label;
    const Resueltos = EstadosRequerimientos.filter((e:any) =>{
        return e.valor == "8"
    })[0].label;
    const PerfilSuperAdmin = "117";
    const PerfilAdminFlota = "118";
    const PerfilEmpleado = "117";
/*============================================================================================================================================================================== */
/** ESpacio para los tipos de estados a usar por el momento usare estos porque fueron los que se habian definido si en un posterior evento se dinamiza cambiar por estos.        */
/*============================================================================================================================================================================== */
    //ESPACIO PARA LOS ENCABEZADOS DE LAS TABLAS
    let Campos: MRT_ColumnDef<any>[] =
        [
            {
                accessorKey: 'nombrecliente',
                header: 'Cliente',
                Cell({ row, }) {
                    let Cabecera = JSON.parse(row.original.Cabecera);
                    return (Cabecera[0].nombrecliente == undefined ? "" : Cabecera[0].nombrecliente);
                },
            },
            {
                accessorKey: 'Consecutivo',
                header: 'Nro Requerimiento',
                Cell({ row, }) {
                    //Lo divido en 2 para tener mejor claridad
                    let Inicio = String(row.original.Consecutivo).substring(0, 6);
                    let Final = String(row.original.Consecutivo).substring(6, String(row.original.Consecutivo).length);
                    return (`${Inicio}-${Final}`);
                },
                size:140
            },
            {
                accessorKey: 'registrationNumber',
                header: 'Vehiculo',
                Cell({ row, }) {
                    let Cabecera = JSON.parse(row.original.Cabecera);
                    return (Cabecera[0].registrationNumber == undefined ? "" : Cabecera[0].registrationNumber);
                },
                size:130
            },

            {
                accessorKey: 'Estado',
                header: 'Estado',
                Cell({ row, }) {
                    let estado = FiltroData.getEstadosJson(row.original.Estado);
                    return RetornarEstado(estado);
                }
            },
            {
                accessorKey: 'agente',
                header: 'Agente',
                Cell({ row, }) {
                    let Cabecera = JSON.parse(row.original.Cabecera);
                    return (Cabecera[0].agente == undefined ? "" : <span className="fw-bolder text-primary">{Cabecera[0].agente}</span>);
                },
            },
            {
                accessorKey: 'Fecha',
                header: 'Fecha creacion',
                Cell({ row, }) {
                    return moment(row.original.FechaCreacion).format("DD/MM/YYYY HH:MM");
                }
            },
        ];
    //Para el reporte
    let CamposReporte: MRT_ColumnDef<any>[] =
        [
            {
                accessorKey: 'registrationNumber',
                header: 'Vehiculo',
            },
            {
                accessorKey: 'Cantidad',
                header: 'Cantidad',
            },
        ];
    //PARA LOS DETALLES
    let Detalles: MRT_ColumnDef<any>[] =
        [
            {
                accessorKey: 'fecha',
                header: 'Fecha',
                Cell({ row, }) {
                    return moment(row.original.fecha, "DD-MM-YYYY").format("DD/MM/YYYY HH:MM");
                }
            },
            {
                accessorKey: 'observacion',
                header: 'Observación',
            },
            {
                accessorKey: 'usuario',
                header: 'Usuario',
            },

            {
                accessorKey: 'estado',
                header: 'Estado',
                Cell({ cell, column, row, table, }) {
                    return FiltroData.getEstadosJson((row.original.estado != undefined ? row.original.estado:""));
                },
            }
        ];
       
        let ColumnasPreguntas: MRT_ColumnDef<any>[] =
        [
            {
                accessorKey: 'categoria',
                header: 'Categoria',
                size:10
            },
            {
                accessorKey: 'label',
                header: 'Pregunta',
                Cell({ cell, column, row, table, }) {
                    return <label className="control-label label label-sm fw-bolder text-primary preguntas">{row.original.label}</label>
                },
            },
            {
                accessorKey: 'Respuesta',
                header: 'Respuesta',
                size:10,
                Cell({ cell, column, row, table, }) {
                    return <div>{
                            (row.original.tipo == "check" ?
                        <input 
                        className="Respuestas"
                        type="checkbox"
                        style={{borderColor:'#eb3626'}}
                        id={`${row.original.id}`} 
                        title={row.original.label}
                        // data-rel={`${row.original.categoria}${row.original.order}`} 
                        defaultChecked={row.original.Respuesta}
                        value={row.original.Respuesta}
                        onChange={Click}
                        />:
                        <input type="text"   id={`${row.original.id}`}  value={row.original.Respuesta}  onChange={change} className="form-control input input-sm" placeholder="Ingrese una respuesta"></input> )}
                        </div> 
                },
            },
            {
                accessorKey: 'order',
                header: 'orden',
                enableHiding:true,
                
            },
            {
                accessorKey: 'observaciones',
                header: 'Observación',
                Cell({ cell, column, row, table, }) {
                    return <div> {
                                    (row.original.observaciones == "si" ? 
                                        <input type="text" className="form-control input input-sm" data-rel={`${row.original.id}`} value={row.original.RespuestaObservacion} onChange={CambioObs} placeholder="Observación"></input>
                                        :
                                (row.original.observaciones == "si-obligatorio" ?
                                    <input type="text" className="form-control input input-sm" data-rel={`${row.original.id}`} value={row.original.RespuestaObservacion} onChange={CambioObs} placeholder="Observación obligatoria"></input>
                                    :
                                <div></div>
                                ))
                            }</div>
                },
            },
        ];
        const Click = (e:any) =>{
            let listado = [...ListadoDLPRespuesta];
            setListadoDLPRespuesta(listado.map((a: any) => {
                a.Respuesta = (a.id==e.currentTarget.attributes['id'].value ?e.target.checked: a.Respuesta);
                return a;
            }));
        }
        const change = (e:any) =>{
            let listado = [...ListadoDLPRespuesta];
            setListadoDLPRespuesta(listado.map((a: any) => {
                a.Respuesta = (a.id==e.currentTarget.attributes['id'].value ?e.target.value: a.Respuesta);
                return a;
            }));
        }
        const CambioObs = (e:any) =>{
            let listado = [...ListadoDLPRespuesta];
            setListadoDLPRespuesta(listado.map((a: any) => {
                a.RespuestaObservacion = (a.id==e.currentTarget.attributes['data-rel'].value ?e.target.value: a.RespuestaObservacion);
                return a;
            }));
        }
    //FUNCION PARA RETORNAR UN ESTADO GRAFICAMENTE
    const RetornarEstado = (data: any) => {
       let color =  EstadosColores.filter((e) =>{
            return e.label == data;
        })
      return <span className={`${color[0].color}`}>{data}</span>
    }
    //ESPACIO PARA LAS CONSULTAS INICIALES
    const ConsultasIniciales = () => {
        if (TipoReporte[0].Consultar == true || isCallData) {
            setloader(true);
            setIsError(false);
            setIsLoading(true);
            setIsRefetching(true);
            let FechaInicial = TipoReporte[0].filtros.FechaInicial;
            let FechaFinal = TipoReporte[0].filtros.FechaFinal;
            GetRequerimientos(FechaInicial, FechaFinal, vUser.perfil).then(
                (response: AxiosResponse<any>
                ) => {
                    //Para filtar los Clientes
                    let _clientes: any[] = [];
                    Object.entries(FiltroData.getClientes(response.data)).map((elem: any) => {
                        _clientes.push({ "Cliente": elem[0], "ClienteId": elem[1][0] })
                    });
                    setClientes(_clientes);

                    //Para filtrar los Usuarios o agentes
                    let agentes: any[] = [];
                    Object.entries(FiltroData.getAgentes(response.data)).map((elem: any) => {
                        agentes.push({ "Agente": elem[0], "UsuarioId": elem[1][0] })
                    });
                    setAgentes(agentes);
                    //Para filtrar los Estados
                    let estados: any[] = [];
                    Object.entries(FiltroData.getEstados(response.data)).map((elem: any) => {
                        estados.push({ "Estado": elem[1] })
                    });
                    setEstados(estados);
                    //Para pintar los Indicadores
                    PintarIndicadores(response.data);
                    //Para no volver a cargar
                    setisCallData(false);
                    let Tiporeporte = [...TipoReporteBase];
                    Tiporeporte[tabSel].Consultar = false;
                    Tiporeporte[tabSel].Data = response.data;
                    setTipoReporte(Tiporeporte);
                    FiltroDatos();
                    setloader(false);
                    setIsError(false);
                    setIsLoading(false);
                    setIsRefetching(false);
                }).catch(({ error }) => {
                    console.log("error", error)
                    setloader(false);
                    setIsError(true);
                });

            let Estados = EstadosRequerimientos;
            setEstadoRequerimientos(Estados);
            setEstadoRequerimientosSeleccionado(Estados[0]);
        }
        else
            FiltroDatos();
    };
    //ESPACIO PARA LA FUNCION QUE APLICA LOS FILTROS
    const FiltroDatos = () => {
        let tabDefault = 0;
        let filtros = TipoReporte[tabSel].filtros;
        let FechaInicial: Date = filtros.FechaInicial;
        let FechaFinal: Date = filtros.FechaFinal;
        // datos traidos del c liente
        let datosfiltrados: any = TipoReporte[tabDefault].Data;
        // filtramos por las fechas
        datosfiltrados = datosfiltrados.
            filter((f: any) => moment(f.Periodo).toDate() >= FechaInicial && moment(f.Periodo).toDate() <= FechaFinal);
        //FILTRA POR USUARIOS O AGENTES
        if (AgentesSeleccionado.UsuarioId != undefined && AgentesSeleccionado.UsuarioId != "Todos")
            datosfiltrados = FiltroData.getFiltrobyAgente(datosfiltrados, AgentesSeleccionado.UsuarioId);
        //PARA APLICAR FILTRO DE ESTADOS
        if (EstadoSeleccionado.Estado != undefined && EstadoSeleccionado.Estado != "Todos")
            datosfiltrados = FiltroData.getFiltrobyEstados(datosfiltrados, EstadoSeleccionado.Estado);
        if (ClienteSeleccionado.ClienteId != undefined && ClienteSeleccionado.ClienteId != "Todos")
            datosfiltrados = FiltroData.getFiltrobyCliente(datosfiltrados, ClienteSeleccionado.ClienteId);

        // SE HACE SWITCH Entre tabs para cambiar informacion segun se requiera.
        //Y SE HACE RENDER A UNA SOLA TABLA PARA QUE EN LA CONSOLA NO SALGAN ERRORES.
        switch (tabSel) {
            case 0:
            default:
                //PintarIndicadores(datosfiltrados);
                let FiltradoGestor = FiltroData.getFiltroGestor(datosfiltrados,vUser.Id);
                setDatosTabla((FiltradoGestor == undefined ? []:FiltradoGestor));
                setShowTablaTodos(true);
                setShowTablaCerradas(false);
                setShowTablaAsignadas(false);
                setShowTablaReporte(false);
                setshowTablaSinAsginar(false);
                break;
            case 1:
                FiltradoGestor = FiltroData.getFiltroGestor(datosfiltrados,vUser.Id);
                setDatosTabla(FiltroData.getAsignados((FiltradoGestor == undefined ? []:FiltradoGestor),
                Asignados));
                setShowTablaTodos(false);
                setShowTablaCerradas(false);
                setShowTablaAsignadas(true);
                setShowTablaReporte(false);
                setshowTablaSinAsginar(false);
                break;
            case 2:
                FiltradoGestor = FiltroData.getFiltroGestor(datosfiltrados,vUser.Id);
                    setDatosTabla(FiltroData.getNoAsignados((FiltradoGestor == undefined ? []:FiltradoGestor),
                       `${EventosCreados}, ${SinAsignar}`));
                    setshowTablaSinAsginar(true);
                    setShowTablaTodos(false);
                    setShowTablaCerradas(false);
                    setShowTablaAsignadas(false);
                    setShowTablaReporte(false);
                    break;
            case 3:
                FiltradoGestor = FiltroData.getFiltroGestor(datosfiltrados,vUser.Id);
                setDatosTabla(FiltroData.getCerrados((FiltradoGestor == undefined ? []:FiltradoGestor),
                Resueltos));
                setShowTablaTodos(false);
                setShowTablaCerradas(true);
                setShowTablaAsignadas(false);
                setShowTablaReporte(false);
                setshowTablaSinAsginar(false);
                break;
            case 4:
                FiltradoGestor = FiltroData.getFiltroGestor(datosfiltrados,vUser.Id);
                let reporte = FiltroData.getReporte((FiltradoGestor == undefined ? []:FiltradoGestor));
                let DatosReporte: any[] = [];
                Object.entries(reporte).map((elem: any) => {
                    DatosReporte.push({ "registrationNumber": elem[0], "Cantidad": elem[1].length })
                });
                setDatosReporte(DatosReporte);
                setShowTablaTodos(false);
                setShowTablaCerradas(false);
                setShowTablaAsignadas(false);
                setShowTablaReporte(true);
                setshowTablaSinAsginar(false);
                break;
        }


    }
    //ESPACIO PARA LOS USEEFFECT
    useEffect(() => {
        ConsultasIniciales();
        //Elimina lo asincrono
        return () => {
            setDatosTabla([]);
            setDatosReporte([]);
        }
    }, [tabSel, AgentesSeleccionado, ClienteSeleccionado, EstadoSeleccionado])

   // A ver si funciona
    useEffect(() => {
        // te traes la informaci'on almacenada y verificas que no tenga datos
        let listado = [...ListadoDLP];
        setListadoDLPRespuesta(listado.map((a: any) => {
            a.Respuesta = (a.tipo =="check" ? false:"") ;
            a.RespuestaObservacion = "";
            if (Diagnostico.length > 0) {
                let find = Diagnostico.find((f: any) => f.id == a.id);
                a.Respuesta = find.Respuesta;
                a.RespuestaObservacion = find.RespuestaObservacion;
            }
            return a;
        }));
    }, [Diagnostico]);
    // useEffect(() =>{
    //     (GrandeModal != '' ? setshowedit(true):setshowedit(false));
    // },[GrandeModal])
    //FUNCION PARA VALIDAR LAS FECHAS
    let ValidarFechas = (Range: Date[]) => {
        let Tiporeporte = [...TipoReporte];
        let filtros = Tiporeporte[tabSel].filtros;
        let FechaInicial: Date = Range[0];
        let FechaFinal: Date = Range[1];
        let FechaInicialInicial: Date = filtros.FechaInicialInicial;
        let FechaFinalInicial: Date = filtros.FechaFinalInicial;
        setisCallData(
            (filtros.FechaInicialInicial > FechaInicial || filtros.FechaFinalInicial < FechaFinal
                || (filtros.FechaInicialInicial > FechaInicial &&
                    filtros.FechaFinalInicial > FechaFinal)
            )
        )
        // cambiamos los datos iniciales 
        if ((filtros.FechaInicialInicial > FechaInicial)
            || (filtros.FechaInicialInicial > FechaInicial && filtros.FechaFinalInicial > FechaFinal))
            FechaInicialInicial = FechaInicial;

        if ((FechaFinal > filtros.FechaFinalInicial)
            || (filtros.FechaInicialInicial > FechaInicial && filtros.FechaFinalInicial > FechaFinal))
            FechaFinalInicial = FechaFinal;
        // cuando hay una consulta por fechas se debe quitar el filtro por gráfica para que pueda
        // visualizar correctamente la información
        filtros = { ...Tiporeporte[tabSel].filtros, FechaInicial, FechaFinal, FechaInicialInicial, FechaFinalInicial }
        Tiporeporte[tabSel].filtros = filtros;
        setTipoReporte(Tiporeporte)
    }
    //FUNCION PARA PINTAR LOS VALORES DE LOS INDICADORES
    const PintarIndicadores = (datosfiltrados: any) => {
        let Abiertos = FiltroData.getAbiertos(datosfiltrados, EventosCreados);
        let Soporte = FiltroData.getSoporte(datosfiltrados,EventosEnSoporte);
        let TotalRequerimientos = datosfiltrados.length;
        let _Resueltos = FiltroData.getCerrados(datosfiltrados, Resueltos);
        let Resolucion = (TotalRequerimientos == 0 ? 0 : _Resueltos.length / TotalRequerimientos);
        setListIndicadores([
            { "Estado": "Abiertos", "Descripcion": "Total de Requerimientos Abiertos", "Valor": Abiertos.length },
            { "Estado": "En Soporte", "Descripcion": "Total de Requerimientos en Soporte", "Valor": Soporte.length },
            { "Estado": "Tasa de resolución", "Descripcion": "Tasa de resolución de los requerimientos de los últimos 7 días", "Valor": locateFormatPercentNDijitos(Resolucion, 2) },
            { "Estado": "Total resueltos", "Descripcion": "Total de requerimientos resueltos en los últimos 7 días.", "Valor": _Resueltos.length }
        ]);
    };
    //Clientes que ya tienen un requerimiento
    function SeleccionClientes() {
        return (
            <div className="input-group mb-3">
                <span style={{ height: '40px' }} className="input-group-text mt-3" id="basic-addon1"><i className="bi-person-bounding-box"></i></span>
                <Form.Select title="Filtra por clientes" style={{ height: '40px' }} className="input-sm form-select mb-3 mt-3 " onChange={(e) => {
                    // buscamos el objeto completo para tenerlo en el sistema
                    let lstClientes = Clientes.filter((value: any) => {
                        return Number.parseInt(value.ClienteId) === Number.parseInt(e.currentTarget.value)
                    })
                    setClienteSeleccionado((lstClientes[0] ? lstClientes[0] : { "Cliente": "Todos", " ClienteId": "Todos" }));
                }} aria-label="Floating label select cliente">
                    <option value={"Todos"}>Todos</option>
                    {
                        Clientes?.map((element: any) => {
                            let flag = (element.ClienteId === ClienteSeleccionado.ClienteId)
                            return (<option selected={flag} key={element.ClienteId} defaultValue={element.ClienteId} value={element.ClienteId}>{element.Cliente}</option>)
                        })
                    }
                </Form.Select>
            </div>
        );
    }
    //Pinta los agentes pero que ya esten registrados
    function SeleccionAgentes() {
        return (
            <div className="input-group mb-3">
                <span style={{ height: '40px' }} className="input-group-text mt-3" id="basic-addon1"><i className="bi-person-vcard"></i></span>
                <Form.Select title="Filtra por agentes" style={{ height: '40px' }} className="input-sm  mb-3 mt-3 " onChange={(e) => {
                    // buscamos el objeto completo para tenerlo en el sistema
                    let lstagentes = Agentes.filter((value: any) => {
                        return value.UsuarioId === e.currentTarget.value
                    })
                    setAgentesSeleccionado((lstagentes[0] ? lstagentes[0] : { "Agente": "Todos", " UsuarioId": "Todos" }));

                }} aria-label="Default select example">
                    <option value={"Todos"}>Todos</option>
                    {
                        Agentes?.map((element: any) => {
                            let flag = (element.UsuarioId === AgentesSeleccionado.UsuarioId)
                            return (<option selected={flag} key={element.UsuarioId} defaultValue={element.UsuarioId} value={element.UsuarioId}>{element.Agente}</option>)
                        })
                    }
                </Form.Select>
            </div>
        );
    }
    //Funcion que se utiliza para pintar los estados pero para el filtro ya que sino esta el estado en la tabla
    //No lo muestra y si hay la necesidad de poner otro no lo encuentra.
    function SeleccionEstados() {
        return (
            <div className="input-group mb-3">
                <span style={{ height: '40px' }} className="input-group-text mt-3" id="basic-addon1"><i className="bi-credit-card-2-front"></i></span>
                <Form.Select title="Filtra por estados" style={{ height: '40px' }} className="input-sm  mb-3 mt-3 " onChange={(e) => {
                    // buscamos el objeto completo para tenerlo en el sistema
                    let lstEstado = Estados.filter((value: any) => {
                        return value.Estado === e.currentTarget.value
                    })
                    setEstadoSeleccionado((lstEstado[0] ? lstEstado[0] : { "Estado": "Todos" }));

                }} aria-label="Default select example">
                    <option value={"Todos"}>Todos</option>
                    {
                        Estados?.map((element: any) => {
                            let flag = (element.Estado === EstadoSeleccionado.Estado)
                            return (<option selected={flag} key={element.Estado} defaultValue={element.Estado} value={element.Estado}>{element.Estado}</option>)
                        })
                    }
                </Form.Select>
            </div>

        );
    }
    //Detalles del modal.
    const DetallesModal = (row: any) => {
        let Data = JSON.parse(row.original.Observaciones);
        setDetallesDatos(Data);
        setshow(true);
    }
    //PARA QUE PUEDAN SELECCIONAR UN ESTADO NUEVO.
    function EstadosEditar() {
        return (
            <div className="input-group mb-3">
                <span style={{ height: '40px' }} className="input-group-text mt-3" id="basic-addon1"><i className="bi-credit-card-2-front"></i></span>
                <Form.Select title="Estados para asignación" style={{ height: '40px' }} className="input-sm  mb-3 mt-3 " onChange={(e) => {
                    // buscamos el objeto completo para tenerlo en el sistema
                    let lstEstado = EstadoRequerimientos.filter((value: any) => {
                        return value.valor === e.currentTarget.value
                    })
                    setEstadoRequerimientosSeleccionado((lstEstado[0] ? lstEstado[0] : { "Estado": "Seleccione" }));
                }} aria-label="Default select example">
                    <option value={"Seleccione"}>Todos</option>
                    {
                        EstadoRequerimientos?.filter((l:any)=>{
                            let siguiente = Flujos.replaceAll("[","").replaceAll("]","");
                            let division = siguiente.split(",");
                            return (division[0] != "" ?  [EstadoRequerimientosSeleccionado.valor, ...division].includes(l.valor): l);
                        }).map((element: any) => {
                            let flag = (element.valor === EstadoRequerimientosSeleccionado.valor)
                            return (<option selected={flag} key={element.valor} defaultValue={element.valor} value={element.valor}>{element.label}</option>)
                        })
                    }
                </Form.Select>
            </div>

        );
    }
    //PARA QUE PUEDAN SELECCIONAR UN USUARIO NUEVO.
    function AgentesEditar() {
        return (
            <div className="input-group mb-3">
                <span style={{ height: '40px' }} className="input-group-text mt-3" id="basic-addon1"><i className="bi-credit-card-2-front"></i></span>
                <Form.Select disabled={(vUser.perfil === PerfilAdminFlota || (!UserCount[0].EsGestor && disable) ? true:false)} title="Agente para asignación" style={{ height: '40px' }} className="input-sm  mb-3 mt-3 " onChange={(e) => {
                    // buscamos el objeto completo para tenerlo en el sistema
                    let lstAgentes = Usuarios.filter((value: any) => {
                        return value.UserId === e.currentTarget.value
                    })
                    setUsuarioSeleccionado((lstAgentes[0] ? lstAgentes[0] : { Nombres: "Seleccione", UserId: "0" }));
                }} aria-label="Default select example">
                    <option value={"0"}>Selecione</option>
                    {
                        Usuarios?.map((element: any) => {
                            let flag = (element.UserId === UsuarioSeleccionado.UserId)
                            return (<option selected={flag} key={element.UserId} defaultValue={element.UserId} value={element.UserId}>{element.Nombres}</option>)
                        })
                    }
                </Form.Select>
            </div>

        );
    }
    //PARA QUE PUEDAN SELECCIONAR UN AGENTE DIFERENTE Y NUEVO.
    const EditarRequerimiento = (row: any) => {
       //Para saber cual es el diagnostico
        setDiagnostico(row.original.Diagnostico == null ? []: JSON.parse(row.original.Diagnostico));
        setloader(true);
        setObservacionesModificar("");
        let Cabeceras = JSON.parse(row.original.Cabecera);
        setCabeceraInicial(Cabeceras);
        //Usuario
        let Usuario = Cabeceras.map((e: any) => (e.UsuarioId));
        let _admin = Cabeceras.map((e: any) => ({"Administrador":e.administrador,"Id":e.UsuarioAdministradorId }) );
        let Seleccion = Usuarios.filter((u: any) => {
            return u.UserId == Usuario[0];
        });
        setUsuarioSeleccionado((Seleccion.length !=0 ?  Seleccion[0]:{ Nombres: "Seleccione", UserId: "0" }));
        //Estado
        let Estado = (FiltroDashBoardData.EsJson(row.original.Estado) ? JSON.parse(row.original.Estado) : row.original.Estado);
        let EstadoSelect = EstadoRequerimientos.filter((e: any) => {
            return e.label == (Estado.label == undefined ? Estado : Estado.label);
        });
        //Para que no pueda asignarle el req a otro asesor. sino la primera vez a el.
        setdisable((EstadoSelect.length != 0 && EstadoSelect[0].label != EventosCreados ? true:false ));

        let a = EstadoSelect.map((data:any) => {
            return data.flujo;
        }).filter((w) =>w);
        setEstadoRequerimientosSeleccionadoAnterior((EstadoSelect.length == 0 ? { "label": "Todos", "valor": "0" } : EstadoSelect[0]));
        setFlujos(a[0]);
        setEstadoRequerimientosSeleccionado((EstadoSelect.length == 0 ? { "label": "Todos", "valor": "0" } : EstadoSelect[0]));
        //Lo divido en 2 para tener mejor claridad
        let Inicio = String(row.original.Consecutivo).substring(0, 6);
        let Final = String(row.original.Consecutivo).substring(6, String(row.original.Consecutivo).length);
        setTitulo(`Requerimiento ${Inicio}-${Final}`);
        setConsecutivo(`${Cabeceras[0].nombrecliente} - ${Cabeceras[0].registrationNumber}`);
        //Para mostar el modal de edicion.
        //=======================================================================================================================================================
        // Si el registro no esta en estado en progreso muestra cierta cantidad de informacion.
        // Si lo esta 
        //
        //
        //=======================================================================================================================================================
        //&& !UserCount[0].EsGestor
        (vUser.perfil == PerfilEmpleado  && EstadoSelect[0].valor =="5" ?EncabezadoConsulta(Cabeceras[0].assetid):EncabezadoSinconsulta());
        (vUser.perfil == PerfilEmpleado && EstadoSelect[0].valor =="5" ?setGrandeModal("xl"):setGrandeModal("lg"));
        setshowedit(true)
        let Obs = JSON.parse(row.original.Observaciones);
        setObsInicial(Obs);
        setTipoRequerimientosSeleccionado(
            {
                Nombre: row.original.Tipo,
                Value: row.original.Tipo
            }
        );
        setId(row.original.Id);
        setAdmin(_admin[0]);
    };
    //Para Crearlo y enviarlo al servidor
    const Guardar = () => {
        if (ObservacionesModificar == null || ObservacionesModificar == undefined || ObservacionesModificar == "") {
            toaster.push(message('error', "Requerimiento", "Debe ingresar una observación"), {
                placement: 'topCenter'
              });
            return false;
        };

        let _Cabecera = {
            administrador: Admin.Administrador,
            UsuarioId: (UsuarioSeleccionado.UserId == "0" ? "" :UsuarioSeleccionado.UserId) ,
            assetid: CabeceraIncial[0].assetid,
            clienteid: CabeceraIncial[0].clienteid.toString(),
            registrationNumber: CabeceraIncial[0].registrationNumber,
            nombrecliente: CabeceraIncial[0].nombrecliente,
            agente: (UsuarioSeleccionado.UserId == "0" ? "" :UsuarioSeleccionado.Nombres) 
        }
        // setCabecera(_Cabecera);
        let _obs = ObsInicial;
        _obs.push(
            {
                fecha: moment().format("DD/MM/YYYY HH:MM"),
                observacion: ObservacionesModificar,
                usuario: vUser.Nombres,
                estado: JSON.stringify({ "label": EstadoRequerimientosSeleccionado.label, "valor": EstadoRequerimientosSeleccionado.valor })
            }
        )

        let Campos = {};
        Campos["Cabecera"] = JSON.stringify([_Cabecera]);
        Campos["Observaciones"] = JSON.stringify(_obs);
        Campos["Estado"] = (EstadoRequerimientosSeleccionado.valor == "0" ? "": JSON.stringify({ "label": EstadoRequerimientosSeleccionado.label, "valor": EstadoRequerimientosSeleccionado.valor })); 
        Campos["Id"] = Id;
        confirmarDialog(() => {
            setloader(true)
            SetRequerimiento(Campos).then((response: AxiosResponse<any>) => {
                if (response.statusText == "OK") {
                    successDialog(response.data[0][""], '');
                    setshowedit(false);
                    let data: any = DatosTabla.map((val: any) => {
                        if (val.Id == Id) {
                            val.Cabecera = Campos['Cabecera'];
                            val.Estado = Campos['Estado'];
                            val.Observaciones = Campos['Observaciones'];
                        }
                        return val;
                    });
                    let Tiporeporte = [...TipoReporteBase];
                    Tiporeporte[tabSel].Data = data;
                    setTipoReporte(Tiporeporte);
                    FiltroDatos();
                    PintarIndicadores(data);
                    if(vUser.perfil == PerfilEmpleado && UserCount[0].EsGestor && EstadoRequerimientosSeleccionadoAnterior.label != Asignados &&  EstadoRequerimientosSeleccionado.label == Asignados){
                        let dataNotificacion = {};
                        dataNotificacion['UsuarioId'] = UsuarioSeleccionado.UserId;
                        dataNotificacion['RequerimientoId'] = Id;
                        dataNotificacion['Descripcion']= TextoNotificacion.replace("{UsuarioDestino}",`${UsuarioSeleccionado.Nombres}`).replace("{Admin}",`${Admin.Administrador}`).replace("{Consecutivo}",`${ConsecutivoNotificacion}`);
                        dataNotificacion['NotificarCorreo']= NotificarCorreo;
                        dataNotificacion['NotificarPortal']= NotificarPortal;
                        Notificar(dataNotificacion)
                    }
                    setloader(false);
                }

            }).catch(({ error }) => {
                console.log("Error", error)
                setshowedit(false);
            });
        }, `¿Esta seguro que desea editar el registro?`, 'Guardar');
    }
    //Para formar la asignacion
    const Asignacion = (row:any) =>{
        let Cabeceras = JSON.parse(row.original.Cabecera);
        setCabeceraInicial(Cabeceras);
        setId(row.original.Id);
        let Inicio = String(row.original.Consecutivo).substring(0, 6);
        let Final = String(row.original.Consecutivo).substring(6, String(row.original.Consecutivo).length);
        setConsecutivoNotificacion(`${Inicio}-${Final}`);
        //Usuario
        let Usuario = Cabeceras.map((e: any) => e.UsuarioId);
        let Seleccion = Usuarios.filter((u: any) => {
            return u.UserId == Usuario[0];
        });
        setUsuarioSeleccionado((Seleccion.length !=0 ?  Seleccion[0]:{ Nombres: "Seleccione", UserId: "0" }));
        //Estado
        let Estado = (FiltroDashBoardData.EsJson(row.original.Estado) ? JSON.parse(row.original.Estado) : row.original.Estado);
        let EstadoSelect = EstadoRequerimientos.filter((e: any) => {
            return e.label == (Estado.label == undefined ? Estado : Estado.label);
        });
           //Para que no pueda asignarle el req a otro asesor. sino la primera vez a el.
           setdisable((EstadoSelect.length != 0 && EstadoSelect[0].label != EventosCreados ? true:false ));
        let a = EstadoSelect.map((data:any) => {
            return data.flujo;
        }).filter((w) =>w);
        setFlujos(a[0]);
        setEstadoRequerimientosSeleccionado((EstadoSelect.length == 0 ? { "label": "Todos", "valor": "0" } : EstadoSelect[0]));
        //Lo divido en 2 para tener mejor claridad
        setTitulo(`Requerimiento ${Inicio}-${Final}`);
        setConsecutivo(`${Cabeceras[0].nombrecliente} - ${Cabeceras[0].registrationNumber}`);
        setShowAsignacion(true);
        let Obs = JSON.parse(row.original.Observaciones);
        setObsInicial(Obs);
        setTipoRequerimientosSeleccionado(
            {
                Nombre: row.original.Tipo,
                Value: row.original.Tipo
            }
        );
        let _admin = Cabeceras.map((e: any) => ({"Administrador":e.administrador,"Id":e.UsuarioAdministradorId }) );
        setAdmin(_admin[0]);
        setId(row.original.Id);
    }
    //Guarda la asignacion.
    const GuardarAsginacion = () =>{
        let _Cabecera = {
            administrador: Admin.Administrador,
            UsuarioId: (UsuarioSeleccionado.UserId == "0" ? "" :UsuarioSeleccionado.UserId) ,
            assetid: CabeceraIncial[0].assetid,
            clienteid: CabeceraIncial[0].clienteid.toString(),
            registrationNumber: CabeceraIncial[0].registrationNumber,
            nombrecliente: CabeceraIncial[0].nombrecliente,
            agente: (UsuarioSeleccionado.UserId == "0" ? "" :UsuarioSeleccionado.Nombres) 
        }
        // setCabecera(_Cabecera);
        let _obs = ObsInicial;
        let estado =  JSON.stringify(EstadoRequerimientos.map((val:any) =>{
            return (val.label == Asignados ? { "label": val.label, "valor": val.valor } : undefined )
        }).filter((e) =>e)[0]);
        _obs.push(
            {
                fecha: moment().format("DD/MM/YYYY HH:MM"),
                observacion: "Asginación de requerimiento agente de soporte. ",
                usuario: vUser.Nombres,
                estado: estado
            }
        )

        let Campos = {};
        Campos["Cabecera"] = JSON.stringify([_Cabecera]);
        Campos["Observaciones"] = JSON.stringify(_obs);
        Campos["Estado"] = estado;
        Campos["Id"] = Id;
        confirmarDialog(() => {
            setloader(true)
            SetRequerimiento(Campos).then((response: AxiosResponse<any>) => {
                if (response.statusText == "OK") {
                    successDialog(response.data[0][""], '');
                    setshowedit(false);
                    let data: any = DatosTabla.map((val: any) => {
                        if (val.Id == Id) {
                            val.Cabecera = Campos['Cabecera'];
                            val.Estado = Campos['Estado'];
                            val.Observaciones = Campos['Observaciones'];
                        }
                        return val;
                    });
                    let Tiporeporte = [...TipoReporteBase];
                    Tiporeporte[tabSel].Data = data;
                    setTipoReporte(Tiporeporte);
                    FiltroDatos();
                    PintarIndicadores(data);
                    if(vUser.perfil == PerfilEmpleado && UserCount[0].EsGestor){
                        let dataNotificacion = {};
                        dataNotificacion['UsuarioId'] = UsuarioSeleccionado.UserId;
                        dataNotificacion['RequerimientoId'] = Id;
                        dataNotificacion['Descripcion']= TextoNotificacion.replace("{UsuarioDestino}",`${UsuarioSeleccionado.Nombres}`).replace("{Admin}",`${Admin.Administrador}`).replace("{Consecutivo}",`${ConsecutivoNotificacion}`);
                        dataNotificacion['NotificarCorreo']= NotificarCorreo;
                        dataNotificacion['NotificarPortal']= NotificarPortal;
                        Notificar(dataNotificacion)
                    }
                    setloader(false);
                    setShowAsignacion(false);
                }
            }).catch(({ error }) => {
                console.log("Error", error)
                setshowedit(false);
            });
        }, `¿Esta seguro que desea asignar el requerimiento al agente?`, 'Si');
    }
    //Elimina o cambia de estado un requerimiento a eliminado
    const EliminarRequerimiento = (row: any) => {
        let Observaciones = JSON.parse(row.original.Observaciones);
        confirmarDialogText((e: any) => {
            setloader(true)
            Observaciones.push({
                "fecha": moment().format("DD/MM/YYYY HH:MM"),
                "observacion": e.value,
                "usuario": vUser.Nombres,
                "estado": JSON.stringify('{"label": "Eliminado","valor": "6"}')
            })
            let Campos = {};
            Campos["Observaciones"] = JSON.stringify(Observaciones);
            Campos["Estado"] =  JSON.stringify('{"label": "Eliminado","valor": "6"}');
            Campos["Id"] = row.original.Id;
            DeleteRequerimiento(Campos).then((response: AxiosResponse<any>) => {
                if (response.statusText == "OK") {
                    successDialog(response.data[0][""], '');
                    let data: any = DatosTabla.map((val: any) => {
                        if (val.Id != row.original.Id)
                            return val;
                    }).filter((e) => e);
                    let Tiporeporte = [...TipoReporteBase];
                    Tiporeporte[tabSel].Data = data;
                    setTipoReporte(Tiporeporte);
                    PintarIndicadores(data);
                    setDatosTabla(data);
                    setloader(false);
                }
            }).catch((error) => {
                console.log("Error: ", error);
                setloader(false);
            });
            console.log(e.value);
        }, "¿Esta seguro que desea eliminar el registro?", "a", 'Si, Eliminar')
    };
    //NOTIFICAR
    const Notificar = (Data:any) =>{
        SetNotificaciones(Data).then((response:AxiosResponse<any>) =>{
            console.log("Ha sido notificado.");
        }).catch(({error}) =>{
            console.log("Error: ", error)
        });
    };
    //Para montar la tabla
    function MontarTabla() {
        return <>
            <MaterialReactTable
                localization={MRT_Localization_ES}
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
                        size: 185,
                    },
                }}
                muiTableHeadCellProps={{
                    sx: () => ({
                        fontSize: 14,
                        fontStyle: 'bold',
                        color: 'rgb(27, 66, 94)'
                    }),
                }}
                columns={Campos}
                data={DatosTabla}
                enableColumnOrdering
                enableStickyHeader
                enableDensityToggle={false}
                enablePagination={false}
                enableRowVirtualization
                muiTableContainerProps={{
                    sx: { maxHeight: '400px' }, //give the table a max height
                }}
                enableEditing={true}
                editingMode="modal"
                renderRowActions={({ row }) => (
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        {/* Para mostar los detallas */}
                        <Tooltip arrow placement="left" title="Detalle de requerimientos">
                            <IconButton onClick={() => DetallesModal(row)}>
                                <DeckTwoTone className="text-primary" />
                            </IconButton>
                        </Tooltip>
                        {/* Para editar si cumple con la condicion */}
                        {(vUser.perfil == PerfilEmpleado || vUser.perfil == PerfilSuperAdmin || vUser.perfil == PerfilAdminFlota) && (<Tooltip arrow placement="top" title="Editar requerimiento">
                            <IconButton onClick={() => EditarRequerimiento(row)}>
                                <Edit  className="text-warning" />
                            </IconButton>
                        </Tooltip>)}
                  
                        
                        {/* Permite eliminar el requerimiento siempre y cuando sea en estado Creado de lo contrario no permite eliminarlo*/}
                        {(FiltroData.getIsActivoMod(row, EventosCreados) && vUser.perfil === PerfilAdminFlota ) && (<Tooltip arrow placement="top" title="Eliminar requerimiento">
                            <IconButton onClick={() => {
                                EliminarRequerimiento(row);
                            }}>
                                <Delete className="text-danger" />
                            </IconButton>
                        </Tooltip>)}
                        {/* Permite asignarlo siempre y cuando este en estado creado sino no lo asigna a soporte*/}
                        {(FiltroData.getIsActivoMod(row, EventosCreados) && (vUser.perfil === PerfilSuperAdmin || vUser.perfil === PerfilEmpleado) && FiltroData.getIsUsuarioSoporte(UserCount[0].UserId)) && (<Tooltip arrow placement="right" title="Asignar requerimiento">
                            <IconButton onClick={() => {
                                Asignacion(row);
                            }}>
                                <Assignment className="text-success" />
                            </IconButton>
                        </Tooltip>)}
                    </Box>
                )
                }
                state={{
                    isLoading: isLoading,
                    showAlertBanner: isError,
                    showProgressBars: isRefetching,
                }}
                renderTopToolbarCustomActions={() => (
                    <Box
                        sx={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1, display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                    >
                        <button title="Reporte a excel" style={{ display: (tabSel <= 2) ? "inline-block" : "none" }} className="  btn btn-sm btn-primary" type="button" onClick={() => {
                            DescargarExcel(DatosTabla, Campos, `Reporte de requerimientos${(tabSel == 0 ? "" : (tabSel == 1 ? " asignados" : (tabSel == 2 ? " cerrados" : "")))}`)
                        }}>
                            <i className="bi-file-earmark-excel"></i></button>

                    </Box>
                )}
                initialState={{ density: 'compact' }}
            />
        </>
    }
    //Obtiene un encabezado
    const EncabezadoConsulta = (id:any) =>{
        setGrandeModal('xl');
        setloader(true);
        let DatosEncabezados:any[] = [];
        let Señales:any[]=[];
        GetEncabezado(id).then((response:AxiosResponse<any>) =>{
            if(response.statusText == "OK"){
                DatosEncabezados = response.data;
                GetEncabezadoFallas(response.data[0].FechaInicial,response.data[0].FechaFinal, response.data[0].ClienteIdS).then((res:AxiosResponse<any>) =>{
                    Señales= [...DatosEncabezados];
                    if(res.data.length != 0){
                        let Vehiculo =  res.data.filter((val:any) =>{
                            return val.AssetId == DatosEncabezados[0].AssetId;
                        }) 
                        Señales[0].Fallas = Vehiculo[0].TFallas;
                    }else
                        Señales = Señales.map((val:any) =>{
                                val.Fallas = 0;
                                return val;
                        })
                    setEncabezado(Señales[0]);
                    setloader(false)
                }).catch(({err}) =>{
                    console.log(err);
                    setloader(false);
                });
            }
        }).catch(({error}) =>{
            setshowedit(true);
            setloader(false);
            console.log("Error: ", error);
        });
    }
    const EncabezadoSinconsulta = () =>{
        setloader(true);
        setGrandeModal('lg');
        setloader(false)
    }
    const GuardarOtro = () =>{
        console.log(FiltroData.getEsCompletado(ListadoDLPRespuesta).length);
        let _Cabecera = {
            administrador: Admin.Administrador,
            UsuarioId: (UsuarioSeleccionado.UserId == "0" ? "" :UsuarioSeleccionado.UserId) ,
            assetid: CabeceraIncial[0].assetid,
            clienteid: CabeceraIncial[0].clienteid.toString(),
            registrationNumber: CabeceraIncial[0].registrationNumber,
            nombrecliente: CabeceraIncial[0].nombrecliente,
            agente: (UsuarioSeleccionado.UserId == "0" ? "" :UsuarioSeleccionado.Nombres) 
        }
        // setCabecera(_Cabecera);
        let _obs = ObsInicial;
        _obs.push(
            {
                fecha: moment().format("DD/MM/YYYY HH:MM"),
                observacion: ObservacionesModificar,
                usuario: vUser.Nombres,
                estado: JSON.stringify((FiltroData.getEsCompletado(ListadoDLPRespuesta).length == 0 ?  EstadosRequerimientos.filter((e:any)=>e.valor == "8" ).map((a:any) =>{return {"label":a.label,"valor":a.valor}}):EstadosRequerimientos.filter((e:any)=>e.valor == "5" ).map((a:any) =>{return {"label":a.label,"valor":a.valor}})))
            }
        )
        let Campos = {};
        Campos["Diagnostico"] = JSON.stringify(ListadoDLPRespuesta);
        Campos["Observaciones"] = JSON.stringify(_obs);
        Campos["Estado"] = JSON.stringify((FiltroData.getEsCompletado(ListadoDLPRespuesta).length == 0 ?  EstadosRequerimientos.filter((e:any)=>e.valor == "8" ).map((a:any) =>{return {"label":a.label,"valor":a.valor}})[0]:EstadosRequerimientos.filter((e:any)=>e.valor == "5" ).map((a:any) =>{return {"label":a.label,"valor":a.valor}})[0])); 
        Campos["Id"] = Id;
        confirmarDialog(() => {
            setloader(true)
            SetDiagnostico(Campos).then((response: AxiosResponse<any>) => {
                if (response.statusText == "OK") {
                    successDialog(response.data[0][""], '');
                    setshowedit(false);
                    let data: any = DatosTabla.map((val: any) => {
                        if (val.Id == Id) {
                            val.Estado = Campos['Estado'];
                            val.Diagnostico = Campos['Diagnostico']
                            val.Observaciones = Campos['Observaciones'];
                        }
                        return val;
                    });
                    let Tiporeporte = [...TipoReporteBase];
                    Tiporeporte[tabSel].Data = data;
                    setTipoReporte(Tiporeporte);
                    FiltroDatos();
                    PintarIndicadores(data);
                    // if(vUser.perfil == PerfilEmpleado && UserCount[0].EsGestor && EstadoRequerimientosSeleccionadoAnterior.label != Asignados &&  EstadoRequerimientosSeleccionado.label == Asignados){
                    //     let dataNotificacion = {};
                    //     dataNotificacion['UsuarioId'] = UsuarioSeleccionado.UserId;
                    //     dataNotificacion['RequerimientoId'] = Id;
                    //     dataNotificacion['Descripcion']= TextoNotificacion.replace("{UsuarioDestino}",`${UsuarioSeleccionado.Nombres}`).replace("{Admin}",`${Admin.Administrador}`).replace("{Consecutivo}",`${ConsecutivoNotificacion}`);
                    //     dataNotificacion['NotificarCorreo']= NotificarCorreo;
                    //     dataNotificacion['NotificarPortal']= NotificarPortal;
                    //     Notificar(dataNotificacion)
                    // }
                    setloader(false);
                }

            }).catch(({ error }) => {
                console.log("Error", error)
                setshowedit(false);
            });
        }, `¿Esta seguro que desea guardar el registro ${(FiltroData.getEsCompletado(ListadoDLPRespuesta).length == 0 ? "" : "sin completar")}?`, 'Guardar');
    };
    const SeteoObservaciones = (e:any) =>{
        e.stopPropagation();
        setObservacionesModificar(e.target.value);
    }
    return (
        <>
            <PageTitle>Interfaz de requerimientos</PageTitle>
            <BlockUi tag="div" keepInView blocking={loader ?? false}  >
                <div style={{ display: (UserCount.length != 0 ?'inline':'none' )  }}>
                    {/* Este espacio es la cabecera de la pagina */}
                    <div className="card">
                        <div className="d-flex justify-content-between mb-2">
                            <div className="mx-auto">
                                <div className="ms-3 text-center">
                                    <h3 className="mb-0">Interfaz de requerimientos</h3>
                                    <span className="text-muted m-3">Consolidado e Indicadores</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="row col-sm-12 col-md-12 col-xs-12 mx-auto">
                                {
                                    (lstIndicadores.map((element: any) => {
                                        return (
                                            <div key={`indicadores_${element.Estado}`} className="row card shadow-sm col-sm-3 col-md-3 col-xs-3 mx-auto"
                                                title={element.Descripcion}
                                                style={{
                                                    backgroundColor: "#b6fffe "
                                                   
                                                }}
                                            >
                                                <div className="m-3 text-center">
                                                    <h2 className={`mb-0`}><span id={element.Estado}>{element.Valor}</span></h2>
                                                    <span className={`text-muted`}>{element.Estado}</span>
                                                </div>
                                            </div>
                                        )
                                    }))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="card shadow-sm d-flex flex-row  justify-content-between">

                        <div className="d-flex justify-content-start ">
                            <label className="control-label label  label-sm m-2 mt-6" style={{ fontWeight: 'bold' }}>Fechas: </label>
                            {(combine && allowedRange && allowedMaxDays) && (
                                <div className="input-group mb-3">
                                    <span style={{ height: '40px' }} className="input-group-text mt-3" id="basic-addon1"><i className=" bi-calendar2-date"></i></span>
                                    <DateRangePicker size="lg" className="mt-3" format="dd/MM/yyyy" value={[TipoReporte[tabSel].filtros.FechaInicial, TipoReporte[tabSel].filtros.FechaFinal]}
                                        // hoverRange={
                                        //     TipoReporte[tabSel].tipo == "Todos" ? `month` : undefined //date =>  [subDays(date, 3), addDays(date,3)]
                                        // }
                                        disabledDate={combine(allowedMaxDays(TipoReporte[tabSel].filtros.MaxDay), allowedRange(
                                            moment().add(-30, 'days').startOf('day').toDate(), moment().startOf('day').toDate()
                                        ))}
                                        onChange={(value) => {
                                            if (value !== null) {
                                                ValidarFechas(
                                                    [value[0],
                                                    value[1]]
                                                );
                                            }
                                        }}
                                    />
                                </div>

                            )}
                            <Button title="Filtros de Clientes, Agentes y Estados" className="mb-6 mx-2 mt-4 btn btn-sm btn-primary" onClick={() => { setShowFiltros(true) }}><i className="bi-filter"></i></Button>
                            <Button title="Consultar reporte por los filtros aplicados" className="mb-6 mx-2 mt-4 btn btn-sm btn-primary" onClick={() => { ConsultasIniciales() }}><i className="bi-search"></i></Button>
                        </div>
                        <div className="d-flex justify-content-end mt-2 m-2">
                            <div style={{ float: 'right' }}>
                                {/* Espacio para un filtro */}
                            </div>
                        </div>
                    </div>
                    {/* Fin del encabezado */}
                    <div className="row w-100">
                        <ul className="nav nav-tabs nav-pills nav-pills-custom">
                            {listTabsRequerimientos.map((tab, idx) => {
                                return (<li className="nav-item mb-3" key={`tabenc_${idx}`}>
                                    <a
                                        onClick={() => settabSel(idx)}
                                        className={`nav-link w-224px  h-70px ${tabSel === idx ? "active btn-active-light" : ""
                                            } fw-bolder me-2`}
                                        id={`tab${idx}`}
                                    >
                                        <div className="nav-icon me-3">
                                            <DrawDynamicIconMuiMaterial name={tab.icon} isactive={(tabSel === idx)} />
                                        </div>
                                        <div className="ps-1">
                                            <span className="nav-text text-gray-600 fw-bolder fs-6">
                                                {tab.titulo}
                                            </span>
                                            <span className="text-muted fw-bold d-block pt-1">
                                                {tab.subtitulo}
                                            </span>
                                        </div>
                                    </a>
                                </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="tab-content">
                        <div className={`tab-pane fade ${tabSel === 0 ? "show active" : ""}`} id="tab0_content" >
                            {(tabSel === 0) && (showTablaTodos) && (DatosTabla.length != 0) && (
                                <MontarTabla></MontarTabla>
                            )}
                            {
                                <div style={{
                                    display: `${(tabSel === 0 && DatosTabla.length === 0 ? "flex" : "none")}`,
                                    textAlign: 'center'
                                }}>
                                    <div className="text-center text-muted fw-bolder" style={{ lineHeight: '200px', margin: 'auto', fontSize: "20px" }}>
                                        No hay datos que mostrar
                                    </div>
                                </div>
                            }

                        </div>
                        <div className={`tab-pane fade ${tabSel === 1 ? "show active" : ""}`} id="tab1_content" >
                            {/* begin::Cards */}
                            {(tabSel === 1) && (showTablaAsginadas) && (DatosTabla.length != 0) && (
                                <MontarTabla></MontarTabla>
                            )}
                            {
                                <div style={{
                                    display: `${(tabSel === 1 && DatosTabla.length === 0 ? "flex" : "none")}`,
                                    textAlign: 'center'
                                }}>
                                    <div className="text-center text-muted fw-bolder" style={{ lineHeight: '200px', margin: 'auto', fontSize: "20px" }}>
                                        No hay datos que mostrar
                                    </div>
                                </div>
                            }
                        </div>
                        <div className={`tab-pane fade ${tabSel === 2 ? "show active" : ""}`} id="tab2_content">
                            {/* begin::Cards */}
                            {(tabSel === 2) && (showTablaSinAsginar) && (DatosTabla.length != 0) && (
                                <MontarTabla></MontarTabla>
                            )}
                            {
                                <div style={{
                                    display: `${(tabSel === 2 && DatosTabla.length === 0 ? "flex" : "none")}`,
                                    textAlign: 'center'
                                }}>
                                    <div className="text-center text-muted fw-bolder" style={{ lineHeight: '200px', margin: 'auto', fontSize: "20px" }}>
                                        No hay datos que mostrar
                                    </div>
                                </div>
                            }
                        </div>
                        <div className={`tab-pane fade ${tabSel === 3 ? "show active" : ""}`} id="tab2_content">
                            {/* begin::Cards */}
                            {(tabSel === 3) && (showTablaCerradas) && (DatosTabla.length != 0) && (
                                <MontarTabla></MontarTabla>
                            )}
                            {
                                <div style={{
                                    display: `${(tabSel === 3 && DatosTabla.length === 0 ? "flex" : "none")}`,
                                    textAlign: 'center'
                                }}>
                                    <div className="text-center text-muted fw-bolder" style={{ lineHeight: '200px', margin: 'auto', fontSize: "20px" }}>
                                        No hay datos que mostrar
                                    </div>
                                </div>
                            }
                        </div>
                        <div className={`tab-pane fade ${tabSel === 4 ? "show active" : ""}`} id="tab3_content">
                            {/* begin::Cards */}
                            {(tabSel === 4) && (showTablaReporte) && (DatosReporte.length != 0) && (
                                <MaterialReactTable
                                    localization={MRT_Localization_ES}
                                    displayColumnDefOptions={{
                                        'mrt-row-actions': {
                                            muiTableHeadCellProps: {
                                                align: 'center',
                                            },
                                            size: 100,
                                        },
                                    }}
                                    muiTableHeadCellProps={{
                                        sx: () => ({
                                            fontSize: 14,
                                            fontStyle: 'bold',
                                            color: 'rgb(27, 66, 94)'
                                        }),
                                    }}
                                    columns={CamposReporte}
                                    data={DatosReporte}
                                    enableColumnOrdering
                                    enableStickyHeader
                                    enableDensityToggle={false}
                                    enablePagination={false}
                                    enableRowVirtualization
                                    muiTableContainerProps={{
                                        sx: { maxHeight: '400px' }, //give the table a max height
                                    }}
                                    state={{
                                        isLoading: isLoading,
                                        showAlertBanner: isError,
                                        showProgressBars: isRefetching,
                                    }}
                                    renderTopToolbarCustomActions={() => (
                                        <Box
                                            sx={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1, display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                                        >
                                            <button title="Reporte a excel" style={{ display: "inline-block" }} className="btn btn-sm btn-primary" type="button" onClick={() => {
                                                DescargarExcel(DatosReporte, CamposReporte, "Reporte requerimientos agrupados")
                                            }}>
                                                <i className="bi-file-earmark-excel"></i></button>

                                        </Box>
                                    )}
                                    initialState={{ density: 'compact' }}
                                />
                            )}
                            {
                                <div style={{
                                    display: `${(tabSel === 4 && DatosReporte.length === 0 ? "flex" : "none")}`,
                                    textAlign: 'center'
                                }}>
                                    <div className="text-center text-muted fw-bolder" style={{ lineHeight: '200px', margin: 'auto', fontSize: "20px" }}>
                                        No hay datos que mostrar
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="card text-center" style={{ display: (UserCount.length == 0 ?'inline':'none' )}}>
                        <span className="text-muted fs-2">{`${vUser.Nombres}`} no esta registrado en la configuración</span>
                </div>
            </BlockUi>
            <Modal show={show} onHide={setshow} size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de requerimientos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 pt-12">
                                {(DetallesDatos.length != 0) && (show) && (
                                    <MaterialReactTable
                                        localization={MRT_Localization_ES}
                                        displayColumnDefOptions={{
                                            'mrt-row-actions': {
                                                muiTableHeadCellProps: {
                                                    align: 'center',
                                                },
                                                size: 120,
                                            },
                                        }}
                                        muiTableHeadCellProps={{
                                            sx: () => ({
                                                fontSize: 14,
                                                fontStyle: 'bold',
                                                color: 'rgb(27, 66, 94)'
                                            }),
                                        }}
                                        columns={Detalles}
                                        data={DetallesDatos}
                                        initialState={{ density: 'compact' }}
                                        enableColumnOrdering
                                        enableColumnDragging={false}
                                        enablePagination={false}
                                        enableStickyHeader
                                        enableStickyFooter
                                        enableDensityToggle={false}
                                        enableRowVirtualization
                                        // enableRowNumbers
                                        enableTableFooter
                                        muiTableContainerProps={{ sx: { maxHeight: '300px' } }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={ShowFiltros} onHide={setShowFiltros} size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>Filtros por clientes, agentes y estados</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <div className="form-control-sm">
                                <label className="control-label label label-sm" style={{ fontWeight: 'bold' }}>Clientes: </label>
                                <SeleccionClientes></SeleccionClientes>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <div className="form-control-sm">
                                <label className="control-label label label-sm" style={{ fontWeight: 'bold' }}>Agentes: </label>
                                <SeleccionAgentes></SeleccionAgentes>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <div className="form-control-sm">
                                <label className="control-label label label-sm" style={{ fontWeight: 'bold' }}>Estados: </label>
                                <SeleccionEstados></SeleccionEstados>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showedit} onHide={setshowedit} size={GrandeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{Titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row" style={{display:(GrandeModal== "lg"? "online":"none")}}>
                        <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 text-center">
                            <div className="row">
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    <span className="mx-4 fs-6 fw-bolder">Cliente: </span><span className="mx-4 fs-5 text-muted">{Consecutivo}</span>
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    <span className="mx-4 fs-6 fw-bolder">Creado por: </span><span className="mx-4 fs-6 text-muted">{Admin.Administrador}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <div className="form-control-sm">
                                <label className="control-label label label-sm" style={{ fontWeight: 'bold' }}>Agente: </label>
                                <AgentesEditar></AgentesEditar>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <div className="form-control-sm">
                                <label className="control-label label label-sm" style={{ fontWeight: 'bold' }}>Estados: </label>
                                <EstadosEditar></EstadosEditar>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                            <div className="form-control-sm">
                                <label className="control-label label label-sm" style={{ fontWeight: 'bold' }}>Observaciones: </label>
                                <textarea className="form-control" rows={3} value={ObservacionesModificar} onChange={
                                    SeteoObservaciones
                                    }></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="container" style={{display:(GrandeModal== "xl" ? "online":"none")}}>
                        <div className="row">
                            <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                <div className="">
                                    <label className="mx-4 fs-6 fw-bolder">Cliente: </label>
                                </div>
                                <span className="mx-4 fs-5 text-muted">{Encabezado.Cliente}</span>
                            </div>
                            <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
                                <div className="">
                                    <label className="mx-4 fs-6 fw-bolder">Placa: </label>
                                </div>
                                <span className="mx-4 fs-6 text-muted">{Encabezado.RegistrationNumber}</span>
                            </div>
                            <div className="col-sm-5 col-xl-5 col-md-5 col-lg-5">
                                <div className="">
                                    <label className="mx-4 fs-6 fw-bolder">Admintrador (es) : </label>
                                </div>
                                <span className="mx-4 fs-5 text-muted">{(Encabezado.Administrador != undefined ?JSON.parse(Encabezado.Administrador).map((e: any) => e.Nombres).join() :[].map((e: any) => e.Nombres).join())}</span>
                            </div>
                            <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                <div className="">
                                    <label className="mx-4 fs-6 fw-bolder">Sitio: </label>
                                </div>
                                <span className="mx-4 fs-6 text-muted">{Encabezado.Sitio}</span>
                            </div>
                            <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
                                <div className="">
                                    <label className="mx-4 fs-6 fw-bolder">Días sin Tx: </label>
                                </div>
                                <span className="mx-4 fs-5 text-muted">{Encabezado.DiasSinTx}</span>
                            </div>

                            <div className="col-sm-5 col-xl-5 col-md-5 col-lg-5">
                                <div className="">
                                    <label className="mx-4 fs-6 fw-bolder">Descripción: </label>
                                </div>
                                <span className="mx-4 fs-6 text-muted">{Encabezado.AssetDescription}</span>
                            </div>
                            {
                                (Encabezado.Fallas != 0) && (<div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                    <div className="">
                                        <label className="mx-4 fs-6 fw-bolder">Fallas : </label>
                                    </div>
                                    <span className="mx-4 fs-6 text-muted">{Encabezado.Fallas}</span>
                                </div>)
                            }
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                                {(ListadoDLPRespuesta.length != 0) && (<MaterialReactTable
                                    localization={MRT_Localization_ES}
                                    muiTableHeadCellProps={{
                                        sx: () => ({
                                            fontSize: 14,
                                            fontStyle: 'bold',
                                            color: 'rgb(27, 66, 94)'
                                        }),
                                    }}
                                    columns={ColumnasPreguntas}
                                    data={ListadoDLPRespuesta}
                                    enableColumnResizing
                                    enableDensityToggle={false}
                                    enablePagination={false}
                                    enableRowVirtualization
                                    enableGrouping
                                    enableStickyHeader
                                    enableStickyFooter
                                    initialState={{
                                        density: 'compact',
                                        expanded: true, //expand all groups by default
                                        grouping: ['categoria'], //an array of columns to group by by default (can be multiple)
                                        sorting: [{ id: 'order', desc: false }], //sort by state by default
                                        columnVisibility: { order: false }
                                    }}
                                    muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                                    muiTableContainerProps={{ 
                                        ref: tableContainerRef, //get access to the table container element
                                        sx: { maxHeight: 400 }
                                     }}
                                />)}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" className="btn btn-sm" variant="primary" onClick={() => {
                        {(GrandeModal== "xl" ? GuardarOtro() :Guardar()) }
                        
                    }}>
                        Guardar
                    </Button>
                    <Button type="button" className="btn btn-sm" variant="secondary" onClick={() => setshowedit(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* ModalAsignacion */}
            <Modal show={ShowAsignacion} onHide={setShowAsignacion} size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>{Titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                    <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 text-center">
                            <div className="row">
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    <span className="mx-4 fs-6 fw-bolder">Cliente: </span><span className="mx-4 fs-5 text-muted">{Consecutivo}</span>
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    <span className="mx-4 fs-6 fw-bolder">Creado por: </span><span className="mx-4 fs-6 text-muted">{Admin.Administrador}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <div className="form-control-sm">
                                <label className="control-label label label-sm" style={{ fontWeight: 'bold' }}>Agente: </label>
                                <AgentesEditar></AgentesEditar>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" className="btn btn-sm" variant="primary" onClick={() => {
                        GuardarAsginacion()
                    }}>
                        Guardar
                    </Button>
                    <Button type="button" className="btn btn-sm" variant="secondary" onClick={() => setShowAsignacion(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}