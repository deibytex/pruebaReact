import { Checkbox, CheckboxGroup } from "rsuite";
import { useDataDashboard } from "../../core/DashboardProvider";
import { OtrasUnidadesChart } from "./OtrasUnidadesChart";
import { SemanasChart } from "./SemanasChart";
import { UnidadesActivasChart } from "./UnidadesActivasChart";
import { VerticalChart } from "./VerticalChart";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
type Props = {
    tab: string;
}
const UnidadesActivasOBC: React.FC<Props> = ({ tab }) => {
    const { Data, DataFiltrada, Filtrado } = useDataDashboard();
    const defaultPriopios: any[] = [
        {
            name: 'Propios',
            data: [],
            isSelected: true,
            getData: (MVSyscaf: any, f: any) => {
                return {
                    "x": MVSyscaf
                }
            }
        },
        {
            name: 'Arrendados',
            data: [],
            isSelected: true,
            getData: (MVSyscaf: any, f: any) => {
                return {
                    "x": MVSyscaf
                }
            }
        }
    ];
    let preSeleccionados = defaultPriopios.filter(x => x.isSelected).map(x => x.name);
    const [eventsSelected, setEventsSelected] = useState(defaultPriopios);
    const [value, setValue] = useState<any[]>(preSeleccionados);
    const [Semanas, setSemanas] = useState<any>(null);
    const [Vertical, setVertical] = useState<any>(null);
    const [UnidadesActivas, setUnidadesActivas] = useState<any>(null);
    const [OtrasUnidadesActivas, setOtrasUnidadesActivas] = useState<any>(null);

    const handleChange = (value: any[]) => {
        let aux = defaultPriopios.map((x: any) => {
            x.isSelected = value.includes(x.name);
            return x;
        });
        setValue(value);
        setEventsSelected(aux);
    };

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
        //Para las verticales
        let opcionesVertical = {
            options: {
                chart: {
                    id: 'apexchart-vertical',
                }
            },
            series: [],
            dataLabels: {
                enabled: false
            },
            xaxis: {
                type: 'category'
            }
        }
        setVertical(opcionesVertical);
        //UA
        let opcionesUnidades = {
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
          setUnidadesActivas(opcionesUnidades);

          //OTRAS UNIDADES
          let opcionesOtrasUnidades = {
            options: {
              chart: {
                id: 'apexchart-otrasunidades',
              }
            },
            series: [],
            dataLabels: {
              enabled: false
            }
          }
          setOtrasUnidadesActivas(opcionesOtrasUnidades);
        return function cleanUp() {
            //SE DEBE DESTRUIR EL OBJETO CHART
        };
    }, [])

    const RetornarSerie = (data: any[], VerticalData:any[] ) => {
        var dataChart = data.filter((e:any) =>{
            if(e.OBCSyscaf == "Si")
            return e;
        });
        //Para los datos de la grafica principal
        let Datos = new Array();
        //Agrupador por color.
        let agrupadorData = dataChart.map((item) => {
                return item.Administrador;
        }).filter((value, index, self: any) => {
            return self.indexOf(value) === index;
        });

        agrupadorData.map((item) => {
            if (item != null) {
                let totalAdmon = data.filter(function (val, index) {
                    if (val.Administrador == item && val.OBCSyscaf == "Si")
                        return val.Descripcion
                }).length;
                Datos.push(totalAdmon);
            }
        })

        ApexCharts.exec('apexchart-semanas', 'updateOptions', {
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
        ApexCharts.exec('apexchart-semanas', 'updateSeries', Datos
        );

        //Vertical
        let agrupadorGeneral = VerticalData.map((item) => {
            if(item.OBCSyscaf == "Si" && item.ClasificacionId == "Si")
                return item.Vertical;
        }).filter((value, index, self: any) => {
            return self.indexOf(value) === index;
        });
       
         //Agrupador por color.
         let Semana = VerticalData.map((item) => {
             return item.Fecha;
         }).filter((value, index, self: any) => {
             return self.indexOf(value) === index;
         });
         let arrayEstados = new Array();
         // filtramos por los clientes para obtener la agrupacion por  estado
         agrupadorGeneral.map(function (item) {
             if(item != undefined){
                 Semana.map(function (itemSemana) {
                     let filtroEstado = data.filter(function (val, index) {
                         return (val.Fecha == itemSemana && val.Vertical == item && val.OBCSyscaf == "Si");
                     });
                     arrayEstados.push([{
                         x: item,
                         y: filtroEstado.length
                     }]);
                 });
             }
         });

         ApexCharts.exec('apexchart-vertical', 'updateOptions', {
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
        ApexCharts.exec('apexchart-vertical', 'updateOptions', {
            // Para los nombres de la serie
            //para que la lengenda me salga en la parte de abajo
            labels: agrupadorGeneral.filter((e) => e),
            legend: {
                show: true,
                position: 'bottom'
            },
            tooltip: {
                y: {
                    formatter: function (value: any, serie: any, index: any) {
                        return `${serie.w.config.labels[serie.dataPointIndex]} : ${value}`
                    }
                }
            },
            //para darle forma a los totales
            plotOptions: {
                bar: {
                    horizontal: true
                }
            }
        });
            // actializar los datos
            ApexCharts.exec('apexchart-vertical', 'updateSeries',
                [
                    {
                        name: [...Semana],
                        data: arrayEstados.map((val) => {
                            return val[0].y;
                        })
                    }
                ]
            );


            //UNIDADES ACTIVAS
            let nombreSeries: any[] = []
            let cantidadUnidadesActivas = 0;
            nombreSeries = data.map((item: any) => {
              if (item.OBCSyscaf == 'Si')
                if(item.ClasificacionId != "No Definido" && item.ClasificacionId == 'Si' || item.ClasificacionId == 'No')
                    return item.ClasificacionId;
            }).filter((value: any, index: any, self: any) => {
              return self.indexOf(value) === index;
            });
        
            let datosUnidadesActivas: any[] = [];
            nombreSeries.map((item: any) => {
              if (item != undefined && item != "No Definido") {
                let prefiterdata = data.filter(function (val: any) {
                  if (val.ClasificacionId == item && val.OBCSyscaf == "Si")
                    return val.ClienteId
                });
                datosUnidadesActivas.push(Number.parseInt(prefiterdata.length.toString()));
                cantidadUnidadesActivas = cantidadUnidadesActivas + prefiterdata.length;
              }
            })
        
            let labels = nombreSeries.map((e) => {
              if(e != undefined  && e != "No Definido")
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

            //OTRAS UNIDADES

            let nombreSeriesOtrasUnidades: any[] = []
            let cantidadUnidadesActivasOtras = 0;
            nombreSeriesOtrasUnidades = data.map((item: any) => {
                if(item.OBCSyscaf == 'Si')
                    if(item.ClasificacionId != 'Si' || item.ClasificacionId  ? item.Vertical:undefined)
                         return (item.Vertical );
            }).filter((value: any, index: any, self: any) => {
                return  self.indexOf(value) === index;
            });
            let datos: any[] = [];
            nombreSeriesOtrasUnidades.map((item: any) => {
              if (item != undefined ) {
                  let prefiterdata = data.filter(function (val: any) {
                      if (val.Vertical == item && val.OBCSyscaf == "Si")
                          return val.ClienteId
                  });
                  datos.push(Number.parseInt(prefiterdata.length.toString()));
                  cantidadUnidadesActivasOtras = cantidadUnidadesActivasOtras + prefiterdata.length;
              
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
              labels: nombreSeriesOtrasUnidades.filter((e) => e),
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
    };
    useEffect(() => {
        if (Filtrado) {
            if (DataFiltrada){
                let verticalDataFiltrada:any =  DataFiltrada.filter(function (item: any) {
                    return item.Vertical;
                })
              RetornarSerie(DataFiltrada, verticalDataFiltrada)
            }
        }
        else {
          //Toco ponerle un timeuot porque no renderizaba cuando debia
          let timerId = setTimeout(() => {
            if(Data)
            if (Data["Unidades"] != undefined){
                let VerticalData:any = Data["Unidades"].filter(function (item: any) {
                        return item.Vertical;
                    });
               RetornarSerie(Data["Unidades"],VerticalData);
            };
            clearTimeout(timerId);
          }, 1000);
          // clearTimeout(timerId);
        }
    }, [Data, Filtrado, DataFiltrada])

    return (
        <div className="row">
            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 pt-12">
                <div className="d-flex justify-content-start  ">
                    {(Data !== undefined) && (Data['Unidades'] != undefined) && (<>
                        <CheckboxGroup inline name="checkboxList" value={value} onChange={handleChange}>
                            {defaultPriopios.map(item => (
                                <Checkbox key={item.name} value={item.name}>
                                    {item.name}
                                </Checkbox>
                            ))}
                        </CheckboxGroup></>)}
                </div>
            </div>
            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 pt-10">
                {(Data != undefined) && (<div className="shadow-lg">
                    <div className="text-center pt-5">
                        <label className="label label-sm fw-bolder">SEMANA</label>
                    </div>
                    {
                        (Semanas != null) && (Semanas.options != undefined) && (<ReactApexChart options={Semanas.options} series={Semanas.series} type="pie" height={350} />)
                    }
                </div>
                ) }
            </div>
            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 pt-10">
                {(Data != undefined) && (
                <div className="shadow-lg">
                    <div className="text-center pt-5">
                        <label className="label label-sm fw-bolder">VERTICAL</label>
                    </div>
                    {
                        (Vertical != null) && (Vertical.options != undefined) && (<ReactApexChart options={Vertical.options} series={Vertical.series} type="bar" height={300} />)
                    }
                </div>
             )}

            </div>
            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 pt-10">
                {(Data != undefined) && (
                     <div className="shadow-lg">
                     <div className="text-center pt-5">
                         <label className="label label-sm fw-bolder">UINDADES ACTIVAS</label>
                     </div>
                     {
                       (UnidadesActivas != null) && (UnidadesActivas.options != undefined) && (<ReactApexChart options={UnidadesActivas.options} series={UnidadesActivas.series} type="donut" height={350} />)
                     }
                   </div>
                )}

            </div>
            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 pt-10">
                {(Data != undefined) && (
                    <div className="shadow-lg">
                    <div className="text-center pt-5">
                      <label className="label label-sm fw-bolder">OTRAS UNIDADES</label>
                    </div>
                  {
                    (OtrasUnidadesActivas != null) && (OtrasUnidadesActivas.options != undefined) && (<ReactApexChart options={OtrasUnidadesActivas.options} series={OtrasUnidadesActivas.series} type="donut" height={350} />)
                  }
                </div>
                )}

            </div>
        </div>
    )
}
export { UnidadesActivasOBC }