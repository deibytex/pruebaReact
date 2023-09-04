import BlockUi from "@availity/block-ui";
import { useEffect, useRef, useState } from "react";
import { PageTitle } from "../../../../../../_start/layout/core";
import { DeleteRequerimiento, FiltroData, GetConfiguracion, GetEncabezado, GetEncabezadoFallas, GetRequerimientos, SetDiagnostico, SetNotificaciones, SetRequerimiento, listTabsRequerimientos } from "../../data/Requerimientos";
import { DrawDynamicIconMuiMaterial } from "../../../../../../_start/helpers/components/IconsMuiDynamic";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import moment from "moment";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { FiltrosReportes } from "../../Models/ModelRequerimientos";
import { FiltroDashBoardData } from "../../data/PostVentaData";
import { AxiosResponse } from "axios";
import { DateRangePicker, useToaster, Notification} from "rsuite";
import { Button, Form,  Modal } from "react-bootstrap-v5";
import { locateFormatPercentNDijitos } from "../../../../../../_start/helpers/Helper";
import { Box, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Tooltip } from "@mui/material";
import { Assignment,  BorderOuter,  DeckTwoTone, Delete, Edit, Message, ViewAgenda } from "@mui/icons-material";
import { DescargarExcel} from "../../../../../../_start/helpers/components/DescargarExcel";
 //import {  ListadoDLP } from "../../mockData/indicadores";
import { useSelector } from "react-redux";
import { UserModelSyscaf } from "../../../../auth/models/UserModel";
import { RootState } from "../../../../../../setup";
import confirmarDialog, { confirmarDialogText, successDialog } from "../../../../../../_start/helpers/components/ConfirmDialog";
import CreacionSt from "./CreacionSt";
import { Perfiles } from "../../../../../../_start/helpers/Constants";
import { original } from "@reduxjs/toolkit";

