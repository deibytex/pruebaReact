import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { GetDataSafety, listTabsSafety } from "../../data/ReportesData";
import { PageTitle } from "../../../../../_start/layout/core";
import { DateRangePicker } from "rsuite";
import BlockUi from "@availity/block-ui";
import { DescargarExcel } from "../../../../../_start/helpers/components/DescargarExcel";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { FormatoColombiaDDMMYYY, FormatoColombiaDDMMYYYHHmmss, FormatoSerializacionYYYY_MM_DD_HHmmss } from "../../../../../_start/helpers/Constants";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import DualListBox from "react-dual-listbox";
import { dualList } from "../../../CorreosTx/models/dataModels";
import { Button, Form, Modal, ProgressBar } from "react-bootstrap-v5";
import ReactApexChart from "react-apexcharts";
import { FiltrosReportes } from "../../models/eBus";
import { ClienteDTO } from "../../models/NivelcargaModels";
import { AxiosResponse } from "axios";
import { GetClientesEsomos } from "../../data/NivelCarga";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { InicioCliente } from "../../../../../_start/helpers/Models/ClienteDTO";
import { locateFormatNumberNDijitos } from "../../../../../_start/helpers/Helper";
import { Box } from "@mui/material";
import { DrawDynamicIconMuiMaterial } from "../../../../../_start/helpers/components/IconsMuiDynamic";
import { rootCertificates } from "tls";
import { array } from "yup";
export default function ReporteSafety() {

    let filtrosBase: FiltrosReportes = {
        FechaInicialInicial: moment().add(-180, 'days').startOf('day').toDate(),
        FechaFinalInicial: moment().startOf('day').toDate(),
        FechaInicial: moment().startOf('day').add(-180, 'days').toDate(),
        FechaFinal: moment().startOf('day').toDate(),
        IndGrafica: -1,
        FechaGrafica: "",
        Vehiculos: [],
        Operadores: [],
        limitdate: 180
    }

    const FechaInicialDiario = moment().add(-7, 'days').startOf('day').toDate();

    let getListadoCampoPorTipo = (EsDetallado: boolean, EsDiario: boolean) => {
        let listadoCamposOperador: MRT_ColumnDef<any>[] =
            [
                {
                    accessorKey: 'operador',
                    header: 'Operador',
                    size: 100
                },
                {
                    accessorKey: `${EsDiario ? 'Fecha' : 'mes'}`,
                    header: `${EsDiario ? 'Fecha' : 'Mes'}`,
                    Cell({ cell, column, row, table, }) {
                        let value = row.original[`${EsDiario ? 'Fecha' : 'mes'}`];
                        return ((EsDiario ? moment(value).format(FormatoColombiaDDMMYYY) : value))
                    }
                },
                {
                    accessorKey: 'distancia',
                    header: 'Distancia [km]',
                    Cell({ cell, column, row, table, }) {
                        return (locateFormatNumberNDijitos(row.original.distancia ?? 0, 2))
                    }
                },
                {
                    accessorKey: 'Score',
                    header: 'Score',
                    Cell({ cell, column, row, table, }) {
                        return (locateFormatNumberNDijitos(isNaN(row.original.Score) ? 0 : row.original.distancia ?? 0, 2))
                    },
                    muiTableBodyCellProps: ({
                        cell
                    }) => ({
                        sx: {
                            backgroundColor: cell.getValue<number>() <= 2 ? 'rgba(104, 176, 120, 0.5)' :
                                cell.getValue<number>() > 2 && cell.getValue<number>() < 5 ? 'rgba(215, 148, 46, 0.5)' :
                                    'rgba(242, 107, 91, 0.5)'
                        }
                    })
                },
                {
                    accessorKey: 'scoreVel50',
                    header: 'ScoreVel > 50',
                    Cell({ cell, column, row, table, }) {
                        return (getIcon(isNaN(row.original.scoreVel50) ? 0 : row.original.scoreVel50))
                    }
                },
                {
                    accessorKey: 'scoreVel30',
                    header: 'ScoreVel > 30',
                    Cell({ cell, column, row, table, }) {
                        return (getIcon(isNaN(row.original.scoreVel30) ? 0 : row.original.scoreVel30))
                    }
                },
                {
                    accessorKey: 'scoreFB',
                    header: 'ScoreFB > 10',
                    Cell({ cell, column, row, table, }) {
                        return (getIcon(isNaN(row.original.scoreFB) ? 0 : row.original.scoreFB))
                    }
                },
                {
                    accessorKey: 'scoreAB',
                    header: 'ScoreAB > 8',
                    Cell({ cell, column, row, table, }) {
                        return (getIcon(isNaN(row.original.scoreAB) ? 0 : row.original.scoreAB))
                    }
                },
                {
                    accessorKey: 'scoreGB',
                    header: 'ScoreGB > 0,3',
                    Cell({ cell, column, row, table, }) {
                        return (getIcon(isNaN(row.original.scoreGB) ? 0 : row.original.scoreGB))
                    }
                }

            ];

        let listadoCamposDetallado: MRT_ColumnDef<any>[] =
            [
                {
                    accessorKey: 'operador',
                    header: 'Operador'
                },
                {
                    accessorKey: 'Movil',
                    header: 'Movil'
                },
                {
                    accessorKey: 'Evento',
                    header: 'Evento'
                },
                {
                    accessorKey: 'Fecha',
                    header: 'Inicio',
                    Cell({ cell, column, row, table, }) {
                        return (moment(row.original.Fecha).format(FormatoColombiaDDMMYYYHHmmss))
                    }
                },
                {
                    accessorKey: 'Duracion',
                    header: 'Duracion'
                },
                {
                    accessorKey: 'ValorMax',
                    header: 'Valor Max',
                    Cell({ cell, column, row, table, }) {
                        return (locateFormatNumberNDijitos(row.original.ValorMax ?? 0, 2))
                    }
                }
            ];

        return EsDetallado ? listadoCamposDetallado : listadoCamposOperador;
    }

    const TipoReporteBase = [
        {
            reporte: "Operador Mensual", columnas: getListadoCampoPorTipo(false, false),
            filtros: { ...filtrosBase, MaxDay: 31 }, tipo: 1, Data: [], consultar: true
        },
        {
            reporte: "Operador Diario", columnas: getListadoCampoPorTipo(false, true), filtros: {
                ...filtrosBase, MaxDay: 7,
                FechaInicialInicial: FechaInicialDiario,
                FechaInicial: FechaInicialDiario
            }, tipo: 2, Data: [], consultar: true
        },
        {
            reporte: "Operador Detallado", columnas: getListadoCampoPorTipo(true, true), filtros: {
                ...filtrosBase, MaxDay: 7,
                FechaInicialInicial: FechaInicialDiario,
                FechaInicial: FechaInicialDiario
            }, tipo: 2, Data: [], consultar: true, EsDetallado: true
        }
    ]

    const [TipoReporte, setTipoReporte] = useState(TipoReporteBase);
    const [tabSel, settabSel] = useState<number>(0);
    const [lstIndicadores, setListIndicadores] = useState<any>({
        "Cond Rojo": 0,
        "Cond Ambar": 0,
        "Cond Verde": 0,
        "Calificación Total": 0,
    });
    const { allowedMaxDays, allowedRange, combine } = DateRangePicker;

    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);


    const [Clientes, setClientes] = useState<ClienteDTO[]>();
    const [loader, setloader] = useState<boolean>(false);
    const [labelsAxisx, setlabelsAxisx] = useState<string[]>([]);
    const [idxSeleccionado, setidxSeleccionado] = useState<number>(-2);
    const [isCallData, setisCallData] = useState<boolean>(false);
    const [opciones, setOpciones] = useState<any>(null);
    const [OpcionesAcumulado, setAcumulado] = useState<any>(null);

    const [columnas, setcolumnas] = useState<any[]>([]);
    const [dataFiltrada, setDataFiltrada] = useState<any[]>([]);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [showModalEventos, setShowModalEventos] = useState<boolean>(false);
    const [lstOperadores, setlstOperadores] = useState<dualList[]>([]);
    const [lstEventos, setlstEventos] = useState<dualList[]>([]);
    const [lstSeleccionados, setSeleccionados] = useState<string[]>([]);
    const [lstEventosSeleccionados, setEventosSeleccionados] = useState<string[]>([]);
    //////////////// TABLE STATE


    const [TotalesAC, setTotalesAC] = useState<any[]>([]);
    const [TotalesFB, setTotalesFB] = useState<any[]>([]);
    const [TotalesGB, setTotalesGB] = useState<any[]>([]);
    const [TotalesCD, setTotalesCD] = useState<any[]>([]);
    const [TotalesVel30, setTotalesVel30] = useState<any[]>([]);
    const [TotalesVel50, setTotalesVel50] = useState<any[]>([]);

    const [maxValueAC, setmaxValueAC] = useState<number>(0);
    const [maxValueFB, setmaxValueFB] = useState<number>(0);
    const [maxValueGB, setmaxValueGB] = useState<number>(0);
    const [maxValueCD, setmaxValueCD] = useState<number>(0);
    const [maxValueVel30, setmaxValueVel30] = useState<number>(0);
    const [maxValueVel50, setmaxValueVel50] = useState<number>(0);

    //table state
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const [rowCount, setRowCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [isError, setIsError] = useState(false);

    let ColumnasTablasVerticales: MRT_ColumnDef<any>[] = [{
        accessorKey: 'operador',
        header: 'Operador',
        Cell: ({ cell, column, row, table }) => {
            return <span className="fw-bolder" style={{ fontSize: '10px' }}>{row.original.operador}</span>
        }
    }, {
        accessorKey: 'total',
        header: 'Total',
        size: 200,
        maxSize: 200,
        minSize: 200,
        Cell: ({ cell, column, row, table }) => {
            return <span title={`${row.original.operador.toString()} : ${row.original.total}`}>
                <ProgressBar 
                    variant={row.original.Id == 'EC: Aceleracion Brusca > 8 km/h/s' ? 'indigo' : 
                    row.original.Id == 'EC: Exceso Velocidad > 50 km/h' ? 'yellow' : 
                    row.original.Id == 'EC: Frenada Brusca > 10 km/h/s' ? 'pink' : 
                    row.original.Id == 'EC: Giro Brusco > 0,3 G' ? 'orange' : 
                    row.original.Id == 'EC: Exceso Velocidad > 30 km/h' ? 'cyan' : 
                    'teal'}
                    now={row.original.total} 
                    label={`${row.original.total}`} 
                    min={0} 
                    max={
                        row.original.Id == 'EC: Aceleracion Brusca > 8 km/h/s' ? maxValueAC : 
                         row.original.Id == 'EC: Exceso Velocidad > 50 km/h' ? maxValueVel50 : 
                         row.original.Id == 'EC: Frenada Brusca > 10 km/h/s' ? maxValueFB : 
                         row.original.Id == 'EC: Giro Brusco > 0,3 G' ? maxValueGB : 
                         row.original.Id == 'EC: Exceso Velocidad > 30 km/h' ? maxValueVel30 : 
                        maxValueCD
                        } 
                    style={{width:'150px'}}/>
            </span>
        }
    }];

    ///////////// FIN TABLE STATE

    // listado de campos a extraer
    useEffect(
        () => {
            setIsLoading(true);
            GetClientesEsomos().then((response: AxiosResponse<any>) => {
                setClientes(response.data);
                setClienteSeleccionado(response.data[0])
                setIsLoading(false);
            }).catch((error) => {
                console.log(error);
                errorDialog("<i>Eror al consultar los clientes</i>", "")
            })
            return () => {
                setTipoReporte(TipoReporteBase)
            }
        }, []
    )

    // useefet que se ejecuta la primera vez, cuando el cliente es seleccionado 
    useEffect(() => {

        // consulta la informacion de las alarmas cuando 
        // cambia el ciente seleecionado y las fechas 
        if (ClienteSeleccionado.clienteIdS != 0)
            ConsultarData();

        // configuramos el chart

        // WARNING --  HAY QUE TENER PRESENTE QUE LOS USESTATE
        // DENTRO DE LOS EVENTOS DE LA GRAFICA NO USA EL ESTADO ACTUAL SINO EL ESTADO
        // AL MOMENTO DE SER CREADO, SE DEBEN USAR LOS SETUSETATE Y LOS CLICK EVENTS 
        // PARA QUE USE LOS USESTATE CON LA INFORMACIONF REAL

        let defaultoOpcionesAcumulado = {
            options: {
                chart: {
                    id: 'detalladoAgrupado',
                    fontFamily: 'Montserrat',
                    events: {
                        dataPointSelection: function (event: any, chartContext: any, config: any) {
                            // seleccionamos el index de la grafica para posteriormente filtrar
                            setidxSeleccionado(config.dataPointIndex);

                        }
                    }
                },
                tooltip: {
                    shared: true,
                    intersect: false
                },
                xaxis: {
                    categories: []
                },
                yaxis: [{
                    showAlways: true,
                    tickAmount: 5,
                    min: 0,
                    labels: {
                        formatter: function (val: number, index: any) {
                            return val.toFixed(0);
                        }
                    },
                    title: {
                        text: "Eventos"
                    }
                }
                // ,
                // {
                //     min: 0,
                //     max: 1,
                //     opposite: true,
                //     show: false, 
                //     labels: {
                //         formatter: function (val: number, index: any) {
                //             return val.toFixed(0);
                //         }
                //     }
                // }
                ],
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: true,
                    style: {
                        colors: ['#7E8299']
                      }
                }
            },
            series: []
        };

        let defaultopciones = {
            options: {
                chart: {
                    id: 'totalScore',
                    events: {
                        dataPointSelection: function (event: any, chartContext: any, config: any) {
                            // seleccionamos el index de la grafica para posteriormente filtrar
                            setidxSeleccionado(config.dataPointIndex);
                        }
                    }
                },
                xaxis: {
                    categories: []
                },
                yaxis: [{
                    showAlways: true,
                    tickAmount: 5,
                    min: 0,
                    labels: {
                        formatter: function (val: number, index: any) {
                            return locateFormatNumberNDijitos(val, 1);
                        }
                    },
                    title: {
                        text: "Score"
                    }
                }],
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: true,
                    formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {
                        return locateFormatNumberNDijitos(value, 1)
                    },

                },
                plotOptions: {
                    bar: {
                        colors: {
                            ranges: [{
                                from: 0,
                                to: 2,
                                color: '#64B178'
                            }, {
                                from: 2,
                                to: 5,
                                color: '#D7962E'
                            }, {
                                from: 5,
                                to: 100,
                                color: '#F26E5F'
                            }]
                        }
                    }
                }
            },
            series: []
        }

        // asingamos las opciones
        setOpciones(defaultopciones);
        setAcumulado(defaultoOpcionesAcumulado);

    }, [ClienteSeleccionado]);


    useEffect(() => {
        // VALIDAMOS EL INDEX SELECCIONADO

        if (idxSeleccionado !== -2) // lo hacemos para que no dispare varias veces el llamado de la base de datos la primera vez que se carga
        {
            let Tiporeporte = [...TipoReporte];
            TipoReporte[tabSel].filtros.IndGrafica = idxSeleccionado;
            TipoReporte[tabSel].filtros.FechaGrafica = labelsAxisx[idxSeleccionado];
            setTipoReporte(Tiporeporte)
        }

    }, [idxSeleccionado])


    useEffect(() => {
        if (ClienteSeleccionado.clienteIdS != 0)
            ConsultarData();
    }, [tabSel, TipoReporte])

    //retorna el color del icono de las tablas
    const getIcon = (Data: any) => {
        return <span>
            <i className="bi bi-circle-fill" style={{ color: `${Data <= 2 ? '#64B178' : Data > 2 && Data <= 5 ? '#D7962E' : '#F26E5F'}` }}> </i>
            {(locateFormatNumberNDijitos(Data ?? 0, 2))}
        </span>;
    };

    // metodo qeu consulta los datos de las alarmasg
    let ConsultarData = () => {

        if (TipoReporte[tabSel].consultar || isCallData) {
            setIsError(false)
            setIsLoading(true)
            setIsRefetching(true)
            setloader(true)
            GetDataSafety(moment(TipoReporte[tabSel].filtros.FechaInicial).format(FormatoSerializacionYYYY_MM_DD_HHmmss)
                , moment(TipoReporte[tabSel].filtros.FechaFinal).format(FormatoSerializacionYYYY_MM_DD_HHmmss), ClienteSeleccionado.clienteIdS,
                tabSel
            ).then((response) => {
                //asignamos la informcion consultada 
                let Tiporeporte = [...TipoReporte];
                Tiporeporte[tabSel].Data = response.data;
                Tiporeporte[tabSel].consultar = false;
                setisCallData(false);
                setTipoReporte(Tiporeporte);
                // vamos a llenar la informacion de los Operadores
                let lstOperadores = (response.data as any[]).reduce((p, c) => {
                    let operador = c["operador"];
                    let isExists = p.filter((f: any) => f["value"] === operador);
                    if (isExists.length == 0)
                        p.push({ "value": operador, "label": operador })
                    return p;
                }, []);

                 // listados de operadores de los datos que traemos
                 setlstOperadores(lstOperadores);

                if (tabSel == 2) {
                     // vamos a llenar la informacion de los Eventos
                    let lstEventos = (response.data as any[]).reduce((p, c) => {
                    let evento = c["Evento"];
                    let isExists = p.filter((f: any) => f["value"] === evento);
                    if (isExists.length == 0)
                        p.push({ "value": evento, "label": evento })
                    return p;
                }, []);

                // listados de eventos de los datos que traemos
                setlstEventos(lstEventos);
                };      

                // datos filtrados que al principio son los mismos extraidos
                datosfiltrados(response.data)
                setidxSeleccionado(-1)
                // quitamos los loaders despues de cargado
                setIsLoading(false)
                setIsRefetching(false)
                setRowCount(response.data.length)
                setloader(false)
            }).catch((e) => {
                console.log(e);
                setIsError(true);
                setloader(false);
                setIsLoading(false)
                setIsRefetching(false)
            }).finally(() => {
                setloader(false);
            });
        }
        else
            datosfiltrados(TipoReporte[tabSel].Data)
    }

    // FILTRA LOS DATOS QUE SE CONSULTAN DE LA BASE DE DATOS
    // SI EXISTE SE PASA LOS DATOS ALMACENADOS EN EL SISTEMA
    let datosfiltrados = (datos: any[]) => {
        let filtros = TipoReporte[tabSel].filtros;
        let EsDiario = (TipoReporte[tabSel].tipo == 2);
        let EsDetallado = (TipoReporte[tabSel].EsDetallado);
        let fechaGraficaActual = filtros.FechaGrafica;
        let FechaInicial: Date = filtros.FechaInicial;
        let FechaFinal: Date = filtros.FechaFinal;

        let datosFiltrados: any[] = datos;

        if (filtros.IndGrafica != -1) {
            let fecha = filtros.FechaGrafica
            if (!EsDiario) {
                let mensual: string[] = filtros.FechaGrafica?.split('-') ?? ['2023', '01'];
                fecha = `01/${mensual[1].padStart(2, '0')}/${mensual[0]}`;
            }
            FechaInicial = moment(fecha, FormatoColombiaDDMMYYY).toDate();
            FechaFinal = EsDetallado ? moment(fecha, FormatoColombiaDDMMYYY).add(1, 'days').toDate() :
                moment(fecha, FormatoColombiaDDMMYYY).toDate();
        }

        // filtramos por las fechas
        datosFiltrados = datosFiltrados.filter(f =>
            (EsDiario ? moment(f.Fecha).toDate() : moment(`01/${f.mes.toString().padStart(2, '0')}/${f.anio.toString()}`
                , FormatoColombiaDDMMYYY).toDate()) >= FechaInicial
            && (EsDiario ? moment(f.Fecha).toDate() : moment(`01/${f.mes.toString().padStart(2, '0')}/${f.anio.toString()}`
                , FormatoColombiaDDMMYYY).toDate()) <= FechaFinal);

        // filtramos por los Operadores
        if ((filtros.Operadores as string[]).length > 0) {
            datosFiltrados = datosFiltrados.filter(f => (filtros.Operadores as string[]).indexOf(f["operador"]) > -1);
        }

        // filtramos por los Operadores
        if ((filtros.Vehiculos as string[]).length > 0) {
            datosFiltrados = datosFiltrados.filter(f => (filtros.Vehiculos as string[]).indexOf(f["Evento"]) > -1);
        }

        setcolumnas(TipoReporte[tabSel].columnas);
        setDataFiltrada(datosFiltrados);
        setRowCount(datosFiltrados.length); // actualizamos la informacion de las filas
        // agrupa los elementos para ser mostrado por la grafica

        // agrupamos por fechas la informacion
        let agrupadofecha = datosFiltrados
            .reduce((p, c) => {
                let name = EsDiario ? moment(c.Fecha).format(FormatoColombiaDDMMYYY) : `${c.anio}-${c.mes}`;
                p[name] = p[name] ?? [];
                p[name].push(c);
                return p;
            }, {});

        // agrupa los elementos para ser mostrado por la grafica
        let totalScoreA = new Array();

        let labels = new Array();
        let sumScores = 0;
        let SumDistancia = 0;


        Object.entries(agrupadofecha).map((elem: any) => {

            labels.push(elem[0]);
            // totalizamos por propiedad que se necesite

            let totalVel50 = (elem[1].map((m: any) => { return m.vel50duration }).reduce((a: number, b: number) => a + b, 0));

            let totalVel30 = (elem[1].map((m: any) => { return m.vel30duration }).reduce((a: number, b: number) => a + b, 0));

            let totalOcurrsFB = (elem[1].map((m: any) => { return m.FBOccurrences }).reduce((a: number, b: number) => a + b, 0));

            let totalOcurrsAB = (elem[1].map((m: any) => { return m.ABOccurrences }).reduce((a: number, b: number) => a + b, 0));

            let totalOcurrsGB = (elem[1].map((m: any) => { return m.GBOccurrences }).reduce((a: number, b: number) => a + b, 0));

            let totaDistancia = (elem[1].map((m: any) => { return m.distancia }).reduce((a: number, b: number) => a + b, 0));

            // sumamos los indicadores por fecha 
            let scorevel50 = totalVel50 / totaDistancia * 10;
            let scorevel30 = totalVel30 / totaDistancia * 10;
            let scoreFB = totalOcurrsFB / totaDistancia * 100;
            let scoreAB = totalOcurrsAB / totaDistancia * 100;
            let scoreGB = totalOcurrsGB / totaDistancia * 100;

            // sumamos los indicadores por fecha 

            let totalScoresR = scorevel50 + scorevel30 + scoreFB + scoreAB + scoreGB;
            // para la grafica de eficiencia
            totalScoreA.push(totalScoresR);
            let ScoresMul = totalScoresR * totaDistancia;

            sumScores += ScoresMul;
            SumDistancia += totaDistancia;
        });

        let scoretotal = sumScores / SumDistancia;

        //AGRUPAMOS VALORES EVENTOS TOTALES POR EVENTO - OPERADOR
        let agrupadoOperadormensual = datosFiltrados
            .reduce((p, c) => {
                let name = c.operador;
                let isExists = p.filter(function (arr: any) {
                    return (arr.operador == name)
                });

                if (isExists.length == 0) {
                    let objetoevento = { operador: name, original: [c], totalPorOperador: [] };
                    p.push(objetoevento);
                }
                else {
                    let objeto = isExists[0];
                    objeto.original.push(c);
                }
                return p;
            }, []);// contenemos la informacion en un array de datos agrupados

        //ORDENAMOS POR CANTIDAD
        agrupadoOperadormensual.forEach((e: { totalPorOperador: any; original: any[]; }) => {
            e.totalPorOperador = e.original.reduce((p1, c1) => {
                let operador = c1.operador;

                let isExistsOperador = p1.filter(function (arr: any) {
                    return (arr.operador == operador)
                });
                if (isExistsOperador.length == 0) {
                    let objetoOperador = {
                        operador: operador
                        , mes: 1
                        , distancia: c1.distancia
                        , frenadas: c1.FBOccurrences
                        , aceleraciones: c1.ABOccurrences
                        , giros: c1.GBOccurrences
                        , velocidad30: c1.vel30duration
                        , velocidad50: c1.vel50duration
                        , scoreFB: c1.FBOccurrences / c1.distancia * 100
                        , scoreAB: c1.ABOccurrences / c1.distancia * 100
                        , scoreGB: c1.GBOccurrences / c1.distancia * 100
                        , scoreVel30: c1.vel30duration / c1.distancia * 10
                        , scoreVel50: c1.vel50duration / c1.distancia * 10
                    };
                    let objetoOperadorScore = {
                        ...objetoOperador,
                        Score: objetoOperador.scoreFB + objetoOperador.scoreAB + objetoOperador.scoreGB + objetoOperador.scoreVel30 + objetoOperador.scoreVel50
                    }

                    p1.push(objetoOperadorScore);
                } else {
                    let rowOperador = isExistsOperador[0];
                    rowOperador.mes = 1;
                    rowOperador.distancia += c1.distancia;
                    rowOperador.frenadas += c1.FBOccurrences;
                    rowOperador.aceleraciones += c1.ABOccurrences;
                    rowOperador.giros += c1.GBOccurrences;
                    rowOperador.velocidad30 += c1.vel30duration;
                    rowOperador.velocidad50 += c1.vel50duration;
                    rowOperador.scoreFB = rowOperador.frenadas / rowOperador.distancia * 100;
                    rowOperador.scoreAB = rowOperador.aceleraciones / rowOperador.distancia * 100;
                    rowOperador.scoreGB = rowOperador.giros / rowOperador.distancia * 100;
                    rowOperador.scoreVel30 = rowOperador.velocidad30 / rowOperador.distancia * 10;
                    rowOperador.scoreVel50 = rowOperador.velocidad50 / rowOperador.distancia * 10;
                    rowOperador.Score = rowOperador.scoreFB + rowOperador.scoreAB + rowOperador.scoreGB + rowOperador.scoreVel30 + rowOperador.scoreVel50

                }
                return p1;
            }, []);
        });

        let verde = 0;
        let ambar = 0;
        let rojo = 0;

        let agrupadoMensualTabla = new Array();

        Object.entries(agrupadoOperadormensual).map((elem: any) => {
            let objetofinal = (elem[1].totalPorOperador.map((m: any) => { return m }));
            let score = (elem[1].totalPorOperador.map((m: any) => { return m.Score }));
            agrupadoMensualTabla.push(objetofinal[0]);

            score <= 2 ? verde += 1 : score > 2 && score <= 5 ? ambar += 1 : rojo += 1;
        });

        setListIndicadores({
            "Cond Rojo": rojo,
            "Cond Ambar": ambar,
            "Cond Verde": verde,
            "Calificación Total": locateFormatNumberNDijitos(scoretotal, 2),
        });

        !EsDiario ? setDataFiltrada(agrupadoMensualTabla) : setDataFiltrada(datosFiltrados);

        setlabelsAxisx(labels);

        // se debe volver actualizar los eventos pues 'estos no
        // se reflejan los usestate y utilizan los datos que tienen las variables
        // al momento de crearse

        ApexCharts.exec('totalScore', 'updateOptions', {
            chart: {
                events: {
                    dataPointSelection: (event: any, chartContext: any, config: any) => {
                        // seleccionamos el index de la grafica para posteriormente filtrar
                        let labelSeleccionado = labels[config.dataPointIndex];
                        // si la informacion del label seleccionado es igual al label que se encuentra en los filtros
                        // asginamos  -1 y limpiamos la grafica para que muestre todos los datos

                        setidxSeleccionado((labelSeleccionado === fechaGraficaActual) ? -1 : config.dataPointIndex);
                    }
                }
            },
            xaxis: {
                categories: labels
            },
            // plotOptions: {
            //     bar: {
            //       colors: {
            //         ranges: [{
            //           from: 0,
            //           to: 2,
            //           color: '#64B178'
            //         }, {
            //           from: 2,
            //           to: 5,
            //           color: '#D7962E'
            //         }, {
            //             from: 5,
            //             to: 100,
            //             color: '#F26E5F'
            //         }]
            //       }
            //     }
            // }
        });
        // funcion que actualiza los datos de las series
        // se debe pasar el id configurado al momento de su creaci'on para poder
        // actializar los datos

        ApexCharts.exec('totalScore', 'updateSeries', [
            {
                name: 'Score',
                data: totalScoreA,
                type: 'bar'
            }
        ]);


        //Validamos si son las graficas de detallado
        if (EsDetallado) {

            // agrupamos los datos para la grafica
            let agrupadofechadetalle = datosFiltrados
                .reduce((p, c) => {
                    let name = moment(c.Fecha).format(FormatoColombiaDDMMYYY);
                    p[name] = p[name] ?? [];
                    p[name].push(c);
                    return p;
                }, {});

            // agrupa los elementos para ser mostrado por la grafica
            let Ev0 = new Array();
            let Ev1 = new Array();
            let Ev2 = new Array();
            let Ev3 = new Array();
            let Ev4 = new Array();
            let Ev5 = new Array();

            let labelsdetallado = new Array();

            //totalizamos por propiedad
            Object.entries(agrupadofechadetalle).map((elem: any) => {
                labelsdetallado.push(elem[0]);
                // totalizamos por propiedad que se necesite
                let EV0Aceleracion0P = (elem[1].map((m: any) => { if (m.Evento == 'EC: Aceleracion Brusca > 8 km/h/s') return 1; else return 0 }).reduce((a: number, b: number) => a + b, 0));
                let EV1Velocidad50OP = (elem[1].map((m: any) => { if (m.Evento == 'EC: Exceso Velocidad > 50 km/h') return 1; else return 0 }).reduce((a: number, b: number) => a + b, 0));
                let EV2FrenadaOP = (elem[1].map((m: any) => { if (m.Evento == 'EC: Frenada Brusca > 10 km/h/s') return 1; else return 0 }).reduce((a: number, b: number) => a + b, 0));
                let EV3GiroOP = (elem[1].map((m: any) => { if (m.Evento == 'EC: Giro Brusco > 0,3 G') return 1; else return 0 }).reduce((a: number, b: number) => a + b, 0));
                let EV1Velocidad30OP = (elem[1].map((m: any) => { if (m.Evento == 'EC: Exceso Velocidad > 30 km/h') return 1; else return 0 }).reduce((a: number, b: number) => a + b, 0));
                let EV5CinturonOP = (elem[1].map((m: any) => { if (m.Evento == 'EC: Cinturón Desabrochado') return 1; else return 0 }).reduce((a: number, b: number) => a + b, 0));

                // sumamos los indicadores por fecha
                Ev0.push(EV0Aceleracion0P);
                Ev1.push(EV1Velocidad50OP);
                Ev2.push(EV2FrenadaOP);
                Ev3.push(EV3GiroOP);
                Ev4.push(EV1Velocidad30OP);
                Ev5.push(EV5CinturonOP);
            });

            setlabelsAxisx(labelsdetallado);

            ApexCharts.exec('detalladoAgrupado', 'updateOptions', {
                chart: {
                    events: {
                        dataPointSelection: (event: any, chartContext: any, config: any) => {
                            // seleccionamos el index de la grafica para posteriormente filtrar
                            let labelSeleccionado = labelsdetallado[config.dataPointIndex];
                            // si la informacion del label seleccionado es igual al label que se encuentra en los filtros
                            // asginamos  -1 y limpiamos la grafica para que muestre todos los datos
                            setidxSeleccionado((labelSeleccionado === fechaGraficaActual) ? -1 : config.dataPointIndex);
                        }
                    }
                },
                xaxis: {
                    categories: labelsdetallado
                }
            });

            ApexCharts.exec('detalladoAgrupado', 'updateSeries', [
                {
                    name: 'EC: Aceleracion Brusca > 8 km/h/s',
                    data: Ev0,
                    // type: 'bar',
                    color: '#6610f2'
                }, {
                    name: 'EC: Exceso Velocidad > 50 km/h',
                    data: Ev1,
                    // type: 'bar',
                    color: '#ffc107'
                }, {
                    name: 'EC: Frenada Brusca > 10 km/h/s',
                    data: Ev2,
                    // type: 'bar',
                    color: '#d63384'
                }, {
                    name: 'EC: Giro Brusco > 0,3 G',
                    data: Ev3,
                    // type: 'bar',
                    color: '#fd7e14'
                }, {
                    name: 'EC: Exceso Velocidad > 30 km/h',
                    data: Ev4,
                    // type: 'bar',
                    color: '#0dcaf0'
                }, {
                    name: 'EC: Cinturón Desabrochado',
                    data: Ev5,
                    // type: 'bar',
                    color: '#20c997'
                }]);

            //AGRUPAMOS VALORES EVENTOS TOTALES POR EVENTO - OPERADOR
            let agrupadoOperador = datosFiltrados
                .reduce((p, c) => {
                    let name = c.Evento;
                    let isExists = p.filter((f: any) => f.evento == name);

                    if (isExists.length == 0) {
                        let objetoevento = { evento: name, original: [c], totalPorOperador: [] };
                        p.push(objetoevento);
                    }
                    else {
                        let objeto = isExists[0];
                        objeto.original.push(c);
                    }
                    return p;
                }, []);// contenemos la informacion en un array de datos agrupados

            agrupadoOperador.forEach((e: any) => {
                e.totalPorOperador = e.original.reduce((p1: any, c1: any) => {
                    let operador = c1.operador;

                    let isExistsOperador = p1.filter((f: any) => f.operador == operador);
                    if (isExistsOperador.length == 0) {
                        let objetoOperador = { Id: e.evento, operador: operador, total: 1 };
                        p1.push(objetoOperador);
                    } else {
                        let rowOperador = isExistsOperador[0];
                        rowOperador.total++;
                    }

                    return p1;

                }, []);

                e.totalPorOperador = e.totalPorOperador.sort((a: any, b: any) => {
                    return b.total - a.total;
                });

            });

            // agrupa los elementos para ser mostrado por la grafica
            let TotalAC = new Array();
            let TotalVEL50 = new Array();
            let TotalFB = new Array();
            let TotalGB = new Array();
            let TotalVEL30 = new Array();
            let TotalCD = new Array();

            Object.entries(agrupadoOperador).map((elem: any) => {

                // totalizamos por propiedad que se necesite
                //aginamos labels y cantidad por tipo de evento

                elem[1].evento == 'EC: Exceso Velocidad > 50 km/h' ? TotalVEL50.push(elem[1].totalPorOperador) :
                    elem[1].evento == 'EC: Aceleracion Brusca > 8 km/h/s' ? TotalAC.push(elem[1].totalPorOperador) :
                        elem[1].evento == 'EC: Frenada Brusca > 10 km/h/s' ? TotalFB.push(elem[1].totalPorOperador) :
                            elem[1].evento == 'EC: Giro Brusco > 0,3 G' ? TotalGB.push(elem[1].totalPorOperador) :
                                elem[1].evento == 'EC: Exceso Velocidad > 30 km/h' ? TotalVEL30.push(elem[1].totalPorOperador) :
                                    TotalCD.push(elem[1].totalPorOperador)
            });

            setTotalesAC(TotalAC[0] == undefined ? [] : TotalAC[0]);
            setTotalesCD(TotalCD[0] == undefined ? [] : TotalCD[0]);
            setTotalesFB(TotalFB[0] == undefined ? [] : TotalFB[0]);
            setTotalesGB(TotalGB[0] == undefined ? [] : TotalGB[0]);
            setTotalesVel50(TotalVEL50[0] == undefined ? [] : TotalVEL50[0]);
            setTotalesVel30(TotalVEL30[0] == undefined ? [] : TotalVEL30[0]);
        };        
    };

    useEffect(() => {
        if (TotalesAC.length > 0) setmaxValueAC(TotalesAC[0].total);
        if (TotalesCD.length > 0) setmaxValueCD(TotalesCD[0].total);
        if (TotalesFB.length > 0) setmaxValueFB(TotalesFB[0].total);
        if (TotalesGB.length > 0) setmaxValueGB(TotalesGB[0].total);
        if (TotalesVel50.length > 0) setmaxValueVel50(TotalesVel50[0].total);
        if (TotalesVel30.length > 0) setmaxValueVel30(TotalesVel30[0].total);
    }, [TotalesAC, TotalesCD, TotalesFB, TotalesGB, TotalesVel50, TotalesVel30])
    
    // VERIFICA QUE SE DEBA CONSULTAR NUEVAMENTE LA INFORMACION EN LA BASE DE DATOS

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

        // cuando hay una consulta por fechas se debe quitar el filtro por gráfica para que pueda
        // visualizar correctamente la información
        filtros = { ...Tiporeporte[tabSel].filtros, FechaInicial, FechaFinal, FechaInicialInicial, FechaFinalInicial, IndGrafica: -1, FechaGrafica: "" }
        Tiporeporte[tabSel].filtros = filtros;
        setTipoReporte(Tiporeporte)
    }

    // seleccion de Operadores
    function SelectOperadores() {
        return (
            <DualListBox className=" mb-3 " canFilter
                options={lstOperadores}
                selected={lstSeleccionados}
                onChange={(selected: any) => {
                    // dejamos los seleccionados
                    setSeleccionados(selected)
                    // modificacion de filtros
                    let tiporeporte = [...TipoReporte];
                    tiporeporte[tabSel].filtros = { ...TipoReporte[0].filtros, Operadores: selected };
                    setTipoReporte(tiporeporte)
                }}
            />
        );
    }

    // seleccion de Eventos
    function SelectEventos() {
        return (
            <DualListBox className=" mb-3 " canFilter
                options={lstEventos}
                selected={lstEventosSeleccionados}
                onChange={(selected: any) => {
                    // dejamos los seleccionados
                    setEventosSeleccionados(selected)
                    // modificacion de filtros
                    let tiporeporte = [...TipoReporte];
                    tiporeporte[tabSel].filtros = { ...TipoReporte[0].filtros, Vehiculos: selected };
                    setTipoReporte(tiporeporte)
                }}
            />
        );
    }

    function CargaListadoClientes() {
        return (
            <Form.Select className=" mb-3 " onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                let lstClientes = Clientes?.filter((value: any, index: any) => {
                    return value.clienteIdS === Number.parseInt(e.currentTarget.value)
                })
                if (lstClientes !== undefined && lstClientes.length > 0)
                    setClienteSeleccionado(lstClientes[0]);
            }} aria-label="Default select example" defaultValue={ClienteSeleccionado?.clienteIdS}>
                {
                    Clientes?.map((element: any, i: any) => {
                        return (<option key={element.clienteIdS} value={(element.clienteIdS != null ? element.clienteIdS : 0)}>{element.clienteNombre}</option>)
                    })
                }
            </Form.Select>
        );
    }

    return (<>
        <PageTitle>Reporte Safety</PageTitle>
        <BlockUi tag="div" keepInView blocking={loader ?? false}  >
            <div className="card card-rounded shadow mt-2 text-primary" style={{ width: '100%' }}>
                <div className="d-flex justify-content-end mt-2 m-2">
                    <div style={{ float: 'right' }}>
                        <CargaListadoClientes />
                    </div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <div className="d-flex justify-content-between mx-auto">
                        <div className="ms-9 text-center">
                            <h3 className="mb-0">Reporte Eficiencia</h3>
                            <span className="text-muted m-3">{TipoReporte[tabSel].reporte}</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="row col-sm-12 col-md-12 col-xs-12 mx-auto">
                        {(!TipoReporte[tabSel].EsDetallado) &&
                            (Object.entries(lstIndicadores).map((element: any) => {

                                return (
                                    <div key={`indicadores_${element[0]}`} className="row card shadow m-2 col-sm-3 col-md-3 col-xs-3 mx-auto"
                                        style={{ backgroundColor: `${(element[0] == "Cond Rojo") ? "#F26E5F" : (element[0] == "Cond Ambar") ? "#D7962E" : (element[0] == "Cond Verde") ? "#64B178" : ""}` }} >
                                        <div className="ms-3 text-center m-4">
                                            <h2 className={`mb-0 ${(element[0] != "Calificación Total") ? "text-white" : ""}`}><span id={element[0]}>{element[1]}</span></h2>
                                            <span className={`${(element[0] != "Calificación Total") ? "text-white" : "text-muted"}`}>{element[0]}</span>
                                        </div>
                                    </div>
                                )
                            }))
                        }
                    </div>
                </div>
                <div className="card bg-secondary d-flex justify-content-between m-1">
               
                    <div className="col-sm-8 col-md-8 col-xs-8 col-lg-8">
                        <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Fechas: </label>
                        {(combine && allowedRange && allowedMaxDays) && (
                            <DateRangePicker size="lg" className="mt-2" format="dd/MM/yyyy" value={[TipoReporte[tabSel].filtros.FechaInicial, TipoReporte[tabSel].filtros.FechaFinal]}
                                hoverRange={
                                    TipoReporte[tabSel].tipo == 1 ? `month` : undefined //date =>  [subDays(date, 3), addDays(date,3)]
                                }
                                disabledDate={combine(allowedRange(
                                    (TipoReporte[tabSel].tipo == 1) ? moment().add(-6, 'months').startOf('month').toDate() : moment().add(-6, 'months').toDate(),
                                    (TipoReporte[tabSel].tipo == 1) ? moment().endOf('month').toDate() : moment().toDate()
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
                        <Button className="m-2  btn btn-sm btn-primary" onClick={() => { setShowModal(true) }}>
                            <i className="bi-person"></i></Button>
                        {(tabSel == 2) && (<Button className="m-2  btn btn-sm btn-primary" onClick={() => { setShowModalEventos(true) }}>
                        <i className="bi-card-list"></i></Button>)}
                        <Button className="m-2  btn btn-sm btn-primary" onClick={() => { ConsultarData() }}><i className="bi-search"></i></Button>
                    </div>
                </div>
            </div>
            {/* begin::Chart */}
            <div className=" flex-wrap flex-xxl-nowrap justify-content-center justify-content-md-start pt-4">
                {/* begin::Nav */}
                <div className="me-sm-10 me-0">
                    <ul className="nav nav-tabs nav-pills nav-pills-custom">
                        {listTabsSafety.map((tab, idx) => {
                            return (<li className="nav-item mb-3" key={`tabenc_${idx}`}>
                                <a
                                    onClick={() => settabSel(idx)}
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
                    <div className="card" >
                        {(OpcionesAcumulado != null && TipoReporte[tabSel].EsDetallado) && (
                            <ReactApexChart
                                options={OpcionesAcumulado.options}
                                series={OpcionesAcumulado.series}
                                type="bar"
                                height={200} />)}
                    </div>
                    <div style={{ display: (tabSel != 2) ? "block" : "none" }} >
                        <div className="card">
                            {(opciones != null) && (
                                <ReactApexChart
                                    options={opciones.options}
                                    series={opciones.series}
                                    type="bar"
                                    height={300} />)}
                        </div>
                    </div>
                    <div style={{ display: (tabSel == 2) ? "block" : "none" }}>

                        <div className="row" >
                            <div className="col-xs-4 col-sm-4 col-md-4" style={{ height: '200px', overflowY: 'scroll'}} >
                                <div className="text-center"><label className="label control-label label-sm fw-bolder" style={{ fontSize: '14px', display: (tabSel == 2) ? "block" : "none" }}>Exceso Velocidad &gt; 50 km/h</label></div>
                                {(TotalesVel50.length != 0) && (<MaterialReactTable
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
                                    columns={ColumnasTablasVerticales}
                                    data={TotalesVel50}
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
                                        sorting,
                                    }}
                                />)}
                            </div>
                            <div className="col-xs-4 col-sm-4 col-md-4" style={{ height: '200px', overflowY: 'scroll'}}  >
                                <div className="text-center"><label className="label control-label label-sm fw-bolder" style={{ fontSize: '14px', display: (tabSel == 2) ? "block" : "none" }}>Aceleración Brusca &gt; 8 km/h/s</label></div>
                                {(TotalesAC.length != 0) && (<MaterialReactTable
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
                                    columns={ColumnasTablasVerticales}
                                    data={TotalesAC}
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
                                        sorting,
                                    }}
                                />)}
                            </div>
                            <div className="col-xs-4 col-sm-4 col-md-4" style={{ height: '200px', overflowY: 'scroll'}}  >
                                <div className="text-center">
                                    <label className="label control-label label-sm fw-bolder" style={{ fontSize: '14px', display: (tabSel == 2) ? "block" : "none" }}>Frenada Brusca &gt; 10 km/h/s</label>
                                </div>
                                {(TotalesFB.length != 0) && (<MaterialReactTable
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
                                    columns={ColumnasTablasVerticales}
                                    data={TotalesFB}
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
                                        sorting,
                                    }}
                                />)}
                            </div>
                        </div>
                        <div className="row" >
                            <div className="col-xs-4 col-sm-4 col-md-4" style={{ height: '200px', overflowY: 'scroll'}}  >
                                <div className="text-center"><label className="label control-label label-sm fw-bolder" style={{ fontSize: '14px', display: (tabSel == 2) ? "block" : "none" }}>Exceso Velocidad &gt; 30 km/h</label></div>
                                {(TotalesVel30.length != 0) && (<MaterialReactTable
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
                                    columns={ColumnasTablasVerticales}
                                    data={TotalesVel30}
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
                                        sorting,
                                    }}
                                />)}
                            </div>
                            <div className="col-xs-4 col-sm-4 col-md-4" style={{ height: '200px', overflowY: 'scroll'}}  >
                                <div className="text-center"><label className="label control-label label-sm fw-bolder" style={{ fontSize: '14px', display: (tabSel == 2) ? "block" : "none" }}>Giro Brusco &gt; 0.30 G</label></div>
                                {(TotalesGB.length != 0) && (<MaterialReactTable
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
                                    columns={ColumnasTablasVerticales}
                                    data={TotalesGB}
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
                                        sorting,
                                    }}
                                />)}
                            </div>
                            <div className="col-xs-4 col-sm-4 col-md-4" style={{ height: '200px', overflowY: 'scroll'}}  >
                                <div className="text-center">
                                    <label className="label control-label label-sm fw-bolder" style={{ fontSize: '14px', display: (tabSel == 2) ? "block" : "none" }}>Cinturón Desabrochado &gt; 0 km/h</label>
                                </div>
                                {(TotalesCD.length != 0) && (<MaterialReactTable
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
                                    columns={ColumnasTablasVerticales}
                                    data={TotalesCD}
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
                                        sorting,
                                    }}
                                />)}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12">
                    <div className="text-center"><label className="label control-label label-sm fw-bolder" style={{ fontSize: '14px' }}> </label></div>
                    <MaterialReactTable
                            enableColumnFilters={false}
                            initialState={{ density: 'compact', columnVisibility: { mes: false } }}
                            enableColumnOrdering
                            enableColumnDragging={false}
                            enablePagination={false}
                            enableStickyHeader
                            enableDensityToggle={false}
                            enableRowVirtualization
                            localization={MRT_Localization_ES}
                            displayColumnDefOptions={{
                                'mrt-row-actions': {
                                    muiTableHeadCellProps: {
                                        align: 'center',
                                    }
                                },
                            }}
                            defaultColumn={{
                                minSize: 20, //allow columns to get smaller than default
                                maxSize: 100, //allow columns to get larger than default
                                size: 80, //make columns wider by default
                            }}
                            muiTableContainerProps={{
                                ref: tableContainerRef, //get access to the table container element
                                sx: { maxHeight: '400px' }, //give the table a max height
                            }}
                            muiTableHeadCellProps={{
                                sx: (theme) => ({
                                    fontSize: 14,
                                    fontStyle: 'bold',
                                    color: 'rgb(27, 66, 94)',
                                    //backgroundColor: 'yellow'
                                }),
                            }}
                            columns={columnas}
                            data={dataFiltrada}
                            // editingMode="modal" //default         
                            // enableTopToolbar={false}

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
                            rowCount={rowCount}
                            state={{
                                columnFilters,
                                globalFilter,
                                isLoading,
                                pagination,
                                showAlertBanner: isError,
                                showProgressBars: isRefetching,
                                sorting,
                            }}
                            renderTopToolbarCustomActions={({ table }) => (
                                <Box
                                    sx={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1, display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                                >
                                    <button className="m-2 ms-0 btn btn-sm btn-primary" type="button" onClick={() => { DescargarExcel(dataFiltrada, TipoReporteBase[tabSel].columnas, `Safety ${TipoReporteBase[tabSel].reporte}`) }}>
                                        <i className="bi-file-earmark-excel"></i></button>
                                </Box>
                            )}
                        />
                    </div>
                    </div>

                    <div className={`tab-pane fade ${tabSel === 0 ? "show active" : ""}`} id="tab0_content" >
                        {/* begin::Cards */}
                        <div className="overflow-auto">
                        </div>
                        {/* end::Cards      */}
                    </div>
                    {/* end::Tab Pane 1 */}
                    {/* begin::Tab Pane 2 */}
                    <div className={`tab-pane fade ${tabSel === 1 ? "show active" : ""}`} id="tab1_content">
                        {/* begin::Cards */}
                        <div className="overflow-auto">
                            {/*Tabla de los operadores */}
                        </div>
                        {/* end::Cards      */}
                    </div>
                    {/* end::Tab Pane 2 */}
                    <div className={`tab-pane fade ${tabSel === 2 ? "show active" : ""}`} id="tab1_content">
                        {/* begin::Cards */}
                        <div className="overflow-auto">
                        </div>
                        {/* end::Cards      */}
                    </div>

                </div>
                {/* end::Tab Content */}
            </div>
            {/* end::Chart      */}
        </BlockUi>

        <Modal show={showModal} onHide={setShowModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title> {"Filtro Operador"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                        <SelectOperadores />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="secondary" onClick={() => {
                    setSeleccionados([]);  /*actualizamos los filtros*/

                    let tiporeporte = [...TipoReporte];
                    tiporeporte[tabSel].filtros = { ...TipoReporte[0].filtros, Operadores: [] };
                    setTipoReporte(tiporeporte)
                }}>
                    Limpiar
                </Button>
                <Button type="button" variant="primary" onClick={() => { setShowModal(false); }}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
        <Modal show={showModalEventos} onHide={setShowModalEventos} size="lg">
            <Modal.Header closeButton>
                <Modal.Title> {"Filtro Eventos"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                        <SelectEventos />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="secondary" onClick={() => {
                    setEventosSeleccionados([]);  /*actualizamos los filtros*/

                    let tiporeporte = [...TipoReporte];
                    tiporeporte[tabSel].filtros = { ...TipoReporte[0].filtros, Vehiculos: [] };
                    setTipoReporte(tiporeporte)
                }}>
                    Limpiar
                </Button>
                <Button type="button" variant="primary" onClick={() => { setShowModalEventos(false); }}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}