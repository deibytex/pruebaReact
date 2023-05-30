
import { useEffect, useState } from "react";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { GetClientesFatiga, getEventosActivosPorDia } from "../../data/dashBoardData";
import { ClientesFatiga, EventoActivo } from "../../models/EventosActivos";
import { AxiosResponse } from "axios";
import { Button, Form, Modal } from "react-bootstrap-v5";
import { PageTitle } from "../../../../../_start/layout/core";
import BlockUi from "@availity/block-ui";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import moment from "moment";
import { FechaServidor } from "../../../../../_start/helpers/Helper";
import { getConfiguraciones } from "../../data/Configuracion";

export default function Parametrizacion() {


    const [show, setShow] = useState(false);
    const [ValorSelectEvent, setValorSelectEvent] = useState("");
    const [NombeCondicion, setNombreCondicionEvent] = useState("");
    const [lstClientes, setLstClientes] = useState<ClientesFatiga[]>([]);
    const [clienteSeleccionado, setclienteSeleccionado] = useState<ClientesFatiga>();
    const [eventoSeleccionado, seteventoSeleccionado] = useState<EventoActivo>();
    const [Tiempo, setTiempo] = useState("");
    const [loader, setLoader] = useState<boolean>(false);
    const [Data, setData] = useState<any[]>([]);
    const [EventosActivos, setEventosActivos] = useState<any[]> ([]);
    /* table state*/
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
    let tempEventos: any[] = [];
  tempEventos.push({ EventId: "-8300145843408847057", descriptionevent : "Distracción"});
  tempEventos.push({ EventId: "3044842204790820242", descriptionevent : "Tabaquismo"});
  tempEventos.push({ EventId: "-480217926216925926", descriptionevent : "Ojos Cerrados"});
  tempEventos.push({ EventId: "-9097769333405069134", descriptionevent : "Bostezo"});
  tempEventos.push({ EventId: "807549500629766541", descriptionevent : "No Cinturón de Seguridad"});
  tempEventos.push({ EventId: "-1712533633274024830", descriptionevent : "Alerta Distancia Seguridad"});
  tempEventos.push({ EventId: "6698868737266655739	", descriptionevent : "Alerta Colisión"});
  tempEventos.push({ EventId: "670980146124694777", descriptionevent : "Alerta Salida de Carril"});
  tempEventos.push({ EventId: "5790861721889710462", descriptionevent : "Uso Celular"});
  tempEventos.push({ EventId: "4182509794703245564", descriptionevent : "No Conductor"});
  tempEventos.push({ EventId: "-8223674420093630323", descriptionevent : "Perdida de Video"});
  tempEventos.push({ EventId: "401009318098363779", descriptionevent : "Excepción en Almacenamiento"});
  tempEventos.push({ EventId: "280540917853524601", descriptionevent : "Alimentación Perdida"});
  tempEventos.push({ EventId: "-898226872645200439", descriptionevent : "MiX Vision: Event video requests capped"});

    /* fin table */
    let Campos: MRT_ColumnDef<any>[] =
    [
        {
        accessorKey: 'Nombre',
        header: 'Nombre'
    },
    {
        accessorKey: 'Cliente',
        header: 'Cliente'
     
    },
    {
        accessorKey: 'Tiempo',
        header: 'Tiempo'
    },
    {
        accessorKey: 'Estado',
        header: 'Estado'
     
    },
    {
        accessorKey: 'Eventos',
        header: 'Eventos'
    }
];

    const ObtenerClientes = () =>{
        GetClientesFatiga().then(
            (response) => {
                setLstClientes(response.data);
            }
  
        ).catch((error) => {
            errorDialog("Consultar Clientes", "Error al consultar clientes, no se puede desplegar informacion");
        });
    }
    const ObtenerEventos = (cliente:any) =>{
           var params: { [id: string]: string; } = {};
    //   params["Clienteids"] = String(cliente);
    //   params["period"] = moment(FechaServidor).format("MYYYY");
    //   params["Fecha"] = moment(FechaServidor).add(-1, 'days').format("YYYYMMDD");
      params["Clienteids"] = String(cliente);
      params["period"] = moment("20221028").format("MYYYY");
      params["Fecha"] = moment("20221028").add(-1, 'days').format("YYYYMMDD");
        getEventosActivosPorDia({
            Clase: "FATGQueryHelper",
            NombreConsulta: "GetEventosActivosDiario", Pagina: null, RecordsPorPagina: null
        },
          params).
          then((response:AxiosResponse<any>) => {
          //  setLteventosSeleccionados(response.data);
              // cuando tengamos los datos activamos todo el trabajo pesado
  
          }).catch((e) => {
              errorDialog("Consulta eventos Activos", "No hay datos que mostrar");
          });;
    }
    useEffect(() =>{
        ObtenerClientes();
    },[])
    useEffect(() => {
        //ObtenerEventos(clienteSeleccionado?.ClienteIdS)
        let _data = {};
        _data["clienteId"] = clienteSeleccionado?.ClienteId;
        GetConfiguracionAlerta(_data);
    }, [clienteSeleccionado])

    function GetConfiguracionAlerta(data:any) {
        setLoader(true);
        setIsLoading(true)
        setIsRefetching(true)
        getConfiguraciones(data).then((response:AxiosResponse<any>) =>{
           let  Datos= response.data.data;
            setData(Datos);
            setRowCount(response.data.data.length);
            setLoader(false);
            setIsLoading(false);
            setIsRefetching(false);
            setIsError(false);
        }).catch(({error}) =>{
            console.log("Eror ",error);
            setIsError(true);
            setIsLoading(false);
            setIsRefetching(false);
            setLoader(false);
        })
    }
    function CargaListadoClientes() {
        return (           
                <Form.Select   className=" mb-3 " onChange={(e) => {
                    // buscamos el objeto completo para tenerlo en el sistema
                    let cliente = lstClientes.filter((value, index) => {
                        return value.ClienteIdS === Number.parseInt(e.currentTarget.value)
      
                    })                   
                    setclienteSeleccionado(cliente[0])
                }} aria-label="Default select example">
                    <option>Seleccione</option>
                    {
                        lstClientes.map((element,i) => {
                                let flag = (element.ClienteIdS === clienteSeleccionado?.ClienteIdS)
                            return (<option key={element.ClienteIdS} selected={flag} value={element.ClienteIdS}>{element.clienteNombre}</option>)
                        })
                    }
                </Form.Select>               
        );
      }

    const AgregarEventos = (Evento:any) => {
        let Event = [...EventosActivos];

        let esta = EventosActivos?.includes(ValorSelectEvent);
        if(esta)
            errorDialog("El evento ya se encuentra agregado.","");
        else
            EventosActivos.push(ValorSelectEvent);
    };

    function CargaListadoEventos() {
        return (           
                <Form.Select   className=" mb-3 " onChange={(e) => {
                    // buscamos el objeto completo para tenerlo en el sistema
                    let evento = tempEventos.filter((value, index) => {
                        return value.EventId === e.currentTarget.value//Number.parseInt(e.currentTarget.value)
                    })   
                    setValorSelectEvent(evento[0].EventId);                
                    seteventoSeleccionado(evento[0])
                }} aria-label="Default select example">
                    <option>Seleccione</option>
                    {
                        tempEventos?.map((element,i) => {
                                let flag = (element.EventId === eventoSeleccionado?.EventId)
                            return (<option key={element.EventId} selected={flag} value={element.EventId}>{element.descriptionevent}</option>)
                        })
                    }
                </Form.Select>               
        );
      }

    return (
        <>
            <PageTitle>Parametrización</PageTitle>
            <BlockUi tag="div" keepInView blocking={loader ?? false} >
                <div className="content">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                                <div className="mx-auto">
                                    <div className="ms-3 text-center">
                                        <h3 className="mb-0">Parametrización</h3>
                                        <span className="text-muted m-3">Parametrización fatiga</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <div style={{ paddingTop: '10px' }} className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                                <div className="" style={{ display: 'inline-block', float: 'left' }}>
                                    <CargaListadoClientes></CargaListadoClientes>
                                </div>
                                <div className="form-group" style={{ display: 'inline-block', float: 'right' }}>
                                   
                                    <button className="btn btn-sm btn-primary" onClick={() => { setShow(true); }}>Nuevo</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
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
                                muiTableHeadCellProps={{
                                    sx: (theme) => ({
                                        fontSize: 14,
                                        fontStyle: 'bold',
                                        color: 'rgb(27, 66, 94)'
                                    }),
                                }}
                                columns={Campos}
                                data={Data}
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
                                    minSize: 150, //allow columns to get smaller than default
                                    maxSize: 400, //allow columns to get larger than default
                                    size: 150, //make columns wider by default
                                }}
                                muiTableContainerProps={{
                                    sx: { maxHeight: '400px' }, //give the table a max height
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
                            />
                        </div>
                    </div>
                </div>
            </BlockUi>
            <Modal show={show} onHide={setShow} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nueva configuración</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <label className="control-label label-sm font-weight-bold" htmlFor="Nombre" style={{ fontWeight: 'bold' }}>Nombre </label>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fas fa-pen"></i></span>
                                <input name="Nombre" placeholder="Nombre configuracion" className="form-control input-sm" value={NombeCondicion} onChange={(e: any) => { e.preventDefault(); setNombreCondicionEvent(e.target.value) }} />
                            </div>
                        </div>
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <label className="control-label label-sm font-weight-bold" htmlFor="Tiempo" style={{ fontWeight: 'bold' }}>Tiempo</label>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fas fa-clock"></i></span>
                                <input name="Tiempo" placeholder="Tiempo" className="form-control input-sm" value={Tiempo} onChange={(e: any) => { e.preventDefault(); setTiempo(e.target.value) }} />
                            </div>
                        </div>
                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                            <label className="control-label label-sm font-weight-bold" style={{ fontWeight: 'bold' }} htmlFor="ClienteId">Cliente</label>
                            <div className="input-group mb-3">
                                <span className="input-group-text mb-3"><i className="fas fa-user-tie mb-3"></i></span>
                               <CargaListadoClientes />
                            </div>
                        </div>
                        <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                            <div className="row">
                                {/* <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
                                    <label className="control-label label-sm font-weight-bold" htmlFor="nombreCondicion" style={{ fontWeight: 'bold' }}>Nombre</label>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text"><i className="far fa-check-square"></i></span>
                                        <input className="form-control input-sm" placeholder="Nombre condicion" name="nombreCondicionuni" value={NombeCondicionEventUni} onChange={(e: any) => { e.preventDefault(); setNombeCondicionEventUni(e.target.value) }} />
                                    </div>
                                </div>
                                <div className="col-sm-2 col-xl-2 col-md-2 col-lg-2">
                                    <label className="control-label label-sm font-weight-bold" htmlFor="cantidad" style={{ fontWeight: 'bold' }}>Cantidad</label>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text"><i className="fas fa-boxes"></i></span>
                                        <input className="form-control input-sm" placeholder="Cantidad" value={CantidadEvent} onChange={(e: any) => { e.preventDefault(); setCantidadEvent(e.target.value) }} name="cantidad" />
                                    </div>
                                </div> */}
                                <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                    <label className="control-label label-sm font-weight-bold" htmlFor="evento" style={{ fontWeight: 'bold' }}>Evento</label>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text mb-3"><i className="fas fa-book"></i></span>
                                         <CargaListadoEventos />
                                        {/* Aqui es el boton de guardar eventos */}
                                        <button className="btn btn-sm btn-success mb-3" type="button" title="Agregar mas eventos" name="eventos" value={1} onClick={(e:any) => { AgregarEventos(e)}}> <i className="fas fa-caret-right"></i></button>
                                    </div>
                                </div>
                                {/* <div className="col-sm-2 col-xl-2 col-md-2 col-lg-2">
                                    <label className="control-label label-sm font-weight-bold" style={{ fontWeight: 'bold' }}></label>
                                    <div className="input-group mb-3" style={{ flex: 1, justifyContent: 'center', alignItems: "center", lineHeight: "100px" }}>
                                        <button title="Agregar condición" type="button" onClick={Mostrar} className="btn btn-sm btn-primary"><i className="fas fa-plus"></i></button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="primary" onClick={() => {

                    }}>
                        Guardar
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => { setShow(false); }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


