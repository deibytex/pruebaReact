import moment from "moment";
import { useEffect, useRef, useState, UIEvent, useCallback } from "react";
import { GetReporteAlarmas, GetReporteNivelCarga } from "../../data/ReportesData";
import { PageTitle } from "../../../../../_start/layout/core";
import { DateRangePicker, Notification, Placeholder, useToaster } from "rsuite";
import BlockUi from "@availity/block-ui";
import { DescargarExcel } from "../../../../../_start/helpers/components/DescargarExcel";
import MaterialReactTable, { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import { FormatoColombiaDDMMYYY, FormatoColombiaDDMMYYYHHmmss, FormatoSerializacionYYYY_MM_DD_HHmmss } from "../../../../../_start/helpers/Constants";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import DualListBox from "react-dual-listbox";
import { dualList } from "../../../CorreosTx/models/dataModels";
import { Button, Card, Form, Modal } from "react-bootstrap-v5";
import ReactApexChart from "react-apexcharts";
import { FiltrosReportes } from "../../models/eBus";
import { ClienteDTO } from "../../models/NivelcargaModels";
import { AxiosResponse } from "axios";
import { GetClientesEsomos } from "../../data/NivelCarga";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { InicioCliente } from "../../../../../_start/helpers/Models/ClienteDTO";
import { locateFormatNumberNDijitos } from "../../../../../_start/helpers/Helper";
import { Box } from "@mui/material";




export default function ReporteNivelCarga() {

  let Filtros: FiltrosReportes = {
    FechaInicialInicial: moment().add(-7, 'days').startOf('day').toDate(),
    FechaFinalInicial: moment().startOf('day').toDate(),
    FechaInicial: moment().startOf('day').add(-7, 'days').toDate(),
    FechaFinal: moment().startOf('day').toDate(),
    IndGrafica: -1,
    FechaGrafica: "",
    Vehiculos: [],
    Operadores: null,
    limitdate: null
  }

  const { allowedMaxDays, allowedRange, combine } = DateRangePicker;
  const refChart = useRef<ReactApexChart>(null);
  const tablaAlarmas = useRef<MRT_TableInstance<any>>(null);

  const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);

  const [totalEnergia, setTotalEnergia] = useState<number>(0);
  const [Clientes, setClientes] = useState<ClienteDTO[]>();
  const [filtros, setFiltros] = useState<FiltrosReportes>(Filtros);
  const [loader, setloader] = useState<boolean>(false);
  const [lablesAxisx, setlablesAxisx] = useState<string[]>([]);
  const [idxSeleccionado, setidxSeleccionado] = useState<number>(-2);
  const [isCallData, setisCallData] = useState<boolean>(false);


  const [data, setData] = useState<any[]>([]);
  const [dataFiltrada, setDataFiltrada] = useState<any[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [lstVehiculos, setlstVehiculos] = useState<dualList[]>([]);
  const [lstSeleccionados, setSeleccionados] = useState<string[]>([]);
  //////////////// TABLE STATE
  //table state
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [opciones, setOpciones] = useState<any>(null);
  // variable que contendra los datos de los odometros
  ///////////// FIN TABLE STATE
  const toaster = useToaster();
  /*
   const message = (
        <Notification type="success" header="success" closable>
          <Placeholder.Paragraph style={{ width: 320 }} rows={3} />

        </Notification>
      );
  */
  // listado de campos a extraer
  let listadoCampos: MRT_ColumnDef<any>[] =

    [
      {
        accessorKey: 'Movil',
        header: 'Móvil',
        size: 100
      },
      {
        accessorKey: 'FechaCorte',
        header: 'Fecha',
        Cell({ cell, column, row, table, }) {
          return (moment(row.original.Fecha).format(FormatoColombiaDDMMYYY))
        }
      },
      {
        accessorKey: 'FechaInicioCarga',
        header: 'Inicio',
        Cell({ cell, column, row, table, }) {
          return (moment(row.original.FechaInicioCarga).format(FormatoColombiaDDMMYYYHHmmss))
        }
      },

      {
        accessorKey: 'FechaFinCarga',
        header: 'Fin',
        Cell({ cell, column, row, table, }) {
          return (moment(row.original.FechaFinCarga).format(FormatoColombiaDDMMYYYHHmmss))
        }
      },
      {
        accessorKey: 'DuracionHora',
        header: 'Dur[h]',
        Cell({ cell, column, row, table, }) {
          return (locateFormatNumberNDijitos(row.original.DuracionHora ?? 0, 2))
        }
      },
      {
        accessorKey: 'SOCInicial',
        header: 'SOC Ini'
      },
      {
        accessorKey: 'SOC',
        header: 'SOC Fin'
      },
      {
        accessorKey: 'Energia',
        header: 'Energía [kWh]',
        Cell({ cell, column, row, table, }) {
          return (locateFormatNumberNDijitos(row.original.Energia ?? 0, 2))
        }
      },
      {
        accessorKey: 'Odometro',
        header: 'Odómetro',
        Cell({ cell, column, row, table, }) {
          return (locateFormatNumberNDijitos(row.original.Odometro ?? 0, 2))
        }
      },
      {
        accessorKey: 'Dsoc',
        header: 'Dsoc'
      },
      {
        accessorKey: 'NroRecarga',
        header: '#Conex'
      },
      {
        accessorKey: 'PotenciaPromedio',
        header: 'PotPro[kW]',
        Cell({ cell, column, row, table, }) {
          return (locateFormatNumberNDijitos(row.original.PotenciaPromedio ?? 0, 2))
        }
      },
      {
        accessorKey: 'Ubicacion',
        header: 'Ubicación'
      }

    ];


  useEffect(
    () => {
      setIsLoading(true);
      GetClientesEsomos().then((response: AxiosResponse<any>) => {
        setClientes(response.data);
        setClienteSeleccionado(response.data[0])
        setIsLoading(false);
      }).catch((error) => {
        console.log(error);
        errorDialog("<i>Eror al consultar los clientes</i>", "")
      })


    }, []
  )

  // useefet que se ejecuta la primera vez, cuando el cliente es seleccionado 
  useEffect(() => {

    // consulta la informacion de las alarmas cuando 
    // cambia el ciente seleecionado y las fechas 
    if (ClienteSeleccionado.clienteIdS != 0)
      ConsultarDataAlarmas();

    // configuramos el chart

    // WARNING --  HAY QUE TENER PRESENTE QUE LOS USESTATE
    // DENTRO DE LOS EVENTOS DE LA GRAFICA NO USA EL ESTADO ACTUAL SINO EL ESTADO
    // AL MOMENTO DE SER CREADO, SE DEBEN USAR LOS SETUSETATE Y LOS CLICK EVENTS 
    // PARA QUE USE LOS USESTATE CON LA INFORMACIONF REAL

    let defaultopciones = {
      options: {
        chart: {
          id: 'apexchart-example',
          events: {
            dataPointSelection: function (event: any, chartContext: any, config: any) {
              // seleccionamos el index de la grafica para posteriormente filtrar
              setidxSeleccionado(config.dataPointIndex);

            }
          }
        },
        xaxis: {
          categories: []
        },
        yaxis: [{
          showAlways: true,
          tickAmount: 5,
          min: 0,

          // seriesName: 'Energía [kWh]',
          labels: {
            formatter: function (val: number, index: any) {
              return val.toFixed(0);
            }
          },
          title: {
            text: "Total Energía [kWh]"
          }

        },
        {
          showAlways: true,
          tickAmount: 5,
          min: 0,
          max: 500,
          //  seriesName: 'Móviles Recargados',

          opposite: true,
          title: {
            text: "#Moviles Recargados"
          }

        }],
        dataLabels: {
          enabled: true,
          enabledOnSeries: true,
          formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {

            return seriesIndex == 0 ? locateFormatNumberNDijitos(value, 1) : value
          },
         
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top'
            }
          }
        }
      },
      series: []

    }
    // asingamos las opciones
    setOpciones(defaultopciones)

    return function cleanUp() {
      //SE DEBE DESTRUIR EL OBJETO CHART
    };
  }, [ClienteSeleccionado]);


  useEffect(() => {
    // VALIDAMOS EL INDEX SELECCIONADO
    if (idxSeleccionado !== -2) // lo hacemos para que no dispare varias veces el llamado de la base de datos la primera vez que se carga
      setFiltros({
        ...filtros,
        IndGrafica: idxSeleccionado,
        FechaGrafica: lablesAxisx[idxSeleccionado]
      });
  }, [idxSeleccionado])

  useEffect(() => {
    if (idxSeleccionado !== -2)// lo hacemos para que no dispare varias veces el llamado de la base de datos la primera vez que se carga
      ConsultarDataAlarmas();
  }, [filtros])




  // metodo qeu consulta los datos de las alarmasg
  let ConsultarDataAlarmas = () => {

    if (data.length == 0 || isCallData) {
      setIsError(false)
      setIsLoading(true)
      setIsRefetching(true)
      setloader(true)
      GetReporteNivelCarga(moment(filtros.FechaInicial).format(FormatoSerializacionYYYY_MM_DD_HHmmss),
        moment(filtros.FechaFinal).format(FormatoSerializacionYYYY_MM_DD_HHmmss), ClienteSeleccionado.clienteIdS)
        .then((response) => {
          //asignamos la informcion consultada 
          setData(response.data);
          setisCallData(false)
          // vamos a llenar la informacion de los movils
          let lstVehiculos = (response.data as any[]).reduce((p, c) => {
            let movil = c["Movil"];
            let isExists = p.filter((f: any) => f["value"] === movil);
            if (isExists.length == 0)
              p.push({ "value": movil, "label": movil })
            return p;
          }, []);
          // listados de vehiculos de los datos que traemos
          setlstVehiculos(lstVehiculos);
          // datos filtrados que al principio son los mismos extraidos
          datosfiltrados(response.data)
          setidxSeleccionado(-1)
          // quitamos los loaders despues de cargado
          setIsLoading(false)
          setIsRefetching(false)
          setRowCount(response.data.length)
          setloader(false)

        }).catch((e) => {
          console.log(e);
          setIsError(true);
          setloader(false);
          setIsLoading(false)
          setIsRefetching(false)
        }).finally(() => {
          setloader(false);


        });

    }
    else
      datosfiltrados(data)

  }
  // FILTRA LOS DATOS QUE SE CONSULTAN DE LA BASE DE DATOS
  // SI EXISTE SE PASA LOS DATOS ALMACENADOS EN EL SISTEMA
  let datosfiltrados = (datos: any[]) => {
    let fechaGraficaActual = filtros.FechaGrafica;
    let FechaInicial: Date = filtros.FechaInicial;
    let FechaFinal: Date = filtros.FechaFinal;

    let datosFiltrados: any[] = datos;
    if (filtros.IndGrafica != -1) {
      FechaInicial = moment(filtros.FechaGrafica, FormatoColombiaDDMMYYY).toDate();
      FechaFinal = moment(filtros.FechaGrafica, FormatoColombiaDDMMYYY).toDate();
    }


    // filtramos por las fechas
    datosFiltrados = datosFiltrados.
      filter(f => moment(f.FechaCorte).toDate() >= FechaInicial && moment(f.FechaCorte).toDate() <= FechaFinal);

    // filtramos por los vehivulos

    if (filtros.Vehiculos.length > 0) {
      datosFiltrados = datosFiltrados.filter(f => filtros.Vehiculos.indexOf(f.Movil) > -1);
    }
    setDataFiltrada(datosFiltrados);
    setRowCount(datosFiltrados.length); // actualizamos la informacion de las filas
    // agrupa los elementos para ser mostrado por la grafica

    // agrupamos por fechas la informacion
    let agrupadofecha = datosFiltrados
      .reduce((p, c) => {
        let name = moment(c.FechaCorte).format(FormatoColombiaDDMMYYY);
        p[name] = p[name] ?? [];
        p[name].push(c);
        return p;
      }, {});

    // agrupa los elementos para ser mostrado por la grafica
    let totalvehiculos = new Array();
    let totalEnergia = new Array();
    let labels = new Array();
    let totalEnergiasum = 0;

    Object.entries(agrupadofecha).map((elem: any) => {
      labels.push(elem[0]);
      // agrupamos por vehiculo 
      let agrupadovehiculo = elem[1].reduce((p: any, c: any) => {
        let name = c.Movil;
        if (!p.hasOwnProperty(name)) {
          p[name] = 0;
        }
        p[name]++;
        return p;
      }, {});
      // y sumamos el total , esto es porque hay vehiculos que tiene mas de una recarga
      totalvehiculos.push(Object.entries(agrupadovehiculo).length)
      let totalSumaEnergia = (elem[1].map((m: any) => { return m.Energia }).reduce((a: number, b: number) => a + b, 0));
      totalEnergia.push(totalSumaEnergia.toFixed(2).toString());
      totalEnergiasum = totalEnergiasum + totalSumaEnergia;
    });
    setlablesAxisx(labels)
    setTotalEnergia(totalEnergiasum);
    // se debe volver actualizar los eventos pues 'estos no
    // se reflejan los usestate y utilizan los datos que tienen las variables
    // al momento de crearse

    ApexCharts.exec('apexchart-example', 'updateOptions', {
      chart: {
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            // seleccionamos el index de la grafica para posteriormente filtrar
            let labelSeleccionado = config.w.config.xaxis.categories[config.dataPointIndex];
            // si la informacion del label seleccionado es igual al label que se encuentra en los filtros
            // asginamos  -1 y limpiamos la grafica para que muestre todos los datos
            setidxSeleccionado((labelSeleccionado === fechaGraficaActual) ? -1 : config.dataPointIndex);
          }
        }
      },
      xaxis: {
        categories: labels
      }
    });
    // funcion que actualiza los datos de las series
    // se debe pasar el id configurado al momento de su creaci'on para poder
    // actializar los datos
    ApexCharts.exec('apexchart-example', 'updateSeries', [
      {
        name: 'Energía [kWh]',
        data: totalEnergia
      }, {
        name: 'Móviles Recargados',
        data: totalvehiculos
      }]);





  }

  // VERIFICA QUE SE DEBA CONSULTAR NUEVAMENTE LA INFORMACION EN LA BASE DE DATOS

  // VALIDA LAS FECHAS QUE SEAN LAS CORRECTAS Y ACTUALIZA LOS FILTROS
  let ValidarFechas = (Range: Date[]) => {

    let FechaInicial: Date = Range[0];
    let FechaFinal: Date = Range[1];
    let FechaInicialInicial: Date = filtros.FechaInicialInicial;
    let FechaFinalInicial: Date = filtros.FechaFinalInicial;

    setisCallData(
      (filtros.FechaInicialInicial > FechaInicial || filtros.FechaFinalInicial < FechaFinal
        || (filtros.FechaInicialInicial > FechaInicial &&
          filtros.FechaFinalInicial > FechaFinal)
      )
    )

    // cambiamos los datos iniciales 
    if ((filtros.FechaInicialInicial > FechaInicial)
      || (filtros.FechaInicialInicial > FechaInicial && filtros.FechaFinalInicial > FechaFinal))
      FechaInicialInicial = FechaInicial;

    if ((FechaFinal > filtros.FechaFinalInicial)
      || (filtros.FechaInicialInicial > FechaInicial && filtros.FechaFinalInicial > FechaFinal))
      FechaFinalInicial = FechaFinal;

    // cuando hay una consulta por fechas se debe quitar el filtro por gráfica para que pueda
    // visualizar correctamente la información
    setFiltros({ ...filtros, FechaInicial, FechaFinal, FechaInicialInicial, FechaFinalInicial, IndGrafica: -1, FechaGrafica: "" })

  }


  // seleccion de vehiculos
  function SelectVehiculos() {
    return (
      <DualListBox className=" mb-3 " canFilter
        options={lstVehiculos}
        selected={lstSeleccionados}
        onChange={(selected: any) => {
          // dejamos los seleccionados
          setSeleccionados(selected)
          // modificacion de filtros
          setFiltros({
            ...filtros,
            Vehiculos: selected
          });
        }}
      />
    );
  }
  function CargaListadoClientes() {
    return (
      <Form.Select className=" mb-3 " onChange={(e) => {
        // buscamos el objeto completo para tenerlo en el sistema
        let lstClientes = Clientes?.filter((value: any, index: any) => {
          return value.clienteIdS === Number.parseInt(e.currentTarget.value)
        })
        if (lstClientes !== undefined && lstClientes.length > 0)
          setClienteSeleccionado(lstClientes[0]);
      }} aria-label="Default select example" defaultValue={ClienteSeleccionado?.clienteIdS}>

        {
          Clientes?.map((element: any, i: any) => {

            return (<option key={element.clienteIdS} value={(element.clienteIdS != null ? element.clienteIdS : 0)}>{element.clienteNombre}</option>)
          })
        }
      </Form.Select>
    );
  }


  return (<>
    <PageTitle>Reporte Nivel Carga</PageTitle>
    <BlockUi tag="div" keepInView blocking={loader ?? false}  >
      <div className="card card-rounded shadow mt-2" style={{ width: '100%' }}  >

        <div className="d-flex justify-content-end mt-2">
          <div style={{ float: 'right' }}>
            <CargaListadoClientes />
          </div>
        </div>
        <div className="d-flex justify-content-between mb-2">          
            <div className="form-horizontal  row col-sm-12 col-md-12 col-xs-12 mx-auto">
              <div className="form-horizontal  row col-sm-4 col-md-4 col-xs-4 mx-auto">

              </div>
              <div className="form-horizontal  row col-sm-4 col-md-4 col-xs-4 mx-auto">
                <div className="ms-3 text-center">
                  <h3 className="mb-0">Eventos de Carga</h3>
                  <span className="text-muted m-3">Enegía Electrolinera por Día</span>

                </div>
              </div>
              <div className="form-horizontal  row col-sm-4 col-md-4 col-xs-4 mx-auto">
                <div className="ms-3 text-center">
                  <h2 className="mb-0"><span id="totalenergia"> {locateFormatNumberNDijitos(totalEnergia, 2)}</span></h2>
                  <span className="text-muted">Energía Total [kWh]</span>
                </div>
              </div>
            </div>
         
        </div>
          <div className="card bg-secondary d-flex justify-content-between">
            <h3 className="fs-4 m-2 ms-2 d-flex "> Filtros</h3>
            <div className="col-sm-8 col-md-8 col-xs-8 col-lg-8"> 
            <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Fecha inicial: </label>
              {(combine && allowedMaxDays && allowedRange) && (
                <DateRangePicker className="mt-2" format="dd/MM/yyyy" value={[filtros.FechaInicial, filtros.FechaFinal]}
                  disabledDate={combine(allowedMaxDays(30), allowedRange(
                    moment().add(-200, 'days').startOf('day').toDate(), moment().startOf('day').toDate()
                  ))}
                  onChange={(value, e) => {
                    if (value !== null) {
                      ValidarFechas(
                        [value[0],
                        value[1]]
                      );
                    }
                  }}

                />
              )}

              <Button className="m-2  btn btn-sm btn-primary" onClick={() => { setShowModal(true) }}><i className="bi-car-front-fill"></i></Button>
              <Button className="m-2  btn btn-sm btn-primary" onClick={() => { ConsultarDataAlarmas() }}><i className="bi-search"></i></Button>
            </div>

        


        </div>





      </div>
      {/* begin::Chart */}
      <div className="row mt-2 col-sm-12 col-md-12 col-xs-12 rounded shadow-sm mx-auto">
        {(opciones != null) && (
          <ReactApexChart ref={refChart}
            options={opciones.options}
            series={opciones.series} type="bar"
            height={320} />)}



      </div>
      {/* end::Chart      */}
      <div className="row mt-2 col-sm-12 col-md-12 col-xs-12 rounded shadow-sm mx-auto">

        <MaterialReactTable
          enableFilters={false}
          initialState={{ density: 'compact' }}
          enableColumnOrdering
          enableColumnDragging={false}
          enablePagination={false}
          enableStickyHeader
          enableDensityToggle={false}
          enableRowVirtualization
          // rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //get access to the virtualizer instance
          //  rowVirtualizerProps={{ overscan: 4 }}
          tableInstanceRef={tablaAlarmas}
          localization={MRT_Localization_ES}
          displayColumnDefOptions={{
            'mrt-row-actions': {
              muiTableHeadCellProps: {
                align: 'center',
              }
            },
          }}
          defaultColumn={{
            minSize: 80, //allow columns to get smaller than default
            maxSize: 200, //allow columns to get larger than default
            size: 80, //make columns wider by default
          }}
          muiTableContainerProps={{
            ref: tableContainerRef, //get access to the table container element
            sx: { maxHeight: '400px' }, //give the table a max height

          }}
          muiTableHeadCellProps={{
            sx: (theme) => ({
              fontSize: 14,
              fontStyle: 'bold',
              color: 'rgb(27, 66, 94)',
              //backgroundColor: 'yellow'

            }),
          }}
          columns={listadoCampos}
          data={dataFiltrada}
          // editingMode="modal" //default         
          // enableTopToolbar={false}

          // enableEditing
          /* onEditingRowSave={handleSaveRowEdits}
              onEditingRowCancel={handleCancelRowEdits}*/
          muiToolbarAlertBannerProps={
            isError
              ? {
                color: 'error',
                children: 'Error al cargar información',
              }
              : undefined
          }
          onColumnFiltersChange={setColumnFilters}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          rowCount={rowCount}
          state={{
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
          }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box
              sx={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1, display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
            >

              <button className="m-2 ms-0 btn btn-sm btn-primary" type="button" onClick={() => { DescargarExcel(dataFiltrada, listadoCampos, "Eventos Carga") }}>
                <i className="bi-file-earmark-excel"></i></button>


            </Box>
          )}
        />
      </div>

    </BlockUi>

    <Modal show={showModal} onHide={setShowModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title> Filtro por vehiculos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
            <SelectVehiculos />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={() => { setSeleccionados([]);  /*actualizamos los filtros*/setFiltros({ ...filtros, Vehiculos: [] }) }}>
          Limpiar
        </Button>
        <Button type="button" variant="primary" onClick={() => { setShowModal(false); }}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  </>)
}