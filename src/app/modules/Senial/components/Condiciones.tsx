import MaterialReactTable, { MRT_Cell, MRT_ColumnDef, MaterialReactTableProps } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Button, Card } from "react-bootstrap-v5";
import { Typeahead } from "react-bootstrap-typeahead";
import { GetCondiciones, GetListaClientes, GuardarCondiciones } from "../data/ReportesData";
import { useCallback, useEffect, useRef, useState } from "react";
import { ClienteDTO, InicioCliente } from "../../../../_start/helpers/Models/ClienteDTO";
import confirmarDialog, { errorDialog, successDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { AxiosResponse } from "axios";
import { PageTitle } from "../../../../_start/layout/core/PageData";
import BlockUi from "@availity/block-ui";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { Check } from "react-feather";
import { useSelector } from "react-redux";
import { RootState } from "../../../../setup";
import { EsPermitido, Operaciones, PermisosOpcion } from "../../../../_start/helpers/Axios/CoreService";
import { UserModelSyscaf } from "../../auth/models/UserModel";

export default function Condiciones() {
    // informacion del usuario almacenado en el sistema
    const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );
    const permisosopcion = PermisosOpcion("Condiciones senial");
    const operacionesPermisos = Operaciones;

    // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
    const model = (isAuthorized as UserModelSyscaf);

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
    const [showModal, setShowModal] = useState<boolean>(false);
    //Fin tablas
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});
    const [campos, setCampos] = useState<{}>({
        Distancia: null,
        Ocurrencias: null,
        Tiempo:null,
        Valor:null,
        CondicionId:"",
        ClienteIds:null,
        Descripcion:"",
        Nombre:""
    });
    //Se valida los valores nullos ya que en el guardado me daba error.
    const  valores = (val:any) => (val == null ? "0":String(val));
    interface CreateModalProps {
        columns: MRT_ColumnDef<any>[];
        onClose: () => void;
        onSubmit: (values: any) => void;
        open: boolean;
    }
    const typeaheadRef = useRef<any>(null);
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
            Edit: ({ cell, column, row, table, }) => {
                return <EditarCampos valor={row.original.Ocurrencias} id={"Ocurrencias"} row={row} cambio={(row.original.Ocurrencias == null || row.original.Ocurrencias==0  ? true:false)}/>
            },
            Cell({ cell, column, row, table, }) {
                let label = (row.original.Ocurrencias == null ? "-" : `${row.original.Ocurrencias}`)
                return <>{
                    label
                }</>
            },
            size: 100
        },
        {
            accessorKey: 'Distancia',
            header: 'Distancia',
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
            }),
            Edit: ({ cell, column, row, table, }) => {
                return <EditarCampos valor={row.original.Distancia} id={"Distancia"} row={row} cambio={(row.original.Distancia == null || row.original.Distancia ==0  ? true:false)}/>
            },
            Cell({ cell, column, row, table, }) {
                let label = (row.original.Distancia == null ? "-" : `${row.original.Distancia} km`)
                return <>{
                    label
                }</>
            },
            size: 100
        },
        {
            accessorKey: 'Tiempo',
            header: 'Tiempo',
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
            }),
            Edit: ({ cell, column, row, table, }) => {
                return <EditarCampos valor={row.original.Tiempo} id={"Tiempo"} row={row} cambio={(row.original.Tiempo == null  || row.original.Tiempo ==0 ? true:false)}/>
            },
            Cell({ cell, column, row, table, }) {
                let label = (row.original.Tiempo == null ? "-" : `${row.original.Tiempo/60} min`)
                return <>{
                    label
                }</>
            },
            size: 100
        },
        {
            accessorKey: 'Valor',
            header: 'Valor',
            enableEditing: true,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
            }),
            Edit: ({ cell, column, row, table, }) => {
                return <EditarCampos valor={row.original.Valor} id={"Valor"} row={row} cambio={(row.original.Valor == null ||row.original.Valor == 0  ? true:false)}/>
            },
            Cell({ cell, column, row, table, }) {
                const value = (row.original != undefined) ? row.original.Valor : row;
                let label = (row.original.Valor == null ? "-" : `${row.original.Valor}${row.original.Descripcion.indexOf("RPM") != -1 ? " rpm":" km/h"}`)
                return <>{
                    label
                }</>
            },
            size: 100
        },
        {
            accessorKey: 'EsActivo',
            header: 'Estado',
            size: 100,
            enableEditing: false,
            Edit: ({ cell, column, row, table, }) => {
                return false
            },
            Cell({ cell, column, row, table, }) {
                const value = (row.original != undefined) ? row.original.EsActivo : row;
                let label = (row.original.EsActivo) ? <span className="badge bg-success">Activo</span> : <span className="badge bg-danger">Inactivo</span>
                return <>{
                    label
                }</>
            }
        }
    ]
    //Funcion validado de la tabla
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
    //Para Enviar el registro para  el guardado
    const handleSaveRowEdits: MaterialReactTableProps<any>['onEditingRowSave'] =
        async ({ exitEditingMode, row, values }) => {
         
            if (!Object.keys(validationErrors).length) {
                confirmarDialog(() => {
                    //se envia al server
                    let data = { ...values }
                    data.Distancia = valores(campos['Distancia']);
                    data.Ocurrencias = valores(campos['Ocurrencias']);
                    data.Tiempo = valores(campos['Tiempo']);
                    data.Valor = valores(campos['Valor']);
                    data.CondicionId = String(row.original.CondicionId);
                    data.ClienteIds =row.original.ClienteIds;
                    Guardar(data);
                }, `¿Esta seguro que desea editar el registro?`, 'Guardar');
                exitEditingMode();
            }
        };

    //Cuando cancela
    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };
    //Funcion para guardar las condiciones
    const Guardar = (row: any) => {
        row.Clave = (row.Clave == null || row.Clave == undefined || row.Clave == "" ? "2" : row.Clave);
        //Insertar un objeto a guardar
        GuardarCondiciones(row).then(() => {
            successDialog("Cambios guardados éxitosamente", "");
            ObtenerDatos();
        }).catch(() => {
            errorDialog("Ha ocurrido un error al guardar", "");
        }
        );
    }
    //para crear el modal de nuevo pero esta deshabilitado por ahora
    const NuevaCondicion = ({
        open,
        columns,
        onClose,
        onSubmit,
    }: CreateModalProps) => {
        const [values, setValues] = useState<any>(() =>
            columns.reduce((acc, column) => {
                acc[column.accessorKey ?? ''] = '';
                return acc;
            }, {} as any),
        );

        const handleSubmit = () => {
            //put your validation logic here
            onSubmit(values);
            onClose();
        };
        return (
            <Dialog open={open}>
                <DialogTitle textAlign="center">Nueva condición</DialogTitle>
                <DialogContent>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <Stack
                            sx={{
                                width: '100%',
                                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                                gap: '1.5rem',
                            }}
                        >
                            <div className="container">
                                <div className="row">
                                    {CamposTabla.map((column, index) => (
                                        <div  key={`${column}-${index}`} className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                            <label id={`${column}-${index}`} key={`${column}-${index}`} className="control-label label fw-bolder label-sm">{(column.accessorKey == "EsActivo" ? "Estado" : column.header)}</label>
                                            <br />
                                            <input
                                                onChange={(e) =>
                                                    setValues({ ...values, [e.target.name]: e.target.value })
                                                }
                                                name={column.accessorKey?.toString()}
                                                key={column.id}
                                                className={`${(column.accessorKey == "EsActivo" ? "" : "form-control input input-sm")}`}
                                                type={`${(column.accessorKey == "EsActivo" ? "checkbox" : "text")}`}
                                                placeholder={column.header} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
                    <Button variant="secondary" onClick={onClose}>
                       Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };
//para editar los campos se crea un componenete con sus eventos para poder editarlos o no editarlos segun se requiera
 const EditarCampos = (id:any) =>{
    let val = (id.valor  == null || id.valor == "" ? null : id.valor );
    let row = id.row.original;
    return (
        <div className="">
            <label className="control-label label-sm">{id.id}</label>
            <input defaultValue={(campos[id.id] == null  || campos[id.id] == 0 ? val: campos[id.id])} disabled={id.cambio} onBlur= {(e:any) =>{
            setCampos({
                Distancia: (id.id == "Distancia"  ? e.target.value: row.Distancia),
                Ocurrencias:  (id.id == "Ocurrencias"  ? e.target.value: row.Ocurrencias),
                Tiempo:(id.id == "Tiempo"  ? e.target.value: row.Tiempo),
                Valor:(id.id == "Valor"  ? e.target.value: row.Valor),
                CondicionId:(id.id == "CondicionId"  ? e.target.value: row.CondicionId),
                ClienteIds:(id.id == "ClienteIds"  ? e.target.value: row.ClienteIds),
                Descripcion:(id.id == "Descripcion"  ? e.target.value: row.Descripcion),
                Nombre:(id.id == "Nombre"  ? e.target.value: row.Nombre)
            })
            val = e.target.value;
            e.preventDefault();
            console.log(e);
        }} id={id.id} className="form-control input input-sm" type="number"></input>
        </div>
        
    )
 }
//Modifica el estado
 const cambiarEstado = (row:any) =>{
    row.Clave = (row.Clave == null || row.Clave == undefined || row.Clave == "" ? "3" : row.Clave);
    row.EsActivo = (row.original.EsActivo  == true ? false: true);
    row.CondicionId =String(row.original.CondicionId);
    confirmarDialog(() => {
        GuardarCondiciones(row).then(() => {
            successDialog("Cambios guardados éxitosamente", "");
            ObtenerDatos();
        }).catch(() => {
            errorDialog("Ha ocurrido un error al guardar", "");
        }
        );
    }, `¿Esta seguro que desea cambiar el estado del registro?`, 'Guardar');
        //Insertar un objeto a guardar
 }
    //retorna la pagina
    return (
        <>
            <PageTitle>Condiciones señales</PageTitle>
            <BlockUi tag="div" keepInView blocking={loader ?? false}  >
                <div className="card" style={{width:'100%'}}>
                    <div className="card-header shadow-sm">
                        <Card  style={{width:'100%'}}>
                            <Card.Body>
                                <div className="d-flex justify-content-between mb-2">
                                    <div className="d-flex justify-content-between mx-auto">
                                        <div className="ms-9 text-center">
                                            <h3 className="mb-0">Condiciones</h3>
                                            <span className="text-muted m-3">Gestión</span>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        <div className="container mt-5 ">
                            <div className="row">
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                     <label className="control-label label-sm fw-bolder">Clientes</label>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text label-sm" style={{height:'42px'}}  id="basic-addon1">
                                            <i className="bi-file-earmark-person"></i>
                                        </span>
                                        <Typeahead className="mb-3 "
                                            id="autocomplete-clientes-condiciones"
                                            options={LstClientes}
                                            ref={typeaheadRef}
                                            onChange={
                                                SeleccionCliente
                                            }
                                            placeholder="Seleccione un cliente...."
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    <div className="form-group float-end" >
                                        <div className="panel-body">
                                            <div style={{ display: 'inline-table !important' }}>
                                                <button hidden className="btn  btn-sm bg-primary rounded-round btn_editarParametro" data-target='#modal_form_horizontal' data-toggle='modal' onClick={
                                                    () => {
                                                        setShowModal(true);
                                                    }
                                                }>
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
                                            <Box sx={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', gap: '1rem' }}>
                                                {(EsPermitido(permisosopcion, operacionesPermisos.Modificar)) && (<Tooltip arrow placement="top" title="Editar condición">
                                                    <IconButton onClick={() => { table.setEditingRow(row)
                                                    setCampos({
                                                        Distancia: row.original.Distancia,
                                                        Ocurrencias: row.original.Ocurrencias,
                                                        Tiempo:row.original.Tiempo,
                                                        Valor:row.original.Valor,
                                                        CondicionId:row.original.CondicionId,
                                                        ClienteIds:row.original.ClienteIds,
                                                        Descripcion:row.original.Descripcion,
                                                        Nombre:row.original.Nombre
                                                    })
                                                    }} >
                                                        <Edit className="text-center" />
                                                    </IconButton>
                                                </Tooltip>)}
                                                {(EsPermitido(permisosopcion, operacionesPermisos.Modificar)) && (<Tooltip arrow placement="top" title="Cambiar de estado">
                                                    <IconButton onClick={() =>{
                                                        cambiarEstado(row);
                                                    }}>
                                                        <Check className="text-center" />
                                                    </IconButton>
                                                </Tooltip>)}
                                            </Box>
                                        )}
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
            {(Datos.length != 0) &&(<NuevaCondicion
                columns={CamposTabla}
                open={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={Guardar}
            />)}
            
        </>
    )
}