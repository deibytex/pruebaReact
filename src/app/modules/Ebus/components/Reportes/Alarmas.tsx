import { ApexOptions } from "apexcharts";
import { AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { getCSSVariableValue } from "../../../../../_start/assets/ts/_utils";
import { useDataReportes } from "../../core/ReportesProvider";
import { GetReporteAlarmas } from "../../data/ReportesData";
import { PageTitle } from "../../../../../_start/layout/core";
import { DatePicker } from "rsuite";
import BlockUi from "@availity/block-ui";
import { DescargarExcel } from "../../../../../_start/helpers/components/DescargarExcel";
import { MRT_ColumnDef } from "material-react-table";
import { FormatoColombiaDDMMYYYHHmmss } from "../../../../../_start/helpers/Constants";
import { BaseReportes } from "../../Reportes";

function getChartOptions(   
    height: string | number | undefined
  ): ApexOptions {
    return {
      series: [{
        name: "Critico",
        data: [
          [1, 30]
        ] }, 
      {
        name: "Elevado",
        data: [1, 40] }, {
        name: "Normal",
        data: 
        [2, 50] }],
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


export default function ReporteAlarmas() {
    const { ClienteSeleccionado , setClienteSeleccionado, Clientes} = useDataReportes();
    const [FechaInicio, setFechaInicio] = useState<string>(moment().add(-7, 'days').format('YYYY-MM-DD'))
    const [FechaFinal, setFechaFinal] = useState<string>(moment().format('YYYY-MM-DD'))
    const [activeChart, setActiveChart] = useState<ApexCharts | undefined>();
    const [loader, setloader] = useState<boolean>(false);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(moment().startOf('day').add(3, 'hours'));

    const [dataAlarmas, setDataAlarmas] = useState<any[]>([]);
    const [dataAlarmasFiltrada, setDataAlarmasFiltrada] = useState<any[]>([]);

    const [showModal, setShowModal] = useState<boolean>(false);

     // listado de campos a extraer
     let listadoCampos: MRT_ColumnDef<any>[] =

     [
         {
             accessorKey: 'Movil',
             header: 'Móvil',
             size: 100
         },
         {
             accessorKey: 'Fecha',
             header: 'Fecha',
             size: 80,
             Cell({ cell, column, row, table, }) {
                 // esto se hace para poder reutilizar este metodo para imprimer en excel
                  const value = (row.original != undefined) ?   row.original.Fecha :row;
                 return (moment(value).format(FormatoColombiaDDMMYYYHHmmss))
             }
         }, {
             accessorKey: 'Odometro',
             header: 'Odometro',
             size: 80,
             Cell({ cell, column, row, table, }) {
                 const value = (row.original != undefined) ?   row.original.Odometro :row;
                 return (value.toFixed(2))
             }
         }

     ];

     // useefet que se ejecuta la primera vez, cuando el cliente es seleccionado 
useEffect(() => {
    // consulta la informacion de las alarmas cuando 
    // cambia el ciente seleecionado y las fechas 
    if(ClienteSeleccionado === undefined && Clientes !== undefined)
     setClienteSeleccionado(Clientes[0]) 

 
    ConsultarDataAlarmas();
    // si existe un chart construido lo destruye
    return function cleanUp() {
        if (activeChart) {
          activeChart.destroy();
        }
      };
} , [ClienteSeleccionado]);

// metodo qeu consulta los datos de las alarmas
const ConsultarDataAlarmas = () => {
   let cliente = "";
  if(ClienteSeleccionado === undefined && Clientes !== undefined)
  cliente = Clientes[0].clienteIdS.toString();

  GetReporteAlarmas("914", FechaInicio, FechaFinal)
  .then((response) => 
  {
    //asignamos la informcion consultada 
    setDataAlarmas(response.data);
    setDataAlarmasFiltrada(response.data);
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

}).catch( (e) => { console.log(e)})

}

return(<>
    <PageTitle>Reporte Alarmas</PageTitle>
    <BlockUi tag="div"  keepInView blocking={loader ?? false}  >

    <BaseReportes>
    <div className="card card-rounded bg-transparent " style={{ width: '100%' }}  >

            <div className="row  col-sm-12 col-md-12 col-xs-12 rounded shadow-sm mt-2 bg-secondary  text-primary" style={{ width: '100%' }} >
                <h3 className="card-title fs-4 m-0 ms-2"> Filtros</h3>
                <div className="col-sm-6 col-md-6 col-xs-6 d-flex justify-content-start">
                    <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Fecha inicial: </label>

                    <DatePicker className="mt-2" format="dd/MM/yyyy HH:mm" value={fechaSeleccionada.toDate()}
                        onSelect={(e) => { setFechaSeleccionada(moment(e)) }} />

                    <button className="m-2  btn btn-sm btn-primary" title="Consultar" type="button" onClick={() => { ConsultarDataAlarmas() }}><i className="bi-search"></i></button>

                </div>

                <div className="col-sm-6 col-md-6 col-xs-6 d-flex justify-content-end">
                    <button className="m-2 btn btn-sm btn-primary" title="Consultar" type="button" onClick={() => { setShowModal(true) }}>
                        <i className="bi-car-front-fill"></i></button>

                    <button className="m-2 ms-0 btn btn-sm btn-primary" title="Consultar" type="button" onClick={() => { DescargarExcel(dataAlarmasFiltrada, listadoCampos, "Reporte Alarmas") }}>
                        <i className="bi-file-earmark-excel"></i></button>

                </div>
            </div>
            </div>
 {/* begin::Chart */}
 {
                    // verificamos que exista datos para poder ingresar los datos en el contenedor 

                    (dataAlarmasFiltrada.length > 0) && (
                      <div id="alarma_chart_total" className="col-xl-12" style={{ height: "250px" }} />
                    )
                  }
                  {/* end::Chart      */}
                  </BaseReportes>
                  </BlockUi>
                 
</>)
}