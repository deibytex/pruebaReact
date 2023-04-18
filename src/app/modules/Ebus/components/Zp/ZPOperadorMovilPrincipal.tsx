
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import moment from 'moment-timezone';
import { useEffect, useState } from "react";
import { Tab, Tabs, TabPane, TabContainer, TabContent, Form, Modal, Button  } from "react-bootstrap-v5";
import { DateRangePicker, useToaster } from "rsuite";
import DatePicker from 'rsuite/DatePicker';
import {formatFechasView, formatSimple} from "../../../../../_start/helpers/Helper"
import { AxiosResponse } from 'axios';
import { GetReporteOperadorMovil } from '../../data/ZPOperadorMovil';
import { useDataZpOperadorMovil } from '../../core/ZpOperadorMovilProvider';
import { Graficas } from './Graficas';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { GetClientesEsomos } from "../../data/NivelCarga";
import { ClienteDTO, InicioCliente } from '../../../../../_start/helpers/Models/ClienteDTO';
import { errorDialog } from '../../../../../_start/helpers/components/ConfirmDialog';
import { FiltrosReportes } from '../../models/ZpOperadorMovilModels';
import { FormatoColombiaDDMMYYY } from '../../../../../_start/helpers/Constants';
import DualListBox from 'react-dual-listbox';
import { dualList } from '../../../../../_start/helpers/Models/DualListDTO';
import { truncate } from 'fs';
import BlockUi from 'react-block-ui';
type Props = {

}
const  ZPOperadorMovilPrincipal : React.FC<Props> = ({}) => {
    const { fechaInicial, fechaFinal, setfechaInicial, setfechafinal } = useDataZpOperadorMovil();
    // const [fechaFiltro, setfechaFiltro] = useState<string>(moment().startOf('day').add(-1, 'days').toString());
    // const [fechaactual, setfechaactual] = useState<string>(moment().endOf('day').startOf('day').toString());
    const { allowedMaxDays, allowedRange } = DateRangePicker;
    let filtrosBase : FiltrosReportes = {
        FechaInicial: moment().startOf('day').add(-7, 'days').toDate(),
        FechaFinal: moment().startOf('day').toDate(),
        IndGrafica: -1,
        FechaGrafica: "",
        Vehiculos: [],
        Operadores: null,
        limitdate: 180,
        indexSeleccionado: -1,
        fechaFiltroGrafica: null
    }

     moment.tz.setDefault("America/Bogota");

    const [idxSeleccionado, setidxSeleccionado] = useState<number>(-2);
    const [filtros, setFiltros] = useState<FiltrosReportes>(filtrosBase);
    const [key, setKey] = useState('Movil');
    const [fechaInicialDiario, setfechaInicialDiario] = useState<string>(moment().startOf('day').add(-5, 'days').toString());
    const [loader, setloader] = useState<boolean>(false);
    const [tabSel, settabSel] = useState<number>(0);
    const [opciones, setOpciones] = useState<any>(null);
    const [Acumulado, setAcumulado] = useState<any>(null);
    const [DateTableMovil, setDateTableMovil] = useState<any[]>([]);
    const [DateTableOperador, setDateTableOperador] = useState<any[]>([]);

    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [lablesAxisx, setlablesAxisx] = useState<string[]>([]);
    const [lablesAxisxAcumulado, setlablesAxisxAcumulado] = useState<string[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [lstVehiculos, setlstVehiculos] = useState<dualList[]>([]);
    const [lstSeleccionados, setSeleccionados] = useState<string[]>([]);
     // declaracion de variables
    const btmOperador = [
        '<button class="btn btn-sm btn-primary ml-2 mr-2 btnFiltroOperador" title = "Filtro Operador" id = "btnFiltroOperador">',
        '  <i class="fa-floating-icon fas fa-user"></i>',
        ' </button>',
        '<button class="btn btn-sm btn-primary descargarExcel"><i class="icon-statistics mr-2"></i> Excel</button>'
    ]
    const btmVehiculo = [
        '<button class="btn btn-sm btn-primary ml-2 mr-2 btnFiltroVehiculo" title="Filtro vehiculos" id="btnFiltroVehiculo">',
        '<i class="fa-floating-icon fas fa-car"></i>',
        '</button>',
        '<button class="btn btn-sm btn-primary descargarExcel"><i class="icon-statistics mr-2"></i> Excel</button>'
    ]

    //TABLES
     //table state
        const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
        const [globalFilter, setGlobalFilter] = useState('');
        const [sorting, setSorting] = useState<SortingState>([]);
        const [pagination, setPagination] = useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });
        const [rowCountMovil, setRowCountMovil] = useState(0);
        const [rowCountOperador, setrowCountOperador] = useState(0);
        
        const [isLoading, setIsLoading] = useState(false);
        const [isRefetching, setIsRefetching] = useState(false);
        const [isError, setIsError] = useState(false);
  //TABLES
