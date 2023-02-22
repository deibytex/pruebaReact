import React, { useEffect, useState } from "react";

import { useDataPreoperacional } from "../core/provider";
import { Preoperacional } from "../models/respuestas";

import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import type {
    ColumnFiltersState,
    PaginationState,
    SortingState,
} from '@tanstack/react-table';
import { Box, IconButton, Tooltip } from "@mui/material";
import { FormatListBulleted, Message } from "@mui/icons-material";


type Props = {
};

export const TablaProperacional: React.FC<Props> = () => {

    const {  Encabezados } = useDataPreoperacional();
    const [lstVehiculosConPreoperacional, setlstVehiculosConPreoperacional] = useState<Preoperacional[]>([]);

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

    let listadoCampos: MRT_ColumnDef<Preoperacional>[] =

        [
            {
                accessorKey: 'Conductor',
                header: 'Conductor',
                size: 100
            },
            {
                accessorKey: 'FechaHoraString',
                header: 'Fecha',
                size: 100
            },
            {
                accessorKey: 'Description',
                header: 'Activo',
                size: 80
            },
            {
                accessorKey: 'clienteNombre',
                header: 'Cliente',
                size: 100
            },
            {
                accessorKey: 'Estado',
                header: 'Estado',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() == true) ? <span className="badge bg-danger">No Aprobado</span> : <span className="badge bg-primary">Aprobado</span>
                }
            },
            {
                accessorKey: 'EsGestionado',
                header: 'Estado Gestion',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() == null) ? <span className="badge bg-primary"></span> : (cell.getValue() == true) ? <span className="badge bg-primary">Gestionado</span> : <span className="badge bg-warning">En Gestion</span>
                }
            },
            {
                accessorKey: 'GetorNombre',
                header: 'Gestor',
                size: 100
            }

        ];

    useEffect(() => {

        setlstVehiculosConPreoperacional(Encabezados as Preoperacional[]);
        setRowCount((Encabezados as Preoperacional[]).length);

    }, [Encabezados])



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
                    columns={listadoCampos}
                    data={lstVehiculosConPreoperacional}
                // editingMode="modal" //default         
                    enableTopToolbar={false}
                    enableColumnOrdering
                    enableEditing
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
                    renderRowActions={({ row, table }) => (

                        <Box sx={{ display: 'flex', gap: '1rem' }}>
            
                         <Tooltip arrow placement="left" title="Obervaciones">
                            <IconButton >
                              <Message/>
                            </IconButton>
                          </Tooltip>

                          <Tooltip arrow placement="left" title="Respuestas">
                            <IconButton >
                              <FormatListBulleted/>
                            </IconButton>
                          </Tooltip>
            
                         
                        </Box>
                      )
                      }
                />
        </>
    )

}