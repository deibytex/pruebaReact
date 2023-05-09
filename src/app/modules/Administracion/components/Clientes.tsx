import BlockUi from "@availity/block-ui";
import { PageTitle } from "../../../../_start/layout/core";
import { useEffect, useState } from "react";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { Download, Edit,  FireTruckTwoTone, Person } from "@mui/icons-material";
import { GetAdministradores, GetAssets, GetClientesAdministradores, GetConfiguracionAssets, GetDrivers, GetSites, updateAssets } from "../data/Clientes";
import { AxiosResponse } from "axios";

import { useHistory } from "react-router-dom"
import { Button, Modal, Tab, Tabs } from "react-bootstrap-v5";
import moment from "moment";
import { formatSimple } from "../../../../_start/helpers/Helper";
import { DescargarExcel } from "../../../../_start/helpers/components/DescargarExcel";
import confirmarDialog, { errorDialog, successDialog } from "../../../../_start/helpers/components/ConfirmDialog";
export default function Clientes() {
    const [loader, setloader] = useState<boolean>(false);
    const [DatosClientes, setDatosClientes] = useState<any[]>([]);
    const [DatosAdmins, setDatosAdmins] = useState<any[]>([]);
    const [DatosSites, setDatosSites] = useState<any[]>([]);
    const [DatosDriver, setDatosDrivers] = useState<any[]>([]);
    const [DatosAssets, setDatosAssets] = useState<any[]>([]);
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

    const [Decomisionado, setDecomisionado] = useState<string>("");
    const [Activo, setActivo] = useState<string>("");
    const [Driver, setDriver] = useState<string>("");

    /* para los clientes */
    const [estadoClienteId, setestadoClienteId] = useState<boolean>(false);
    const [GeneraIMG, setGeneraIMG] = useState<boolean>(false);
    const [notificacion, setnotificacion] = useState<boolean>(false);
    const [Event, setEvent] = useState<boolean>(false);
    const [Position, setPosition] = useState<boolean>(false);
    const [Trips, setTrips] = useState<boolean>(false);
    const [Metrics, setMetrics] = useState<boolean>(false);
    const [ActiveEvent, setActiveEvent] = useState<boolean>(false);
    const [ClienteId, setClienteId] = useState<string>("");
    /* Fin cluentes */
    const [Consultas, setConsultas] = useState<any[]>([
        { Cliente: "", Data: [] },
        { Cliente: "", Data: [] },
        { Cliente: "", Data: [] },
        { Cliente: "", Data: [] }
    ])
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showModalactivos, setShowModalactivos] = useState<boolean>(false);
    const [showModaldriver, setShowModaldriver] = useState<boolean>(false);

    let Campos: MRT_ColumnDef<any>[] =
        [{
            accessorKey: 'clienteNombre',
            header: 'Nombre',
            Header: 'Cliente',
            Cell(row: any) {
                return (row.row.original.clienteNombre)
            },
            size: 100
        },
        {
            accessorKey: 'usuarioNombre',
            header: 'Administrador',
            Header: 'Administrador',
            Cell(row: any) {
                return ((row.row.original.usuarioNombre != null ? String(row.row.original.usuarioNombre).replace(",", "") : ""))
            },
            size: 90
        },
        
        {
            accessorKey: 'FechaIngreso',
            header: 'Fecha ingreso',
            Cell(row: any) {
                return moment(row.row.original.fechaIngreso).format(formatSimple)
            },
            size: 90
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            Header: 'Estado',
            Cell(row: any) {
                return (<span className="badge bg-primary">{row.row.original.estado}</span>)
            },
            size: 80
        }
        ];
    useEffect(() => {
        Consultar();
        return () => { }
    }, [])
    const Consultar = () => {
        setloader(true);
        setIsLoading(true);
        setIsRefetching(true)
        GetClientesAdministradores(null).then((response: AxiosResponse<any>) => {
            setDatosClientes(response.data);
            setloader(false);
            setIsLoading(false);
            setIsRefetching(false)
            setRowCount(response.data.length);
        }).catch(() => {
            setIsError(true);
            setloader(false);
            setIsLoading(false);
            setIsRefetching(false)
        }).finally(() => {
            setloader(false);
        });
    }
    let CamposRender = {
        "Driver": [{
            accessorKey: 'name',
            header: 'Operador',
            Cell(row: any) {
                return (row.row.original.clienteNombre)
            },

            size: 100
        },
        {
            accessorKey: 'employeeNumber',
            header: 'Numero',
            Cell(row: any) {
                return ((row.row.original.employeeNumber == null ? "-" : row.row.original.employeeNumber))
            },
            size: 100
        }
        ],
        // "AssetShort": [{
        //     accessorKey: 'assetId',
        //     header: 'ID',
        //     enableHiding: true,
        //     size: 100
        // }, {
        //     accessorKey: 'description',
        //     header: 'Asset',
        //     size: 100
        // },
        // {
        //     accessorKey: 'registrationNumber',
        //     header: 'Placa',
        //     size: 100
        // },
        // {
        //     accessorKey: 'estado',
        //     header: 'Estado TX',
        //     Cell(row: any) {
        //         let state = (
        //             row.row.original.userState == "Unverified" ?
        //                 <span className='badge bg-warning'>{row.row.original.userState} </span> :
        //                 row.row.original.userState == "New installation" ?
        //                     <span className='badge  bg-info'>{row.row.original.userState}</span> :
        //                     <span className='badge  bg-success'>{row.row.original.userState}</span>
        //         )
        //         return (state)
        //     },
        //     size: 100
        // }
        // ],
        "Asset": [
            {
                accessorKey: 'assetId',
                header: 'ID',
                enableHiding: true,
                size: 150
            },
            {
                accessorKey: 'description',
                header: 'Asset',
                size: 100
            },
            {
                accessorKey: 'registrationNumber',
                header: 'Placa',
                size: 100
            },

            {
                accessorKey: 'userState',
                header: 'Estado',
                Cell(row: any) {
                    let state = (
                        row.row.original.userState == "Unverified" ?
                            <span className='badge bg-warning'>{row.row.original.userState} </span> :
                        row.row.original.userState == "New installation" ?
                                <span className='badge bg-info'>{row.row.original.userState}</span> : 
                        row.row.original.userState == "Decommissioned" ?  
                            <span className='badge bg-danger'>{row.row.original.userState}</span> :
                            <span className='badge bg-success'>{row.row.original.userState}</span>
                    )
                    return (state)
                },
                enableHiding: true,
                size: 120
            },
            {
                accessorKey: 'estado',
                header: 'Estado TX',
                Cell(row: any) {
                    let state = (
                        row.row.original.estado == "Sin Respuesta del Cliente" ?
                            <span className='badge bg-warning'>{row.row.original.estado} </span> :
                            row.row.original.estado == "En Mantenimiento" ?
                                <span className='badge bg-info'>{row.row.original.estado}</span> :
                                row.row.original.estado == "Detenido" ?
                                    <span className='badge bg-danger'>{row.row.original.estado}</span> :
                                    <span className='badge bg-success'>{row.row.original.estado}</span>
                    )
                    return (state)
                },
                enableHiding: true,
                size: 165
            },
            {
                accessorKey: 'siteName',
                header: 'Sitio',
                enableHiding: true,
                size: 100
            },
            {
                accessorKey: 'vertical',
                header: 'Vertical',
                size: 100
            },
            {
                accessorKey: 'clasificacion',
                header: 'Clasificación',
                enableHiding: true,
                size: 100
            },
            {
                accessorKey: 'createdDate',
                header: 'Fecha Creación',
                Cell(row: any) {
                    return (moment(row.row.original.createdDate).format(formatSimple))
                },
                enableHiding: true,
                size: 100
           }
        ], "Sites": [{
            accessorKey: 'sitename',
            header: 'Sitio',
            size: 100
        },
        {
            accessorKey: 'padre',
            header: 'Pertenece',
            size: 100
        }
        ], "Administrador": [{
            accessorKey: 'Nombres',
            header: 'Nombres',
            size: 200
        },
        {
            accessorKey: 'Email',
            header: 'Email',
            size: 100
        }
        ]
    };
    const consultarAdmins = (row: any) => {
        if (row != Consultas[0].Cliente) {
            setloader(true);
            GetAdministradores(row).then((response: AxiosResponse<any>) => {
                setDatosAdmins(response.data);
                let Consult = [...Consultas]
                Consult[0].Cliente = row;
                Consult[0].Data = response.data;
                setConsultas(Consult);
                setloader(false);
            }).catch(() => {
                console.log("error");
                setloader(false);
            });
        } else
            setDatosAdmins(Consultas[0].Data);
    }
    const consultarVehiculos = (row: any) => {
        if (row != Consultas[1].Cliente) {
            setloader(true);
            GetAssets(row).then((response: AxiosResponse<any>) => {
                let Decomisionados = response.data.data.filter((item: any) => {
                    return item.userState == 'Decommissioned'
                });
                setDecomisionado(Decomisionados.length);
                let Activos = response.data.data.filter((item: any) => {
                    return item.userState != 'Decommissioned'
                });
                setActivo(Activos.length)
                setDatosAssets(response.data.data);
                let Consult = [...Consultas]
                Consult[1].Cliente = row;
                Consult[1].Data = response.data.data;
                setConsultas(Consult);
                setloader(false);
                setShowModalactivos(true)
            }).catch(() => {
                console.log("error");
                setloader(false);
            });
        }
        else{
            setDatosAssets(Consultas[1].Data);
            setShowModalactivos(true)
        }
    }
    const consultarDrivers = (row: any) => {
        if (row != Consultas[2].Cliente) {
            setloader(true);
            GetDrivers(row).then((response: AxiosResponse<any>) => {
                setDatosDrivers(response.data);
                let Consult = [...Consultas]
                Consult[2].Cliente = row;
                Consult[2].Data = response.data;
                setConsultas(Consult);
                setloader(false);
                setShowModaldriver(true);
                setDriver(response.data.length);
            }).catch(() => {
                console.log("error");
                setloader(false);
            });
        } else{
            setShowModaldriver(true);
            setDatosDrivers(Consultas[2].Data);
        }
    }
    const consultarSitios = (row: any) => {
        if (row != Consultas[3].Cliente) {
            setloader(true);
            GetSites(row).then((response: AxiosResponse<any>) => {
                setDatosSites(response.data)
                let Consult = [...Consultas]
                Consult[3].Cliente = row;
                Consult[3].Data = response.data;
                setConsultas(Consult);
                setloader(false);
            }).catch(() => {
                console.log("error");
                setloader(false);
            });
        } else
            setDatosSites(Consultas[3].Data);

    }
    const PanelConsultas = (key: any) => {
        let ClienteId = key.target.id.split("-tab")[0];
        switch (key.target.dataset.rbEventKey) {
            case 'admins':
            default:
                consultarAdmins(ClienteId);
                break;
            case 'activos':
                consultarVehiculos(ClienteId);
                break;
            case 'drivers':
                consultarDrivers(ClienteId);
                break;
            case 'sitios':
                consultarSitios(ClienteId);
                break;
        }
    };
    const GetReporteConfiguracionAssets = (row: any) => {
        setloader(true);
        GetConfiguracionAssets(row).then((response:AxiosResponse<any>) =>{
           let  Columnas = [
            {
                accessorKey: 'BD_Cliente',
                header: 'BD_Cliente'
            }, {
                accessorKey: 'AssetId',
                header: 'AssetId',
            },
            {
                accessorKey: 'SiteName',
                header: 'SiteName',
            },
            {
                accessorKey: 'VehicleID',
                header: 'VehicleID',
            },
            {
                accessorKey: 'VehicleDescription',
                header: 'VehicleDescription',
            },
            {
                accessorKey: 'RegistrationNumber',
                header: 'RegistrationNumber',
            },
            {
                accessorKey: 'DriverOBC',
                header: 'DriverOBC',
            },
            {
                accessorKey: 'DriverCAN',
                header: 'DriverCAN',
            },
            {
                accessorKey: 'DriverOBCLoadDate',
                header: 'DriverOBCLoadDate',
            },
            {
                accessorKey: 'LastConfiguration',
                header: 'LastConfiguration',
            },
            {
                accessorKey: 'CreatedDate',
                header: 'CreatedDate',
            },
            {
                accessorKey: 'DeviceType',
                header: 'DeviceType',
            },
            {
                accessorKey: 'ConfigurationGroup',
                header: 'ConfigurationGroup',
            },
            {
                accessorKey: 'GPRSContext',
                header: 'GPRSContext',
            },
            {
                accessorKey: 'UnitIMEI',
                header: 'UnitIMEI',
            },
            {
                accessorKey: 'UnitSCID',
                header: 'UnitSCID',
            },
            {
                accessorKey: 'LastTrip',
                header: 'LastTrip',
            },
           ];
            DescargarExcel(response.data, Columnas,"ReporteConfiguration");
            setloader(false);
        }).catch(() =>{
            setloader(false);
            console.log("Error");
        })
    }

    const EditarCampos = (row: any) => {
        setestadoClienteId(row.original.estadoClienteId)
        setGeneraIMG(row.original.GeneraIMG)
        setnotificacion(row.original.notificacion)
        setEvent(row.original.Event)
        setPosition(row.original.Position)
        setTrips(row.original.Trips)
        setMetrics(row.original.Metrics)
        setActiveEvent(row.original.ActiveEvent)
        setClienteId(row.original.ClienteId)
        setShowModal(true)
    }
    const GuardarCamposCliente = () =>{
        confirmarDialog(() => {
            setloader(true);
            updateAssets(
                ClienteId,
                String((estadoClienteId == true ? "1" : "0")),
                String(notificacion),
                String(GeneraIMG),
                String(Trips),
                String(Metrics),
                String(Event),
                String(Position),
                String(ActiveEvent)
            ).then((response:AxiosResponse<any>) =>{
                setShowModal(false);
                Consultar();
                successDialog("Datos actualizado correctamente","");
            }).catch(
                ({error}) =>{
                    setloader(false);
                    errorDialog("Ha ocurrido un error al actualizar","")
                }
            );
        }, `¿Esta seguro que desea guardar los cambios?`, 'Guardar');
    }
    return (
        <>
            <PageTitle>Clientes</PageTitle>
            <BlockUi tag="div" keepInView blocking={loader ?? false}  >
                {(DatosClientes.length != 0) && (<MaterialReactTable
                    // tableInstanceRef={ColumnasTablas['movil']}
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
                    data={DatosClientes}
                    enableEditing
                    editingMode="modal" //default         
                    enableColumnOrdering
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
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'block', gap: '1rem', marginLeft: 'auto', marginRight: 'auto' }}>
                            <Tooltip arrow placement="top" title="Vehiculos del cliente">
                                <IconButton onClick={() => {
                                    // PanelConsultas(row.original.ClienteId)
                                    consultarVehiculos(row.original.ClienteId);
                                }}>
                                    <FireTruckTwoTone />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="top" title="Conductores del cliente">
                                <IconButton onClick={() => {
                                    // PanelConsultas(row.original.ClienteId)
                                    consultarDrivers(row.original.ClienteId);
                                }}>
                                    <Person />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="top" title="Gestionar campos de cliente">
                                <IconButton onClick={() => {
                                    EditarCampos(row)
                                }}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="top" title="Descargar detallado del cliente">
                                <IconButton onClick={() => { GetReporteConfiguracionAssets(row.original.ClienteId) }
                                }>
                                    <Download />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                    muiExpandButtonProps={({ row }) => ({
                        onClick: () => {
                            //al expandir consulta el admin antes no
                            consultarAdmins(row.original.ClienteId);
                        }
                    })
                    }
                    enableExpandAll={false}
                    renderDetailPanel={({ row }) => (
                            <Tabs  defaultActiveKey="admins" id={`${row.original.ClienteId}`} className="mb-3 border w-100" justify onClick={PanelConsultas} >
                                    <Tab eventKey="admins" title={`Administradores`} >
                                        <MaterialReactTable
                                            localization={MRT_Localization_ES}
                                            columns={CamposRender.Administrador}
                                            data={DatosAdmins}
                                            initialState={{ density: 'compact' }}
                                        />
                                    </Tab>
                                    <Tab eventKey="sitios" title="Sitios">
                                        <MaterialReactTable
                                            localization={MRT_Localization_ES}
                                            columns={CamposRender.Sites}
                                            data={DatosSites}
                                            initialState={{ density: 'compact' }}
                                        />
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
                />)}
            </BlockUi>
            <Modal show={showModal} onHide={setShowModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title> {"Edicion de campos del cliente"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <div className="">
                                <label className="label control-label label-sm fw-bolder text-primary">Estado</label>
                            </div>
                            <div className="">
                                <input
                                    type="checkbox"
                                    checked={estadoClienteId}
                                    onChange={(e) =>
                                        setestadoClienteId(e.target.checked)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <div className="">
                                <label className="label control-label label-sm fw-bolder text-primary">Activar IMG</label>
                            </div>
                            <div className="">
                                <input
                                    type="checkbox"
                                    checked={GeneraIMG}
                                    onChange={(e) =>
                                        setGeneraIMG(e.target.checked)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <div className="">
                                <label className="label control-label label-sm fw-bolder text-primary">Transmisión</label>
                            </div>
                            <div className="">
                                <input
                                    type="checkbox"
                                    checked={notificacion}
                                    onChange={(e) =>
                                        setnotificacion(e.target.checked)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <div className="">
                                <label className="label control-label label-sm fw-bolder text-primary">Eventos</label>
                            </div>
                            <div className="">
                                <input
                                    type="checkbox"
                                    checked={Event}
                                    onChange={(e) =>
                                        setEvent(e.target.checked)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <div className="">
                                <label className="label control-label label-sm fw-bolder text-primary">Posiciones</label>
                            </div>
                            <div className="">
                                <input
                                    type="checkbox"
                                    checked={Position}
                                    onChange={(e) =>
                                        setPosition(e.target.checked)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <div className="">
                                <label className="label control-label label-sm fw-bolder text-primary">Viajes</label>
                            </div>
                            <div className="">
                                <input
                                    type="checkbox"
                                    checked={Trips}
                                    onChange={(e) =>
                                        setTrips(e.target.checked)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <div className="">
                                <label className="label control-label label-sm fw-bolder text-primary">Metrica</label>
                            </div>
                            <div className="">
                                <input
                                    type="checkbox"
                                    checked={Metrics}
                                    onChange={(e) =>
                                        setMetrics(e.target.checked)
                                    }
                                />
                            </div>

                        </div>
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <div className="">
                                <label className="label control-label label-sm fw-bolder text-primary">Active event</label>
                            </div>
                            <div className="">
                                <input
                                    type="checkbox"
                                    checked={ActiveEvent}
                                    onChange={(e) =>
                                        setActiveEvent(e.target.checked)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="primary" onClick={() => {
                            GuardarCamposCliente();
                    }}>
                        Guardar
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => { setShowModal(false); }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModalactivos} onHide={setShowModalactivos} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title> {"Vehiculos del cliente"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="d-flex w-100" >
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-center justify-content-center mb-2" data-placement="top" title="Activos">
                                                <a href="#" className="btn bg-transparent border border-primary text-primary rounded-pill border-2 btn-icon mr-3">
                                                    <i className="bi-truck-front"></i>
                                                </a>
                                                <div>
                                                    <div className="fw-bolder text-primary">Activos</div>
                                                    <span className="text-muted fw-bolder text-primary" data-placement="top" title="Cantidad de vehiculos activos">{Activo}</span>&nbsp;&nbsp;<span></span>
                                                </div>
                                            </div>
                                            <div className="w-75 mx-auto mb-3" id="new-visitors"></div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-center justify-content-center mb-2" data-placement="top" title="Decomisionados">
                                                <a href="#" className="btn bg-transparent border border-danger text-danger rounded-pill border-2 btn-icon mr-3">
                                                    <i className="bi-truck-front"></i>
                                                </a>
                                                <div>
                                                    <div className="fw-bolder text-danger">Decomisionados</div>
                                                    <span className="text-muted fw-bolder text-danger" data-placement="top" title="Cantidad de vehiculos decomisionados">{Decomisionado}</span>&nbsp;&nbsp;<span></span>
                                                </div>
                                            </div>
                                            <div className="w-75 mx-auto mb-3" id="new-visitors"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5">
                                <MaterialReactTable
                                    localization={MRT_Localization_ES}
                                    columns={CamposRender.Asset}
                                    data={DatosAssets}
                                    initialState={{ density: 'compact' }}
                                    enableStickyHeader
                                    enableDensityToggle={false}
                                    enableRowVirtualization
                                    // enableEditing
                                    // editingMode="modal" //default  
                                    renderDetailPanel={({ row }) => (
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                margin: 'auto',
                                                gridTemplateColumns: '1fr 1fr',
                                                width: '100%',
                                            }}
                                        >
                                            <div className="container">
                                                <div className="row">
                                                    <div  className="col-sm-6" >
                                                        <Typography><b>unitIMEI</b>: {row.original.unitIMEI == "" ? "-":row.original.unitIMEI}</Typography>
                                                        <Typography><b>unitSCID</b>: {row.original.unitSCID == "" ? "-":row.original.unitSCID }</Typography>
                                                    </div>
                                                    <div  className="col-sm-6" >
                                                        <Typography><b>ingresoSalida</b>: {row.original.ingresoSalida == "" ? "-":row.original.ingresoSalida}</Typography>
                                                        <Typography><b>esManual</b>: {(row.original.esManual == null ? "-":row.original.esManual)}</Typography>
                                                    </div>
                                                </div>

                                            </div>
                                         
                                            
                                        </Box>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="primary" onClick={() => { setShowModalactivos(false); }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModaldriver} onHide={setShowModaldriver} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title> {"Conductores del cliente"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                        <div className="d-flex w-100" >
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm-4">
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="d-flex align-items-center justify-content-center mb-2" data-placement="top" title="Conductores">
                                                <a href="#" className="btn bg-transparent border border-info text-primary rounded-pill border-2 btn-icon mr-3">
                                                    <i className="bi-person"></i>
                                                </a>
                                                <div>
                                                    <div className="fw-bolder text-info">Conductores</div>
                                                    <span className="text-muted fw-bolder" data-placement="top" title="Cantidad de conductores del cliente">{Driver}</span>&nbsp;&nbsp;<span></span>
                                                </div>
                                            </div>
                                            <div className="w-75 mx-auto mb-3" id="new-visitors"></div>
                                        </div>
                                        <div className="col-sm-4">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5">
                                <MaterialReactTable
                                    localization={MRT_Localization_ES}
                                    columns={CamposRender.Driver}
                                    data={DatosDriver}
                                    initialState={{ density: 'compact' }}
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="primary" onClick={() => { setShowModaldriver(false); }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

