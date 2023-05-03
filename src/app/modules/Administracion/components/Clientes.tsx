import BlockUi from "@availity/block-ui";
import { PageTitle } from "../../../../_start/layout/core";
import { useEffect, useState } from "react";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import MaterialReactTable from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Download, Person } from "@mui/icons-material";
import { GetClientesAdministradores } from "../data/Clientes";
import { AxiosResponse } from "axios";

export default function Clientes (){
    const [loader, setloader] = useState<boolean>(false);
    const [DatosClientes, setDatosClientes] = useState<any[]>([]);
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
    let Campos = {
        "Principal" : [{
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
                return ((row.row.original.usuarioNombre != null ? String(row.row.original.usuarioNombre).replace(",", ""): ""))
            },
            size: 100
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            Header: 'Estado',
            Cell(row: any) {
                return (<span className="badge bg-primary">{row.row.original.estado}</span>)
            },
            size: 100
        }
    ]
    };
useEffect(() =>{

    Consultar();
    return ()=>{}
},[])
    const Consultar = () =>{
        setloader(true);
        setIsLoading(true);
        setIsRefetching(true)
        GetClientesAdministradores(null).then((response:AxiosResponse<any>) =>{
            setDatosClientes(response.data);
            setloader(false);
            setIsLoading(false);
            setIsRefetching(false)
            setRowCount(response.data.length);
        }).catch(() =>{
            setIsError(true);
            setloader(false);
            setIsLoading(false);
            setIsRefetching(false)
        }).finally(()=>{
            setloader(false);
        });
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
                columns={Campos['Principal']}
                data={DatosClientes}
                enableEditing
                editingMode="modal" //default         
                enableColumnOrdering
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
                      <Tooltip arrow placement="top" title="Gestionar cliente">
                        <IconButton onClick={() => 
                            {alert("Funciona")}
                          }>
                          <Person />
                        </IconButton>
                      </Tooltip>
                      <Tooltip arrow placement="top" title="Descargar detallado del cliente">
                        <IconButton onClick={() => 
                            {alert("Funciona descarga")}
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
    </>
    )
}