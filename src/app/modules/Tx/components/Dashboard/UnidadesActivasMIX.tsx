import { Checkbox, CheckboxGroup } from "rsuite";
import { useDataDashboard } from "../../core/DashboardProvider";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Modal } from "react-bootstrap-v5";
type Props = {
  tab: string;
}
const UnidadesActivasMIX: React.FC<Props> = ({ tab }) => {
  const { Data, DataFiltrada, Filtrado, setFiltrado, setDataFiltrada, setCargando } = useDataDashboard();
  const [baseO, SetBaseO] = useState<string>("");
  const [baseU, SetBaseU] = useState<string>("");
  const [BaseV, SetBaseV] = useState<string>("");
  const [showGraficaModal, setshowGraficaModal] = useState<boolean>(false);
  const [showModal, setshowModal] = useState<boolean>(false);
  const [DataTable, setDataTable] = useState<any[]>([])
  const [titulo, setTitulo] = useState<string>("Detallado de graficas facturables")
  const [VerticalCliente, setVerticalCliente] = useState<any>(null);
  const [render, setRender] = useState<boolean>(false);
  const [BaseX, SetBaseX] = useState<string>("");
  const [BaseVC, SetBaseVC] = useState<string>("");
  const [Detallado, setDetallado] = useState<boolean>(false)
  const [tituloFacturable, setTituloFacturable] = useState<string>("FACTURABLES")
  let DatosColumnas: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'Base',
      header: 'Cliente',
      size: 150
    },
    {
      accessorKey: 'Sitio',
      header: 'Sitio',
      size: 100
    },
    {
      accessorKey: 'Vertical',
      header: 'Vertical',
      size: 100
    },
    {
      accessorKey: 'Descripcion',
      header: 'Descripcion',
      size: 100
    }
  ]
  const defaultPriopios: any[] = [
    {
      name: 'Syscaf',
      data: [],
      isSelected: true,
      getData: (MVSyscaf: any, f: any) => {
        return {
          "x": MVSyscaf
        }
      }
    },
    {
      name: 'Cliente',
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
          id: 'apexchart-semanasMIX',
          fontFamily: 'Montserrat',
          zoom: {
            enabled: true,
            type: 'x',
            autoScaleYaxis: false,
            zoomedArea: {
              fill: {
                color: '#90CAF9',
                opacity: 0.4
              },
              stroke: {
                color: '#0D47A1',
                opacity: 0.4,
                width: 1
              }
            }
          },

        }
      },
      series: [],
      dataLabels: {
        enabled: true,
                    enabledOnSeries: true,
                    style: {
                        colors: ['#424249']
                    }
      }
    }
    setSemanas(opciones);
    //Para las verticales
    let opcionesVertical = {
      options: {
        chart: {
          id: 'apexchart-verticalMIX',
          fontFamily: 'Montserrat',
          zoom: {
            enabled: true,
            type: 'x',
            autoScaleYaxis: false,
            zoomedArea: {
              fill: {
                color: '#90CAF9',
                opacity: 0.4
              },
              stroke: {
                color: '#0D47A1',
                opacity: 0.4,
                width: 1
              }
            }
          },
          events: {
            click: (event: any, chartContext: any, config: any) => {
              if (event.target.attributes.j != undefined) {
                let Base = config.config.labels[event.target.attributes.j.value];
                SetBaseV(Base);
                setshowModal(true);
                setshowGraficaModal(false);
                setTitulo(`${Base} `)
              }

            }
          },
        }
      },
      series: [],
      dataLabels: {
        enabled: true,
        enabledOnSeries: true,
        style: {
            colors: ['#424249']
        }
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
          id: 'apexchart-unidadesMIX',
          fontFamily: 'Montserrat',
          zoom: {
            enabled: true,
            type: 'x',
            autoScaleYaxis: false,
            zoomedArea: {
              fill: {
                color: '#90CAF9',
                opacity: 0.4
              },
              stroke: {
                color: '#0D47A1',
                opacity: 0.4,
                width: 1
              }
            }
          },
          events: {
            click: (event: any, chartContext: any, config: any) => {
              if (event.target.attributes.j != undefined) {
                let Base = config.config.labels[event.target.attributes.j.value];
                SetBaseU(Base);
                setshowGraficaModal(true);
                setshowGraficaModal(false);
                setTituloFacturable(Base);
                setDetallado(true);
              }
            }
          },

        }
      },
      series: [],
      dataLabels: {
        enabled: true,
                    enabledOnSeries: true,
                    style: {
                        colors: ['#424249']
                    }
      }
    }
    setUnidadesActivas(opcionesUnidades);

    //OTRAS UNIDADES
    let opcionesOtrasUnidades = {
      options: {
        chart: {
          id: 'apexchart-otrasunidadesMIX',
          fontFamily: 'Montserrat',
          zoom: {
            enabled: true,
            type: 'x',
            autoScaleYaxis: false,
            zoomedArea: {
              fill: {
                color: '#90CAF9',
                opacity: 0.4
              },
              stroke: {
                color: '#0D47A1',
                opacity: 0.4,
                width: 1
              }
            }
          },
          events: {
            click: (event: any, chartContext: any, config: any) => {
              if (event.target.attributes.j != undefined) {
                let Base = config.config.labels[event.target.attributes.j.value];
                SetBaseO(Base);
                setshowModal(true);
                setTitulo(`${Base} `)
                setshowGraficaModal(false);
              }
            }
          },
        }
      },
      series: [],
      dataLabels: {
        enabled: false
      }
    }
    setOtrasUnidadesActivas(opcionesOtrasUnidades);
      //Para las verticales pero para el modal del cliente
      let opcionesVerticalCliente = {
        options: {
          chart: {
            id: 'apexchart-verticalCliente',
            fontFamily: 'Montserrat',
          zoom: {
            enabled: true,
            type: 'x',
            autoScaleYaxis: false,
            zoomedArea: {
              fill: {
                color: '#90CAF9',
                opacity: 0.4
              },
              stroke: {
                color: '#0D47A1',
                opacity: 0.4,
                width: 1
              }
            }
          },
            events: {
              click: (event: any, chartContext: any, config: any) => {
                if (event.target.attributes.j != undefined) {
                  let Base = config.config.labels[event.target.attributes.j.value];
                  setTitulo(`${Base} `)
                  SetBaseVC(Base);
                  setshowModal(true);
                }
  
              }
            },
            stacked: false,
            fill: {
              colors: ['#1f77b4', '#aec7e8']
            },
            toolbar: {
              show: false
            },
          },
          xaxis: {
            categories: [],
          }
        },
        series: [],
        dataLabels: {
          enabled: true,
          enabledOnSeries: true,
          style: {
              colors: ['#424249']
          }
        },
        // plotOptions: {
        //   bar: {
        //     horizontal: false
        //   }
        // },
        colors: ['#1f77b4', '#aec7e8'],
  
      }
      setVerticalCliente(opcionesVerticalCliente);
    return function cleanUp() {
      //SE DEBE DESTRUIR EL OBJETO CHART
    };
  }, [])

  const RetornarSerie = (data: any[], VerticalData: any[]) => {
    var dataChart = data.filter((e: any) => {
      if (e.MixVision == "Si")
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
          if (val.Administrador == item && val.MixVision == "Si")
            return val.Descripcion
        }).length;
        Datos.push(totalAdmon);
      }
    })

    ApexCharts.exec('apexchart-semanasMIX', 'updateOptions', {
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
    ApexCharts.exec('apexchart-semanasMIX', 'updateOptions', {
      // Para los nombres de la serie
      //para que la lengenda me salga en la parte de abajo
      labels: agrupadorData.filter((e) => e),
      legend: {
        show: true,
        position: 'bottom'
      },
    });
    // actializar los datos
    ApexCharts.exec('apexchart-semanasMIX', 'updateSeries', Datos
    );

    //Vertical
    let agrupadorGeneral = VerticalData.map((item) => {
      let a = (item.ClasificacionId == "No Definido" ? item.ActivoFacturable : item.ClasificacionId);
      if (item.MixVision == "Si" && a == "Si")
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
      if (item != undefined) {
        Semana.map(function (itemSemana) {
          let filtroEstado = data.filter(function (val, index) {
            return (val.Fecha == itemSemana && val.Vertical == item && val.MixVision == "Si");
          });
          arrayEstados.push([{
            x: item,
            y: filtroEstado.length
          }]);
        });
      }
    });

    ApexCharts.exec('apexchart-verticalMIX', 'updateOptions', {
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
    ApexCharts.exec('apexchart-verticalMIX', 'updateOptions', {
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
    ApexCharts.exec('apexchart-verticalMIX', 'updateSeries',
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
      let a = (item.ClasificacionId == "No Definido" ? item.ActivoFacturable : item.ClasificacionId);
      if (item.MixVision == 'Si' && a != 'Si')
        return (item.ClasificacionId == "No Definido" ? item.ActivoFacturable : item.ClasificacionId);
    }).filter((value: any, index: any, self: any) => {
      return self.indexOf(value) === index;
    });

    let datosUnidadesActivas: any[] = [];
    nombreSeries.map((item: any) => {
      if (item != undefined && item != "No Definido") {
        let prefiterdata = data.filter(function (val: any) {
          let b = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          if (b == item && val.MixVision == "Si")
            return val.ClienteId
        });
        datosUnidadesActivas.push(Number.parseInt(prefiterdata.length.toString()));
        cantidadUnidadesActivas = cantidadUnidadesActivas + prefiterdata.length;
      }
    })

    let labels = nombreSeries.map((e) => {
      if (e != undefined)
        return (e == "Si" ? "Facturable" : "No Facturable")
    }).filter((f) => f);

    ApexCharts.exec('apexchart-unidadesMIX', 'updateOptions', {
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
    ApexCharts.exec('apexchart-unidadesMIX', 'updateOptions', {
      // Para los nombres de la serie
      labels: labels.filter((e) => e),
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
    ApexCharts.exec('apexchart-unidadesMIX', 'updateSeries', datosUnidadesActivas);

    //OTRAS UNIDADES

    let nombreSeriesOtrasUnidades: any[] = []
    let cantidadUnidadesActivasOtras = 0;
    nombreSeriesOtrasUnidades = data.map((item: any) => {
      let a = (item.ClasificacionId == "No Definido" ? item.ActivoFacturable : item.ClasificacionId);
      if (item.MixVision == 'Si' && a != "Si")
        return (item.Vertical);
    }).filter((value: any, index: any, self: any) => {
      return self.indexOf(value) === index;
    });
    let datos: any[] = [];
    nombreSeriesOtrasUnidades.map((item: any) => {
      if (item != undefined) {
        let prefiterdata = data.filter(function (val: any) {
          if (val.Vertical == item && val.MixVision == "Si")
            return val.ClienteId
        });
        datos.push(Number.parseInt(prefiterdata.length.toString()));
        cantidadUnidadesActivasOtras = cantidadUnidadesActivasOtras + prefiterdata.length;

      }
    })

    ApexCharts.exec('apexchart-otrasunidadesMIX', 'updateOptions', {
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
    ApexCharts.exec('apexchart-otrasunidadesMIX', 'updateOptions', {
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
    ApexCharts.exec('apexchart-otrasunidadesMIX', 'updateSeries', datos);
  };
  useEffect(() => {
    if (Filtrado) {
      if (DataFiltrada) {
        let verticalDataFiltrada: any = DataFiltrada.filter(function (item: any) {
          return item.Vertical;
        })
        RetornarSerie(DataFiltrada, verticalDataFiltrada)
      }
    }
    else {
      //Toco ponerle un timeuot porque no renderizaba cuando debia
      let timerId = setTimeout(() => {
        if (Data)
          if (Data["Unidades"] != undefined) {
            let VerticalData: any = Data["Unidades"].filter(function (item: any) {
              return item.Vertical;
            });
            RetornarSerie(Data["Unidades"], VerticalData);
          };
        clearTimeout(timerId);
      }, 1000);
    }
  }, [Data, Filtrado, DataFiltrada])
  useEffect(() => {
    FiltrarDatos();
  }, [eventsSelected])
  const FiltrarDatos = () => {
    if (value.length == 2) {
      setFiltrado(false);
      setCargando(false);
    }
    else if (value.length == 0) {
      if (Data != undefined && Data['Unidades'] != undefined) {
        let __DataFiltrada = Data['Unidades'].filter(function (val: any, index: any) {
          return (val.MVSyscaf == "N/A");
        });
        setFiltrado(true);
        setDataFiltrada(__DataFiltrada);
        setCargando(false);
      }
    }
    else
      value.map((item) => {
        let Seleccionado = "";
        switch (Filtrado) {
          case true:
            if (DataFiltrada != undefined) {
              Seleccionado = (item == "Syscaf" ? "Si" : "No");
              let _data = (Data != undefined && Data['Unidades'] != undefined ? Data['Unidades'] : []);
              let a = (DataFiltrada.length != 0 ? DataFiltrada : _data)
              let _dataFiltrada = a.filter(function (val: any, index: any) {
                return (val.MVSyscaf == Seleccionado);
              });
              setFiltrado(true);
              setDataFiltrada(_dataFiltrada);
              setCargando(false);
            }
            break;
          case false:
            if (Data != undefined && Data['Unidades'] != undefined) {
              Seleccionado = (item == "Syscaf" ? "Si" : "No");
              let DataFiltrada = Data['Unidades'].filter(function (val: any, index: any) {
                return (val.MVSyscaf == Seleccionado);
              });
              setFiltrado(true);
              setDataFiltrada(DataFiltrada);
              setCargando(false);
            }
            break;
          default:
            if (Data != undefined && Data['Unidades'] != undefined) {
              Seleccionado = (item == "Syscaf" ? "Si" : "No");
              let DataFiltrada = Data['Unidades'].filter(function (val: any, index: any) {
                return (val.MVSyscaf == Seleccionado);
              });
              setFiltrado(true);
              setDataFiltrada(DataFiltrada);
              setCargando(false);
            }
            break;
        }
      });
  };
  //Datos para el modal
  useEffect(() => {
    if (Filtrado) {
      if (DataFiltrada != undefined) {
        let _dataFiltrada = DataFiltrada.filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          if (a == 'No' && val.MixVision == "Si")
            return (val.Vertical == baseO)
        }).filter((e: any) => e);
        setDataTable(_dataFiltrada);
      }
    } else {
      if (Data != undefined && Data['Unidades'] != undefined) {
        let datafiltrada = Data['Unidades'].filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          if (a == 'No' && val.MixVision == "Si")
            return (val.Vertical == baseO);
        }).filter((e: any) => e);
        setDataTable(datafiltrada)
      }
    }
  }, [baseO])

  useEffect(() => {
    if (Filtrado) {
      if (DataFiltrada != undefined) {
        let _dataFiltrada = DataFiltrada.filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          let respuesta = (baseU == "Facturable" ? "Si" : "No");
          if (val.MixVision == "Si" && a == respuesta)
            return (val)
        }).filter((e: any) => e);
        console.log(_dataFiltrada)
        setDataTable(_dataFiltrada);
        CargarSerieCliente(_dataFiltrada);
      }
    } else {
      if (Data != undefined && Data['Unidades'] != undefined) {
        let datafiltrada = Data['Unidades'].filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          let respuesta = (baseU == "Facturable" ? "Si" : "No");
          if (val.MixVision == "Si" && a == respuesta)
            return (val);
        }).filter((e: any) => e);
        console.log(datafiltrada);
        setDataTable(datafiltrada)
        CargarSerieCliente(datafiltrada);
      }
    }
  }, [baseU])
  //Para la grafica de vertical
  useEffect(() => {
    if (Filtrado) {
      if (DataFiltrada != undefined) {
        let _dataFiltrada = DataFiltrada.filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          if (a == "Si" && val.Vertical == BaseV && val.MixVision == "Si")
            return (val)
        }).filter((e: any) => e);
        setDataTable(_dataFiltrada);
      }
    } else {
      if (Data != undefined && Data['Unidades'] != undefined) {
        let datafiltrada = Data['Unidades'].filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          if (a == "Si" && val.Vertical == BaseV && val.MixVision == "Si")
            return (val)
        }).filter((e: any) => e);
        setDataTable(datafiltrada)
      }
    }
  }, [BaseV])

