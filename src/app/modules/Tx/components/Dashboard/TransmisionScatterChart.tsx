import { Label } from "@mui/icons-material";
import Chart, { ChartConfiguration, ChartDataSets } from "chart.js";
import moment from "moment";
import { useEffect } from "react";
import { getCSSVariableValue } from "../../../../../_start/assets/ts/_utils";
import { useDataDashboard } from "../../core/DashboardProvider";

type Props = {
    className: string;
}
const TransmisionScatterChart : React.FC<Props> = ({ className}) =>{
   let  colorsArray = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c',  '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
    // let  colorsArray = ['#ff9896'];
  //  let  colorsArrayLabels = ['#F9EE07']; 
    const { DataTx, FiltradoTx,DataFiltradaTx } = useDataDashboard();
    const RetornarSerie = (data:any[]) => {
        var dataChart = data;
        //Para los datos de la grafica principal
        let Datos = new Array();
        let retornarDatos = new Array();
        //Agrupador por color.
        let agrupadorData = dataChart.map((item) => {
            return item.Usuario;
        }).filter((value, index, self:any) =>{
            return self.indexOf(value) === index;
        });
        agrupadorData.map((item, index) =>{
            let totalAdmon = data.filter(function (data, index) {
                if (data.Usuario == item)
                    return data.registrationNumber
            }).length;
            let Usuarios = data.map(function (data, index) {
                if (data.Usuario == item)
                    return data.Usuario
            }).filter((val,index, self) =>{
                if(val != undefined)
                    return self.indexOf(val) === index;
            });
           let xCan =  data.map((item) => {
                return moment(item["Fecha"]).format("DD/MM/YYYY").toString();
            }).filter((value, index, self:any) =>{
                return self.indexOf(value) === index;
            });

           // Datos.push({"label":Usuarios[0],"data":{"x":totalAdmon, "y":totalAdmon}, "backgroundColor":colorsArray, "borderColor":colorsArrayLabels});
            Datos.push({"label":Usuarios[0],"data":[totalAdmon], "backgroundColor": colorsArray[Math.floor(Math.random() * colorsArray.length)]});
        })
       return Datos;
    };

    //se retornan las etiquetas dinamicamente
    const retornarLabels= (data:any[], Etiqueta:string) =>{
        if (data == null || data == undefined)
            return false;
        let agrupadorGeneral = data.map((item) => {
                return moment(item[Etiqueta]).format("DD/MM/YYYY").toString();
            }).filter((value, index, self:any) =>{
                return self.indexOf(value) === index;
            });
        return agrupadorGeneral;
    }

    //el use effect
    useEffect(() => {
        const element = document.getElementById(
            `scatterupdate`
        ) as HTMLCanvasElement;
        if (!element) {
            return;
        }
    
        let labelsArray:string[] = []//['Activas','Implementación'];
        let _data : ChartDataSets[] = [];

        if(FiltradoTx){
            let dataFiltrada:any[] =[] 
            if(DataFiltradaTx)
                if(DataFiltradaTx != undefined){
                        let serie =  RetornarSerie(DataFiltradaTx.filter(function (item:any) {
                            return item.Usuario;
                    }))
                    _data = (serie.length != 0 ? serie:[]);
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
                _data = (serie.length != 0 ? serie:[]);
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
    },[DataTx, FiltradoTx,DataFiltradaTx ])

    return(
        <div className={className}>
            <canvas id="scatterupdate"></canvas>
        </div>
       
    )
}
export {TransmisionScatterChart}

function getChartOptions(data: ChartDataSets[], colors: string[], titulo: string, labels:  string[]) {
    const tooltipBgColor = getCSSVariableValue("--bs-gray-200");
    const tooltipColor = getCSSVariableValue("--bs-gray-800");
    const options: ChartConfiguration = {
      type: "bubble",
      data: {
            labels:labels,
            datasets: data
        },
      options: {
        tooltips: {
            callbacks:{
                label:(val:any, cant:any) =>{
                    return  `${cant.datasets[val.datasetIndex].label} : ${cant.datasets[val.datasetIndex].data[0]}`;
                }
            }
        },
        legend:{
            display:true,
            position:'right'
        },
        responsive: true,
        scales: {
            xAxes: [{
                type: 'category',
                labels: labels
            }]
        },
        plugins: {
            title: {
              display: true,
              text: 'Semanas'
            },
        }
          
      },
    };
    return options;
  }
