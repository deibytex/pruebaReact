import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { GetInformacionOdometro } from "../../data/ReportesData";
import { PageTitle } from "../../../../../_start/layout/core";
import { DateRangePicker, Notification, Placeholder, useToaster } from "rsuite";
import BlockUi from "@availity/block-ui";
import { DescargarExcel } from "../../../../../_start/helpers/components/DescargarExcel";
import MaterialReactTable, { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import { FormatoColombiaDDMMYYY, FormatoSerializacionYYYY_MM_DD_HHmmss } from "../../../../../_start/helpers/Constants";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import DualListBox from "react-dual-listbox";
import { dualList } from "../../../CorreosTx/models/dataModels";
import { Button, Form, Modal } from "react-bootstrap-v5";
import { FiltrosReportes } from "../../models/eBus";
import { ClienteDTO } from "../../models/NivelcargaModels";
import { AxiosResponse } from "axios";
import { GetClientesEsomos } from "../../data/NivelCarga";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { InicioCliente } from "../../../../../_start/helpers/Models/ClienteDTO";
import { locateFormatNumberNDijitos } from "../../../../../_start/helpers/Helper";
import { Box } from "@mui/material";





export default function ReporteComparacionOdometro() {

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
  const tablaAlarmas = useRef<MRT_TableInstance<any>>(null);

  const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente); 
  const [Clientes, setClientes] = useState<ClienteDTO[]>();
  const [filtros, setFiltros] = useState<FiltrosReportes>(Filtros);
  const [loader, setloader] = useState<boolean>(false);
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
  const [columnas, setColumnas] = useState<MRT_ColumnDef<any>[]>([]);
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

    

      return function cleanUp() {
      //SE DEBE DESTRUIR EL OBJETO CHART
    };
  }, [ClienteSeleccionado]);



  useEffect(() => {
    renderDatos();
  }, [columnas])


  useEffect(() => {
    ConsultarDataAlarmas();
  }, [filtros])


 let renderDatos = () => {
   // agrupamos por fechas la informacion
   let agrupadofecha = dataFiltrada
   .reduce((p, c) => {
     let name = moment(c.fecha).format(FormatoColombiaDDMMYYY);        
     let isExists = p.filter((f: string) => f === name);
     if (isExists.length == 0)
       p.push(name);
     
     return p;
   }, []);
  let agrupadoMovil = dataFiltrada
  .reduce((p, c) => {
      let name = c.movil;
      p[name] = p[name] ?? [];
      p[name].push(c);
      return p;
  }, {});
 //TRANSORMAMOS LOS DATOS

 let ArrayMovil: any[] = [];
 Object.entries(agrupadoMovil).forEach((elem:any) => {
  agrupadofecha.forEach((fr: string, index: number) => {

      let name = elem[0];
      let objetomovil = ArrayMovil.filter(f => f.Movil === name);
      // filtramos los datos del movil y la fecha 
      let fechamovil = elem[1].filter((ff: any) => moment(ff.fecha).format(FormatoColombiaDDMMYYY) === fr);
     
      // si no existe creamos el objeto de la fila a guardar
      let rowMovil = (objetomovil.length == 0) ? {} : objetomovil[0];
      rowMovil["Movil"] = name;
      rowMovil[`OdoCan${index + 1}`] = fechamovil.length > 0 ? fechamovil[0].Odometro : 0;
      rowMovil[`OdoFm${index + 1}`] = fechamovil.length > 0 ? fechamovil[0].StartOdometro : 0;
      rowMovil[`Diferencia${index + 1}`] = fechamovil.length > 0 ? fechamovil[0].Diferencia : 0;
      if (objetomovil.length == 0) {
          ArrayMovil.push(rowMovil);
      }
  });
});


setDataFiltrada(ArrayMovil);
setRowCount(ArrayMovil.length); // actualizamos la informacion de las filas
// agrupa los elementos para ser mostrado por la grafica

 }
  // metodo qeu consulta los datos de las alarmasg
  let ConsultarDataAlarmas = () => {

    if (data.length == 0 || isCallData) {
      setIsError(false)
      setIsLoading(true)
      setIsRefetching(true)
      setloader(true)
      GetInformacionOdometro(moment(filtros.FechaInicial).format(FormatoSerializacionYYYY_MM_DD_HHmmss),
        moment(filtros.FechaFinal).format(FormatoSerializacionYYYY_MM_DD_HHmmss), ClienteSeleccionado.clienteIdS)
        .then((response) => {
          //asignamos la informcion consultada 
          setData(response.data);
          setisCallData(false)
          // vamos a llenar la informacion de los movils
          let lstVehiculos = (response.data as any[]).reduce((p, c) => {
            let movil = c["movil"];
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
      filter(f => moment(f.fecha).toDate() >= FechaInicial && moment(f.fecha).toDate() <= FechaFinal);

    // filtramos por los vehivulos

    if (filtros.Vehiculos.length > 0) {
      datosFiltrados = datosFiltrados.filter(f => filtros.Vehiculos.indexOf(f.movil) > -1);
    }
       // agrupamos por fechas la informacion
       let agrupadofecha = datosFiltrados
       .reduce((p, c) => {
         let name = moment(c.fecha).format(FormatoColombiaDDMMYYY);        
         let isExists = p.filter((f: string) => f === name);
         if (isExists.length == 0)
           p.push(name);
         
         return p;
       }, []);
     
          // CONFIGURAMOS LAS COLUMNAS A MOSTRAR EN LA TABLA
    const columnasTabla: MRT_ColumnDef<any>[]
    = [ {
      accessorKey: 'Movil',
      header: 'Movil',
      size: 100,
     
    }];
  
   

      agrupadofecha.forEach((col:string, index: number) => {
        let indexC = index + 1 ;

        columnasTabla.push(
          {
            header : col,
            Header: ({ column }) => <div className="bg-secondary">{column.columnDef.header}</div>,
            columns : [
              {
                accessorKey: `OdoCan${indexC}`,
                header: 'Odo Can',
                Cell({ cell, column, row, table, }) {
                  return (locateFormatNumberNDijitos(row.original[`OdoCan${indexC}`] ?? 0, 2))
                }
              },
              {
                accessorKey: `OdoFm${indexC}`,
                header: 'Odo Fm',
                Cell({ cell, column, row, table, }) {
                  return (locateFormatNumberNDijitos(row.original[`OdoFm${indexC}`] ?? 0, 2))
                }
              },
              {
                accessorKey: `Diferencia${indexC}`,
                header: 'Dif(km)',
                Cell({ cell, column, row, table, }) {
                  let diferencia = row.original[`Diferencia${indexC}`] ?? 0;
                  let render = (diferencia <= -5 || diferencia >= 5) ? 
                  <span className="text-danger fs">{locateFormatNumberNDijitos(diferencia, 2)}</span> : 
                  <span >{locateFormatNumberNDijitos(diferencia, 2)}</span>;
                  return (render)
                }
              }
            ]

          }
          );
    });
    setDataFiltrada(datosFiltrados);
    setColumnas(columnasTabla);
   



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
    <PageTitle>Reporte Comparación Odómetro</PageTitle>
    <BlockUi tag="div" keepInView blocking={loader ?? false}  >

      <div className="card card-rounded shadow mt-2" style={{ width: '100%' }}  >
       
        <div className="d-flex justify-content-end mt-2">
            <div style={{ float: 'right' }}>
              <CargaListadoClientes />
            </div>
          </div>
          <div className="d-flex justify-content-between mb-2">
          <div className="mx-auto">
              <div className="ms-3 text-center">
                <h3 className="mb-0">Comparación Odometro</h3>
                <span className="text-muted m-3">Diferencia por día</span>

              </div>
            </div>
            </div>
          
            <div className="card bg-secondary d-flex justify-content-between m-1">
          
              <div className="col-sm-8 col-md-8 col-xs-8 col-lg-8"> <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Fecha inicial: </label>
                {(combine && allowedMaxDays && allowedRange) && (
                  <DateRangePicker className="mt-2" format="dd/MM/yyyy" value={[filtros.FechaInicial, filtros.FechaFinal]}
                    disabledDate={combine(allowedMaxDays(15), allowedRange(
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
     
   
      <div className="row mt-2 col-sm-12 col-md-12 col-xs-12 rounded shadow-sm mx-auto">
    
        <MaterialReactTable
          enableFilters={false}
          initialState={{ density: 'compact',columnPinning: { left: ['Movil'] }  }}
          enableColumnOrdering
          enableColumnDragging={false}
          enablePagination={false}
          enableStickyHeader
          enableDensityToggle = {false}
          enableRowVirtualization 
          enablePinning
        
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
            minSize: 120, //allow columns to get smaller than default
            maxSize: 400, //allow columns to get larger than default
            size: 120, //make columns wider by default
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
          enableTableFooter      
          columns={columnas}
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
              
                <button className="m-2 ms-0 btn btn-sm btn-primary" type="button" onClick={() => { DescargarExcel(dataFiltrada, columnas, "Reporte compare odometro") }}>
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