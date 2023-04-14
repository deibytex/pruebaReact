import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDataReportes } from "../../core/ReportesProvider";
import { GetReporteAlarmas } from "../../data/ReportesData";
import { PageTitle } from "../../../../../_start/layout/core";
import { DateRangePicker, Notification, Placeholder, useToaster } from "rsuite";
import BlockUi from "@availity/block-ui";
import { DescargarExcel } from "../../../../../_start/helpers/components/DescargarExcel";
import MaterialReactTable, { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import { FormatoColombiaDDMMYYY, FormatoColombiaDDMMYYYHHmmss, FormatoSerializacionYYYY_MM_DD_HHmmss } from "../../../../../_start/helpers/Constants";
import { BaseReportes } from "../../Reportes";
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
import { InicioCliente } from "../../models/NivelcargaModels";


export default function ReporteAlarmas() {

  let Filtros: FiltrosReportes = {
    FechaInicialInicial: moment().add(-7, 'days').startOf('day').toDate(),
    FechaFinalInicial: moment().startOf('day').toDate(),
    FechaInicial: moment().startOf('day').add(-7, 'days').toDate(),
    FechaFinal: moment().startOf('day').toDate(),
    IndGrafica: -1,
    FechaGrafica: "",
    Vehiculos: [],
    Operadores: null
  }

  const { allowedMaxDays, allowedRange } = DateRangePicker;


  const refChart = useRef<ReactApexChart>(null);
  const tablaAlarmas = useRef<MRT_TableInstance<any>>(null);

  const [ ClienteSeleccionado,  setClienteSeleccionado ] =useState<ClienteDTO>(InicioCliente);
    const [Clientes, setClientes] = useState<ClienteDTO[]>();
  const [filtros, setFiltros] = useState<FiltrosReportes>(Filtros);
  const [loader, setloader] = useState<boolean>(false);
  const [lablesAxisx, setlablesAxisx] = useState<string[]>([]);
  const [idxSeleccionado, setidxSeleccionado] = useState<number>(-2);
  const [isCallData, setisCallData] = useState<boolean>(false);


  const [dataAlarmas, setDataAlarmas] = useState<any[]>([]);
  const [dataAlarmasFiltrada, setDataAlarmasFiltrada] = useState<any[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [lstVehiculos, setlstVehiculos] = useState<dualList[]>([]);
  const [lstSeleccionados, setSeleccionados] = useState<string[]>([]);
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
        accessorKey: 'Movil',
        header: 'Móvil',
        size: 100
      },
      {
        accessorKey: 'Fecha',
        header: 'Fecha',

        Cell({ cell, column, row, table, }) {
          return (moment(row.original.Fecha).format(FormatoColombiaDDMMYYY))
        }
      }, {
        accessorKey: 'Inicio',
        header: 'Inicio',
        Cell({ cell, column, row, table, }) {
          return (moment(row.original.Inicio).format(FormatoColombiaDDMMYYYHHmmss))
        }
      }, {
        accessorKey: 'Descripcion',
        header: 'Descripción',
        size: 200
      }, {
        accessorKey: 'DuracionHora',
        header: 'Duración [h]',
        Cell({ cell, column, row, table, }) {
          return (row.original.DuracionHora.toFixed(2))
        }
      }

    ];

   
    useEffect(
        () => {
            GetClientesEsomos().then((response:AxiosResponse<any>) =>{
                setClientes(response.data);
                setClienteSeleccionado(response.data[0])
             
            }).catch((error) =>{
                console.log(error);
                errorDialog("<i>Eror al consultar los clientes</i>","")
            })

         
        }, []
    )

  // useefet que se ejecuta la primera vez, cuando el cliente es seleccionado 
  useEffect(() => {

    // consulta la informacion de las alarmas cuando 
    // cambia el ciente seleecionado y las fechas 
    if (ClienteSeleccionado.clienteIdS != 0 )
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
        }
      },
      series: [],
      dataLabels: {
        enabled: true
      }
    }
    // asingamos las opciones
    setOpciones(defaultopciones)

    if (allowedMaxDays)
      allowedMaxDays(7);

    if (allowedRange)
      allowedRange(moment().add(-6, "months").toDate(), moment().toDate());
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

    if (dataAlarmas.length == 0 || isCallData) {
      setIsError(false)
      setIsLoading(true)
      setIsRefetching(true)
      setloader(true)
      GetReporteAlarmas(ClienteSeleccionado.clienteIdS.toString(), moment(filtros.FechaInicial).format(FormatoSerializacionYYYY_MM_DD_HHmmss),
        moment(filtros.FechaFinal).format(FormatoSerializacionYYYY_MM_DD_HHmmss))
        .then((response) => {
          //asignamos la informcion consultada 
          setDataAlarmas(response.data);

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
      datosfiltrados(dataAlarmas)

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
      filter(f => moment(f.Fecha).toDate() >= FechaInicial && moment(f.Fecha).toDate() <= FechaFinal);

    // filtramos por los vehivulos

    if (filtros.Vehiculos.length > 0) {
      datosFiltrados = datosFiltrados.filter(f => filtros.Vehiculos.indexOf(f.Movil) > -1);
    }
    setDataAlarmasFiltrada(datosFiltrados);
    setRowCount(datosFiltrados.length); // actualizamos la informacion de las filas
    // agrupa los elementos para ser mostrado por la grafica
    let totalPastillas = new Array();
    let totalTemperatura = new Array();
    let labels = new Array();
    // agrupamos por fechas la informacion
    let agrupadofecha = datosFiltrados
      .reduce((p, c) => {
        let name = moment(c.Fecha).format(FormatoColombiaDDMMYYY);
        p[name] = p[name] ?? [];
        p[name].push(c);
        return p;
      }, {});


    Object.entries(agrupadofecha).map((elem: any) => {
      labels.push(elem[0]);
      // agrupamos por descripcion para saber el total de alarmas por cada uno 
      let agrupadoDescripcion = elem[1].reduce((p: any, c: any) => {
        let name = c['Descripcion'];
        if (!p.hasOwnProperty(name)) {
          p[name] = 0;
        }
        p[name]++;
        return p;
      }, {});
      //tomamos la cantidad por descripcion
      let ttPastillas = agrupadoDescripcion["EV: Alarma Cambio Pastillas Disco Frenos"];
      let ttTemperatura = agrupadoDescripcion["EV: Alarma Temperatura Celda Batería > 45°C"]

      totalPastillas.push(ttPastillas ?? 0);
      totalTemperatura.push(ttTemperatura ?? 0);
      setlablesAxisx(labels)
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
      ApexCharts.exec('apexchart-example', 'updateSeries', [{
        name: 'EV: Alarma Cambio Pastillas Disco Frenos',
        data: totalPastillas
      },
      {
        name: 'EV: Alarma Temperatura Celda Batería > 45°C',
        data: totalTemperatura
      }]);


    });


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
    setFiltros({ ...filtros, FechaInicial, FechaFinal, FechaInicialInicial, FechaFinalInicial , IndGrafica: -1, FechaGrafica: ""})

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
  function CargaListadoClientes( ) {
    return (           
            <Form.Select   className=" mb-3 " onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                let lstClientes =  Clientes?.filter((value:any, index:any) => {
                    return value.clienteIdS === Number.parseInt(e.currentTarget.value)
                })  
                if(lstClientes !== undefined && lstClientes.length > 0)
                    setClienteSeleccionado(lstClientes[0]);
            }} aria-label="Default select example"  defaultValue={ClienteSeleccionado?.clienteIdS}>
              
                {                        
                    Clientes?.map((element:any,i:any) => {
                          
                        return (<option key={element.clienteIdS}   value={(element.clienteIdS != null ? element.clienteIdS:0)}>{element.clienteNombre}</option>)
                    })
                }
            </Form.Select>               
    );
  }


  return (<>
    <PageTitle>Reporte Alarmas</PageTitle>
    <BlockUi tag="div" keepInView blocking={loader ?? false}  >  

        <div className="card card-rounded bg-transparent " style={{ width: '100%' }}  >
          <div className="row  col-sm-12 col-md-12 col-xs-12 rounded border  mt-1 mb-2 shadow-sm "  style={{width:'100%'}}  >
           
               
                <div className="col-sm-12 col-md-12 col-xs-12">
                    <div  style={{float:'right'}}>
                    <CargaListadoClientes/>
                    </div>
                </div>
                
            </div>
          <Card className="bg-secondary  text-primary m-0">            
            <Card.Body className="m-0">
            <h3 className="fs-4 m-2 ms-2 d-flex justify-content-center"> Filtros</h3>
              <div className="row">
                <div className="col-sm-8 col-md-8 col-xs-8 col-lg-8"> <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Fecha inicial: </label>
                  <DateRangePicker className="mt-2" format="dd/MM/yyyy" value={[filtros.FechaInicial, filtros.FechaFinal]}
                    onChange={(value, e) => {
                      if (value !== null) {
                        ValidarFechas(
                          [value[0],
                          value[1]]
                        );
                      }
                    }} />

                  <Button className="m-2  btn btn-sm btn-primary" onClick={() => { setShowModal(true) }}><i className="bi-car-front-fill"></i></Button>
                  <Button className="m-2  btn btn-sm btn-primary" onClick={() => { ConsultarDataAlarmas() }}><i className="bi-search"></i></Button>
                  </div>
                <div className="col-sm-4 col-md-4 col-xs-4 col-lg-4 d-flex justify-content-end">
                  <button className="m-2 ms-0 btn btn-sm btn-primary" type="button" onClick={() => { DescargarExcel(dataAlarmasFiltrada, listadoCampos, "Reporte Alarmas") }}>
                    <i className="bi-file-earmark-excel"></i></button>
                </div>
              </div>


            </Card.Body>
          </Card>

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
            tableInstanceRef={tablaAlarmas}
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
            columns={listadoCampos}
            data={dataAlarmasFiltrada}
            // editingMode="modal" //default         
            // enableTopToolbar={false}
            enableColumnOrdering
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