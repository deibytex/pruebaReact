import BlockUi from "@availity/block-ui";
import { useEffect, useState } from "react";
import { PageTitle } from "../../../../../../_start/layout/core";
import { FiltroData, RequerimientoFunciones, fncReporte, listTabsRequerimientos } from "../../data/Requerimientos";
import { DrawDynamicIconMuiMaterial } from "../../../../../../_start/helpers/components/IconsMuiDynamic";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import moment from "moment";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { FiltrosReportes } from "../../Models/ModelRequerimientos";
import { GetDetalleLista, GetLista, GettRequerimiento } from "../../data/PostVentaData";
import { AxiosResponse } from "axios";
import { DateRangePicker } from "rsuite";
import { Button, Form, Modal } from "react-bootstrap-v5";
import { locateFormatPercentNDijitos } from "../../../../../../_start/helpers/Helper";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { Assignment, Delete, Details, Edit } from "@mui/icons-material";
import { DescargarExcel, DescargarExcelPersonalizado } from "../../../../../../_start/helpers/components/DescargarExcel";
import { Trash } from "react-feather";
export default function Creacion() {
    //ESPACIO PARA LAS CONST
    const [loader, setloader] = useState<boolean>(false);
    const [lstIndicadores, setListIndicadores] = useState<any>([
        { "Estado": "Abiertos", "Descripcion": "Total de Requerimientos Abiertos", "Valor": 0 },
        { "Estado": "En Soporte", "Descripcion": "Total de Requerimientos en Soporte", "Valor": 0 },
        { "Estado": "Tasa de resolución", "Descripcion": "Tasa de resolución de los requerimientos de los últimos 7 días", "Valor": 0 },
        { "Estado": "Total resueltos", "Descripcion": "Total de requerimientos resueltos en los últimos 7 días.", "Valor": 0 }
    ]);
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
    
    const [TipoRequerimientos, setTipoRequerimientos] = useState<any[]>([]);
    const [TipoRequerimientosSeleccionado, setTipoRequerimientosSeleccionado] = useState<any>({ Nombre: "", Value: "" });
    const [EstadoRequerimientos, setEstadoRequerimientos] = useState<any[]>([]);
    const [EstadoRequerimientosSeleccionado, setEstadoRequerimientosSeleccionado] = useState<any>({ Nombre: "Creado", Value: "Estado" });
    
    const [Titulo, setTitulo] = useState<string>("Edición de requerimientos");
    const [Consecutivo, setConsecutivo] = useState<string>("Edición de requerimientos");
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
    const [showTablaReporte, setShowTablaReporte] = useState<boolean>(false);


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
            },
            {
                accessorKey: 'registrationNumber',
                header: 'Vehiculo',
                Cell({ row, }) {
                    let Cabecera = JSON.parse(row.original.Cabecera);
                    return (Cabecera[0].registrationNumber == undefined ? "" : Cabecera[0].registrationNumber);
                },
            },

            {
                accessorKey: 'Estado',
                header: 'Estado',
                Cell({ row, }) {
                    return RetornarEstado(row.original.Estado);
                }
            },
            {
                accessorKey: 'agente',
                header: 'Agente',
                Cell({ row, }) {
                    let Cabecera = JSON.parse(row.original.Cabecera);
                    return (Cabecera[0].agente == undefined ? "" : Cabecera[0].agente);
                },
            },
            {
                accessorKey: 'Fecha',
                header: 'Fecha creacion',
                Cell({ row, }) {
                    return moment(row.original.FechaCreacion).format("DD/MM/YYYY");
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
            // {
            //     accessorKey: 'Estado',
            //     header: 'Estado',
            //     // Cell({ cell, column, row, table, }) {
            //     //     let Cabecera = JSON.parse(row.original.Cabecera);
            //     //     return (Cabecera[0].registrationNumber == undefined ? "":Cabecera[0].registrationNumber);
            //     // },
            // }
        ];
    //PARA LOS DETALLES
    let Detalles: MRT_ColumnDef<any>[] =
        [
            {
                accessorKey: 'fecha',
                header: 'Fecha',
                Cell({ row, }) {
                    return moment(row.original.fecha, "DD-MM-YYYY").format("DD/MM/YYYY");
                }
            },
            {
                accessorKey: 'observacion',
                header: 'Observación',
            },
            {
                accessorKey: 'usuario',
                header: 'Agente',
            },

            {
                accessorKey: 'estado',
                header: 'Estado',
            }
        ];
    //FUNCION PARA RETORNAR UN ESTADO GRAFICAMENTE
    const RetornarEstado = (data: any) => {
        return <span className={`${(data == "Creado" || data == "Reabierto" ? "badge bg-warning" : (data == "Asignado Soporte" || data == "Asignado Agente" || data == "Asignado ST") ? "badge bg-info" : (data == "Cerrado") ? "badge bg-success" : "badge bg-primary")}`}>{data}</span>
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
            GettRequerimiento(FechaInicial, FechaFinal).then(
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
            //PARA LOS TIPOS DE REQUERIMIENTOS
            GetLista().then((response: AxiosResponse<any>) => {
                if (response.statusText == "OK") {
                    GetDetalleLista(response.data[0].ListaId.toString()).then((resp: AxiosResponse<any>) => {
                        setTipoRequerimientos(resp.data.filter((val: any) => {
                            if (val.Valor == "Tipo")
                                return val;
                        }));
                        setEstadoRequerimientos(resp.data.filter((val: any) => {
                            if (val.Valor == "Estado")
                                return val;
                        }));
                    }).catch(() => {
                        console.log("Error de consulta de detalles listas");
                        setloader(false);
                    });
                }
            }).catch(() => {
                console.log("Registre los parametros en listas para poder conseguir los parametros para los tipos de requerimientos con la sigla GOIREQ");
                setloader(false);
            })
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
                setDatosTabla(datosfiltrados)
                setShowTablaTodos(true);
                setShowTablaCerradas(false);
                setShowTablaAsignadas(false);
                setShowTablaReporte(false);
                break;
            case 1:
                setDatosTabla(FiltroData.getAsignados(datosfiltrados));
                setShowTablaTodos(false);
                setShowTablaCerradas(false);
                setShowTablaAsignadas(true);
                setShowTablaReporte(false);
                break;
            case 2:
                setDatosTabla(FiltroData.getCerrados(datosfiltrados));
                setShowTablaTodos(false);
                setShowTablaCerradas(true);
                setShowTablaAsignadas(false);
                setShowTablaReporte(false);
                break;
            case 3:
                let reporte = FiltroData.getReporte(datosfiltrados);
                let DatosReporte: any[] = [];
                Object.entries(reporte).map((elem: any) => {
                    DatosReporte.push({ "registrationNumber": elem[0], "Cantidad": elem[1].length })
                });
                setDatosReporte(DatosReporte);
                setShowTablaTodos(false);
                setShowTablaCerradas(false);
                setShowTablaAsignadas(false);
                setShowTablaReporte(true);
                break;
        }


    }
    //ESPACIO PARA LOS USEEFFECT
    useEffect(() => {
        let isApiSubscribed = true;
        if (isApiSubscribed)
            ConsultasIniciales();
        //Elimina lo asincrono
        return () => {
            isApiSubscribed = false;
            setDatosTabla([]);
            setDatosReporte([]);
        }
    }, [tabSel, AgentesSeleccionado, ClienteSeleccionado, EstadoSeleccionado])

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
        let Abiertos = FiltroData.getAbiertos(datosfiltrados);
        let Soporte = FiltroData.getSoporte(datosfiltrados);
        let TotalRequerimientos = datosfiltrados.length;
        let Resueltos = FiltroData.getCerrados(datosfiltrados);
        let Resolucion = (TotalRequerimientos == 0 ? 0 : Resueltos.length / TotalRequerimientos);
        setListIndicadores([
            { "Estado": "Abiertos", "Descripcion": "Total de Requerimientos Abiertos", "Valor": Abiertos.length },
            { "Estado": "En Soporte", "Descripcion": "Total de Requerimientos en Soporte", "Valor": Soporte.length },
            { "Estado": "Tasa de resolución", "Descripcion": "Tasa de resolución de los requerimientos de los últimos 7 días", "Valor": locateFormatPercentNDijitos(Resolucion, 2) },
            { "Estado": "Total resueltos", "Descripcion": "Total de requerimientos resueltos en los últimos 7 días.", "Valor": Resueltos.length }
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
                        return value.Nombre === e.currentTarget.value
                    })
                    setEstadoRequerimientosSeleccionado((lstEstado[0] ? lstEstado[0] : { "Estado": "Todos" }));
                }} aria-label="Default select example">
                    <option value={"Todos"}>Todos</option>
                    {
                        EstadoRequerimientos?.map((element: any) => {
                            let flag = (element.Nombre === EstadoRequerimientosSeleccionado.Estado)
                            return (<option selected={flag} key={element.Nombre} defaultValue={element.Nombre} value={element.Nombre}>{element.Nombre}</option>)
                        })
                    }
                </Form.Select>
            </div>

        );
    }
    //PARA QUE PUEDAN SELECCIONAR UN AGENTE DIFERENTE Y NUEVO.
    const EditarRequerimiento = (row:any) =>{
        let Cabeceras = JSON.parse(row.original.Cabecera);
        //Titulo
      
        //Lo divido en 2 para tener mejor claridad
        let Inicio = String(row.original.Consecutivo).substring(0, 6);
        let Final = String(row.original.Consecutivo).substring(6, String(row.original.Consecutivo).length);
        setTitulo(`Requerimiento ${Inicio}-${Final}` );
        setConsecutivo(`${Cabeceras[0].nombrecliente} - ${Cabeceras[0].registrationNumber}`);
        setshowedit(true);
    };

    function MontarTabla() {
        return <>
            <MaterialReactTable
                localization={MRT_Localization_ES}
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
                        size: 200,
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
                                <Details className="text-primary" />
                            </IconButton>
                        </Tooltip>
                        {/* Para editar si cumple con la condicion */}
                        <Tooltip arrow placement="top" title="Editar requerimiento">
                            <IconButton onClick={() => EditarRequerimiento(row)}>
                                <Edit className="text-warning" />
                            </IconButton>
                        </Tooltip>
                        {/* Permite eliminar el requerimiento siempre y cuando sea en estado Creado de lo contrario no permite eliminarlo*/}
                        {(FiltroData.getIsActivoMod(row,"Creado")) && (<Tooltip arrow placement="top" title="Eliminar requerimiento">
                            <IconButton onClick={() => {
                                RequerimientoFunciones.SetEliminarRequerimiento(row);
                            }}>
                                <Delete className="text-danger"/>
                            </IconButton>
                        </Tooltip>)}
                         {/* Permite asignarlo siempre y cuando este en estado creado sino no lo asigna a soporte*/}
                        {(FiltroData.getIsActivoMod(row,"Creado")) && (<Tooltip arrow placement="right" title="Asignar requerimiento">
                            <IconButton onClick={() =>{
                                 RequerimientoFunciones.SetAsignarRequerimiento(row);
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
                            DescargarExcel(DatosTabla,Campos, `Reporte de requerimientos${(tabSel == 0 ? "": (tabSel == 1 ? " asignados":(tabSel ==2 ? " cerrados":"")))}`)
                        }}>
                            <i className="bi-file-earmark-excel"></i></button>

                    </Box>
                )}
                initialState={{ density: 'compact' }}
            />
        </>
    }
    return (
        <>
            <PageTitle>Interfaz de requerimientos</PageTitle>
            <BlockUi tag="div" keepInView blocking={loader ?? false}  >
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
                                                // backgroundColor: `${(element.Estado == "Abiertos") ? "#f8d7da" : (element.Estado == "En Soporte") ? "#F89262" :
                                                //     (element.Estado == "Total resueltos") ? "#d1e7dd" : "#cfe2ff"}`
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
                        )
                        }
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
                        {(tabSel === 2) && (showTablaCerradas) && (DatosTabla.length != 0) && (
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
                    <div className={`tab-pane fade ${tabSel === 3 ? "show active" : ""}`} id="tab3_content">
                        {/* begin::Cards */}
                        {(tabSel === 3) && (showTablaReporte) && (DatosReporte.length != 0) && (
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
                                        <button title="Reporte a excel"  style={{ display:  "inline-block"}} className="btn btn-sm btn-primary" type="button" onClick={() => {
                                            DescargarExcel(DatosReporte,CamposReporte, "Reporte requerimientos agrupados")
                                        }}>
                                            <i className="bi-file-earmark-excel"></i></button>
                
                                    </Box>
                                )}
                                initialState={{ density: 'compact' }}
                            />
                        )}
                        {
                            <div style={{
                                display: `${(tabSel === 3 && DatosReporte.length === 0 ? "flex" : "none")}`,
                                textAlign: 'center'
                            }}>
                                <div className="text-center text-muted fw-bolder" style={{ lineHeight: '200px', margin: 'auto', fontSize: "20px" }}>
                                    No hay datos que mostrar
                                </div>
                            </div>
                        }
                    </div>
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
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <div className="text-center border border-5">
                                <span className="mx-4 fs-3 text-muted">{Consecutivo}</span>
                            </div>
                        </div>
                        <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
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
                                <EstadosEditar></EstadosEditar>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                            <div className="form-control-sm">
                                <label className="control-label label label-sm" style={{ fontWeight: 'bold' }}>Observaciones: </label>
                                <textarea className="form-control" rows={3}></textarea>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button type="button" className="btn btn-sm" variant="primary" onClick={() => {
                       RequerimientoFunciones.SetEdicionRequerimiento([]);
                       setshowedit(false);
                    }}>
                        Guardar
                    </Button>
                    <Button type="button" className="btn btn-sm" variant="secondary" onClick={() =>setshowedit(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}