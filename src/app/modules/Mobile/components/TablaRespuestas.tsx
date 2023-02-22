import React, { useEffect, useState } from "react";

import { useDataPreoperacional } from "../core/provider";
import { Preoperacional, Respuestas } from "../models/respuestas";

import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import type {
    ColumnFiltersState,
    PaginationState,
    SortingState,
} from '@tanstack/react-table';
import { Box, IconButton, Tooltip } from "@mui/material";
import { FormatListBulleted, Message } from "@mui/icons-material";
import { getRespuestas } from "../data/dataPreoperacional";
import { AxiosResponse } from "axios";


type Props = {
};

export const TablaRespuestas: React.FC<Props> = () => {

    const [lstRespuestas, setlstRespuestas] = useState<Respuestas[]>([]);

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

    let listadoCampos: MRT_ColumnDef<Respuestas>[] =

        [
            {
                accessorKey: 'Usuario',
                header: 'Usuario',
                size: 100
            },
            {
                accessorKey: 'Pregunta',
                header: 'Pregunta',
                size: 100
            },
            {
                accessorKey: 'Respuesta',
                header: 'Respuesta',
                size: 80
            },
            {
                accessorKey: 'Secuencia',
                header: 'Secuencia',
                size: 100
            },
            {
                accessorKey: 'Fecha',
                header: 'Fecha',
                size: 80
            }
        ];

    getRespuestas(251).then((respuesta: AxiosResponse<Respuestas[]>) => {
        setlstRespuestas(respuesta.data);
        setRowCount(respuesta.data.length);
    });

    // useEffect(() => {

    // }, [Encabezados])



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
                data={lstRespuestas}
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
        </>
    )

}