
import { ColumnFiltersState, SortingState, PaginationState } from "@tanstack/react-table";

import MaterialReactTable, { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap-v5";
import DualListBox from "react-dual-listbox";
import { DatePicker, Placeholder } from "rsuite";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { ModuleName, PageTitle } from "../../../../../_start/layout/core";
import { dualList } from "../../../CorreosTx/models/dataModels";
import { GetReporteOdometro } from "../../data/ReportesData";
import { DescargarExcel } from "../../../../../_start/helpers/components/DescargarExcel"
import { FormatoColombiaDDMMYYYHHmmss, FormatoSerializacionYYYY_MM_DD_HHmmss } from "../../../../../_start/helpers/Constants";
import { isBefore, isAfter } from "rsuite/esm/utils/dateUtils";
import { Box } from "@mui/material";
import { ClienteDTO } from "../../../../../_start/helpers/Models/ClienteDTO";
import { GetClientesEsomos } from "../../data/NivelCarga";
import { AxiosResponse } from "axios";
import { Notification, useToaster } from "rsuite";


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
    const toaster = useToaster();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<number>(0);
    const [Clientes, setClientes] = useState<ClienteDTO[]>();
    const refTabla = useRef<MRT_TableInstance<any>>(null);


    const message = (type: any, titulo: string, mensaje: React.ReactNode) => {
        return (<Notification className="bg-light-danger" type={type} header={titulo} 
        closable duration={10000}>
            {mensaje}
        </Notification>)
    }

 
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
                    const value = (row.original != undefined) ? row.original.Fecha : row;
                    return (moment(value).format(FormatoColombiaDDMMYYYHHmmss))
                }
            }, {
                accessorKey: 'Odometro',
                header: 'Odómetro',
                size: 80,
                Cell({ cell, column, row, table, }) {
                    const value = (row.original != undefined) ? row.original.Odometro : row;
                    return (value.toFixed(2))
                }
            }

        ];


    useEffect(() => {

        GetClientesEsomos().then((response: AxiosResponse<any>) => {
            setClientes(response.data);
            setClienteSeleccionado(response.data[0].clienteIdS)
        }).catch((error) => {

            toaster.push(message('error', "Consulta datos", "Error al consultar datos"), {
                placement: 'topCenter'
            });

        })

        return () => {
            // limpiamos la informacion de odomtros
            setDataOdometro([])
        }
    }, []);

    useEffect(() => {

        if (ClienteSeleccionado != 0)
            ConsultarDataOdometro();
    }, [ClienteSeleccionado]);



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
        setIsError(false)
        GetReporteOdometro(moment(fechaSeleccionada).add(-1, 'days').format(FormatoSerializacionYYYY_MM_DD_HHmmss),
            moment(fechaSeleccionada).format(FormatoSerializacionYYYY_MM_DD_HHmmss), ClienteSeleccionado.toString()).then((response) => {
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
                setIsError(true)
                setDataOdometro([]);
                toaster.push(message('error', "Datos Odómetro", "Error al consultar datos, favor intente nuevamente en unos minutos."), {
                    placement: 'topEnd'
                });
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
    function CargaListadoClientes() {
        return (
            <Form.Select className="m-2" onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                let lstClientes = Clientes?.filter((value: any, index: any) => {

                    return value.clienteIdS == Number.parseInt(e.currentTarget.value)
                })

                if (lstClientes !== undefined && lstClientes.length > 0)
                    setClienteSeleccionado(Number.parseInt(e.currentTarget.value));
            }} aria-label="Default select example" defaultValue={ClienteSeleccionado}>
                {
                    Clientes?.map((element: any, i: any) => {
                        return (<option key={element.clienteIdS} value={(element.clienteIdS != null ? element.clienteIdS : 0)}>{element.clienteNombre}</option>)
                    })
                }
            </Form.Select>
        );
    }

    return (<>
        <ModuleName >eBus</ModuleName>
        <PageTitle >Reporte Odómetro</PageTitle>


        <div className="card card-rounded bg-transparent " style={{ width: '100%' }}  >



            <div className="row mt-2 col-sm-8 col-md-8 col-xs-8 rounded shadow-sm mx-auto">
                <div className="card card-rounded shadow mt-2" style={{ width: '100%' }}  >


                    <div className="d-flex justify-content-between mb-2">
                        <div className="mx-auto">
                            <div className="ms-3 text-center">
                                <h3 className="mb-0">Último Odómetro</h3>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-secondary d-flex flex-row  justify-content-between m-1">

                        <div className="d-flex justify-content-start ">


                            <label className="control-label label  label-sm ms-2 mt-4 " style={{ fontWeight: 'bold' }}>Fecha Hora: </label>


                            <DatePicker format="dd/MM/yyyy HH:mm" className="m-2 mt-3" value={fechaSeleccionada.toDate()}

                                disabledDate={date => (isAfter(date ?? moment().toDate(), new Date()) || isBefore(date ?? moment().toDate(), moment().add(-6, 'months').toDate()))}
                                onSelect={(e) => { setFechaSeleccionada(moment(e)) }} />
                            <button className="btn btn-sm btn-primary m-3" title="Consultar" type="button" onClick={() => { setShowModal(true) }}>
                                <i className="bi-car-front-fill"></i></button>
                            <button className=" btn btn-sm btn-primary m-3" title="Consultar" type="button" onClick={() => { ConsultarDataOdometro() }}><i className="bi-search"></i></button>

                        </div>
                        <div className="d-flex justify-content-end  ">
                            <CargaListadoClientes />
                        </div>

                    </div>


                </div>
                <MaterialReactTable
                    enableColumnFilters={false}
                    tableInstanceRef={refTabla}
                    localization={MRT_Localization_ES}
                    enableColumnDragging={false}
                    enablePagination={false}
                    enableStickyHeader
                    enableDensityToggle={false}
                    enableRowVirtualization
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            muiTableHeadCellProps: {
                                align: 'center',
                            },
                            size: 120,
                        },
                    }}
                    renderTopToolbarCustomActions={({ table }) => (
                        <Box
                            sx={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1, display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                        >

                            <button className="m-2 ms-0 btn btn-sm btn-primary" title="Consultar" type="button" onClick={() => { DescargarExcel(dataOdometroFiltrada, listadoCampos, "ReporteOdometro") }}>
                                <i className="bi-file-earmark-excel"></i></button>


                        </Box>
                    )}
                    muiTableHeadCellProps={{
                        sx: (theme) => ({
                            fontSize: 14,
                            fontStyle: 'bold',
                            color: 'rgb(27, 66, 94)'

                        }),
                    }}
                    muiTableContainerProps={{
                        sx: { maxHeight: '400px' }, //give the table a max height

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