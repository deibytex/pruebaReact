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
    let  colorsArray = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
    const { DataTx, FiltradoTx, DataFiltradaTx } = useDataDashboard();
    const RetornarSerie = (data:any[]) => {
        if (data == null || data == undefined)
        return false;

    let dataChart = data;
    //agrupador general o fecha.
    let agrupadorGeneral = data.map((item) => {
        return item.clientenNombre;
    }).filter((value, index, self:any) =>{
        return self.indexOf(value) === index;
    });

    //Para los datos de la grafica principal
    let Datos = new Array();
    //Agrupador por color.
    let agrupadorData = data.map((item) => {
        return item.Estado;
    }).filter((value, index, self:any) =>{
        return self.indexOf(value) === index;
    });

    let arrayEstados = new Array();
    // filtramos por los clientes para obtener la agrupacion por  estado
    agrupadorGeneral.map(function (item) {

        agrupadorData.map(function (itemEstados) {
            let filtroEstado = data.filter(function (data, index) {
                return (data.Estado == itemEstados && data.clientenNombre == item);
            });

            arrayEstados.push([itemEstados, filtroEstado.length]);
        });

    });

    agrupadorData.map(function (itemEstados) {
        let filtroEstado = arrayEstados.filter(function (data, index) {

            return data[0] == itemEstados;
        }).map(function (x) {
            return x[1];
        });

        Datos.push({"label":[...agrupadorData],"data":[...filtroEstado], "backgroundColor": colorsArray[Math.floor(Math.random() * colorsArray.length)]});
    });
    return Datos;
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

    if(FiltradoTx){
        let dataFiltrada:any[] =[] 
        if(DataFiltradaTx)
            if(DataFiltradaTx != undefined){
                    let serie =  RetornarSerie(DataFiltradaTx.filter(function (item:any) {
                        return item.Usuario;
                }))
                _data = (serie != false  ? serie:[]);
                let labels =  retornarLabels(DataFiltradaTx.filter(function (item:any) {
                    return item.Fecha;
                }),"Fecha");
                    labelsArray =(labels != false ? labels:[])
            }
        }
    else
    {
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
},[DataTx, FiltradoTx, DataFiltradaTx])


    return(
        <div className={className}>
            <canvas id="barupdatetx"></canvas>
        </div>
    )
}

export {TransmisionBarChart}

function getChartOptions(data: ChartDataSets[], colors: string[], titulo: string, labels:  string[]) {
    const options: ChartConfiguration = {
      type: "bar",
      data: {
            labels:labels,
            datasets: data
        },
      options: {
        responsive: true,
        legend:{
            display:false,
            position:'right'
        },
        legendCallback:(e:any) =>{
            return e;
        },
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        },
        tooltips: {
            callbacks:{
                label:(val:any, cant:any) =>{
                    return  `${cant.datasets[val.datasetIndex].label[val.datasetIndex]} : ${cant.datasets[val.datasetIndex].data[val.index]}`;
                }
            }
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
