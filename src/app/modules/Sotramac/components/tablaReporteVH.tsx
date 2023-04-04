import { useDataSotramac } from "../core/provider";
import React, { useEffect, useState } from "react";
import {  ReporteSotramac } from "../models/dataModels";
import { Button,  Modal } from "react-bootstrap-v5";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { getReporteSotramacVH } from "../data/dataSotramac";
import { AxiosResponse } from "axios";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import BlockUi from "@availity/block-ui";
type Props = {
    show: boolean;
    handleClose: () => void;
    title?: string;
    consultaReporteVH: boolean;
}

export const ModalTablaReporteVH: React.FC<Props> = ({ show, handleClose, title, consultaReporteVH }) => {

    const { fechaInicial, fechaFinal, assetSelected, assetTypeId,loader, setloader } = useDataSotramac();

    const [lstReporteSotramacVh, setlstReporteSotramacVh] = useState<ReporteSotramac[]>([]);

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

    let listadoCampos: MRT_ColumnDef<ReporteSotramac>[] =

        [
            {
                accessorKey: 'Posicion',
                header: 'Posición',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'Vehiculo',
                header: 'Vehículo',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'DistanciaRecorridaAcumulada',
                header: 'Distancia Recorrida Acumulada',
                size: 100,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'ConsumodeCombustibleAcumulado',
                header: 'Consumo de Combustible Acumulado',
                size: 100,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'UsoDelFreno',
                header: 'Uso Del Freno',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'PorDeInercia',
                header: '% De Inercia',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'PorDeRalenti',
                header: '% De Ralentí',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'Co2Equivalente',
                header: 'CO2 Equivalente Ton/m3',
                size: 100,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'GalEquivalente',
                header: 'Gal - equivalentes/año',
                size: 100,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'ConsumokWh',
                header: 'Consumo (kWh)',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'COmgkWh',
                header: 'CO (mg/kWh)',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'NOxmgkWh',
                header: 'NOx(mg/kWh)',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'PMMasamgkWh',
                header: 'PM Masa (mg/kWh)',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'VelPromedio',
                header: 'Velocidad promedio',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            }
        ];

        useEffect(() => {
            if (consultaReporteVH)
            {
                setloader(true);
            getReporteSotramacVH(fechaInicial, fechaFinal, assetSelected, assetTypeId.toString()).then((respuesta: AxiosResponse<ReporteSotramac[]>) => {
                setlstReporteSotramacVh(respuesta.data);
                setRowCount(respuesta.data.length);
                setloader(false);
            }).catch( () => {
                errorDialog("Visualizar Informe", "Error al recibir datos del servidor.")
                setloader(false);
            }    
            ); }
    
        }, [consultaReporteVH]) 

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
                <BlockUi tag="div"  keepInView blocking={loader ?? false}  message="Cargando datos, favor espere.....">
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
                            data={lstReporteSotramacVh}
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
                    </BlockUi>
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