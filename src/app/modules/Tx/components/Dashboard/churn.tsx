import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Modal } from "react-bootstrap-v5";
import { useDataDashboard } from "../../core/DashboardProvider";
import { useEffect, useState } from "react";
import { formatNumberChart, locateFormatNumberNDijitos, locateFormatPercentNDijitos } from "../../../../../_start/helpers/Helper";
import ReactApexChart from "react-apexcharts";
import { object } from "yup";
import { setIn } from "formik";

type Props = {
}
const Churn: React.FC<Props> = ({  }) => {
  const { DataAcumuladoChurn, setCargando, DataChurn, Filtrado, Consulta } = useDataDashboard();
  const [churnDataEntradas, setChurnDataEntradas] = useState<any[]>([]);
  const [churnDataSalidas, setChurnDataSalidas] = useState<any[]>([])
  const [TotalIn, setTotalIn] = useState<string>("0");
  const [TotalOut, setTotalOut] = useState<string>("0");
  const [TotalResultado, setTotalResultado] = useState<string>("0");
  const [SemanaAnterior, setSemanaAnterior] = useState<string>("");
  const [SemanaActual, setSemanaActual] = useState<string>("");
  const [opciones, setOpciones] = useState<any>(null);
  
  
  useEffect(() => {
    
    let Opciones = {
      options: {
        chart: {
          id: 'apexchart-churn',
          fontFamily: 'Montserrat',
          events: {
            dataPointSelection: function (event: any, chartContext: any, config: any) {
              // seleccionamos el index de la grafica para posteriormente filtrar
              console.log(config.dataPointIndex);

            }
          }
        },
        dataLabels: {

          enabled: true,
          enabledOnSeries: true,
          formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {
            return value;
           // return seriesIndex == 2 ? locateFormatPercentNDijitos(value, 2) : locateFormatNumberNDijitos(value, 2)
          },

        },
        xaxis: {
          categories: [],
          tickPlacement: 'on'
        },
        yaxis: [{
          showAlways: true,
          tickAmount: 5,
          min: 0,
          labels: {
            formatter: function (val: number, index: any) {
              return val.toFixed(0);
            }
          },
          title: {
            text: "Unidades Activas"
          }
        },
        {
          showAlways: true,
          tickAmount: 5,
          min: 0,
          max: 4,
          opposite: true,
          title: {
            text: "Semanas"
          }, labels: {
            formatter: function (val: number, index: any) {
              return val.toFixed(0);
            }
          }
        },
        {
          min: 0,
          max: 1,
          opposite: true,
          show: false, labels: {
            formatter: function (val: number, index: any) {
              return val;
            }
          }
        }
        ],
       
      },
      series: []

    };
    setOpciones(Opciones);
  },[]);

  
  //para los acumulado o cruch
  useEffect(() => {

    if (Filtrado) {
      
    }
    else {
      //Toco ponerle un timeuot porque no renderizaba cuando debia
      let timerId = setTimeout(() => {
        if (DataAcumuladoChurn != undefined && DataAcumuladoChurn.length != 0 && DataChurn)
            PintarAcumulado2Semanas(DataAcumuladoChurn, DataChurn);
        clearTimeout(timerId);
      }, 1000);
      // clearTimeout(timerId);
    }
  }, [DataAcumuladoChurn, DataChurn])

  const PintarAcumulado2Semanas = (DataAcumulado: any[], DataChurn:any[]) => {
    setCargando(true);
    let agrupadofecha = DataAcumulado
    .reduce((p: any, c: any) => {
        let name = c.Fecha;
        p[name] = p[name] ?? [];
        p[name].push(c);
        return p;
    }, {});
    let Semanas = Object.keys(agrupadofecha);
    ApexCharts.exec('apexchart-churn', 'updateOptions', {
      chart: {
        events: {
          click: (event: any, chartContext: any, config: any) => {
            // seleccionamos el index de la grafica para posteriormente filtrar
            let labelSeleccionado = Semanas[config.dataPointIndex];
            // si la informacion del label seleccionado es igual al label que se encuentra en los filtros
            // asginamos  -1 y limpiamos la grafica para que muestre todos los datos
            // setidxSeleccionado((labelSeleccionado === fechaGraficaActual) ? -1 : config.dataPointIndex);
            console.log(labelSeleccionado);
          }
        }
      },
      xaxis: {
        categories: Semanas //["Semana anterios","Semana Actual"]
      }
    });
    let UA = DataAcumulado.map((e:any) =>{
      return e.UnidadesActivas
    })
    let Entrada = DataAcumulado.map((e:any) =>{
      return e.Entradas
    })
    let Salida =  DataAcumulado.map((e:any) =>{
      return e.Salidas
    });
    let churn = DataAcumulado.map((e:any) =>{
      return e.Diferencia
    });
    //   funcion que actualiza los datos de las series
    // se debe pasar el id configurado al momento de su creaci'on para poder
    // actializar los datos
    ApexCharts.exec('apexchart-churn', 'updateSeries',
     [
      {
        name: `Unidades Activas`,
        data: UA,
        type: 'bar'
      }, {
        name:  `Entrada`,
        data:Entrada ,
        type: 'bar',
        color: '#F44336'
      }
      , {
        name: 'Salida',
        data:Salida,
        type: 'bar',
        color: '#99C2A2'
      },
      {
        name: 'Churn',
        data:churn ,
        type: 'line',
        color: '#10E172'
      }
    ]
    );

    let Sumas = 0 ;
    let SumasSalidas = 0;
    let SumasDiferencias = 0;
    if(DataChurn.length != 0){
      Sumas = DataChurn.map((e:any) => e.Entradas).reduce((e,a) => e+a);
      SumasSalidas =  DataChurn.map((e:any) => e.Salidas).reduce((e,a) => e+a);
      SumasDiferencias =  DataChurn.map((e:any) => e.Diferencia).reduce((e,a) => e+a);
    }


    // let SumasSalidas = Salida.reduce((e,a) =>e+a)
    setTotalIn(Sumas.toString());
    setTotalOut(SumasSalidas.toString());
    setTotalResultado(SumasDiferencias.toString())
    setChurnDataEntradas(DataChurn);
    setCargando(false);
  }
  let DatosColumnasChurnEntradas: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'Cliente',
      header: 'Cliente',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="">{row.original.Cliente}</span>)
        return dato;
      }
    },
    {
      accessorKey: 'Fecha',
      header: 'Semana',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="">{row.original.Fecha}</span>)
        return dato;
      }
    },
    {
      accessorKey: 'Entradas',
      header: 'In',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="">{row.original.Entradas}</span>)
        return dato;
      }
    },
    {
      accessorKey: 'Salidas',
      header: 'Out',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="">{row.original.Salidas}</span>)
        return dato;
      }
    },
    {
      accessorKey: 'Diferencia',
      header: 'Churn',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="text-left">{row.original.Diferencia}</span>)
        return dato;
      }
    },
  ]
  return (
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 pt-12">
              <div className="card">
              {
              (opciones != null) 
                && 
              (<ReactApexChart
                options={opciones.options}
                series={opciones.series}
                height={300} />)
              }
              </div>
              <div style={{ display: (churnDataEntradas.length != 0 ? "inline" : "none") }}>
                {(churnDataEntradas.length != 0)  && (
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
                    columns={DatosColumnasChurnEntradas}
                    data={churnDataEntradas}
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
                <div className="container" style={{ display: (churnDataEntradas.length != 0 ? "inline" : "none") }}>
                  <div className="row">
                    <div className="col-sm-2 col-xl-2 col-md-2 col-lg-2">
                      <span className="fw-bolder">Total</span>
                    </div>
                    <div className="col-sm-2 col-xl-2 col-md-2 col-lg-2">
                    </div>
                    <div className="col-sm-2 col-xl-2 col-md-2 col-lg-2 text-center">
                       <span className="fw-bolder">{TotalIn}</span>
                    </div>
                    <div className="col-sm-1 col-xl-1 col-md-1 col-lg-1  text-center">
                    </div>
                    <div className="col-sm-2 col-xl-2 col-md-2 col-lg-2  text-left">
                      <span className="fw-bolder text-end">{TotalOut}</span>
                    </div>
                    <div className="col-sm-2 col-xl-2 col-md-2 col-lg-2  text-left">
                      <span className="fw-bolder text-center">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{TotalResultado}</span> 
                    </div>
                    <div className="col-sm-1 col-xl-1 col-md-1 col-lg-1  text-left">
                     
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: (churnDataEntradas.length == 0 ? "inline" : "none") }}>
                <div className="card">
                  <div className="d-flex justify-content-between mb-2">
                    <div className="mx-auto">
                      <div className="ms-3 text-center">
                        <span className="text-muted m-3">{`No hay datos que mostrar`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}
export { Churn }