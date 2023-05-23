import { useEffect, useState } from "react";
import { PageTitle } from "../../../../_start/layout/core";
import BlockUi from "@availity/block-ui";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { GetGruposSeguridad, SetGruposSeguridad, getClientesGrupoDeSeguridad, getListadoClientes, getListadoUsuarios, getUsuariosGrupoDeSeguridad, setClientesGrupoDeSeguridad, setUsuariosGrupoDeSeguridad } from "../data/GruposSeguridad";
import { AxiosResponse } from "axios";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Box, IconButton, Tooltip } from "@mui/material";
import { DeleteForever, BorderColor, GroupAdd, PersonAdd, Check } from "@mui/icons-material";
import { Button, Modal } from "react-bootstrap-v5";
import confirmarDialog, { errorDialog, successDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { dualList } from "../models/GruposSeguridadModels";
import DualListBox from "react-dual-listbox";

export default function GruposSeguridad() {

    const [loader, setloader] = useState<boolean>(false);

    const [gruposSeguridad, setgruposSeguridad] = useState<any[]>([]);

    //Clientes select
    const [lstClientesDual, setlstClientesDual] = useState<dualList[]>([]);
    const [lstClientes, setlstClientes] = useState<dualList[]>([]);
    const [selectedClientes, setselectedClientes] = useState([]);
    const [ClientesSelected, setClientesSelected] = useState("");

    //User Select
    const [lstUsuariosDual, setlstUsuariosDual] = useState<dualList[]>([]);
    const [lstUsuarios, setlstUsuarios] = useState<dualList[]>([]);
    const [selectedUsuarios, setselectedUsuarios] = useState([]);
    const [UsuariosSelected, setUsuariosSelected] = useState("");

    const [descripcion, setdescripcion] = useState("");
    const [nombreGrupo, setnombreGrupo] = useState("");
    const [row, setrow] = useState<any>({});
    const [grupoSeguridadId, setgrupoSeguridadId] = useState("");

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

    const [showModal, setshowModal] = useState<boolean>(false);
    const [showModalClientes, setshowModalClientes] = useState<boolean>(false);
    const [showModalUsuarios, setshowModalUsuarios] = useState<boolean>(false);
    const [tittleModal, settittleModal] = useState('');

    let Campos: MRT_ColumnDef<any>[] =
        [{
            accessorKey: 'nombreGrupo',
            header: 'Grupo de Seguridad',
            maxSize: 100
        },
        {
            accessorKey: 'esActivo',
            header: 'Estado',
            Cell({ cell, column, row, table, }) {
                return cell.getValue() ? <span className="badge bg-success">Activo</span> : <span className="badge bg-danger">Inactivo</span>
            },
            maxSize: 60
        },
        {
            accessorKey: 'descripcion',
            header: 'Descripción',
            maxSize: 80
        },
        ];

    useEffect(() => {
        Consultar();
        return () => { }
    }, [])



    const Consultar = () => {
        setloader(true);
        setIsLoading(true);
        setIsRefetching(true)

        //Traemos los grupos de seguridad
        GetGruposSeguridad(null).then((response: AxiosResponse<any>) => {
            setgruposSeguridad(response.data.data);
            setRowCount(response.data.length);
        }).catch(() => {
            setIsError(true);
            setloader(false);
            setIsLoading(false);
            setIsRefetching(false)
        }).finally(() => {
            setloader(false);
        });

        //traemos listado de clientes  
        getListadoClientes().then((response: AxiosResponse<any>) => {
            setlstClientes(response.data);
        }).catch(() => {
            setIsError(true);
            setloader(false);
            setIsLoading(false);
            setIsRefetching(false)
        }).finally(() => {
            setloader(false);
        });

        getListadoUsuarios().then((response: AxiosResponse<any>) => {            
            setlstUsuarios(response.data);
            setloader(false);
            setIsLoading(false);
            setIsRefetching(false)
        }).catch(() => {
            setIsError(true);
            setloader(false);
            setIsLoading(false);
            setIsRefetching(false)
        }).finally(() => {
            setloader(false);
        });

    }



    const setDataModalEdit = (row: any) => {

        setrow(row);
        setnombreGrupo(row.nombreGrupo)
        setdescripcion(row.descripcion);
        settittleModal("Edición Grupos Seguridad");
        setshowModal(true);

    }

    //permite editar nombre, descripción y estado de grupo de seguridad
    const setGrupoSeguridad = (clave: string, esactivo: boolean, grupoSeguridadId: number | null) => {
        confirmarDialog(() => {
            setloader(true);
            var gruposeguridadid = clave == '1' ? null : grupoSeguridadId == null ? row.grupoSeguridadId : grupoSeguridadId;
            SetGruposSeguridad(nombreGrupo, descripcion, gruposeguridadid, clave, esactivo).then((response: AxiosResponse<any>) => {
                console.log(response.data.data)
                if (clave != '1'){
                    if (response.data.data[0][""] == 'Grupo de seguridad modificado Éxitosamente') {
                        let grupoSeguridad = (gruposSeguridad as any[]).map(function (m) {
                            if (m.grupoSeguridadId == row.grupoSeguridadId) {
                                m.nombreGrupo = nombreGrupo;
                                m.descripcion = descripcion;
                            }
                            return m;
                        });
    
                        setgruposSeguridad(grupoSeguridad);
                    }
                    else if (response.data.data[0][""] == 'Grupo de seguridad inactivado Éxitosamente') {
                        let grupoSeguridad = (gruposSeguridad as any[]).map(function (m) {
                            if (m.grupoSeguridadId == grupoSeguridadId) {
                                m.esActivo = esactivo;
                            }
                            return m;
                        });
                        setgruposSeguridad(grupoSeguridad);
                    }
                    else errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
                }else{
                    
                    const gruposseguridad = response.data.data.map((m: any) => {
                        return {descripcion: m.Descripcion, nombreGrupo: m.NombreGrupo, grupoSeguridadId: m.GrupoSeguridadId,
                            esActivo: m.EsActivo}
                    });

                    setgruposSeguridad(gruposseguridad);
                } 
               

                setloader(false);
                setshowModal(false);
            }).catch(() => {
                errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
                setloader(false);
            });
        }, clave != '1' ? `Está seguro que desea modificar el grupo de seguridad` : `Está seguro que crear el grupo de seguridad`
            , clave != '1' ? "Modificar" : "Crear" )

    }

    const setDualListClientes = (grupoSeguridadId: any) => {

        let dual = lstClientes.map((item: any) => {
            return { "value": item.clienteIdString, "label": item.clienteNombre };
        }) as dualList[];

        setlstClientesDual(dual);
        setgrupoSeguridadId(grupoSeguridadId);

        getClientesGrupoDeSeguridad(grupoSeguridadId).then((response: AxiosResponse<any>) => {

            let clienteIds = response.data.map((item: any) => {
                return item.clienteId.toString();
            });
            setselectedClientes(clienteIds);
            setloader(false);
            setIsLoading(false);
            setIsRefetching(false);
            settittleModal("Asignación Clientes");
            setshowModalClientes(true);
        }).catch(() => {
            setIsError(true);
            setloader(false);
            setIsLoading(false);
            setIsRefetching(false)
        }).finally(() => {
            setloader(false);
        });

    }

    function SelectClientes() {
        return (
            <DualListBox className=" mb-3 " canFilter
                options={lstClientesDual}
                selected={selectedClientes}
                onChange={(selected: any) => setselectedClientes(selected)}
            />
        );
    }

    const setDualListUsuarios = (grupoSeguridadId: any) => {

        let dual = lstUsuarios.map((item: any) => {
            return { "value": item.UserId, "label": item.NombreUsuario };
        }) as dualList[];

        setlstUsuariosDual(dual);
        setgrupoSeguridadId(grupoSeguridadId);

        getUsuariosGrupoDeSeguridad(grupoSeguridadId).then((response: AxiosResponse<any>) => {

            let usuariosIds = response.data.map((item: any) => {
                return item.UserId;
            });
            
            setselectedUsuarios(usuariosIds);
            setloader(false);
            setIsLoading(false);
            setIsRefetching(false);
            settittleModal("Asignación Usuarios");
            setshowModalUsuarios(true);
        }).catch(() => {
            setIsError(true);
            setloader(false);
            setIsLoading(false);
            setIsRefetching(false)
        }).finally(() => {
            setloader(false);
        });
    }

    function SelectUsuarios() {
        return (
            <DualListBox className=" mb-3 " canFilter
                options={lstUsuariosDual}
                selected={selectedUsuarios}
                onChange={(selected: any) => setselectedUsuarios(selected)}
            />
        );
    }

    useEffect(() => {
        setUsuariosSelected(selectedUsuarios.join());
        setClientesSelected(selectedClientes.join());
    }, [selectedUsuarios, selectedClientes])

    const setClientesGrupoSeguridad = (grupoSeguridadId: any) => {
        confirmarDialog(() => {
            setClientesGrupoDeSeguridad(grupoSeguridadId, ClientesSelected).then((response: AxiosResponse<any>) => {


                let clienteIds = response.data.map((item: any) => {
                    return item.clienteId;
                });

                setselectedClientes(clienteIds);


                setloader(false);
                setIsLoading(false);
                setIsRefetching(false);
                successDialog("Operación Éxitosa", "");
            }).catch(() => {                
                setIsError(true);
                errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
                setloader(false);
                setIsLoading(false);
                setIsRefetching(false)
            }).finally(() => {
                setloader(false);
            });
        }, `Está seguro que desea modificar los clientes del grupo de seguridad`
            , "Modificar")

        setshowModalClientes(false);

    }

    const setUsuariosGrupoSeguridad = (grupoSeguridadId: any) => {
        confirmarDialog(() => {
            setUsuariosGrupoDeSeguridad(grupoSeguridadId, UsuariosSelected).then((response: AxiosResponse<any>) => {


                let usuariosIds = response.data.map((item: any) => {
                    return item.UserId;
                });

                setselectedUsuarios(usuariosIds);


                setloader(false);
                setIsLoading(false);
                setIsRefetching(false);
                successDialog("Operación Éxitosa", "");
            }).catch(() => {                
                setIsError(true);
                errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
                setloader(false);
                setIsLoading(false);
                setIsRefetching(false)
            }).finally(() => {
                setloader(false);
            });
        }, `Está seguro que desea modificar los usuarios del grupo de seguridad`
            , "Modificar")

        setshowModalUsuarios(false);

    }

    return (<>
        <PageTitle>Grupos De Seguridad</PageTitle>
        <BlockUi tag="div" keepInView blocking={loader ?? false}  >
            {(gruposSeguridad.length != 0) && (<MaterialReactTable
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
                data={gruposSeguridad}
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
                initialState={{ density: 'compact' }}
                positionActionsColumn="last"
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'block', gap: '1rem', marginLeft: 'auto', marginRight: 'auto' }}>
                        <Tooltip arrow placement="top" title="Editar">
                            <IconButton onClick={() => {
                                setDataModalEdit(row.original);
                            }}>
                                <BorderColor />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="top" title="Asignar Clientes">
                            <IconButton onClick={() => {
                                setDualListClientes(row.original.grupoSeguridadId);
                            }}>
                                <GroupAdd />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="top" title="Asociar Usuarios">
                            <IconButton onClick={() => {
                                setDualListUsuarios(row.original.grupoSeguridadId);
                            }}>
                                <PersonAdd />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="top" title={row.original.esActivo ? "Inactivar" : "Activar"}>
                            <IconButton onClick={() => {
                                setGrupoSeguridad('3', !row.original.esActivo, row.original.grupoSeguridadId);
                            }
                            }>
                                {(row.original.esActivo == true) && <DeleteForever />}
                                {(row.original.esActivo == false) && <Check />}
                            </IconButton>
                        </Tooltip>
                    </Box>
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
                renderTopToolbarCustomActions={({ table }) => (
                    <Box
                        sx={{ justifyContent: 'flex-start', alignItems: 'center', flex: 1, display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                    >
                        <button className="m-2 ms-0 btn btn-sm btn-primary" type="button" onClick={() => { setshowModal(true); 
                            settittleModal('Crear grupo de seguridad'); 
                            setnombreGrupo('');
                            setdescripcion('');
                            }}>
                            {/* <i className="bi-plus-square"></i> */}
                            Crear Grupo</button>
                    </Box>
                )}
            />)}
        </BlockUi>
        <Modal
            show={showModal}
            onHide={setshowModal}
            size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{tittleModal}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                        <div className="">
                            <label className="control-label label-sm font-weight-bold" htmlFor="nombregrupo" style={{ fontWeight: 'bold' }}>Nombre Grupo:</label>
                            <input className="form-control  input input-sm " id={"nombregrupo"} onChange={(e) => setnombreGrupo(e.target.value)} value={nombreGrupo}></input>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                        <div className="">
                            <label className="control-label label-sm font-weight-bold" htmlFor="descripcion" style={{ fontWeight: 'bold' }}>Descripción:</label>
                            <textarea className="form-control  input input-sm " id={"descripcion"} onChange={(e) => setdescripcion(e.target.value)}
                                rows={3} value={descripcion}></textarea>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="primary" onClick={() => {
                    tittleModal != 'Crear grupo de seguridad' ? 
                    setGrupoSeguridad('2', true, null) : 
                    setGrupoSeguridad('1', true, null);
                }}>
                    Guardar
                </Button>
                <Button type="button" variant="secondary" onClick={() => { setshowModal(false); }}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
        <Modal
            show={showModalClientes}
            onHide={setshowModalClientes}
            size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{tittleModal}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <SelectClientes />
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="primary" onClick={() => {
                    setClientesGrupoSeguridad(grupoSeguridadId);
                }}>
                    Guardar
                </Button>
                <Button type="button" variant="secondary" onClick={() => { setshowModalClientes(false); }}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
        <Modal
            show={showModalUsuarios}
            onHide={setshowModalUsuarios}
            size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{tittleModal}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <SelectUsuarios />
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="primary" onClick={() => {
                    setUsuariosGrupoSeguridad(grupoSeguridadId);
                }}>
                    Guardar
                </Button>
                <Button type="button" variant="secondary" onClick={() => { setshowModalUsuarios(false); }}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}