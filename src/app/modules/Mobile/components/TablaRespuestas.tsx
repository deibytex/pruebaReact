import React, { useEffect, useState } from "react";

import { useDataPreoperacional } from "../core/provider";
import { Preoperacional, Respuestas } from "../models/dataModels";

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
import { Button, Modal } from "react-bootstrap-v5";


type Props = {
    show:boolean;
    handleClose: () => void;
    title?:string;
    EncabezadoId: number;
};

export const TablaRespuestas: React.FC<Props> = ({show, handleClose,title, EncabezadoId }) => {

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
                accessorKey: 'Secuencia',
                header: 'Secuencia',
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
        ];

        useEffect(() => {

            getRespuestas(EncabezadoId.toString()).then((respuesta: AxiosResponse<Respuestas[]>) => {
                setlstRespuestas(respuesta.data);
                setRowCount(respuesta.data.length);
            });
    
        }, [EncabezadoId]) 


    return (
        <>
         <Modal 
      show={show} 
      onHide={handleClose} 
       size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="row">
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
                muiTableBodyRowProps={({ row }) => ({
                          sx: {
                            backgroundColor:
                              row.getValue<string>('Respuesta').trim() === 'Vigente' || row.getValue<string>('Respuesta').trim() === 'Bueno'
                              || row.getValue<string>('Respuesta').trim() === 'B' || row.getValue<string>('Respuesta').trim() === 'b'
                              ? 'rgba(212, 237, 218, 1)' : 
                              row.getValue<string>('Respuesta').trim() === null || row.getValue<string>('Respuesta').trim() === "" 
                              || row.getValue<string>('Respuesta').trim() === undefined  ? 'rgba(255, 243, 205, 1)' : 
                              row.getValue<string>('Respuesta').trim() === 'Malo' || row.getValue<string>('Respuesta').trim() === 'Vencida'
                              || row.getValue<string>('Respuesta').trim() === 'Mala' || row.getValue<string>('Respuesta').trim() === 'M'
                              || row.getValue<string>('Respuesta').trim() === 'm' ? 'rgba(248, 215, 218, 1)' :  'rgba(255, 243, 205, 1)' 
                              
                         },
                        })}
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
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
            
        </>
    )

}