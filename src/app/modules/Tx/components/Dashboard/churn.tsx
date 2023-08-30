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
const Churn: React.FC<Props> = ({ }) => {
  const { setCargando, DataChurn, Filtrado, Consulta } = useDataDashboard();
  const [churnDataEntradas, setChurnDataEntradas] = useState<any[]>([]);
  const [churnDataSalidas, setChurnDataSalidas] = useState<any[]>([])
  const [TotalIn, setTotalIn] = useState<string>("0");
  const [TotalOut, setTotalOut] = useState<string>("0");
  const [TotalResultado, setTotalResultado] = useState<string>("0");
  const [unidadesA, setunidadesA] = useState<string>("0");
  const [SemanaActual, setSemanaActual] = useState<string>("");
  const [opciones, setOpciones] = useState<any>(null);


  useEffect(() => {

    let Opciones = {
      options: {
        chart: {
          id: 'apexchart-churn',
          fontFamily: 'Montserrat',
          type: 'bar',
          stacked: false,
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
          categories: []
        },
        yaxis: [{
          showAlways: true,
          tickAmount: 5,

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
          opposite: true,
          title: {
            text: "Entradas - Salidas - Churn"
          }, labels: {
            formatter: function (val: number, index: any) {
              return val.toFixed(0);
            }
          }
        },
        {
          opposite: true,
          show: false,
        },
        {
          opposite: true,
          show: false

        }
        ],

      },
      series: []

    };

    setOpciones(Opciones);
  }, []);


  //para los acumulado o cruch
  useEffect(() => {

    if (!Filtrado) {
      //Toco ponerle un timeuot porque no renderizaba cuando debia
      let timerId = setTimeout(() => {
        if (DataChurn != undefined && DataChurn.length != 0 && DataChurn)
          PintarAcumulado2Semanas(DataChurn);
        clearTimeout(timerId);
      }, 1000);
      // clearTimeout(timerId);
    }
  }, [DataChurn])

  const PintarAcumulado2Semanas = (DataChurn: any[]) => {
    setCargando(true);
    let agrupadofecha = DataChurn
      .reduce((p: any[], c: any) => {
        let name = c.Semana;
        let tipo = c.Tipo;

        let isExists = p.filter((f: any) => f.Semana == name);

        if (isExists.length == 0) {
          let objeto = { Semana: name, UA: c.UA, Entrada : 0, Salida:0 }
          objeto[tipo] = objeto[tipo] ?? [];
          objeto[tipo] = 1;

          p.push(objeto)
        }
        else {
          let objeto = isExists[0];
          objeto[tipo] = objeto[tipo] ?? 0;
          objeto[tipo] = objeto[tipo] + 1;
        }


        return p;
      }, []);
    let Semanas = agrupadofecha.map(m => m.Semana);
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
    let UA = agrupadofecha.map(m => m.UA);
    let Entrada = agrupadofecha.map(m => m.Entrada);
    let Salida = agrupadofecha.map(m => m.Salida);
    let churn = agrupadofecha.map(m => (m.Entrada - m.Salida));
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
          name: `Entrada`,
          data: Entrada,
          type: 'bar',
          color: '#F44336'
        }
        , {
          name: 'Salida',
          data: Salida,
          type: 'bar',
          color: '#99C2A2'
        },
        {
          name: 'Churn',
          data: churn,
          type: 'line',
          color: '#10E172'
        }
      ]
    );

    let Sumas = 0;
    let SumasSalidas = 0;
    let SumasDiferencias = 0;
    if (DataChurn.length != 0) {
      Sumas = DataChurn.map((e: any) => e.Entradas).reduce((e, a) => e + a);
      SumasSalidas = DataChurn.map((e: any) => e.Salidas).reduce((e, a) => e + a);
      SumasDiferencias = DataChurn.map((e: any) => e.Diferencia).reduce((e, a) => e + a);
    }


    // let SumasSalidas = Salida.reduce((e,a) =>e+a)
    setTotalIn(agrupadofecha[0].Entrada.toString());
    setTotalOut(agrupadofecha[0].Salida.toString());
    setTotalResultado((agrupadofecha[0].Entrada -agrupadofecha[0].Salida).toString())
    setSemanaActual(agrupadofecha[0].Semana)
    setChurnDataEntradas(DataChurn);
    setunidadesA(agrupadofecha[0].UA.toString());
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
      accessorKey: 'Semana',
      header: 'Semana',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="">{row.original.Semana}</span>)
        return dato;
      }
    },
    {
      accessorKey: 'Tipo',
      header: 'Tipo',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="">{row.original.Tipo}</span>)
        return dato;
      }
    },
    {
      accessorKey: 'Matricula',
      header: 'Matricula',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="text-left">{row.original.Matricula}</span>)
        return dato;
      }
    },
    {
      accessorKey: 'Vertical',
      header: 'Vertical',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="text-left">{row.original.Vertical}</span>)
        return dato;
      }
    },
    {
      accessorKey: 'VerticalAnterior',
      header: 'Vertical Ant',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="text-left">{row.original.VerticalAnterior}</span>)
        return dato;
      }
    }
  ]
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 pt-12">
          <div className="container" style={{ display: (churnDataEntradas.length != 0 ? "inline" : "none") }}>
            <div className="row text-center">
            <div className="col-sm-2 col-xl-2 col-md-2 col-lg-2"> </div>
            <div className="col-sm-2 col-xl-2 col-md-2 col-lg-2">
                <div className="ps-1">
                  <span className="nav-text text-white fw-bolder fs-6">
                    semana
                  </span>
                  <span className="text-gray-800 fw-bold d-block pt-1">
                    {SemanaActual}
                  </span>
                </div>
              </div>
            <div className="col-sm-2 col-xl-2 col-md-2 col-lg-2">
                <div className="ps-1">
                  <span className="nav-text text-gray-800 fw-bolder fs-6">
                    U ACTIVAS
                  </span>
                  <span className="text-muted fw-bold d-block pt-1">
                    {unidadesA}
                  </span>
                </div>
              </div>
              <div className="col-sm-2 col-xl-2 col-md-2 col-lg-2">
                <div className="ps-1">
                  <span className="nav-text text-gray-800 fw-bolder fs-6">
                    ENTRADAS
                  </span>
                  <span className="text-muted fw-bold d-block pt-1">
                    {TotalIn}
                  </span>
                </div>
              </div>
              <div className="col-sm-2 col-xl-2 col-md-2 col-lg-2">
                <div className="ps-1">
                  <span className="nav-text text-gray-800 fw-bolder fs-6">
                    SALIDAS
                  </span>
                  <span className="text-muted fw-bold d-block pt-1">
                    {TotalOut}
                  </span>
                </div>
              </div>
              <div className="col-sm-2 col-xl-2 col-md-2 col-lg-2">
                <div className="ps-1">
                  <span className="nav-text text-gray-800 fw-bolder fs-6">
                    CHURN
                  </span>
                  <span className="text-muted fw-bold d-block pt-1">
                    {TotalResultado}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
            {(churnDataEntradas.length != 0) && (
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