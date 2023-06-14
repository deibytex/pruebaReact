import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { getCSSVariableValue } from "../../../../_start/assets/ts/_utils";
import { KTSVG, toAbsoluteUrl } from "../../../../_start/helpers";
import { useDataFatigue } from "../core/provider";

import { listTabs } from "../data/tabListPanelCentral";
import { EventoActivo } from "../models/EventosActivos";
import CardContainer from "./baseCard_Tab4";
import { CardContainerEventos } from "./cardEventosAlertas";

import { FAG_TablaPanelRiesgo } from "./TablaPanelRiesgo_Tab1";


import { TimeLineAlertas } from "./TimeLineAlertas_Tab1";

type Props = {
  className: string;
  innerPadding?: string;
};



const FAG_PanelCentral: React.FC<Props> = ({ className, innerPadding = "" }) => {

  const [width, setWidth] = useState("80px")
  const [activeTab, setActiveTab] = useState("#tab1");
  const [activeChart, setActiveChart] = useState<ApexCharts | undefined>();
  const [activeEvents, setactiveEvents] = useState<EventoActivo[]>([]);

  const { listadoEventosActivos } = useDataFatigue();
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
    if (activeChart) {
      activeChart.destroy();
    }

    const element = document.querySelector(
      `#tab${tabNumber}_chart`
    ) as HTMLElement;
    if (!element) {
      return;
    }

    const height = parseInt(getCss(element, "height"));
    const chart = new ApexCharts(element, getChartOptions(tabNumber, height));
    chart.render();
    setActiveChart(chart);

    if (tabNumber == 2)
      setWidth("100px");
  };

  return (
    <div className={`card ${className}`}>
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
            {/* begin::Tab Pane 1 */}
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


              {/* end::Content  */}



            </div>
            {/* end::Tab Pane 1 */}

            {/* begin::Tab Pane 2 */}
            <div
              className={`tab-pane fade ${activeTab === "#tab2" ? "show active" : ""
                }`}
              id="tab2_content"
            >
              <div style={{ height: width }}></div>

              {/* <MapTab /> */}

            </div>
            {/* end::Tab Pane 2 */}

            {/* begin::Tab Pane 3 */}
            <div
              className={`tab-pane fade ${activeTab === "#tab3" ? "show active" : ""
                }`}
              id="tab3_content"
            >


              {/* begin::Cards */}
              <div className="overflow-auto">

                <div style={{ height: width }}></div>
              </div>

              {/* end::Cards      */}
            </div>
            {/* end::Tab Pane 3 */}

          </div>
          {/* end::Tab Content */}
        </div>
      </div>
      {/* end: Card Body */}
    </div>
  );
};

export { FAG_PanelCentral };

function getChartOptions(
  tabNumber: number,
  height: string | number | undefined
): ApexOptions {
  return {
    series: [{
      name: "Critico",
      data: [
        [1, 3087998871497481258]
      ]
    },
    {
      name: "Elevado",
      data: [
      ]
    }, {
      name: "Normal",
      data:
        [
        ]
    }],
    chart: {
      fontFamily: "inherit",
      type: "scatter",
      height: height,
      zoom: {
        enabled: true,
        type: 'xy'
      }
    },

    xaxis: {
      tickAmount: 10,
      labels: {
        formatter: function (val) {
          return parseFloat(val).toFixed(1)
        }
      }
    },
    yaxis: {
      tickAmount: 7
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: number) {
          return `$${val} thousands`;
        },
      },
    },
    colors: [
      getCSSVariableValue("--bs-danger"),
      getCSSVariableValue("--bs-warning"),
      getCSSVariableValue("--bs-primary"),
    ],
    grid: {
      borderColor: getCSSVariableValue("--bs-gray-200"),
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };
}



function getCss(el: HTMLElement, styleProp: string) {
  const defaultView = (el.ownerDocument || document).defaultView;
  if (!defaultView) {
    return "";
  }

  // sanitize property name to css notation
  // (hyphen separated words eg. font-Size)
  styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
  return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
}
