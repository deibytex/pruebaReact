import Chart, { ChartConfiguration } from "chart.js";
import { useEffect } from "react";
import { getCSSVariableValue } from "../../../../../_start/assets/ts/_utils";
import { useDataDashboard } from "../../core/DashboardProvider";

type Props = {
    className: string;
}
const VerticalChart : React.FC<Props> = ({className}) =>{
    const { Data, DataFiltrada } = useDataDashboard();
    const RetornarSerie = (data:any[]) => {
        var dataChart = data;
        //Para los datos de la grafica principal
        let Datos = new Array();
        //Agrupador por color.
        let agrupadorData = dataChart.map((item) => {
            return item.Vertical;
        }).filter((value, index, self:any) =>{
            return self.indexOf(value) === index;
        });
        agrupadorData.map((item) =>{
            let Vertical = data.filter(function (data, index) {
                if (data.Vertical == item)
                    return data.Vertical
            }).length;
            Datos.push([Vertical]);
        })
       return Datos;
    };
   //se retornan las etiquetas dinamicamente
    const retornarLabels = (data:any[]) =>{
        if (data == null || data == undefined)
            return false;
        let agrupadorGeneral = data.map((item) => {
                return item.Vertical;
            }).filter((value, index, self:any) =>{
                return self.indexOf(value) === index;
            });
        return agrupadorGeneral;
    }
    //el use effect
    useEffect(() => {
        const element = document.getElementById(
            `barupdate`
        ) as HTMLCanvasElement;
        if (!element) {
            return;
        }

        let  colorsArray = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
        let  colorsArrayLabels = ["bg-danger", "bg-warning", "bg-primary", "bg-success"]; 
        let labelsArray:string[] = []//['Activas','Implementación'];
        let _data : number[] = [];
        if(Data)
        if(Data['Unidades'] != undefined){
        let serie =  RetornarSerie(Data['Unidades'].filter(function (item:any) {
                return item.Vertical;
            }))
            _data = serie
            let labels =  retornarLabels(Data['Unidades'].filter(function (item:any) {
                return item.Vertical;
            }));
            labelsArray =(labels != false ? labels:[])
        }
          
        const options = getChartOptions( _data, colorsArray, "Verticales", labelsArray);

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
    },[Data])
    return (
        <div className={className}>
            <canvas id="barupdate"></canvas>
        </div>
    )
}
export {VerticalChart}

function getChartOptions(Data:number[], colors: string[], titulo: string, labels:  string[]) {
    const tooltipBgColor = getCSSVariableValue("--bs-gray-200");
    const tooltipColor = getCSSVariableValue("--bs-gray-800");
    const options: ChartConfiguration = {
      type: "horizontalBar",
      data: {
        datasets: [
          {
            data: Data,
            backgroundColor: colors,
          },
        ],
        labels: labels,
      },
      options: {
        // scales: {
        //     xAxes: [{
        //         type: 'category',
        //         labels: ['January', 'February', 'March', 'April', 'May', 'June']
        //     }]
        // },
        responsive: true,
        plugins: {
            legend: {
              position: 'right',
            },
            title: {
              display: true,
              text: titulo
            }
          }
      },
    };
    return options;
  }
