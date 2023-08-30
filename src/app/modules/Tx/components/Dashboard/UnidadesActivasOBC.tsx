import { Checkbox, CheckboxGroup } from "rsuite";
import { useDataDashboard } from "../../core/DashboardProvider";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Modal } from "react-bootstrap-v5";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Churn } from "./churn";
import { FiltroData } from "../../data/Dashboard";


type Props = {
  tab: string;
}
const UnidadesActivasOBC: React.FC<Props> = ({ tab }) => {
  const { Data, DataFiltrada, Filtrado, setFiltrado, setDataFiltrada, setCargando } = useDataDashboard();
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
    if (Data) {
      let opciones = {
        options: {
          chart: {
            id: 'apexchart-semanas',
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
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: true,
            // style: {
            //     colors: ['#304758']
            // }
          }
        },
        series: [],

      }
      setSemanas(opciones);
      //Para las verticales
      let opcionesVertical = {
        options: {
          chart: {
            id: 'apexchart-vertical',
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
                  SetBaseX(Base);
                  setshowModal(true);
                  setshowGraficaModal(false);
                  setTitulo(`${Base} `)
                }

              }
            },
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: true,
            style: {
              colors: ["#304758"]
            }
          },
        },
        series: [],

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
                  SetBaseE(Base);
                  setshowGraficaModal(false);
                  setTituloFacturable(Base);
                  setDetallado(true);
                }
              }
            },
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: true,
            // style: {
            //   colors: ["#304758"]
            // }
          }
        },
        series: [],

      }
      setUnidadesActivas(opcionesUnidades);
      //OTRAS UNIDADES
      let opcionesOtrasUnidades = {
        options: {
          chart: {
            id: 'apexchart-otrasunidades',
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
                  SetBase(Base);
                  setTitulo(`${Base}`)
                  setshowModal(true);
                  setshowGraficaModal(false);
                }
              }
            },
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: true,
            // style: {
            //     colors: ['#424249']
            // }
          }
        },
        series: [],

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
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: true,
            style: {
              colors: ['#424249']
            }
          },
        },
        series: [],

        // plotOptions: {
        //   bar: {
        //     horizontal: false
        //   }
        // },
        colors: ['#1f77b4', '#aec7e8'],

      }
      setVerticalCliente(opcionesVerticalCliente);
    }
    return function cleanUp() {
      //SE DEBE DESTRUIR EL OBJETO CHART
    };
  }, [Data])


  const RetornarSerie = (data: any[], VerticalData: any[]) => {
    var dataChart = data.filter((e: any) => {
      return e;
    });

    // GRAFICA DE SEMANAS AGRUPADO POR ADMINISTRADORES
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
      labels: FiltroData.getAdministradores(dataChart).map((m: any) => m.Administrador),
      legend: {
        show: true,
        position: 'bottom'
      },
    });
    // actializar los datos
    ApexCharts.exec('apexchart-semanas', 'updateSeries', FiltroData.getAdministradores(dataChart).map((m: any) => m.Total)
    );

    // GRAFICA VERTICAL

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
      labels: FiltroData.getDataVerticalPorEstado(dataChart, "Si", "-1").map((m: any) => m.Vertical),
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

          data: FiltroData.getDataVerticalPorEstado(dataChart, "Si", "-1").map((m: any) => m.Total),
        }
      ]
    );


    //UNIDADES ACTIVAS TORTA

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
      labels: FiltroData.getDataActivos(dataChart).map((m: any) => m.ClasificacionId),
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
    ApexCharts.exec('apexchart-unidades', 'updateSeries', FiltroData.getDataActivos(dataChart).map((m: any) => m.Total));

    // GRAFICA OTRAS UNIDADES
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
      labels: FiltroData.getDataVerticalPorEstado(dataChart, "No", "-1").map((m: any) => m.Vertical),
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
    ApexCharts.exec('apexchart-otrasunidades', 'updateSeries', FiltroData.getDataVerticalPorEstado(dataChart, "No", "-1").map((m: any) => m.Total));
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

    const dataBase = (Filtrado && DataFiltrada != null && DataFiltrada?.length > 0) ? DataFiltrada :
      ((Data != undefined && Data['Unidades'] != undefined) ? Data['Unidades'] : []); // informacion base
    let _dataFiltrada = FiltroData.getDataFacturableDetallada(dataBase, (baseE == "Facturable" ? "Si" : "No"));

    if (dataBase.length > 0) {
      CargarSerieCliente(_dataFiltrada)
      setDataTable(_dataFiltrada);
    }
    return function cleanUp() {
      setDataTable([]);
    };
  }, [baseE, DataFiltrada, Filtrado])

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
          if (val.Base == BaseVC && a == "Si" || a == "No" && (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId) == (baseE == "Facturable" ? "Si" : "No"))
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
          if (val.Base == BaseVC && a == "Si" || a == "No" && (val.ClasificacionId == "No Definido" ? val.ActivoFacturable : val.ClasificacionId) == (baseE == "Facturable" ? "Si" : "No"))
            return (val);
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
    let datosGrafica = Data.reduce((p, c) => {
      const cat = c.Base ?? "NoDefinido"; // si no hay categoria se asigna no categorizado
      let currCount = Object.hasOwn(p, cat) ? p[cat] : 0;
      currCount++;
      return {
        ...p,
        [cat]: currCount
      };
    }, {});

    const datosOrdenado = Object.entries(datosGrafica).sort((a: any, b: any) => { return b[1] - a[1] });

    ApexCharts.exec('apexchart-verticalCliente', 'updateOptions', {
      labels: datosOrdenado.map(m => m[0]),
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
          name: datosOrdenado.map(m => m[0]),
          data: datosOrdenado.map(m => m[1])
        }
      ]
    );
  }
  return (
    <div className="row">
      <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 pt-12">
        <div className="float-start">
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

      {/* Modal churn */}

    </div>
  )
}
export { UnidadesActivasOBC }