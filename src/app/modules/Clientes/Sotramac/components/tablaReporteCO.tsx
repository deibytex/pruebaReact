import { useDataSotramac } from "../core/provider";
import React, { useEffect, useState } from "react";
import {  ReporteSotramac } from "../models/dataModels";
import { Button,  Modal } from "react-bootstrap-v5";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { getReporteSotramacCO } from "../data/dataSotramac";
import { AxiosResponse } from "axios";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { locateFormatPercentNDijitos } from "../../../../../_start/helpers/Helper";

type Props = {
    show: boolean;
    handleClose: () => void;
    title?: string;
    consultaReporteCO: boolean;
}

export const ModalTablaReporteCO: React.FC<Props> = ({ show, handleClose, title, consultaReporteCO }) => {

    const { fechaInicial, fechaFinal, driverSelected, assetTypeId, loader, setloader } = useDataSotramac();

    const [lstReporteSotramacCO, setlstReporteSotramacCO] = useState<ReporteSotramac[]>([]);

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
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'Cedula',
                header: 'Cédula',
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'Nombre',
                header: 'Conductor',
               size : 200,
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'DistanciaRecorridaAcumulada',
                header: 'Distancia Acum (km)',
               
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'ConsumodeCombustibleAcumulado',
                header: 'Combustible Acum (M3)',
                
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'DistanciaRecorridaUltimoDia',
                header: 'Dist último dia (km)',
               
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'RendimientoCumbustibleAcumulado',
                header: 'Rendimiento Acum(km/kg)',
                
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'UsoDelFreno',
                header: 'Uso de freno',               
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            },
            {
                accessorKey: 'PorDeInercia',
                header: '% Inercia',            
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ?  locateFormatPercentNDijitos( row.original.PorDeInercia, 0) : "";
                }
            },
            {
                accessorKey: 'PorDeRalenti',
                header: '% Ralentí',                
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? locateFormatPercentNDijitos( row.original.PorDeRalenti, 0) : "";
                }
            },
            {
                accessorKey: 'VelPromedio',
                header: 'Vel Prom',                
                Cell({ cell, column, row, table, }) {
                    return (cell.getValue() != null) ? cell.getValue() : "";
                }
            }
        ];

        useEffect(() => {

            if (consultaReporteCO) {
                setloader(true);
                setIsRefetching(true)
                setIsLoading(true)
                getReporteSotramacCO(fechaInicial, fechaFinal, driverSelected, assetTypeId.toString())
                .then((respuesta: AxiosResponse<ReporteSotramac[]>) => {
                    setlstReporteSotramacCO(respuesta.data);
                    setRowCount(respuesta.data.length);
                    setloader(false);
                    setIsRefetching(false)
                    setIsLoading(false)
                }).catch( () => {
                    errorDialog("Visualizar Informe", "Error al recibir datos del servidor.")
                    setloader(false);
                    setIsRefetching(false)
                    setIsLoading(false)
                }    
                );
            }
          
    
        }, [consultaReporteCO]) 

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   
                     
                        <MaterialReactTable
                            
                            columns={listadoCampos}
                            data={lstReporteSotramacCO}
                            enableColumnFilters={false}
                            initialState={{ density: 'compact' }}
                            enableColumnOrdering
                            enableColumnDragging={false}
                            enablePagination={false}
                            enableStickyHeader
                            enableDensityToggle={false}
                            enableRowVirtualization
                            state={{
                                columnFilters,
                                globalFilter,
                                isLoading,
                                pagination,
                                showAlertBanner: isError,
                                showProgressBars: isRefetching,
                                sorting,
                            }}
                            
                            localization={MRT_Localization_ES}
                            displayColumnDefOptions={{
                              'mrt-row-actions': {
                                muiTableHeadCellProps: {
                                  align: 'center',
                                }
                              },
                            }}
                            defaultColumn={{
                              minSize: 100, //allow columns to get smaller than default
                              maxSize: 200, //allow columns to get larger than default
                              size: 100, //make columns wider by default
                            }}
                            muiTableContainerProps={{
                            
                              sx: { maxHeight: '400px' }, //give the table a max height
                  
                            }}
                            muiTableHeadCellProps={{
                              sx: (theme) => ({
                                fontSize: 8,
                                fontStyle: 'bold',
                                color: 'rgb(27, 66, 94)',
                                //backgroundColor: 'yellow'
                  
                              }),
                            }}
                           
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
                          
                        />
                        
                    
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