export default function Creacion() {
    //INICIO ESPACIO CONSTANTES
    const [EstadosRequerimientos, setEstadosRequerimientos] = useState<any[]>([]);
    const [ListadoDLP, setListadoDLP] = useState<any[]>([]);
    const [UsuariosST, setUsuariosST] = useState<any[]>([]);
    const [Usuarios, setUsuarios] = useState<any[]>([]);
    const toaster = useToaster();
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const [AgenteST, setAgenteST] = useState<boolean>(false);
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
    const [UserCount, setUserCount] = useState<any[]>([]);
    // DESCRIPCION PARA EL ENVIO DE NOTIFICACIONES.
    const [TextoNotificacion,setTextoNoticacion] = useState<string>("Hola {UsuarioDestino}, Estás siendo notificado porque el administrador {Admin} te ha asignado el requerimiento {Consecutivo}. Por favor, revisa información. Saludos cordiales.");
    const [TextoNotificacionAmin,setTextoNoticacionAmin] = useState<string>("Hola {Admin}, Estás siendo notificado porque el agente {UsuarioDestino} ha dado por resuelto el requerimiento {Consecutivo}. Por favor, revisa información. Saludos cordiales.");
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
    const [OcultarEstado, setOcultarEstado] = useState<boolean>(false);
    const [Asignar, setAsignar] = useState<boolean>(false);
    // const [cajas, setCajas] = useState<string>("3");
    const [Id, setId] = useState<string>("");
    const [IsDiagnostico, setIsDiagnostico] = useState<boolean>(false);
    const [val, setval] = useState<boolean>(false);
    //Constante para el modal de ST
    const [ShowSt, setShowSt] = useState<boolean>(false);
    const [showeditSt, setshoweditSt] = useState<boolean>(false);
    const [StInicialData, setStInicialData] = useState<any[]>([]);
    //Para el diagnostico
    //let DiagnosticoCon:any[]= [];
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
            agente: "",
            Fallas:"",
            DiasSinTx:""
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
    const [ShowModalDiag, setShowModalDiag] = useState<boolean>(false);
    const [ModalDLP, setModalDLP] = useState<boolean>(false);
    const [Encabezado, setEncabezado] = useState<any>({});
    const [InfDiag, setInfDiag] = useState<any[]>([]);
    // const [TipoRequerimientosSeleccionado, setTipoRequerimientosSeleccionado] = useState<any>({ Nombre: "", Value: "" });
    const [EstadoRequerimientos, setEstadoRequerimientos] = useState<any[]>([]);
    const [EstadoRequerimientosST, setEstadoRequerimientosST] = useState<any[]>([]);
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
    const [EstadosColores, setEstadosColores] = useState<any[]>([])
    //Para los flujos
    const [Flujos, setFlujos] = useState<any>([]);
    const [disable, setdisable] = useState<boolean>(false);
    const [EventosCreados, setEventosCreados] = useState<any>("");
    const [EventosEnSoporte, setEventosEnSoporte] = useState<any>("");
    const [Asignados, setAsignados] = useState<any>("");
    const [SinAsignar, setSinAsignar] = useState<any>("");
    const [Resueltos, setResueltos] = useState<any>("");
    /*============================================================================================================================================================================== */
    /** ESpacio para los tipos de estados a usar por el momento usare estos porque fueron los que se habian definido si en un posterior evento se dinamiza cambiar por estos.        */
    /*============================================================================================================================================================================== */
        const PerfilSuperAdmin = Perfiles.SuperAdmin;
        const PerfilAdminFlota =  Perfiles.AdminFlota;
        const PerfilEmpleado =  Perfiles.Empleado;
    /*============================================================================================================================================================================== */
    /** ESpacio para los tipos de estados a usar por el momento usare estos porque fueron los que se habian definido si en un posterior evento se dinamiza cambiar por estos.        */
    /*============================================================================================================================================================================== */
    //FIN ESPACIO CONSTANTES
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
                    return <div>{ PreguntasModelo(row)}</div> 
                },
            },
            {
                accessorKey: 'Estado',
                header: '¿Bien?',
                Cell({ cell, column, row, table, }) {
                    return <div style={{display: 'contents'}}>
                            <FormControl>
                                {/* <FormLabel id="demo-radio-buttons-group-label">¿Diagnostico positivo?</FormLabel> */}
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue={row.original.Estado}
                                    name="radio-buttons-group"
                                    id={`${row.original.id}`}
                                    style={{display: 'block'}}
                                >
                                    <FormControlLabel value={row.original.Estado} control={<Radio disabled={row.original.disabledstate} value={"Si"}  id={`${row.original.id}`}  onChange={CambioEstado} />} label="Si" />
                                    <FormControlLabel value={!row.original.Estado} control={<Radio disabled={row.original.disabledstate} value={"No"} id={`${row.original.id}`} onChange={CambioEstado} />} label="No" />
                                    {/* <FormControlLabel value={null} control={<Radio  onChange={CambioEstado}  id={`${row.original.id}`} value={``} />} label="Otro" /> */}
                                </RadioGroup>
                            </FormControl>
                        </div>  
                }
            },
            {
                accessorKey: 'observaciones',
                header: 'Observación',
                Cell({ cell, column, row, table, }) {
                    return <Form.Select 
                    disabled={row.original.disabledobs}
                    title="Seleccione una observacion" 
                    style={{ height: '40px' }} 
                    className="input-sm  mb-3 mt-3 " 
                    onChange={Selecione} 
                    defaultValue={row.original.RespuestaObservacion}
                    id={`${row.original.id}`} 
                    aria-label="Default select example">
                        <option value={"Seleccione"}>Seleccione</option>
                        {
                            row.original.observaciones.split(",").map((element: any) => {
                                let flag = (element.Estado === EstadoSeleccionado.Estado)
                                return (<option selected={flag} key={element} defaultValue={element} value={element}>{element}</option>)
                            })
                        }
                    </Form.Select>
                },
            },
            {
                accessorKey: 'order',
                header: 'orden',
                enableHiding:true,
            }
        ];
    const PreguntasModelo = (row:any) =>{
            switch(row.original.tipo) {
                case 'check' || 'Check Box' || 'CheckBox' || 'checkbox':
                    return   <input 
                    className="Respuestas form-check-input"
                    type="checkbox"
                    style={{borderColor:'#eb3626'}}
                    id={`${row.original.id}`} 
                    title={row.original.label}
                    // data-rel={`${row.original.categoria}${row.original.order}`} 
                    checked={row.original.Respuesta}
                    value={row.original.Respuesta}
                    onChange={Click}
                />
                  break;
                case 'desplegable':
                    return <Form.Select 
                                title="Seleccione una respuesta" 
                                style={{ height: '40px' }} 
                                className="input-sm  mb-3 mt-3 " 
                                onChange={SelecioneRespuesta} 
                                defaultValue={row.original.Respuesta}
                                id={`${row.original.id}`} 
                                aria-label="Default select example">
                        <option value={"Seleccione"}>Seleccione</option>
                        {
                            row.original.valores.split(",").map((element: any) => {
                                let flag = (element.Estado === EstadoSeleccionado.Estado)
                                return (<option selected={flag} key={element} defaultValue={element} value={element}>{element}</option>)
                            })
                        }
                    </Form.Select>
                    break;
                default:
                    return  <input 
                    type="text"  
                    id={`${row.original.id}`}  
                    value={row.original.Respuesta}  
                    onChange={change} 
                    className="form-control input input-sm" 
                    placeholder="Ingrese una respuesta"
                    />
                   break;
              }
        } 
        //Seleccion  Para las preguntas
    const SelecioneRespuesta = (e:any) =>{
        let listado = [...ListadoDLPRespuesta];
        setListadoDLPRespuesta(listado.map((a: any) => {
            a.Respuesta = (a.id==e.currentTarget.attributes['id'].value ?e.target.value: a.Respuesta);
            return a;
        }));
    }
    //PARA LAS OBSERVACIONES
    const Selecione = (e:any) =>{
        let listado = [...ListadoDLPRespuesta];
        setListadoDLPRespuesta(listado.map((a: any) => {
            a.RespuestaObservacion = (a.id==e.currentTarget.attributes['id'].value ?e.target.value: a.RespuestaObservacion);
            return a;
        }));
    }
        //PARA TOMAR EL VALOR DE LAS RESPUESTA SI EX CHECK
    const Click = (e:any) =>{
            let listado = [...ListadoDLPRespuesta];
            setListadoDLPRespuesta(listado.map((a: any) => {
                if( a.id==e.currentTarget.attributes['id'].value){
                    a.Respuesta = e.target.checked;
                    a.disabledstate = (e.target.checked ? false:true);
                    a.disabledobs = (a.Estado != "" && e.target.checked ? false :true)
                }
                return a;
            }));
        }
        //PARA TOMAR EL VALOR DE LAS RESPUESTAS SI ES TEXTO
    const change = (e:any) =>{
            let listado = [...ListadoDLPRespuesta];
            setListadoDLPRespuesta(listado.map((a: any) => {
                a.Respuesta = (a.id==e.currentTarget.attributes['id'].value ?e.target.value: a.Respuesta);
                return a;
            }));
        }
        //PARA SABER SI ESTA BIEN O NO EL DIAGNOSTICO
    const CambioEstado = (e:any) =>{
            let listado = [...ListadoDLPRespuesta];
            setListadoDLPRespuesta(listado.map((a: any) => {
                a.Estado = (a.id==e.currentTarget.attributes['id'].value ? (e.currentTarget.attributes['value'].value == "Si" ? true:false): a.Estado);
                a.disabledobs = ((a.id==e.currentTarget.attributes['id'].value && e.target.checked && !e.disabledstate) ? false:true);
                return a;
            }));
        }
    //FUNCION PARA RETORNAR UN ESTADO GRAFICAMENTE
    const RetornarEstado = (data: any) => {
       let color =  EstadosColores.filter((e) =>{
            return e.label == data;
        })
      return <span className={`${(color.length != 0 ?color[0].color:"badge bg-info")}`}>{data}</span>
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
                        if(elem[0] != null || elem[0] != "null" || elem[0] != undefined)
                            agentes.push({ "Agente": elem[0], "UsuarioId": elem[1][0] })
                    });
                    setAgentes(agentes.filter((val:any) =>{
                        return (val.UsuarioId != null);
                    }));
                    //Para filtrar los Estados
                    let estados: any[] = [];
                    Object.entries(FiltroData.getEstados(response.data)).map((elem: any) => {
                        let estado = FiltroData.getEstadosJson(elem[1]);
                        estados.push({ "Estado": estado })
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
                    if(Usuarios.length != 0)
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

           //Para obtner todas las configuraciones le paso la sigla en null, podria
           //filtrarse por sigla
            getConfiguracion(null);
        }
        else
            FiltroDatos();
    };
      //Se consultan las Configuraciones
      const getConfiguracion = (sigla:any|null) =>{
        GetConfiguracion(sigla).then((response:AxiosResponse<any>) =>{
            if(response.data.length != 0){
                //Usuarios de Soporte
                let Users = FiltroData.getConfiguracionSigla(response.data,"COUSS");
                setUsuarios((Users.length !=0 ? Users[0]:[]));
                //Estados de Soporte
                let States = FiltroData.getConfiguracionSigla(response.data,"OERS");
                setEstadoRequerimientos(States[0]);
                //Preguntas DLP
                let DLP = FiltroData.getConfiguracionSigla(response.data,"DLPST");
                setListadoDLP(DLP[0]);
                //Usuarios Servicio Tecnico
                let _usuariosST = FiltroData.getConfiguracionSigla(response.data,"CUSST");
                setUsuariosST(_usuariosST[0]);
                setEstadosRequerimientos(States[0]);
                let StatesST = FiltroData.getConfiguracionSigla(response.data,"OERST");
                setEstadoRequerimientosST(StatesST[0]);
            }
        }).catch(({error}) =>{
            console.log("Error: ", error)
        })
    }
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
            
        let Usuario = (UserCount.length != 0 ? UserCount[0].UserId: "");
        let FiltradoGestor:any[] | undefined= (AgenteST ?FiltroData.getFiltroGestor(datosfiltrados,Usuario, UsuariosST,AgenteST, EstadoRequerimientosST ): FiltroData.getFiltroGestor(datosfiltrados,Usuario, Usuarios,AgenteST, EstadoRequerimientos));
        // SE HACE SWITCH Entre tabs para cambiar informacion segun se requiera.
        //Y SE HACE RENDER A UNA SOLA TABLA PARA QUE EN LA CONSOLA NO SALGAN ERRORES.
        switch (tabSel) {
            case 0:
            default:

                setDatosTabla((FiltradoGestor == undefined ? []:FiltradoGestor));
                setShowTablaTodos(true);
                setShowTablaCerradas(false);
                setShowTablaAsignadas(false);
                setShowTablaReporte(false);
                setshowTablaSinAsginar(false);
                break;
            case 1:
                // FiltradoGestor = FiltroData.getFiltroGestor(datosfiltrados,Usuario, Usuarios);
                setDatosTabla(FiltroData.getAsignados((FiltradoGestor == undefined ? []:FiltradoGestor),
                Asignados,AgenteST));
                setShowTablaTodos(false);
                setShowTablaCerradas(false);
                setShowTablaAsignadas(true);
                setShowTablaReporte(false);
                setshowTablaSinAsginar(false);
                break;
            case 2:
                // FiltradoGestor = FiltroData.getFiltroGestor(datosfiltrados,Usuario, Usuarios);
                    setDatosTabla(FiltroData.getNoAsignados((FiltradoGestor == undefined ? []:FiltradoGestor),
                    SinAsignar));
                    setshowTablaSinAsginar(true);
                    setShowTablaTodos(false);
                    setShowTablaCerradas(false);
                    setShowTablaAsignadas(false);
                    setShowTablaReporte(false);
                    break;
            case 3:
                // FiltradoGestor = FiltroData.getFiltroGestor(datosfiltrados,Usuario, Usuarios);
                setDatosTabla(FiltroData.getCerrados((FiltradoGestor == undefined ? []:FiltradoGestor),
                Resueltos));
                setShowTablaTodos(false);
                setShowTablaCerradas(true);
                setShowTablaAsignadas(false);
                setShowTablaReporte(false);
                setshowTablaSinAsginar(false);
                break;
            case 4:
                // FiltradoGestor = FiltroData.getFiltroGestor(datosfiltrados,Usuario, Usuarios);
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
        setListadoDLPRespuesta(listado.map((a: any, index:any) => {
            a.Respuesta = (a.tipo =="check" ? false:"") ;
            a.disabledstate = true;
            a.disabledobs = true;
            a.Estado = "";
            a.RespuestaObservacion = "";
            if (Diagnostico.length > 0) {
                let find = Diagnostico.find((f: any) => f.id == a.id);
                a.Respuesta = find.Respuesta;
                a.RespuestaObservacion = find.RespuestaObservacion;
                a.Estado = find.Estado;
            }
            return a;
        }));
    }, [Diagnostico, ListadoDLP]);
