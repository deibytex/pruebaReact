import Chart from "chart.js";
import { ChartConfiguration } from "chart.js";
import { useEffect, useState } from "react";
import { getCSSVariableValue } from "../../../../../_start/assets/ts/_utils";
import { useDataDashboard } from "../../core/DashboardProvider";
import ReactApexChart from "react-apexcharts";

type Props = {
  className: string;
}
const OtrasUnidadesChart: React.FC<Props> = ({ className }) => {

  //Se importan los datos
  const { Data, DataFiltrada, Filtrado } = useDataDashboard();
  const [OtrasUnidadesActivas, setOtrasUnidadesActivas] = useState<any>(null);


  useEffect(() => {
    let opciones = {
      options: {
        chart: {
          id: 'apexchart-otrasunidades',
          fontFamily: 'Montserrat',
        }
      },
      series: [],
      dataLabels: {
        enabled: false
      }
    }
    setOtrasUnidadesActivas(opciones);
    return function cleanUp() {
      //SE DEBE DESTRUIR EL OBJETO CHART
    };
  }, [])

  const ActualizarGraficas = (Data: any) => {
    let nombreSeries: any[] = []
    let cantidadUnidadesActivas = 0;
    nombreSeries = Data.map((item: any) => {
         return (item.ClasificacionId != 'Si' || item.ClasificacionId  ? item.Vertical:undefined);
    }).filter((value: any, index: any, self: any) => {
        return  self.indexOf(value) === index;
    });
    let datos: any[] = [];
    nombreSeries.map((item: any) => {
      if (item != undefined ) {
          let prefiterdata = Data.filter(function (val: any) {
              if (val.Vertical == item)
                  return val.ClienteId
          });
          datos.push(Number.parseInt(prefiterdata.length.toString()));
          cantidadUnidadesActivas = cantidadUnidadesActivas + prefiterdata.length;
      
      }
    })

    ApexCharts.exec('apexchart-otrasunidades', 'updateOptions', {
      chart: {
        fill: {
          colors: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
        },
        toolbar: {
          show: false
        },

      },
      colors: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
    }
    );
    ApexCharts.exec('apexchart-otrasunidades', 'updateOptions', {
      // Para los nombres de la serie
      labels: nombreSeries.filter((e) => e),
      //para que la lengenda me salga en la parte de abajo
      legend: {
        show: true,
        position: 'bottom'
      },
      //para darle forma a los totales
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total:
              {
                show: true,
                label: 'Total',
                color: '#373d3f',
                formatter: function (w: any) {
                  return w.globals.seriesTotals.reduce((a: any, b: any) => {
                    return a + b
                  }, 0)
                }
              },
              value: {
                offsetY: -8, // -8 worked for me
                color: '#ff00ff'
              }
            }
          }
        }
      }
    });
    // actializar los datos
    ApexCharts.exec('apexchart-otrasunidades', 'updateSeries', datos);
  }



  //  //se retorna las series
  //  const RetornarSerie = (data:any[]) => {
  //     if (data == null || data == undefined)
  //         return false;
  //     //Filtro datos unidadesactivas
  //     var OtrasUnidades = data;

  //     //Para los datos de la dona activos
  //     let datosNoUnidadesActivas : number[]= [];
  //     let cantidadNOUnidadesActivas = 0;
  //     //Agrupador por color unidades activas.
  //     let agrupadorUnidadesActivas = OtrasUnidades.map((item:any) => {
  //         if (item.ClasificacionId != 'Activas' || item.ClasificacionId != 'Implementación')
  //             return item.ClasificacionId;
  //     }).filter((value, index, self:any) =>{
  //              return self.indexOf(value) === index;
  //     });
  //     agrupadorUnidadesActivas.map((item) =>{
  //         if (item != undefined && item != 'Activas' && item != 'Implementación') {
  //             let prefiterdata = data.filter(function (val:any) {
  //                 if (val.ClasificacionId == item)
  //                     return val.Descripcion
  //             });
  //             datosNoUnidadesActivas.push(Number.parseInt(prefiterdata.length.toString()));
  //             cantidadNOUnidadesActivas = cantidadNOUnidadesActivas + prefiterdata.length;
  //         }
  //     })
  //     //Retornamos la serie
  //    return datosNoUnidadesActivas;
  // };

  // //se retornan las etiquetas dinamicamente
  // const retornarLabels= (data:any[]) =>{
  //     if (data == null || data == undefined)
  //         return false;
  //     let datosUnidadesActivas : string[]= [];
  //     let cantidadUnidadesActivas = 0;
  //     //Agrupador por color unidades activas.
  //     let agrupadorUnidadesActivas = data.map((item:any) => {
  //             return item.ClasificacionId;
  //     }).filter((value, index, self) =>{
  //         return self.indexOf(value) === index;
  //     });
  //     //Dona Unidades Activas
  //     return agrupadorUnidadesActivas.filter( (vale) =>{
  //         return (vale != 'Implementación' && vale != 'Activas')
  //     });
  // }

  //el use effect
  useEffect(() => {
    if (Filtrado) {
      (DataFiltrada != undefined && DataFiltrada != undefined ? ActualizarGraficas(
        DataFiltrada.filter(function (item: any) {
            if (item.ClasificacionId != 'Si'){
              return item.Vertical;
            }
        })
      ) : console.log("Cargando serie..."))
    }
    else {
      let data = Data != undefined && Data["Unidades"] != undefined ?  Data["Unidades"].filter(function (item: any) {
        if (item.ClasificacionId != 'Si')
          return item.Vertical;
      }): [];
      
      (Data != undefined && Data["Unidades"] != undefined ? ActualizarGraficas(data) : console.log("Cargando serie..."))
    }
    // const element = document.getElementById(
    //     `donaOtrasUnidades`
    // ) as HTMLCanvasElement;
    // if (!element) {
    //     return;
    // }

    // let  colorsArray = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
    // let  colorsArrayLabels = ["danger", "warning", "primary", "success"]; 
    // let labelsArray:string[] = []//['Activas','Implementación'];
    // let _data : number[] = [];

    //   if(Filtrado){
    //     let dataFiltrada:any[] =[] 
    //     if(DataFiltrada)
    //         if(DataFiltrada != undefined){
    //                 let serie =  RetornarSerie(DataFiltrada.filter(function (item:any) {
    //                   if (item.ClasificacionId != 'Activas' || item.ClasificacionId != 'Implementación')
    //                   return item.ClasificacionId;
    //             }))
    //             _data = (serie != false  ? serie:[]);
    //             let labels =  retornarLabels(DataFiltrada.filter(function (item:any) {
    //               if (item.ClasificacionId != 'Activas' || item.ClasificacionId != 'Implementación')
    //               return item.ClasificacionId;
    //             }));
    //                 labelsArray =(labels != false ? labels:[])
    //             }
    //     }
    // else
    // {
    //   if(Data)
    //   if(Data['Unidades'] != undefined){
    //   let serie =  RetornarSerie(Data['Unidades'].filter(function (item:any) {
    //           if (item.ClasificacionId != 'Activas' || item.ClasificacionId != 'Implementación')
    //               return item.ClasificacionId;
    //       }))
    //       _data = (serie != false ? serie:[]);
    //       let labels =  retornarLabels(Data['Unidades'].filter(function (item:any) {
    //           if (item.ClasificacionId != 'Activas' || item.ClasificacionId != 'Implementación')
    //               return item.ClasificacionId;
    //       }));
    //       labelsArray =(labels != false ? labels:[])
    //   }

    // }
    //   const options = getChartOptions(_data, colorsArray, "Otras Unidades", labelsArray);
    //   const ctx = element.getContext("2d");
    //   let myDoughnut: Chart | null;

    //   if (ctx && labelsArray.length > 0) {   
    //   myDoughnut = new Chart(ctx, options);
    //   }
    //   return function cleanUp() {
    //   if (myDoughnut) {
    //       myDoughnut.destroy();
    //   }
    //   };
  }, [Data, Filtrado, DataFiltrada])

  return (
    <>
      <div className={className}>
          <div className="text-center pt-5">
            <label className="label label-sm fw-bolder">OTRAS UNIDADES</label>
          </div>
        {
          (OtrasUnidadesActivas != null) && (OtrasUnidadesActivas.options != undefined) && (<ReactApexChart options={OtrasUnidadesActivas.options} series={OtrasUnidadesActivas.series} type="donut" height={350} />)
        }
      </div>

    </>
    // <div className={className}>
    //     <canvas style={{display: 'block', height: '200px', width: '378px'}} id="donaOtrasUnidades"></canvas>
    // </div>
  );
}


export { OtrasUnidadesChart }
