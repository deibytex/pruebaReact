import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect, useRef, useState } from "react";
import { getCSSVariableValue } from "../../../../_start/assets/ts/_utils";
import { KTSVG, toAbsoluteUrl } from "../../../../_start/helpers";
import { useDataFatigue } from "../core/provider";
import { listTabs } from "../data/tabListPanelCentral";
import { EventoActivo } from "../models/EventosActivos";
import BlockUi from "@availity/block-ui";
import { TimeLineAlertas } from "./TimeLineAlertas_Tab1";
import ReactApexChart from "react-apexcharts";
import { locateFormatNumberNDijitos, locateFormatPercentNDijitos } from "../../../../_start/helpers/Helper";
import moment from "moment";
import { MapTab } from "./TabMap_Tab2";
import { CardContainerEventos } from "./cardEventosAlertas";
import { DescargarExcelPersonalizado } from "../../../../_start/helpers/components/DescargarExcel";
import { MRT_ColumnDef } from "material-react-table";

type Props = {
  className: string;
  innerPadding?: string;
};

const FAG_PanelCentral: React.FC<Props> = ({ className, innerPadding = "" }) => {
  let idinterval: number = 0;
  const [width, setWidth] = useState("80px")

  const [Map, setMap] = useState<boolean>(false);
  const [activeChart, setActiveChart] = useState<ApexCharts | undefined>();
  const [activeEvents, setactiveEvents] = useState<EventoActivo[]>([]);
  const [opciones, setOpciones] = useState<any>(null);
  const refChart = useRef<ReactApexChart>(null);
  const { listadoEventosActivos, DataAlertas, DataDetallado, loader, activeTab, alertas, setActiveTab } = useDataFatigue();

  const [totalCriticos, settotalCriticos] = useState(0);
  const [totalModerados, settotalModerados] = useState(0);
  const [totalBajos, settotalBajos] = useState(0);
  const [totalEnGestion, settotalEnGestion] = useState(0);
  const [totalGestionados, settotalGestionados] = useState(0);

  useEffect(() => {    
    settotalCriticos(alertas.filter((item: any) => item.Criticidad == "Riesgo alto" && item.EstadoGestion == null).length);
    settotalModerados(alertas.filter((item: any) => item.Criticidad == "Riesgo moderado" && item.EstadoGestion == null).length);  
    settotalBajos(alertas.filter((item: any) => item.Criticidad ==  "Riesgo bajo" && item.EstadoGestion == null).length);
    settotalEnGestion(alertas.filter((item: any) => item.EstadoGestion == false).length); 
    settotalGestionados(alertas.filter((item: any) => item.EstadoGestion).length);
}, [alertas])

  // useefet que se ejecuta la primera vez, cuando el cliente es seleccionado 
  useEffect(() => {
    // cuando trae la informacipn de los clientes, debe traer la informacion
    // de los vehiculos
    //   ConsultaVehiculosClienteSeleccionado(ClienteSeleccionado.clienteIdS);

    // configuramos el chart

    // WARNING --  HAY QUE TENER PRESENTE QUE LOS USESTATE
    // DENTRO DE LOS EVENTOS DE LA GRAFICA NO USA EL ESTADO ACTUAL SINO EL ESTADO
    // AL MOMENTO DE SER CREADO, SE DEBEN USAR LOS SETUSETATE Y LOS CLICK EVENTS 
    // PARA QUE USE LOS USESTATE CON LA INFORMACIONF REAL

    let defaultopciones = {
      options: {

        chart: {
          fontFamily: 'Montserrat',
          animations: { enabled: true },
          zoom: {
            enabled: true,
            type: 'x',
            // autoScaleYaxis: false,
            zoomedArea: {
              fill: {
                color: '#90CAF9',
                opacity: 0.4
              },
              stroke: {
                color: '#0D47A1',
                opacity: 0.4,
                width: 1
              }
            }
          },
          type: 'area',
          //   stacked: true,
          id: 'fatg-graficadearea',
          events: {
            selection: function (chart: any, e: any) {
              console.log(new Date(e.xaxis.min))
            }
          }
        },
        stroke: {
          curve: 'smooth'
        }
        ,
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          onItemClick: {
            toggleDataSeries: false
          }
        },
        xaxis: {
          type: 'datetime'
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
            text: "Alarmas"
          }
        },
        {
          show: false,
          min: 0
        }
        ],
        dataLabels: {
          enabled: true,
          // formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {
          //     return seriesIndex == 0 ? value : (seriesIndex == 1 ? locateFormatPercentNDijitos(value / 100, 0) : locateFormatNumberNDijitos(value, 1))
          // },
        },
        tooltip: {
          y: {
            formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {
              return seriesIndex == 0 ? value : (seriesIndex == 1 ? locateFormatPercentNDijitos(value / 100, 0) : locateFormatNumberNDijitos(value, 1))
            },
          }
        }
      },
      series: []
      // , colors: ['#008FFB', '#00E396', '#CED4DC'],

    }
    // asingamos las opciones
    setOpciones(defaultopciones)
    return function cleanUp() {
      //SE DEBE DESTRUIR EL OBJETO CHART
    };
  }, []);

  useEffect(() => {
    if (DataAlertas != undefined && DataAlertas.length != 0)
      PintarGrafica(DataAlertas);
  }, [DataAlertas])

  // FILTRA LOS DATOS QUE SE CONSULTAN DE LA BASE DE DATOS
  // SI EXISTE SE PASA LOS DATOS ALMACENADOS EN EL SISTEMA
  let PintarGrafica = (datos: any[]) => {
    // agrupa los elementos para ser mostrado por la grafica

    let datosFiltrados: any[] = datos;

    let Datos = new Array();
    let dataTransformada = new Array()
    // agrupamos por fechas la informacion
    datosFiltrados
      .forEach(
        (m) => {
          dataTransformada.push(m)
        }
      );
    dataTransformada = dataTransformada.sort((a: any, b: any) => {
      return moment(a.fechaHora).toDate().getTime() - moment(b.fechaHora).toDate().getTime();
    });
    // actualizamos los datos de las series
    let data: any[] = [];
    Datos.push({
      "name": "Alertas", "data": dataTransformada.map((f, ind) => {
        return { "x": moment(f.FechaHora).toDate().getTime(), "y": f.Cantidad };
      })
    });
    // funcion que actualiza los datos de las series
    // se debe pasar el id configurado al momento de su creaci'on para poder
    // actializar los datos
    ApexCharts.exec('fatg-graficadearea', 'updateSeries', Datos);
  }




  // TRAE LA INFORMACION DE EVENTOS ACTIVOS POR DIA
  useEffect(() => {

    setTab(parseInt((activeTab != undefined ? activeTab?.replace('#tab', '') : '1')));
    setactiveEvents(listadoEventosActivos ?? []);

    return function cleanUp() {
      if (activeChart) {
        activeChart.destroy();
      }
    };
  }, [listadoEventosActivos]);

  const setTab = (tabNumber: number) => {
    setActiveTab(`#tab${tabNumber}`);
    if (activeChart) {
      activeChart.destroy();
    }

    const element = document.querySelector(
      `#tab${tabNumber}_chart`
    ) as HTMLElement;
    if (!element) {
      return;
    }

    // const height = parseInt(getCss(element, "height"));
    // const chart = new ApexCharts(element, getChartOptions(tabNumber, height));
    // chart.render();
    // setActiveChart(chart);

    if (tabNumber == 2)
      setWidth("100px");
  };

  useEffect(() => {
    if (activeTab == `#tab2`)
      setTab(2);
  }, [activeTab])

  useEffect(() => {
    if (idinterval === 0) {
      idinterval = window.setInterval(() => {
        setMap(true);
      }, 2000)
    }
  }, [DataDetallado])

  useEffect(() => {
   console.log(alertas);
  }, [alertas])

  //listado campos tablas
  const columnasTabla: MRT_ColumnDef<any>[]
    = [
      {
        accessorKey: 'TipoAlerta',
        header: 'Alarma',
        size: 100
      },
      {
        accessorKey: 'vehiculo',
        header: 'Vehículo',
        size: 100
      },
      {
        accessorKey: 'conductor',
        header: 'Conductor',
        size: 100
      }, {
        accessorKey: 'EventDateTime',
        header: 'Fecha evento',
        Cell({ cell, column, row, table, }) {

          return (
            <>
              {
                moment(row.original.EventDateTime).format('DD/MM/YYYY HH:mm:ss')
              }
            </>

          )
        },
        size: 80
      }, {
        accessorKey: 'DetalladoEventos',
        header: 'Cantidad eventos',
        size: 80,
        Cell({ cell, column, row, table, }) {


          return (
            <>
              {
                JSON.parse(row.original.DetalladoEventos).length as number
              }
            </>

          )
        },
      }, {
        accessorKey: 'EstadoGestion',
        header: 'Estado',
        size: 50,
        Cell({ cell, column, row, table, }) {
          return (cell.getValue() == null) ? <span className="badge bg-danger">No Gestionado</span>
            : (cell.getValue() == true) ? <span className="badge bg-success">Gestionado</span>
              : (cell.getValue() == false) ? <span className="badge bg-primary">En Gestion</span>
                : <span>{row.original.EstadoGestion}</span>
        },
      },
      {
        accessorKey: 'gestor',
        header: 'Analista',
        size: 80,
        Cell({ cell, column, row, table, }) {
          return (cell.getValue() == null) ? <span>Sin Analista</span> : <span>{row.original.gestor}</span>
        },
      }

    ];

  const fncReporteAlarma = [
    {
      name: "EstadoGestion",
      getData: (data: any) => {
        return (data == null) ? 'No Gestionado'
          : (data == true) ? 'Gestionado'
            : (data == false) ? 'En Gestion'
              : { data }
      }
    },
    {
      name: "gestor",
      getData: (data: any) => {

        return (data == null) ? 'Sin Analista' : data
      }
    }, {
      name: 'DetalladoEventos',

      getData: (data: any) => {
        return JSON.parse(data).length
      }
    }
  ];

  const [tipo, settipo] = useState<any>(0);

  return (
    <div className={`card ${className}`}>
      <BlockUi tag="div" keepInView blocking={loader ?? false}  >
        {/* begin::Header */}
        <div className="card-header align-items-center border-0 mt-5">
          <div className="card-title flex-column">
            <span className="fw-bolder text-dark fs-3 ms-4 me-20">Panel de Gestión de Riesgos</span>
            <button className="m-2 ms-20 btn btn-sm btn-primary" type="button" onClick={() => { DescargarExcelPersonalizado(alertas, columnasTabla, `Alertas ${tipo == 0 ? "Gestión" : "Eventos"}`, fncReporteAlarma) }}>
              <i className="bi-file-earmark-excel"></i> Descargar Gestión
            </button>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className="card-body pt-0">
          <div className=" flex-wrap flex-xxl-nowrap justify-content-center justify-content-md-start pt-4">
            {/* begin::Nav */}
            <div className="me-sm-10 me-0">
              <ul className="nav nav-tabs nav-pills nav-pills-custom">
                {listTabs.map((tab, idx) => {
                  idx++;
                  return (<li className="nav-item mb-3" key={`tabenc_${idx}`}>
                    <a
                      onClick={() => setTab(idx)}
                      className={`nav-link w-140px h-50px ${activeTab === `#tab${idx}` ? "active btn-active-light" : ""
                        } fw-bolder me-3`}
                      id={`tab${idx}`}
                    >
                      <div className="ps-1">
                        <span className="nav-text text-gray-600 fw-bolder fs-6">
                          {tab.titulo}
                        </span>
                        <span className="text-muted fw-bold d-block pt-1 text-center">
                          {idx == 1 ? `${totalCriticos}` : idx == 2 ? `${totalModerados}` : idx == 3 ? `${totalBajos}` 
                          : idx == 4 ? `${totalEnGestion}` : idx == 5 ? `${totalGestionados}` : tab.subtitulo}
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
            <div className="tab-content flex-grow-1" // style={{ paddingLeft: "0.23rem !important" }}
            >
              <div
                className={`tab-pane fade ${activeTab === "#tab1" ? "show active" : ""
                  }`}
                id="tab1_content"
              >
                {/* begin::Content */}
                {/* begin::Cards */}
                <div className="overflow-auto">

                  {
                    // verificamos que exista datos para poder ingresar los datos en el contenedor 
                    (<CardContainerEventos isActive={true} isDetails={false} filtro={0} />)
                  }
                </div>
              </div>
              <div
                className={`tab-pane fade ${activeTab === "#tab2" ? "show active" : ""
                  }`}
                id="tab2_content"
              >
                {/* begin::Content */}
                {/* begin::Cards */}
                <div className="overflow-auto">

                  {
                    // verificamos que exista datos para poder ingresar los datos en el contenedor 
                    (<CardContainerEventos isActive={true} isDetails={false} filtro={1} />)
                  }
                </div>
              </div>
              <div
                className={`tab-pane fade ${activeTab === "#tab3" ? "show active" : ""
                  }`}
                id="tab3_content"
              >
                {/* begin::Content */}
                {/* begin::Cards */}
                <div className="overflow-auto">

                  {
                    // verificamos que exista datos para poder ingresar los datos en el contenedor 
                    (<CardContainerEventos isActive={true} isDetails={false} filtro={2} />)
                  }
                </div>
              </div>
              <div
                className={`tab-pane fade ${activeTab === "#tab4" ? "show active" : ""
                  }`}
                id="tab4_content"
              >
                {/* begin::Content */}
                {/* begin::Cards */}
                <div className="overflow-auto">

                  {
                    // verificamos que exista datos para poder ingresar los datos en el contenedor 
                    (<CardContainerEventos isActive={true} isDetails={false} filtro={3} />)
                  }
                </div>
              </div>
              <div
                className={`tab-pane fade ${activeTab === "#tab5" ? "show active" : ""
                  }`}
                id="tab5_content"
              >
                {/* begin::Content */}
                {/* begin::Cards */}
                <div className="overflow-auto">

                  {
                    // verificamos que exista datos para poder ingresar los datos en el contenedor 
                    (<CardContainerEventos isActive={true} isDetails={false} filtro={4} />)
                  }
                </div>
              </div>


              <div
                className={`tab-pane fade ${activeTab === "#tab6" ? "show active" : ""
                  }`}
                id="tab6_content"
              >
                {/* begin::Cards */}
                <div className="overflow-auto">
                  <div style={{ height: 400 }}>
                    {/* // verificamos que exista datos para poder ingresar los datos en el contenedor  */}
                    <div className="card">
                      <div className="row mt-2 col-sm-12 col-md-12 col-xs-12 rounded shadow-sm mx-auto">
                        {(opciones != null) && (
                          <ReactApexChart
                            options={opciones.options}
                            series={opciones.series}
                            height={400} type="area" />)}
                      </div>
                    </div>

                  </div>
                </div>
                {/* end::Cards      */}
              </div>


              {/* end::Content  */}






            </div>
            {/* end::Tab Content */}
          </div>
        </div>
        {/* end: Card Body */}
      </BlockUi>
    </div>
  );
};

export { FAG_PanelCentral };
