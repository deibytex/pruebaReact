import BlockUi from "@availity/block-ui";
import { Box, IconButton, Tooltip } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table"
import { MRT_Localization_ES } from "material-react-table/locales/es"
import moment from "moment";
import { useEffect, useState } from "react";
import confirmarDialog, { errorDialog, successDialog } from "../../../../../_start/helpers/components/ConfirmDialog";

import { useDataReporte } from "../../core/ReporteProvider";
import { GetInformeTransmision, SetEstadoSyscaf } from "../../data/Reporte";
import { TablaDTO } from "../../models/ReporteModels";

const TableReporte : React.FC = () =>{
     //table state
     const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
     const [globalFilter, setGlobalFilter] = useState('');
     const [sorting, setSorting] = useState<SortingState>([]);
     const [pagination, setPagination] = useState<PaginationState>({
       pageIndex: 0,
       pageSize: 13,
     });
     const [rowCount, setRowCount] = useState(0);
     const [isLoading, setIsLoading] = useState(false);
     const [isRefetching, setIsRefetching] = useState(false);
     const [isError, setIsError] = useState(false);
     const { ClienteSeleccionado,  Data, setData, DataFiltrada, setDataFiltrada} = useDataReporte();
     const {setCargando, Cargando, Filtrado, setFiltrado} = useDataReporte();
     const [DataLocal, setDatalocal] = useState<TablaDTO[]>((Data? Data:[]));
     
     let VisibleDefault = {
        assetCodigo:false,
        Cliente:true,
        Sitio:true,
        registrationNumber:true,
        AVL:false,
        diffAVL:true,
        nombre:true,
        assetId:false,
        estadoSyscaf:true
     }
     let listadoCampos: MRT_ColumnDef<TablaDTO>[] =

     [
        {
            accessorKey: 'assetCodigo',
            header: 'Id',
            enableHiding: true,
            size: 10,
            minSize: 10, //min size enforced during resizing
            maxSize: 10,
          },
          {
            accessorKey: 'Cliente',
            header: 'Cliente',
            enableHiding: false,
            size: 10,
            minSize: 10, //min size enforced during resizing
            maxSize: 10,
           
          },
          {
            accessorKey: 'Sitio',
            header: 'Sitio',
            enableHiding: true,
            size: 10,
            minSize: 10, //min size enforced during resizing
            maxSize: 10,
           
          },
          {
            accessorKey: 'registrationNumber',
            header: 'Placa',
            enableHiding: false,
            size: 10,
            minSize: 10, //min size enforced during resizing
            maxSize: 10,
            
          },
          {
            accessorKey: 'AVL',
            header: 'Ultimo AVL',
            enableHiding: true,
            size: 10,
            minSize: 10, //min size enforced during resizing
            maxSize: 10,
            Cell({ cell, column, row, table, }) {
                return moment(row.original.AVL).format("DD/MM/YYYY");
           }
          },
          {
            accessorKey: 'diffAVL',
            header: 'Días sin TX',
            enableHiding: true,
            size: 5,
            minSize: 5, //min size enforced during resizing
            maxSize: 5,
          },
          {
            accessorKey: 'nombre',
            header: 'Administrador',
            enableHiding: false,
            size: 10,
            minSize: 10, //min size enforced during resizing
            maxSize: 10,
           
          },
          {
            accessorKey: 'assetId',
            header: 'ID',
            enableHiding: true,
            size: 10,
            minSize: 10, //min size enforced during resizing
            maxSize: 10,
            
          },
          {
            accessorKey: 'estadoSyscaf',
            header: 'Estado',
            enableHiding: false,
            size: 10,
            minSize: 10, //min size enforced during resizing
            maxSize: 10,
            Cell({ cell, column, row, table, }) {
                return RetornarEstado(row.original.estadoSyscaf);
           }
          }
     ]
    
     const RetornarEstado = (Estado:any) =>{
      return (
            <>{(Estado =="Sin Respuesta del Cliente" ?<span className='badge bg-warning'>{Estado}</span>: (Estado == "En Mantenimiento" ?<span className='badge bg-info'>{Estado}</span> :(Estado == "Detenido" ? <span className='badge bg-danger'>{Estado}</span> :<span className='badge bg-success'>{Estado}</span> ) ) )}</>
        )
     }
     const PintarIconosMenu = (row:any) =>{
   
        return(
            <div className="dropdown show position-absolute">
                <a className="dropdown-toggle"  id="dropdownMenuButton1"  data-bs-toggle="dropdown" aria-expanded="false">
                    <i style={{backgroundColor:'white'}} className='bi-menu-button-wide primary'></i>
                </a>
                <ul className="dropdown-menu position-relative zindex-dropdown" aria-labelledby="dropdownMenuButton1">
                    <li className="pl-12">
                        <a className="dropdown-item aDetenido fw-bold position-relative zindex-dropdown fw-bolder text-primary" aria-expanded="true"  id="aDetenido" onClick={CambiarEstado}   data-target= {row} data-toggle="modal">
                            <i title='Detener' className='bi-hand-thumbs-down alert-danger'></i>
                            {<>&nbsp;</>}
                            Detenido 
                        </a>
                    </li>
                    <li className="pl-12">
                        <a className="dropdown-item aMantenimiento fw-bold position-relative zindex-dropdown fw-bolder text-primary" id="aMantenimiento" onClick={CambiarEstado}    data-target= {row} data-toggle="modal">
                            <i title='En matenimiento' className='bi-wrench alert-warning'></i>
                            {<>&nbsp;</>}
                            En Mantenimiento
                        </a>
                    </li>
                    <li className="pl-12">
                        <a className="dropdown-item aNormalmente fw-bold position-relative zindex-dropdown fw-bolder text-primary"  id="aNormalmente" onClick={CambiarEstado}   data-target= {row} data-toggle="modal">
                            <i title='Operando normalmente'  className='bi-hand-thumbs-up alert-success'></i>
                            {<>&nbsp;</>}
                            Operando Normalmente
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item aSinRespuesta fw-bold position-relative zindex-dropdown fw-bolder text-primary"  id="aSinRespuesta" onClick={CambiarEstado}   data-target={row} data-toggle="modal">
                            <i title='Sin respuesta'  className='bi-person-dash-fill alert-info'></i>
                            {<>&nbsp;</>}
                            Sin Respuesta del Cliente
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item aSinRespuesta fw-bold position-relative zindex-dropdown fw-bolder text-primary"  id="aDesmontado" onClick={CambiarEstado}  data-target={row} data-toggle="modal">
                            <i title='Equipo desmontado'  className='bi-nut-fill alert-danger'></i>
                            {<>&nbsp;</>}
                            Equipo Desmontado
                        </a>
                    </li>
                </ul>
            </div>
        )
     }

     async function ConsultarDatos(){
      setIsLoading(true);
        let FechaActual = moment().add("hours",10).add("minutes",30).format("YYYY/MM/DD").toString();
        let Cliente = (ClienteSeleccionado != undefined ? ClienteSeleccionado?.clienteIdS.toString():"");
        await GetInformeTransmision(Cliente,FechaActual).then((response:AxiosResponse) =>{
            setData(response.data);
            
            setRowCount(response.data.length);
            setDatalocal(response.data);
            setCargando(false);
            setIsLoading(false)
            setFiltrado(false);
        }).catch(() =>{
            errorDialog("Ha ocurrido un error al intentar consultar el informe","");
            setIsError(true);
        })
     }

     useEffect(() =>{
        setCargando(true)
        ConsultarDatos();
        (Filtrado == undefined ? setDatalocal((Data? Data:[])):setDatalocal((DataFiltrada?DataFiltrada:[])));
        return () => setData([]);
     },[])

     useEffect(() =>{
      if(Filtrado == undefined || Filtrado == false){
        setDatalocal((Data? Data:[]));
        setRowCount(Data? Data.length:0)
      }else{
        setDatalocal((DataFiltrada?DataFiltrada:[]))
        setRowCount((DataFiltrada?DataFiltrada.length:0))
      }
   
     },[Filtrado, Data, DataFiltrada]);

     const CambiarEstado = (event:any) =>{
        let Estado = (event.target.attributes.id.value== "aDetenido" ? "5":(event.target.attributes.id.value== "aMantenimiento" ? "6" : (event.target.attributes.id.value== "aNormalmente" ? "7": (event.target.attributes.id.value == "aSinRespuesta" ? "8": "12"))))
        let AssetId = event.target.attributes['data-target'].value;
        confirmarDialog(() => {
          setCargando(true);
            SetEstadoSyscaf(AssetId,Estado).then((response:AxiosResponse) =>{
                successDialog("¡Operación Éxitosa!","");
                ConsultarDatos();
                setCargando(false);
            }).catch(() =>{
                errorDialog("Ha ocurrido un error al cambiar el estado del activo","");
                setCargando(false);
            })
        }, `¿Esta seguro que desea cambiar el estado del activo?`, 'Guardar')
     };

    return(
        <>
        <BlockUi tag="span" className="shadow-sm" loader={<><img alt="Logo" src="/media/logos/logo-compact.svg" className="mh-50px"/> Cargando...</>}  keepInView blocking={(Cargando == undefined? true:Cargando)}>
            <MaterialReactTable
              localization={MRT_Localization_ES}
              displayColumnDefOptions={{
              'mrt-row-actions': {
                  muiTableHeadCellProps: {
                  align: 'center',
                  },
                  size: 3,
              },
            }}
            muiTableHeadCellProps={{
              sx: (theme) => ({
                fontSize : 14,
                fontStyle: 'bold',  
              color: 'rgb(27, 66, 94)'
              
            }),
          }}
             columns={listadoCampos}
             data={DataLocal}
             enableTopToolbar={true}
             enableDensityToggle
             enableColumnOrdering
             onColumnFiltersChange={setColumnFilters}
             onGlobalFilterChange={setGlobalFilter}
             onPaginationChange={setPagination}
             onSortingChange={setSorting}
             rowCount={rowCount}
             enableFilters
             enableColumnFilters={false}
             enableEditing
             renderRowActions={({ row, table }) => (
                 <Box sx={{ display: 'flex', gap: '1rem', zIndex:'1000' }}>
                    {
                        
                        PintarIconosMenu(row.original.assetId)
                    }
                 </Box>
              )}
              state={{
                columnFilters,
                globalFilter,
                isLoading,
                pagination,
                showAlertBanner: isError,
                showProgressBars: isRefetching,
                sorting,
                }}
              initialState={{showProgressBars:Cargando, columnVisibility: VisibleDefault, density: 'compact'}}
             />
            </BlockUi>
        </>
    )
}

export {TableReporte}
