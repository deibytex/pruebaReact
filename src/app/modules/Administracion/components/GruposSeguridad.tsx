import { useEffect, useState } from "react";
import { PageTitle } from "../../../../_start/layout/core";
import BlockUi from "@availity/block-ui";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { GetGruposSeguridad } from "../data/GruposSeguridad";
import { AxiosResponse } from "axios";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Download, Edit, FireTruckTwoTone, Person } from "@mui/icons-material";

export default function GruposSeguridad() {

    const [loader, setloader] = useState<boolean>(false);

    const [gruposSeguridad, setgruposSeguridad] = useState<any[]>([]);

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
        console.log(gruposSeguridad);
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
                                // EditarCampos(row)
                            }}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="top" title="Asignar Clientes">
                            <IconButton onClick={() => {
                                // PanelConsultas(row.original.ClienteId)
                                // consultarVehiculos(row.original.ClienteId);
                            }}>
                                <FireTruckTwoTone />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="top" title="Asociar Usuarios">
                            <IconButton onClick={() => {
                                // PanelConsultas(row.original.ClienteId)
                                // consultarDrivers(row.original.ClienteId);
                            }}>
                                <Person />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="top" title="Inactivar">
                            <IconButton onClick={() => {
                                //  GetReporteConfiguracionAssets(row.original.ClienteId) 
                            }
                            }>
                                <Download />
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
    </>)
}