import { useDataDashboard } from "../../core/DashboardProvider";
import Chart from "chart.js";
import { ChartConfiguration } from "chart.js";
import { useEffect } from "react";
import { getCSSVariableValue } from "../../../../../_start/assets/ts/_utils";
type Props = {
    className: string;
}
const SemanasChart :React.FC<Props> = ({className}) =>{
//Se importan los datos
const { Data, DataFiltrada } = useDataDashboard();
const RetornarSerie = (data:any[]) => {
    var dataChart = data;
    //Para los datos de la grafica principal
    let Datos = new Array();
    //Agrupador por color.
    let agrupadorData = dataChart.map((item) => {
        return item.Administrador;
    }).filter((value, index, self:any) =>{
        return self.indexOf(value) === index;
    });
    agrupadorData.map((item) =>{
        let totalAdmon = data.filter(function (data, index) {
            if (data.Administrador == item)
                return data.Descripcion
        }).length;
        Datos.push([totalAdmon]);
    })
   return Datos;
};

//se retornan las etiquetas dinamicamente
const retornarLabels= (data:any[]) =>{
    if (data == null || data == undefined)
        return false;
    let agrupadorGeneral = data.map((item) => {
            return item.Administrador;
        }).filter((value, index, self:any) =>{
            return self.indexOf(value) === index;
        });
    return agrupadorGeneral;
}

 //el use effect
 useEffect(() => {
    const element = document.getElementById(
        `pieupdate`
    ) as HTMLCanvasElement;
    if (!element) {
        return;
    }

    let  colorsArray = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
    let  colorsArrayLabels = ["danger", "warning", "primary", "success"]; 
    let labelsArray:string[] = []//['Activas','Implementación'];
    let _data : number[] = [];
    if(Data)
    if(Data['Unidades'] != undefined){
    let serie =  RetornarSerie(Data['Unidades'].filter(function (item:any) {
                return item.Vertical;
        }))
        _data = (serie.length != 0 ? serie:[]);
        let labels =  retornarLabels(Data['Unidades'].filter(function (item:any) {
                return item.Vertical;
        }));
        labelsArray =(labels != false ? labels:[])
    }
        
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
},[Data])
    return (
        
        <>
         <div className={className}>
            <canvas id="pieupdate"></canvas>
        </div>
        </>
    )
}
export {SemanasChart}

function getChartOptions(data: number[], colors: string[], titulo: string, labels:  string[]) {
    const tooltipBgColor = getCSSVariableValue("--bs-gray-200");
    const tooltipColor = getCSSVariableValue("--bs-gray-800");
    const options: ChartConfiguration = {
      type: "pie",
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
        responsive: true,
        legend: {
          position: "bottom",
        },
        
        plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Semanas'
            }
          }
      },
    };
    return options;
  }
