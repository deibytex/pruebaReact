import moment from "moment";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { GetReporteViajes } from "../../data/ReportesData";
import { ModuleName, PageTitle } from "../../../../../_start/layout/core";
import { Checkbox, CheckboxGroup, DateRangePicker, Notification, Placeholder, useToaster } from "rsuite";
import BlockUi from "@availity/block-ui";
import { DescargarExcel } from "../../../../../_start/helpers/components/DescargarExcel";
import MaterialReactTable, { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import { FormatoColombiaDDMMYYY, FormatoColombiaDDMMYYYHHmmss, FormatoSerializacionYYYY_MM_DD_HHmmss } from "../../../../../_start/helpers/Constants";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Button, Card, Form, Modal } from "react-bootstrap-v5";
import ReactApexChart from "react-apexcharts";
import { FiltrosReportes } from "../../models/eBus";
import { ClienteDTO } from "../../models/NivelcargaModels";
import { AxiosResponse } from "axios";
import { GetClientesEsomos } from "../../data/NivelCarga";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { InicioCliente } from "../../../../../_start/helpers/Models/ClienteDTO";
import { locateFormatNumberNDijitos, locateFormatPercentNDijitos } from "../../../../../_start/helpers/Helper";
import { Box } from "@mui/material";
import { getVehiculosCliente } from "../../../../../_start/helpers/Axios/DWHService";
import { Typeahead } from "react-bootstrap-typeahead";
import { Stack } from "@mui/material";




