import { Height } from "@mui/icons-material";
import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { getCSSVariableValue } from "../../../../_start/assets/ts/_utils";
import { KTSVG, toAbsoluteUrl } from "../../../../_start/helpers";
import CardContainer from "./baseCard";
import CardContainerEventos from "./cardEventosDetallados";
import { FAG_TablaPanelRiesgo } from "./TablaPanelRiesgo";
import TabListPanelCentral from "./TabListPanelCentral";
import { MapTab } from "./TabMap";
import { TimeLineAlertas } from "./TimeLineAlertas";

type Props = {
  className: string;
  innerPadding?: string;
};

const FAG_PanelCentral: React.FC<Props> = ({ className, innerPadding = "" }) => {


  const [width, setWidth] = useState("80px")
  const [activeTab, setActiveTab] = useState("#tab1");
  const [activeChart, setActiveChart] = useState<ApexCharts | undefined>();
  useEffect(() => {
    setTab(1);
    return function cleanUp() {
      if (activeChart) {
        activeChart.destroy();
      }
    };
  }, []);

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

    if(tabNumber == 2)
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
          <TabListPanelCentral />
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
              <li className="nav-item mb-3">
                <a
                  onClick={() => setTab(1)}
                  className={`nav-link w-225px h-70px ${activeTab === "#tab1" ? "active btn-active-light" : ""
                    } fw-bolder me-2`}
                  id="tab1"
                >
                  <div className="nav-icon me-3">
                    <img
                      alt=""
                      src={toAbsoluteUrl("/media/svg/logo/gray/aven.svg")}
                      className="default"
                    />

                    <img
                      alt=""
                      src={toAbsoluteUrl("/media/svg/logo/colored/aven.svg")}
                      className="active"
                    />
                  </div>
                  <div className="ps-1">
                    <span className="nav-text text-gray-600 fw-bolder fs-6">
                      Inicial
                    </span>
                    <span className="text-muted fw-bold d-block pt-1">
                      DashBoar Criticas
                    </span>
                  </div>
                </a>
              </li>

              <li className="nav-item mb-3">
                <a
                  id="tab2"
                  className={`nav-link w-190px h-70px ${activeTab === "#tab2" ? "active btn-active-light" : ""
                    } fw-bolder me-2`}
                  onClick={() => setTab(2)}
                >
                  <div className="nav-icon me-3">
                    <img
                      alt=""
                      src={toAbsoluteUrl("/media/svg/logo/gray/tower.svg")}
                      className="default"
                    />
                    <img
                      alt=""
                      src={toAbsoluteUrl("/media/svg/logo/colored/tower.svg")}
                      className="active"
                    />
                  </div>
                  <div className="ps-1">
                    <span className="nav-text text-gray-600 fw-bolder fs-6">
                      Mapa
                    </span>
                    <span className="text-muted fw-bold d-block pt-1">
                      
                    </span>
                  </div>
                </a>
              </li>

              <li className="nav-item mb-3">
                <a
                  id="tab3"
                  className={`nav-link w-200px h-70px ${activeTab === "#tab3" ? "active btn-active-light" : ""
                    } fw-bolder me-2`}
                  onClick={() => setTab(3)}
                >
                  <div className="nav-icon me-3">
                    <img
                      alt=""
                      src={toAbsoluteUrl("/media/svg/logo/gray/fox-hub-2.svg")}
                      className="default"
                    />
                    <img
                      alt=""
                      src={toAbsoluteUrl(
                        "/media/svg/logo/colored/fox-hub-2.svg"
                      )}
                      className="active"
                    />
                  </div>
                  <div className="ps-1">
                    <span className="nav-text text-gray-600 fw-bolder fs-6">
                      Eventos
                    </span>
                    <span className="text-muted fw-bold d-block pt-1">
                      Detallado
                    </span>
                  </div>
                </a>
              </li>

              <li className="nav-item mb-5">
                <a
                  id="tab4"
                  className={`nav-link w-200px h-70px ${activeTab === "#tab4" ? "active btn-active-light" : ""
                    } fw-bolder me-2`}
                  onClick={() => setTab(4)}
                >
                  <div className="nav-icon me-3">
                    <img
                      alt=""
                      src={toAbsoluteUrl("/media/svg/logo/gray/kanba.svg")}
                      className="default"
                    />
                    <img
                      alt=""
                      src={toAbsoluteUrl("/media/svg/logo/colored/kanba.svg")}
                      className="active"
                    />
                  </div>
                  <div className="ps-1">
                    <span className="nav-text text-gray-600 fw-bolder fs-6">
                      Alertas
                    </span>
                    <span className="text-muted fw-bold d-block pt-1">
                      20 Sin revisar
                    </span>
                  </div>
                </a>
              </li>
              <li className="nav-item mb-5">
                <a
                  id="tab5"
                  className={`nav-link w-225px h-70px ${activeTab === "#tab4" ? "active btn-active-light" : ""
                    } fw-bolder me-2`}
                  onClick={() => setTab(5)}
                >
                  <div className="nav-icon me-3">
                    <img
                      alt=""
                      src={toAbsoluteUrl("/media/svg/logo/gray/kanba.svg")}
                      className="default"
                    />
                    <img
                      alt=""
                      src={toAbsoluteUrl("/media/svg/logo/colored/kanba.svg")}
                      className="active"
                    />
                  </div>
                  <div className="ps-1">
                    <span className="nav-text text-gray-600 fw-bolder fs-6">
                      Gestión
                    </span>
                    <span className="text-muted fw-bold d-block pt-1">
                      30 Gestionado por tí
                    </span>
                  </div>
                </a>
              </li>
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
              <div className="d-flex justify-content-center mb-10">


                <div className="row g-0 g-xl-12 g-xxl-12">
                  <div className="col-xl-4">
                    <TimeLineAlertas className="card-stretch mb-5 mb-xxl-8" />
                  </div>

                  <div className="col-xl-8">
                    <FAG_TablaPanelRiesgo className="card-stretch mb-5 mb-xxl-8" />
                  </div>

                  {/* begin::Content */}

                  <h3 className="card-title align-items-start flex-column col-xl-12">
                    <span className="fw-bolder text-dark text-center fs-3">TimeLine Últimas 2 Horas</span>

                  </h3>
                  {/* begin::Chart */}
                  <div id="tab1_chart" className="col-xl-12" style={{ height: "250px" }} />
                  {/* end::Chart      */}
                </div>


                {/* end::Content  */}


              </div>
            </div>
            {/* end::Tab Pane 1 */}

            {/* begin::Tab Pane 2 */}
            <div
              className={`tab-pane fade ${activeTab === "#tab2" ? "show active" : ""
                }`}
              id="tab2_content"
            >
              <div style={{ height: width }}></div>
              <MapTab />

            </div>
            {/* end::Tab Pane 2 */}

            {/* begin::Tab Pane 3 */}
            <div
              className={`tab-pane fade ${activeTab === "#tab3" ? "show active" : ""
                }`}
              id="tab3_content"
            >
           

              {/* begin::Cards */}
              <div className="overflow-auto">   <CardContainerEventos /></div>
            
              {/* end::Cards      */}
            </div>
            {/* end::Tab Pane 3 */}

            {/* begin::Tab Pane 4 */}
            <div
              className={`tab-pane fade ${activeTab === "#tab4" ? "show active" : ""
                }`}
              id="tab4_content"
            >
        
 {/* begin::Cards */}
 <div className="overflow-auto"> <CardContainer/></div>
            
            {/* end::Cards      */}
             
            </div>
            <div
              className={`tab-pane fade ${activeTab === "#tab5" ? "show active" : ""
                }`}
              id="tab5_content"
            >             
            </div>
            {/* end::Tab Pane 4 */}
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
        [1, 5.4], [21.7, 2], [25.4, 3], [19, 2], [10.9, 1], [13.6, 3.2], [10.9, 7.4], [10.9, 0], [10.9, 8.2], [16.4, 0], [16.4, 1.8], [13.6, 0.3], [13.6, 0], [29.9, 0], [27.1, 2.3], [16.4, 0], [13.6, 3.7], [10.9, 5.2], [16.4, 6.5], [10.9, 0], [24.5, 7.1], [10.9, 0], [8.1, 4.7], [19, 0], [21.7, 1.8], [27.1, 0], [24.5, 0], [27.1, 0], [29.9, 1.5], [27.1, 0.8], [22.1, 2]]
    }, {
      name: "Elevado",
      data: [
        [36.4, 13.4], [1.7, 11], [5.4, 8], [9, 17], [1.9, 4], [3.6, 12.2], [1.9, 14.4], [1.9, 9], [1.9, 13.2], [1.4, 7], [6.4, 8.8], [3.6, 4.3], [1.6, 10], [9.9, 2], [7.1, 15], [1.4, 0], [3.6, 13.7], [1.9, 15.2], [6.4, 16.5], [0.9, 10], [4.5, 17.1], [10.9, 10], [0.1, 14.7], [9, 10], [12.7, 11.8], [2.1, 10], [2.5, 10], [27.1, 10], [2.9, 11.5], [7.1, 10.8], [2.1, 12]]
    }, {
      name: "Normal",
      data: [
        [21.7, 3], [23.6, 3.5], [24.6, 3], [29.9, 3], [21.7, 20], [23, 2], [10.9, 3], [28, 4], [27.1, 0.3], [16.4, 4], [13.6, 0], [19, 5], [22.4, 3], [24.5, 3], [32.6, 3], [27.1, 4], [29.6, 6], [31.6, 8], [21.6, 5], [20.9, 4], [22.4, 0], [32.6, 10.3], [29.7, 20.8], [24.5, 0.8], [21.4, 0], [21.7, 6.9], [28.6, 7.7], [15.4, 0], [18.1, 0], [33.4, 0], [16.4, 0]]
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
