import React, { useEffect, useState } from "react";

import { useDataPreoperacional } from "../core/provider";
import { observaciones, Preoperacional } from "../models/respuestas";

import MaterialReactTable, { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import type {
    ColumnFiltersState,
    PaginationState,
    SortingState,
} from '@tanstack/react-table';
import { Box, IconButton, Tooltip } from "@mui/material";
import { FormatListBulleted, Message, VerifiedUser } from "@mui/icons-material";
import { TablaRespuestas } from "./TablaRespuestas";
import { Observaciones } from "./Observaciones";
import { getEncabezados, setGestor, setObservaciones } from "../data/dataPreoperacional";
import { FechaServidor } from "../../../../_start/helpers/Helper";
import { Console } from "console";
import confirmarDialog, { errorDialog, successDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { boolean } from "yup";
import { Button } from "react-bootstrap-v5";
import { ExportarExcel } from "./ExportarExcel";



type Props = {
    clienteid: string
    fecha: string;
    filtro: string
};

export const TablaProperacional: React.FC<Props> = ({ clienteid, fecha, filtro }) => {

    const { Encabezados, UserId, setEncabezados } = useDataPreoperacional();
    const [lstVehiculosConPreoperacional, setlstVehiculosConPreoperacional] = useState<Preoperacional[]>([]);
    const [encabezadoId, setencabezadoId] = useState(0);
    const [observaciones, setobservaciones] = useState("");
    const [esgestionado, setesgestionado] = useState(false);

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
    const [show2, setShow2] = useState(false);

    const handleClose = () => {
        setShow(false);
    };
    const showModal = () => {
        setShow(true);
    }

    const handleClose2 = () => {
        setShow2(false);
    };
    const showModa2 = () => {
        setShow2(true);
    }

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
                    return row.original.Estado == 1 && (cell.getValue() == true) ? <span className="badge bg-primary">Gestionado</span> :
                        row.original.Estado == 1 && (cell.getValue() == null) ? <span className="badge bg-danger">No Gestionado</span> :
                            row.original.Estado == 1 && (cell.getValue() == false) ? <span className="badge bg-warning">En Gestion</span> :
                                ""
                }
            },
            {
                accessorKey: 'GetorNombre',
                header: 'Gestor',
                size: 100
            }

        ];

    useEffect(() => {
        if (filtro === "2" || filtro === "") {
            setlstVehiculosConPreoperacional(Encabezados as Preoperacional[]);
            setRowCount((Encabezados as Preoperacional[]).length);
        }
        else if (filtro === "0") {
            let encabezados = (Encabezados as Preoperacional[]).filter(est => est.Estado.toString() == filtro);
            setlstVehiculosConPreoperacional(encabezados as Preoperacional[]);
            setRowCount(encabezados.length);
        }
        else {
            let encabezados = (Encabezados as Preoperacional[]).filter(est => est.Estado.toString() == filtro);
            setlstVehiculosConPreoperacional(encabezados as Preoperacional[]);
            setRowCount(encabezados.length);
        }


    }, [Encabezados, filtro])

    const modalrespuetas = (encabezadoId: number) => {
        setencabezadoId(encabezadoId);
        showModal()
    }

    const modalObervaciones = (Obervaciones: string, encabezadoId: number, EsGestionado: boolean) => {
        setobservaciones(Obervaciones);
        setencabezadoId(encabezadoId);
        setesgestionado(EsGestionado);
        showModa2()
    }

    const setGestorPreoperacional = (encabezadoId: number) => {

        let GestorObervaciones: any = {};
        GestorObervaciones = {
            fecha: FechaServidor,
            value: "Gestor Asignado",
            notificar: "false",
            EsCerrado: null
        };

        confirmarDialog(() => {
            setGestor(UserId as string, '[' + JSON.stringify(GestorObervaciones) + ']', false, encabezadoId).then(() => {
                getEncabezados(clienteid, fecha, 'null').then(

                    (response) => {

                        setEncabezados(response.data);

                    });
                successDialog("Operación Éxitosa.", "");
            }).catch(() => {
                errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
            });
        }, `Desea usted gestionar este preoperacional`, "Sí");
    }

    if ((Encabezados as Preoperacional[]).length > 0) {
        return (
            <>
                <ExportarExcel NombreArchivo="ReporteVehiculosSinPreoperacional" tipoDescarga={0}/>
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

                            <>
                                <Box sx={{ display: 'flex', gap: '1rem' }}>
                                    {(row.original.Estado == 1 && row.original.EsGestionado != null) ?
                                        <Tooltip arrow placement="left" title="Obervaciones">
                                            <IconButton
                                                onClick={() => {
                                                    modalObervaciones(row.original.Observaciones, row.original.EncabezadoId, row.original.EsGestionado);
                                                }}
                                            >
                                                <Message />
                                            </IconButton>
                                        </Tooltip> :
                                        <></>

                                    }



                                    <Tooltip arrow placement="left" title="Respuestas">
                                        <IconButton
                                            onClick={() => {
                                                modalrespuetas(row.original.EncabezadoId);
                                            }}
                                        >
                                            <FormatListBulleted />
                                        </IconButton>
                                    </Tooltip>
                                    {(row.original.Estado == 1 && row.original.EsGestionado == null) ?

                                        <Tooltip arrow placement="left" title="Gestionar">
                                            <IconButton
                                                onClick={() => {
                                                    setGestorPreoperacional(row.original.EncabezadoId);
                                                }}
                                            >
                                                <VerifiedUser />
                                            </IconButton>
                                        </Tooltip>
                                        : <></>
                                    }
                                </Box>
                            </>
                        )
                        }
                    />
                </div>
                <TablaRespuestas show={show} handleClose={handleClose} title={"Repuestas"} EncabezadoId={encabezadoId} />
                <Observaciones show={show2} handleClose={handleClose2} title={"Observaciones"} observaciones={observaciones}
                    encabezadoid={encabezadoId} esgestionado={esgestionado} clienteid={clienteid} fecha={fecha} />
            </>
        )
    }
    return (
        <>
            <br />
            <div>
                <h6 style={{ fontWeight: 'bold', textAlign: 'center' }}>No hay vehículos con preoperacional</h6>
            </div>
        </>
    )

}