export default function ReporteViaje() {

  let Filtros: FiltrosReportes = {
    FechaInicialInicial: moment().add(-6, 'days').startOf('day').toDate(),
    FechaFinalInicial: moment().startOf('day').toDate(),
    FechaInicial: moment().startOf('day').add(-6, 'days').toDate(),
    FechaFinal: moment().startOf('day').toDate(),
    IndGrafica: -1,
    FechaGrafica: "",
    Vehiculos: [],
    Operadores: null,
    limitdate: null
  }
  const defaultEventsSelected: any[] = [
    {
      name: 'Soc [%]',
      data: [],
      isSelected: true,
      getData: (fecha: any, f: any) => {
        return {
          "x": fecha,
          "y": f.Soc
        }
      }
    },
    {
      name: 'Regeneración [%]',
      data: [],
      isSelected: true,
      getData: (fecha: any, f: any) => {
        return {
          "x": fecha,
          "y": (f.CargakWh / f.DescargakWh) * 100
        }
      }
    },
    {
      name: 'TEnergía [kWh]',
      data: [],
      isSelected: false,
      getData: (fecha: any, f: any) => {
        return {
          "x": fecha,
          "y": f.DescargakWh - f.CargakWh
        }
      }
    },
    {
      name: 'E.Cargada [kWh]',
      data: [],
      isSelected: false,
      getData: (fecha: any, f: any) => {
        return {
          "x": fecha,
          "y": f.CargakWh
        }
      }
    },
    {
      name: 'E.Descargada [kWh]',
      data: [],
      isSelected: false,
      getData: (fecha: any, f: any) => {
        return {
          "x": fecha,
          "y": f.DescargakWh
        }
      }
    }

  ]

  let preSeleccionados = defaultEventsSelected.filter(x => x.isSelected).map(x => x.name);

  const [value, setValue] = useState<any[]>(preSeleccionados);

  const handleCheckAll = (value: any, checked: any) => {

    let aux = defaultEventsSelected.map((x: any) => {
      x.isSelected = checked;
      return x;
    });
    setEventsSelected(aux);
    setValue(checked ? defaultEventsSelected.map(x => x.name) : []);
  }
  const handleChange = (value: any[]) => {
    let aux = defaultEventsSelected.map((x: any) => {
      x.isSelected = value.includes(x.name);
      return x;
    });
    setValue(value);
    setEventsSelected(aux);
  };
  const [eventsSelected, setEventsSelected] = useState(defaultEventsSelected);
  const { allowedMaxDays, allowedRange, combine } = DateRangePicker;
  const typeaheadRef = useRef<any>(null);
  const refChart = useRef<ReactApexChart>(null);
  const tablaAlarmas = useRef<MRT_TableInstance<any>>(null);

  const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
  const [Clientes, setClientes] = useState<ClienteDTO[]>();
  const [filtros, setFiltros] = useState<FiltrosReportes>(Filtros);
  const [loader, setloader] = useState<boolean>(false);
  const [idxSeleccionado, setidxSeleccionado] = useState<number>(-2);
  const [isCallData, setisCallData] = useState<boolean>(false);
  const [data, setAlarmas] = useState<any[]>([]);
  const [dataFiltrada, setDataFiltrada] = useState<any[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [lstVehiculos, setlstVehiculos] = useState<any[]>([]);
  const [lstSeleccionados, setSeleccionados] = useState<any[]>([]);
  //////////////// TABLE STATE
  //table state
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
        header: 'Móvil',
        size: 100,
        Cell() {
          return lstSeleccionados[0]
        }
      },
      {
        accessorKey: 'fechaHora',
        header: 'FechaHora',

        Cell({ cell, column, row, table, }) {
          return (moment(row.original.fechaHora ?? new Date()).format(FormatoColombiaDDMMYYYHHmmss))
        }
      }, {
        accessorKey: 'Soc',
        header: 'Soc'
      },
      {

        header: 'Regeneración [%]',
        Cell({ row }) {
          return (locateFormatPercentNDijitos((
            (row.original.CargakWh / row.original.DescargakWh)
          ), 2))
        }
      }, {

        header: 'TEnergía [kWh]',
        Cell({ cell, column, row, table, }) {
          return (locateFormatNumberNDijitos(
            (row.original.DescargakWh ?? 0 + row.original.CargakWh ?? 0), 2))
        }
      }, {
        accessorKey: 'CargakWh',
        header: 'E Cargada [kWh]',
        Cell({ cell, column, row, table, }) {
          return (locateFormatNumberNDijitos(row.original.CargakWh ?? 0, 2))
        }
      }, {
        accessorKey: 'DescargakWh',
        header: 'E Descargada [kWh]',
        Cell({ cell, column, row, table, }) {
          return (locateFormatNumberNDijitos(row.original.DescargakWh ?? 0, 2))
        }
      }

    ];


  useEffect(
    () => {
      GetClientesEsomos().then((response: AxiosResponse<any>) => {
        setClientes(response.data);
        setClienteSeleccionado(response.data[0])

      }).catch((error) => {
        console.log(error);
        errorDialog("<i>Eror al consultar los clientes</i>", "")
      })

      // traemos la informacion del listado de vehiculos disponibles por el cliente



    }, []
  )

  // useefet que se ejecuta la primera vez, cuando el cliente es seleccionado 
  useEffect(() => {
    // cuando trae la informacipn de los clientes, debe traer la informacion
    // de los vehiculos
    setSeleccionados([]);
    if (ClienteSeleccionado.clienteIdS != 0)
      ConsultaVehiculosClienteSeleccionado(ClienteSeleccionado.clienteIdS);


    // configuramos el chart

    // WARNING --  HAY QUE TENER PRESENTE QUE LOS USESTATE
    // DENTRO DE LOS EVENTOS DE LA GRAFICA NO USA EL ESTADO ACTUAL SINO EL ESTADO
    // AL MOMENTO DE SER CREADO, SE DEBEN USAR LOS SETUSETATE Y LOS CLICK EVENTS 
    // PARA QUE USE LOS USESTATE CON LA INFORMACIONF REAL

    let defaultopciones = {
      options: {

        chart: {
          animations: { enabled: false },
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
          type: 'area',
          //   stacked: true,
          id: 'ebus-graficadearea',
          events: {
            selection: function (chart: any, e: any) {
              console.log(new Date(e.xaxis.min))
            }
          }
        },
        stroke: {
          curve: 'smooth'
        }
        ,
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          onItemClick: {
            toggleDataSeries: false
          }
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: [{
          showAlways: true,
          tickAmount: 5,
          min: 0,
          max: 100,
          labels: {
            formatter: function (val: number, index: any) {
              return val.toFixed(0);
            }
          },
          title: {
            text: "Soc[%] - Regeneracion[%]"
          }
        },
        {
          show: false,
          min: 0,
          max: 100
        },
        {
          show: false,
          opposite: true
        },
        {
          show: false,
          opposite: true,
        },

        {
          showAlways: true,
          tickAmount: 5,
          min: 0,
          opposite: true,
          labels: {
            formatter: function (val: number, index: any) {
              return val.toFixed(0);
            }
          },
          title: {
            text: "Energia [kWh]"
          }
        }
        ],
        dataLabels: {
          enabled: true,
          formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {
            return seriesIndex == 0 ? value : (seriesIndex == 1 ? locateFormatPercentNDijitos(value / 100, 0) : locateFormatNumberNDijitos(value, 1))
          },
        },
        tooltip: {
          y: {
            formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {
              return seriesIndex == 0 ? value : (seriesIndex == 1 ? locateFormatPercentNDijitos(value / 100, 0) : locateFormatNumberNDijitos(value, 1))
            },
          }
        }
      },
      series: []
      //  colors: ['#008FFB', '#00E396', '#CED4DC'],

    }
    // asingamos las opciones
    setOpciones(defaultopciones)
    return function cleanUp() {
      //SE DEBE DESTRUIR EL OBJETO CHART
    };
  }, [ClienteSeleccionado]);


  useEffect(() => {

    // consulta la informacion de las alarmas cuando 
    // cambia el ciente seleecionado y las fechas 
    if (ClienteSeleccionado.clienteIdS != 0 && lstSeleccionados.length > 0)
      ConsultarData();
  }, [lstSeleccionados, filtros, eventsSelected])





  // metodo qeu consulta los datos de las alarmasg
  let ConsultarData = () => {

    if (data.length == 0 || isCallData) {
      setIsError(false)
      setIsLoading(true)
      setIsRefetching(true)
      setloader(true)
      GetReporteViajes(moment(filtros.FechaInicial).format(FormatoSerializacionYYYY_MM_DD_HHmmss),
        moment(filtros.FechaFinal).format(FormatoSerializacionYYYY_MM_DD_HHmmss), ClienteSeleccionado.clienteIdS, lstSeleccionados[0])
        .then((response) => {
          //asignamos la informcion consultada 
          setAlarmas(response.data);
          setisCallData(false)

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
    let FechaInicial: Date = filtros.FechaInicial;
    let FechaFinal: Date = filtros.FechaFinal;

    let datosFiltrados: any[] = datos;
    if (filtros.IndGrafica != -1) {
      FechaInicial = moment(filtros.FechaGrafica, FormatoColombiaDDMMYYY).toDate();
      FechaFinal = moment(filtros.FechaGrafica, FormatoColombiaDDMMYYY).toDate();
    }


    // filtramos por las fechas
    datosFiltrados = datosFiltrados.
      filter(f => moment(f.Fecha).toDate() >= FechaInicial && moment(f.Fecha).toDate() <= FechaFinal);

    // filtramos por los vehivulos

    if (filtros.Vehiculos.length > 0) {
      datosFiltrados = datosFiltrados.filter(f => filtros.Vehiculos.indexOf(f.Movil) > -1);
    }

    // agrupa los elementos para ser mostrado por la grafica
    let dataTransformada = new Array()
    // agrupamos por fechas la informacion
    datosFiltrados
      .forEach(
        (m) => {
          dataTransformada = [...dataTransformada, ...JSON.parse(m.Detallado)]


        }
      );

    dataTransformada = dataTransformada.sort((a: any, b: any) => {
      return moment(a.fechaHora).toDate().getTime() - moment(b.fechaHora).toDate().getTime();

    });
    setDataFiltrada(dataTransformada);
    setRowCount(dataTransformada.length); // actualizamos la informacion de las filas


    let DatosGraficaArea: any[] = [...eventsSelected]

    // actualizamos los datos de las series
    dataTransformada.forEach(((f, ind) => {
      let fecha = moment(f.fechaHora).toDate().getTime()
      DatosGraficaArea.filter((filter) => filter.isSelected).forEach((each) => {
        if (ind === 0)
          each.data = [];// se limpia el array de datos para que se puedan agregar los nuevos datos

        each.data.push(each.getData(fecha, f));
      })

    }))

    // funcion que actualiza los datos de las series
    // se debe pasar el id configurado al momento de su creaci'on para poder
    // actializar los datos
    ApexCharts.exec('ebus-graficadearea', 'updateSeries', DatosGraficaArea.filter((filter) => filter.isSelected));
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
      <Typeahead className=" mb-3 "
        id="autocomplete-vehiculos-viajes"
        multiple
        options={lstVehiculos}
        ref={typeaheadRef}
        onChange={(selected: any) => {
          // dejamos los seleccionados
          setisCallData(true);
          setSeleccionados(selected)
          setShowModal(false)
          // Keep the menu open when making multiple selections.
          // typeaheadRef.current?.toggleMenu();
        }}
        placeholder="Escoja un Vehículo...."
      />
    );
  }

  function ConsultaVehiculosClienteSeleccionado(clienteids: number | undefined) {

    getVehiculosCliente((clienteids ?? ClienteSeleccionado.clienteIdS).toString(), 'Available')
      .then((response: AxiosResponse<any>) => {

        let listadoVehiculos = response.data.map((v: any) => {
          return v.description;
        })

        setlstVehiculos(listadoVehiculos);
        setSeleccionados([listadoVehiculos[0]])

        // llenamos la información
      })
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
    <ModuleName>eBus</ModuleName>
    <PageTitle> Gráfica Viajes</PageTitle>
    <BlockUi tag="div" keepInView blocking={loader ?? false}  >

      <div className="card card-rounded shadow-sm mt-2" style={{ width: '100%' }}  >

        <div className="d-flex justify-content-end mt-2">
          <div style={{ float: 'right' }}>
            <CargaListadoClientes />
          </div>
        </div>
      </div>
      <div className="container mb-2 mt-2"
        style={{ width: "100%" }}>
        <Stack>
          <div className="d-flex mx-auto justify-content-between">
            <div className="ms-3 text-center">
              <h3 className="mb-0">Reporte Gráfica Viajes</h3>
              <span className="text-muted m-3 fs-1">{lstSeleccionados[0]}</span>

            </div>
          </div>

        </Stack>


      </div>
      <div className="card bg-secondary d-flex justify-content-between m-1">
        <div className="col-sm-8 col-md-8 col-xs-8 col-lg-8"> <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Fechas: </label>
          {(combine && allowedMaxDays && allowedRange) && (
            <DateRangePicker className="mt-2" format="dd/MM/yyyy" value={[filtros.FechaInicial, filtros.FechaFinal]}
              disabledDate={combine(allowedMaxDays(7), allowedRange(
                moment().add(-6, 'months').startOf('day').toDate(), moment().startOf('day').toDate()
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
          <Button className="m-2  btn btn-sm btn-primary" onClick={() => () => { ConsultarData(); }}><i className="bi-search"></i></Button>

        </div>
        <div className="d-flex justify-content-start  ">
          <Checkbox
            indeterminate={value.length > 0 && value.length < data.length}
            checked={value.length === data.length}
            onChange={handleCheckAll}
          >
            Todos
          </Checkbox>

          <CheckboxGroup inline name="checkboxList" value={value} onChange={handleChange}>
            {eventsSelected.map(item => (
              <Checkbox key={item.name} value={item.name}>
                {item.name}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
      </div>


      {/* begin::Chart */}
      <div className="row mt-2 col-sm-12 col-md-12 col-xs-12 rounded shadow-sm mx-auto">
        {(opciones != null) && (
          <ReactApexChart ref={refChart}
            options={opciones.options}
            series={opciones.series}
            height={400} type="area" />)}
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
          enableStickyFooter
          enableDensityToggle={false}
          enableRowVirtualization
          enableRowNumbers
          enableTableFooter
          tableInstanceRef={tablaAlarmas}
          localization={MRT_Localization_ES}
          muiTableContainerProps={{
            sx: { maxHeight: '400px' }, //give the table a max height

          }}
          displayColumnDefOptions={{
            'mrt-row-actions': {
              muiTableHeadCellProps: {
                align: 'center',
              }

            },
          }}
          muiTableHeadCellProps={{
            sx: (theme) => ({
              fontSize: 14,
              fontStyle: 'bold',
              color: 'rgb(27, 66, 94)'

            }),
          }}
          columns={listadoCampos}
          data={dataFiltrada}

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
          defaultColumn={{
            minSize: 80, //allow columns to get smaller than default
            maxSize: 200, //allow columns to get larger than default
            size: 80, //make columns wider by default
          }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box
              sx={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1, display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
            >

              <button className="m-2 ms-0 btn btn-sm btn-primary" type="button" onClick={() => { DescargarExcel(dataFiltrada, listadoCampos, `GraficaViajes1min ${lstSeleccionados[0]}`) }}>
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
    </Modal>
  </>)
}