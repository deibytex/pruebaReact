
import { useEffect, useState } from "react";
import confirmarDialog, { errorDialog, successDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { ClientesFatiga, EventoActivo } from "../../models/EventosActivos";
import { AxiosResponse } from "axios";
import { Button, Form, Modal } from "react-bootstrap-v5";
import { PageTitle } from "../../../../../_start/layout/core";
import BlockUi from "@availity/block-ui";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { FiltrosData, GetClientesFatiga, GetEventos, GetEventosColumnas, getConfiguraciones, setConfiguraciones } from "../../data/Configuracion";
import { Check, ConstructionOutlined, DeleteForever, Edit } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Users } from "react-feather";


export default function Parametrizacion() {
    const [show, setShow] = useState(false);
    const [ValorSelectEvent, setValorSelectEvent] = useState("");
    const [NombreSelectEvent, setNombreSelectEvent] = useState("");
    const [NombeCondicion, setNombreCondicionEvent] = useState("");
    const [lstClientes, setLstClientes] = useState<ClientesFatiga[]>([]);
    const [clienteSeleccionado, setclienteSeleccionado] = useState<ClientesFatiga>({ ClienteIdS: 0, ClienteId: 0, clienteNombre: "" });
    const [Cliente, setCliente] = useState("");
    const [eventoSeleccionado, seteventoSeleccionado] = useState<EventoActivo>();
    const [Tiempo, setTiempo] = useState("");
    const [loader, setLoader] = useState<boolean>(false);
    const [Data, setData] = useState<any[]>([]);
    const [DataFilltrada, setDataFilltrada] = useState<any[]>([]);
    const [Filtrado, setFiltrado] = useState<boolean>(false);
    const [EventosActivos, setEventosActivos] = useState<any[]>([]);
    const [EventosActivosNombres, setEventosActivosNombres] = useState<any[]>([]);
    const [Clave, setClave] = useState("1");
    const [Cargar, setcargar] = useState(false);
    const [configuracionAlertaId, setconfiguracionAlertaId] = useState(null);

    //Variables Deiby
    const [show2, setShow2] = useState(false);

    const showModal = () => {
        setShow2(true);
    }

    const handleClose = () => {
    setShow2(false);
    };

    const [tipo, settipo] = useState("");
    const [nombre, setnombre] = useState("");
    const [numero, setnumero] = useState("");
    const [correo, setcorreo] = useState("");

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

    const [dataContacto, setdataContacto] = useState([]);

    const [rowCount2, setRowCount2] = useState(0);

    /* table state*/
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
    const [Mostrar, setMostrar] = useState(true)
    const [Titulo, setTitulo] = useState("Nueva configuración")
    const [tempEventos, setTempEventos] = useState<any[]>([])
    /* fin table */
    let Campos: MRT_ColumnDef<any>[] =
        [
            {
                accessorKey: 'nombre',
                header: 'Nombre'
            },
            {
                accessorKey: 'clienteNombre',
                header: 'Cliente'

            },
            {
                accessorKey: 'tiempo',
                header: 'Tiempo'
            },
            {
                accessorKey: 'minAmber',
                header: 'Min Amber'
            },
            {
                accessorKey: 'maxAmber',
                header: 'Max Amber'
            },
            {
                accessorKey: 'esActivo',
                header: 'Estado',
                Cell({ cell, column, row, table, }) {
                    return (<>{row.original.esActivo == true ? <span className="badge bg-primary">Activo</span> : <span className="badge bg-danger">Inactivo</span>}</>)
                },
            }
            // ,
            // {
            //     accessorKey: 'columna',
            //     header: 'Eventos',
            //     Cell({ cell, column, row, table, }) {
            //         return (row.original.columna)
            //     },
            //     size: 400
            // }
        ];

    const ObtenerClientes = () => {
        GetClientesFatiga().then(
            (response) => {
                setLstClientes(response.data);
            }
        ).catch((error) => {
            errorDialog("Consultar Clientes", "Error al consultar clientes, no se puede desplegar informacion");
        });
    }
    const ObtenerEventos = (cliente: any) => {
        if (cliente != "" && cliente != "0" && cliente != undefined && cliente != null)
            GetEventos(cliente).
                then((response: AxiosResponse<any>) => {
                    let Eventos = response.data.map((e: any) => {
                        return { EventId: e.eventTypeId, descriptionevent: (e.CustomName == null ? e.descriptionEvent : e.CustomName) }
                    })
                    console.log(Eventos);
                    setTempEventos(Eventos);

                }).catch((e) => {
                    errorDialog("Consulta eventos Activos", "No hay datos que mostrar");
                });
    }
    useEffect(() => {
        ObtenerClientes();
    }, [])
    useEffect(() => {
        //ObtenerEventos(clienteSeleccionado?.ClienteIdS)
        GetConfiguracionAlerta([]);
    }, [Cargar == true])

    function GetConfiguracionAlerta(data: any) {
        data.nombre = null;
        data.esActivo = null;
        data.ClienteId = null;
        setLoader(true);
        setIsLoading(true)
        setIsRefetching(true)
        getConfiguraciones(data).then((response: AxiosResponse<any>) => {
            let Datos = response.data.data;
            console.log(Datos);
            setData(Datos);
            setFiltrado(false);
            setRowCount(response.data.data.length);
            setLoader(false);
            setIsLoading(false);
            setIsRefetching(false);
            setIsError(false);
            setcargar(false);
        }).catch(({ error }) => {
            console.log("Eror ", error);
            setIsError(true);
            setIsLoading(false);
            setIsRefetching(false);
            setLoader(false);
        })
    }
    function CargaListadoClientes() {
        return (
            <Form.Select className=" mb-3 " onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                let cliente = lstClientes.filter((value, index) => {
                    return value.ClienteIdS === Number.parseInt(e.currentTarget.value)

                })
                setclienteSeleccionado(cliente[0]);
                if (cliente[0] != undefined) {
                    let _dt: any = FiltrosData.getEventos(Data, cliente[0].ClienteId);
                    setFiltrado(true)
                    setDataFilltrada(_dt);
                } else
                    setFiltrado(false);
                setCliente((cliente[0] == undefined ? "" : cliente[0].ClienteId.toString()));
                ObtenerEventos((cliente[0] == undefined ? "" : cliente[0].ClienteId.toString()));
            }} aria-label="Default select example">
                <option>Seleccione</option>
                {
                    lstClientes.map((element, i) => {
                        let flag = (element.ClienteIdS === clienteSeleccionado?.ClienteIdS)
                        return (<option key={element.ClienteIdS} selected={flag} value={element.ClienteIdS}>{element.clienteNombre}</option>)
                    })
                }
            </Form.Select>
        );
    }

    const AgregarEventos = (Evento: any) => {
        let Event = [...EventosActivos];
        let EventNombres = [...EventosActivosNombres];
        let esta = EventosActivos?.includes(ValorSelectEvent);
        let nesta = EventosActivosNombres.includes(NombreSelectEvent);
        if (esta)
            errorDialog("El evento ya se encuentra agregado.", "");
        else {
            Event.push(ValorSelectEvent);
            EventNombres.push(NombreSelectEvent);
            setEventosActivos(Event);
            setEventosActivosNombres(EventNombres);
        }
    };

    function CargaListadoEventos() {
        return (
            <Form.Select className=" mb-3 " onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                let evento = tempEventos.filter((value, index) => {
                    return value.EventId === e.currentTarget.value//Number.parseInt(e.currentTarget.value)
                })
                setValorSelectEvent(evento[0].EventId);
                setNombreSelectEvent(evento[0].descriptionevent);
                seteventoSeleccionado(evento[0])
            }} aria-label="Default select example">
                <option>Seleccione</option>
                {
                    tempEventos?.map((element, i) => {
                        let flag = (element.EventId === eventoSeleccionado?.EventId)
                        return (<option key={element.EventId} selected={flag} value={element.EventId}>{element.descriptionevent}</option>)
                    })
                }
            </Form.Select>
        );
    }

    const EliminarEvento = (element: any) => {
        confirmarDialog(() => {
            let Event = [...EventosActivos];
            let index = Event.indexOf(element);
            if (index != -1) {
                Event.splice(index, 1);
                setEventosActivos(Event);
            }
        }, `Esta seguro que desea quitar el evento ${element} de la lista`, 'Eliminar');
    }

    const Guardar = () => {
        let Datos = {};
        let columna: any[] = [];
        EventosActivos.forEach((o: any) => {
            columna.push(tempEventos.map((e: any) => {
                if (e.EventId == o) {
                    return e.descriptionevent;
                }
            }).filter((item: any) => {
                if (item != undefined)
                    return item;
            }))
        });

        Datos['clave'] = Clave;
        Datos['nombre'] = NombeCondicion;
        Datos['tiempo'] = Tiempo;
        Datos['condicion'] = EventosActivos.join();
        Datos['columna'] = "";
        Datos['clienteId'] = Cliente;
        Datos['configuracionAlertaId'] = configuracionAlertaId;
        Datos['columna'] = columna.join();
        Datos['esActivo'] = true;

        if (Validar()) {
            confirmarDialog(() => {
                setConfiguraciones(Datos).then((response: AxiosResponse<any>) => {
                    (response.data.exitoso == true ? successDialog("Opeación Éxitosa.", "") : errorDialog(response.data.mensaje, ""));
                    setShow(false);
                    setcargar(true);
                }).catch(({ error }) => {
                    errorDialog("Ha ocurrido un error", "");
                    setShow(false);
                })
            }, `Esta seguro que desea guardar la configuración`, 'Guardar');
        }
    };

    const EditarCampos = (row: any) => {
        setTitulo(`Edicion de configuración para ${row.original.clienteNombre}`)
        setNombreCondicionEvent(row.original.nombre);
        setEventosActivos(row.original.condicion.split(","));
        (row.original.columna == null ? ObtenerColumnas(row.original.condicion) : setEventosActivosNombres(row.original.columna.split(",")));
        setTiempo(row.original.tiempo);
        setCliente(row.original.clienteId);
        ObtenerEventos((row.original.clienteId == undefined ? "" : row.original.clienteId));
        setconfiguracionAlertaId(row.original.configuracionAlertaId);
        setMostrar(false);
        setClave("2");
        setShow(true)
    }
    const CamposNuevos = () => {
        setTitulo(`Nueva configuración`)
        setNombreCondicionEvent("");
        setEventosActivos([]);
        setEventosActivosNombres([]);
        setTiempo("");
        setClave("1");
        setCliente((clienteSeleccionado == undefined ? "" : clienteSeleccionado?.ClienteId.toString()));
        setEventosActivos([])
        setMostrar(true);
        setShow(true)
    };

    const Validar = () => {
        if (NombeCondicion == null || NombeCondicion == undefined || NombeCondicion == "") {
            errorDialog("Error el nombre es requerido", "");
            return false
        }
        if (EventosActivos == null || EventosActivos == undefined || EventosActivos.length == 0) {
            errorDialog("Error debe seleccionar por lo menos un evento", "");
            return false
        }
        if (Tiempo == null || Tiempo == undefined || Tiempo == "") {
            errorDialog("Error el tiempo es requerido", "");
            return false
        }
        if (Cliente == null || Cliente == undefined || Cliente == "0" || Cliente == "" || Cliente == undefined) {
            errorDialog("Error seleccione un cliente es requerido", "");
            return false
        }
        return true;
    }
    const CambiarEstado = (row: any) => {
        let Datos = {};
        Datos['clave'] = "3";
        Datos['esActivo'] = (row.original.esActivo == true ? false : true);
        Datos['configuracionAlertaId'] = row.original.configuracionAlertaId;
        confirmarDialog(() => {
            setConfiguraciones(Datos).then((response: AxiosResponse<any>) => {
                successDialog("Opeación Éxitosa.", "");
                setShow(false);
                setcargar(true);
            }).catch(({ error }) => {
                errorDialog("Ha ocurrido un error", "");
                setShow(false);
            })
        }, `¿Esta seguro que desea cambiar el estado?`, 'Cambiar');
    }

    //Solo se ejecuta si no se guardo la descripcion de los eventos en la condiciones pasa el string de los eventos
    const ObtenerColumnas = (Eventos: any) => {
        GetEventosColumnas(Eventos).then((response: AxiosResponse<any>) => {
            if (response.statusText == "OK") {
                let Lista = JSON.parse(response.data[0].Eventos);
                let a = Lista.map((e: any) => {
                    return e.Evento;
                });
                setEventosActivosNombres(a);
            }
        }).catch((error: any) => {
            console.log("error: ", error)
        });
    }

    const modalContactos = (row: any) => {
        setTitulo('Gestionar Contactos')
        // setobservaciones(row.Observaciones);
        // setalertaId(row.AlertaId);
        // setesgestionado(row.EstadoGestion);
        // setPlaca(row.vehiculo);
        // setconductor(row.conductor);
        // setAlerta(row.TipoAlerta);
        // setdetalleEventos(row.DetalladoEventos);
        // setfechaEvento(moment(JSON.parse(row.DetalladoEventos).at(-1).EventDateTime as Date).format(FormatoColombiaDDMMYYYHHmm));
        // settotalEventos(JSON.parse(row.DetalladoEventos).length)
    
        showModal();
      }

    const setContactos = () => {

        let contactos: any = {};
    
        contactos = {
          tipo,
          nombre,
          numero,
          correo    
        };

        console.log(JSON.stringify(contactos));
    
    
        // confirmarDialog(() => {
        //   setObservaciones(JSON.stringify(GestorObervaciones)).then((response) => {
    
        //     toaster.push(message('success', "Gestionar", "Gestión Guardada"), {
        //       placement: 'topCenter'
        //     });
    
        //     setData([...Data, JSON.parse(JSON.stringify(GestorObervaciones))] as any[]);
        //     setobervacionGestion("");
        //     getAlertas(clienteIds as string).then((response) => {
        //       setalertas(response.data);
        //     });
        //     if (escerrado == "true") {
        //       handleClose();
        //     }
        //     else setesgestionado(false);
    
    
    
        //   }).catch((error) => {
        //     toaster.push(message('error', "Gestionar", "Error al gestionar intente nuevamente"), {
        //       placement: 'topCenter'
        //     });
        //   });
        // }, escerrado == "false" && observacion != 'Se reabre Gestión' ? `Esta seguro que desea agregar el comentario` : escerrado == 'true' ? `Esta seguro de terminar la gestión`
        //   : `Esta seguro de reabrir la gestión`, escerrado == "false" && observacion != 'Se reabre Gestión'
        //   ? "Guardar" : escerrado == 'true' ? "Terminar" : "Reabrir")
      }

    return (
        <>
            <PageTitle>Parametrización</PageTitle>
            <BlockUi tag="div" keepInView blocking={loader ?? false} >
                <div className="content">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                                <div className="mx-auto">
                                    <div className="ms-3 text-center">
                                        <h3 className="mb-0">Parametrización</h3>
                                        <span className="text-muted m-3">Parametrización fatiga</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card d-flex justify-content-start">
                        <div className="bg-secondary d-flex flex-row  justify-content-between">
                            <div className="form-group d-flex justify-content-start pt-2" style={{ display: 'inline-block', float: 'left' }}>
                                <button className="btn btn-sm btn-primary mb-4 ms-2" onClick={CamposNuevos}>Nuevo</button>
                            </div>
                            <div className="pt-2 me-2" style={{ display: 'inline-block', float: 'right' }}>
                                <CargaListadoClientes></CargaListadoClientes>
                            </div>
                        </div>
                        <div className="card-body mt-5">
                            {(Data != undefined) && (<MaterialReactTable
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
                                columns={Campos}
                                data={(Filtrado ? DataFilltrada : Data)}
                                enableColumnOrdering
                                enableEditing
                                editingMode="modal"
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
                                enableStickyHeader
                                enableDensityToggle={false}
                                enablePagination={false}
                                enableRowVirtualization
                                defaultColumn={{
                                    minSize: 150, //allow columns to get smaller than default
                                    maxSize: 400, //allow columns to get larger than default
                                    size: 150, //make columns wider by default
                                }}
                                muiTableContainerProps={{
                                    sx: { maxHeight: '400px' }, //give the table a max height
                                }}
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
                                renderRowActions={({ row, table }) => (
                                    <Box sx={{ display: 'block', gap: '1rem', marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Tooltip arrow placement="top" title="Editar configuración">
                                            <IconButton onClick={() => {
                                                EditarCampos(row);
                                            }}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip arrow placement="top" title="Contactos">
                                            <IconButton onClick={() => {
                                                 modalContactos(row.original);
                                            }
                                            }>
                                                <Users />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip arrow placement="top" title="Desactivar configuración">
                                            <IconButton onClick={() => {
                                                CambiarEstado(row);
                                            }
                                            }>
                                                <Check />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                )}
                            />)}
                        </div>
                    </div>
                </div>
            </BlockUi>
            <Modal show={show} onHide={setShow} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{Titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <label className="control-label label-sm font-weight-bold" htmlFor="Nombre" style={{ fontWeight: 'bold' }}>Nombre </label>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fas fa-pen"></i></span>
                                <input name="Nombre" placeholder="Nombre configuracion" className="form-control input-sm" value={NombeCondicion} onChange={(e: any) => { e.preventDefault(); setNombreCondicionEvent(e.target.value) }} />
                            </div>
                        </div>
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <label className="control-label label-sm font-weight-bold" htmlFor="Tiempo" style={{ fontWeight: 'bold' }}>Tiempo</label>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fas fa-clock"></i></span>
                                <input name="Tiempo" placeholder="Tiempo" className="form-control input-sm" value={Tiempo} onChange={(e: any) => { e.preventDefault(); setTiempo(e.target.value) }} />
                            </div>
                        </div>
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4" style={{ display: (Mostrar ? "inline" : "none") }}>
                            <label className="control-label label-sm font-weight-bold" style={{ fontWeight: 'bold' }} htmlFor="ClienteId">Cliente</label>
                            <div className="input-group mb-3">
                                <span className="input-group-text mb-3"><i className="fas fa-user-tie mb-3"></i></span>
                                <CargaListadoClientes />
                            </div>
                        </div>                    
                    </div>
                    <div className="row">
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <label className="control-label label-sm font-weight-bold" htmlFor="Tiempo" style={{ fontWeight: 'bold' }}>Valor Máximo</label>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fas fa-clock"></i></span>
                                <input name="Tiempo" placeholder="Tiempo" className="form-control input-sm" value={3} onChange={(e: any) => { e.preventDefault(); setTiempo(e.target.value) }} />
                            </div>
                        </div>
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <label className="control-label label-sm font-weight-bold" htmlFor="Tiempo" style={{ fontWeight: 'bold' }}>Valor Mínimo</label>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fas fa-clock"></i></span>
                                <input name="Tiempo" placeholder="Tiempo" className="form-control input-sm" value={5} onChange={(e: any) => { e.preventDefault(); setTiempo(e.target.value) }} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
         
                        <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                            <div className="row">
                                <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                    <label className="control-label label-sm font-weight-bold" htmlFor="evento" style={{ fontWeight: 'bold' }}>Evento</label>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text mb-3"><i className="fas fa-book"></i></span>
                                        <CargaListadoEventos />
                                        {/* Aqui es el boton de guardar eventos */}
                                        <button className="btn btn-sm btn-success mb-3" type="button" title="Agregar mas eventos" name="eventos" value={1} onClick={(e: any) => { AgregarEventos(e) }}> <i className="fas fa-caret-right"></i></button>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                                    {
                                        (EventosActivos.length > 0) && (EventosActivosNombres.length != 0) && (
                                            <table className="table w-100">
                                                <thead>
                                                    <tr>
                                                        <th className="w-50">Evento</th>
                                                        <th className="w-50">Opción</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {

                                                        EventosActivosNombres.map((e: any, index: any) => {
                                                            return (
                                                                <tr key={e + index}>
                                                                    <td key={e}>{e}</td>
                                                                    <td key={index}><span onClick={(event) => { EliminarEvento(e) }} className="btn btn-sm btn-danger"><i className="bi-trash3-fill"></i></span></td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        )
                                    }
                                </div>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="primary" onClick={() => {
                        Guardar();
                    }}>
                        Guardar
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => { setShow(false); }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show2} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{Titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 mt-1">
                            <div className="">
                                <label className="control-label label-sm font-weight-bold" htmlFor="comentario" style={{ fontWeight: 'bold' }}>Tipo:</label>
                                <input className="form-control  input input-sm " id={"nombregrupo"} placeholder="Selecione Tipo"
                                    onChange={(e) => settipo(e.target.value)} value={tipo}></input>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 mt-1">
                            <div className="">
                                <label className="control-label label-sm font-weight-bold" htmlFor="comentario" style={{ fontWeight: 'bold' }}>Nombre:</label>
                                <input className="form-control  input input-sm " id={"nombregrupo"} placeholder="Ingrese Nombre"
                                    onChange={(e) => setnombre(e.target.value)} value={nombre}></input>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 mt-1">
                            <div className="">
                                <label className="control-label label-sm font-weight-bold" htmlFor="comentario" style={{ fontWeight: 'bold' }}>Número:</label>
                                <input className="form-control  input input-sm " id={"nombregrupo"} placeholder="Ingrese Número"
                                    onChange={(e) => setnumero(e.target.value)} value={numero}></input>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 mt-1">
                            <div className="">
                                <label className="control-label label-sm font-weight-bold" htmlFor="comentario" style={{ fontWeight: 'bold' }}>Email:</label>
                                <input className="form-control  input input-sm " id={"nombregrupo"} placeholder="Ingrese Correo"
                                    onChange={(e) => setcorreo(e.target.value)} value={correo}></input>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-3">

                        <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
                            <Button type="button" variant="primary" onClick={() => {
                                setContactos();
                            }}>
                                Guardar
                            </Button></div>

                    </div>

                </Modal.Body>
                <Modal.Body>
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
                        rowCount={rowCount2}
                        initialState={{ density: 'compact' }}
                        state={{
                            columnFilters,
                            globalFilter,
                            isLoading,
                            showAlertBanner: isError,
                            showProgressBars: isRefetching
                        }}
                        renderRowActions={({ row, table }) => (

                            <Box sx={{ display: 'flex', gap: '1rem' }}>
                                <Tooltip arrow placement="left" title="Editar">
                                    <IconButton
                                        onClick={() => {
                                            // setGestorPreoperacional(row.original);
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip arrow placement="left" title="Eliminar">
                                    <IconButton onClick={() => {
                                        // modalDetalleEventos(row.original);
                                    }}>
                                        <DeleteForever />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )
                        }
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
