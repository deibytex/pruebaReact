import React, { useEffect, useState } from "react";

import { useDataPreoperacional } from "../core/provider";
import { observaciones, Preoperacional, sinPreoperacional } from "../models/respuestas";

import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import type {
    ColumnFiltersState,
    PaginationState,
    SortingState,
} from '@tanstack/react-table';
import { Button, Modal } from "react-bootstrap-v5"
import { Box, IconButton, Tooltip } from "@mui/material";
import { FormatListBulleted, Message } from "@mui/icons-material";
import moment from "moment";
import { msToTime } from "../../../../_start/helpers/Helper";


type Props = {
    show: boolean;
    handleClose: () => void;
    title?: string;
};

export const Observaciones: React.FC<Props> = ({ show, handleClose, title }) => {



    const [Data, setData] = useState<observaciones[]>([]);
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

    let listadoCampos: MRT_ColumnDef<observaciones>[] =

        [
            {
                accessorKey: 'fecha',
                header: 'Fecha',
                size: 100
            },
            {
                accessorKey: 'value',
                header: 'Observaciones',
                size: 100
            }

        ];

    let data: any = {};
    data = {
        fecha: 'a',
        value: 'a',
        notificar: 'a'
    };

    // setData(data);
    // setRowCount(data.length);


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
                                <textarea className="form-control  input input-sm " id={"Nombre"}></textarea>
                            </div>
                        </div>
                    </div>
                    <p></p>
                    <div className="row">
                        <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
                            <Button type="button" variant="primary" >
                                Guardar
                            </Button>
                        </div>
                        <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
                            <Button type="button" variant="danger" >
                                Cerrar Gestion
                            </Button>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Body>
                    
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
