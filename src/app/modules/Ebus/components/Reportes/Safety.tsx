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
import { Button, Form, Modal } from "react-bootstrap-v5";
import ReactApexChart from "react-apexcharts";
import { FiltrosReportes } from "../../models/eBus";
import { ClienteDTO } from "../../models/NivelcargaModels";
import { AxiosResponse } from "axios";
import { GetClientesEsomos } from "../../data/NivelCarga";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { InicioCliente } from "../../../../../_start/helpers/Models/ClienteDTO";
import { locateFormatNumberNDijitos, formatNumberChart } from "../../../../../_start/helpers/Helper";
import { Box } from "@mui/material";
import { DrawDynamicIconMuiMaterial } from "../../../../../_start/helpers/components/IconsMuiDynamic";

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
                        return (locateFormatNumberNDijitos(row.original.Score ?? 0, 2))
                    }
                },
                {
                    accessorKey: 'scoreVel50',
                    header: 'ScoreVel > 50',
                    Cell({ cell, column, row, table, }) {
                        return (locateFormatNumberNDijitos(row.original.scoreVel50 ?? 0, 2))
                    }
                },
                {
                    accessorKey: 'scoreVel30',
                    header: 'ScoreVel > 30',
                    Cell({ cell, column, row, table, }) {
                        return (locateFormatNumberNDijitos(row.original.scoreVel30 ?? 0, 2))
                    }
                },
                {
                    accessorKey: 'scoreFB',
                    header: 'ScoreFB > 10',
                    Cell({ cell, column, row, table, }) {
                        return (locateFormatNumberNDijitos(row.original.scoreFB ?? 0, 2))
                    }
                },
                {
                    accessorKey: 'scoreAB',
                    header: 'ScoreAB > 8',
                    Cell({ cell, column, row, table, }) {
                        return (locateFormatNumberNDijitos(row.original.scoreAB ?? 0, 2))
                    }
                },
                {
                    accessorKey: 'scoreGB',
                    header: 'ScoreGB > 0,3',
                    Cell({ cell, column, row, table, }) {
                        return (locateFormatNumberNDijitos(row.original.scoreGB ?? 0, 2))
                    }
                }

            ];

        let listadoCamposDetallado: MRT_ColumnDef<any>[] =
            [
                {
                    accessorKey: 'operador',
                    header: 'Operador',
                    size: 100
                },
                {
                    accessorKey: 'Movil',
                    header: 'Movil',
                    size: 100
                },
                {
                    accessorKey: 'Evento',
                    header: 'Evento',
                    size: 100
                },
                {
                    accessorKey: 'Fecha',
                    header: 'Inicio',
                    Cell({ cell, column, row, table, }) {
                        return (moment(row.original.Fecha).format(FormatoColombiaDDMMYYYHHmmss))
                    }
                },
                {
                    accessorKey: 'DuracionHora',
                    header: 'Duracion',
                    Cell({ cell, column, row, table, }) {
                        return (locateFormatNumberNDijitos(row.original.DuracionHora ?? 0, 2))
                    }
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
        { reporte: "Operador Mensual", columnas: getListadoCampoPorTipo(false, false), filtros: { ...filtrosBase, MaxDay: 31 }, tipo: 1, Data: [], consultar: true },
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
    const { allowedMaxDays, allowedRange, combine, before } = DateRangePicker;

    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);


    const [Clientes, setClientes] = useState<ClienteDTO[]>();
    const [loader, setloader] = useState<boolean>(false);
    const [lablesAxisx, setlablesAxisx] = useState<string[]>([]);
    const [idxSeleccionado, setidxSeleccionado] = useState<number>(-2);
    const [isCallData, setisCallData] = useState<boolean>(false);
    const [opciones, setOpciones] = useState<any>(null);
    const [OpcionesAcumulado, setAcumulado] = useState<any>(null);

    const [columnas, setcolumnas] = useState<any[]>([]);
    const [dataFiltrada, setDataFiltrada] = useState<any[]>([]);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [lstSeleccionados, setSeleccionados] = useState<string[]>([]);
    const [lstOperadores, setlstOperadores] = useState<dualList[]>([]);
    //////////////// TABLE STATE
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
                    id: 'detalladoAgrupado'
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
                },
                // {
                //     min: 0,
                //     max: 1,
                //     opposite: true,
                //     show: false, 
                //     labels: {
                //         formatter: function (val: number, index: any) {
                //             return formatNumberChart(val)
                //         }
                //     }
                // }
                ],
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: true,
                    formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {
                        return value
                    },
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
                }
                ],
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: true,
                    formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {
                        return locateFormatNumberNDijitos(value, 1)
                    },

                }
            },
            series: []
        }

        // asingamos las opciones
        setOpciones(defaultopciones);
        setAcumulado(defaultoOpcionesAcumulado);

        return function cleanUp() {
            //SE DEBE DESTRUIR EL OBJETO CHART
        };
    }, [ClienteSeleccionado]);


    useEffect(() => {
        // VALIDAMOS EL INDEX SELECCIONADO

        if (idxSeleccionado !== -2) // lo hacemos para que no dispare varias veces el llamado de la base de datos la primera vez que se carga
        {
            let Tiporeporte = [...TipoReporte];
            TipoReporte[tabSel].filtros.IndGrafica = idxSeleccionado;
            TipoReporte[tabSel].filtros.FechaGrafica = lablesAxisx[idxSeleccionado];
            setTipoReporte(Tiporeporte)
        }

        return function cleanUp() {
        };
    }, [idxSeleccionado])


    useEffect(() => {
        if (ClienteSeleccionado.clienteIdS != 0)
            ConsultarData();

    }, [tabSel, TipoReporte])


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
            )
                .then((response) => {
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
            FechaFinal = moment(fecha, FormatoColombiaDDMMYYY).toDate();
        }

        // filtramos por las fechas
        datosFiltrados = datosFiltrados.filter(f =>
            (EsDiario ? moment(f.Fecha).toDate() : moment(`01/${f.mes.toString().padStart(2, '0')}/${f.anio.toString()}`
                , FormatoColombiaDDMMYYY).toDate()) >= FechaInicial
            && (EsDiario ? moment(f.Fecha).toDate() : moment(`01/${f.mes.toString().padStart(2, '0')}/${f.anio.toString()}`
                , FormatoColombiaDDMMYYY).toDate()) <= FechaFinal);

        // filtramos por los Operadores
        if ((filtros.Operadores as string[]).length > 0) {
            datosFiltrados = datosFiltrados.filter(f => (filtros.Operadores as string[]).indexOf(f["Operador"]) > -1);
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

        setlablesAxisx(labels);        

        // se debe volver actualizar los eventos pues 'estos no
        // se reflejan los usestate y utilizan los datos que tienen las variables
        // al momento de crearse

        ApexCharts.exec('totalScore', 'updateOptions', {
            chart: {
                events: {
                    markerClick: (event: any, chartContext: any, config: any) => {
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
            }
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

            // setlablesAxisx(labelsdetallado); 

            ApexCharts.exec('detalladoAgrupado', 'updateOptions', {                
                xaxis: {
                    categories: labelsdetallado
                }
            });

            ApexCharts.exec('detalladoAgrupado', 'updateSeries', [
                {
                    name: 'EC: Aceleracion Brusca > 8 km/h/s',
                    data: Ev0,
                    type: 'bar'
                }, {
                    name: 'EC: Exceso Velocidad > 50 km/h',
                    data: Ev1,
                    type: 'bar',
                    color: '#F44336'
                }, {
                    name: 'EC: Frenada Brusca > 10 km/h/s',
                    data: Ev2,
                    type: 'bar',
                    color: '#99C2A2'
                }, {
                    name: 'EC: Giro Brusco > 0,3 G',
                    data: Ev3,
                    type: 'bar',
                    color: '#78cb1d'
                }, {
                    name: 'EC: Exceso Velocidad > 30 km/h',
                    data: Ev4,
                    type: 'bar',
                    color: '#ddff00'
                }, {
                    name: 'EC: Cinturón Desabrochado',
                    data: Ev5,
                    type: 'bar',
                    color: '#ff7b00'
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

        }
    }

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
                                    <div key={`indicadores_${element[0]}`} className={`row card shadow m-2 col-sm-3 col-md-3 col-xs-3 mx-auto 
                                            ${(element[0] == "Cond Rojo") ? "bg-danger" : (element[0] == "Cond Ambar") ? "bg-warning" : (element[0] == "Cond Verde") ? "bg-success" : ""}`}>
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
                <div className="card bg-secondary d-flex justify-content-between">
                    <h3 className="fs-4 m-2 ms-2 d-flex "> Filtros</h3>
                    <div className="col-sm-8 col-md-8 col-xs-8 col-lg-8">
                        <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Fecha inicial: </label>
                        {(combine && before && allowedRange && allowedMaxDays) && (
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
                                height={200} />)}
                    </div>
                    <div className="card" >
                        {(opciones != null ) && (
                            <ReactApexChart
                                options={opciones.options}
                                series={opciones.series}
                                height={300} />)}
                    </div>
                    <MaterialReactTable
                        enableFilters={false}
                        initialState={{ density: 'compact' }}
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
                                <button className="m-2 ms-0 btn btn-sm btn-primary" type="button" onClick={() => { DescargarExcel(dataFiltrada, TipoReporteBase[tabSel].columnas, TipoReporteBase[tabSel].reporte) }}>
                                    <i className="bi-file-earmark-excel"></i></button>
                            </Box>
                        )}
                    />
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
    </>)
}