
import { ColumnFiltersState, SortingState, PaginationState } from "@tanstack/react-table";

import MaterialReactTable, { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import moment from "moment";
import { useEffect, useRef, useState } from "react"
import { Button,  Modal } from "react-bootstrap-v5";
import DualListBox from "react-dual-listbox";
import { DatePicker } from "rsuite";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { PageTitle } from "../../../../../_start/layout/core";
import { dualList } from "../../../CorreosTx/models/dataModels";
import { GetReporteOdometro } from "../../data/ReportesData";
import {DescargarExcel} from "../../../../../_start/helpers/components/DescargarExcel"

import { FormatoColombiaDDMMYYYHHmmss, FormatoSerializacionDDMMYYYHHmmss } from "../../../../../_start/helpers/Constants";
import BlockUi from "react-block-ui";

export default function ReporteOdometro() {
    //  variables de la tabla
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
    // variable que contendra los datos de los odometros

    const [dataOdometro, setDataOdometro] = useState<any[]>([]);
    const [dataOdometroFiltrada, setDataOdometroFiltrada] = useState<any[]>([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(moment().startOf('day').add(3, 'hours'));
    const [lstVehiculos, setlstVehiculos] = useState<dualList[]>([]);
    const [lstSeleccionados, setSeleccionados] = useState<string[]>([]);

    const [showModal, setShowModal] = useState<boolean>(false);

    const refTabla = useRef<MRT_TableInstance<any>>(null);

    // listado de campos a extraer
    let listadoCampos: MRT_ColumnDef<any>[] =

        [
            {
                accessorKey: 'Movil',
                header: 'Móvil',
                size: 100
            },
            {
                accessorKey: 'Fecha',
                header: 'Fecha',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    // esto se hace para poder reutilizar este metodo para imprimer en excel
                     const value = (row.original != undefined) ?   row.original.Fecha :row;
                    return (moment(value).format(FormatoColombiaDDMMYYYHHmmss))
                }
            }, {
                accessorKey: 'Odometro',
                header: 'Odometro',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    const value = (row.original != undefined) ?   row.original.Odometro :row;
                    return (value.toFixed(2))
                }
            }

        ];

    useEffect(() => {
        ConsultarDataOdometro();

        return () => {
            // limpiamos la informacion de odomtros
            setDataOdometro([])
        }
    }, []);
    useEffect(() => {
        let datosfiltrados = dataOdometro;
        // si hay vehiculos seleccionados los filtramos
        if (lstSeleccionados.length > 0)
            datosfiltrados = datosfiltrados.filter(f => lstSeleccionados.indexOf(f["Movil"]) != -1);
        setDataOdometroFiltrada(datosfiltrados);

    }, [lstSeleccionados, dataOdometro]);

    const ConsultarDataOdometro = () => {
        setIsRefetching(true)
        setIsLoading(true)
        GetReporteOdometro(moment(fechaSeleccionada).add(-1, 'days').format(FormatoSerializacionDDMMYYYHHmmss), 
        moment(fechaSeleccionada).format(FormatoSerializacionDDMMYYYHHmmss)).then((response) => {
            let data = response.data;
            // de la consulta escogemos los vehiculos que nos serviran de filtro
            let lstVehiculos: dualList[] = [];
            data.map((m: any) => {
                lstVehiculos.push({ "value": m["Movil"], "label": m["Movil"] })
            })

            setlstVehiculos(lstVehiculos);
            setDataOdometro(data);
            setRowCount(data.length)
            setIsRefetching(false)
            setIsLoading(false)
        }).catch((e) => {
            setIsRefetching(false)
            setIsLoading(false)
            errorDialog("Consultar Odometros", "Error al realizar consulta");
        })

    }

    function SelectVehiculos() {
        return (
            <DualListBox className=" mb-3 " canFilter
                options={lstVehiculos}
                selected={lstSeleccionados}
                onChange={(selected: any) => setSeleccionados(selected)}
            />
        );
    }

   
    return (<>
        <PageTitle >Reporte Odometro</PageTitle>
        <div className="card card-rounded bg-transparent " style={{ width: '100%' }}  >

            <div className="row  col-sm-12 col-md-12 col-xs-12 rounded shadow-sm mt-2 bg-secondary  text-primary" style={{ width: '100%' }} >
                <h3 className="card-title fs-4 m-0 ms-2"> Filtros</h3>
                <div className="col-sm-6 col-md-6 col-xs-6 d-flex justify-content-start">
                    <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Fecha inicial: </label>

                    <DatePicker className="mt-2" format="dd/MM/yyyy HH:mm" value={fechaSeleccionada.toDate()}
                        onSelect={(e) => { setFechaSeleccionada(moment(e)) }} />

                    <button className="m-2  btn btn-sm btn-primary" title="Consultar" type="button" onClick={() => { ConsultarDataOdometro() }}><i className="bi-search"></i></button>

                </div>

                <div className="col-sm-6 col-md-6 col-xs-6 d-flex justify-content-end">
                    <button className="m-2 btn btn-sm btn-primary" title="Consultar" type="button" onClick={() => { setShowModal(true) }}>
                        <i className="bi-car-front-fill"></i></button>

                    <button className="m-2 ms-0 btn btn-sm btn-primary" title="Consultar" type="button" onClick={() => { DescargarExcel(dataOdometroFiltrada, listadoCampos, "ReporteOdometro") }}>
                        <i className="bi-file-earmark-excel"></i></button>

                </div>
            </div>

            <div className="row mt-2 col-sm-8 col-md-8 col-xs-8 rounded shadow-sm mx-auto">
               
                <MaterialReactTable
                    tableInstanceRef={refTabla}
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
                            fontSize: 14,
                            fontStyle: 'bold',
                            color: 'rgb(27, 66, 94)'

                        }),
                    }}
                    columns={listadoCampos}
                    data={dataOdometroFiltrada}
                    // editingMode="modal" //default         
                    // enableTopToolbar={false}
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
        </div>

        <Modal show={showModal} onHide={setShowModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title> Filtro por vehiculos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                        <SelectVehiculos />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setSeleccionados([]); }}>
                    Cancelar
                </Button>
                <Button type="button" variant="primary" onClick={() => { setShowModal(false); }}>
                    Filtrar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    )
}