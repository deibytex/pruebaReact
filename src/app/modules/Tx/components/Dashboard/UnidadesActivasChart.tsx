import ApexCharts from "apexcharts";
import { useEffect, useState } from "react";
import { useDataDashboard } from "../../core/DashboardProvider";
import ReactApexChart from "react-apexcharts";

type Props = {
  className: string;
  OBC:string;  
}
const UnidadesActivasChart: React.FC<Props> = ({ className, OBC }) => {
  const { Data, DataFiltrada, Filtrado } = useDataDashboard();
  const [UnidadesActivas, setUnidadesActivas] = useState<any>(null);
  useEffect(() => {
    let opciones = {
      options: {
        chart: {
          id: 'apexchart-unidades',
        }
      },
      series: [],
      dataLabels: {
        enabled: false
      }
    }
    setUnidadesActivas(opciones);
    return function cleanUp() {
      //SE DEBE DESTRUIR EL OBJETO CHART
    };
  }, [])

  const ActualizarGraficas = (Data: any) => {
    let nombreSeries: any[] = []
    let cantidadUnidadesActivas = 0;
    nombreSeries = Data.map((item: any) => {
      if (item.ClasificacionId == 'Si' || item.ClasificacionId == 'No')
        return item.ClasificacionId;
    }).filter((value: any, index: any, self: any) => {
      return self.indexOf(value) === index;
    });

    let datosUnidadesActivas: any[] = [];
    nombreSeries.map((item: any) => {
      if (item != undefined) {
        let prefiterdata = Data.filter(function (val: any) {
          if (val.ClasificacionId == item)
            return val.ClienteId
        });
        datosUnidadesActivas.push(Number.parseInt(prefiterdata.length.toString()));
        cantidadUnidadesActivas = cantidadUnidadesActivas + prefiterdata.length;
      }
    })

    let labels = nombreSeries.map((e) => {
      if(e != undefined )
        return (e == "Si"  ? "Activa" :  "No Activa" )
    }).filter((f) => f );
    
    ApexCharts.exec('apexchart-unidades', 'updateOptions', {
      chart: {
        fill: {
          colors: ['#1f77b4', '#aec7e8']
        },
        toolbar: {
          show: false
        },

      },
      colors: ['#1f77b4', '#aec7e8'],
    }
    );
    ApexCharts.exec('apexchart-unidades', 'updateOptions', {
      // Para los nombres de la serie
      labels: labels.filter((e) =>e),
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
    ApexCharts.exec('apexchart-unidades', 'updateSeries', datosUnidadesActivas);
  }
  useEffect(() => {
    if (Filtrado) {
      (DataFiltrada != undefined && DataFiltrada != undefined ? ActualizarGraficas(DataFiltrada) : console.log("Cargando serie..."))
    }
    else {
      (Data != undefined && Data["Unidades"] != undefined ? ActualizarGraficas(Data["Unidades"]) : console.log("Cargando serie..."))
    }
  }, [Data, Filtrado, DataFiltrada])
  return (
    <>
      <div className={className}>
        <div className="text-center pt-5">
            <label className="label label-sm fw-bolder">UINDADES ACTIVAS</label>
        </div>
        {
          (UnidadesActivas != null) && (UnidadesActivas.options != undefined) && (<ReactApexChart options={UnidadesActivas.options} series={UnidadesActivas.series} type="donut" height={350} />)
        }
      </div>

    </>
  );
}
export { UnidadesActivasChart }

