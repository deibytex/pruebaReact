import React, { useEffect, useState } from "react";

import { useDataCorreosTx } from "../core/provider";

import MaterialReactTable, { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import type {
    ColumnFiltersState,
    PaginationState,
    SortingState,
} from '@tanstack/react-table';
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, FormatListBulleted, Message, Update, Upgrade, VerifiedUser } from "@mui/icons-material";
import { FechaServidor } from "../../../../_start/helpers/Helper";
import { Console } from "console";
import confirmarDialog, { errorDialog, successDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { boolean } from "yup";
import { Button } from "react-bootstrap-v5";
import "../../../../../node_modules/@availity/block-ui/src/BlockUi.css";
import "../../../../../node_modules/@availity/block-ui/src/Loader.css";
import { CorreosTx } from "../models/dataModels";
import { UpdateCorreos } from "./modalUpdatedCorreos";
import { deleteCorreosTx } from "../data/dataCorreosTx";


type Props = {
};

export const TablaCorreosTx: React.FC<Props> = () => {

    const { CorreosTx, ListaNotifacionId, setCorreoId, setCorreo, setTipoCorreo, setCorreosTx } = useDataCorreosTx();

    const [lstCorreosTx, setlstCorreosTx] = useState<CorreosTx[]>([]);

    const [tituloModalCorreos, settituloModalCorreos] = useState('');

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

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    };
    const showModal = () => {
        setShow(true);
    }

    let listadoCampos: MRT_ColumnDef<CorreosTx>[] =

        [
            {
                accessorKey: 'correo',
                header: 'Correo',
                size: 100
            },
            {
                accessorKey: 'TipoEnvio',
                header: 'Tipo Correo',
                size: 100
            }
        ];

    useEffect(() => {
        if (CorreosTx.length > 0 && ListaNotifacionId != 0) {
            let correos = (CorreosTx as CorreosTx[]).filter(lis => lis.ListaClienteNotifacionId == ListaNotifacionId);
            setlstCorreosTx(correos);
            setRowCount(correos.length);
        }
    }, [CorreosTx, ListaNotifacionId])


    const modalSetCorreo = (correoId: number | null, tipoCorreo: number | null, correo: string | null) => {
        correoId ? setCorreoId(correoId) : setCorreoId(0);
        tipoCorreo ? setTipoCorreo(tipoCorreo) : setTipoCorreo(0);
        correo ? setCorreo(correo) : setCorreo("");
        !correoId ? settituloModalCorreos("Agregar correo") : settituloModalCorreos("Modificar correo");
        showModal();
    }

    const deleteCorreo = (CorreoId: number) => {
        confirmarDialog(() => {
            deleteCorreosTx(CorreoId).then((response) => {
                if (response.statusText == "OK") {
                    let correosFilter = (CorreosTx as CorreosTx[]).filter(lis => lis.CorreoTxIdS != CorreoId);
                    setCorreosTx(correosFilter);
                    successDialog("Operación Éxitosa", "");
                } else
                    errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
            }).catch((error) => {
                    errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
                });
        }, `Esta seguro que desea eliminar el correo`
            , "Eliminar");
    }

    return (
        // <BlockUi tag="span" className="bg-primary" keepInView blocking={(Visible == undefined ? true : Visible)}>
        <>
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
                    data={lstCorreosTx}
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

                        <>
                            <Box sx={{ display: 'flex', gap: '1rem' }}>
                                <Tooltip arrow placement="left" title="modificar">
                                    <IconButton
                                        onClick={() => {
                                            modalSetCorreo(row.original.CorreoTxIdS, row.original.tipoCorreo, row.original.correo);
                                        }}
                                    >
                                        <Update />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip arrow placement="left" title="eliminar">
                                    <IconButton
                                        onClick={() => {
                                            deleteCorreo(row.original.CorreoTxIdS);
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </>
                    )
                    }
                />
                <div className="mt-5" style={{ textAlign: 'right' }}>
                    <Button type="button" variant="primary" onClick={() => {
                        modalSetCorreo(null, null, null);;
                    }}>
                        Agregar Correo
                    </Button>
                </div>

            </div>
            <UpdateCorreos show={show} handleClose={handleClose} title={tituloModalCorreos} />
        </>
        // </BlockUi>
    )
}