import { AccessTimeFilled,  Check,  House,  SupervisorAccount,  SupportAgent,  Workspaces } from "@mui/icons-material";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table"
import { AxiosResponse } from "axios"
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table"
import { MRT_Localization_ES } from "material-react-table/locales/es"
import moment from "moment"
import {  useEffect, useState } from "react"
import { ObtenerClientesTabla, SetActiveEvent } from "../../data/Configuracion"
import { TablaClienteEventoActivo } from "../../models/ConfiguracionModels"
import { ConfiguracionPreferencia } from "./ConfiguracionPreferencia"
import { ConfiguracionVariables } from "./ConfiguracionVariable"
import { ModalAddClienteEbus } from "./ModalAddClienteEbus"
import { ModalConfiguracionTiempo } from "./ModalConfiguracionTiempo"
import { ModalListadousuarioTabla } from "./ModalListadoUsuarioTabla"
import { ModalLocaciones } from "./ModalLocaciones"
import { ModalUsuarios } from "./ModalUsuarios"
import { Box, IconButton, Tooltip } from "@mui/material";
import confirmarDialog, { errorDialog, successDialog } from "../../../../../_start/helpers/components/ConfirmDialog";

import { useSelector } from "react-redux";
import { UserModelSyscaf } from "../../../auth/models/UserModel";
import { RootState } from "../../../../../setup";
import BlockUi from "@availity/block-ui";

type Props = {

}