// variable que contiene los filtros del sistema

const TipoReporte = [
    /*{ reporte: tblmovilmes, tabla: tblmovilmes, filtros: { ...filtrosBase }, botonesFiltros: btmVehiculo, Data: null, tipo: 1 },*/
    { reporte: "tblmovildia", tabla: "tblmovildia", filtros: { ...filtrosBase }, botonesFiltros: btmVehiculo, Data: [], tipo: 1 },
    { reporte: "tbloperadordia", tabla: "tbloperadordia", filtros: { ...filtrosBase }, botonesFiltros: btmOperador, Data: [], tipo: 2 },
    { reporte: "tbloperadorgrafica", tabla: "tbloperadorgrafica", filtros: { ...filtrosBase }, botonesFiltros: btmOperador, Data: [], tipo: 3 },
]

// filtros para los que son diarios, maximo 30 dias

// moment().startOf('day')
TipoReporte[1].filtros.FechaInicial = (fechaInicial != undefined ? fechaInicial : moment().startOf('day').startOf('day').add(-5, 'days').toDate());
TipoReporte[1].filtros.FechaFinal = (fechaFinal != undefined ? fechaFinal : moment().startOf('day').toDate());
TipoReporte[1].filtros.fechaFiltroGrafica = moment().startOf('day').toString();
TipoReporte[1].filtros.limitdate = 5;
const toaster = useToaster();
useEffect(
    () => {
        GetClientesEsomos().then((response:AxiosResponse<any>) =>{
            setClientes(response.data);
            setClienteSeleccionado(response.data[0])
         
        }).catch((error) =>{
            console.log(error);
            errorDialog("<i>Eror al consultar los clientes</i>","")
        })

      return () =>  setClientes([]);
    }, []
)

useEffect(() => {

    // consulta la informacion de las alarmas cuando 
    // cambia el ciente seleecionado y las fechas 
    if (ClienteSeleccionado.clienteIdS != 0 )
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
          stacked: true
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
            events: {
              dataPointSelection: function (event: any, chartContext: any, config: any) {
                // seleccionamos el index de la grafica para posteriormente filtrar
                setidxSeleccionado(config.dataPointIndex);
              }
            }
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

    if (allowedMaxDays)
        allowedMaxDays(7);

    if (allowedRange)
        allowedRange(moment().add(-6, "months").toDate(), moment().toDate());
    return function cleanUp() {
        //SE DEBE DESTRUIR EL OBJETO CHART
    };

  }, [ClienteSeleccionado]);

  useEffect(() => {
    // VALIDAMOS EL INDEX SELECCIONADO
    if (idxSeleccionado !== -2) // lo hacemos para que no dispare varias veces el llamado de la base de datos la primera vez que se carga
      setFiltros({...filtros,IndGrafica: idxSeleccionado,FechaGrafica: lablesAxisx[idxSeleccionado] });
      return function cleanUp() {
    };
  }, [idxSeleccionado])

  useEffect(() => {
    if (idxSeleccionado !== -2)// lo hacemos para que no dispare varias veces el llamado de la base de datos la primera vez que se carga
        Consultar();
    return function cleanUp() {
    };
    
    
  }, [filtros])

