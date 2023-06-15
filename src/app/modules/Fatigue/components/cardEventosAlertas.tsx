import { Button, Card, Form, Modal, Tab, Tabs } from "react-bootstrap-v5";

import Moment from 'moment';
import { useEffect, useState } from "react";

import { useDataFatigue } from "../core/provider";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import MaterialReactTable, { MaterialReactTableProps, MRT_Cell, MRT_ColumnDef, MRT_Row } from 'material-react-table';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { ManageSearch, Message, VerifiedUser, Map } from "@mui/icons-material";
import { FechaServidor } from "../../../../_start/helpers/Helper";
import { getAlertas, setGestor, setObservaciones } from "../data/dashBoardData";
import confirmarDialog, { errorDialog, successDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { useSelector } from "react-redux";
import { RootState } from "../../../../setup";
import { UserModelSyscaf } from "../../auth/models/UserModel";
import moment from "moment";
type Props = {

  isActive: boolean;
  isDetails: boolean;

}

const CardContainerAlertas: React.FC<Props> = ({ isActive, isDetails }) => {

  const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
  );

  const model = (isAuthorized as UserModelSyscaf);


  const { alertas, setalertas, setUserId, UserId,setDataDetalladoFiltrado, setFiltrado, setActiveTab, activeTab,  loader, setloader  } = useDataFatigue();

  const [dataAlertas, setDataAlertas] = useState([]);
  const [dataDetalleGestion, setdataDetalleGestion] = useState([]);
  const [obervacionGestion, setobervacionGestion] = useState("");

  const [FechaApertura, setFechaApertura] = useState("");
  const [FechaGestion, setFechaGestion] = useState("");

  const [observaciones, setobservaciones] = useState("");
  const [alertaId, setalertaId] = useState(0);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const showModal = () => {
    setShow(true);
  }

  const [Data, setData] = useState<any[]>([]);
  const [esgestionado, setesgestionado] = useState(false);

  const [DataLastGestion, setDataLastGestion] = useState<any[]>([]);


  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [rowCount2, setRowCount2] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  useEffect(() => {
    setDataAlertas(alertas);
    setRowCount(alertas.length);
    console.log(alertas);
  }, [alertas])

  useEffect(() => {
    setUserId(model.Id?.toString())
  }, [])



  console.log(document.querySelectorAll("p > div"));
  // funcion para cambiar el estado
  // de ver detalles para que se renderice el tab de ver mas
  function setDetails(id: number) {

    let datafiltrada = dataAlertas.map((item: any) => {
      if (item.AlertaId == id)
        return { ...item, esVisibleTabs: !item["esVisibleTabs"] };
      return item;
    });
    setDataAlertas(datafiltrada as any);

  }

  // gestiona las alertas generadas en el sistyema
  // function setGestionar(id: number) {

  //     // colocar su url axiox aqui
  //     let datafiltrada = dataAlertas.map((item: any) => {
  //         if (item.AlertaId == id)
  //             return { ...item, EsGestionado: 1 };
  //         return item;
  //     });
  //     setDataAlertas(datafiltrada);

  // }

  const columnasTabla: MRT_ColumnDef<any>[]
    = [
      {
        accessorKey: 'TipoAlerta',
        header: 'Alarma',
        size: 250
      },
      {
        accessorKey: 'vehiculo',
        header: 'Vehículo',

        size: 250
      },
      {
        accessorKey: 'conductor',
        header: 'Conductor',
        size: 100
      }, {
        accessorKey: 'EventDateTime',
        header: 'Fecha evento',
        Cell({ cell, column, row, table, }) {

          return (
            <>
              {
                Moment(row.original.EventDateTime).format('DD/MM/YYYY HH:mm:ss')
              }
            </>

          )
        },
        size: 80
      }, {
        accessorKey: 'DetalladoEventos',
        header: 'Cantidad eventos',
        size: 80,
        Cell({ cell, column, row, table, }) {

          return (
            <>
              {
                JSON.parse(row.original.DetalladoEventos).length
              }
            </>

          )
        },
      }, {
        accessorKey: 'EstadoGestion',
        header: 'Estado',
        size: 80,
        Cell({ cell, column, row, table, }) {
          return (cell.getValue() == null) ? <span className="badge bg-danger">No Gestionado</span>
            : (cell.getValue() == true) ? <span className="badge bg-primary">Gestionado</span>
              : (cell.getValue() == false) ? <span className="badge bg-primary">En gestion</span>
                : <span>{row.original.EstadoGestion}</span>
        },
      }, {
        accessorKey: 'gestor',
        header: 'Analista',
        size: 80,
        Cell({ cell, column, row, table, }) {
          return (cell.getValue() == null) ? <span>Sin Analista</span> : <span>{row.original.gestor}</span>
        },
      }

    ];

  const columnasTablaDetalle: MRT_ColumnDef<any>[]
    = [
      {
        accessorKey: 'fecha',
        header: 'Fecha',
        size: 250
      },
      {
        accessorKey: 'descripcion',
        header: 'Descripción',

        size: 250
      },
      {
        accessorKey: 'recursos',
        header: 'Recursos',
        size: 100
      }

    ];

  const columnasContacto: MRT_ColumnDef<any>[]
    = [
      {
        accessorKey: 'tipo',
        header: 'Tipo'
      },
      {
        accessorKey: 'nombre',
        header: 'Nombre',

        size: 250
      },
      {
        accessorKey: 'numerocontacto',
        header: 'Número Contacto',
        size: 100
      },
      {
        accessorKey: 'correocontacto',
        header: 'Email',
        size: 100
      }

    ];

  let listadoCampos: MRT_ColumnDef<any>[] =

    [
      {
        accessorKey: 'fechagestion',
        header: 'Fecha',
        size: 100,
        Cell({ cell, column, row, table, }) {
          return (moment(cell.getValue() as Date).format('DD/MM/YYYY HH:mm:ss'))
        }
      },
      {
        accessorKey: 'value',
        header: 'Observaciones',
        size: 100
      }

    ];

  function FechaAperturaControl() {
    return (

      <Form.Control className=" mb-3 col-3" value={FechaApertura} type="date" name="fechaini" placeholder="Seleccione una fecha" disabled />

    )
  }

  function FechaGestionControl() {
    return (
      <Form.Control className=" mb-3 sm" value={FechaGestion} type="date" name="fechaini" placeholder="Seleccione una fecha" disabled />
    )
  }

  useEffect(() => {

    if (observaciones != "" && observaciones != null) {
      let json = JSON.parse(observaciones);
      setData(json);
      setRowCount(json.length);
    }
    else {
      setData([]);
      setRowCount(0);
    }
  }, [observaciones])

  const getobservacion = (e: any) => {
    setobervacionGestion(e.target.value)
  };


  //revisar
  const setObservacion = (observacion: string, escerrado?: string) => {

    let GestorObervaciones: any = {};

    GestorObervaciones = {
      AlertaId: alertaId,
      fechaapertura: Data[0].fechaapertura,
      fechagestion: FechaServidor,
      value: observacion,
      EsCerrado: escerrado?.toString()

    };


    confirmarDialog(() => {
      setObservaciones(JSON.stringify(GestorObervaciones)).then((response) => {
        successDialog("Operación Éxitosa", "");
        setData([...Data, JSON.parse(JSON.stringify(GestorObervaciones))] as any[]);
        setobervacionGestion("");
        if (escerrado == "true") {
          getAlertas().then((response) => {
            setalertas(response.data);
            handleClose();
          });
        }



      }).catch((error) => {
        errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
      });
    }, escerrado == "false" ? `Esta seguro que desea agregar el comentario` : `Esta seguro que terminar la gestión`
      , escerrado == "false" ? "Guardar" : "Terminar")
  }

  const setGestorPreoperacional = (alertaId: number) => {

    let GestorObervaciones: any = {};
    GestorObervaciones = {
      fechaapertura: FechaServidor,
      fechagestion: FechaServidor,
      value: "Gestor Asignado",
      EsCerrado: null
    };

    confirmarDialog(() => {

      setGestor(UserId as string, '[' + JSON.stringify(GestorObervaciones) + ']', false, alertaId, model.Nombres).then(() => {
        getAlertas().then(
          (response) => {

            setalertas(response.data)

          });
        successDialog("Operación Éxitosa.", "");
      }).catch(() => {
        errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
      });
    }, `Desea usted gestionar esta alerta`, "Sí");
  }


  const modalObervaciones = (Obervaciones: string, alertaId: number, EsGestionado: boolean) => {
    setobservaciones(Obervaciones);
    setalertaId(alertaId);
    setesgestionado(EsGestionado);
    showModal();
  }

  const IrToMap = (row: any) => {
    setloader(true);
      let Data  = new Array()
      Data = [...Data, ...JSON.parse(row.original.DetalladoEventos)]
      setDataDetalladoFiltrado(Data);
      setFiltrado(true)
      console.log(row);
      setActiveTab('#tab2');
  };

  return (

    <>
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
        columns={columnasTabla}
        data={alertas}
        muiTableBodyRowProps={({ row }) => ({

          sx: {

            backgroundColor:
              row.original.Criticidad === 'Riesgo alto' ? 'rgba(248, 215, 218, 1)' :
                row.original.Criticidad === 'Riesgo moderado' ? 'rgba(255, 243, 205, 1)' :
                  row.original.Criticidad === 'Riesgo bajo' ? 'rgba(212, 237, 218, 1)' :
                    'rgba(255, 243, 205, 1)'
          }
        })}
        //editingMode="modal" //default         
        enableTopToolbar
        enableColumnOrdering
        enableEditing
        //  onEditingRowSave={handleSaveRowEdits}
        // onEditingRowCancel={handleCancelRowEdits}
        enableFilters
        enableColumnFilters={false}
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
        renderRowActions={({ row, table }) => (

          <Box sx={{ display: 'flex', gap: '1rem' }}>

            <Tooltip arrow placement="left" title="Editar">
              <IconButton onClick={() => {
                modalObervaciones(row.original.Observaciones, row.original.AlertaId, row.original.EstadoGestion);
              }}>
                <Message />
              </IconButton>
            </Tooltip>

            {(row.original.EstadoGestion == null) ?

              <Tooltip arrow placement="left" title="Gestionar">
                <IconButton
                  onClick={() => {
                    setGestorPreoperacional(row.original.AlertaId);
                  }}
                >
                  <VerifiedUser />
                </IconButton>
              </Tooltip>
              : <></>
            }
            {/* Para el mapa  Marcial*/}
            <Tooltip arrow placement="top" title="Ver en el mapa">
              <IconButton onClick={(e: any) => {
                IrToMap(row);
              }} >
                <Map />
              </IconButton>
            </Tooltip>
          </Box>
        )
        }



        renderDetailPanel={({ row }) => (
          <Tabs
            defaultActiveKey="gestion"
            className="mb-3 border"
            justify
          >
            <Tab eventKey="gestion" title={`Informacion Básica`}>

              <Box
                sx={{
                  display: 'grid',
                  margin: 'auto',
                  gridTemplateColumns: '1fr 1fr',
                  width: '120%',
                }}
              >
                <Card>
                  <Card.Body>
                    <Card.Title>Información Gestión</Card.Title>
                    <Card.Text>

                      <span>Fecha Apertura:</span>
                      {/* <div className="mb-3 row">
                        <div className="col-3"> */}

                      <FechaAperturaControl />
                      {/* </div>
                      </div> */}

                    </Card.Text>
                    <Card.Text>

                      <span>Ultima Gestión:</span>
                      {/* <div className="mb-3 row">
                        <div className="col-3"> */}
                      <FechaGestionControl />
                      {/* </div>
                      </div> */}

                    </Card.Text>
                    <Card.Text>
                      <textarea className="form-control  input input-sm " id={'obervacion'} onChange={getobservacion} rows={3} value={obervacionGestion}></textarea>
                    </Card.Text>
                    {/* <Button variant="primary">Adicionar Gestión</Button> */}
                  </Card.Body>
                </Card>
              </Box>
            </Tab>
            <Tab eventKey="DetalleGestion" title="Detalle Gestión">
              <Box
                sx={{
                  display: 'grid',
                  margin: 'auto',
                  gridTemplateColumns: '1fr 1fr',
                  width: '140%'
                }}
              >
                <div>
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
                    columns={columnasTablaDetalle}
                    data={dataDetalleGestion}
                    // editingMode="modal" //default         
                    enableTopToolbar={false}
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
              </Box>
            </Tab>
            <Tab eventKey="Contacto" title={`Información de contacto`}>
              <Box
                sx={{
                  display: 'grid',
                  margin: 'auto',
                  gridTemplateColumns: '1fr 1fr',
                  width: '140%'
                }}

              >
                <div>

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
                    columns={columnasContacto}
                    data={dataDetalleGestion}
                    // editingMode="modal" //default         
                    enableTopToolbar={false}
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

              </Box>
            </Tab>
          </Tabs>

        )}
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

      <Modal
        show={show}
        onHide={handleClose}
        size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{'Gestionar'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
              <div className="">
                <label className="control-label label-sm font-weight-bold" htmlFor="comentario" style={{ fontWeight: 'bold' }}>Adicionar Comentario:</label>
                <textarea className="form-control  input input-sm " id={'obervacionueva'} onChange={getobservacion} rows={3} value={obervacionGestion}></textarea>
              </div>
            </div>
          </div>
          <p></p>
          <div className="row">
            <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
              <Button type="button" variant="primary" onClick={() => {
                setObservacion(obervacionGestion, 'false');
              }}>
                Guardar
              </Button>
            </div>
            <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
              {esgestionado == false ? <Button type="button" variant="danger" onClick={() => {
                setObservacion('Cierre Gestión', 'true');
              }}>
                Cerrar Gestion
              </Button> : <></>}
            </div>
          </div>

        </Modal.Body>
        <Modal.Body>
          <div>
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
              columns={listadoCampos}
              data={Data}
              // editingMode="modal" //default         
              enableTopToolbar={false}
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
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export { CardContainerAlertas as CardContainerEventos }


