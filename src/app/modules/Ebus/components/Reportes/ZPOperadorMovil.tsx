import { TituloReporteZP } from "../../../../../_start/helpers/Texts/textosPorDefecto";
import { PageTitle } from "../../../../../_start/layout/core";
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import moment from 'moment-timezone';
import { useEffect, useState } from "react";
import { Form, Modal, Button, Card } from "react-bootstrap-v5";
import { DateRangePicker, useToaster } from "rsuite";
import { formatFechasView, locateFormatPercentNDijitos } from "../../../../../_start/helpers/Helper"
import { AxiosResponse } from 'axios';
import { GetReporteOperadorMovil, fncReporteOperadorMovil, listTabs } from '../../data/ReportesData';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { GetClientesEsomos } from "../../data/NivelCarga";
import { ClienteDTO } from '../../../../../_start/helpers/Models/ClienteDTO';
import { errorDialog } from '../../../../../_start/helpers/components/ConfirmDialog';
import { FiltrosReportesZp } from "../../models/eBus";
import { FormatoColombiaDDMMYYY, FormatoSerializacionYYYY_MM_DD_HHmmss } from '../../../../../_start/helpers/Constants';
import DualListBox from 'react-dual-listbox';
import { dualList } from '../../../../../_start/helpers/Models/DualListDTO';
import BlockUi from 'react-block-ui';
import { DescargarExcelPersonalizado } from '../../../../../_start/helpers/components/DescargarExcel';
import ReactApexChart from 'react-apexcharts';
import { Totales } from '../../models/ZpOperadorMovilModels'
import { DrawDynamicIconMuiMaterial } from "../../../../../_start/helpers/components/IconsMuiDynamic";
import { Box } from "@mui/material";
import { ColumnasGraficaZonaOperador, ColumnasTablas } from "../../data/ReporteZp";
import { set } from "rsuite/esm/utils/dateUtils";

