import { ApexOptions } from "apexcharts";
import { AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { getCSSVariableValue } from "../../../../../_start/assets/ts/_utils";
import { useDataReportes } from "../../core/ReportesProvider";
import { GetReporteAlarmas } from "../../data/ReportesData";

function getChartOptions(   
    height: string | number | undefined
  ): ApexOptions {
    return {
      series: [{
        name: "Critico",
        data: [
          [1, 3087998871497481258]
        ] }, 
      {
        name: "Elevado",
        data: [
         ] }, {
        name: "Normal",
        data: 
        [
        ] }],
      chart: {
        fontFamily: "inherit",
        type: "bar",
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
            return `$${val}`;
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
export default function Alarmas() {
    const { ClienteSeleccionado } = useDataReportes();
    const [FechaInicio, setFechaInicio] = useState<string>(moment().add(-1, 'month').format('YYYY-MM-DD'))
    const [FechaFinal, setFechaFinal] = useState<string>(moment().format('YYYY-MM-DD'))
    const [activeChart, setActiveChart] = useState<ApexCharts | undefined>();
    const [lstAlarmas, setlstAlarmas] = useState<any[]>([]);

useEffect(() => {
    // consulta la informacion de las alarmas cuando 
    // cambia el ciente seleecionado y las fechas 

    if(ClienteSeleccionado != undefined && ClienteSeleccionado.clienteIdS > 0) 
      GetReporteAlarmas(ClienteSeleccionado.clienteIdS.toString(), FechaInicio, FechaFinal).then((response: AxiosResponse<any[]>) => {
        // // inicializamos el chart
    const element = document.querySelector(
        `#alarma_chart_total`
      ) as HTMLElement;
      if (!element) {
        return;
      }
  
      const height = parseInt(getCss(element, "height"));
      const chart = new ApexCharts(element, getChartOptions( height));
      chart.render();
      setActiveChart(chart);

    })
    
   


    // si existe un chart construido lo destruye
    return function cleanUp() {
        if (activeChart) {
          activeChart.destroy();
        }
      };
} ,  [ClienteSeleccionado, FechaInicio, FechaFinal]);

return(<>
 {/* begin::Chart */}
 {
                    // verificamos que exista datos para poder ingresar los datos en el contenedor 

                    (lstAlarmas.length > 0) && (
                      <div id="alarma_chart_total" className="col-xl-12" style={{ height: "250px" }} />
                    )
                  }
                  {/* end::Chart      */}
</>)
}