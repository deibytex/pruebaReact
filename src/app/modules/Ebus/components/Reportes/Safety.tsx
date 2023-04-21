import moment from "moment";
import { useEffect, useRef, useState, UIEvent, useCallback } from "react";
import { GetDataEficiencia, GetDataSafety, GetReporteAlarmas, GetReporteNivelCarga, listTabsEficiencia } from "../../data/ReportesData";
import { PageTitle } from "../../../../../_start/layout/core";
import { DateRangePicker, Notification, Placeholder, useToaster } from "rsuite";
import BlockUi from "@availity/block-ui";
import { DescargarExcel } from "../../../../../_start/helpers/components/DescargarExcel";
import MaterialReactTable, { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import { FormatoColombiaDDMMYYY, FormatoColombiaDDMMYYYHHmmss, FormatoSerializacionYYYY_MM_DD_HHmmss } from "../../../../../_start/helpers/Constants";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import DualListBox from "react-dual-listbox";
import { dualList } from "../../../CorreosTx/models/dataModels";
import { Button, Card, Form, Modal } from "react-bootstrap-v5";
import ReactApexChart from "react-apexcharts";
import { FiltrosReportes } from "../../models/eBus";
import { ClienteDTO } from "../../models/NivelcargaModels";
import { AxiosResponse } from "axios";
import { GetClientesEsomos } from "../../data/NivelCarga";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { InicioCliente } from "../../../../../_start/helpers/Models/ClienteDTO";
import { locateFormatNumberNDijitos, locateFormatPercentNDijitos } from "../../../../../_start/helpers/Helper";
import { Box } from "@mui/material";
import { toAbsoluteUrl } from "../../../../../_start/helpers";
import * as Icons from "@mui/icons-material";
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
                        return (moment(row.original.Fecha).format(FormatoColombiaDDMMYYY))
                    }
                },
                {
                    accessorKey: 'DuracionHora',
                    header: 'Duracion',
                    Cell({ cell, column, row, table, }) {
                        return (locateFormatNumberNDijitos(row.original.Distancia ?? 0, 2))
                    }
                },
                {
                    accessorKey: 'ValorMax',
                    header: 'Valor Max',
                    Cell({ cell, column, row, table, }) {
                        return (locateFormatNumberNDijitos(row.original.Duracion ?? 0, 2))
                    }
                }

            ];

        return EsDetallado ? listadoCamposDetallado : listadoCamposOperador;
    }
    const TipoReporteBase = [
        { reporte: "Operador Mensual", columnas: getListadoCampoPorTipo(false, false), filtros: { ...filtrosBase, MaxDay: 30 }, tipo: 1, Data: [], consultar: true },
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
            }, tipo: 2, Data: [], consultar: true
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
    const [lablesAxisx, setlablesAxisx] = useState<string[]>([]);
    const [idxSeleccionado, setidxSeleccionado] = useState<number>(-2);
    const [isCallData, setisCallData] = useState<boolean>(false);
    const [opciones, setOpciones] = useState<any>(null);
    const [OpcionesAcumulado, setAcumulado] = useState<any>(null);

    const [data, setData] = useState<any[]>([]);
    const [dataFiltrada, setDataFiltrada] = useState<any[]>([]);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [lstSeleccionados, setSeleccionados] = useState<string[]>([]);
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

    const [lstOperadores, setlstOperadores] = useState<dualList[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [isError, setIsError] = useState(false);

    // variable que contendra los datos de los odometros
    ///////////// FIN TABLE STATE
    const toaster = useToaster();
    /*
     const message = (
          <Notification type="success" header="success" closable>
            <Placeholder.Paragraph style={{ width: 320 }} rows={3} />
  
          </Notification>
        );
    */

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

        let defaultopciones = {
            options: {
                chart: {
                    id: 'apexchart-example',
                    events: {
                        dataPointSelection: function (event: any, chartContext: any, config: any) {
                            // seleccionamos el index de la grafica para posteriormente filtrar
                            setidxSeleccionado(config.dataPointIndex);

                        }
                    },
                    type: 'bar'
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
                            return val.toFixed(1);
                        }
                    },
                    title: {
                        text: "Score"
                    }
                },
                {
                    min: 0,
                    max: 1,
                    opposite: true,
                    show: false
                }
                ],
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: true,
                    formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {

                        return locateFormatPercentNDijitos(value, 2)
                    },
                }
            },
            series: []

        }
        // asingamos las opciones
        setOpciones(defaultopciones)

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
                    setData(response.data);
                    setisCallData(false)
                    // vamos a llenar la informacion de los Operadores
                    let lstOperadores = (response.data as any[]).reduce((p, c) => {
                        let operador = c["Operador"];
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
        let fechaGraficaActual = filtros.FechaGrafica;
        let FechaInicial: Date = filtros.FechaInicial;
        let FechaFinal: Date = filtros.FechaFinal;

        let datosFiltrados: any[] = datos;
        if (filtros.IndGrafica != -1) {
            FechaInicial = moment(filtros.FechaGrafica, FormatoColombiaDDMMYYY).toDate();
            FechaFinal = moment(filtros.FechaGrafica, FormatoColombiaDDMMYYY).toDate();
        }


        // filtramos por las fechas
        datosFiltrados = datosFiltrados.
            filter(f =>
                EsDiario ? moment(f.Fecha).toDate() : new Date(f.anio, f.mes, 1) >= FechaInicial
                    && EsDiario ? moment(f.Fecha).toDate() : new Date(f.anio, f.mes, 1) <= FechaFinal);

        // filtramos por los Operadores

        if ((filtros.Operadores as string[]).length > 0) {
            datosFiltrados = datosFiltrados.filter(f => (filtros.Operadores as string[]).indexOf(f["Operador"]) > -1);
        }
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

        setListIndicadores({
            "Calificación Total": locateFormatNumberNDijitos(scoretotal, 2),
        });

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

        const indicadoresFinal = {
            "Cond Rojo": rojo,
            "Cond Ambar": ambar,
            "Cond Verde": verde,
            ...lstIndicadores,
        };
        
        setListIndicadores(indicadoresFinal);


        setlablesAxisx(labels)

        // se debe volver actualizar los eventos pues 'estos no
        // se reflejan los usestate y utilizan los datos que tienen las variables
        // al momento de crearse

        ApexCharts.exec('apexchart-example', 'updateOptions', {
            chart: {
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
            }
        });
        // funcion que actualiza los datos de las series
        // se debe pasar el id configurado al momento de su creaci'on para poder
        // actializar los datos
        ApexCharts.exec('apexchart-example', 'updateSeries', [
            {
                name: 'Score',
                data: totalScoreA,
                type: 'bar'
            }
        ]);

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
            <div className="card card-rounded shadow mt-2 text-primary" style={{ width: '100%' }}  >

                <div className="d-flex justify-content-end mt-2">
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

                        {

                            Object.entries(lstIndicadores).map((element: any) => {

                                return (
                                    <div key={`indicadores_${element[0]}`} className="row card shadow m-2 col-sm-3 col-md-3 col-xs-3 mx-auto">
                                        <div className="ms-3 text-center m-4">
                                            <h2 className="mb-0"><span id={element[0]}>{element[1]}</span></h2>
                                            <span className="text-muted">{element[0]}</span>
                                        </div>
                                    </div>
                                )

                            })
                        }

                    </div>
                </div>
                <div className="card bg-secondary d-flex justify-content-between">
                    <h3 className="fs-4 m-2 ms-2 d-flex "> Filtros</h3>
                    <div className="col-sm-8 col-md-8 col-xs-8 col-lg-8">
                        <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Fecha inicial: </label>
                        {(combine && allowedMaxDays && allowedRange) && (
                            <DateRangePicker className="mt-2" format="dd/MM/yyyy" value={[TipoReporte[tabSel].filtros.FechaInicial, TipoReporte[tabSel].filtros.FechaFinal]}
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
                        {listTabsEficiencia.map((tab, idx) => {
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
                        {(OpcionesAcumulado != null) && (
                            <ReactApexChart
                                options={OpcionesAcumulado.options}
                                series={OpcionesAcumulado.series}
                                height={200} />)}

                    </div>
                    <div className="card" >

                        {(opciones != null) && (
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
                        columns={TipoReporteBase[tabSel].columnas}
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
                    {/* begin::Tab Pane 3 */}
                    <div className={`tab-pane fade ${tabSel === 2 ? "show active" : ""}`} id="tab2_content">
                        {/* begin::Cards */}
                        <div className="overflow-auto">

                        </div>
                        {/* end::Cards      */}
                    </div>

                    {/* end::Tab Pane 3 */}

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