import { useDataDashboard } from "../../core/DashboardProvider";
import Chart from "chart.js";
import { ChartConfiguration } from "chart.js";
import { useEffect, useState } from "react";
import { getCSSVariableValue } from "../../../../../_start/assets/ts/_utils";
import ReactApexChart from "react-apexcharts";
type Props = {
    className: string;
    OBC:string;
}
const SemanasChart :React.FC<Props> = ({className, OBC}) =>{
//Se importan los datos
const { Data, DataFiltrada, Filtrado } = useDataDashboard();
const [Semanas, setSemanas] = useState<any>(null);

useEffect(() => {
    let opciones = {
      options: {
        chart: {
          id: 'apexchart-semanas',
        }
      },
      series: [],
      dataLabels: {
        enabled: false
      }
    }
    setSemanas(opciones);
    return function cleanUp() {
      //SE DEBE DESTRUIR EL OBJETO CHART
    };
  }, [OBC])


const RetornarSerie = (data:any[]) => {
    var dataChart = data;
    //Para los datos de la grafica principal
    let Datos = new Array();
    //Agrupador por color.
    let agrupadorData = dataChart.map((item) => {
        if(item.OBCSyscaf ==  OBC)
            return item.Administrador;
    }).filter((value, index, self:any) =>{
        return self.indexOf(value) === index;
    });

    agrupadorData.map((item) =>{
        if(item != null){
            let totalAdmon = data.filter(function (val, index) {
                if (val.Administrador == item && val.OBCSyscaf == OBC)
                    return val.Descripcion
            }).length;
            Datos.push(totalAdmon);
        }
    })

    ApexCharts.exec('apexchart-semanas', 'updateOptions', {
        chart: {
            fill: {
                colors:['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
            },
            toolbar: {
                show: false
            },

        },
        colors: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
    }
    );
    ApexCharts.exec('apexchart-semanas', 'updateOptions', {
        // Para los nombres de la serie
        //para que la lengenda me salga en la parte de abajo
        labels: agrupadorData.filter((e) => e),
        legend: {
            show: true,
            position: 'bottom'
        },
    });
 // actializar los datos
 ApexCharts.exec('apexchart-semanas', 'updateSeries',Datos
);

};

 //el use effect
 useEffect(() => {
    if(Data)
        if(Data['Unidades'] != undefined){
            RetornarSerie(Data['Unidades'].filter(function (item:any) {
                if(item.OBCSyscaf == OBC)
                    return item.Vertical;
            }))
        }
        
    
},[Data, Filtrado, DataFiltrada])
    return (
        
        <>
         <div className={className}>
            <div className="text-center pt-5">
                <label className="label label-sm fw-bolder">SEMANA</label>
            </div>
            {
                    (Semanas != null) && (Semanas.options != undefined) && (<ReactApexChart options={Semanas.options} series={Semanas.series} type="pie" height={350} />)
                }
        </div>
        </>
    )
}
export {SemanasChart}
