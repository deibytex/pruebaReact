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

type Props = {
  className: string;
  innerPadding?: string;
};

const FAG_PanelCentral: React.FC<Props> = ({ className, innerPadding = "" }) => {
  let idinterval: number = 0;
  const [width, setWidth] = useState("80px")
  const [activeTab, setActiveTab] = useState("#tab1");
  const [tabGlobal, setTabGlobal] = useState("#tab1");
  const [Map, setMap] = useState<boolean>(false);
  const [activeChart, setActiveChart] = useState<ApexCharts | undefined>();
  const [activeEvents, setactiveEvents] = useState<EventoActivo[]>([]);
  const [opciones, setOpciones] = useState<any>(null);
  const refChart = useRef<ReactApexChart>(null);
  const { listadoEventosActivos, DataAlertas, DataDetallado, loader } = useDataFatigue();

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

    setTab(parseInt(activeTab.replace('#tab', '')));
    setactiveEvents(listadoEventosActivos ?? []);

    return function cleanUp() {
      if (activeChart) {
        activeChart.destroy();
      }
    };
  }, [listadoEventosActivos]);

  const setTab = (tabNumber: number) => {
    setActiveTab(`#tab${tabNumber}`);
    setTabGlobal(`#tab${tabNumber}`);
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
    if (tabGlobal == `#tab2`)
      setTab(2);
  }, [tabGlobal])

  useEffect(() => {
    if (idinterval === 0) {
      idinterval = window.setInterval(() => {
        setMap(true);
      }, 2000)
    }
  }, [DataDetallado])
  return (
    <div className={`card ${className}`}>
      <BlockUi tag="div" keepInView blocking={loader ?? false}  >
        {/* begin::Header */}
        <div className="card-header align-items-center border-0 mt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="fw-bolder text-dark fs-3">Panel de Gestión de Riesgos</span>
            <span className="text-muted mt-2 fw-bold fs-6"></span>
          </h3>
          <div className="card-toolbar">
            {/* begin::Dropdown */}
            <button
              type="button"
              className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
              data-kt-menu-flip="top-end"
            >
              <KTSVG
                className="svg-icon-1"
                path="/media/icons/duotone/Layout/Layout-4-blocks-2.svg"
              />
            </button>

            {/* end::Dropdown */}
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
                      className={`nav-link w-225px h-70px ${activeTab === `#tab${idx}` ? "active btn-active-light" : ""
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
                    (<CardContainerEventos isActive={true} isDetails={false} />)
                  }
                </div>

                <div
                  className={`tab-pane fade ${activeTab === "#tab2" ? "show active" : ""
                    }`}
                  id="tab2_content"
                >
                  <div className="card">
                    <div className="card-body">
                      {(DataDetallado?.length != 0) && (Map) && (activeTab == "#tab2") && (<MapTab></MapTab>)}
                    </div>
                  </div>
                </div>


                <div
                  className={`tab-pane fade ${activeTab === "#tab3" ? "show active" : ""
                    }`}
                  id="tab3_content"
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
