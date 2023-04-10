import Chart, { ChartConfiguration, ChartDataSets } from "chart.js";
import { useEffect } from "react";
import { getCSSVariableValue } from "../../../../../_start/assets/ts/_utils";
import { useDataDashboard } from "../../core/DashboardProvider";

type Props = {
    className: string;
}
const VerticalChart : React.FC<Props> = ({className}) =>{
    let  colorsArray = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
    let  colorsArrayLabels = ["danger", "warning", "primary", "success"]; 
    const { Data, DataFiltrada, Filtrado } = useDataDashboard();
    //Para los datos
    const RetornarSerie = (data:any[]) => {
        if (data == null || data == undefined)
            return false;

        //agrupador general o fecha.
        let agrupadorGeneral = data.map((item) => {
            return item.Vertical;
        }).filter((value, index, self:any) =>{
            return self.indexOf(value) === index;
        });

        //Para los datos de la grafica principal
        let Datos = new Array();
        //Agrupador por color.
        let Semana = data.map((item) => {
            return item.Fecha;
        }).filter((value, index, self:any) =>{
            return self.indexOf(value) === index;
        });

        let arrayEstados = new Array();
        // filtramos por los clientes para obtener la agrupacion por  estado
        agrupadorGeneral.map(function (item) {
            Semana.map(function (itemSemana) {
                let filtroEstado = data.filter(function (val, index) {
                    return (val.Fecha == itemSemana && val.Vertical == item);
                });
                arrayEstados.push([itemSemana, filtroEstado.length]);
            });

        });

        Semana.map(function (itemEstados) {
            let filtroEstado = arrayEstados.filter(function (data, index) {
                return data[0] == itemEstados;
            }).map(function (x) {
                return x[1];
            });

            Datos.push({"label":[...Semana],"data":[...filtroEstado], "backgroundColor": colorsArray[Math.floor(Math.random() * colorsArray.length)]});
        });
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
        let _data : any[] = [];


        if(Filtrado){
            if(DataFiltrada)
                if(DataFiltrada != undefined){
                        let serie =  RetornarSerie(DataFiltrada.filter(function (item:any) {
                            return item.Vertical;
                    }))
                    _data = (serie != false  ? serie:[]);
                    let labels =  retornarLabels(DataFiltrada.filter(function (item:any) {
                        return item.Vertical;
                    }));
                        labelsArray =(labels != false ? labels:[])
                }
            }
        else
        {
            if(Data)
                if(Data['Unidades'] != undefined){
                    let serie =  RetornarSerie(Data['Unidades'].filter(function (item:any) {
                            return item.Vertical;
                    }))
                    _data = (serie != false ? serie:[])
                    let labels =  retornarLabels(Data['Unidades'].filter(function (item:any) {
                        return item.Vertical;
                    }));
                    labelsArray =(labels != false ? labels:[])
                }
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
    },[Data, DataFiltrada, Filtrado])
    return (
        <div className={className}>
            <canvas id="barupdate"></canvas>
        </div>
    )
}
export {VerticalChart}

function getChartOptions(Data:ChartDataSets[], colors: string[], titulo: string, labels:  string[]) {
    const tooltipBgColor = getCSSVariableValue("--bs-gray-200");
    const tooltipColor = getCSSVariableValue("--bs-gray-800");
    const options: ChartConfiguration = {
        type: "horizontalBar",
        data:{
            labels:labels,
            datasets: Data
        },
      options: {
        responsive: true,
        tooltips: {
                intersect: false,
                mode: "nearest",
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0,
            callbacks:{
                label:(val:any, cant:any) =>{
                    return  `${cant.datasets[val.datasetIndex].label[val.datasetIndex]} : ${cant.datasets[val.datasetIndex].data[val.index]}`;
                }
            }
        },
        legend:{
            display:false
        },
      },
    };
    return options;
  }
