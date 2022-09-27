/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import Chart, { ChartConfiguration } from "chart.js";
import { KTSVG, toAbsoluteUrl } from "../../../../_start/helpers";
import { Dropdown1 } from "../../../../_start/partials";
import { getCSSVariableValue } from "../../../../_start/assets/ts/_utils";

type Props = {
  className: string;
  innerPadding?: string;
};

const ChartDonaVehiculo: React.FC<Props> = ({ className, innerPadding = "" }) => {
  useEffect(() => {
    const element = document.getElementById(
      "kt_stats_widget_1_chart"
    ) as HTMLCanvasElement;
    if (!element) {
      return;
    }

    const options = getChartOptions();
    const ctx = element.getContext("2d");
    let myDoughnut: Chart | null;
    if (ctx) {
      myDoughnut = new Chart(ctx, options);
    }
    return function cleanUp() {
      if (myDoughnut) {
        myDoughnut.destroy();
      }
    };
  }, []);

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
            8,345
          </div>
          <canvas id="kt_stats_widget_1_chart"></canvas>
        </div>
        {/* end::Chart */}

        {/* begin::Items */}
        <div className="d-flex justify-content-around">
          {/* begin::Item */}
          <div className="">
            <span className="fw-bolder text-gray-800 fs-8">48% Critico</span>
            <span className="bg-info w-25px h-5px d-block rounded mt-1"></span>
          </div>
          {/* end::Item */}

          {/* begin::Item */}
          <div className="">
            <span className="fw-bolder text-gray-800 fs-8">20% Mediano</span>
            <span className="bg-primary w-25px h-5px d-block rounded mt-1"></span>
          </div>
          {/* end::Item */}

          {/* begin::Item */}
          <div className="">
            <span className="fw-bolder text-gray-800 fs-8">32% Bajo</span>
            <span className="bg-warning w-25px h-5px d-block rounded mt-1"></span>
          </div>
          {/* end::Item */}
        </div>
        {/* end::Items */}
      </div>
      {/* end: Card Body */}
    </div>
  );
};

export { ChartDonaVehiculo };

function getChartOptions() {
  const tooltipBgColor = getCSSVariableValue("--bs-gray-200");
  const tooltipColor = getCSSVariableValue("--bs-gray-800");

  const color1 = getCSSVariableValue("--bs-success");
  const color2 = getCSSVariableValue("--bs-warning");
  const color3 = getCSSVariableValue("--bs-primary");

  const options: ChartConfiguration = {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [30, 40, 25],
          backgroundColor: [color1, color2, color3],
        },
      ],
      labels: ["Angular", "CSS", "HTML"],
    },
    options: {
      cutoutPercentage: 75,
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: "Technology",
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