const ConfiguracionPrincipal:React.FC<Props> = () =>{
    // informacion del usuario almacenado en el sistema
    const isAuthorized = useSelector<RootState>(
      ({ auth }) => auth.user
  );

  // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
  const model = (isAuthorized as UserModelSyscaf);

    
    //table state
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    const [rowCount, setRowCount] = useState(0);
 //   const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [isError, setIsError] = useState(false);

   // fin table state
   
    const [showModalClienteAdd, setModalClienteAdd] = useState<boolean>(false)
    const [showModaLocacion, setshowModaLocacion] = useState<boolean>(false)
    const [showModalUsuarios, setshowModalUsuarios] = useState<boolean>(false)
    const [showModalListaUsuarios, setshowModalListaUsuarios] = useState<boolean>(false)
    const [showModalTiempoCliente, setshowModalTiempoCliente] = useState<boolean>(false)
    const [showConfiguracionVariables, setshowConfiguracionVariables] = useState<boolean>(false)
    const [data, setData] = useState<TablaClienteEventoActivo[]>([]);
    const [ClienteId, setClienteId] = useState<string>("");
    const [ClienteIds, setClienteIds] = useState<string>("");
    const [TitleModalTiempoCliente, setTitleModalTiempoCliente] = useState<string>("");
    const [TitleModalConfiguracionVariable, setTitleModalConfiguracionVariable] = useState<string>("");
    const [EsVisible, setEsVisible] = useState<boolean>(true);
    let listadoCampos: MRT_ColumnDef<TablaClienteEventoActivo>[] =
    [
        {
            accessorKey: 'clienteNombre',
            header: 'Nombre',
            size: 5
        },
        
        {
            accessorKey: 'nit',
            header: 'Documento',
            Cell({ cell, column, row, table, }) {
                return (row.original.nit === null ? "0": row.original.nit);
            },
            size: 5
        },
        {
            accessorKey: 'telefono',
            header: 'Telefono',
            Cell({ cell, column, row, table, }) {
                return (row.original.telefono === null ? "0": row.original.telefono);
            },
            size: 5
        },
        {
            accessorKey: 'fechaIngreso',
            header: 'Fecha ingreso',
            Cell({ cell, column, row, table, }) {
                return (moment(row.original.fechaIngreso).format("DD/MM/YYYY"));
            },
            size: 5
        }
    ];

    const setActiveEventCliente = (ClienteId:string,ActiveEvent:string) =>{
        confirmarDialog(() => {
          setEsVisible(true)
            SetActiveEvent(ClienteId,ActiveEvent).then((response:AxiosResponse<any>) =>{
                successDialog("Operación Éxitosa","");
                ConsultarDatos();
                setEsVisible(false)
            }).catch((error)=>{
                errorDialog("ha ocurrido un error contacte con el administrador","");
                setEsVisible(false)
            });
        }, `Esta seguro que desea ${ (ActiveEvent === "1") ? "guardar la asignación": "eliminar a el cliente"} `)
    }
    useEffect(() =>{
      setEsVisible(true)
      ConsultarDatos();
    },[])


const ConsultarDatos = () => {
  ObtenerClientesTabla().then((response: AxiosResponse<any>) =>{
    setData(response.data.data);
    setRowCount(response.data.data.length)
    setEsVisible(false)
}).catch(({error}) =>{
    errorDialog("Ha ocurrido un error al consultar los datos","");
    setIsError(true);
    setEsVisible(false)
});
};

    // ELIMINA LOGICAMENTE LA INFORMACION INGRESADA
  /*const handleDeleteRow = useCallback(
    (row: MRT_Row<TablaClienteEventoActivo>) => {

      confirmarDialog(() => {
      
      }, `Esta seguro que desea eliminar el archivo`);

    },
    [data],
  );*/
    return(
        <>
         <BlockUi tag="span" className="shadow-sm"  keepInView blocking={EsVisible}>
              <div className="card card-border mt-2">
                   <div className="row w-100">
                      <div className="col-sm-6 col-md-6 col-xs-6 w-50">
                         
                         </div>
                         <div className="col-sm-6 col-md-6 col-xs-6 mt-2 w-50">
                             <div  className="float-end">
                                 <button type="button" title="Agregar cliente" className="btn btn-sm btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" onClick={() => setModalClienteAdd(true)}><i className="bi-file-person-fill" ></i> Agregar cliente</button>
                             </div>
                         </div>
                         <div className="mt-10"></div>
                         <div className="col-sm-12 col-md-12 col-xs-12">
                                 <MaterialReactTable
                                     localization={MRT_Localization_ES}
                                     displayColumnDefOptions={{
                                         'mrt-row-actions': {
                                           muiTableHeadCellProps: {
                                             align: 'center',
                                           },
                                           size: 50,
                                         },
                                       }}
                                     columns={listadoCampos}
                                     data={data}
                                     enableEditing
                                     editingMode="modal" //default 
                                     onColumnFiltersChange={setColumnFilters}
                                     onGlobalFilterChange={setGlobalFilter}
                                     onPaginationChange={setPagination}
                                     onSortingChange={setSorting}
                                     rowCount={rowCount}
                                     muiToolbarAlertBannerProps={
                                         isError
                                           ? {
                                             color: 'error',
                                             children: 'Error al cargar información',
                                           }
                                           : undefined
                                       }
                                     initialState={{ density: 'compact' }}
                                     renderRowActions={({ row, table }) => (
                                         <Box sx={{ display: 'flex', gap: '1rem' }}>
                                             <Tooltip arrow placement="left" title="Activar e Inactivar clientes">
                                             <IconButton color="success" onClick={() => {
                                                     let Cliente = (row.original.clienteId != undefined ? row.original.clienteId:"");
                                                     setActiveEventCliente(Cliente, "0");
                                                 }} >
                                               <Check />
                                             </IconButton>
                                           </Tooltip>
                                           <Tooltip arrow placement="top" title="Consultar y/o agregar location del cliente">
                                             <IconButton color="info" onClick={() => {
                                                   let Cliente = (row.original.clienteId != undefined ? row.original.clienteId:"");
                                                   let ClienteIds = (row.original.clienteIdS != undefined ? row.original.clienteIdS:"");
                                                 setClienteId(Cliente);
                                                 setClienteIds(ClienteIds.toString());
                                                 setshowModaLocacion(true)
                                             }
                                            
                                               } >
                                               <House />
                                             </IconButton>
                                           </Tooltip>
                                           <Tooltip arrow placement="top" title="Consultar y/o agregar location del cliente">
                                             <IconButton color="success" onClick={() => {
                                                  console.log("Consultar location")
                                                  let Cliente = (row.original.clienteIdS != undefined ? row.original.clienteIdS:"");
                                                  setClienteIds(Cliente.toString());
                                                  setshowModalUsuarios(true);
                                             }
                                                
                                               } >
                                                  <SupportAgent />
                                               
                                             </IconButton>
                                           </Tooltip>
                                           <Tooltip arrow placement="top" title="Consultar listados de usuarios">
                                             <IconButton color="info"  onClick={() => 
                                                 {
                                                     let Clienteids = (row.original.clienteIdS != undefined ? row.original.clienteIdS:"");
                                                     let Cliente = (row.original.clienteId != undefined ? row.original.clienteId:"");
                                                     setClienteIds(Clienteids.toString());
                                                     setClienteId(Cliente);
                                                     setshowModalListaUsuarios(true)
                                                 }
                                               } >
                                              <SupervisorAccount />
                                             </IconButton>
                                           </Tooltip>
                                             <Tooltip arrow placement="top" title="Configurar tiempo para cliente">
                                                 <IconButton color="success" onClick={() => {
                                                      let Clienteids = (row.original.clienteIdS != undefined ? row.original.clienteIdS:"");
                                                      let Cliente = (row.original.clienteId != undefined ? row.original.clienteId:"");
                                                      setClienteIds(Clienteids.toString());
                                                      setClienteId(Cliente);
                                                     setshowModalTiempoCliente(true);
                                                     setTitleModalTiempoCliente(`Cliente:  ${row.original.clienteNombre}`)
                                                 }}>
                                                     <AccessTimeFilled />
                                                 </IconButton>
                                             </Tooltip>
                                          
                                             <Tooltip arrow placement="right" title="Configurar variables del cliente">
                                                 <IconButton color="warning" onClick={() => {
                                                      let Clienteids = (row.original.clienteIdS != undefined ? row.original.clienteIdS:"");
                                                      let Cliente = (row.original.clienteId != undefined ? row.original.clienteId:"");
                                                      setClienteIds(Clienteids.toString());
                                                      setClienteId(Cliente);
                                                      setshowConfiguracionVariables(true);
                                                      setTitleModalConfiguracionVariable(`Configuración variables para ${row.original.clienteNombre}`)
                                                 }}>
                                                     <Workspaces />
                                                 </IconButton>
                                             </Tooltip>
                                           
                                         </Box>
                                       )
                                       }
                                       state={{
                                         columnFilters,
                                         globalFilter,
                                      //   isLoading,
                                         pagination,
                                         showAlertBanner: isError,
                                         showProgressBars: isRefetching,
                                         sorting,
                                       }}
                                 />
                         </div>
                   </div>
            </div>
            <ModalAddClienteEbus show={showModalClienteAdd} handleClose={() => setModalClienteAdd(false)} title={"Agregar cliente"} recargarDatos={ConsultarDatos}></ModalAddClienteEbus>
            {(showConfiguracionVariables) && ( <ConfiguracionVariables show={showConfiguracionVariables} handleClose={() => setshowConfiguracionVariables(false)} title={TitleModalConfiguracionVariable} ClienteId={ClienteId} UsuarioIds={model.usuarioIds.toString()} ClienteIds={ClienteIds}></ConfiguracionVariables>)}
            <ConfiguracionPreferencia></ConfiguracionPreferencia>
            {(showModalTiempoCliente) && (<ModalConfiguracionTiempo show={showModalTiempoCliente} handleClose={() => setshowModalTiempoCliente(false)} ClienteIds={ClienteIds} Title={TitleModalTiempoCliente} UsuarioIds={model.usuarioIds.toString()}></ModalConfiguracionTiempo>)}
            {(showModalListaUsuarios) && (<ModalListadousuarioTabla show={showModalListaUsuarios} handleClose={ () => setshowModalListaUsuarios(false)} ClienteId={ClienteIds}></ModalListadousuarioTabla>)}
            {(showModaLocacion) && (<ModalLocaciones show={showModaLocacion} handleClose={() => setshowModaLocacion(false)} ClienteId={(ClienteId ?? "")} ClienteIds={ClienteIds}></ModalLocaciones>) } 
            {(showModalUsuarios) && (<ModalUsuarios show={showModalUsuarios} handleClose={() => setshowModalUsuarios(false) } ClienteId={ClienteIds}></ModalUsuarios>)} 
            </BlockUi>
        </>
    )
}
export {ConfiguracionPrincipal}