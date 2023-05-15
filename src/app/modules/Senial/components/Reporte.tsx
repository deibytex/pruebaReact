import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table"
import { useEffect, useState } from "react";
import { PageTitle } from "../../../../_start/layout/core/PageData";
import BlockUi from "@availity/block-ui";
import { Button, Card, Modal } from "react-bootstrap-v5";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { GetListaClientes, GetReporte, GetReporteDetallado, GetReporteExportar } from "../data/ReportesData";
import { AxiosResponse } from "axios";
import { DateRangePicker} from "rsuite";
import moment from 'moment-timezone';
import { DescargarExcel } from "../../../../_start/helpers/components/DescargarExcel";
import { FiltrosReportes } from "../models/Senial";
import DualListBox from "react-dual-listbox";
import { dualList } from "../../../../_start/helpers/Models/DualListDTO";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Download, Search } from "@mui/icons-material";
import { formatSimple } from "../../../../_start/helpers/Helper";
export default function Reporte (){
    let filtrosBase: FiltrosReportes = {
        FechaInicial: moment().startOf('month').toDate(),
        FechaFinal: moment().endOf('day').toDate(),
        limitdate: 30,
    }
 //table state
 const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
 const [globalFilter, setGlobalFilter] = useState('');
 const [sorting, setSorting] = useState<SortingState>([]);
 const [pagination, setPagination] = useState<PaginationState>({
   pageIndex: 0,
   pageSize: 10,
 });
 const [rowCount, setRowCount] = useState(0);
 const [rowCount2, setRowCount2] = useState(0);
 const [isLoading, setIsLoading] = useState(false);
 const [isRefetching, setIsRefetching] = useState(false);
 const [isError, setIsError] = useState(false);
 const [showModal, setShowModal] = useState<boolean>(false);
 const [showModalFallas, setShowModalFallas] = useState<boolean>(false);
 const [Datos, setDatos] = useState<any[]>([])
 const [DatosFiltrados, setDatosFiltrados] = useState<any[]>([]);
 const [DatosDetallado, setDatosDetallado] = useState<any[]>([])
 const [loader, setloader] = useState<boolean>(false);
const [Clientes, setClientes] = useState<dualList[]>([]);
const [ClienteSeleccionado, setClienteSeleccionado] = useState<string[]>([]);
const [isCallData, setisCallData] = useState<boolean>(false); // permite validar 
const [ConsultarF, setConsultarF] = useState<boolean>(true); 
const [esFiltrado, setesFiltrado] = useState<boolean>(false); // permite validar 
const [Tiporeporte, setTipoReporte] = useState(filtrosBase);
const { allowedMaxDays, allowedRange, combine } = DateRangePicker;

const TipoReporte =   { reporte: "", tabla: "", filtros: { ...filtrosBase, MaxDay:30 }, Data: []};

 //para las columnas de la tabla   
 let listadoCampos: MRT_ColumnDef<any>[] =
 [
    {
        accessorKey: 'clienteNombre',
        header: 'Cliente',
        size: 100,        
    },
    {
        accessorKey: 'siteName',
        header: 'Sitio',
        size: 100,        
    },
    {
        accessorKey: 'assetsDescription',
        header: 'Movil',
        size: 100,        
    },
    {
        accessorKey: 'registrationNumber',
        header: 'Placa',
        size: 100,        
    },
    {
        accessorKey: 'TFallas',
        header: 'Velx4',
        size: 100,        
    },
];

let listadoFallas: MRT_ColumnDef<any>[] =
 [
    {
        accessorKey: 'Falla',
        header: 'Falla',
        size: 100,        
    },
    {
        accessorKey: 'TotalFallas',
        header: 'Cantidad',
        size: 100,        
    }
]



useEffect(
    () => {
        GetListaClientes().then((response: AxiosResponse<any>) => {
            let lstCliente = (response.data as any[]).reduce((p, c) => {
                let clienteIdS = c["clienteIdS"];
                let clienteNombre = c["clienteNombre"];
                let isExists = p.filter((f: any) => f["value"] === clienteIdS);
                if (isExists.length == 0)
                    p.push({ "value": String(clienteIdS), "label": clienteNombre })
                return p;
            }, []);
            setClientes(lstCliente);
        }).catch((error) => {
            errorDialog("<i>Eror al consultar los clientes</i>", "")
        })
        return () => {};
    }, []
)

  // VALIDA LAS FECHAS QUE SEAN LAS CORRECTAS Y ACTUALIZA LOS FILTROS
let ValidarFechas = (Range: Date[]) => {
    let FechaInicial: Date = moment(Range[0]).toDate();
    let FechaFinal: Date =  moment(Range[1]).toDate();

    setisCallData(
        (Tiporeporte.FechaInicial > FechaInicial || Tiporeporte.FechaFinal < FechaFinal
            || (TipoReporte.filtros.FechaInicial > FechaInicial &&
                TipoReporte.filtros.FechaFinal > FechaFinal)
        )
    )
    TipoReporte.filtros.FechaInicial = FechaInicial;
    TipoReporte.filtros.FechaFinal = FechaFinal;
    TipoReporte.filtros = {...TipoReporte.filtros, FechaInicial, FechaFinal, limitdate:30, MaxDay:30} ;
    setTipoReporte(TipoReporte.filtros);
}

const Consultar = () =>{
    if (ConsultarF == true || isCallData) {
        ObtenerDatos();
    }
}
function SelectClientes() {
    return (
        <DualListBox className=" mb-3 " canFilter
            options={Clientes}
            selected={ClienteSeleccionado}
            onChange={(selected: any) => {
                if(selected.length != 0){
                    let filtrado:any = [];
                    selected.forEach((element:any) =>{
                       Datos.map((val:any, index:any)=>{
                            if(val.ClienteIds == Number.parseInt(element))
                                filtrado.push(val)  
                        });
                    })
                    setesFiltrado(true);
                    setRowCount(filtrado.length);
                    setDatosFiltrados(filtrado);
                }
                else{
                    setRowCount(Datos.length);
                    setesFiltrado(false);
                }
                
                // dejamos los seleccionados
                setClienteSeleccionado(selected)
               
            }}
        />
    );
}
const ObtenerDatos = () =>{
    setloader(true)
    setIsError(false)
    setIsLoading(true)
    setIsRefetching(true)
    GetReporte(moment(Tiporeporte.FechaInicial).format(formatSimple), moment(Tiporeporte.FechaFinal).format(formatSimple), (ClienteSeleccionado.length != 0 ? ClienteSeleccionado.join() : "-1" ) ).then((response:AxiosResponse<any>) =>{
        setDatos(response.data);
        setRowCount(response.data.length);
        setisCallData(false);
        setTipoReporte(Tiporeporte);
        setIsLoading(false)
        setIsRefetching(false)
        setloader(false)
        setConsultarF(false);
    }).catch(() =>{
        setloader(false)
        setIsError(true);
        setloader(false);
        setIsLoading(false)
        setIsRefetching(false)
    }).finally(()=>{
        setloader(false)
    })
}
const ConsultarFallas = (row:any) =>{
    setloader(true)
    GetReporteDetallado(
        moment(Tiporeporte.FechaInicial).format(formatSimple), 
        moment(Tiporeporte.FechaFinal).format(formatSimple),
        String(row.original.AssetId)
    ).then((response : AxiosResponse<any>) =>{
        setDatosDetallado(response.data);
        setRowCount2(response.data.length);
        setloader(false)
        setShowModalFallas(true);
    }).catch(({error}) =>{
        setloader(false)
        console.log(error)
    });
}
const ConsultarInformeExportar  = (row:any|undefined) =>{
    setloader(true);
    var params: { [id: string]: string} = {};
    params["FechaInicial"] =  moment(Tiporeporte.FechaInicial).format(formatSimple);
    params["FechaFinal"] =  moment(Tiporeporte.FechaFinal).format(formatSimple);
    params["ParametroId"] = (row != undefined ? String(row.original.FallaSenialId) : "-1");
    params["ClienteIds"] =  (row != undefined ? String(row.original.ClienteIds) : (ClienteSeleccionado.length != 0 ? ClienteSeleccionado.join() : "-1"));
    params["AssetIds"] = (row != undefined ? String(row.original.AssetId) : "-1");
    GetReporteExportar(params.FechaInicial, params.FechaFinal, params.ParametroId, params.ClienteIds, params.AssetIds).then(
        (response :AxiosResponse<any>) =>{
            let Columnas: MRT_ColumnDef<any>[] = [{ accessorKey: 'clienteNombre',header: 'Cliente'},{accessorKey: 'registrationNumber',header: 'Placa'},
                    {
                        accessorKey: 'Fecha', 
                        header: 'Fecha', 
                         Cell({ cell, column, row, table, }){
                            return moment(row.original.Fecha).format(formatSimple)
                        } 
                    },
                    { 
                        accessorKey: 'FechaInicial', 
                        header: 'FechaInicial', 
                         Cell({ cell, column, row, table, }) {
                            return moment(row.original.FechaInicial).format(formatSimple)} 
                        }, { 
                            accessorKey: 'FechaFinal', 
                            header: 'FechaFinal', 
                            Cell({ cell, column, row, table, }){ 
                                return moment(row.original.FechaFinal).format(formatSimple)
                            }  
                        },  {  accessorKey: 'Falla', header: 'Falla' },
                    { accessorKey: 'Descripcion',  header: 'Condición'}, { accessorKey: 'Ocurrencias', header: 'Ocurrencias'}]
            DescargarExcel(response.data, Columnas, "Informe Detallado")
            setloader(false);
        }
    ).catch(
        () =>{
            console.log("Error al exportar archivo")
            setloader(false);
        }
    );
};
useEffect(() =>{
    Consultar();
},[])
return (
        <>
            <PageTitle>Reporte señales</PageTitle>
            <BlockUi tag="div" keepInView blocking={loader ?? false}  >
                <div className="card">
                    <div className='card-header'>
                        {/* <div className="w-100 ">
                            <div className='mt-5 float-end float-sm-end float-md-end float-lg-end float-xl-end float-xxl-end'>
                                {/* <CargaListadoClientes></CargaListadoClientes> 
                              
                            </div>
                        </div> */}
                    </div>
                    <div className="card-body">
                        <Card.Header>
                            <div className="d-flex justify-content-between mb-2">
                                <div className="d-flex justify-content-between mx-auto">
                                    <div className="ms-9 text-center">
                                        <h3 className="mb-0">Reporte señales</h3>
                                        <span className="text-muted m-3">{"clientes"}</span>
                                    </div>
                                </div>
                            </div>
                        </Card.Header>
                        <Card className="bg-secondary  text-primary m-0">
                                <Card.Body className="card-body shadow-md">
                                    <div className="row">
                                        <div className="col-sm-8 col-md-8 col-xs-8 col-lg-8"> 
                                        <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Clientes: </label>
                                        <Button title="Seleccion de clientes"  className="m-2 mt-5  btn btn-sm btn-primary" onClick={() => { setShowModal(true) }}><i className="bi-file-person-fill"></i></Button>
                                        <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Fecha: </label>
                                            {(combine && allowedMaxDays && allowedRange) && (
                                                    <DateRangePicker className="mt-2" format="dd/MM/yyyy"  value={
                                                        [Tiporeporte.FechaInicial, Tiporeporte.FechaFinal]}
                                                        disabledDate={combine(allowedMaxDays(TipoReporte.filtros.MaxDay), allowedRange(
                                                            moment().add(-200, 'days').startOf('day').toDate(), moment().startOf('day').toDate()
                                                        ))}
                                                        onChange={(value, e) => {
                                                            if (value !== null) {
                                                                ValidarFechas(
                                                                    [value[0],
                                                                    value[1]]
                                                                );
                                                            }
                                                        
                                                         } } />
                                            )}
                                            
                                            <Button title="Consultar reporte segun filtros seleccionado" className="m-2 mt-5 btn btn-sm btn-primary" onClick={() => { Consultar() }}><i className="bi-search"></i></Button>
                                        </div>
                                        <div className="col-sm-4 col-md-4 col-xs-4 col-lg-4 d-flex justify-content-end">
                                            <button title="descargar reporte en excel" className="m-2 mt-5 ms-0 btn btn-sm btn-primary" type="button" onClick={() => {
                                                ConsultarInformeExportar(undefined);
                                               
                                            }}>
                                                <i className="bi-file-earmark-excel"></i></button>
                                        </div>
                                    </div>
                                </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body className="card-body shadow-md">
                            {(Datos.length != 0) && (listadoCampos != undefined) && (<MaterialReactTable
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
                                                columns={listadoCampos}
                                                data={(esFiltrado == true  ? DatosFiltrados : Datos)}
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
                                                enableStickyHeader
                                                enableDensityToggle={false}
                                                enableRowVirtualization
                                                defaultColumn={{
                                                    minSize: 150, //allow columns to get smaller than default
                                                    maxSize: 400, //allow columns to get larger than default
                                                    size: 150, //make columns wider by default
                                                }}
                                                enableRowActions={true}
                                                renderRowActions={({ row, table }) => (
                                                    <Box sx={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', gap: '1rem'}}>
                                                        <Tooltip arrow placement="top" title="Ver fallas">
                                                            <IconButton    onClick={() =>   ConsultarFallas(row)} >
                                                                <Search/>
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
                                            />)}
                            </Card.Body>
                        </Card>
   
                    </div>
                </div>
            </BlockUi>
            <Modal show={showModal} onHide={setShowModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title> Filtro por clientes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                            <SelectClientes/>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="secondary" onClick={() => {
                        setesFiltrado(false);
                        setClienteSeleccionado([]);
                    }}>
                        Limpiar
                    </Button>
                    <Button type="button" variant="primary" onClick={() => { setShowModal(false); }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*Modal para mostrar el listado de fallas */}
            <Modal show={showModalFallas} onHide={setShowModalFallas} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title> Listado de fallas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                            {(DatosDetallado.length  != 0) && ( <MaterialReactTable
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
                                columns={listadoFallas}
                                data={DatosDetallado}
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
                                rowCount={rowCount2}
                                enableStickyHeader
                                enableDensityToggle={false}
                                enableRowVirtualization
                                enableRowActions={true}
                                renderRowActions={({ row, table }) => (
                                    <Box sx={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', gap: '1rem' }}>
                                        <Tooltip arrow placement="top" title="Descargar detallado">
                                            <IconButton  onClick={() =>   ConsultarInformeExportar(row)} >
                                                <Download/>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    )
                                    }
                                defaultColumn={{
                                    minSize: 150, //allow columns to get smaller than default
                                    maxSize: 400, //allow columns to get larger than default
                                    size: 150, //make columns wider by default
                                }}
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
                            />)}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="primary" onClick={() => { setShowModalFallas(false); }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