//Para los valores
    useEffect(() =>{
        let valor:boolean = FiltroData.getComprobarEstado(ListadoDLPRespuesta);
        setval((valor ?? false));
    },[ListadoDLPRespuesta])
    //Para los estados y todo lo relacionado una vez haya datos
    useEffect(() =>{
        if(EstadosRequerimientos.length != 0){
            setEventosCreados(EstadosRequerimientos.filter(f => !["8","6"].includes(f.valor)).map((e:any) =>e.label).join())
            setEventosEnSoporte(EstadosRequerimientos.filter(f => ["3","4","5"].includes(f.valor)).map((e:any) =>e.label).join())
            setAsignados(EstadosRequerimientos.filter(f => ["4","5"].includes(f.valor)).map((e:any) =>e.label).join())
            setSinAsignar(EstadosRequerimientos.filter(f => ["1","2","3"].includes(f.valor)).map((e:any) =>e.label).join())
            setResueltos(EstadosRequerimientos.filter((e:any) =>{
                return e.valor == "8"
            })[0].label);
            setEstadosColores(EstadosRequerimientos.map((e:any) =>{
                return {"label":e.label, "color":(e.tipo =="admin" ?"badge bg-warning":(e.tipo == "soporte" ? "badge bg-info" :"badge bg-primary" ) )};
            }));
            setEstadoRequerimientosSeleccionado(EstadosRequerimientos[0]);
        }
    
    },[EstadosRequerimientos])
    //Pinta los Indicadores
    useEffect(() =>{
        //Para pintar los Indicadores
        PintarIndicadores(TipoReporte[0].Data);
    },[EventosCreados,EventosEnSoporte,Asignados, SinAsignar, Resueltos])
    //PAra actualizar el listado de usuarios
    useEffect(() =>{
        if(Usuarios.length != 0 || UsuariosST.length != 0){
            let UsuarioSoporte = Usuarios.filter((e:any) =>{
                return e.UserId == vUser.Id;
            }); 
            let UsuarioST = UsuariosST.filter((e:any) =>{
                return e.UserId == vUser.Id;
            }); 
            (UsuarioSoporte.length != 0 ? setAgenteST(false):setAgenteST(true));
            setUserCount((UsuarioSoporte.length != 0 ? UsuarioSoporte:UsuarioST));
           
        }
            
    },[Usuarios, UsuariosST])
    //Para mostrar la info una vez carguen los usuarios
    useEffect(() =>{
        if(UserCount.length != 0)
        FiltroDatos();
    },[UserCount])
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
    function EstadosEditar () {
        return (
            <div className="input-group mb-3">
                <span style={{ height: '40px' }} className="input-group-text mt-3" id="basic-addon1"><i className="bi-credit-card-2-front"></i></span>
                <Form.Select title="Estados para asignación" style={{ height: '40px' }} className="input-sm  mb-3 mt-3 " onChange={(e) => {
                    // buscamos el objeto completo para tenerlo en el sistema
                    let lstEstado =  (AgenteST ? EstadoRequerimientosST:EstadoRequerimientos).filter((val: any) => {
                        return val.valor === e.currentTarget.value
                    })
                    setEstadoRequerimientosSeleccionado((lstEstado[0] ? lstEstado[0] : { "Estado": "Seleccione" }));
                }} aria-label="Default select example">
                    <option value={"Seleccione"}>Todos</option>
                    {
                        (AgenteST ? EstadoRequerimientosST:EstadoRequerimientos)?.filter((l:any)=>{
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
        let Est = JSON.parse(row.original.Estado);
        (Est.valor == "4" || Est.valor == "8"? setOcultarEstado(true):setOcultarEstado(false));
        (Est.valor == "1"  || Est.valor == "2" || Est.valor == "3" && !UserCount[0].EsGestor ? setAsignar(true):setAsignar(false));
       //Para saber cual es el diagnostico
        setDiagnostico(row.original.Diagnostico == null ? []: JSON.parse(row.original.Diagnostico));
        // setloader(true);
        setObservacionesModificar("");
        let Cabeceras = JSON.parse(row.original.Cabecera);
        setCabeceraInicial(Cabeceras);
        //Usuario
        let Usuario = Cabeceras.map((e: any) => (e.UsuarioId));
        let _admin = Cabeceras.map((e: any) => ({"Administrador":e.administrador,"Id":e.UsuarioAdministradorId }) );
        let User:any[]=[];
         //Para que no pueda asignarle el req a otro asesor. sino la primera vez a el.
        if(!UserCount[0].EsGestor)
            User = Usuarios.filter((u: any) => {
                return u.UserId == UserCount[0].UserId;
            });
        else
            User = Usuarios;

        let Seleccion = User.filter((u: any) => {
            return u.UserId == Usuario[0];
        });
        setUsuarioSeleccionado((Seleccion.length !=0 ?  Seleccion[0]:{ Nombres: "Seleccione", UserId: "0" }));
        //Estado
        let Estado = (FiltroDashBoardData.EsJson(row.original.Estado) ? JSON.parse(row.original.Estado) : row.original.Estado);
        let EstadoSelect = (AgenteST ?EstadoRequerimientosST:EstadoRequerimientos).filter((e: any) => {
            return e.label == (Estado.label == undefined ? Estado : Estado.label);
        });
       
        let a = EstadoSelect.map((data:any) => {
            return data.flujo;
        }).filter((w) =>w);
        setEstadoRequerimientosSeleccionadoAnterior((EstadoSelect.length == 0 ? { "label": "Todos", "valor": "0" } : EstadoSelect[0]));
        setFlujos((a.length != 0 ? a[0]:[]));
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
        //&& !UserCount[0].EsGestor vUser.perfil == PerfilEmpleado  && vUser.perfil == PerfilEmpleado &&
        // ( EstadoSelect[0].valor =="5" ?EncabezadoConsulta(Cabeceras[0].assetid):EncabezadoSinconsulta());
        // ( EstadoSelect[0].valor =="5"  ?setGrandeModal("xl"):setGrandeModal("lg"));
        setIsDiagnostico(false);
        setshowedit(true)
        let Obs = JSON.parse(row.original.Observaciones);
        setObsInicial(Obs);
        // setTipoRequerimientosSeleccionado(
        //     {
        //         Nombre: row.original.Tipo,
        //         Value: row.original.Tipo
        //     }
        // );
        setId(row.original.Id);
        setAdmin(_admin[0]);

        //  //Para armar el de ST
        //  let stinicial = [...StInicialData];
        //  stinicial["ObsInicial"] = JSON.parse(row.original.Observaciones);
        //  stinicial["Nombres"] = vUser.Nombres;
        //  stinicial["Id"] = row.original.Id;
        //  stinicial["EstadosRequerimientos"] = EstadosRequerimientos;
        //  stinicial["ListadoDLPRespuesta"] = ListadoDLPRespuesta;
        //  setStInicialData(stinicial);

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
            UsuarioAdministradorId: Admin.Id,
            assetid: CabeceraIncial[0].assetid,
            clienteid: CabeceraIncial[0].clienteid.toString(),
            registrationNumber: CabeceraIncial[0].registrationNumber,
            nombrecliente: CabeceraIncial[0].nombrecliente,
            agente: (UsuarioSeleccionado.UserId == "0" ? "" :UsuarioSeleccionado.Nombres),
            UsuarioId: (UsuarioSeleccionado.UserId == "0" ? "" :UsuarioSeleccionado.UserId),
            Fallas:CabeceraIncial[0].TFallas,
            DiasSinTx:(CabeceraIncial[0].DiasSinTx)
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
                        FiltroData.Notificar(dataNotificacion)
                    }
                    setloader(false);
                }

            }).catch(({ error }) => {
                console.log("Error", error)
                setshowedit(false);
            });
        }, `¿Esta seguro que desea agregar información al registro?`, 'Guardar');
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
        let _admin = Cabeceras.map((e: any) => ({"Administrador":e.administrador,"Id":e.UsuarioAdministradorId }) );
        setAdmin(_admin[0]);
        setId(row.original.Id);
    }
    //Guarda la asignacion.
    const GuardarAsginacion = () =>{
        let _Cabecera = {
            administrador: Admin.Administrador,
            UsuarioId: (UsuarioSeleccionado.UserId == "0" ? UserCount[0].UserId :UsuarioSeleccionado.UserId) ,
            assetid: CabeceraIncial[0].assetid,
            clienteid: CabeceraIncial[0].clienteid.toString(),
            registrationNumber: CabeceraIncial[0].registrationNumber,
            nombrecliente: CabeceraIncial[0].nombrecliente,
            agente: (UsuarioSeleccionado.UserId == "0" ? (AgenteST ? UserCount[0].nombre :UserCount[0].Nombres) :UsuarioSeleccionado.Nombres) ,
            Fallas:CabeceraIncial[0].TFallas,
            DiasSinTx:(CabeceraIncial[0].DiasSinTx)
        }
        // setCabecera(_Cabecera);
        let _obs = ObsInicial;
        let estado =  JSON.stringify((AgenteST ?EstadoRequerimientosST:EstadoRequerimientos ).map((val:any) =>{
            return (val.valor == (AgenteST ? "9":"4")  ? { "label": val.label, "valor": val.valor } : undefined )
        }).filter((e) =>e)[0]);
        _obs.push(
            {
                fecha: moment().format("DD/MM/YYYY HH:MM"),
                observacion: (AgenteST ?"Asginación de requerimiento agente de soporte.":"Asginación de requerimiento agente de servicio técnico."),
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
                        FiltroData.Notificar(dataNotificacion)
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
 
    //Muestra el diggnostico de requerimiento
    const VerRequerimiento = (row:any) =>{
      let _Diagnostico:any[]=[];
        let IsValido  =   (row.original.Diagnostico == null ? toaster.push(message('success', "Completado", "Requerimiento resuelto pero no hay un diagnostico que mostrar"), {
            placement: 'topCenter'
        }): JSON.parse(row.original.Diagnostico));
        
        if(Array.isArray(IsValido)){
            setIsDiagnostico(true);
            _Diagnostico = JSON.parse(row.original.Diagnostico);
            setInfDiag(_Diagnostico);
            setShowModalDiag(true);
        }
    }
    const AsignarSt = (row:any) =>{
        let Est = JSON.parse(row.original.Estado);
        (Est.valor == "9" || Est.valor == "10"? setOcultarEstado(true):setOcultarEstado(false));
        (Est.valor == "1"  || Est.valor == "2" || Est.valor == "3" || Est.valor == "7" && !UserCount[0].EsGestor ? setAsignar(true):setAsignar(false));
       //Para saber cual es el diagnostico
        // setDiagnostico(row.original.Diagnostico == null ? []: JSON.parse(row.original.Diagnostico));
        // // setloader(true);
        setObservacionesModificar("");
        let Cabeceras = JSON.parse(row.original.Cabecera);
        setCabeceraInicial(Cabeceras);
        //Usuario
        let Usuario = Cabeceras.map((e: any) => (e.UsuarioId));
        let _admin = Cabeceras.map((e: any) => ({"Administrador":e.administrador,"Id":e.UsuarioAdministradorId }) );
        let User:any[]=[];
         //Para que no pueda asignarle el req a otro asesor. sino la primera vez a el.
        if(!UserCount[0].EsGestor)
            User = (AgenteST ? UsuariosST:Usuarios).filter((u: any) => {
                return u.UserId == UserCount[0].UserId;
            });
        else
            User = (AgenteST ? UsuariosST:Usuarios) ;

        let Seleccion = User.filter((u: any) => {
            return u.UserId == Usuario[0];
        });
        setUsuarioSeleccionado((Seleccion.length !=0 ?  Seleccion[0]:{ Nombres: "Seleccione", UserId: "0" }));
        //Estado
        let Estado = (FiltroDashBoardData.EsJson(row.original.Estado) ? JSON.parse(row.original.Estado) : row.original.Estado);
        let EstadoSelect =  (AgenteST ? EstadoRequerimientosST:EstadoRequerimientos).filter((e: any) => {
            return e.label == (Estado.label == undefined ? Estado : Estado.label);
        });
       
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
        //&& !UserCount[0].EsGestor vUser.perfil == PerfilEmpleado  && vUser.perfil == PerfilEmpleado &&
        // ( EstadoSelect[0].valor =="5" ?EncabezadoConsulta(Cabeceras[0].assetid):EncabezadoSinconsulta());
        // ( EstadoSelect[0].valor =="5"  ?setGrandeModal("xl"):setGrandeModal("lg"));
        setIsDiagnostico(false);
        setshoweditSt(true);
        let Obs = JSON.parse(row.original.Observaciones);
        setObsInicial(Obs);
      
        setId(row.original.Id);
        setAdmin(_admin[0]);
    }
    //Para montar la tabla tab 1, 2, 3,4
    function MontarTabla() {
        //Completado estado
        let estadoCompletado  = JSON.stringify(EstadoRequerimientos.filter((e:any) =>{
            return e.valor=="8";
        }).map((f:any) =>{
            return {"label":f.label, "valor":f.valor}
        })[0]);

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
                        {(!AgenteST) &&(vUser.perfil == PerfilEmpleado || vUser.perfil == PerfilSuperAdmin || vUser.perfil == PerfilAdminFlota) && (<Tooltip arrow placement="top" title="Edición o asignación de requerimiento">
                            <IconButton onClick={() => EditarRequerimiento(row)}>
                                {(JSON.parse(row.original.Estado).valor === "4" || JSON.parse(row.original.Estado).valor === "5"  || JSON.parse(row.original.Estado).valor === "8"?  <Message   className="text-info"/>:<Edit  className="text-warning" />) }
                                
                            </IconButton>
                        </Tooltip>)}
                        {/*Permite realizar el dlp */}
                        {(!AgenteST) &&
                        (EstadoRequerimientos.filter(e =>e.valor == "5")[0].label == JSON.parse(row.original.Estado).label) && (JSON.parse(row.original.Cabecera)[0].UsuarioId == vUser.Id ) && (<Tooltip arrow placement="top" title="Realizar DLP">
                            <IconButton onClick={() => EncabezadoConsulta(row)}>
                                {/* <i className="text-success bi-border-style"></i> */}
                              <BorderOuter  className="text-success" />
                            </IconButton>
                        </Tooltip>)
                        }
                        {/* Permite ver el diagnostico del requerimiento */}
                        
                        {(!AgenteST) &&(vUser.perfil == PerfilEmpleado || vUser.perfil == PerfilSuperAdmin || vUser.perfil == PerfilAdminFlota) && (row.original.Estado == estadoCompletado)
                        && (<Tooltip arrow placement="top" title="Ver diagnóstico de requerimiento">
                            <IconButton onClick={() => VerRequerimiento(row)}>
                                <ViewAgenda  className="text-info" />
                            </IconButton>
                        </Tooltip>)}
                        {/* Permite eliminar el requerimiento siempre y cuando sea en estado Creado de lo contrario no permite eliminarlo*/}
                        
                        {(!AgenteST) &&(FiltroData.getIsActivoMod(row, EventosCreados) && vUser.perfil === PerfilAdminFlota ) && (<Tooltip arrow placement="top" title="Eliminar requerimiento">
                            <IconButton onClick={() => {
                                EliminarRequerimiento(row);
                            }}>
                                <Delete className="text-danger" />
                            </IconButton>
                        </Tooltip>)}
                        {/* Permite asignarlo siempre y cuando este en estado creado sino no lo asigna a soporte*/}
                        {(!AgenteST) &&((vUser.perfil === PerfilSuperAdmin || vUser.perfil === PerfilAdminFlota) && (UserCount[0].EsGestor) && FiltroData.getIsUsuarioSoporte(UserCount[0].UserId, Usuarios) && (FiltroData.getEsAsignable(row.original,EstadoRequerimientos.filter(e =>e.valor == "3")[0].label))) && (<Tooltip arrow placement="right" title="Asignar requerimiento">
                            <IconButton onClick={() => {
                                Asignacion(row);
                            }}>
                                <Assignment className="text-success" />
                            </IconButton>
                        </Tooltip>)}
                        {
                            (AgenteST && FiltroData.getEsSoporte(row, (AgenteST ? EstadoRequerimientosST:EstadoRequerimientos),(AgenteST ? "st":"soporte")) ) &&(
                                <Tooltip arrow placement="right" title="Editar, asignar requerimiento serivico técnico">
                                    <IconButton onClick={() => {
                                        AsignarSt(row)
                                    }}>
                                        <Edit className="text-success"/>
                                    </IconButton>
                                </Tooltip>
                            ) 
                        }
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
                            let data = DatosTabla.map((val:any) =>{
                                let cab = JSON.parse(val.Cabecera);
                                let estado = (FiltroDashBoardData.EsJson(val.Estado)  == true ? JSON.parse(val.Estado) : val.Estado)
                                return  {"nombrecliente":cab[0].nombrecliente,"Consecutivo": val.Consecutivo,"registrationNumber":cab[0].registrationNumber, "Estado": (estado.label == undefined ? estado : estado.label), "agente": cab[0].agente, "Fecha": val.FechaCreacion};
                            })
                            DescargarExcel(data, Campos, `Reporte de requerimientos${(tabSel == 0 ? "" : (tabSel == 1 ? " asignados" : (tabSel == 2 ? " cerrados" : "")))}`)
                        }}>
                            <i className="bi-file-earmark-excel"></i></button>

                    </Box>
                )}
                initialState={{ density: 'compact' }}
            />
        </>
    }
    //Obtiene un encabezado
    const EncabezadoConsulta = (row:any) =>{
        setEncabezado(JSON.parse(row.original.Cabecera)[0]);
        let stinicial = [...StInicialData];
        stinicial["ObsInicial"] = JSON.parse(row.original.Observaciones);
        stinicial["Nombres"] = vUser.Nombres;
        stinicial["UsuarioId"] = vUser.Id;
        stinicial["Id"] = row.original.Id;
        stinicial["EstadosRequerimientos"] = EstadosRequerimientos;
        stinicial["ListadoDLPRespuesta"] = ListadoDLPRespuesta;
        stinicial["Encabezado"] = JSON.parse(row.original.Cabecera)[0];
        stinicial["Consecutivo"] = row.original.Consecutivo;
        setStInicialData(stinicial);
        setModalDLP(true)
    }
    //Este resuelve el requerimiento
    //==========================================================================================================
    // RESUELVE EL REQUERIMIENTO
    //==========================================================================================================
    const GuardarOtro = () =>{
        let _Cabecera = {
            administrador: Admin.Administrador,
            UsuarioAdministradorId: Admin.Id,
            assetid: CabeceraIncial[0].assetid,
            clienteid: CabeceraIncial[0].clienteid.toString(),
            registrationNumber: CabeceraIncial[0].registrationNumber,
            nombrecliente: CabeceraIncial[0].nombrecliente,
            agente: (UsuarioSeleccionado.UserId == "0" ? "" :UsuarioSeleccionado.Nombres),
            UsuarioId: (UsuarioSeleccionado.UserId == "0" ? "" :UsuarioSeleccionado.UserId),
        }
        // setCabecera(_Cabecera);
        let _obs = ObsInicial;
        _obs.push(
            {
                fecha: moment().format("DD/MM/YYYY HH:MM"),
                observacion: `Se realiza el diagnostico y se ${(FiltroData.getEsCompletado(ListadoDLPRespuesta).length == 0 ? "completa el diagnostico quedando resuelto" : "guarda sin completar el diagnostico")}`,
                usuario: vUser.Nombres,
                estado: JSON.stringify((FiltroData.getEsCompletado(ListadoDLPRespuesta).length == 0 ?  EstadosRequerimientos.filter((e:any)=>e.valor == "8" ).map((a:any) =>{return {"label":a.label,"valor":a.valor}})[0]:EstadosRequerimientos.filter((e:any)=>e.valor == "5" ).map((a:any) =>{return {"label":a.label,"valor":a.valor}})[0]))
            }
        )
       
        //Para enviar al servidor
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
                    let dataNotificacion = {};
                    dataNotificacion['UsuarioId'] = Admin.Id;
                    dataNotificacion['RequerimientoId'] = Id;
                    dataNotificacion['Descripcion'] = TextoNotificacionAmin.replace("{Admin}",`${Admin.Administrador}`).replace("{UsuarioDestino}",`${UsuarioSeleccionado.Nombres}`).replace("{Consecutivo}",`${ConsecutivoNotificacion}`);
                    dataNotificacion['NotificarCorreo']= NotificarCorreo;
                    dataNotificacion['NotificarPortal']= NotificarPortal;
                    FiltroData.Notificar(dataNotificacion)
                    setloader(false);
                }

            }).catch(({ error }) => {
                console.log("Error", error)
                setshowedit(false);
            });
        }, `¿Esta seguro que desea guardar el registro ${(FiltroData.getEsCompletado(ListadoDLPRespuesta).length == 0 ? "" : "sin completar")}?`, 'Guardar');
    };
    //para las observaciones
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
                <div className="card" style={{ display: (UserCount.length == 0 ?'block inline':'none' )}}>
                        <span className="text-muted fs-2 ext-center m-auto p-auto">{`${vUser.Nombres}`} no esta registrado en la configuración</span>
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
            <Modal show={showedit} onHide={setshowedit} size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>{Titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
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
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6" style={{display:`${(OcultarEstado ? 'inlline block':"none")}`}}>
                            <div className="form-control-sm">
                                <label className="control-label label label-sm" style={{ display:``, fontWeight: 'bold' }}>Estados: </label>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" className="btn btn-sm" variant="primary" onClick={() => {
                        {Asignar ? GuardarAsginacion(): Guardar()}
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
                <Modal.Body className="p-0">
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
            {/* Modal para diagnostico */}
            <Modal show={ShowModalDiag} onHide={setShowModalDiag} size={"xl"}>
                <Modal.Header closeButton>
                    <Modal.Title>Informe de diagnóstico</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    {/* Encabezado */}
                    <div className="card">
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
                    </div>
                    {/* Cuerpo */}
                    <div className="card" style={{overflowY:'scroll',height: '300px'}}>
                            <div className="row">
                                {
                                    (InfDiag.length != 0) && (Object.entries(InfDiag.reduce((k:any,c:any) =>{
                                        let name = c.categoria;
                                        k[name] = k[name] ?? [];
                                        k[name].push(c);
                                        return k;
                                    },{})).map((val:any,index:any) =>{
                                        return  <div className="row m-5">
                                            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                                                <span className="text-center fw-bolder text-primary"> {val[0].toUpperCase()}</span>
                                            </div>
                                            {val[1].map((item:any) =>{
                                                return <div key={item.id} className="col-sm-3 col-xl-3 col-md-3 col-lg-3 mt-5">
                                                <div key={`${index}` } className="">
                                                    <label  key={`${index +1}`} className="control-label label-sm fw-bolder">{`${parseInt(item.order)+1}. ${item.label}`}</label>
                                                </div>
                                                <span key={`${index +2}`} className="mx-4 fs-6 text-muted">{(item.Respuesta == true ? "Si":(item.Respuesta  == false ? "No":item.Respuesta))}</span>
                                                <div key={`${index+3}`}  className="">
                                                  <span key={`${index+4}`} className="tex-primary">Estado DLP: </span><span key={index +5} className="mx-4 fs-6 text-muted">{(item.Estado == true? "OK": "N/A")}</span>
                                                </div>
                                                <div key={`${index+6}`}  className="">
                                                    <span key={`${index +7}`} className="mx-4 fs-6 text-muted">{item.RespuestaObservacion}</span>
                                                </div>
                                            </div>
                                            })}
                                            
                                        </div>
                                    }))
                                }
                           </div>
                            
                    </div>
                </Modal.Body>
              
            </Modal>
            <Modal show={ModalDLP} onHide={setModalDLP} size={"xl"}>
                <Modal.Header closeButton>
                    <Modal.Title>Creación DLP</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                <div className="container mt-0 pt-0">
                        <div className="row">
                            <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                <div className="">
                                    <label className="mx-4 fs-6 fw-bolder">Cliente: </label>
                                </div>
                                <span className="mx-4 fs-5 text-muted">{Encabezado.nombrecliente}</span>
                            </div>
                            <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
                                <div className="">
                                    <label className="mx-4 fs-6 fw-bolder">Placa: </label>
                                </div>
                                <span className="mx-4 fs-6 text-muted">{Encabezado.registrationNumber}</span>
                            </div>
                            <div className="col-sm-5 col-xl-5 col-md-5 col-lg-5">
                                <div className="">
                                    <label className="mx-4 fs-6 fw-bolder">Administrador (es) : </label>
                                </div>
                                <span className="mx-4 fs-5 text-muted">{Encabezado.administrador}</span>
                            </div>
                            {/* <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                <div className="">
                                    <label className="mx-4 fs-6 fw-bolder">Sitio: </label>
                                </div>
                                <span className="mx-4 fs-6 text-muted">{Encabezado.Sitio}</span>
                            </div> */}
                            <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                <div className="">
                                    <label className="mx-4 fs-6 fw-bolder">Días sin Tx: </label>
                                </div>
                                <span className="mx-4 fs-5 text-muted">{(Encabezado.DiasSinTx == undefined ? "0": Encabezado.DiasSinTx)}</span>
                            </div>

                            {/* <div className="col-sm-5 col-xl-5 col-md-5 col-lg-5">
                                <div className="">
                                    <label className="mx-4 fs-6 fw-bolder">Descripción: </label>
                                </div>
                                <span className="mx-4 fs-6 text-muted">{Encabezado.assetDescription}</span>
                            </div> */}
                            {
                                (Encabezado.Fallas != 0) && (<div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                    <div className="">
                                        <label className="mx-4 fs-6 fw-bolder">Fallas : </label>
                                    </div>
                                    <span className="mx-4 fs-6 text-muted">{(Encabezado.Fallas == undefined ?"0":Encabezado.Fallas)}</span>
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
                        <div className="row">
                            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12  pt-5">
                                <label className="control-label label label-sm text-muted fw-bolder">Notas adicionales</label>
                                <textarea rows={3}  style={{display:(val && GrandeModal== "xl" ? 'none':'inline')}} className="form-control" ></textarea>
                            </div>
                        </div>
                    </div>
                   
                </Modal.Body>
                <Modal.Footer>
                   
                    <Button type="button" style={{display:(val && GrandeModal== "xl" ? 'none':'inline')}} className="btn btn-sm" variant="primary" onClick={() => {
                        GuardarOtro() 
                    }}>
                      Resolver
                    </Button>
                    <Button type="button" className="btn btn-sm" variant="info" onClick={() => {
                     
                        setshowedit(false);
                        let b = StInicialData;
                        b['ListadoDLPRespuesta'] = ListadoDLPRespuesta;
                        b["Cargado"] = true;
                        setStInicialData(b);
                        setModalDLP(false);
                        setShowSt(true);
                    }}>
                        Enviar ST
                    </Button>
                    <Button type="button" className="btn btn-sm" variant="secondary" onClick={() => setshowedit(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
           <CreacionSt show={ShowSt} handleClose={setShowSt} data={StInicialData}></CreacionSt>
           <Modal show={showeditSt} onHide={setshoweditSt} size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>{Titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
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
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6" style={{display:`${(OcultarEstado ? 'inlline block':"none")}`}}>
                            <div className="form-control-sm">
                                <label className="control-label label label-sm" style={{ display:``, fontWeight: 'bold' }}>Estados: </label>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" className="btn btn-sm" variant="primary" onClick={() => {
                        {Asignar ? GuardarAsginacion(): Guardar()}
                    }}>
                       Guardar
                    </Button>
                    <Button type="button" className="btn btn-sm" variant="secondary" onClick={() => setshowedit(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}