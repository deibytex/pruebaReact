import { Checkbox, CheckboxGroup } from "rsuite";
import { useDataDashboard } from "../../core/DashboardProvider";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Modal } from "react-bootstrap-v5";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { PaginationState } from "@tanstack/react-table";
import ProgressBar from "@ramonak/react-progress-bar";
type Props = {
  tab: string;
}
const UnidadesActivasOBC: React.FC<Props> = ({ tab }) => {
  const { Data, DataFiltrada, Filtrado, setFiltrado, setDataFiltrada, setCargando, DataAcumulado } = useDataDashboard();
  //constantes para las graficas en general.
  const [base, SetBase] = useState<string>("");
  const [baseE, SetBaseE] = useState<string>("");
  const [BaseX, SetBaseX] = useState<string>("");
  const [BaseVC, SetBaseVC] = useState<string>("");
  const [showModal, setshowModal] = useState<boolean>(false);
  const [showGraficaModal, setshowGraficaModal] = useState<boolean>(false);
  const [DataTable, setDataTable] = useState<any[]>([])
  const [Detallado, setDetallado] = useState<boolean>(false)
  const [titulo, setTitulo] = useState<string>("Detallado de graficas facturables")
  const [tituloFacturable, setTituloFacturable] = useState<string>("FACTURABLES")
  let DatosColumnas: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'Base',
      header: 'Cliente',
      size: 150,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="">{row.original.Base}</span>)
        return dato;
      }
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
  const [VerticalCliente, setVerticalCliente] = useState<any>(null);
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
          events: {
            click: (event: any, chartContext: any, config: any) => {
              if (event.target.attributes.j != undefined) {
                let Base = config.config.labels[event.target.attributes.j.value];
                SetBaseX(Base);
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
          events: {
            click: (event: any, chartContext: any, config: any) => {
              if (event.target.attributes.j != undefined) {
                let Base = config.config.labels[event.target.attributes.j.value];
                SetBaseE(Base);
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
        enabled: false
      }
    }
    setUnidadesActivas(opcionesUnidades);
    //OTRAS UNIDADES
    let opcionesOtrasUnidades = {
      options: {
        chart: {
          id: 'apexchart-otrasunidades',
          events: {
            click: (event: any, chartContext: any, config: any) => {
              if (event.target.attributes.j != undefined) {
                let Base = config.config.labels[event.target.attributes.j.value];
                SetBase(Base);
                setTitulo(`${Base}`)
                setshowModal(true);
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
          fontFamily: 'Montserrat',
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
        enabled: true
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
          if (val.Administrador == item)
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
      let a = (item.ClasificacionId == "No Definido" ? item.ActivoFacturable : item.ClasificacionId);
      if (a == "Si")
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
            return (val.Fecha == itemSemana && val.Vertical == item);
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
      let a = (item.ClasificacionId == "No Definido" ? item.ActivoFacturable : item.ClasificacionId);
      if (a == "Si" || a == "No")
        return (item.ClasificacionId == "No Definido" ? item.ActivoFacturable : item.ClasificacionId);
    }).filter((value: any, index: any, self: any) => {
      return self.indexOf(value) === index;
    });

    let datosUnidadesActivas: any[] = [];
    nombreSeries.map((item: any) => {
      if (item != undefined) {
        let prefiterdata = data.filter(function (val: any) {
          let b = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          if (b == item)
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
    ApexCharts.exec('apexchart-unidades', 'updateSeries', datosUnidadesActivas);

    //OTRAS UNIDADES

    let nombreSeriesOtrasUnidades: any[] = []
    let cantidadUnidadesActivasOtras = 0;
    nombreSeriesOtrasUnidades = data.map((item: any) => {
      let a = (item.ClasificacionId == "No Definido" ? item.ActivoFacturable : item.ClasificacionId);
      if (a == 'No')
        return (item.Vertical);
    }).filter((value: any, index: any, self: any) => {
      return self.indexOf(value) === index;
    });
    let datos: any[] = [];
    nombreSeriesOtrasUnidades.map((item: any) => {
      if (item != undefined) {
        let prefiterdata = data.filter(function (val: any) {
          if (val.Vertical == item)
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
      // clearTimeout(timerId);
    }
    return function cleanUp() {
      setDataTable([]);
    };
  }, [Data, Filtrado, DataFiltrada])
  useEffect(() => {
    FiltrarDatos();
    return function cleanUp() {
      setDataTable([]);
    };
  }, [eventsSelected])
  const FiltrarDatos = () => {
    if (value.length == 2) {
      setFiltrado(false);
      setCargando(false);
    }
    else if (value.length == 0) {
      if (Data != undefined && Data['Unidades'] != undefined) {
        let __DataFiltrada = Data['Unidades'].filter(function (val: any, index: any) {
          return (val.OBCSyscaf == "N/A");
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
                let obc = (val.OBCSyscaf == null ? val.EsEquipoSyscaf : val.OBCSyscaf);
                return (obc == Seleccionado);
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
                let obc = (val.OBCSyscaf == null ? val.EsEquipoSyscaf : val.OBCSyscaf);
                return (obc == Seleccionado);
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
                let obc = (val.OBCSyscaf == null ? val.EsEquipoSyscaf : val.OBCSyscaf);
                return (obc == Seleccionado);
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
          if (a == 'No')
            return (val.Vertical == base)
        }).filter((e: any) => e);
        setDataTable(_dataFiltrada);
      }
    } else {
      if (Data != undefined && Data['Unidades'] != undefined) {
        let DataFiltrada = Data['Unidades'].filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          if (a == 'No')
            return (val.Vertical == base);
        }).filter((e: any) => e);
        setDataTable(DataFiltrada)
      }
    }
    return function cleanUp() {
      //SE DEBE DESTRUIR CargarSerieCliente(DataFiltrada)
      setDataTable([]);
    };
  }, [base])
  useEffect(() => {
    if (Filtrado) {
      if (DataFiltrada != undefined) {
        let _dataFiltrada = DataFiltrada.filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          if (a == "Si" || a == "No" && (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId) == (baseE == "Facturable" ? "Si" : "No"))
            return (val)
        }).filter((e: any) => e);
        CargarSerieCliente(DataFiltrada)
        setDataTable(_dataFiltrada);
        setDataTable(_dataFiltrada)
      }
    } else {
      if (Data != undefined && Data['Unidades'] != undefined) {
        let _DataFiltrada = Data['Unidades'].filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          if (a == "Si" || a == "No" && (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId) == (baseE == "Facturable" ? "Si" : "No"))
            return (val);
        }).filter((e: any) => e);
        CargarSerieCliente(_DataFiltrada)
        setDataTable(_DataFiltrada)
      }
    }
    return function cleanUp() {
      setDataTable([]);
    };
  }, [baseE])
  //Para la grafica de vertical
  useEffect(() => {
    if (Filtrado) {
      if (DataFiltrada != undefined) {
        let _dataFiltrada = DataFiltrada.filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          if (a == "Si" && val.Vertical == BaseX)
            return (val)
        }).filter((e: any) => e);
        setDataTable(_dataFiltrada);

      }
    } else {
      if (Data != undefined && Data['Unidades'] != undefined) {
        let DataFiltrada = Data['Unidades'].filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          if (a == "Si" && val.Vertical == BaseX)
            return (val)
        }).filter((e: any) => e);
        setDataTable(DataFiltrada);
      }
    }
    return function cleanUp() {
      setDataTable([]);
    };
  }, [BaseX])

  //Vertical Cliente
  useEffect(() => {
    if (Filtrado) {
      if (DataFiltrada != undefined) {
        let _dataFiltrada = DataFiltrada.filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          if (a == "Si" && val.Base == BaseVC)
            return (val)
        }).filter((e: any) => e);
        setDataTable(_dataFiltrada);
        if (BaseVC != "")
          setshowModal(true);
      }
    } else {
      if (Data != undefined && Data['Unidades'] != undefined) {
        let _DataFiltrada = Data['Unidades'].filter(function (val: any, index: any) {
          let a = (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId);
          if (a == "Si" && val.Base == BaseVC)
            return (val)
        }).filter((e: any) => e);
        setDataTable(_DataFiltrada);
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
        arrayEstados.push((filtroEstado.length == null ? 0 : filtroEstado.length));
      }
    });
    ApexCharts.exec('apexchart-verticalCliente', 'updateOptions', {
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
    });
    // actializar los datos
    ApexCharts.exec('apexchart-verticalCliente', 'updateSeries',
      [
        {
          name: [...agrupadorGeneral],//agrupadorGeneral.filter((e) => e),
          data: arrayEstados.map((e) => e)
        }
      ]
    );

  }

  const PintarAcumulado2Semanas = (DataAcumulado: any[]) => {
    let nuevoObjeto = {}
    //Recorremos el arreglo 
    DataAcumulado.forEach(x => {
      //Si la ciudad no existe en nuevoObjeto entonces
      //la creamos e inicializamos el arreglo de profesionales. 
      if (!nuevoObjeto.hasOwnProperty(x.Fecha)) {
        nuevoObjeto[x.Fecha] = {
          data: []
        }
      }

      //Agregamos los datos de profesionales. 
     if( x.ActivoFacturable == "Si" )
      nuevoObjeto[x.Fecha].data.push(
        {
          "ActivoFacturable": x.ActivoFacturable,
          "Base": x.Base,
          "ClienteId": x.ClienteId,
          "Fecha": x.Fecha,
          "Matricula": x.Matricula,
          "Vertical": x.Vertical
        }
      )
    })
    let Semanas = Object.keys(nuevoObjeto);
    let SemanaAnterior = (Semanas.length != 0 ? Semanas[0] : "");
    let SemanaActual = (Semanas.length != 0 ? Semanas[1] : "");
    let DatoSemanaAnterior: any[] = nuevoObjeto[SemanaAnterior].data;
    let DatoSemanaActual: any[] = nuevoObjeto[SemanaActual].data;

    // comparar los datos de las 2 semanas
    const dif = DatoSemanaAnterior.length - DatoSemanaActual.length;
    console.log( dif)


    //Los que no estan en la semana actual respecto anterior
    // los que entraron
    let entradas = DatoSemanaActual.filter(function (el) {
      return !(DatoSemanaAnterior.filter( (ff) =>  ff.Matricula === el.Matricula && ff.Base == el.Base ).length == 1) ;
    });
    //filtrar los datos de la semana anterior respecto a la actual
    // los que salieron 
    let salidas = DatoSemanaAnterior.filter(function (el) {
      return !(DatoSemanaActual.filter( (ff) =>  ff.Matricula === el.Matricula && ff.Base == el.Base).length == 1) ;
    });
    console.log(entradas);

    console.log(salidas);

  }

  //para los acumulado o cruch
  useEffect(() => {
    if (DataAcumulado != undefined && DataAcumulado.length != 0)
      PintarAcumulado2Semanas(DataAcumulado);
  }, [DataAcumulado])


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
      <Modal show={showModal} onHide={setshowModal} size={"lg"}>
        <Modal.Header closeButton>
          <Modal.Title>{titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 pt-12">
                {(DataTable.length != 0) && (showModal) && (
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
export { UnidadesActivasOBC }