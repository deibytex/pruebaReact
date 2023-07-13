import React, { useEffect, useState } from "react";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import type {
    ColumnFiltersState,
    PaginationState,
    SortingState,
} from '@tanstack/react-table';
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Update } from "@mui/icons-material";
import { Button } from "react-bootstrap-v5";
import { UpdateCorreos } from "./modalUpdatedCorreos";
import confirmarDialog, { successDialog, errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { useDataCorreosTx } from "../../core/provider";
import { deleteCorreosTx } from "../../data/dataCorreosTx";
import { CorreosTx } from "../../models/dataModels";

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
    const [TipoCorreoPrincipal, setTipoCorreoPrincipal] = useState(4);
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
            let TipoCorreo = correos.filter(val =>val.TipoEnvio=="Principal");
            (TipoCorreo.length != 0 ? setTipoCorreoPrincipal(TipoCorreo[0].tipoCorreo) :setTipoCorreoPrincipal(4));
        }
    }, [CorreosTx, ListaNotifacionId])


    const modalSetCorreo = (correoId: number | null, tipoCorreo: number | null, correo: string | null) => {
        correoId ? setCorreoId(correoId) : setCorreoId(0);
        tipoCorreo ? setTipoCorreo(tipoCorreo) : setTipoCorreo(0);
        correo ? setCorreo(correo) : setCorreo("");
        !correoId ? settituloModalCorreos("Agregar correo") : settituloModalCorreos("Modificar correo");
        showModal();
    }

    const deleteCorreo = (row: any) => {
        //Verifico si el correo es el unico que viene marcado desde la base de datos como principal
        let EsUnico =  lstCorreosTx.filter((item:any) =>{
           return (item.tipoCorreo == TipoCorreoPrincipal ? item : null)
        });
        
        //Si es unico no dejo que lo eliminen, hasta que no haya mas de 1 como principal
        if(EsUnico.length == 1){
            let filtro = EsUnico.filter((val:any) =>{
                return (val.CorreoTxIdS == row.original.CorreoTxIdS ? val:null);
            });
            if(filtro.length == 1){
                errorDialog("No puede eliminar este correo ya que es el unico principal","");
                return false;
            }
        }
        
        //Sino elimino el correo.
        confirmarDialog(() => {
            deleteCorreosTx(row.original.CorreoTxIdS).then((response) => {
                if (response.statusText == "OK") {
                    let correosFilter = (CorreosTx as CorreosTx[]).filter(lis => lis.CorreoTxIdS != row.original.CorreoTxIdS);
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
                    muiTableHeadCellProps={{
                        sx: (theme) => ({
                          fontSize : 14,
                          fontStyle: 'bold',  
                        color: 'rgb(27, 66, 94)'
                        
                      }),
                    }}
                    columns={listadoCampos}
                    data={lstCorreosTx}
                    // editingMode="modal" //default         
                    enableTopToolbar={true}
                    enableDensityToggle={false}
                    enablePagination={false}
                    enableRowVirtualization
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
                    initialState={{density: 'compact'}}
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
                                            deleteCorreo(row);
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