// //para las grafica de los cllientes dentro del modal
//   useEffect(() =>{
//     //Para las verticales pero para el modal del cliente
//     let opcionesVerticalCliente = {
//      options: {
//        chart: {
//          id: 'apexchart-verticalCliente',
//            fontFamily: 'Montserrat',
//            stacked: false,
   
//        },
//        xaxis: {
//            categories: [],
//        }
//    },
//    series: [],
//    dataLabels: {
//        enabled: true
//    }
//    }
//    setVerticalCliente(opcionesVerticalCliente);
//      return function cleanUp() {
//        //SE DEBE DESTRUIR EL OBJETO CHART
//      };
//    },[render,BaseX])

   //Vertical Cliente
  useEffect(() => {
    if (Filtrado) {
      if (DataFiltrada != undefined) {
        let _dataFiltrada = DataFiltrada.filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          let respuesta = (baseU == "Facturable" ? "Si" : "No");
          if (val.MixVision == "Si" && a == respuesta && val.Base == BaseVC)
            return (val)
        }).filter((e: any) => e);
        setDataTable(_dataFiltrada);
        if (BaseVC != "")
          setshowModal(true);
      }
    } else {
      if (Data != undefined && Data['Unidades'] != undefined) {
        let datafiltrada = Data['Unidades'].filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          let respuesta = (baseU == "Facturable" ? "Si" : "No");
          if (val.MixVision == "Si" && a == respuesta && val.Base == BaseVC)
            return (val);
        }).filter((e: any) => e);
        setDataTable(datafiltrada);
        if (BaseVC != "")
          setshowModal(true);
      }
    }
    return function cleanUp() {
      setDataTable([]);
    };
  }, [BaseVC])

   const CargarSerieCliente = (Data: any[]) => {
    let agrupadorGeneral = Data.map((item) => {
      let a = (item.ClasificacionId == "No Definido" ? item.ActivoFacturable : item.ClasificacionId);
      if (a == "Si" || a == "No")
        return item.Base;
    }).filter((value, index, self: any) => {
      return self.indexOf(value) === index;
    });
    let arrayEstados = new Array();
    // filtramos por los clientes para obtener la agrupacion por  estado
    agrupadorGeneral.map(function (item) {
      if (item != undefined) {
        //  Semana.map(function (itemSemana) {
        let filtroEstado = Data.filter(function (val, index) {
          return (val.Base == item);
        });
        arrayEstados.push((filtroEstado.length == null ? 0:filtroEstado.length));
      }
    });
    ApexCharts.exec('apexchart-verticalCliente', 'updateOptions', {
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
    ApexCharts.exec('apexchart-verticalCliente', 'updateOptions', {
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
          horizontal: false
        }
      }
    });
    // actializar los datos
    ApexCharts.exec('apexchart-verticalCliente', 'updateSeries',
      [
        {
          name: [...agrupadorGeneral],
          data:[...arrayEstados]
        }
      ]
    );
  }
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
        )}
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
      <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 pt-12" style={{ display: (Detallado ? 'inline' : 'none') }}>
        <div className="float-end">
          <button title={"Ocultar grafica"} onClick={() => { setDetallado((Detallado ? false : true)) }} className="btn btn-sm btn-primary "><i className="bi-archive"></i></button>
        </div>
        <div className="fw-bolder" style={{ textAlign: 'center' }} >
          {tituloFacturable}
        </div>
        {(VerticalCliente && VerticalCliente.options && VerticalCliente.series) && (<ReactApexChart
          options={VerticalCliente.options}
          series={VerticalCliente.series} type="bar"
          height={300}
        />)}
      </div>
      <Modal show={showModal} onHide={setshowModal} size={(showGraficaModal ? "xl" : "lg")}>
        <Modal.Header closeButton>
          <Modal.Title>{(showGraficaModal ? "Detallado de graficas facturables" : titulo)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3 pt-3" style={{ display: (showGraficaModal ? "inline" : "none") }}>
              </div>
              <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 pt-6" style={{ display: (showGraficaModal ? "inline" : "none") }}>
                {
                  (VerticalCliente && render == true) && (
                    <ReactApexChart
                      options={VerticalCliente.options}
                      series={VerticalCliente.series} type="bar"
                      height={350}
                    />)
                }
              </div>
              <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3 pt-3" style={{ display: (showGraficaModal ? "inline" : "none") }}>
              </div>
              <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 pt-12">
                {(DataTable.length != 0) && (
                  <MaterialReactTable
                    localization={MRT_Localization_ES}
                    displayColumnDefOptions={{
                      'mrt-row-actions': {
                        muiTableHeadCellProps: {
                          align: 'center',
                        },
                        size: 120,
                      },
                    }}
                    muiTableHeadCellProps={{
                      sx: (theme) => ({
                        fontSize: 14,
                        fontStyle: 'bold',
                        color: 'rgb(27, 66, 94)'
                      }),
                    }}
                    columns={DatosColumnas}
                    data={DataTable}
                    initialState={{ density: 'compact' }}
                    enableColumnOrdering
                    enableColumnDragging={false}
                    enablePagination={false}
                    enableStickyHeader
                    enableStickyFooter
                    enableDensityToggle={false}
                    enableRowVirtualization
                    // enableRowNumbers
                    enableTableFooter
                    muiTableContainerProps={{ sx: { maxHeight: '300px' } }}
                  />
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
export { UnidadesActivasMIX }