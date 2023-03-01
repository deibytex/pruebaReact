import React, { useEffect, useState } from "react";

import { useDataPreoperacional } from "../core/provider";
import { observaciones, Preoperacional, sinPreoperacional } from "../models/dataModels";

import MaterialReactTable, { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import type {
    ColumnFiltersState,
    PaginationState,
    SortingState,
} from '@tanstack/react-table';
import { Button, Modal } from "react-bootstrap-v5"
import moment from "moment";
import { FechaServidor } from "../../../../_start/helpers/Helper";
import { getEncabezados, setObservaciones } from "../data/dataPreoperacional";
import confirmarDialog, { errorDialog, successDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { DATERANGE_DISABLED_TARGET } from "rsuite/esm/utils";


type Props = {
    show: boolean;
    handleClose: () => void;
    title?: string;
    observaciones: string
    encabezadoid: number;
    esgestionado: boolean;
    clienteid: string;
    fecha: string;
};

export const Observaciones: React.FC<Props> = ({ show, handleClose, title, observaciones, encabezadoid, esgestionado, clienteid, fecha }) => {


    const { setEncabezados } = useDataPreoperacional();
    const [Data, setData] = useState<observaciones[]>([]);
    const [obervacionGestion, setobervacionGestion] = useState("");
    const [Chidlren, setChildren] = useState("");
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
    const obervacion = 'Observaciones';

    let listadoCampos: MRT_ColumnDef<observaciones>[] =

        [
            {
                accessorKey: 'fecha',
                header: 'Fecha',
                size: 100,
                Cell({ cell, column, row, table, }) {
                    return (moment(cell.getValue() as Date).format('DD/MM/YYYY HH:mm:ss'))
                }
            },
            {
                accessorKey: 'value',
                header: 'Observaciones',
                size: 100
            }

        ];

    useEffect(() => {

        if (observaciones != "" && observaciones != null) {
            let json = JSON.parse(observaciones);
            setData(json);
            setRowCount(json.length);
        }
        else {
            setData([]);
            setRowCount(0);
        }
    }, [observaciones])

    const getobservacion = (e: any) => {
        setobervacionGestion(e.target.value)
    };

    const setObservacion = (observacion: string, escerrado?: string) => {

        let GestorObervaciones: any = {};

        GestorObervaciones = {
            EncabezadoId: encabezadoid,
            fecha: FechaServidor,
            value: observacion,
            notificar: "false",
            EsCerrado: escerrado?.toString()

        };
        
        confirmarDialog(() => {
            setObservaciones(JSON.stringify(GestorObervaciones)).then((response) => {
                successDialog("Operación Éxitosa", "");
                setData([...Data, JSON.parse(JSON.stringify(GestorObervaciones))] as observaciones[]);
                setobervacionGestion("");
                if (escerrado == "true") {
                    getEncabezados(clienteid, fecha, 'null').then( (response) => {
                            setEncabezados(response.data);
                            handleClose();
                        });
                }



            }).catch((error) => {
                errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
            });
        }, escerrado == "false" ? `Esta seguro que desea agregar el comentario` : `Esta seguro que terminar la gestión`
            , escerrado == "false" ? "Guardar" : "Terminar")
    }

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
                        <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                            <div className="">
                                <label className="control-label label-sm font-weight-bold" htmlFor="comentario" style={{ fontWeight: 'bold' }}>Adicionar Comentario:</label>
                                <textarea className="form-control  input input-sm " id={obervacion} onChange={getobservacion} rows={3} value={obervacionGestion}></textarea>
                            </div>
                        </div>
                    </div>
                    <p></p>
                    <div className="row">
                        <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
                            <Button type="button" variant="primary" onClick={() => {
                                setObservacion(obervacionGestion, 'false');
                            }}>
                                Guardar
                            </Button>
                        </div>
                        <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
                            {esgestionado == false ? <Button type="button" variant="danger" onClick={() => {
                                setObservacion('Cierre Gestión', 'true');
                            }}>
                                Cerrar Gestion
                            </Button> : <></>}
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Body>
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
                        data={Data}
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
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}
