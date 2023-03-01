import React, { useEffect, useState } from "react";

import { useDataPreoperacional } from "../core/provider";
import { Preoperacional, sinPreoperacional } from "../models/dataModels";

import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import type {
    ColumnFiltersState,
    PaginationState,
    SortingState,
} from '@tanstack/react-table';
import { Box, IconButton, Tooltip } from "@mui/material";
import { FormatListBulleted, Message } from "@mui/icons-material";
import moment from "moment";
import { msToTime } from "../../../../_start/helpers/Helper";
import { Button } from "react-bootstrap-v5";
import { ExportarExcel } from "./ExportarExcel";
import BlockUi from "react-block-ui";
import "../../../../../node_modules/@availity/block-ui/src/BlockUi.css";
import "../../../../../node_modules/@availity/block-ui/src/Loader.css";


type Props = {
};

export const TablaSinProperacional: React.FC<Props> = () => {

    const { Encabezados, vehiculosSinPreoperacional, Visible } = useDataPreoperacional();
    const [lstVehiculosSinPreoperacional, setlstVehiculosSinPreoperacional] = useState<sinPreoperacional[]>([]);

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

    let listadoCampos: MRT_ColumnDef<sinPreoperacional>[] =

        [
            {
                accessorKey: 'Conductor',
                header: 'Conductor',
                size: 100
            },
            {
                accessorKey: 'Vehiculo',
                header: 'Vehiculo',
                size: 100
            },
            {
                accessorKey: 'RegistrationNumber',
                header: 'Descripción',
                size: 80
            },
            {
                accessorKey: 'FechaViaje',
                header: 'Fecha Viaje',
                size: 100,
                Cell({ cell, column, row, table, }) {
                    return moment(cell.getValue() as Date).format("DD-MM-YYYY HH:mm");
                }
            },
            {
                accessorKey: 'DistanciaRecorrida',
                header: 'Kms Recorridos',
                size: 80
            },
            {
                accessorKey: 'CantViajes',
                header: 'Nro. Viajes',
                size: 80
            },
            {
                header: 'Edad',
                Cell({ cell, column, row, table, }) {
                    let duration = moment.duration(moment().diff(row.original.FechaViaje))
                    return (
                        <>
                            {
                                `${msToTime(duration.asMilliseconds())}`
                            }
                        </>

                    )
                },
                size: 80
            }

        ];

    useEffect(() => {

        let filtered: sinPreoperacional[] = [];
        vehiculosSinPreoperacional?.map((arr) => {
            let filter = Encabezados?.filter(function (item) {
                return (item.AssetId == arr.AssetId && item.DriverId == arr.DriverId)
            })
            filter != null ? filtered.push(arr) : filtered.push();
        })
        setlstVehiculosSinPreoperacional(filtered);
        setRowCount(filtered.length);

    }, [Encabezados, vehiculosSinPreoperacional])



    return (
        <BlockUi tag="span" className="bg-primary" keepInView blocking={(Visible == undefined ? true : Visible)}>
            <>
                <ExportarExcel NombreArchivo="ReporteVehiculosSinPreoperacional" tipoDescarga={1} />
                <div className="mt-5">
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
                        data={lstVehiculosSinPreoperacional}
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
            </>
        </BlockUi>
    )

}