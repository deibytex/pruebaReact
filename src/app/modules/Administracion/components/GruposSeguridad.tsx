import { useEffect, useState } from "react";
import { PageTitle } from "../../../../_start/layout/core";
import BlockUi from "@availity/block-ui";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { GetGruposSeguridad } from "../data/GruposSeguridad";
import { AxiosResponse } from "axios";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Box, IconButton, Tooltip } from "@mui/material";
import { DeleteForever, BorderColor, GroupAdd, PersonAdd } from "@mui/icons-material";
import { Button, Modal } from "react-bootstrap-v5";

export default function GruposSeguridad() {

    const [loader, setloader] = useState<boolean>(false);

    const [gruposSeguridad, setgruposSeguridad] = useState<any[]>([]);

    const [descripcion, setdescripcion] = useState("");
    const [nombreGrupo, setnombreGrupo] = useState("");

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

    let Campos: MRT_ColumnDef<any>[] =
        [{
            accessorKey: 'nombreGrupo',
            header: 'Grupo de Seguridad'
        },
        {
            accessorKey: 'esActivo',
            header: 'Estado',
            Cell({ cell, column, row, table, }) {
                return cell.getValue() ? <span className="badge bg-success">Activo</span> : <span className="badge bg-danger">Inactivo</span>
            }
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
        GetGruposSeguridad(null).then((response: AxiosResponse<any>) => {
            setgruposSeguridad(response.data.data);
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

    const setGrupoSeguridad = (row: any) => {
        setnombreGrupo(row.nombreGrupo)
        setdescripcion(row.descripcion);
        console.log(row.grupoSeguridadId);
        setshowModal(true);
        // if (row != Consultas[1].Cliente) {
        //     setloader(true);
        //     GetAssets(row).then((response: AxiosResponse<any>) => {
        //         let Decomisionados = response.data.data.filter((item: any) => {
        //             return item.userState == 'Decommissioned'
        //         });
        //         setDecomisionado(Decomisionados.length);
        //         let Activos = response.data.data.filter((item: any) => {
        //             return item.userState != 'Decommissioned'
        //         });
        //         setActivo(Activos.length)
        //         setDatosAssets(response.data.data);
        //         let Consult = [...Consultas]
        //         Consult[1].Cliente = row;
        //         Consult[1].Data = response.data.data;
        //         setConsultas(Consult);
        //         setloader(false);
        //         setShowModalactivos(true)
        //     }).catch(() => {
        //         console.log("error");
        //         setloader(false);
        //     });
        // }
        // else{
        //     setDatosAssets(Consultas[1].Data);
        //     setShowModalactivos(true)
        // }
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
                                setGrupoSeguridad(row.original)
                            }}>
                                <BorderColor />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="top" title="Asignar Clientes">
                            <IconButton onClick={() => {
                                // PanelConsultas(row.original.ClienteId)
                                // consultarVehiculos(row.original.ClienteId);
                            }}>
                                <GroupAdd />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="top" title="Asociar Usuarios">
                            <IconButton onClick={() => {
                                // PanelConsultas(row.original.ClienteId)
                                // consultarDrivers(row.original.ClienteId);
                            }}>
                                <PersonAdd />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="top" title="Inactivar">
                            <IconButton onClick={() => {
                                //  GetReporteConfiguracionAssets(row.original.ClienteId) 
                            }
                            }>
                                <DeleteForever />
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
            />)}
        </BlockUi>
        <Modal
            show={showModal}
            onHide={setshowModal}
            size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{"Edición Grupo de Seguridad"}</Modal.Title>
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
                            // setObservacion(obervacionGestion, 'false');
                        }}>
                            Guardar
                        </Button>
                <Button type="button" variant="secondary" onClick={() => { setshowModal(false); }}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}