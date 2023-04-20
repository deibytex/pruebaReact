import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import moment from 'moment-timezone';
import { useEffect, useState } from "react";
import { Tab, Tabs, TabPane, TabContainer, TabContent, Form, Modal, Button, Card } from "react-bootstrap-v5";
import { DateRangePicker, useToaster } from "rsuite";
import DatePicker from 'rsuite/DatePicker';
import { formatFechasView, formatSimple } from "../../../../../_start/helpers/Helper"
import { AxiosResponse } from 'axios';
import { GetReporteOperadorMovil, listTabs } from '../../data/ReportesData';
import { useDataZpOperadorMovil } from '../../core/ZpOperadorMovilProvider';
// import { Graficas } from './Graficas';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { GetClientesEsomos } from "../../data/NivelCarga";
import { ClienteDTO, InicioCliente } from '../../../../../_start/helpers/Models/ClienteDTO';
import { errorDialog } from '../../../../../_start/helpers/components/ConfirmDialog';
import { FiltrosReportes } from "../../models/eBus";
import { FormatoColombiaDDMMYYY, FormatoSerializacionYYYY_MM_DD_HHmmss } from '../../../../../_start/helpers/Constants';
import DualListBox from 'react-dual-listbox';
import { dualList } from '../../../../../_start/helpers/Models/DualListDTO';
import BlockUi from 'react-block-ui';
import { DescargarExcel } from '../../../../../_start/helpers/components/DescargarExcel';
import ReactApexChart from 'react-apexcharts';
import { toAbsoluteUrl } from '../../../../../_start/helpers';
import {Totales } from '../../models/ZpOperadorMovilModels'
import { number } from 'yup';
import ProgressBar from '@ramonak/react-progress-bar';
type Props = {

}
const ReporteZpMovilOperador: React.FC<Props> = ({ }) => {
  const { fechaInicial, fechaFinal } = useDataZpOperadorMovil();
  // declaracion de variables
  let filtrosBase: FiltrosReportes = {
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
  moment.tz.setDefault("America/Bogota");
  // variable que contiene los filtros del sistema

  const TipoReporteBase = [
    /*{ reporte: tblmovilmes, tabla: tblmovilmes, filtros: { ...filtrosBase }, botonesFiltros: btmVehiculo, Data: null, tipo: 1 },*/
    { reporte: "tblmovildia", tabla: "tblmovildia", filtros: { ...filtrosBase }, Data: [], tipo: 1 },
    { reporte: "tbloperadordia", tabla: "tbloperadordia", filtros: { ...filtrosBase },  Data: [], tipo: 2 },
    { reporte: "tbloperadorgrafica", tabla: "tbloperadorgrafica", filtros: { ...filtrosBase }, Data: [], tipo: 3 },
  ]

  // filtros para los que son diarios, maximo 30 dias

  // moment().startOf('day')
  TipoReporteBase[1].filtros.FechaInicial = (fechaInicial != undefined ? fechaInicial : moment().startOf('day').startOf('day').add(-5, 'days').toDate());
  TipoReporteBase[1].filtros.FechaFinal = (fechaFinal != undefined ? fechaFinal : moment().startOf('day').toDate());
  TipoReporteBase[1].filtros.limitdate = 5;

  const [ExcelVisible, setExcelVisible] = useState<string>("block");
  const [TipoReporte, setTipoReporte] = useState(TipoReporteBase);
  const [idxSeleccionado, setidxSeleccionado] = useState<number>(-2);
  const [loader, setloader] = useState<boolean>(false);
  const [tabSel, settabSel] = useState<number>(0);
  const [opciones, setOpciones] = useState<any>(null);
  const [OpcionesAcumulado, setAcumulado] = useState<any>(null);
  const [DateTableMovil, setDateTableMovil] = useState<any[]>([]);
  const [isCallData, setisCallData] = useState<boolean>(false); // permite validar 
  const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
  const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [lablesAxisx, setlablesAxisx] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [lstVehiculos, setlstVehiculos] = useState<dualList[]>([]);
  const [lstSeleccionados, setSeleccionados] = useState<string[]>([]);
  //TABLES
  //table state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [heightGrafica, setheightGrafica] = useState<number>(320);
  const [heightGraficaAgrupada, setheightGraficaAgrupada] = useState<number>(200);
  const [rowCountMovil, setRowCountMovil] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isError, setIsError] = useState(false);
  //TABLES
  const toaster = useToaster();
  const [Totales, setTotales] = useState<Totales[]> ([]);
  const [TotalesV5, setTotalesV5] = useState<Totales[]> ([]);
    //Vertical grafica
    // let Totales:{"Operador":string, "Total":number}[] = [];
    // let TotalesV5:{"Operador":string, "Total":number}[] = [];
  useEffect(
    () => {
      GetClientesEsomos().then((response: AxiosResponse<any>) => {
        setClientes(response.data);
        setClienteSeleccionado(response.data[0])

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
    if (ClienteSeleccionado.clienteIdS != 0)
      Consultar();

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
          stacked: true,
        },
        xaxis: {
          categories: [],
        }
      },
      series: [],
      dataLabels: {
        enabled: true
      }
    }
    let defaultopcionesAcumulado = {
      options: {
        chart: {
          id: 'apexchart-acumulado',
        },
        xaxis: {
          categories: [],
        }
      },
      series: [],
      dataLabels: {
        enabled: true
      }
    }

    // asingamos las opciones
    setOpciones(defaultopciones);
    setAcumulado(defaultopcionesAcumulado);
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
    if (idxSeleccionado !== -2)// lo hacemos para que no dispare varias veces el llamado de la base de datos la primera vez que se carga
      Consultar();
    return function cleanUp() {
    };
  }, [TipoReporte])
  const Consultar = () => {
    console.log("Consultar", TipoReporte[tabSel], tabSel)
    if (TipoReporte[tabSel].filtros.consultar ==  true || isCallData) {
      ObtenerDatos(tabSel);
    }
    else
      filtarDatosSistema(tabSel);
  }
  let ColumnasGraficaZonaOperador:MRT_ColumnDef<Totales>[] = [{
    accessorKey: 'Operador',
    header: 'Operador',
    Header:({ column, header, table }) =>{
      return "";
  },
  },{
    accessorKey: 'Total',
    header: 'Total',
    Header:({ column, header, table }) =>{
        return "";
    },
    size:300,
    maxSize:300,
    minSize:300,
    Cell:({cell, column, row, table}) =>{
      let Total = (row.original.Total == null ? 0: row.original.Total)
      return  <span title={`${ row.original.Completo?.toString()} : ${Total}` }>
          <ProgressBar 
            className='text-center fw-bolder' 
            baseBgColor='transparent' 
            bgColor= {`${(row.original.Id == "EV: 4. Potencia 150<P<175" ? '#ebba09' :'#F44336')}`} 
            labelSize={`10px` } 
            width='200px' 
            customLabel={`${Total}`} 
            completed={`${(Number(Total)*100+50)}`} 
            maxCompleted={500}>
          </ProgressBar> 
        </span>
    }
    
  }];

  let ColumnasTablas: any[] = [{
    "movil": [
      {
        accessorKey: 'Movil',
        header: 'Movil',
        Header: 'Móvil',
        Cell(row: any) {
          return (row.row.original.Movil)
        },
        size: 100
      },
      {
        accessorKey: 'Fecha',
        header: 'Fecha',
        Header: 'Fecha',
        Cell(row: any) {
          return (moment(row.row.original.Fecha).format(formatFechasView))
        }
      },
      {
        accessorKey: 'EV0Regeneracion0P',
        header: 'EV0Regeneracion0P',
        Header: 'EV: 0. Regeneración 0< P',
        Cell(row: any) {
          return (RetornarLabel(`${(row.row.original.EV0Regeneracion0P != 0 ? row.row.original.EV0Regeneracion0P / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
      },
      {
        accessorKey: 'EV1Potencia0P50',
        header: 'EV1Potencia0P50',
        Header: "EV: 1. Potencia 0<P<50",
        Cell(row: any) {
          return (RetornarLabel(`${(row.row.original.EV1Potencia0P50 != 0 ? row.row.original.EV1Potencia0P50 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
      },
      {
        accessorKey: 'EV2Potencia50P100',
        header: 'EV2Potencia50P100',
        Header: 'EV: 2. Potencia 50<P<100',
        Cell(row: any) {
          return (RetornarLabel(`${(row.row.original.EV2Potencia50P100 != 0 ? row.row.original.EV2Potencia50P100 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
      },
      {
        accessorKey: 'EV3Potencia100P150',
        header: 'EV3Potencia100P150',
        Header: "EV: 3. Potencia 100<P<150",
        Cell(row: any) {
          return (RetornarLabel(`${(row.row.original.EV3Potencia100P150 != 0 ? row.row.original.EV3Potencia100P150 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
      },
      {
        accessorKey: 'EV4Potencia150P175',
        header: 'EV4Potencia150P175',
        Header: "EV: 4. Potencia 150<P<175",
        Cell(row: any) {
          return (RetornarLabel(`${(row.row.original.EV4Potencia150P175 != 0 ? row.row.original.EV4Potencia150P175 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
      },
      {
        accessorKey: 'EV5Potencia175',
        header: 'EV5Potencia175',
        Header: "EV: 5. Potencia >175",
        Cell(row: any) {
          return (RetornarLabel(`${(row.row.original.EV5Potencia175 != 0 ? row.row.original.EV5Potencia175 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
      }]
  }, {
    "operador": [
      {
        accessorKey: 'Operador',
        header: 'Operador',
        Header: 'Operador',
        Cell(row: any) {
          return (row.row.original.Operador)
        },
        size: 400
      },
      {
        accessorKey: 'Fecha',
        header: 'Fecha',
        Header: "Fecha",
        Cell(row: any) {
          return (moment(row.row.original.Fecha).format(formatFechasView))
        }
      },
      {
        accessorKey: 'EV0Regeneracion0P',
        header: 'EV0Regeneracion0P',
        Header: "EV: 0. Regeneración 0< P",
        Cell(row: any) {
          return (RetornarLabel(`${(row.row.original.EV0Regeneracion0P != 0 ? row.row.original.EV0Regeneracion0P / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
      },
      {
        accessorKey: 'EV1Potencia0P50',
        header: 'EV1Potencia0P50',
        Header: "EV: 1. Potencia 0<P<50",
        Cell(row: any) {
          return (RetornarLabel(`${(row.row.original.EV1Potencia0P50 != 0 ? row.row.original.EV1Potencia0P50 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
      },
      {
        accessorKey: 'EV2Potencia50P100',
        header: 'EV2Potencia50P100',
        Header: "EV: 2. Potencia 50<P<100",
        Cell(row: any) {
          return (RetornarLabel(`${(row.row.original.EV2Potencia50P100 != 0 ? row.row.original.EV2Potencia50P100 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
      },
      {
        accessorKey: 'EV3Potencia100P150',
        header: 'EV3Potencia100P150',
        Header: "EV: 3. Potencia 100<P<150",
        Cell(row: any) {
          return (RetornarLabel(`${(row.row.original.EV3Potencia100P150 != 0 ? row.row.original.EV3Potencia100P150 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
      },
      {
        accessorKey: 'EV4Potencia150P175',
        header: 'EV4Potencia150P175',
        Header: "EV: 4. Potencia 150<P<175",
        Cell(row: any) {
          return (RetornarLabel(`${(row.row.original.EV4Potencia150P175 != 0 ? row.row.original.EV4Potencia150P175 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
      },
      {
        accessorKey: 'EV5Potencia175',
        header: 'EV5Potencia175',
        Header: "EV: 5. Potencia >175",
        Cell(row: any) {
          return (RetornarLabel(`${(row.row.original.EV5Potencia175 != 0 ? row.row.original.EV5Potencia175 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
      }
    ]
  }];
  const RetornarLabel = (Data: any) => {
    return <span >{Data}</span>;
  };
  function ObtenerDatos(key: any | null | undefined) {
    setIsError(false)
    setIsLoading(true)
    setIsRefetching(true)
    setloader(true)
    let Tab = (key == null || key == undefined ? "0" : key.toString());
    GetReporteOperadorMovil(moment(TipoReporte[0].filtros.FechaInicial).format(FormatoSerializacionYYYY_MM_DD_HHmmss)
      , moment(TipoReporte[0].filtros.FechaFinal).format(FormatoSerializacionYYYY_MM_DD_HHmmss), Tab).then((response: AxiosResponse<any>) => {
        let Tiporeporte = [...TipoReporte];
        Tiporeporte[Tab].Data = response.data;
        setTipoReporte(Tiporeporte);
        // vamos a llenar la informacion de los movils
        let lstVehiculos = (response.data as any[]).reduce((p, c) => {
          let movil = (c["Movil"] == undefined ? c["Operador"] : c["Movil"]);
          let isExists = p.filter((f: any) => f["value"] === movil);
          if (isExists.length == 0)
            p.push({ "value": movil, "label": movil })
          return p;
        }, []);
        // listados de vehiculos de los datos que traemos
        setlstVehiculos(lstVehiculos);

        // setModales();
        filtarDatosSistema(Tab);
        setIsLoading(false)
        setIsRefetching(false)
        Tiporeporte[tabSel].filtros.consultar = false;
        setisCallData(false)

        setloader(false)
      }).catch((error) => {
        console.log("Error");
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

    // cuando hay una consulta por fechas se debe quitar el filtro por gráfica para que pueda
    // visualizar correctamente la información
    filtros = { ...Tiporeporte[tabSel].filtros, FechaInicial, FechaFinal, FechaInicialInicial, FechaFinalInicial, IndGrafica: -1, FechaGrafica: "" }
    Tiporeporte[tabSel].filtros = filtros;
    setTipoReporte(Tiporeporte)

  }
  // funcion que cambia el rango de fechas por tipo de reporte
  // 6 meses y ultimos 30 dias respectivamente
  useEffect(() => {
   Consultar();
    // ColumnasTablas.push({movil});
    // ColumnasTablas.push({operador});
    return function cleanUp() {
    };
  }, [])
  const filtarDatosSistema = (key: any | null | undefined) => {
    let Tab = parseInt(key);
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
    if(key <2)
      datosfiltrados = datosfiltrados.
        filter((f: any) =>  moment(f.Fecha).toDate() >= FechaInicial && moment(f.Fecha).toDate() <= FechaFinal);
    // filtramos por los vehivulos
    if (filtros.Vehiculos.length > 0) {
      datosfiltrados = datosfiltrados.filter((f: any) => filtros.Vehiculos.indexOf(f.Movil) > -1);
    }
    // filtra por operadores a los reportes que se necesiten
    if (filtros.Operadores != null && filtros.Operadores.length > 0 && [0, 1].includes(tabSel)) {
      datosfiltrados = datosfiltrados.filter(function (o) {
        return (filtros.Operadores != null) ? filtros.Operadores.indexOf(o['Operador']) > -1 : [];
      });
    };
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
    let agrupadoOperador :any[] = [];
    if(Tab == 1 || Tab == 2)
      agrupadoOperador = datosfiltrados
        .reduce((p: any, c: any) => {
          let name = c.Operador;
          p[name] = p[name] ?? [];
          p[name].push(c);
          return p;
        }, {});

    let labels = new Array();
    let labelsConductores = new Array();
    // agrupa los elementos para ser mostrado por la grafica
    let Ev0 = new Array();
    let Ev1 = new Array();
    let Ev2 = new Array();
    let Ev3 = new Array();
    let Ev4 = new Array();
    let Ev5 = new Array();
    let PorEV0Regeneracion0P = 0;
    let PorEV1Potencia0P50 = 0;
    let PorEV2Potencia50P100 = 0;
    let PorEV3Potencia100P150 = 0;
    let PorEV4Potencia150P175 = 0;
    let PorEV5Potencia175 = 0;

    //Agrupados
    let Ev0Agrupado = new Array();
    let Ev1Agrupado = new Array();
    let Ev2Agrupado = new Array();
    let Ev3Agrupado = new Array();
    let Ev4Agrupado = new Array();
    let Ev5Agrupado = new Array();
    //Agrupados
    let PorEV0Agrupado = 0;
    let PorEV1Agrupado = 0;
    let PorEV2Agrupado = 0;
    let PorEV3Agrupado = 0;
    let PorEV4Agrupado = 0;
    let PorEV5Agrupado = 0;

    datosfiltrados.map((item: any) => {
      PorEV0Agrupado = PorEV0Agrupado + item.EV0Regeneracion0P;
      PorEV1Agrupado = PorEV1Agrupado + item.EV1Potencia0P50;
      PorEV2Agrupado = PorEV2Agrupado + item.EV2Potencia50P100;
      PorEV3Agrupado = PorEV3Agrupado + item.EV3Potencia100P150;
      PorEV4Agrupado = PorEV4Agrupado + item.EV4Potencia150P175;
      PorEV5Agrupado = PorEV5Agrupado + item.EV5Potencia175;
    });
    let LabelPeriodo = ["Periodo"];
    if(Tab < 2){
      Object.entries(agrupadofecha).map((elem: any) => {
        labels.push(moment(elem[0]).format(formatFechasView));
        // totalizamos por propiedad que se necesite
        // totalizamos por propiedad que se necesite
        let EV0Regeneracion0P = (elem[1].map((m: any) => { return m.EV0Regeneracion0P }).reduce((a: any, b: any) => a + b, 0));
        let EV1Potencia0P50 = (elem[1].map((m: any) => { return m.EV1Potencia0P50 }).reduce((a: any, b: any) => a + b, 0));
        let EV2Potencia50P100 = (elem[1].map((m: any) => { return m.EV2Potencia50P100 }).reduce((a: any, b: any) => a + b, 0));
        let EV3Potencia100P150 = (elem[1].map((m: any) => { return m.EV3Potencia100P150 }).reduce((a: any, b: any) => a + b, 0));
        let EV4Potencia150P175 = (elem[1].map((m: any) => { return m.EV4Potencia150P175 }).reduce((a: any, b: any) => a + b, 0));
        let EV5Potencia175 = (elem[1].map((m: any) => { return m.EV5Potencia175 }).reduce((a: any, b: any) => a + b, 0));
        let EVTotal = (
          elem[1].map((m: any) => {
            return (m.Total)
          }).reduce((a: any, b: any) => a + b, 0));
        PorEV0Regeneracion0P = (EV0Regeneracion0P / EVTotal * 100)
        PorEV1Potencia0P50 = (EV1Potencia0P50 / EVTotal * 100)
        PorEV2Potencia50P100 = (EV2Potencia50P100 / EVTotal * 100)
        PorEV3Potencia100P150 = (EV3Potencia100P150 / EVTotal * 100)
        PorEV4Potencia150P175 = (EV4Potencia150P175 / EVTotal * 100)
        PorEV5Potencia175 = (EV5Potencia175 / EVTotal * 100)
        // sumamos los indicadores por fecha 
        Ev0.push(PorEV0Regeneracion0P.toFixed(1));
        Ev1.push(PorEV1Potencia0P50.toFixed(1));
        Ev2.push(PorEV2Potencia50P100.toFixed(1));
        Ev3.push(PorEV3Potencia100P150.toFixed(1));
        Ev4.push(PorEV4Potencia150P175.toFixed(1));
        Ev5.push(PorEV5Potencia175.toFixed(1));
      });
      //para sacar el total de los valores del agrupado.
      let TotalAgrupado = PorEV0Agrupado + PorEV1Agrupado + PorEV2Agrupado + PorEV3Agrupado + PorEV4Agrupado + PorEV5Agrupado;
      //Agrego lo valores agrupados a los array
      Ev0Agrupado.push((PorEV0Agrupado / TotalAgrupado * 100).toFixed(1));
      Ev1Agrupado.push((PorEV1Agrupado / TotalAgrupado * 100).toFixed(1));
      Ev2Agrupado.push((PorEV2Agrupado / TotalAgrupado * 100).toFixed(1));
      Ev3Agrupado.push((PorEV3Agrupado / TotalAgrupado * 100).toFixed(1));
      Ev4Agrupado.push((PorEV4Agrupado / TotalAgrupado * 100).toFixed(1));
      Ev5Agrupado.push((PorEV5Agrupado / TotalAgrupado * 100).toFixed(1));
      //Fin agrupado
      setlablesAxisx(labels)
    }
   

  if (tabla == "tbloperadorgrafica"){
    let TotalTemp : any [] = [];
    let TotalesV5Temp : any[] = [];
    Object.entries(agrupadoOperador).map((elem:any) => {
      let TotalesConductor = 0;
      let TotalesConductorV5 = 0;
      // labelsConductores.push((elem[0] != undefined ? `${(elem[0].split("&")[1] != undefined) ? elem[0].split("&")[1].substring(0, 18) : elem[0].substring(0, 18)}...` : null));
      elem[1].map((m:any) => {
          if (m.Descripcion == "EV: 4. Potencia 150<P<175") {
              TotalesConductor = TotalesConductor + m.Total;
          } else if (m.Descripcion == "EV: 5. Potencia >175") {
              TotalesConductorV5 = TotalesConductorV5 + m.Total;
          }

      });
      TotalTemp.push({
        Id:"EV: 4. Potencia 150<P<175",
        Completo:elem[0],
        Operador:(elem[0] != undefined ? `${(elem[0].split("&")[1] != undefined) ? elem[0].split("&")[1].substring(0, 18) : elem[0].substring(0, 18)}..` : ""),Total: Number(TotalesConductor.toFixed(2))});
        TotalesV5Temp.push({ 
          Id:"EV: 5. Potencia >175",
          Completo:elem[0],
          Operador:(elem[0] != undefined ? `${(elem[0].split("&")[1] != undefined) ? elem[0].split("&")[1].substring(0, 18) : elem[0].substring(0, 18)}..` : ""),Total: Number(TotalesConductorV5.toFixed(2))});
  });

    setTotales(TotalTemp.sort((a:any,b:any) =>{
      return b.Total - a.Total
    }));
    setTotalesV5(TotalesV5Temp.sort((a:any,b:any) =>{
      return b.Total - a.Total
    }));
      //fin vertical grafica
  }

    ApexCharts.exec('apexchart-example', 'updateOptions', {
      chart: {
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
      }
    });
    ApexCharts.exec('apexchart-acumulado', 'updateOptions', {
      chart: {
        toolbar: {
          show: false
        },
      },
      xaxis: {
        categories: LabelPeriodo
      }
    });
  
    // funcion que actualiza los datos de las series
    // se debe pasar el id configurado al momento de su creaci'on para poder
    // actializar los datos
    ApexCharts.exec('apexchart-example', 'updateSeries', [{
      name: 'EV: 0. Regeneración 0< P',
      data: Ev0
    }, {
      name: 'EV: 1. Potencia 0<P<50',
      data: Ev1
    }, {
      name: 'EV: 2. Potencia 50<P<100',
      data: Ev2
    }, {
      name: 'EV: 3. Potencia 100<P<150',
      data: Ev3
    }, {
      name: 'EV: 4. Potencia 150<P<175',
      data: Ev4
    }, {
      name: 'EV: 5. Potencia >175',
      data: Ev5
    }]);
    //Agrupado
    ApexCharts.exec('apexchart-acumulado', 'updateSeries', [{
      name: 'EV: 0. Regeneración 0< P',
      data: Ev0Agrupado
    }, {
      name: 'EV: 1. Potencia 0<P<50',
      data: Ev1Agrupado
    }, {
      name: 'EV: 2. Potencia 50<P<100',
      data: Ev2Agrupado
    }, {
      name: 'EV: 3. Potencia 100<P<150',
      data: Ev3Agrupado
    }, {
      name: 'EV: 4. Potencia 150<P<175',
      data: Ev4Agrupado
    }, {
      name: 'EV: 5. Potencia >175',
      data: Ev5Agrupado
    }]);
    setDateTableMovil(datosfiltrados);
    setRowCountMovil(datosfiltrados.length);
  };
  const OnClickTabs = (Tab: number) => {
    setisCallData(false);
    setidxSeleccionado(-1);    
    settabSel(Tab);
    //RenderGrafica()
    let data = TipoReporte[Tab].Data
    if (TipoReporte[Tab].filtros.consultar ==  true) {
      // BlockStart();
     Consultar();
    } else {
      //setModales();
      filtarDatosSistema(Tab);
    }
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
  // seleccion de vehiculos
  function SelectVehiculos() {
    return (
      <DualListBox className=" mb-3 " canFilter
        options={lstVehiculos}
        selected={lstSeleccionados}
        onChange={(selected: any) => {
          // dejamos los seleccionados
          setSeleccionados(selected)
          // modificacion de filtros
          let tiporeporte = [...TipoReporte];
          tiporeporte[tabSel].filtros = { ...TipoReporte[0].filtros, Vehiculos: selected };
          setTipoReporte(tiporeporte)
        }}
      />
    );
  }

 
  useEffect(() =>{
    (tabSel != 2)  ? setExcelVisible("block") :setExcelVisible("none")
  },[tabSel])
  return (
    <>
      <BlockUi tag="div" keepInView blocking={loader ?? false}  >
        <div className="card">
          <div className='card-header'>
            <div className='float-rigth'>
              <CargaListadoClientes></CargaListadoClientes>
            </div>
          </div>
          <Card className="bg-secondary  text-primary m-0">
            <Card.Body className="m-0">
              <h3 className="fs-4 m-2 ms-2 d-flex justify-content-left"> Filtros</h3>
              <div className="row">
                <div className="col-sm-8 col-md-8 col-xs-8 col-lg-8"> <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Fecha inicial: </label>
                  <DateRangePicker className="mt-2" format="dd/MM/yyyy" value={
                    [TipoReporte[tabSel].filtros.FechaInicial, TipoReporte[tabSel].filtros.FechaFinal]}
                    onChange={(value, e) => {
                      if (value !== null) {
                        ValidarFechas(
                          [value[0],
                          value[1]]
                        );
                      }
                    }} />

                  <Button className="m-2  btn btn-sm btn-primary" onClick={() => { setShowModal(true) }}><i className="bi-car-front-fill"></i></Button>
                  <Button className="m-2  btn btn-sm btn-primary" onClick={() => { Consultar() }}><i className="bi-search"></i></Button>
                </div>
                <div className="col-sm-4 col-md-4 col-xs-4 col-lg-4 d-flex justify-content-end"  style={{display: ExcelVisible}}>
                  <button className="m-2 ms-0 btn btn-sm btn-primary" type="button" onClick={() => {
                     DescargarExcel(DateTableMovil,(tabSel == 0 ?ColumnasTablas[0]['movil']:ColumnasTablas[1]['operador']) , "Reporte") 
                     }}>
                    <i className="bi-file-earmark-excel"></i></button>
                </div>
              </div>


            </Card.Body>
          </Card>
          <div className="card-body">

            <div className=" flex-wrap flex-xxl-nowrap justify-content-center justify-content-md-start pt-4">
              {/* begin::Nav */}
              <div className="me-sm-10 me-0">
                <ul className="nav nav-tabs nav-pills nav-pills-custom" > {/**/}
                  {listTabs.map((tab, idx) => {
                    return (<li className="nav-item mb-3" key={`tabenc_${idx}`}>
                      <a
                        onClick={() => OnClickTabs(idx)}
                        className={`nav-link w-225px h-70px ${tabSel === idx ? "active btn-active-light" : ""
                          } fw-bolder me-2`}
                        id={`tab${idx}`}
                      >
                        <div className="nav-icon me-3">
                          <img
                            alt=""
                            src={toAbsoluteUrl(tab.icon)}
                            className="default"
                          />

                          <img
                            alt=""
                            src={toAbsoluteUrl(tab.iconColored)}
                            className="active"
                          />
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

                <div  style={{display: (tabSel != 2)  ? "block" : "none"  }} >
                  <div className="card-body d-lg-flex align-items-lg-center justify-content-lg-between flex-lg-wrap border mt-2 mb-2">
                    <div className="row w-100" id="efi-chartzpMovilAgrupado">
                      {(OpcionesAcumulado != null) && (
                        <ReactApexChart
                          options={OpcionesAcumulado.options}
                          series={OpcionesAcumulado.series} type="bar"
                          height={200}
                          />)}
                    </div>
                  </div>
                  <div className="card" id="efi-chartzpMovil" style={{ border: '1px solid #5ab55e', borderRadius: '5px' }}>
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
                </div>
                <div className={`tab-pane fade ${tabSel === 0 ? "show active" : ""}`} id="tab0_content" >
                  {/* begin::Cards */}
                  <div className="overflow-auto">
                    {(DateTableMovil.length != 0) && (ColumnasTablas[0]['movil'] != undefined) && (<MaterialReactTable
                      // tableInstanceRef={ColumnasTablas['movil']}
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
                      columns={ColumnasTablas[0]['movil']}
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
                      enableDensityToggle = {false}
                      enableRowVirtualization
                      defaultColumn={{
                        minSize: 150, //allow columns to get smaller than default
                        maxSize: 400, //allow columns to get larger than default
                        size: 150, //make columns wider by default
                      }}
                      muiTableContainerProps={{
                        sx: { maxHeight: '400px' }, //give the table a max height
                      }}
                      initialState={{ density: 'compact'}}
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
                  {/* end::Cards      */}
                </div>
                {/* end::Tab Pane 1 */}

                {/* begin::Tab Pane 2 */}
                <div className={`tab-pane fade ${tabSel === 1 ? "show active" : ""}`} id="tab1_content">
                  {/* begin::Cards */}
                  <div className="overflow-auto">
                    {/*Tabla de los operadores */}
                    {(DateTableMovil.length != 0) && (ColumnasTablas[1]['operador'] != undefined) && (<MaterialReactTable
                      // tableInstanceRef={ColumnasTablas['movil']}
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
                      columns={ColumnasTablas[1]['operador']}
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
                      enableDensityToggle = {false}
                      enableRowVirtualization
                      defaultColumn={{
                        minSize: 150, //allow columns to get smaller than default
                        maxSize: 400, //allow columns to get larger than default
                        size: 150, //make columns wider by default
                      }}
                      muiTableContainerProps={{
                        sx: { maxHeight: '400px' }, //give the table a max height
                      }}
                      initialState={{ density: 'compact'}}
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
                  {/* end::Cards      */}
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
                                <div className="text-center"><label className="label control-label label-sm fw-bolder" style={{ fontSize: '16px' }}>Zonas:EV: 4. Potencia [150&lt;P&lt;175]</label></div>
                               {(Totales.length != 0) && (<MaterialReactTable
                                    // tableInstanceRef={ColumnasTablas['movil']}
                                    displayColumnDefOptions={{
                                      'mrt-row-actions': {
                                        muiTableHeadCellProps: {
                                          align: 'center',
                                        },
                                        size: 0,
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
                              <div className="col-xs-6 col-sm-6 col-md-6">
                                <div className="text-center"><label className="label control-label label-sm fw-bolder" style={{ fontSize: '16px' }}>Zonas:EV: 5. Potencia [&gt;175]</label></div>
                                {(TotalesV5.length != 0) && (<MaterialReactTable
                                    // tableInstanceRef={ColumnasTablas['movil']}
                                    displayColumnDefOptions={{
                                      'mrt-row-actions': {
                                        muiTableHeadCellProps: {
                                          align: 'center',
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
      <Modal show={showModal} onHide={setShowModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title> Filtro por vehiculos o conductores</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
              <SelectVehiculos />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={() => {
            setSeleccionados([]);
            /*/actualizamos los filtros/ */
            let tiporeporte = [...TipoReporte];
            tiporeporte[tabSel].filtros = { ...TipoReporte[0].filtros, Vehiculos: [], Operadores: [] };
            setTipoReporte(tiporeporte)
          }}>
            Limpiar
          </Button>
          <Button type="button" variant="primary" onClick={() => { setShowModal(false); }}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export { ReporteZpMovilOperador as ZPOperadorMovilPrincipal }