const Consultar = () =>{
    let validar = ValidacionFechas();
        if (validar) {
            ObtenerDatos(null);
        }
        else
            filtarDatosSistema();
}

let ColumnasTablas:any[] = [{"movil": [
    {
        accessorKey: 'Movil',
        header: 'Movil',
        Header:'Móvil',
        Cell(row:any) {
            return (row.row.original.Movil)
        },
        size: 100
    },
    {
        accessorKey: 'Fecha',
        header: 'Fecha',
        Header:'Fecha',
        Cell(row:any) {
            return (moment(row.row.original.Fecha).format(formatFechasView))
        }
    },
    {
        accessorKey: 'EV0Regeneracion0P',
        header: 'EV0Regeneracion0P',
        Header: 'EV: 0. Regeneración 0< P',
        Cell(row:any) {
            return (RetornarLabel(`${(row.row.original.EV0Regeneracion0P != 0 ? row.row.original.EV0Regeneracion0P/row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
    },
    {
        accessorKey: 'EV1Potencia0P50',
        header: 'EV1Potencia0P50',
        Header: "EV: 1. Potencia 0<P<50",
        Cell(row:any) {
            return (RetornarLabel(`${(row.row.original.EV1Potencia0P50 != 0 ? row.row.original.EV1Potencia0P50/row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
    },
    {
        accessorKey: 'EV2Potencia50P100',
        header: 'EV2Potencia50P100',
        Header:'EV: 2. Potencia 50<P<100',
        Cell(row:any) {
            return (RetornarLabel(`${(row.row.original.EV2Potencia50P100  != 0 ? row.row.original.EV2Potencia50P100 /row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
    },
    {
        accessorKey: 'EV3Potencia100P150',
        header:'EV3Potencia100P150',
        Header: "EV: 3. Potencia 100<P<150",
        Cell(row:any) {
            return (RetornarLabel(`${(row.row.original.EV3Potencia100P150 != 0 ? row.row.original.EV3Potencia100P150 /row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`)) 
        }
    },
    {
        accessorKey: 'EV4Potencia150P175',
        header:'EV4Potencia150P175',
        Header: "EV: 4. Potencia 150<P<175",
        Cell(row:any) {
            return (RetornarLabel(`${(row.row.original.EV4Potencia150P175 != 0 ? row.row.original.EV4Potencia150P175 /row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
    },
    {
        accessorKey: 'EV5Potencia175',
        header:'EV5Potencia175',
        Header: "EV: 5. Potencia >175",
        Cell(row:any) {
            return (RetornarLabel(`${(row.row.original.EV5Potencia175 != 0 ? row.row.original.EV5Potencia175 /row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
    }]}, {"operador":[
    {
        accessorKey: 'Operador',
        header: 'Operador',
        Header: 'Operador',
        Cell(row:any) {
            return (row.row.original.Operador)
        },
        size: 400
    },
    {
        accessorKey: 'Fecha',
        header: 'Fecha',
        Header: "Fecha",
        Cell(row:any) {
            return (moment(row.row.original.Fecha).format(formatFechasView))
        }
    },
    {
        accessorKey: 'EV0Regeneracion0P',
        header: 'EV0Regeneracion0P',
        Header: "EV: 0. Regeneración 0< P",
        Cell(row:any) {
            return (RetornarLabel(`${(row.row.original.EV0Regeneracion0P != 0 ? row.row.original.EV0Regeneracion0P/row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`)) 
        }
    },
    {
        accessorKey: 'EV1Potencia0P50',
        header: 'EV1Potencia0P50',
        Header: "EV: 1. Potencia 0<P<50",
        Cell(row:any) {
            return (RetornarLabel(`${ (row.row.original.EV1Potencia0P50 != 0 ? row.row.original.EV1Potencia0P50/row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
    },
    {
        accessorKey: 'EV2Potencia50P100',
        header: 'EV2Potencia50P100',
        Header: "EV: 2. Potencia 50<P<100",
        Cell(row:any) {
            return (RetornarLabel(`${(row.row.original.EV2Potencia50P100 != 0 ? row.row.original.EV2Potencia50P100/row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
    },
    {
        accessorKey: 'EV3Potencia100P150',
        header: 'EV3Potencia100P150',
        Header: "EV: 3. Potencia 100<P<150",
        Cell(row:any) {
            return (RetornarLabel(`${(row.row.original.EV3Potencia100P150 != 0 ? row.row.original.EV3Potencia100P150/row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
    },
    {
        accessorKey: 'EV4Potencia150P175',
        header: 'EV4Potencia150P175',
        Header: "EV: 4. Potencia 150<P<175",
        Cell(row:any) {
            return (RetornarLabel(`${(row.row.original.EV4Potencia150P175 != 0 ? row.row.original.EV4Potencia150P175/row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
    },
    {
        accessorKey: 'EV5Potencia175',
        header: 'EV5Potencia175',
        Header: "EV: 5. Potencia >175",
        Cell(row:any) {
            return (RetornarLabel(`${(row.row.original.EV5Potencia175 != 0 ? row.row.original.EV5Potencia175/row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
        }
    }
]}];

    const RetornarLabel = (Data:any) => {
        return <span >{Data}</span>;
    };

    function ObtenerDatos(key:any|null|undefined) {
        setIsError(false)
        setIsLoading(true)
        setIsRefetching(true)
        setloader(true)
        let fechainicial = moment(fechaInicial).format(formatSimple);
        let fechafinal = moment(fechaFinal).format(formatSimple);
        GetReporteOperadorMovil(fechainicial,fechafinal, (key == null || key == undefined ? "0": key.toString())).then((response:AxiosResponse<any>) =>{
            TipoReporte[tabSel].Data = response.data;
             // vamos a llenar la informacion de los movils
          let lstVehiculos = (response.data as any[]).reduce((p, c) => {
            let movil = (c["Movil"] == undefined ? c["Operador"]: c["Movil"]);
            let isExists = p.filter((f: any) => f["value"] === movil);
            if (isExists.length == 0)
              p.push({ "value": movil, "label": movil })
            return p;
          }, []);
          // listados de vehiculos de los datos que traemos
          setlstVehiculos(lstVehiculos);
            // setModales();
            filtarDatosSistema();
            setIsLoading(false)
            setIsRefetching(false)
            setRowCountMovil(response.data.length)
            setloader(false)
        }).catch((error) =>{
            console.log("Error");
            setIsError(true);
            setloader(false);
            setIsLoading(false)
            setIsRefetching(false)
        }).finally(() =>{
            setloader(false);
        })
    };
    // carga la informacion de los modales segun la informacion extraida por los datos

// valida los rango de fecha
// y tambien valida que no se deba volver a visitar el servidor a menos que las fechas
//iniciales y finales cambien
function ValidacionFechas() {
    let filtros = TipoReporte[tabSel].filtros;
    let data = TipoReporte[tabSel].Data;
    let fi = (fechaInicial == undefined ? moment().startOf('day').startOf('day').add(-5, 'days').toDate() : fechaInicial);
    let ff = (fechaFinal == undefined ? moment().endOf('day').startOf('day').toDate(): fechaFinal);
    let flag = false;

    if (ff < fi) {
        alert("la fecha inicial debe ser menor a la fecha final")
        setDatosInicialesFechas();
        return false
    }
    
    // si la fecha inicial es menor a la fecha inicial del sistema o la fecha final es mayor que la fecha infial debe consultar al servidor
    flag = filtros.FechaInicial > fi || ff > filtros.FechaFinal || data.length == 0 || (filtros.FechaInicial > fi && filtros.FechaFinal > ff);

    // cambiamos los datos iniciales 
    if (filtros.FechaInicial > fi || (filtros.FechaFinal > fi && filtros.FechaFinal > ff))
        filtros.FechaInicial = fi;
    if (ff > filtros.FechaFinal || (filtros.FechaFinal > fi && filtros.FechaFinal > ff)) {

        filtros.FechaFinal = ff;
    }

    // asignamos los filtros actuales
    // retorna true si debe consultar los datos en servidor 
    return flag;
}
// funcion que cambia el rango de fechas por tipo de reporte
// 6 meses y ultimos 30 dias respectivamente
function setDatosInicialesFechas() {
    let filtros = TipoReporte[tabSel].filtros;
    // $(`${reporte_fecha_final}`).data('daterangepicker').setStartDate(filtros.fechafinal.format(formatViewHoraMinuto))
}
function changeDateControl() {
    let filtros = TipoReporte[tabSel].filtros;
    let tiporeporte = TipoReporte[tabSel].tipo;
}

useEffect(() =>{
    ObtenerDatos(null);
    // ColumnasTablas.push({movil});
    // ColumnasTablas.push({operador});
    return () => {TipoReporte[tabSel].Data = []}
},[])

useEffect(() =>{
    setRowCountMovil(DateTableMovil.length);
    return () =>  setRowCountMovil(0)
}, [DateTableMovil])

useEffect(() =>{
    setrowCountOperador(DateTableOperador.length)
    return () =>  setrowCountOperador(0)
},[DateTableOperador])

const filtarDatosSistema = () =>{
    const tabla = TipoReporte[tabSel].tabla;
    let filtros = TipoReporte[tabSel].filtros;
    let fechaGraficaActual = filtros.FechaGrafica;
    let FechaInicial: Date = filtros.FechaInicial;
    let FechaFinal: Date = filtros.FechaFinal;
     // datos traidos del c liente
     let datosfiltrados = TipoReporte[tabSel].Data;
     let filtrotablaini = filtros.FechaInicial;
     let filtrotablafin = filtros.FechaFinal;
     if (filtros.IndGrafica != -1) {
        FechaInicial = moment(filtros.FechaGrafica, FormatoColombiaDDMMYYY).toDate();
        FechaFinal = moment(filtros.FechaGrafica, FormatoColombiaDDMMYYY).toDate();
      }
    
  // filtramos por las fechas
  datosfiltrados = datosfiltrados.
  filter((f:any) => moment(f.Fecha).toDate() >= FechaInicial && moment(f.Fecha).toDate() <= FechaFinal);
    // filtramos por los vehivulos
    if (filtros.Vehiculos.length > 0) {
        datosfiltrados = datosfiltrados.filter((f:any) => filtros.Vehiculos.indexOf(f.Movil) > -1);
    }
    // filtra por operadores a los reportes que se necesiten
    if (filtros.Operadores != null &&  filtros.Operadores.length > 0 && [0, 1].includes(tabSel)) {
        datosfiltrados = datosfiltrados.filter(function (o) {
            return (filtros.Operadores != null) ? filtros.Operadores.indexOf(o['Operador']) > -1 : [];
        });
    };
    // para la grafica filtra por el rango total
    // agrupamos los datos para la grafica
    let agrupadofecha = datosfiltrados
    .reduce((p:any, c:any) => {
        let name = c.Fecha;
        p[name] = p[name] ?? [];
        p[name].push(c);
        return p;
    }, {});

    //Agrupamos por operador
    let agrupadoOperador = datosfiltrados
        .reduce((p:any, c:any) => {
            let name = c.Operador;
            p[name] = p[name] ?? [];
            p[name].push(c);
            return p;
        }, {});
    
   

    let labels = new Array();
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

    datosfiltrados.map((item:any) => {
        PorEV0Agrupado = PorEV0Agrupado + item.EV0Regeneracion0P;
        PorEV1Agrupado = PorEV1Agrupado + item.EV1Potencia0P50;
        PorEV2Agrupado = PorEV2Agrupado + item.EV2Potencia50P100;
        PorEV3Agrupado = PorEV3Agrupado + item.EV3Potencia100P150;
        PorEV4Agrupado = PorEV4Agrupado + item.EV4Potencia150P175;
        PorEV5Agrupado = PorEV5Agrupado + item.EV5Potencia175;
    });

    Object.entries(agrupadofecha).map((elem:any) => {
        labels.push(moment(elem[0]).format(formatFechasView));
        // totalizamos por propiedad que se necesite
         // totalizamos por propiedad que se necesite
        let EV0Regeneracion0P = (elem[1].map((m:any) => { return m.EV0Regeneracion0P }).reduce((a:any, b:any) => a + b, 0));
        let EV1Potencia0P50 = (elem[1].map((m:any) => { return m.EV1Potencia0P50 }).reduce((a:any, b:any) => a + b, 0));
        let EV2Potencia50P100 = (elem[1].map((m:any) => { return m.EV2Potencia50P100 }).reduce((a:any, b:any) => a + b, 0));
        let EV3Potencia100P150 = (elem[1].map((m:any) => { return m.EV3Potencia100P150 }).reduce((a:any, b:any) => a + b, 0));
        let EV4Potencia150P175 = (elem[1].map((m:any) => { return m.EV4Potencia150P175 }).reduce((a:any, b:any) => a + b, 0));
        let EV5Potencia175 = (elem[1].map((m:any) => { return m.EV5Potencia175 }).reduce((a:any, b:any) => a + b, 0));
        let EVTotal = (
            elem[1].map((m:any) => {
                return (m.Total)
            }).reduce((a:any, b:any) => a + b, 0));
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
    let LabelPeriodo = ["Periodo"];
    setlablesAxisxAcumulado(LabelPeriodo)
    
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
      ApexCharts.exec('apexchart-acumulado', 'updateOptions', {
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
          categories: LabelPeriodo
        }
      });
        // funcion que actualiza los datos de las series
      // se debe pasar el id configurado al momento de su creaci'on para poder
      // actializar los datos
      ApexCharts.exec('apexchart-example', 'updateSeries', [{
        name: 'EV: 0. Regeneración 0< P',
        data: Ev0
      },{
        name: 'EV: 1. Potencia 0<P<50',
        data: Ev1
      },{
        name: 'EV: 2. Potencia 50<P<100',
        data: Ev2
      },{
        name: 'EV: 3. Potencia 100<P<150',
        data: Ev3
      },{
        name: 'EV: 4. Potencia 150<P<175',
        data: Ev4
      },{
        name: 'EV: 5. Potencia >175',
        data: Ev5
      }]);
      //Agrupado
      ApexCharts.exec('apexchart-acumulado', 'updateSeries', [{
        name: 'EV: 0. Regeneración 0< P',
        data: Ev0Agrupado
      },{
        name: 'EV: 1. Potencia 0<P<50',
        data: Ev1Agrupado
      },{
        name: 'EV: 2. Potencia 50<P<100',
        data: Ev2Agrupado
      },{
        name: 'EV: 3. Potencia 100<P<150',
        data: Ev3Agrupado
      },{
        name: 'EV: 4. Potencia 150<P<175',
        data: Ev4Agrupado
      },{
        name: 'EV: 5. Potencia >175',
        data: Ev5Agrupado
      }]);
      setDateTableMovil(datosfiltrados);

};

const OnClickTabs = (event:any) =>{
    setKey(event)
    // asignamos el index tab seleccinado apra poder realizar las consultas
    let Tab = (event == "Movil" ? 0 : (event == "Operador" ? 1 : 2));

   settabSel(Tab);
    changeDateControl()
    //RenderGrafica()
    let data = TipoReporte[Tab].Data
    if (data.length == 0) {
       // BlockStart();
        ObtenerDatos(Tab);
    } else {
        //setModales();
        filtarDatosSistema();
    }
    // (tabSel > 1) ? $(ind_graficaInicial).css("display", "none") : $(ind_graficaInicial).css("display", "block");
    // (tabSel > 1) ? $(ind_graficaAgrupada).css("display", "none") : $(ind_graficaAgrupada).css("display", "block");
    // ;
}
function CargaListadoClientes( ) {
    return (           
        <Form.Select   className=" mb-3 " onChange={(e) => {
            // buscamos el objeto completo para tenerlo en el sistema
            let lstClientes =  Clientes?.filter((value:any, index:any) => {
                return value.clienteIdS === Number.parseInt(e.currentTarget.value)
            })  
            if(lstClientes !== undefined && lstClientes.length > 0)
                setClienteSeleccionado(lstClientes[0]);
        }} aria-label="Default select example"  defaultValue={ClienteSeleccionado?.clienteIdS}>
            
            {                        
                Clientes?.map((element:any,i:any) => {
                        
                    return (<option key={element.clienteIdS}   value={(element.clienteIdS != null ? element.clienteIdS:0)}>{element.clienteNombre}</option>)
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
              setFiltros({
                ...filtros,
                Vehiculos: selected
              });
            }}
          />
        );
      }

    return (
        <>
         <BlockUi tag="div" keepInView blocking={loader ?? false}  >  
            <div className="card">
                <div className='card-header'>
                    <div className='float-rigth'>
                        <CargaListadoClientes></CargaListadoClientes>
                    </div>
                </div>
                <div className="card-body">
                    <Tabs transition={false}  activeKey={key} onSelect={OnClickTabs} id="rep_operadormovil" className="nav nav-tabs nav-tabs-highlight mb-3" style={{backgroundColor: '#d4edda',borderRadius: '10px 10px 0px 0px !important' }}>
                        <Tab eventKey="Movil" title="Movil">
                            {(DateTableMovil.length != 0) &&(<Graficas FnConsultar={Consultar} ShowModal={() => { setShowModal(true); } } opciones={opciones} acumulado={Acumulado} Titulo={'Vehiculos'}></Graficas>)}
                            <div className="" id="solid-movil">
                                {/*Tabla de los moviles */}
                                {(DateTableMovil.length != 0) && (ColumnasTablas[0]['movil'] != undefined) && ( <MaterialReactTable
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
                        </Tab>
                        <Tab eventKey="Operador" title="Operador">
                           {(DateTableMovil.length != 0) && ( <Graficas FnConsultar={Consultar} ShowModal={() => { setShowModal(true); } } opciones={opciones} acumulado={Acumulado} Titulo={'Conductores'}></Graficas>)}
                            <div className="" id="solid-operador">
                                {/*Tabla de los operadores */}
                                {(DateTableMovil.length != 0) && (ColumnasTablas[1]['operador'] != undefined) && ( <MaterialReactTable
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
                                  rowCount={rowCountOperador}
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
                        </Tab>
                        <Tab eventKey="Zonas" title="Zonas Operador">
                        <Graficas FnConsultar={Consultar} ShowModal={() => { setShowModal(true); } } opciones={opciones} acumulado={Acumulado} Titulo={'Conductores'}></Graficas>
                            <div className="" id="solid-operadorgrafica">
                                <div className="card" style={{border: '1px solid #5ab55e', borderRadius:'5px'}}>
                                    <div className="card-body">
                                        <div className="chart-container">
                                            <div className="row">
                                                <div className="col-xs-6 col-sm-6 col-md-6" style={{height: '400px', overflowY: 'scroll'}}>
                                                    <div className="text-center"><label className="label control-label label-sm font-weight-bold" style={{fontSize: '16px'}}>Zonas:EV: 4. Potencia [150&lt;P&lt;175]</label></div>
                                                    <div className="chart" id="ZpZonaOperador"></div>
                                                </div>
                                                <div className="col-xs-6 col-sm-6 col-md-6" style={{height: '400px', overflowY: 'scroll'}}>
                                                    <div className="text-center"><label className="label control-label label-sm font-weight-bold" style={{fontSize: '16px'}}>Zonas:EV: 5. Potencia [&gt;175]</label></div>
                                                    <div className="chart" id="ZpZonaOperadorEv5"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
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
                    <Button type="button" variant="secondary" onClick={() => { setSeleccionados([]);  /*actualizamos los filtros*/setFiltros({ ...filtros, Vehiculos: [] }) }}>
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
export {ZPOperadorMovilPrincipal}