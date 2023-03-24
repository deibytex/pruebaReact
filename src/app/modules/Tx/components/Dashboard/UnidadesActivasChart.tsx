import ApexCharts, { ApexOptions } from "apexcharts";
import Chart, { ChartConfiguration } from "chart.js";
import { useEffect, useState } from "react";
import { getCSSVariableValue } from "../../../../../_start/assets/ts/_utils";
import { useDataDashboard } from "../../core/DashboardProvider";

type Props = {
    className: string;
}
const UnidadesActivasChart : React.FC<Props>= ({ className}) =>{
    //Se importan los datos
     const { Data, DataFiltrada } = useDataDashboard();
     //se retorna las series
     const RetornarSerie = (data:any[]) => {
        if (data == null || data == undefined)
            return false;
        //Filtro datos unidadesactivas
        var dataUnidadesActivas = data;
    
        //Para los datos de la dona activos
        let datosUnidadesActivas : number[]= [];
        let cantidadUnidadesActivas = 0;
        //Agrupador por color unidades activas.
        let agrupadorUnidadesActivas = dataUnidadesActivas.map((item:any) => {
            if (item.ClasificacionId == 'Activas' || item.ClasificacionId == 'Implementación')
                return item.ClasificacionId;
        }).filter((value, index, self) =>{
            return self.indexOf(value) === index;
        });
         // arma los agrupadores por datos unidades activas
        agrupadorUnidadesActivas.map((item) =>{
            if (item != undefined) {
              let prefiterdata = data.filter(function (val:any) {
                  if (val.ClasificacionId == item)
                      return val.ClienteId
              });
              datosUnidadesActivas.push(Number.parseInt(prefiterdata.length.toString()));
              cantidadUnidadesActivas = cantidadUnidadesActivas + prefiterdata.length;
          }
        })
        //Retornamos la serie
       return datosUnidadesActivas;
    };
    //se retornan las etiquetas dinamicamente
    const retornarLabels= (data:any[]) =>{
            if (data == null || data == undefined)
                return false;
            let datosUnidadesActivas : string[]= [];
            let cantidadUnidadesActivas = 0;
            //Agrupador por color unidades activas.
            let agrupadorUnidadesActivas = data.map((item:any) => {
                if (item.ClasificacionId == 'Activas' || item.ClasificacionId == 'Implementación')
                    return item.ClasificacionId;
            }).filter((value, index, self) =>{
                return self.indexOf(value) === index;
            });
            
            //Dona Unidades Activas
            return agrupadorUnidadesActivas;
    }
    //el use effect
     useEffect(() => {
        const element = document.getElementById(
            `donuts-update`
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
                if (item.ClasificacionId == 'Activas' || item.ClasificacionId == 'Implementación')
                    return item.ClasificacionId;
            }))
            _data = (serie != false ? serie:[]);
            let labels =  retornarLabels(Data['Unidades'].filter(function (item:any) {
                if (item.ClasificacionId == 'Activas' || item.ClasificacionId == 'Implementación')
                    return item.ClasificacionId;
            }));
            labelsArray =(labels != false ? labels:[])
          }
               
        const options = getChartOptions(_data, colorsArray, "Unidades Activas", labelsArray);

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
            <canvas id="donuts-update"></canvas>
        </div>
      
    );
}
export { UnidadesActivasChart }
//funcion de configuracion
function getChartOptions(data: number[], colors: string[], titulo: string, labels:  string[]) {
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
          display: true,
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

