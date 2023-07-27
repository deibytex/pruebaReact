import BlockUi from "@availity/block-ui";
import { useEffect, useState } from "react";
import { PageTitle } from "../../../../../../_start/layout/core";
import { FiltroData, listTabsRequerimientos } from "../../data/Requerimientos";
import { DrawDynamicIconMuiMaterial } from "../../../../../../_start/helpers/components/IconsMuiDynamic";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import moment from "moment";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { FiltrosReportes } from "../../Models/ModelRequerimientos";
import { GettRequerimiento } from "../../data/PostVentaData";
import { AxiosResponse } from "axios";
import { DateRangePicker } from "rsuite";
import { Button } from "react-bootstrap-v5";
import { locateFormatPercentNDijitos } from "../../../../../../_start/helpers/Helper";
export default function Creacion() {
    //ESPACIO PARA LAS CONST
    const [loader, setloader] = useState<boolean>(false);
    const [lstIndicadores, setListIndicadores] = useState<any>([
        {"Estado": "Abiertos","Descripcion":"Total de Requerimientos Abiertos", "Valor":0},
        {"Estado": "En Soporte", "Descripcion":"Total de Requerimientos en Soporte","Valor":0},
        {"Estado": "Tasa de resolución","Descripcion":"Tasa de resolución de los requerimientos de los últimos 7 días","Valor":0},
        {"Estado": "Total resueltos","Descripcion":"Total de requerimientos resueltos en los últimos 7 días.","Valor":0}
    ]);
    const [tabSel, settabSel] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [isError, setIsError] = useState(false);
    const [DatosTabla, setDatosTabla] = useState<any[]>([]);
    const [DatosReporte, setDatosReporte] = useState<any[]>([]);
    const { allowedMaxDays, allowedRange, combine } = DateRangePicker;
    const [isCallData, setisCallData] = useState<boolean>(false);
    const FiltrosBase: FiltrosReportes = {
        FechaInicialInicial: moment().add(-30, 'days').startOf('day').toDate(),
        FechaFinalInicial: moment().startOf('day').toDate(),
        FechaInicial: moment().startOf('day').add(-30, 'days').toDate(),
        FechaFinal: moment().startOf('day').toDate(),
        limitdate: 180,
        Data:[],
        Consulta:true
    };
    const TipoReporteBase = [
        { reporte: "Todos", tabla: "tblTodos", tipoConsulta: "Todos", tituloFiltro : "Todos", filtros: { ...FiltrosBase, MaxDay: 30 }, Data: [], tipo: "Todos", Consultar: true},
        { reporte: "Asignados", tabla: "tblsAsignados", tipoConsulta: "asignados", tituloFiltro : "Asignados", filtros: { ...FiltrosBase, MaxDay: 30 }, Data: [], tipo: "Asignados" },
        { reporte: "Cerrados", tabla: "tblCerrados", tipoConsulta: "cerrados", tituloFiltro : "Cerrados", filtros: { ...FiltrosBase, MaxDay: 7 }, Data: [], tipo: "Cerrados" },
        { reporte: "Reporte", tabla: "tblReporte", tipoConsulta: "reporte", tituloFiltro : "Reporte", filtros: { ...FiltrosBase, MaxDay: 7 }, Data: [], tipo: "Reporte" },
    ]
    const [TipoReporte, setTipoReporte] = useState(TipoReporteBase);
    //ESPACIO PARA LOS ENCABEZADOS DE LAS TABLAS
    let Campos: MRT_ColumnDef<any>[] =
    [
        {
            accessorKey: 'nombrecliente',
            header: 'Cliente',
            Cell({ cell, column, row, table, }) {
                let Cabecera = JSON.parse(row.original.Cabecera);
                return (Cabecera[0].nombrecliente == undefined ? "":Cabecera[0].nombrecliente);
            },
        },
        {
            accessorKey: 'Consecutivo',
            header: 'Nro Requerimiento',
        },
        {
            accessorKey: 'registrationNumber',
            header: 'Vehiculo',
            Cell({ cell, column, row, table, }) {
                let Cabecera = JSON.parse(row.original.Cabecera);
                return (Cabecera[0].registrationNumber == undefined ? "":Cabecera[0].registrationNumber);
            },
        },
      
        {
            accessorKey: 'Estado',
            header: 'Estado',
            Cell({ cell, column, row, table, }) {
                return RetornarEstado(row.original.Estado);
            }
        },
        {
            accessorKey: 'agente',
            header: 'Agente',
            Cell({ cell, column, row, table, }) {
                let Cabecera = JSON.parse(row.original.Cabecera);
                return (Cabecera[0].agente == undefined ? "":Cabecera[0].agente);
            },
        },
        {
            accessorKey: 'Fecha',
            header: 'Ultima Actualización',
            Cell({ cell, column, row, table, }) {
                return moment(row.original.AVL).format("DD/MM/YYYY");
            }
        },
        {
            accessorKey: 'Observaciones',
            header: 'Detalle ',
        }
    ];
    //Para el reporte
    let CamposReporte : MRT_ColumnDef<any>[] =
    [
        {
            accessorKey: 'registrationNumber',
            header: 'Vehiculo',
            // Cell({ cell, column, row, table, }) {
            //     let Cabecera = JSON.parse(row.original.Cabecera);
            //     return (Cabecera[0].nombrecliente == undefined ? "":Cabecera[0].nombrecliente);
            // },
        },
        {
            accessorKey: 'Cantidad',
            header: 'Cantidad',
        },
        // {
        //     accessorKey: 'registrationNumber',
        //     header: 'Vehiculo',
        //     Cell({ cell, column, row, table, }) {
        //         let Cabecera = JSON.parse(row.original.Cabecera);
        //         return (Cabecera[0].registrationNumber == undefined ? "":Cabecera[0].registrationNumber);
        //     },
        // },
    ];
    //FUNCION PARA RETORNAR UN ESTADO GRAFICAMENTE
    const RetornarEstado = (data:any) =>{
        return <span className={`${(data == "Creado" || data == "Reabierto"? "badge bg-warning":(data == "Asignado Soporte" || data == "Asignado Agente" || data == "Asignado ST") ? "badge bg-info":(data == "Cerrado") ? "badge bg-success":"badge bg-primary")}`}>{data}</span>
    }
    //ESPACIO PARA LAS CONSULTAS INICIALES
    const ConsultasIniciales = () =>{
        if (TipoReporte[0].Consultar == true || isCallData) {
            setloader(true);
            setIsError(false);
            setIsLoading(true);
            setIsRefetching(true);
            GettRequerimiento().then(
                (response:AxiosResponse<any>
            ) =>{
                setisCallData(false);
                let Tiporeporte = [...TipoReporteBase];
                Tiporeporte[tabSel].Consultar  = false;
                Tiporeporte[tabSel].Data = response.data;
                setTipoReporte(Tiporeporte);
                FiltroDatos();
                setloader(false);
                setIsError(false);
                setIsLoading(false);
                setIsRefetching(false);
            }).catch(({error}) =>{
                console.log("error", error)
                setloader(false);
                setIsError(true);
            });
        }
        else
        FiltroDatos();
    };
    //ESPACIO PARA LA FUNCION QUE APLICA LOS FILTROS
    const FiltroDatos = () =>{
        let tabDefault = 0;
        const tabla = TipoReporte[tabSel].tabla;
        let filtros = TipoReporte[tabSel].filtros;
        let FechaInicial: Date = filtros.FechaInicial;
        let FechaFinal: Date = filtros.FechaFinal;
        // datos traidos del c liente
        let datosfiltrados = TipoReporte[tabDefault].Data;
          // filtramos por las fechas
        // datosfiltrados = datosfiltrados.
        //   filter((f: any) => moment(f.Fecha).toDate() >= FechaInicial && moment(f.Fecha).toDate() <= FechaFinal);
        // SE HACE SWITCH Entre tabs para cambiar informacion segun se requiera.
        switch(tabSel) {
            case 0:
            default:
                PintarIndicadores(datosfiltrados);
                setDatosTabla(datosfiltrados) 
                break;
           case 1:
                setDatosTabla(FiltroData.getAsignados(datosfiltrados)) ;
                break;
           case 2:
               setDatosTabla(FiltroData.getCerrados(datosfiltrados));
               break;
            case 3:
                let reporte = FiltroData.getReporte(datosfiltrados);
                let DatosReporte:any[] = [];
                Object.entries(reporte).map((elem: any) => {
                   DatosReporte.push({"registrationNumber":elem[0],"Cantidad":elem[1].length})
                });
                setDatosReporte(DatosReporte);
                break;
          }
    }
    //ESPACIO PARA LOS USEEFFECT
    useEffect(() =>{
            ConsultasIniciales();
        //Elimina lo asincrono
        return () =>{
            setDatosTabla([]);
            setDatosReporte([]);
        }
    },[tabSel])

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
    const PintarIndicadores = (datosfiltrados:any) =>{
        let Abiertos = FiltroData.getAbiertos(datosfiltrados);
        let Soporte = FiltroData.getSoporte(datosfiltrados);
        let TotalRequerimientos = datosfiltrados.length;
        let Resueltos = FiltroData.getCerrados(datosfiltrados);
        let Resolucion = (TotalRequerimientos == 0 ? 0 :Resueltos.length/TotalRequerimientos) ;
        setListIndicadores([
            {"Estado": "Abiertos","Descripcion":"Total de Requerimientos Abiertos", "Valor":Abiertos.length},
            {"Estado": "En Soporte", "Descripcion":"Total de Requerimientos en Soporte","Valor":Soporte.length},
            {"Estado": "Tasa de resolución","Descripcion":"Tasa de resolución de los requerimientos de los últimos 7 días","Valor":locateFormatPercentNDijitos(Resolucion, 2)},
            {"Estado": "Total resueltos","Descripcion":"Total de requerimientos resueltos en los últimos 7 días.","Valor":Resueltos.length}
        ]);
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
                                                    backgroundColor: `${(element.Estado == "Abiertos") ? "#f8d7da" : (element.Estado == "En Soporte") ? "#F89262" :
                                                        (element.Estado == "Total resueltos") ? "#d1e7dd" : "#cfe2ff"}`
                                                }}
                                            >
                                                <div className="m-3 text-center">
                                                    <h2 className={`mb-0 ${(element.Estado === "En Soporte") ? "text-white" : ""}`}><span id={element.Estado}>{element.Valor}</span></h2>
                                                    <span className={`${(element.Estado === "En Soporte") ? "text-white" : "text-muted"}`}>{element.Estado}</span>
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
                            <DateRangePicker size="lg" className="mt-2" format="dd/MM/yyyy" value={[TipoReporte[tabSel].filtros.FechaInicial, TipoReporte[tabSel].filtros.FechaFinal]}
                                hoverRange={
                                    TipoReporte[tabSel].tipo == "Todos" ? `month` : undefined //date =>  [subDays(date, 3), addDays(date,3)]
                                }
                                disabledDate={combine(allowedRange(
                                    (TipoReporte[tabSel].tipo == "Todos") ? moment().add(-30, 'days').startOf('days').toDate() : moment().add(-7, 'days').toDate(),
                                    (TipoReporte[tabSel].tipo == "Todos") ? moment().endOf('days').toDate() : moment().toDate()
                                ),
                                    allowedMaxDays(180)
                                )}
                                onChange={(value, e) => {
                                    if (value !== null) {
                                        ValidarFechas(
                                            [value[0],
                                            value[1]]
                                        );
                                    }
                                }}
                            />
                        )}
                        {/* <Button className="mb-6 mx-2 mt-2 btn btn-sm btn-primary" onClick={() => { setShowModal(true) }}>
                            <i className="bi-person"></i></Button>
                        {(tabSel == 2) && (<Button title="Seleccione eventos" className="mb-6 mx-2 mt-2   btn btn-sm btn-primary" onClick={() => { setShowModalEventos(true) }}>
                            <i className="bi-card-list"></i></Button>)}*/}
                        <Button className="mb-6 mx-2 mt-2   btn btn-sm btn-primary" onClick={() => { ConsultasIniciales() }}><i className="bi-search"></i></Button> 
                    </div>
                    <div className="d-flex justify-content-end mt-2 m-2">
                        <div style={{ float: 'right' }}>
                            {/* Espacio para un filtro */}
                        </div>
                    </div>
                </div>
                {/* Fin del encabezado */}
                <div className="me-sm-12 w-100">
                    <ul className="nav nav-tabs nav-pills nav-pills-custom">
                        {listTabsRequerimientos.map((tab, idx) => {
                            return (<li className="nav-item mb-3" key={`tabenc_${idx}`}>
                                <a
                                    onClick={() => settabSel(idx)}
                                    className={`nav-link w-224px h-70px ${tabSel === idx ? "active btn-active-light" : ""
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
                        {(tabSel === 0) && (DatosTabla.length != 0) &&(<MaterialReactTable
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
                                sx: (theme) => ({
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
                            state={{
                                isLoading:isLoading,
                                showAlertBanner: isError,
                                showProgressBars: isRefetching,
                            }}
                            initialState={{ density: 'compact' }}
                        />)}
                        {
                           <div style={{
                            display:`${(tabSel === 0 && DatosTabla.length === 0 ? "flex":"none")}`,
                            textAlign:'center'
                        }}>
                            <div className="text-center text-muted fw-bolder" style={{lineHeight: '200px', margin:'auto', fontSize:"20px"}}>
                                No hay datos que mostrar
                            </div>
                        </div>
                        }
                        
                    </div>
                    <div className={`tab-pane fade ${tabSel === 1 ? "show active" : ""}`} id="tab1_content" >
                        {/* begin::Cards */}
                        {(tabSel === 1) && (DatosTabla.length != 0) &&(<MaterialReactTable
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
                                sx: (theme) => ({
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
                            state={{
                                isLoading:isLoading,
                                showAlertBanner: isError,
                                showProgressBars: isRefetching,
                            }}
                            initialState={{ density: 'compact' }}
                        />)}
                          {
                           <div style={{
                            display:`${(tabSel === 1 && DatosTabla.length === 0 ? "flex":"none")}`,
                            textAlign:'center'
                        }}>
                            <div className="text-center text-muted fw-bolder" style={{lineHeight: '200px', margin:'auto', fontSize:"20px"}}>
                                No hay datos que mostrar
                            </div>
                        </div>
                        }
                    </div>
                    <div className={`tab-pane fade ${tabSel === 2 ? "show active" : ""}`} id="tab2_content">
                        {/* begin::Cards */}
                        {(tabSel === 2) && (DatosTabla.length != 0) &&(<MaterialReactTable
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
                                sx: (theme) => ({
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
                            state={{
                                isLoading:isLoading,
                                showAlertBanner: isError,
                                showProgressBars: isRefetching,
                            }}
                            initialState={{ density: 'compact' }}
                        />)}
                        {
                           <div style={{
                            display:`${(tabSel === 2 && DatosTabla.length === 0 ? "flex":"none")}`,
                            textAlign:'center'
                        }}>
                            <div className="text-center text-muted fw-bolder" style={{lineHeight: '200px', margin:'auto', fontSize:"20px"}}>
                                No hay datos que mostrar
                            </div>
                        </div>
                        }
                    </div>
                    <div className={`tab-pane fade ${tabSel === 3 ? "show active" : ""}`} id="tab3_content">
                        {/* begin::Cards */}
                        {(tabSel === 3) && (DatosReporte.length != 0) &&(<MaterialReactTable
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
                                sx: (theme) => ({
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
                                isLoading:isLoading,
                                showAlertBanner: isError,
                                showProgressBars: isRefetching,
                            }}
                            initialState={{ density: 'compact' }}
                        />)}
                        {
                           <div style={{
                            display:`${(tabSel === 3 && DatosReporte.length === 0 ? "flex":"none")}`,
                            textAlign:'center'
                        }}>
                            <div className="text-center text-muted fw-bolder" style={{lineHeight: '200px', margin:'auto', fontSize:"20px"}}>
                                No hay datos que mostrar
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </BlockUi>
        </>
    )
}