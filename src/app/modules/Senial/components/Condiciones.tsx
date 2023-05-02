import MaterialReactTable, { MRT_Cell, MRT_ColumnDef, MaterialReactTableProps } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Button, Modal, ModalBody, ModalFooter } from "react-bootstrap-v5";
import { AutoComplete, InputGroup } from "rsuite";
import MemberIcon from '@rsuite/icons/Member';
import { GetCondiciones, GetListaClientes, GuardarCondiciones } from "../data/ReportesData";
import { useCallback, useEffect, useState } from "react";
import { ClienteDTO, InicioCliente } from "../../../../_start/helpers/Models/ClienteDTO";
import confirmarDialog, { errorDialog, successDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { AxiosResponse } from "axios";
import { PageTitle } from "../../../../_start/layout/core/PageData";
import BlockUi from "@availity/block-ui";
import { FormatoColombiaDDMMYYYHHmmss } from "../../../../_start/helpers/Constants";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Edit, Search } from "@mui/icons-material";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { Check } from "react-feather";

export default function Condiciones() {
    const [loader, setloader] = useState<boolean>(false);
    const [Clientes, setClientes] = useState<ClienteDTO[]>([InicioCliente]);
    const [LstClientes, setlstClientes] = useState<string[]>([]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [Datos, setDatos] = useState<any[]>([]);

    //Para as tablas
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [edit, setEdit] = useState<boolean>(false);
    //table state
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    //Fin tablas
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
      }>({});
    //consulta los clientes
    useEffect(
        () => {
            GetListaClientes().then((response: AxiosResponse<any>) => {
                setClientes(response.data);
                setClienteSeleccionado(response.data[0]);
                let lstClientes = response.data.map((dat: any) => {
                    return dat.clienteNombre;
                })
                setlstClientes(lstClientes);
            }).catch((error) => {
                errorDialog("<i>Eror al consultar los clientes</i>", "")
            })
            return () => { };
        }, []
    )
    //para darle el ancho a el contenedor de clientes
    const stylesAuto = {
        width: 300,
        marginBottom: 10
    };
    //Selecciona al cliente
    const SeleccionCliente = (e: any) => {
        let selected = Clientes.filter((val: any) => {
            return (val.clienteNombre == e)
        })
        setClienteSeleccionado(selected[0]);
    }
    //Carga los datos iniciales de las condiciones ademas de actualizar la info cada vez que se selecciona un cliente
    useEffect(() => {
        ObtenerDatos();
        return () => { }
    }, [ClienteSeleccionado?.clienteIdS])
    //Consulta la informacion de las condiciones
    const ObtenerDatos = () => {
        let Cliente = (ClienteSeleccionado != undefined ? String(ClienteSeleccionado?.clienteIdS) : "0");
        setloader(true)
        setIsError(false)
        setIsLoading(true)
        setIsRefetching(true)
        GetCondiciones(Cliente).then((response: AxiosResponse<any>) => {
            setDatos(response.data);
            setRowCount(response.data.length);
            setIsLoading(false);
            setIsRefetching(false);
            setloader(false);
        }).catch(() => {
            setloader(false)
            setIsError(true);
            setIsLoading(false)
            setIsRefetching(false)
        })
    }
    //Listado de las columnas, metodos de cada columna
    let CamposTabla: MRT_ColumnDef<any>[] = [
        {
            accessorKey: 'Nombre',
            header: 'Nombre',
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
              }),
            size: 100
        },
        {
            accessorKey: 'Descripcion',
            header: 'Descripcion',
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
              }),
            size: 100
        },
        {
            accessorKey: 'Ocurrencias',
            header: 'Ocurrencias',
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
              }),
            size: 100
        },
        {
            accessorKey: 'Distancia',
            header: 'Distancia',
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
              }),
            size: 100
        },
        {
            accessorKey: 'Tiempo',
            header: 'Tiempo',
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
              }),
            size: 100
        },
        {
            accessorKey: 'Valor',
            header: 'Valor',
            enableEditing:true,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
              }),
            size: 100
        },
        {
            accessorKey: 'EsActivo',
            header: 'Estado',
            size: 100,
            enableEditing:false,
            Edit:({ cell, column, row, table, })=>{
            
            },
            Cell({ cell, column, row, table, }) {
                const value = (row.original != undefined) ? row.original.EsActivo : row;
                let label = (row.original.EsActivo) ? <span className="badge bg-success">Activo</span>:<span className="badge bg-danger">Inactivo</span>
                return<>{
                    label
                }</>
            }
        }
    ]

    const getCommonEditTextFieldProps = useCallback(
        (
          cell: MRT_Cell<any>,
        ): MRT_ColumnDef<any>['muiTableBodyCellEditTextFieldProps'] => {
          return {
            error: !!validationErrors[cell.id],
            helperText: validationErrors[cell.id],
          };
        },
        [validationErrors],
      )
      const handleSaveRowEdits: MaterialReactTableProps<any>['onEditingRowSave'] =
        async ({ exitEditingMode, row, values }) => {

        if (!Object.keys(validationErrors).length) {
            confirmarDialog(() => {
                //se envia al server
                let data = {...values}
                data.CondicionId =  String(row.original.CondicionId);
                data.ClienteIds =  String(row.original.ClienteIds  == undefined || row.original.ClienteIds == null ? "":row.original.ClienteIds );
                Guardar(data);
        }, `¿Esta seguro que desea editar el registro?`, 'Guardar');
        exitEditingMode();
       


        }
    };

    //Cuando cancela
    const handleCancelRowEdits = () =>{
        setValidationErrors({});
    };
    //Funcion para guardar las condiciones
 const Guardar = (row:any) =>{
    row.Clave =  (row.Clave == null || row.Clave == undefined || row.Clave =="" ? "2" :  row.Clave);
    //Insertar un objeto a guardar
    GuardarCondiciones(row).then(() =>{
        successDialog("Cambios guardados éxitosamente","");
    }).catch(() =>{
            errorDialog("Ha ocurrido un error al guardar","");
        }
    );
 }

    //retorna la pagina
    return (
        <>
            <PageTitle>Condiciones señales</PageTitle>
            <BlockUi tag="div" keepInView blocking={loader ?? false}  >
                <div className="card">
                    <div className="card-header shadow-sm">
                        <div className="container mt-5 ">
                            <div className="row">
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    <label className="control-label label-sm fw-bolder">Clientes</label>
                                    <InputGroup inside style={stylesAuto}>
                                        <InputGroup.Addon>
                                            <MemberIcon />
                                        </InputGroup.Addon>
                                        <AutoComplete placeholder="Seleccione un cliente" onSelect={SeleccionCliente} data={LstClientes}>
                                        </AutoComplete>
                                    </InputGroup>
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    <div className="form-group float-end" >
                                        <div className="panel-body">
                                            <div style={{ display: 'inline-table !important' }}>
                                                <button hidden className="btn  btn-sm bg-primary rounded-round btn_editarParametro" data-target='#modal_form_horizontal' data-toggle='modal'>
                                                    <i className="bi-database-add" ></i>
                                                    Adicionar
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body shadow-sm">
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <MaterialReactTable
                                        // tableInstanceRef={ColumnasTablas['movil']}
                                        localization={MRT_Localization_ES}
                                        displayColumnDefOptions={{
                                            'mrt-row-actions': {
                                                muiTableHeadCellProps: {
                                                    align: 'center',
                                                },
                                                size: 120,
                                            },
                                        }}
                                        columns={CamposTabla}
                                        data={Datos}
                                        editingMode="modal"
                                        enableEditing
                                        onEditingRowSave={handleSaveRowEdits}
                                        onEditingRowCancel={handleCancelRowEdits}
                                        enableColumnOrdering
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
                                        enableStickyHeader
                                        enableDensityToggle={false}
                                        enableRowVirtualization
                                        defaultColumn={{
                                            minSize: 100, //allow columns to get smaller than default
                                            maxSize: 150, //allow columns to get larger than default
                                            size: 150, //make columns wider by default
                                        }}
                                        enableRowActions={true}
                                        renderRowActions={({ row, table }) => (
                                            <Box sx={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', gap: '1rem'}}>
                                                <Tooltip arrow placement="top" title="Editar condición">
                                                    <IconButton    onClick={() =>{ table.setEditingRow(row)} } >
                                                        <Edit className="text-center" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip arrow placement="top"  title="Cambiar de estado">
                                                    <IconButton>
                                                        <Check className="text-center" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            )
                                            }
                                      
                                        initialState={{ density: 'compact' }}
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
                        </div>
                    </div>
                </div>
            </BlockUi>
            <Modal>
                <ModalBody>

                </ModalBody>
                <ModalFooter>

                </ModalFooter>
            </Modal>

        </>
    )
}

