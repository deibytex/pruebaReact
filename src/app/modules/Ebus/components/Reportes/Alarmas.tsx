
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDataReportes } from "../../core/ReportesProvider";
import { GetReporteAlarmas, ValidarFechas } from "../../data/ReportesData";
import { PageTitle } from "../../../../../_start/layout/core";
import { DateRangePicker, Notification, Placeholder, useToaster } from "rsuite";
import BlockUi from "@availity/block-ui";
import { DescargarExcel } from "../../../../../_start/helpers/components/DescargarExcel";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { FormatoColombiaDDMMYYY, FormatoColombiaDDMMYYYHHmmss, FormatoSerializacionYYYY_MM_DD_HHmmss } from "../../../../../_start/helpers/Constants";
import { BaseReportes } from "../../Reportes";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import DualListBox from "react-dual-listbox";
import { dualList } from "../../../CorreosTx/models/dataModels";
import { Button, Modal } from "react-bootstrap-v5";
import ReactApexChart from "react-apexcharts";
import { DateRange } from "rsuite/esm/DateRangePicker";
import { FiltrosReportes } from "../../models/eBus";

export default function ReporteAlarmas() {

  let Filtros : FiltrosReportes = {
    FechaInicialInicial: moment().add(-7, 'days').toDate(),
    FechaFinalInicial: moment().toDate(),
    FechaInicial: moment().add(-7, 'days').toDate(),
    FechaFinal: moment().toDate(),
    IndGrafica: -1,
    FechaGrafica : null,
    Vehiculos: [],
    Operadores: null
  }

  const { allowedMaxDays, allowedRange } = DateRangePicker;


  const refChart = useRef<ReactApexChart>(null);
  const { ClienteSeleccionado, setClienteSeleccionado, Clientes } = useDataReportes();
  const [filtros, setFiltros] = useState<FiltrosReportes >(Filtros);
  const [loader, setloader] = useState<boolean>(false);


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

  // useefet que se ejecuta la primera vez, cuando el cliente es seleccionado 
  useEffect(() => {
    // consulta la informacion de las alarmas cuando 
    // cambia el ciente seleecionado y las fechas 
    if (ClienteSeleccionado === undefined && Clientes !== undefined)
      setClienteSeleccionado(Clientes[0])


    ConsultarDataAlarmas();
    if(allowedMaxDays)
     allowedMaxDays(7);

     if(allowedRange)
     allowedRange(moment().add(-6, "months").toDate(), moment().toDate());
    return function cleanUp() {
      //SE DEBE DESTRUIR EL OBJETO CHART
    };
  }, []);
  // metodo qeu consulta los datos de las alarmas
  const ConsultarDataAlarmas = () => {
    let cliente = "";
    if (ClienteSeleccionado === undefined && Clientes !== undefined)
      cliente = Clientes[0].clienteIdS.toString();
     console.log('dataalarmas', dataAlarmas)
    if (dataAlarmas.length == 0 || ValidarFechas(filtros, setFiltros)) {


      setIsError(false)
      setIsLoading(true)
      setIsRefetching(true)
      setloader(true)
      GetReporteAlarmas("914", moment(filtros.FechaInicial).format(FormatoSerializacionYYYY_MM_DD_HHmmss),
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
        })

    }
    else
    datosfiltrados(dataAlarmas)

  }
  let datosfiltrados = (datos: any[]) => {
    console.log("datos filtrados");

    let FechaInicial:Date = Filtros.FechaInicial;
    let FechaFinal : Date = Filtros.FechaFinal; 

    let datosFiltrados : any[] = datos;
    setDataAlarmasFiltrada(datosFiltrados);
   

      if(filtros.IndGrafica != -1)
      {
        FechaInicial = moment(filtros.FechaGrafica, FormatoColombiaDDMMYYY).toDate();
        FechaFinal =  moment(filtros.FechaGrafica, FormatoColombiaDDMMYYY).toDate();        
      }
      // filtramos por las fechas
    //  datosFiltrados = datosFiltrados.filter( f=> moment(f.Fecha).toDate() >= FechaInicial && moment(f.Fecha).toDate() <= FechaInicial);

      // filtramos por los vehivulos

      if(filtros.Vehiculos.length > 0)
      {
        datosFiltrados = datosFiltrados.filter( f=> filtros.Vehiculos.indexOf(f.Movil) > -1 );
      }
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

        console.log(agrupadofecha)
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

     

      let defaultopciones = {
        options: {
          chart: {
            id: 'apexchart-example',
            events: {
              dataPointSelection: function (event: any, chartContext: any, config: any) {
                // seleccionamos el index de la grafica para posteriormente filtrar
                const fechaSeleccionada : string = labels[config.seriesIndex];
                if(filtros.IndGrafica > -1 && filtros.FechaGrafica ===fechaSeleccionada) 
                setFiltros({
                  ...filtros,
                  IndGrafica: -1,
                  FechaGrafica : null
                });
                else
                setFiltros({
                  ...filtros,
                  IndGrafica: config.seriesIndex,
                  FechaGrafica : labels[config.seriesIndex]
                });
                ConsultarDataAlarmas();
              }
            }
          },
          xaxis: {
            categories: labels
          }
        },
        series: [{
          name: 'EV: Alarma Cambio Pastillas Disco Frenos',
          data: totalPastillas
        },
        {
          name: 'EV: Alarma Temperatura Celda Batería > 45°C',
          data: totalTemperatura
        }],
        dataLabels: {
          enabled: true
        }
      }
      // asingamos las opciones
      setOpciones(defaultopciones)
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


  return (<>
    <PageTitle>Reporte Alarmas</PageTitle>
    <BlockUi tag="div" keepInView blocking={loader ?? false}  >

      <BaseReportes>
        <div className="card card-rounded bg-transparent " style={{ width: '100%' }}  >

          <div className="row  col-sm-12 col-md-12 col-xs-12 rounded shadow-sm mt-2 bg-secondary  text-primary" style={{ width: '100%' }} >
            <h3 className="card-title fs-4 m-0 ms-2"> Filtros</h3>
            <div className="col-sm-6 col-md-6 col-xs-6 d-flex justify-content-start">
              <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Fecha inicial: </label>

              <DateRangePicker className="mt-2" format="dd/MM/yyyy" value={[filtros.FechaInicial, filtros.FechaFinal]}
                onChange={(value, e) => {
                  if (value !== null) {
                    setFiltros({
                      ...filtros,
                      FechaInicial: value[0],
                      FechaFinal: value[1]
                    });
                  }
                }} />

              <button className="m-2  btn btn-sm btn-primary" title="Consultar" type="button" onClick={() => { ConsultarDataAlarmas() }}><i className="bi-search"></i></button>

            </div>

            <div className="col-sm-6 col-md-6 col-xs-6 d-flex justify-content-end">
              <button className="m-2 btn btn-sm btn-primary" title="Consultar" type="button" onClick={() => { setShowModal(true) }}>
                <i className="bi-car-front-fill"></i></button>

              <button className="m-2 ms-0 btn btn-sm btn-primary" title="Consultar" type="button" onClick={() => { DescargarExcel(dataAlarmasFiltrada, listadoCampos, "Reporte Alarmas") }}>
                <i className="bi-file-earmark-excel"></i></button>

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
      </BaseReportes>
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
        <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setSeleccionados([]); }}>
          Cancelar
        </Button>
        <Button type="button" variant="primary" onClick={() => { setShowModal(false); }}>
          Filtrar
        </Button>
      </Modal.Footer>
    </Modal>
  </>)
}