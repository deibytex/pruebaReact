import { useDataSotramac } from "../core/provider";
import React, { useEffect, useState } from "react";
import { ReporteSotramac } from "../models/dataModels";
import { Button, Form, Modal } from "react-bootstrap-v5";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { getReporteSotramacVHxCO } from "../data/dataSotramac";
import { AxiosResponse } from "axios";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import BlockUi from "@availity/block-ui";
type Props = {
    show: boolean;
    handleClose: () => void;
    title?: string;
    consultaReportVHxCO: boolean;
}

export const ModalTablaReporteVHxCO: React.FC<Props> = ({ show, handleClose, title, consultaReportVHxCO }) => {

    const { fechaInicial, fechaFinal, driverSelected, assetSelected, assetTypeId ,loader,setloader} = useDataSotramac();

    const [lstReporteSotramacVHxCO, setlstReporteSotramacVHxCO] = useState<ReporteSotramac[]>([]);

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
                accessorKey: 'Cedula',
                header: 'Cédula',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'Nombre',
                header: 'Nombre conductor',
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
                header: 'Distancia Recorrida Acumulada (km)',
                size: 100,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'ConsumodeCombustibleAcumulado',
                header: 'Consumo de combustible acumulado (M3)',
                size: 100,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'DistanciaRecorridaUltimoDia',
                header: 'Distancia recorrida último dia (km)',
                size: 100,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'RendimientoCumbustibleAcumulado',
                header: 'Rendimiento de combustible acumulado (km/kg)',
                size: 100,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'UsoDelFreno',
                header: 'Uso de freno (aplicaciones x cada 100 km)</',
                size: 100,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'PorDeInercia',
                header: '% de inercia',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'PorDeRalenti',
                header: '% de ralentí',
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
            if (consultaReportVHxCO) {
                setloader(true);
            getReporteSotramacVHxCO(fechaInicial, fechaFinal, driverSelected, assetSelected, assetTypeId.toString()).then((respuesta: AxiosResponse<ReporteSotramac[]>) => {
                setlstReporteSotramacVHxCO(respuesta.data);
                setRowCount(respuesta.data.length);
                setloader(false);
            }).catch( () => {
                errorDialog("Visualizar Informe", "Error al recibir datos del servidor.")
                setloader(false);
            }    
            );;
        }
    
        }, [consultaReportVHxCO]) 

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
                            data={lstReporteSotramacVHxCO}
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