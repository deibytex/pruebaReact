import moment from "moment";
import { useEffect, useRef, useState} from "react";
import { GetDataEficiencia,  listTabsEficiencia } from "../../data/ReportesData";
import { PageTitle } from "../../../../../_start/layout/core";
import { DateRangePicker, Notification, Placeholder, useToaster } from "rsuite";
import BlockUi from "@availity/block-ui";
import { DescargarExcel } from "../../../../../_start/helpers/components/DescargarExcel";
import MaterialReactTable, { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import { FormatoColombiaDDMMYYY,  FormatoSerializacionYYYY_MM_DD_HHmmss } from "../../../../../_start/helpers/Constants";
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
import { formatNumberChart, locateFormatNumberNDijitos, locateFormatPercentNDijitos, msToTimeSeconds } from "../../../../../_start/helpers/Helper";
import { Box } from "@mui/material";
import { DrawDynamicIconMuiMaterial } from "../../../../../_start/helpers/components/IconsMuiDynamic";
import { subDays, addDays } from "rsuite/esm/utils/dateUtils";




export default function ReporteEficiencia() {

  let filtrosBase: FiltrosReportes = {
    FechaInicialInicial: moment().add(-6, 'months').startOf('day').toDate(),
    FechaFinalInicial: moment().startOf('day').toDate(),
    FechaInicial: moment().add(-6, 'months').startOf('day').toDate(),
    FechaFinal: moment().startOf('day').toDate(),
    IndGrafica: -1,
    FechaGrafica: "",
    Vehiculos: [],
    Operadores: [],
    limitdate: 180
  }


  const FechaInicialDiario = moment().add(-7, 'days').startOf('day').toDate();
  let getListadoCampoPorTipo = (EsMovil: boolean, EsDiario: boolean) => {
    let listadoCamposOperador: MRT_ColumnDef<any>[] =
      [
        {
          accessorKey: `${EsMovil ? 'Movil' : 'Operador'}`,
          header: `${EsMovil ? 'Móvil' : 'Operador'}`
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
          accessorKey: 'Distancia',
          header: 'Distancia [km]',
          Cell({ cell, column, row, table, }) {
            return (locateFormatNumberNDijitos(row.original.Distancia ?? 0, 2))
          }
        },
        {
          accessorKey: 'Duracion',
          header: 'Dur[h]',
          Cell({ cell, column, row, table, }) {
            return  msToTimeSeconds ((row.original.Duracion *3600 ?? 0))
          }
        },
        {
          accessorKey: 'Energia',
          header: 'Energía [kWh]',
          Cell({ cell, column, row, table, }) {
            return (locateFormatNumberNDijitos(row.original.Energia ?? 0, 2))
          }
        },
        {
          accessorKey: 'Eficiencia',
          header: 'Efic [km/kWh]',
          Cell({ cell, column, row, table, }) {
            return (locateFormatNumberNDijitos(row.original.Eficiencia ?? 0, 2))
          }
        },
        {
          accessorKey: 'Regeneracion',
          header: 'Regen [%]',
          Cell({ cell, column, row, table, }) {
            return (locateFormatPercentNDijitos(row.original.Regeneracion ?? 0, 2))
          }
        },
        {
          accessorKey: 'VelProm',
          header: 'VelProm [km/h]',
          Cell({ cell, column, row, table, }) {
            return (locateFormatNumberNDijitos(row.original.VelProm ?? 0, 2))
          }
        },
        {
          accessorKey: 'Dsoc',
          header: 'DSOC'
        }

      ];
    let listadoCamposMovil: MRT_ColumnDef<any>[] = [...listadoCamposOperador];

    listadoCamposMovil.splice(9, 0,
      {
        accessorKey: 'Descarga',
        header: 'E. Descarga [kWh]',
        Cell({ cell, column, row, table, }) {
          return (locateFormatNumberNDijitos(row.original.Descarga ?? 0, 2))
        }
      },
      {
        accessorKey: 'Carga',
        header: 'E. Carga [kWh]',
        Cell({ cell, column, row, table, }) {
          return (locateFormatNumberNDijitos(row.original.Carga ?? 0, 2))
        }
      }
    );

    return EsMovil ? listadoCamposMovil : listadoCamposOperador;
  }
  const TipoReporteBase = [
    {
      reporte: "Móvil Mensual", columnas: getListadoCampoPorTipo(true, false),
      filtros: { ...filtrosBase, MaxDay: 31 }, tipo: 1, Data: [], consultar: true, EsMovil: true
    },
    {
      reporte: "Móvil Diario", columnas: getListadoCampoPorTipo(true, true),
      filtros: {
        ...filtrosBase, MaxDay: 7,
        FechaInicialInicial: FechaInicialDiario,
        FechaInicial: FechaInicialDiario
      }, tipo: 2, Data: [], consultar: true, EsMovil: true
    },
    { reporte: "Operador Mensual", columnas: getListadoCampoPorTipo(false, false), filtros: { ...filtrosBase, MaxDay: 31 }, tipo: 1, Data: [], consultar: true },
    {
      reporte: "Operador Diario", columnas: getListadoCampoPorTipo(false, true), filtros: {
        ...filtrosBase, MaxDay: 7,
        FechaInicialInicial: FechaInicialDiario,
        FechaInicial: FechaInicialDiario
      }, tipo: 2, Data: [], consultar: true
    }
  ]

  const [TipoReporte, setTipoReporte] = useState(TipoReporteBase);
  const [tabSel, settabSel] = useState<number>(0);
  const [lstIndicadores, setListIndicadores] = useState<any>({
    "Distancia [km]": 0,
    "Eficiencia [km/kWh]": 0,
    "Regeneración [%]": 0,
    "VelProm [km/h]": 0,
  });
  const { allowedMaxDays, allowedRange, combine, before, after } = DateRangePicker;

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
  const [lstVehiculos, setlstVehiculos] = useState<dualList[]>([]);
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

  return ()=>{
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
              return val.toFixed(1);
            }
          },
          title: {
            text: "Eficiencia  [kWh]"
          }
        },
        {
          showAlways: true,
          tickAmount: 5,
          min: 0,
          max: 120,
          opposite: true,
          title: {
            text: "VelProm[km/h] - Regeneracion[%]"
          }, labels: {
            formatter: function (val: number, index: any) {
              return val.toFixed(0);
            }
          }
        },
        {
          min: 0,
          max: 1,
          opposite: true,
          show: false, labels: {
            formatter: function (val: number, index: any) {
              return locateFormatPercentNDijitos(val, 2)
            
            }
          }
        }
        ],
        dataLabels: {

          enabled: true,
          enabledOnSeries: true,
          formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {

            return seriesIndex == 2 ? locateFormatPercentNDijitos(value, 2) : locateFormatNumberNDijitos(value, 2)
          },

        }
      },
      series: []

    }

    let defaultopcionesDistancia = {
      options: {
        chart: {
          id: 'totalDistancia',
          fontFamily: 'Montserrat',
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
              return formatNumberChart(val);
            }
          },
          title: {
            text: "Distancia [km]"
          }
        }
        ],
        dataLabels: {
          enabled: true,
          enabledOnSeries: true,
          formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {
            return formatNumberChart(value)
          },

        },
        plotOptions: {
          line: {
            dataLabels: {
              position: 'top'
            }
          }
        }
      },
      series: []

    }
    // asingamos las opciones
    setOpciones(defaultopciones)
    setAcumulado(defaultopcionesDistancia)

    
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
      GetDataEficiencia(moment(TipoReporte[tabSel].filtros.FechaInicial).format(FormatoSerializacionYYYY_MM_DD_HHmmss)
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
         
          setisCallData(false)
          // vamos a llenar la informacion de los movils
          let lstVehiculos = (response.data as any[]).reduce((p, c) => {
            let movil = (TipoReporte[tabSel].EsMovil) ? c["Movil"] : c["Operador"];
            let isExists = p.filter((f: any) => f["value"] === movil);
            if (isExists.length == 0)
              p.push({ "value": movil, "label": movil })
            return p;
          }, []);
          // listados de vehiculos de los datos que traemos
          setlstVehiculos(lstVehiculos);
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
      let fecha = filtros.FechaGrafica
      if(!EsDiario ){
        let mensual : string[] = filtros.FechaGrafica?.split('-') ?? ['2023','01'];
        fecha = `01/${mensual[1].padStart(2,'0')}/${mensual[0]}`;
      }
      FechaInicial = moment(fecha, FormatoColombiaDDMMYYY).toDate();
      FechaFinal = moment(fecha, FormatoColombiaDDMMYYY).toDate();
    }


    // filtramos por las fechas
    datosFiltrados = datosFiltrados.
      filter(f =>
        (EsDiario ? moment(f.Fecha).toDate() : moment(`01/${f.mes.toString().padStart(2,'0')}/${f.anio.toString()}`, FormatoColombiaDDMMYYY).toDate()) >= FechaInicial
          && (EsDiario ? moment(f.Fecha).toDate() : moment(`01/${f.mes.toString().padStart(2,'0')}/${f.anio.toString()}`, FormatoColombiaDDMMYYY).toDate()) <= FechaFinal);

    // filtramos por los vehivulos

    if (filtros.Vehiculos.length > 0) {
      datosFiltrados = datosFiltrados.filter(f => filtros.Vehiculos.indexOf(f[(TipoReporte[tabSel].EsMovil) ? "Movil" : "Operador"]) > -1);
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
    let totalEficiencia = new Array();
    let totalVelProm = new Array();
    let totalRegeneracion = new Array();
    let totalDistanciaA = new Array();



    let labels = new Array();
    let EficienciaSum = 0;
    let DistanciaSum = 0;
    let CargaSum = 0;
    let DescargaSum = 0;
    let EnergiaSum = 0;
    let TotalDuracionSum = 0;


    Object.entries(agrupadofecha).map((elem: any) => {

      labels.push(elem[0]);
      // totalizamos por propiedad que se necesite
      let totalCarga = (elem[1].map((m: any) => { return m.Carga }).reduce((a: number, b: number) => a + b, 0));
      let totalDescarga = (elem[1].map((m: any) => { return m.Descarga }).reduce((a: number, b: number) => a + b, 0));
      let totalDistancia = (elem[1].map((m: any) => { return m.Distancia }).reduce((a: number, b: number) => a + b, 0));
      let totalDuracion = (elem[1].map((m: any) => { return m.Duracion }).reduce((a: number, b: number) => a + b, 0));

      // sumamos los indicadores por fecha 

      let energia = totalDescarga - totalCarga;
      let porcRegeneracion = totalCarga / totalDescarga;
      let eficiencia = totalDistancia / energia;
      let velPromedio = totalDistancia / totalDuracion;

      // para la grafica de eficiencia
      totalEficiencia.push(eficiencia);
      totalVelProm.push(velPromedio);
      totalRegeneracion.push(porcRegeneracion);

      // para la grafica de distancia
      totalDistanciaA.push(totalDistancia);

      DistanciaSum += totalDistancia;
      CargaSum += totalCarga;
      DescargaSum += totalDescarga;
      TotalDuracionSum += totalDuracion;
    });

    EnergiaSum = DescargaSum - CargaSum;
    EficienciaSum = DistanciaSum / EnergiaSum;
    let PorRegeneracionsum = CargaSum / DescargaSum;

    setListIndicadores({
      "Distancia [km]": formatNumberChart(DistanciaSum),
      "Eficiencia [km/kWh]": locateFormatNumberNDijitos(EficienciaSum, 2),
      "Regeneración [%]": locateFormatPercentNDijitos(PorRegeneracionsum, 2),
      "VelProm [km/h]": locateFormatNumberNDijitos((DistanciaSum / (TotalDuracionSum)), 2),
    });

    setlablesAxisx(labels)

    // se debe volver actualizar los eventos pues 'estos no
    // se reflejan los usestate y utilizan los datos que tienen las variables
    // al momento de crearse

    ApexCharts.exec('apexchart-example', 'updateOptions', {
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
    ApexCharts.exec('totalDistancia', 'updateOptions', {
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
    ApexCharts.exec('apexchart-example', 'updateSeries', [
      {
        name: 'Eficiencia [Km/kwh]',
        data: totalEficiencia,
        type: 'bar'
      }, {
        name: 'VelProm [km/h]',
        data: totalVelProm,
        type: 'line',
        color: '#F44336'
      }, {
        name: 'Regeneracion [%]',
        data: totalRegeneracion,
        type: 'line',
        color: '#99C2A2'
      }]);

      ApexCharts.exec('totalDistancia', 'updateSeries', [
        {
          name: 'Distancia [km]',
          data: totalDistanciaA
        }]);

//totalDistancia



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
  function CargaListadoClientes() {
    return (
      <Form.Select className=" m-2 " onChange={(e) => {
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
    <PageTitle>Reporte Eficiencia</PageTitle>
    <BlockUi tag="div" keepInView blocking={loader ?? false}  >
      <div className="card card-rounded shadow mt-2 text-primary" style={{ width: '100%' }}  >

     
        <div className="d-flex justify-content-between mb-2">
          <div className="d-flex justify-content-between mx-auto">
            <div className="ms-9 text-center">
              <h3 className="mb-0">Reporte Eficiencia</h3>
              <span className="text-muted m-3">{TipoReporte[tabSel].reporte}</span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="row col-sm-12 col-md-12 col-xs-12 mx-auto">  {

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
        <div className="card bg-secondary d-flex flex-row  justify-content-between m-1">

        <div className="d-flex justify-content-start ">
            <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Fechas: </label>
            {(combine && allowedRange && allowedMaxDays) && (
              <DateRangePicker size="lg" className="mt-2" format="dd/MM/yyyy" value={[TipoReporte[tabSel].filtros.FechaInicial, TipoReporte[tabSel].filtros.FechaFinal]}
              hoverRange={
                TipoReporte[tabSel].tipo == 1  ? `month` : undefined //date =>  [subDays(date, 3), addDays(date,3)]
              }
              disabledDate={combine( allowedRange(
              ( TipoReporte[tabSel].tipo == 1 ) ? moment().add(-6, 'months').startOf('month').toDate() : moment().add(-6, 'months').toDate(),
              ( TipoReporte[tabSel].tipo == 1 ) ? moment().endOf('month').toDate() : moment().toDate()
              ) ,
              allowedMaxDays(31)
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
              <i className={`${TipoReporte[tabSel].EsMovil ? "bi-car-front-fill" : "bi-person"}`}></i></Button>
            <Button className="m-2  btn btn-sm btn-primary" onClick={() => { ConsultarData() }}><i className="bi-search"></i></Button>
          </div>
          <div className="d-flex justify-content-end ">
          
            <CargaListadoClientes />
          
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
                  <DrawDynamicIconMuiMaterial name={tab.icon} isactive={(tabSel === idx)}/>
                   
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
            enableColumnFilters={false}
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
              minSize: 80, //allow columns to get smaller than default
              maxSize: 200, //allow columns to get larger than default
              size: 80,
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
        <Modal.Title> {`Filtro ${TipoReporte[tabSel].EsMovil ? "Movil" : "Vehículo"}`}</Modal.Title>
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
          setSeleccionados([]);  /*actualizamos los filtros*/

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
  </>)
}