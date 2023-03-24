import Chart, { ChartConfiguration } from "chart.js";
import { ChartDataSets } from "chart.js";
import moment from "moment";
import { useEffect } from "react";
import { getCSSVariableValue } from "../../../../../_start/assets/ts/_utils";
import { useDataDashboard } from "../../core/DashboardProvider";

type Props  = {
    className: string;
}
const TransmisionBarChart: React.FC<Props> = ({className}) =>{
    let  colorsArray = ['#98df8a','#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c',  '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
    const { DataTx, DataFiltrada } = useDataDashboard();
    const RetornarSerie = (data:any[]) => {
        if (data == null || data == undefined)
            return false;
        let dataChart = data;
        //agrupador general o fecha.
        let ClientesAgrupador = dataChart.map((item) => {
            return item.clientenNombre;
        }).filter((value, index, self:any) =>{
            return self.indexOf(value) === index;
        });

        //Para los datos de la grafica principal
        let Datos = new Array();
        //Agrupador por color.
        let EstadosAgrupador = dataChart.map((item) => {
            return item.Estado;
        }).filter((value, index, self:any) =>{
            return self.indexOf(value) === index;
        });
        let sinTx = 0;
        let arrayEstados = new Array();
        // filtramos por los clientes para obtener la agrupacion por  estado
        ClientesAgrupador.forEach(function (cliente) {
            EstadosAgrupador.forEach(function (Estado) {
              data.filter(function (data, index) {
                    if (data.Estado == Estado && data.clientenNombre == cliente){
                        sinTx = sinTx + data.DiasSinTx;
                        arrayEstados.push([sinTx]);
                    }
                });
            });
        });
        // console.log(arrayEstados);
        // ClientesAgrupador.forEach(function (item) {
        //     EstadosAgrupador.forEach(function (itemEstados) {
        //         let filtroEstado = data.filter(function (val, index) {
        //             return val.Estado == itemEstados && val.clientenNombre == item;
        //         });
        //         let num = 0;
        //         let cant = filtroEstado.map((val) =>{
        //             num = num + val.DiasSinTx;
        //         });
        //         Datos.push([itemEstados, num]);
        //     });
        // });
        
    return arrayEstados;
};

//se retornan las etiquetas dinamicamente
const retornarLabels = (data:any[], Etiqueta:string) =>{
    if (data == null || data == undefined)
        return false;
    let agrupadorGeneral = data.map((item) => {
        return item.clientenNombre;
    }).filter((item, index, self) =>{
        return self.indexOf(item) === index;
    });
    return agrupadorGeneral;
}
//el use effect
useEffect(() => {
    const element = document.getElementById(
        `barupdatetx`
    ) as HTMLCanvasElement;
    if (!element) {
        return;
    }


    let labelsArray:string[] = []//['Activas','Implementación'];
    let _data : any[] = [];
    if(DataTx)
    if(DataTx['Transmision'] != undefined){
        let serie =  RetornarSerie(DataTx['Transmision'].filter(function (item:any) {
                    return item.Usuario;
            }))
        _data = (serie != false ? serie:[]);
        let labels =  retornarLabels(DataTx['Transmision'].filter(function (item:any) {
            return item.Fecha;
        }),"Fecha");
        labelsArray =(labels != false ? labels:[])
    }
    let Data = new Array();
// Data.push({"x":[..._data], "y":[...labelsArray]});
    const options = getChartOptions(_data, colorsArray, "Semana", labelsArray);

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
},[DataTx])


    return(
        <div className={className}>
            <canvas id="barupdatetx"></canvas>
        </div>
    )
}

export {TransmisionBarChart}

function getChartOptions(data: ChartDataSets[], colors: string[], titulo: string, labels:  string[]) {
    const tooltipBgColor = getCSSVariableValue("--bs-gray-200");
    const tooltipColor = getCSSVariableValue("--bs-gray-800");
    const options: ChartConfiguration = {
      type: "bar",
      data: {
            labels:labels,
            datasets: data
        },
      options: {
       
        responsive: true,
        legend: {
            display: true,
            labels: {
                fontColor: colors[0]
            }
         
        },
        scales: {
            xAxes: [{
                type: 'category',
                labels: labels,
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        },
        plugins: {
            title: {
              display: true,
              text: 'Semanas'
            }
        }
          
      },
    };
    return options;
  }
