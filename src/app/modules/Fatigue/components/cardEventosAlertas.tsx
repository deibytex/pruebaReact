import { Button, Card, Form, Modal, Tab, Tabs } from "react-bootstrap-v5";


import { useEffect, useState } from "react";

import { useDataFatigue } from "../core/provider";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import MaterialReactTable, { MaterialReactTableProps, MRT_Cell, MRT_ColumnDef, MRT_Row } from 'material-react-table';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

import { Box, IconButton, Tooltip } from "@mui/material";
import { Message, VerifiedUser, Map, List } from "@mui/icons-material";
import { FechaServidor } from "../../../../_start/helpers/Helper";
import { getAlertas, setGestor, setObservaciones } from "../data/dashBoardData";
import confirmarDialog, { errorDialog, successDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { useSelector } from "react-redux";
import { RootState } from "../../../../setup";
import { UserModelSyscaf } from "../../auth/models/UserModel";
import moment from "moment";
import { CheckboxGroup, Checkbox, useToaster, Notification } from "rsuite";
import { FormatoColombiaDDMMYYYHHmmss } from "../../../../_start/helpers/Constants";
type Props = {

  isActive: boolean;
  isDetails: boolean;

}

const CardContainerAlertas: React.FC<Props> = ({ isActive, isDetails }) => {

  const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
  );

  const model = (isAuthorized as UserModelSyscaf);


  const { alertas, UserId, setalertas, setUserId, setDataDetalladoFiltrado, setFiltrado, setActiveTab, setloader } = useDataFatigue();

  const [dataAlertas, setDataAlertas] = useState([]);
  const [dataAlertasfiltrada, setDataAlertasfiltrada] = useState([]);
  const [dataContacto, setdataContacto] = useState([]);
  const [obervacionGestion, setobervacionGestion] = useState("");
  const [obervacionGestionlast, setobervacionGestionlast] = useState("");

  const [FechaApertura, setFechaApertura] = useState("n/a");
  const [FechaGestion, setFechaGestion] = useState("n/a");

  const [observaciones, setobservaciones] = useState("");
  const [detalleEventos, setdetalleEventos] = useState("");
  const [alertaId, setalertaId] = useState(0);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const showModal = () => {
    setShow(true);
  }

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => {
    setShow2(false);
  };
  const showModal2 = () => {
    setShow2(true);
  }

  const [Data, setData] = useState<any[]>([]);
  const [esgestionado, setesgestionado] = useState(false);
  const [Placa, setPlaca] = useState("");
  const [Alerta, setAlerta] = useState("");

  const [DataDetalleEventos, setDataDetalleEventos] = useState<any[]>([]);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [rowCount2, setRowCount2] = useState(0);
  const [rowCount3, setRowCount3] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [FiltroRiesgo, setFiltroRiesgo] = useState("");
  const [FiltroGestion, setFiltroGestion] = useState("");
  const [check, setcheck] = useState(true);
  const [check2, setcheck2] = useState(true);
  const [Orden, setOrden] = useState("");

  const toaster = useToaster();

  const message = (type: any, titulo: string, mensaje: React.ReactNode) => {
    return (<Notification className="bg-light-danger" type={type} header={titulo}
      closable duration={10000}>
      {mensaje}
    </Notification>)
  }

  const defaultRiesgoSelected: any[] = [
    {
      name: 'Alto',
      valor: 'Riesgo alto',
      isSelected: false
    },
    {
      name: 'Moderado',
      valor: 'Riesgo moderado',
      isSelected: false
    },
    {
      name: 'Bajo',
      valor: 'Riesgo bajo',
      isSelected: false
    }
  ]

  let preSeleccionadosriesgo = defaultRiesgoSelected.filter(x => x.isSelected).map(x => x.name);

  const [value, setValue] = useState<any[]>(preSeleccionadosriesgo);

  const handleCheckAll = (value: any, checked: any) => {

    let aux = defaultRiesgoSelected.map((x: any) => {
      x.isSelected = checked;
      return x;
    });
    setRiesgoSelected(aux);
    setValue(checked ? defaultRiesgoSelected.map(x => x.valor) : []);
  }
  const handleChange = (value: any[]) => {

    let aux = defaultRiesgoSelected.map((x: any) => {
      x.isSelected = value.includes(x.name);
      return x;
    });

    setValue(value);
    setRiesgoSelected(aux);

    const filteredArray = dataAlertas.filter((item: any) => value.indexOf(item.Criticidad) >= 0);
    console.log(dataAlertas);
    setDataAlertasfiltrada(filteredArray);
    setRowCount(filteredArray.length);
  };

  const [RiesgoSelected, setRiesgoSelected] = useState(defaultRiesgoSelected);

  const defaultGestionSelected: any[] = [
    {
      name: 'No Gestionados',
      data: [],
      valor: 'null',
      isSelected: false,
      getData: (fecha: any, f: any) => {
        return {
          "x": fecha,
          "y": f.Soc
        }
      }
    },
    {
      name: 'Gestionados No Cerrados',
      data: [],
      isSelected: false,
      valor: 'false',
      getData: (fecha: any, f: any) => {
        return {
          "x": fecha,
          "y": (f.CargakWh / f.DescargakWh) * 100
        }
      }
    },
    {
      name: 'Gestionados',
      data: [],
      isSelected: false,
      valor: 'true',
      getData: (fecha: any, f: any) => {
        return {
          "x": fecha,
          "y": f.DescargakWh - f.CargakWh

        }
      }
    }

  ]

  let preSeleccionadosgestion = defaultRiesgoSelected.filter(x => x.isSelected).map(x => x.name);

  const [value2, setValue2] = useState<any[]>(preSeleccionadosgestion);

  const [GestionSelected, setGestionSelected] = useState(defaultGestionSelected);

  const handleCheckAll2 = (value: any, checked: any) => {

    let aux = defaultGestionSelected.map((x: any) => {
      x.isSelected = checked;
      return x;
    });
    setRiesgoSelected(aux);
    setValue2(checked ? defaultGestionSelected.map(x => x.valor) : []);
  }

  const handleChange2 = (value: any[]) => {

    let aux = defaultGestionSelected.map((x: any) => {
      x.isSelected = value2.includes(x.name);
      return x;
    });

    setValue2(value);
    setGestionSelected(aux);

    const filteredArray = dataAlertas.filter((item: any) => value.indexOf(`${item.EstadoGestion}`) >= 0);
    console.log(value)
    setDataAlertasfiltrada(filteredArray);
    setRowCount(filteredArray.length);
  };

  const defaultAlarmasSelected: any[] = [
    {
      name: 'ADAS',
      data: [],
      isSelected: false,
      getData: (fecha: any, f: any) => {
        return {
          "x": fecha,
          "y": f.Soc
        }
      }
    },
    {
      name: 'Fatiga',
      data: [],
      isSelected: false,
      getData: (fecha: any, f: any) => {
        return {
          "x": fecha,
          "y": (f.CargakWh / f.DescargakWh) * 100
        }
      }
    },
    {
      name: 'Distracción',
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
      name: 'Seguridad',
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
      name: 'Diagnostico',
      data: [],
      isSelected: false,
      getData: (fecha: any, f: any) => {
        return {
          "x": fecha,
          "y": f.DescargakWh - f.CargakWh
        }
      }
    }

  ]

  const [AlarmasSelected, setAlarmasSelected] = useState(defaultAlarmasSelected);

  useEffect(() => {
    setRiesgoSelected(defaultRiesgoSelected);
    setDataAlertas(alertas.sort(function (a: any, b: any) { return a.EventDateTime - b.EventDateTime }));
    setRowCount(alertas.length);
  }, [alertas])

  useEffect(() => {
    setUserId(model.Id?.toString())
  }, [])

  const columnasTabla: MRT_ColumnDef<any>[]
    = [
      {
        accessorKey: 'TipoAlerta',
        header: 'Alarma',
        size: 100
      },
      {
        accessorKey: 'vehiculo',
        header: 'Vehículo',

        size: 100
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
                moment(row.original.EventDateTime).format('DD/MM/YYYY HH:mm:ss')
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
        size: 50,
        Cell({ cell, column, row, table, }) {
          return (cell.getValue() == null) ? <span className="badge bg-danger">No Gestionado</span>
            : (cell.getValue() == true) ? <span className="badge bg-success">Gestionado</span>
              : (cell.getValue() == false) ? <span className="badge bg-primary">En Gestion</span>
                : <span>{row.original.EstadoGestion}</span>
        },
      }, 
      {
        accessorKey: 'gestor',
        header: 'Analista',
        size: 80,
        Cell({ cell, column, row, table, }) {
          return (cell.getValue() == null) ? <span>Sin Analista</span> : <span>{row.original.gestor}</span>
        },
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
        header: 'Nombre'
      },
      {
        accessorKey: 'numerocontacto',
        header: 'Número Contacto'
      },
      {
        accessorKey: 'correocontacto',
        header: 'Email'
      }

    ];

  let listadoCampos: MRT_ColumnDef<any>[] =

    [
      {
        accessorKey: 'fechagestion',
        header: 'Fecha',
        size: 100,
        Cell({ cell, column, row, table, }) {
          return (moment(cell.getValue() as Date).format(FormatoColombiaDDMMYYYHHmmss))
        }
      },
      {
        accessorKey: 'value',
        header: 'Observaciones',
        size: 100
      },
      {
        accessorKey: 'recursos',
        header: 'Recursos',
        size: 100
      }

    ];

  let listadoEventos: MRT_ColumnDef<any>[] =

    [
      {
        accessorKey: 'evento',
        header: 'Evento',
        size: 100
      },
      {
        accessorKey: 'EventDateTime',
        header: 'Fecha',
        size: 100,
        Cell({ cell, column, row, table, }) {
          return (moment(cell.getValue() as Date).format(FormatoColombiaDDMMYYYHHmmss))
        }
      },
      {
        accessorKey: 'Latitud',
        header: 'Latitud',
        size: 100
      },
      {
        accessorKey: 'Longitud',
        header: 'Longitud',
        size: 100
      },
      {
        accessorKey: 'velocidad',
        header: 'Velocidad',
        size: 100
      }


    ];

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

  useEffect(() => {

    if (detalleEventos != "" && detalleEventos != null) {
      let json = JSON.parse(detalleEventos);
      setDataDetalleEventos(json);
      setRowCount3(json.length);
    }
    else {
      setDataDetalleEventos([]);
      setRowCount3(0);
    }
  }, [detalleEventos])

  const getobservacion = (e: any) => {
    setobervacionGestion(e.target.value)
  };


  //revisar
  const setObservacion = (observacion: string, escerrado?: string) => {

    let GestorObervaciones: any = {};

    GestorObervaciones = {
      AlertaId: alertaId,
      fechaapertura: Data[0].fechaapertura,
      fechagestion: FechaServidor(),
      value: observacion,
      EsCerrado: escerrado?.toString()

    };


    confirmarDialog(() => {
      setObservaciones(JSON.stringify(GestorObervaciones)).then((response) => {

        toaster.push(message('success', "Gestionar", "Gestión Guardada"), {
          placement: 'topStart'
        });
        setData([...Data, JSON.parse(JSON.stringify(GestorObervaciones))] as any[]);
        setobervacionGestion("");
        getAlertas().then((response) => {
          setalertas(response.data);

        });
        if (escerrado == "true") {
          handleClose();
        }



      }).catch((error) => {
        toaster.push(message('error', "Gestionar", "Error al gestionar intente nuevamente"), {
          placement: 'topCenter'
        });
      });
    }, escerrado == "false" ? `Esta seguro que desea agregar el comentario` : `Esta seguro que terminar la gestión`
      , escerrado == "false" ? "Guardar" : "Terminar")
  }

  const setGestorPreoperacional = (alertaId: number) => {

    let GestorObervaciones: any = {};
    GestorObervaciones = {
      fechaapertura: FechaServidor(),
      fechagestion: FechaServidor(),
      value: "Gestor Asignado",
      EsCerrado: null
    };

    confirmarDialog(() => {

      setGestor(UserId as string, '[' + JSON.stringify(GestorObervaciones) + ']', false, alertaId, model.Nombres).then(() => {
        getAlertas().then(
          (response) => {

            setalertas(response.data);

          });
        toaster.push(message('success', "Asignar Gestor", "Gestor Asignado"), {
          placement: 'topCenter'
        });
      }).catch(() => {
        toaster.push(message('error', "Asignar Gestor", "Error al asignar gestor intente nuevamente"), {
          placement: 'topCenter'
        });
      });
    }, `Desea usted gestionar esta alerta`, "Sí");
  }


  const modalObervaciones = (row: any) => {
    setobservaciones(row.Observaciones);
    setalertaId(row.AlertaId);
    setesgestionado(row.EstadoGestion);
    setPlaca(row.vehiculo);
    setAlerta(row.TipoAlerta);

    showModal();
  }

  const modalDetalleEventos = (row: any) => {
    setPlaca(row.vehiculo);
    setAlerta(row.TipoAlerta);
    setdetalleEventos(row.DetalladoEventos);

    showModal2();
  }

  const IrToMap = (row: any) => {
    setloader(true);
    let Data = new Array()
    Data = [...Data, ...JSON.parse(row.original.DetalladoEventos)]
    setDataDetalladoFiltrado(Data);
    setFiltrado(true)
    setActiveTab('#tab2');
  };

  const infBasica = (row: any) => {
    let datos = [JSON.parse(row.Observaciones)]


    if (datos[0] != null) {
      let last = datos[0].at(-1);
      setFechaApertura(moment(last.fechaapertura as Date).format('DD/MM/YYYY'));
      setFechaGestion(moment(last.fechagestion as Date).format('DD/MM/YYYY'));
      setobervacionGestionlast(last.value);
    } else {
      setFechaApertura("n/a");
      setFechaGestion("n/a");
      setobervacionGestionlast("");
    }


  };

  useEffect(() => {
    if (FiltroGestion === "2" || FiltroGestion === "") {
      setDataAlertasfiltrada(dataAlertas);
      setRowCount((dataAlertas).length);
    }
    else if (FiltroGestion === "false") {
      let filtergestion = (dataAlertas).filter((est: any) => est.EstadoGestion == false);
      setDataAlertasfiltrada(filtergestion);
      setRowCount(filtergestion.length);
    }
    else if (FiltroGestion === "true") {
      let filtergestion = (dataAlertas).filter((est: any) => est.EstadoGestion == true);
      setDataAlertasfiltrada(filtergestion);
      setRowCount(filtergestion.length);
    } else {
      let filtergestion = (dataAlertas).filter((est: any) => est.EstadoGestion == null);
      setDataAlertasfiltrada(filtergestion);
      setRowCount(filtergestion.length);
    }


  }, [dataAlertas, FiltroGestion])

  useEffect(() => {
    if (FiltroRiesgo === "2" || FiltroRiesgo === "") {
      setDataAlertasfiltrada(dataAlertas);
      setRowCount((dataAlertas).length);
    }
    else if (FiltroRiesgo === "Riesgo Bajo") {
      let filterriesgo = (dataAlertas).filter((est: any) => est.Criticidad == FiltroRiesgo);
      setDataAlertasfiltrada(filterriesgo);
      setRowCount(filterriesgo.length);
    }
    else if (FiltroRiesgo === "Riesgo Moderado") {
      let filterriesgo = (dataAlertas).filter((est: any) => est.Criticidad == FiltroRiesgo);
      setDataAlertasfiltrada(filterriesgo);
      setRowCount(filterriesgo.length);
    } else {
      let filterriesgo = (dataAlertas).filter((est: any) => est.Criticidad == FiltroRiesgo);
      setDataAlertasfiltrada(filterriesgo);
      setRowCount(filterriesgo.length);
    }


  }, [dataAlertas, FiltroRiesgo])


  const ordenarData = (tipo: string) => {



    if (tipo == '1') {
      let a = dataAlertas.sort(function (a: any, b: any) { return a.Criticidad - b.Criticidad });

      console.log(dataAlertas);
      setDataAlertasfiltrada(a);
    }
    else {
      dataAlertas.sort(function (a: any, b: any) { return a.EventDateTime - b.EventDateTime });
      setDataAlertas(dataAlertas);
    }

  }


  return (

    <>
      <div className="row">
        <div className="col-sm-3 col-md-3 col-xs-3">
          <h6 className="m-1">Riesgo: </h6>
          <CheckboxGroup inline className="m-3" name="checkboxList" value={value} onChange={handleChange}>
            {RiesgoSelected.map(item => (
              <Checkbox key={item.name} value={item.valor}>
                {item.name}
              </Checkbox>
            ))}
            <Checkbox
              indeterminate={value.length > 0 && value.length < RiesgoSelected.length}
              checked={value.length-1 === RiesgoSelected.length}
              // key={-1} value={-1}
              onChange={handleCheckAll}
            >
              Todos
            </Checkbox>
          </CheckboxGroup>
        </div>


       
      </div>
      <div className="row">
      <div className="col-sm-3 col-md-3 col-xs-3">
          <h6 className="m-1">Gestion: </h6>
          <CheckboxGroup inline className="m-3" name="checkboxList" value={value} onChange={handleChange2}>
            {GestionSelected.map(item => (
              <Checkbox key={item.name} value={item.valor}>
                {item.name}
              </Checkbox>
            ))}
            <Checkbox
              // indeterminate={value.length > 0 && value.length < data.length}
              // checked={value.length === data.length}
             
              onChange={handleCheckAll2}
            >
              Todos
            </Checkbox>
          </CheckboxGroup>
        </div>
      </div>
      <div className="row">
        
        <div className="col-sm-3 col-md-3 col-xs-3">
          <h6 className="m-1">Alertas: </h6>
          <CheckboxGroup inline className="m-3" name="checkboxList" value={value} onChange={handleChange2}>
            {AlarmasSelected.map(item => (
              <Checkbox key={item.name} value={item.name}>
                {item.name}
              </Checkbox>
            ))}
            <Checkbox
              // indeterminate={value.length > 0 && value.length < data.length}
              // checked={value.length === data.length}
              onChange={handleCheckAll2}
            >
              Todos
            </Checkbox>
          </CheckboxGroup>
        </div>
      </div>
      <div className="row">
      <div className="col-sm-3 col-md-3 col-xs-3 m-1">
          <h6 className="m-1">Ordenar: </h6>
          <Form.Select onChange={(e) => {
            // buscamos el objeto completo para tenerlo en el sistema                  
            ordenarData(e.currentTarget.value)

          }}>
            <option >Seleccione</option>
            <option key={1} value={1}>Riesgo</option>
            <option key={2} value={2}>Fecha</option>

          </Form.Select>
        </div>
      </div>

      <MaterialReactTable
        localization={MRT_Localization_ES}
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center'
            }
          },
        }}
        columns={columnasTabla}
        data={dataAlertasfiltrada}
        muiTableBodyRowProps={({ row }) => ({

          sx: {

            backgroundColor:
              row.original.Criticidad === 'Riesgo alto' ? 'rgba(248, 215, 218, 1)' :
                row.original.Criticidad === 'Riesgo moderado' ? 'rgba(255, 243, 205, 1)' :
                  row.original.Criticidad === 'Riesgo bajo' ? 'rgba(212, 237, 218, 1)' :
                    'rgba(255, 243, 205, 1)'
          }
        })}
        enableTopToolbar
        enableColumnOrdering
        enableEditing
        enableFilters
        enablePagination={false}
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

            {(row.original.EstadoGestion != null || row.original.EstadoGestion == true) ?
              <Tooltip arrow placement="left" title="Detalle Gestión">
                <IconButton onClick={() => {
                  modalObervaciones(row.original);
                }}>
                  <Message />
                </IconButton>
              </Tooltip>
              :
              <></>}

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
            <Tooltip arrow placement="left" title="Detalle Eventos Alertas">
              <IconButton onClick={() => {
                modalDetalleEventos(row.original);
              }}>
                <List />
              </IconButton>
            </Tooltip>
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

        muiExpandButtonProps={({ row }) => ({
          onClick: () => {
            //al expandir consulta el admin antes no
            infBasica(row.original);
          }
        })
        }
        enableExpandAll={false}
        renderDetailPanel={({ row }) => (

          <Tabs
            defaultActiveKey="gestion"
            className="mb-3"
          // justify
          // onClick={() => {
          //   console.log('hola', row);
          // }} 
          >
            <Tab eventKey="gestion" title={`Informacion Básica`} >

              <Box
                sx={{
                  display: 'grid',
                  margin: 'auto',
                  gridTemplateColumns: '1fr 1fr',
                  width: '100%',
                }}
              >
                <div className="row  col-sm-12 col-md-12 col-xs-12">
                  <div className="col-6">
                    <h6 className=" text-primary m-1 "> Fecha Apertura: <span>{FechaApertura}</span></h6>
                  </div>
                  <div className="col-6">
                    <h6 className=" m-1 text-primary"> Ultima Gestión: {FechaGestion} </h6>
                  </div>



                  <textarea className="form-control input m-2" id={'obervacion'} rows={3} value={obervacionGestionlast} disabled></textarea>

                </div>
              </Box>
            </Tab>
            <Tab eventKey="Contacto" title={`Información de contacto`}>
              <Box
                sx={{
                  display: 'grid',
                  margin: 'auto',
                  gridTemplateColumns: '1fr 1fr',
                  width: '100%'
                }}

              >
                <div>

                  <MaterialReactTable
                    localization={MRT_Localization_ES}
                    displayColumnDefOptions={{
                      'mrt-row-actions': {
                        muiTableHeadCellProps: {
                          align: 'center'
                        }
                      },
                    }}
                    columns={columnasContacto}
                    data={dataContacto}
                    enableTopToolbar
                    enableColumnOrdering
                    enableFilters
                    enablePagination={false}
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
                    rowCount={rowCount2}
                    initialState={{ density: 'compact' }}
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
        initialState={{ density: 'compact' }}
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
          <Modal.Title>{`Gestionar Alerta ${Alerta} - ${Placa}`}</Modal.Title>
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

      <Modal
        show={show2}
        onHide={handleClose2}
        size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{`Detalle Eventos Alerta ${Alerta} - ${Placa}`}</Modal.Title>
        </Modal.Header>
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
              columns={listadoEventos}
              data={DataDetalleEventos}
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
              rowCount={rowCount3}

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
          <Button type="button" variant="secondary" onClick={handleClose2}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export { CardContainerAlertas as CardContainerEventos }