export default function ZPOperadorMovil() {
    let filtrosBase: FiltrosReportesZp = {
        FechaInicialInicial: moment().add(-5, 'days').startOf('day').toDate(),
        FechaFinalInicial: moment().startOf('day').toDate(),
        FechaInicial: moment().startOf('day').add(-5, 'days').toDate(),
        FechaFinal: moment().startOf('day').toDate(),
        IndGrafica: -1,
        FechaGrafica: "",
        Vehiculos: [],
        Operadores: null,
        limitdate: 180,
        consultar: true
    }
    // variable que contiene los filtros del sistema
    const TipoReporteBase = [
        { reporte: "tblmovildia", tabla: "tblmovildia", tipoConsulta: "Movil", tituloFiltro : "Vehículos", filtros: { ...filtrosBase, MaxDay: 30 }, Data: [], tipo: 1 },
        { reporte: "tbloperadordia", tabla: "tbloperadordia", tipoConsulta: "Operador", tituloFiltro : "Operadores", filtros: { ...filtrosBase, MaxDay: 30 }, Data: [], tipo: 2 },
        { reporte: "tbloperadorgrafica", tabla: "tbloperadorgrafica", tipoConsulta: "Operador", tituloFiltro : "Operadores", filtros: { ...filtrosBase, MaxDay: 7 }, Data: [], tipo: 3 },
    ]
    moment.tz.setDefault("America/Bogota");

    // filtros para los que son diarios, maximo 30 dias 
    // vienen del archivo data/reportezp
    TipoReporteBase[1].filtros.FechaInicial = moment().startOf('day').startOf('day').add(-5, 'days').toDate();
    TipoReporteBase[1].filtros.FechaFinal = moment().startOf('day').toDate();
    TipoReporteBase[1].filtros.limitdate = 30;
    const [TipoReporte, setTipoReporte] = useState(TipoReporteBase);
    const [idxSeleccionado, setidxSeleccionado] = useState<number>(-2);
    const [columnasTabla, setColumnasTablas] = useState<any[]>([]);
    const [loader, setloader] = useState<boolean>(false);
    const [tabSel, settabSel] = useState<number>(0);
    const [opciones, setOpciones] = useState<any>(null);
    const [OpcionesAcumulado, setAcumulado] = useState<any>(null);
    const [DateTableMovil, setDateTableMovil] = useState<any[]>([]);
    const [isCallData, setisCallData] = useState<boolean>(false); // permite validar 
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<number>(0);
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [lstVehiculos, setlstVehiculos] = useState<dualList[]>([]);
    const [lstSeleccionados, setSeleccionados] = useState<string[]>([]);
    //para las fechas
    const { allowedMaxDays, allowedRange, combine } = DateRangePicker;

    //TABLES
    //table state
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [sortingG, setSortingG] = useState<SortingState>([]);
    const [sortingf, setSortingf] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [rowCountMovil, setRowCountMovil] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [isError, setIsError] = useState(false);
    //TABLES
    const [Totales, setTotales] = useState<Totales[]>([]);
    const [TotalesV5, setTotalesV5] = useState<Totales[]>([]);
    useEffect(
        () => {
            GetClientesEsomos().then((response: AxiosResponse<any>) => {
                setClientes(response.data);
                setClienteSeleccionado(response.data[0].clienteIdS)

            }).catch((error) => {
                console.log(error);
                errorDialog("<i>Eror al consultar los clientes</i>", "")
            })

            return () => setClientes([]);
        }, []
    )
    useEffect(() => {
        // consulta la informacion de las alarmas cuando 
        // cambia el ciente seleecionado y las fechas 
        if (ClienteSeleccionado != 0)
            Consultar(tabSel);

        // WARNING --  HAY QUE TENER PRESENTE QUE LOS USESTATE
        // DENTRO DE LOS EVENTOS DE LA GRAFICA NO USA EL ESTADO ACTUAL SINO EL ESTADO
        // AL MOMENTO DE SER CREADO, SE DEBEN USAR LOS SETUSETATE Y LOS CLICK EVENTS 
        // PARA QUE USE LOS USESTATE CON LA INFORMACIONF REAL

        let defaultopciones = {
            options: {
                chart: {
                    id: 'apexchart-example',
                    fontFamily: 'Montserrat',
                    events: {
                        dataPointSelection: function (event: any, chartContext: any, config: any) {
                            // seleccionamos el index de la grafica para posteriormente filtrar
                            setidxSeleccionado(config.dataPointIndex);
                        }
                    },
                    stacked: true,

                },
                xaxis: {
                    categories: [],
                }, yaxis: {
                    showAlways: true,
                    max:1,
                    // seriesName: 'Energía [kWh]',
                    labels: {
                        formatter: function (val: number, index: any) {
                            return locateFormatPercentNDijitos(val, 2)
                        }
                    }

                },
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: true,
                    style: {
                        colors: ['#424249']
                    },
                    formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {

                        return locateFormatPercentNDijitos(value, 2)
                    },


                }
            },
            series: []

        }
        let defaultopcionesAcumulado = {
            options: {
                chart: {
                    id: 'apexchart-acumulado',
                    fontFamily: 'Montserrat',
                },
                xaxis: {
                    categories: [],
                }, yaxis: {
                    showAlways: true,
                     
                    // seriesName: 'Energía [kWh]',
                    labels: {
                        formatter: function (val: number, index: any) {
                            return locateFormatPercentNDijitos(val, 2)
                        }
                    }

                },
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: true,
                    style: {
                        colors: ['#424249']
                    },
                    formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {

                        return locateFormatPercentNDijitos(value, 2)
                    },

                }
            },
            series: []
        }

        // asingamos las opciones
        setOpciones(defaultopciones);
        setAcumulado(defaultopcionesAcumulado);
        return function cleanUp() {
            //SE DEBE DESTRUIR EL OBJETO CHART
            setTipoReporte(TipoReporte);
            setDateTableMovil([]);
        };

    }, [ClienteSeleccionado]);

    useEffect(() => {
        // consulta la informacion de las alarmas cuando 
        // cambia el ciente seleecionado y las fechas 
        if (ClienteSeleccionado != 0)
            Consultar(tabSel);

        return function cleanUp() {
            //SE DEBE DESTRUIR EL OBJETO CHART
        };

    }, [tabSel, TipoReporte]);

    const Consultar = (Tab: any) => {
        if (TipoReporte[Tab].filtros.consultar == true || isCallData) {
            ObtenerDatos(Tab);
        }
        else
            filtarDatosSistema(Tab);
    }

    function ObtenerDatos(key: any | null | undefined) {
        setIsError(false)
        setIsLoading(true)
        setIsRefetching(true)
        setloader(true)
        let Tab = (key == null || key == undefined ? "0" : key.toString());
        let keyAgrupadorReporte = TipoReporte[key].tipoConsulta;
        GetReporteOperadorMovil(moment(TipoReporte[key].filtros.FechaInicial).format(FormatoSerializacionYYYY_MM_DD_HHmmss)
            , moment(TipoReporte[key].filtros.FechaFinal).format(FormatoSerializacionYYYY_MM_DD_HHmmss), keyAgrupadorReporte, ClienteSeleccionado).then((response: AxiosResponse<any>) => {
                let Tiporeporte = [...TipoReporte];
                Tiporeporte[Tab].Data = response.data;
                setTipoReporte(Tiporeporte);

                let lstdataFiltroReporte = (response.data as any[]).reduce((p, c) => {
                    let operador = c[keyAgrupadorReporte]; // usamos el key con el que consultamos para poder extraer la informacion de la consulta dinamica
                    let isExists = p.filter((f: any) => f["value"] === operador);
                    if (isExists.length == 0)
                        p.push({ "value": operador, "label": operador })
                    return p;
                }, []);

                setlstVehiculos(lstdataFiltroReporte);// seteamos un solo valor ya que se dinamiza la informacion 

                // setModales();
                filtarDatosSistema(Tab);
                setIsLoading(false)
                setIsRefetching(false)
                Tiporeporte[key].filtros.consultar = false;
                setisCallData(false)

                setloader(false)
            }).catch((error) => {
                setIsError(true);
                setloader(false);
                setIsLoading(false)
                setIsRefetching(false)
            }).finally(() => {
                setloader(false);
            })
    };
    // VALIDA LAS FECHAS QUE SEAN LAS CORRECTAS Y ACTUALIZA LOS FILTROS
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
        // visualizar correctamente la información
        filtros = { ...Tiporeporte[tabSel].filtros, FechaInicial, FechaFinal, FechaInicialInicial, FechaFinalInicial, IndGrafica: -1, FechaGrafica: "" }
        Tiporeporte[tabSel].filtros = filtros;
        setTipoReporte(Tiporeporte)

    }
    const filtarDatosSistema = (key: any | null | undefined) => {
        setloader(true)
        let Tab = parseInt(key);
        let keyAgrupadorReporte = TipoReporte[key].tipoConsulta;
        const tabla = TipoReporte[Tab].tabla;
        let filtros = TipoReporte[Tab].filtros;
        let fechaGraficaActual = filtros.FechaGrafica;
        let FechaInicial: Date = filtros.FechaInicial;
        let FechaFinal: Date = filtros.FechaFinal;
        // datos traidos del c liente
        let datosfiltrados = TipoReporte[Tab].Data;
        if (filtros.IndGrafica != -1) {
            FechaInicial = moment(filtros.FechaGrafica, FormatoColombiaDDMMYYY).toDate();
            FechaFinal = moment(filtros.FechaGrafica, FormatoColombiaDDMMYYY).toDate();
        }
        // filtramos por las fechas
        datosfiltrados = datosfiltrados.
            filter((f: any) => moment(f.Fecha).toDate() >= FechaInicial && moment(f.Fecha).toDate() <= FechaFinal);
        // filtramos por los vehivulos
        if (filtros.Vehiculos.length > 0) {
            datosfiltrados = datosfiltrados.filter((f: any) => filtros.Vehiculos.indexOf(f[keyAgrupadorReporte]) > -1); // filtra segun tipo cpnsulta
            // si es Operador o Movil en la cofiguracion inicial
        }
        // para la grafica filtra por el rango total
        // agrupamos los datos para la grafica
        let agrupadofecha = datosfiltrados
            .reduce((p: any, c: any) => {
                let name = c.Fecha;
                p[name] = p[name] ?? [];
                p[name].push(c);
                return p;
            }, {});

        //Agrupamos por operador
        let agrupadoOperador: any[] = [];
        if (Tab == 1 || Tab == 2) {
            agrupadoOperador = datosfiltrados
                .reduce((p: any, c: any) => {
                    let name = c.Operador;
                    p[name] = p[name] ?? [];
                    p[name].push(c);
                    return p;
                }, {});

        }

        // sacamos la informacion de los campos que vamos a mostrar en la grafica principal

        // retorna los campos que vamos a utilizar para imprimir la informacion Ej
        // {
        //     "Movil": "Z66-7001",
        //     "Fecha": "2023-06-04T00:00:00",
        //     "EV0Regeneracion0P": 28,
        //     "EV1Potencia0P50": 11565,
        //     "EV2Potencia50P100": 2,
        //     "EV3Potencia100P150": 0,
        //     "EV4Potencia150P175": 0,
        //     "EV5Potencia175": 0,
        //     "Total": 11595
        // }
        // Devuelve  ["Movil","Fecha","EV0Regeneracion0P","EV1Potencia0P50","EV2Potencia50P100","EV3Potencia100P150","EV4Potencia150P175","EV5Potencia175","Total"]
        const listadoCampos = Object.entries(datosfiltrados[0]).map(
            m => {
                const result: any[] = [];
                const result1: any[] = [];
                return { "Campo": m[0], "Data": 0, "TotalFecha": result, "DetalladoOperador": result1 }
            }
        )

        // debe existir el listado de campos para poder mostrar informacion dinamicamente
        let labels = new Array();
        if (listadoCampos.length > 0) {
            // setListadoCampos(listadoCampos)

            // grafica totalizada
            datosfiltrados.map((item: any) => {
                // realizamos la sumatoria total de los campos para graficar    
                listadoCampos.forEach(f => {
                    if (!isNaN(item[f.Campo])) // validamos que sea un numero para que totalize la informacion
                        f.Data = f.Data + item[f.Campo]
                });
            });
            // datos para las graficas agrupadas por fecha 
            Object.entries(agrupadofecha).map((elem: any) => {
                labels.push(moment(elem[0]).format(formatFechasView));

                let EVTotal = (
                    elem[1].map((m: any) => {
                        return (m.Total)
                    }).reduce((a: any, b: any) => a + b, 0));

                listadoCampos.forEach(f => {
                    if (f.Data > 0) // validamos que sea un numero para que totalize la informacion
                    {
                        const totalPorFecha: number = (elem[1].map((m: any) => { return m[f.Campo] }).reduce((a: any, b: any) => a + b, 0));
                        f.TotalFecha.push((totalPorFecha / EVTotal ));
                    }
                });
            });


            if (tabla == "tbloperadorgrafica") {
                let agrupadoOperador = datosfiltrados
                    .reduce((p: any, c: any) => {
                        let name = c.Operador;
                        p[name] = p[name] ?? [];
                        p[name].push(c);
                        return p;
                    }, {});

                  
                Object.entries(agrupadoOperador).map((elem: any) => {

                    let EVTotal = (
                        elem[1].map((m: any) => {
                            return (m.Total)
                        }).reduce((a: any, b: any) => a + b, 0));

                    listadoCampos.forEach(f => {
                        if (f.Data > 0) // validamos que sea un numero para que totalize la informacion
                        {
                            const totalPorFecha: number = (elem[1].map((m: any) => { return m[f.Campo] }).reduce((a: any, b: any) => a + b, 0));
                            f.DetalladoOperador.push({ Id:f.Campo,  Operador: elem[0], Total: (totalPorFecha / EVTotal ) });
                        }
                    });      
                });
                setTotales(listadoCampos[6].DetalladoOperador.sort((a: any, b: any) => {
                    return b.Total - a.Total
                }));
                setTotalesV5(listadoCampos[7].DetalladoOperador.sort((a: any, b: any) => {
                    return b.Total - a.Total
                }));
            }

        }

        // escogemos la información consolidada de las graficas para armar los campos que necesitamos para poder armar las columnas
        // 
        let ColumnasTablas: MRT_ColumnDef<any>[] = []; // variable que va a contener dinamicamente los campos en el orden que llegan al sistema
        listadoCampos.forEach((e) => {

            // si el campo es fecha 
            if (e.Campo == "Fecha")
                ColumnasTablas.push({
                    accessorKey: e.Campo,
                    header: e.Campo,
                    Cell({ cell, column, row, table, }) {
                        return (moment(row.original[e.Campo]).format("DD/MM/YYYY"))
                    }
                })
            else {
                // si el campo tiene como propiedad Data mayor a 0 quiere decir que es un numero con totalizador
                if (e.Data > 0 && e.Campo != "Total")
                    ColumnasTablas.push({
                        accessorKey: e.Campo,
                        header: e.Campo,
                        Cell({ cell, column, row, table, }) {
                            return locateFormatPercentNDijitos(
                                row.original[e.Campo] / row.original["Total"], 2);
                        }
                    })
                else // cualquier otro campo se trata como texto no tiene tratamiento
                    if (e.Campo != "Total")
                        ColumnasTablas.push({
                            accessorKey: e.Campo,
                            header: e.Campo,

                        })
            }

        })

        setColumnasTablas(ColumnasTablas); // seteamos los campos de las tablas
        setSorting([]); // seteamos el ordenamiento para que no se reviente la aplicacion
        setPagination({
            pageIndex: 0,
            pageSize: 10,
        });
        setGlobalFilter('');
        setColumnFilters([]);

        setDateTableMovil(datosfiltrados);
        setRowCountMovil(datosfiltrados.length);
        // fin de resetear los datos de las tablas
        ApexCharts.exec('apexchart-example', 'updateOptions', {
            chart: {
                fill: {
                    colors: ['#118DFF', '#00B050', '#92D050', '#CCED63', '#FFC000', '#FF0000']
                },
                toolbar: {
                    show: false
                },
                events: {
                    dataPointSelection: (event: any, chartContext: any, config: any) => {
                        // seleccionamos el index de la grafica para posteriormente filtrar
                        let labelSeleccionado = config.w.config.xaxis.categories[config.dataPointIndex];
                        // si la informacion del label seleccionado es igual al label que se encuentra en los filtros
                        // asginamos  -1 y limpiamos la grafica para que muestre todos los datos
                        setidxSeleccionado((labelSeleccionado === fechaGraficaActual) ? -1 : config.dataPointIndex);
                    }
                }
            },
            xaxis: {
                categories: labels
            },
            colors: ['#118DFF', '#00B050', '#92D050', '#CCED63', '#FFC000', '#FF0000']
        });
        ApexCharts.exec('apexchart-acumulado', 'updateOptions', {
            chart: {

                toolbar: {
                    show: false
                },
            },
            legend: {
                onItemClick: {
                    toggleDataSeries: false
                },
                onItemHover: {
                    highlightDataSeries: false
                }
            },
            xaxis: {
                categories: ["Periodo"]
            },
            colors: ['#118DFF', '#00B050', '#92D050', '#CCED63', '#FFC000', '#FF0000']

        });

        // funcion que actualiza los datos de las series
        // se debe pasar el id configurado al momento de su creaci'on para poder
        // actializar los datos
        const total = listadoCampos.pop(); // obtenemos el ultio elemento y lo eliminamos del array para poder calcular los porcentajes de las graficas
        const totalt = (total) ? total.Data : 0;
        ApexCharts.exec('apexchart-example', 'updateSeries', listadoCampos.filter(f => f.Data > 0).map(
            m => {
                return { "name": m.Campo, "data": m.TotalFecha }
            }
        ));
        //Agrupado
        ApexCharts.exec('apexchart-acumulado', 'updateSeries', listadoCampos.filter(f => f.Data > 0).map(
            m => {
                return { "name": m.Campo, "data": [m.Data / totalt ] }
            }
        ));

        setloader(false)
    };
    const OnClickTabs = (Tab: number) => {

        let data = TipoReporte[Tab].Data
        settabSel(Tab);
        setSeleccionados([])
        if (!TipoReporte[Tab].filtros.consultar) {
            filtarDatosSistema(Tab);
        }
    }
    function CargaListadoClientes() {
        return (
            <Form.Select  onChange={(e) => {
                setClienteSeleccionado(Number.parseInt(e.currentTarget.value))
                setTipoReporte(TipoReporteBase);

            }} aria-label="Default select example" value={ClienteSeleccionado}>
                {
                    Clientes?.map((element: any, i: any) => {
                        return (<option key={element.clienteIdS} value={(element.clienteIdS != null ? element.clienteIdS : 0)}>{element.clienteNombre}</option>)
                    })
                }
            </Form.Select>
        );
    }
    // seleccion de vehiculos
    function SelectFiltroVehiculoOperador() {
        return (
            <DualListBox className=" mb-3 " canFilter
                options={lstVehiculos}
                selected={lstSeleccionados}
                onChange={(selected: any) => {
                    // dejamos los seleccionados
                    setSeleccionados(selected)
                    // modificacion de filtros
                    let tiporeporte = [...TipoReporte];
                        tiporeporte[tabSel].filtros = { ...TipoReporte[tabSel].filtros, Vehiculos: selected };
                    setTipoReporte(tiporeporte)
                  
                }}
            />
        );
    }
  


    return (
        <>
            <PageTitle >{TituloReporteZP}</PageTitle>
            <div className="row  col-sm-12 col-md-12 col-xs-12 rounded border  mt-1 mb-2 shadow-sm " style={{ width: '100%' }}  >
                <BlockUi tag="div" keepInView blocking={loader ?? false}  >

                    <div className="card">
                       
                        <div className="d-flex justify-content-between mb-2">
                            <div className="mx-auto">
                                <div className="ms-3 text-center">
                                    <h3 className="mb-0">Zonas de potencia</h3>
                                    <span className="text-muted m-3">Consolidado y Detallado</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded bg-secondary d-flex justify-content-between m-1">
                            <div className="d-flex justify-content-start m-1">
                                <label className="control-label label  label-sm mt-2 " style={{ fontWeight: 'bold' }}>Rango Fechas: </label>
                                {(combine && allowedMaxDays && allowedRange) && (
                                    <DateRangePicker className="ms-2" format="dd/MM/yyyy" value={
                                        [TipoReporte[tabSel].filtros.FechaInicial, TipoReporte[tabSel].filtros.FechaFinal]}
                                        disabledDate={combine(allowedMaxDays(TipoReporte[tabSel].filtros.MaxDay), allowedRange(
                                            moment().add(-200, 'days').startOf('day').toDate(), moment().startOf('day').toDate()
                                        ))}
                                        onChange={(value, e) => {
                                            if (value !== null) {
                                                ValidarFechas(
                                                    [value[0],
                                                    value[1]]
                                                );
                                            }
                                        }} />
                                )}

                                <Button className=" mb-2 ms-2 btn btn-sm btn-primary" onClick={() => { 
                                    setShowModal(true) }}><i className={`${
                                    (tabSel == 0) ? "bi-car-front-fill" : "bi-person" 
                                }`}></i></Button>
                                 <Button className="ms-2 mb-2 btn btn-sm btn-primary" onClick={() => { Consultar(tabSel) }}><i className="bi-search"></i></Button>
                            </div>
                            <div className=" d-flex justify-content-end m-1">
                                   <CargaListadoClientes></CargaListadoClientes>
                              
                            </div>

                        </div>

                        <div className="card-body">
                            <div className=" flex-wrap flex-xxl-nowrap justify-content-center justify-content-md-start pt-4">
                                {/* begin::Nav */}
                                <div className="me-sm-10 me-0">
                                    <ul className="nav nav-tabs nav-pills nav-pills-custom" > {/**/}
                                        {listTabs.map((tab, idx) => {
                                            return (<li className="nav-item mb-3" key={`tabenc_${idx}`}>
                                                <a
                                                    onClick={() => { OnClickTabs(idx) }}
                                                    className={`nav-link w-225px h-70px ${tabSel === idx ? "active btn-active-light" : ""
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
                                {/* end::Nav */}
                                {/* begin::Tab Content */}
                                <div className="tab-content flex-grow-1">
                                    {/* begin::Tab Pane 1 */}
                                    <div>
                                        <div style={{ display: "block" }} className="card-body d-lg-flex align-items-lg-center justify-content-lg-between flex-lg-wrap border mt-2 mb-2">
                                            <div className="row w-100" id="efi-chartzpMovilAgrupado">
                                                {(OpcionesAcumulado != null) && (
                                                    <ReactApexChart
                                                        options={OpcionesAcumulado.options}
                                                        series={OpcionesAcumulado.series} type="bar"
                                                        height={200}
                                                    />)}
                                            </div>
                                        </div>
                                        <div style={{ display: (tabSel != 2) ? "block" : "none", border: '1px solid #5ab55e', borderRadius: '5px' }} className="card" id="efi-chartzpMovil">
                                            <div className="card-body">
                                                <div className="row">
                                                    {(opciones != null) && (
                                                        <ReactApexChart
                                                            options={opciones.options}
                                                            series={opciones.series} type="bar"
                                                            height={320}
                                                        />)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="overflow-auto" style={{ display: (tabSel != 2) ? "block" : "none"}}>


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
                                                    sx: (theme) => ({
                                                        fontSize: 14,
                                                        fontStyle: 'bold',
                                                        color: 'rgb(27, 66, 94)'
                                                    }),
                                                }}
                                                columns={columnasTabla}
                                                data={DateTableMovil}
                                                // editingMode="modal" //default         
                                                // enableTopToolbar={false}
                                                enableColumnOrdering
                                                // enableEditing
                                                /* onEditingRowSave={handleSaveRowEdits}
                                                    onEditingRowCancel={handleCancelRowEdits}*/
                                                muiToolbarAlertBannerProps={
                                                    isError
                                                        ? {
                                                            color: 'error',
                                                            children: 'Error al cargar información',
                                                        }
                                                        : undefined
                                                }
                                                onColumnFiltersChange={setColumnFilters}
                                                onGlobalFilterChange={setGlobalFilter}
                                                onPaginationChange={setPagination}
                                                onSortingChange={setSorting}
                                                rowCount={rowCountMovil}
                                                enableStickyHeader
                                                enableDensityToggle={false}
                                                enablePagination={false}
                                                enableRowVirtualization
                                                defaultColumn={{
                                                    minSize: 150, //allow columns to get smaller than default
                                                    maxSize: 400, //allow columns to get larger than default
                                                    size: 150, //make columns wider by default
                                                }}
                                                muiTableContainerProps={{
                                                    sx: { maxHeight: '400px' }, //give the table a max height
                                                }}
                                                initialState={{ density: 'compact' }}
                                                state={{
                                                    columnFilters,
                                                    globalFilter,
                                                    isLoading,
                                                    pagination,
                                                    showAlertBanner: isError,
                                                    showProgressBars: isRefetching,
                                                    sorting: sorting
                                                }}
                                                renderTopToolbarCustomActions={({ table }) => (
                                                    <Box
                                                        sx={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1, display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                                                    >
                                                        <button style={{ display: (tabSel <= 1) ? "inline-block" : "none" }} className="  btn btn-sm btn-primary" type="button" onClick={() => {
                                                            DescargarExcelPersonalizado(DateTableMovil.map((e: any) => {
                                                                let val = {};
                                                                val['Movil'] = e.Movil
                                                                val['Fecha'] = e.Fecha;
                                                                val['EV0Regeneracion0P'] = (e.EV0Regeneracion0P != 0 ? e.EV0Regeneracion0P / e.Total * 100 : 0).toFixed(2).toString().replace(".", ",")
                                                                val['EV1Potencia0P50'] = (e.EV1Potencia0P50 != 0 ? e.EV1Potencia0P50 / e.Total * 100 : 0).toFixed(2).toString().replace(".", ",")
                                                                val['EV2Potencia50P100'] = (e.EV2Potencia50P100 != 0 ? e.EV2Potencia50P100 / e.Total * 100 : 0).toFixed(2).toString().replace(".", ",")
                                                                val['EV3Potencia100P150'] = (e.EV3Potencia100P150 != 0 ? e.EV3Potencia100P150 / e.Total * 100 : 0).toFixed(2).toString().replace(".", ",")
                                                                val['EV4Potencia150P175'] = (e.EV4Potencia150P175 != 0 ? e.EV4Potencia150P175 / e.Total * 100 : 0).toFixed(2).toString().replace(".", ",")
                                                                val['EV5Potencia175'] = (e.EV5Potencia175 != 0 ? e.EV5Potencia175 / e.Total * 100 : 0).toFixed(2).toString().replace(".", ",")
                                                                val['Operador'] = e.Operador;
                                                                return val;
                                                            }), (tabSel == 0 ? ColumnasTablas[0]['movil'] : ColumnasTablas[1]['operador']), "Reporte ZP", fncReporteOperadorMovil)
                                                        }}>
                                                            <i className="bi-file-earmark-excel"></i></button>

                                                    </Box>
                                                )}
                                            />


                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${tabSel === 0 ? "show active" : ""}`} id="tab0_content" >
                                     
                                    </div>
                                    {/* end::Tab Pane 1 */}

                                    {/* begin::Tab Pane 2 */}
                                    <div className={`tab-pane fade ${tabSel === 1 ? "show active" : ""}`} id="tab1_content">
                                        
                                       
                                    </div>
                                    {/* end::Tab Pane 2 */}
                                    {/* begin::Tab Pane 3 */}
                                    <div className={`tab-pane fade ${tabSel === 2 ? "show active" : ""}`} id="tab2_content">
                                        {/* begin::Cards */}
                                        <div className="overflow-auto">
                                            <div className="" id="solid-operadorgrafica">
                                                <div className="card" style={{ border: '1px solid #5ab55e', borderRadius: '5px' }}>
                                                    <div className="card-body">
                                                        <div className="chart-container">
                                                            <div className="row">
                                                                <div className="col-xs-6 col-sm-6 col-md-6" >
                                                                    <div className="text-center"><label className="label control-label label-sm fw-bolder" style={{ fontSize: '14px' }}>
                                                                        Zonas: 4.Pot [150&lt;P&lt;175]
                                                                    </label></div>
                                                                    {(Totales.length != 0) && (
                                                                    <MaterialReactTable
                                                                        // tableInstanceRef={ColumnasTablas['movil']}
                                                                        displayColumnDefOptions={{
                                                                            'mrt-row-actions': {
                                                                                muiTableHeadCellProps: {
                                                                                    align: 'center',
                                                                                },
                                                                                size: 0,
                                                                            },
                                                                        }}
                                                                        muiTableBodyCellProps={{
                                                                            sx: {
                                                                                border: '0px solid #000',
                                                                            },
                                                                        }}
                                                                        localization={MRT_Localization_ES}
                                                                        columns={ColumnasGraficaZonaOperador}
                                                                        data={Totales}
                                                                        enableColumnOrdering={false}
                                                                        enableColumnActions={false}
                                                                        enableSorting={true}
                                                                        enableFilters={false}
                                                                        manualSorting={false}
                                                                        enableGlobalFilterRankedResults={false}
                                                                        enableDensityToggle={false}
                                                                        enableColumnDragging={false}
                                                                        enablePagination={false}
                                                                        enableHiding={false}
                                                                        enableFullScreenToggle={false}
                                                                        enableSortingRemoval={false}
                                                                        onSortingChange={setSortingG}
                                                                        enableStickyHeader
                                                                        enableRowVirtualization
                                                                        defaultColumn={{
                                                                            minSize: 150, //allow columns to get smaller than default
                                                                            maxSize: 400, //allow columns to get larger than default
                                                                            size: 150, //make columns wider by default
                                                                        }}
                                                                        initialState={{ density: 'compact' }}
                                                                        state={{
                                                                            columnFilters,
                                                                            globalFilter,
                                                                            isLoading,
                                                                            pagination,
                                                                            showAlertBanner: isError,
                                                                            showProgressBars: isRefetching,
                                                                            sorting: sortingG,
                                                                        }}
                                                                    />)}

                                                                </div>
                                                                <div className="col-xs-6 col-sm-6 col-md-6">
                                                                    <div className="text-center"><label className="label control-label label-sm fw-bolder" style={{ fontSize: '14px' }}>Zonas: 5.Pot P[&gt;175]</label></div>
                                                                    {(TotalesV5.length != 0) && (<MaterialReactTable
                                                                        // tableInstanceRef={ColumnasTablas['movil']}
                                                                        muiTableBodyCellProps={{
                                                                            sx: {
                                                                                border: '0px solid #000',
                                                                            }
                                                                        }}
                                                                        displayColumnDefOptions={{
                                                                            'mrt-row-actions': {
                                                                                muiTableHeadCellProps: {
                                                                                    align: 'center'
                                                                                },
                                                                                size: 0,
                                                                            },
                                                                        }}

                                                                        localization={MRT_Localization_ES}
                                                                        columns={ColumnasGraficaZonaOperador}
                                                                        data={TotalesV5}
                                                                        enableColumnOrdering={false}
                                                                        enableColumnActions={false}
                                                                        enableSorting={true}
                                                                        enableFilters={false}
                                                                        manualSorting={false}
                                                                        enableGlobalFilterRankedResults={false}
                                                                        enableDensityToggle={false}
                                                                        enableColumnDragging={false}
                                                                        enablePagination={false}
                                                                        enableHiding={false}
                                                                        enableFullScreenToggle={false}
                                                                        enableSortingRemoval={false}
                                                                        onSortingChange={setSortingf}
                                                                        enableStickyHeader
                                                                        enableRowVirtualization
                                                                        defaultColumn={{
                                                                            minSize: 150, //allow columns to get smaller than default
                                                                            maxSize: 400, //allow columns to get larger than default
                                                                            size: 150, //make columns wider by default
                                                                        }}
                                                                        initialState={{ density: 'compact' }}
                                                                        state={{
                                                                            columnFilters,
                                                                            globalFilter,
                                                                            isLoading,
                                                                            pagination,
                                                                            showAlertBanner: isError,
                                                                            showProgressBars: isRefetching,
                                                                            sorting: sortingf,
                                                                        }}
                                                                    />)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* end::Cards      */}
                                    </div>
                                    {/* end::Tab Pane 3 */}
                                </div>
                                {/* end::Tab Content */}
                            </div>
                        </div>
                    </div>

                </BlockUi>
                <Modal show={showModal} onHide={setShowModal} size="lg"
                 
                >
                    <Modal.Header closeButton>
                        <Modal.Title> Filtro por {TipoReporte[tabSel].tituloFiltro} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                                <SelectFiltroVehiculoOperador />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="button" variant="secondary" onClick={() => {
                            setSeleccionados([]);
                            /*/actualizamos los filtros/ */
                            let tiporeporte = [...TipoReporte];
                            tiporeporte[tabSel].filtros = { ...TipoReporte[tabSel].filtros, Vehiculos: [], Operadores: [] };
                            setTipoReporte(tiporeporte)
                        }}>
                            Limpiar
                        </Button>
                        <Button type="button" variant="primary" onClick={() => { setShowModal(false); }}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
         
            </div>
        </>
    )
}