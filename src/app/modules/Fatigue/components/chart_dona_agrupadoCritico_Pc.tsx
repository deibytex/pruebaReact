/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import Chart, { ChartConfiguration } from "chart.js";
import { toAbsoluteUrl } from "../../../../_start/helpers";

import { getCSSVariableValue } from "../../../../_start/assets/ts/_utils";
import { useDataFatigue } from "../core/provider";

type Props = {
  className: string;
  innerPadding?: string;
  tipoData?: number;
  nameChart?: String;
  titulo: string;
};

const ChartDonaVehiculo: React.FC<Props> = ({ className, innerPadding = "", tipoData = 1, nameChart = "clasificacionFlota_", titulo }) => {

  const [totalDona, handlerTotalDona] = useState(0);

  const color1 = getCSSVariableValue("--bs-success");
  const color2 = getCSSVariableValue("--bs-warning");
  const color3 = getCSSVariableValue("--bs-primary");
  const color4 = getCSSVariableValue("--bs-danger");


  let arrayChart: number[] = [];
  let labelsArray: string[] = [];
  let colorsArray: string[] = [];
  let colorsArrayLabels: string[] = [];

  const { vehiculosOperacion, alertas } = useDataFatigue();

  const [criticidad, setcriticidad] = useState<any>({});

  //Pintamos indicador 2 donna
  useEffect(() => {

    let agrupadocriticidad = alertas
      .reduce((p: any, c: any) => {
        let name = c.Criticidad;
        p[name] = p[name] ?? [];
        p[name].push(c);
        return p;
      }, {});

    if (Object.keys(agrupadocriticidad).length > 0) {
      setcriticidad({
        "Alto": agrupadocriticidad['Riesgo alto'] == undefined ? 0 : agrupadocriticidad['Riesgo alto'].length,
        "Moderado": agrupadocriticidad['Riesgo moderado'] == undefined ? 0 : agrupadocriticidad['Riesgo moderado'].length,
        "Bajo": agrupadocriticidad['Riesgo bajo'] == undefined ? 0 : agrupadocriticidad['Riesgo bajo'].length
      });
    }

  }, [alertas]);



  let objectdata = (tipoData == 1) ? vehiculosOperacion : criticidad;

  // segun el tipo se determina que informacion se necesita

  arrayChart = Object.values(objectdata);




  // se determina de que tipo se necesita la informacion para mostrarla en los indicadores
  labelsArray = Object.keys((tipoData == 1) ? objectdata : objectdata);
  if (tipoData == 1) {
    colorsArray = [color1, color3];
    colorsArrayLabels = ["success", "primary"];
  } else if (tipoData == 2) {
    colorsArray = [color4, color2, color3];
    colorsArrayLabels = ["danger", "warning", "success"];
  }


  useEffect(() => {
    const element = document.getElementById(
      `${nameChart}kt_stats_widget_1_chart`
    ) as HTMLCanvasElement;
    if (!element) {
      return;
    }

    // actualiza la informacion de la dona
    let totalDona = arrayChart.reduce((a, b) => a + b, 0);

    handlerTotalDona(totalDona);
    const options = getChartOptions(arrayChart, colorsArray, titulo, labelsArray);
    const ctx = element.getContext("2d");
    let myDoughnut: Chart | null;

    if (ctx && labelsArray.length > 0) {
      myDoughnut = new Chart(ctx, options);
    }
    return function cleanUp() {
      if (myDoughnut) {
        myDoughnut.destroy();
      }
    };
  }, [vehiculosOperacion, alertas, criticidad]);

  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className="card-body ">
        {/* begin::Chart */}
        <div
          className="d-flex flex-center position-relative bgi-no-repeat bgi-size-contain bgi-position-x-center bgi-position-y-center h-175px"
          style={{
            backgroundImage: `url('${toAbsoluteUrl(
              "/media/svg/illustrations/bg-1.svg"
            )}')`,
          }}
        >
          <div className="fw-bolder fs-1 text-gray-800 position-absolute">
            {totalDona}
          </div>
          <canvas id={`${nameChart}kt_stats_widget_1_chart`}></canvas>
        </div>
        {/* end::Chart */}

        {/* begin::Items */}
        <div className="d-flex justify-content-around">

          {
            Object.entries((tipoData == 1) ? objectdata : objectdata).map((entry, index) => {
              let totalCategoria = (tipoData == 1) ? entry[1] : entry[1];
              return (
                <div key={`chardonavehiculo_${totalCategoria}-${entry[0]} m-1`}>
                  <span className="fw-bolder text-gray-800 fs-8">{`${totalCategoria}-${entry[0]}`}</span>
                  <span className={`bg-${colorsArrayLabels[index]} w-25px h-5px d-block rounded mt-1`}></span>
                </div>

              )

            })

          }

        </div>
        {/* end::Items */}
      </div>
      {/* end: Card Body */}
    </div>
  );
};

export { ChartDonaVehiculo };

function getChartOptions(data: number[], colors: string[], titulo: string, labels: string[]) {
  const tooltipBgColor = getCSSVariableValue("--bs-gray-200");
  const tooltipColor = getCSSVariableValue("--bs-gray-800");



  const options: ChartConfiguration = {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: data,
          backgroundColor: colors,
        },
      ],
      labels: labels,
    },
    options: {
      cutoutPercentage: 65,
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
        position: "bottom",
      },
      title: {
        display: true,
        text: titulo,
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
      tooltips: {
        enabled: true,
        intersect: false,
        mode: "nearest",
        bodySpacing: 5,
        yPadding: 10,
        xPadding: 10,
        caretPadding: 0,
        displayColors: false,
        backgroundColor: tooltipBgColor,
        bodyFontColor: tooltipColor,
        cornerRadius: 4,
        footerSpacing: 0,
        titleSpacing: 0,
      },
    },
  };
  return options;
}

// function randomScalingFactor() {
//   return Math.round(Math.random() * 100);
// }
