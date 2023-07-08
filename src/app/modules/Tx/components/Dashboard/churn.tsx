import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Modal } from "react-bootstrap-v5";
import { useDataDashboard } from "../../core/DashboardProvider";
import { useEffect, useState } from "react";
import { formatNumberChart, locateFormatNumberNDijitos, locateFormatPercentNDijitos } from "../../../../../_start/helpers/Helper";
import ReactApexChart from "react-apexcharts";
import { object } from "yup";

type Props = {
}
const Churn: React.FC<Props> = ({  }) => {
  const { DataAcumulado, showChurn, setshowChurn, setCargando } = useDataDashboard();
  const [churnDataEntradas, setChurnDataEntradas] = useState<any[]>([]);
  const [churnDataSalidas, setChurnDataSalidas] = useState<any[]>([])
  const [TotalIn, setTotalIn] = useState<string>("0");
  const [TotalOut, setTotalOut] = useState<string>("0");
  const [TotalResultado, setTotalResultado] = useState<string>("0");
  const [SemanaAnterior, setSemanaAnterior] = useState<string>("");
  const [SemanaActual, setSemanaActual] = useState<string>("");
  const [opciones, setOpciones] = useState<any>(null);
  const [lstIndicadores, setListIndicadores] = useState<any>({
    SemanaAnterior: 0,
    SemanaActual: 0,
    "Churn": 0
  });
  
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
        dataLabels: {

          enabled: true,
          enabledOnSeries: true,
          formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {
            return value;
           // return seriesIndex == 2 ? locateFormatPercentNDijitos(value, 2) : locateFormatNumberNDijitos(value, 2)
          },

        }
      },
      series: []

    };
    setOpciones(Opciones);
  },[]);

  //para los acumulado o cruch
  useEffect(() => {
    if (DataAcumulado != undefined && DataAcumulado.length != 0)
      PintarAcumulado2Semanas(DataAcumulado);
  }, [DataAcumulado])

  const PintarAcumulado2Semanas = (DataAcumulado: any[]) => {
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

    // ApexCharts.exec('totalDistancia', 'updateSeries', [
    //   {
    //     name: 'Distancia [km]',
    //     data: totalDistanciaA
    //   }]);

    //Los que no estan en la semana actual respecto anterior
    // los que entraron
    // let entradas = DatoSemanaActual.filter(function (el) {
    //   return !(DatoSemanaAnterior.filter((ff) => ff.Matricula === el.Matricula && ff.Base == el.Base).length == 1);
    // });
    // //filtrar los datos de la semana anterior respecto a la actual
    // // los que salieron 
    // let salidas = DatoSemanaAnterior.filter(function (el) {
    //   return !(DatoSemanaActual.filter((ff) => ff.Matricula === el.Matricula && ff.Base == el.Base).length == 1);
    // });
    // let agrupado = entradas
    //   .reduce((p, c) => {
    //     let name = c.Base;
    //     let isExists = p.filter((f: string) => f === name);
    //     if (isExists.length == 0)
    //       p.push(name);

    //     return p;
    //   }, []);
    // let EntradasPorClientes = entradas.reduce((p, c) => {
    //   let name = c.Base;
    //   p[name] = p[name] ?? [];
    //   p[name].push(c);
    //   return p;
    // }, {});

    // let ArrayClientes: any[] = [];
    // Object.entries(EntradasPorClientes).forEach((elem: any) => {
    //   agrupado.forEach((fr: string, index: number) => {
    //     let name = elem[0];
    //     let objetomovil = ArrayClientes.filter(f => f.Base === name);
    //     // si no existe creamos el objeto de la fila a guardar
    //     let rowMovil = (objetomovil.length == 0) ? {} : objetomovil[0];
    //     rowMovil["Base"] = name;
    //     rowMovil["Cantidad"] = elem[1].length;
    //     if (objetomovil.length == 0) {
    //       ArrayClientes.push(rowMovil);
    //     }
    //   });
    // });


    // let agrupadoSalidas = salidas
    //   .reduce((p, c) => {
    //     let name = c.Base;
    //     let isExists = p.filter((f: string) => f === name);
    //     if (isExists.length == 0)
    //       p.push(name);

    //     return p;
    //   }, []);
    // let SalidasPorClientes = salidas.reduce((p, c) => {
    //   let name = c.Base;
    //   p[name] = p[name] ?? [];
    //   p[name].push(c);
    //   return p;
    // }, {});

    // let ArrayClientesSalidas: any[] = [];
    // Object.entries(SalidasPorClientes).forEach((elem: any) => {
    //   agrupadoSalidas.forEach((fr: string, index: number) => {
    //     let name = elem[0];
    //     let objetomovil = ArrayClientesSalidas.filter(f => f.Base === name);
    //     // si no existe creamos el objeto de la fila a guardar
    //     let rowMovil = (objetomovil.length == 0) ? {} : objetomovil[0];
    //     rowMovil["Base"] = name;
    //     rowMovil["Cantidad"] = elem[1].length;
    //     if (objetomovil.length == 0) {
    //       ArrayClientesSalidas.push(rowMovil);
    //     }
    //   });
    // });

    // let ArrayClientesCompletos: any[] = [];

    // ArrayClientes.map((val, index) => {
    //   ArrayClientesSalidas.map((item) => {
    //     if (val.Base == item.Base) {
    //       let encontred = ArrayClientesCompletos.findIndex(Element => Element.Base == val.Base);
    //       if (encontred == -1) {
    //         ArrayClientesCompletos.push({
    //           "Base": val.Base,
    //           "In": val.Cantidad,
    //           "Out": (item.Cantidad == null || item.Cantidad == undefined || item.Cantidad == "" ? 0 : item.Cantidad),
    //           "Total": (val.Cantidad - (item.Cantidad == null || item.Cantidad == undefined || item.Cantidad == "" ? 0 : item.Cantidad))
    //         })
    //       } else {
    //         ArrayClientesCompletos[encontred].In = ArrayClientesCompletos[encontred].In + (item.Cantidad == null || item.Cantidad == undefined || item.Cantidad == "" ? 0 : item.Cantidad);
    //         ArrayClientesCompletos[encontred].Out = ArrayClientesCompletos[encontred].Out + item.Cantidad;
    //         ArrayClientesCompletos[encontred].Total = ArrayClientesCompletos[encontred].Total + (val.Cantidad - (item.Cantidad == null || item.Cantidad == undefined || item.Cantidad == "" ? 0 : item.Cantidad))
    //       }
    //     } else {
    //       let encontred = ArrayClientesCompletos.findIndex(Element => Element.Base == val.Base);
    //       if (encontred == -1) {
    //         ArrayClientesCompletos.push({
    //           "Base": val.Base,
    //           "In": val.Cantidad,
    //           "Out": 0,
    //           "Total": val.Cantidad
    //         })
    //       } else {
    //         ArrayClientesCompletos[encontred].In = ArrayClientesCompletos[encontred].In + val.Cantidad;
    //         ArrayClientesCompletos[encontred].Total = ArrayClientesCompletos[encontred].Total + val.Cantidad;
    //       }
    //     }
    //   })
    // })
    setChurnDataEntradas(DataAcumulado);
    // setChurnDataSalidas(ArrayClientesSalidas);

    // let TotalIn = (
    //   ArrayClientesCompletos.map((m: any) => {
    //     return (m.In)
    //   }).reduce((a: any, b: any) => a + b, 0));
    // let TotalOut = (
    //   ArrayClientesCompletos.map((m: any) => {
    //     return (m.Out)
    //   }).reduce((a: any, b: any) => a + b, 0));
    // let TotalDierencia = (
    //   ArrayClientesCompletos.map((m: any) => {
    //     return (m.Total)
    //   }).reduce((a: any, b: any) => a + b, 0));

    // setTotalIn(TotalIn);
    // setTotalOut(TotalOut);
    // setTotalResultado(TotalDierencia);
    setCargando(false);




  }
  let DatosColumnasChurnEntradas: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'Base',
      header: 'Cliente',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="">{row.original.Base}</span>)
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
        let dato = (<span title={""} className="">{row.original.Entradas}</span>)
        return dato;
      }
    },
  ]



  return (
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 pt-12">
              {/* <div className="card">
                <div className="d-flex justify-content-between mb-2">
                  <div className="mx-auto">
                    <div className="ms-3 text-center">
                      <h3 className="mb-0">{`CHURN ${SemanaAnterior} y ${SemanaActual}`} </h3>
                    </div>
                  </div>
                </div>
              </div> */}
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
                    <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                      <span className="fw-bolder">Total</span>
                    </div>
                    <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4  text-left">
                      <span className="fw-bolder text-end">{TotalIn}</span>
                    </div>
                    <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4  text-left">
                      <span className="fw-bolder text-end">{TotalOut}</span>
                    </div>
                    {/* <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3  text-center">
                  <span className="fw-bolder text-end">{TotalResultado}</span>
                </div> */}
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