import { useEffect, useState } from "react";
import MaterialReactTable, {  MRT_ColumnDef } from "material-react-table";
import type {
    ColumnFiltersState,
    PaginationState,
    SortingState,
  } from '@tanstack/react-table';
import { ConsultarIndicadores, ConsultarLogs, ConsultarUsuarios } from "../../data/dataLogs";
import { LogProvider, useDatLog } from "../../core/LogProvider";
import { LogDTO } from "../../models/logModel";
import { Form } from "react-bootstrap-v5";
import { AxiosResponse } from "axios";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { ExportarExcel } from "./exportarExcel";
import moment from "moment";


type Props = {
  };

  export const LogTable: React.FC<Props> =  () => {
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
   // fin table state
   const { FechaInicial, FechaFinal, UsuarioSeleccionado,Usuarios, setFechaInicial,setFechaFinal, setUsuarios, setUsuarioSeleccionado} = useDatLog();
   const [Data, setData] = useState<LogDTO[]>([]);
   const [download, setDownload] = useState(0);
   const [mmodificado, setModificado] = useState(0);
   const [subido, setSubido] = useState(0);
    let listadoCampos: MRT_ColumnDef<LogDTO>[] =

    [
       {
         accessorKey: 'NombreArchivo',
         header: 'Archivo',
         size: 250
       },
       {
         accessorKey: 'Descripcion',
         header: 'Descripción',
         size: 250
       },
       {
         accessorKey: 'FechaSistema',
         header: 'Fecha Creación',
         size: 100,
         Cell({ cell, column, row, table, }) {
            return (moment(row.original.FechaSistema).format('DD/MM/YYYY HH:mm:ss'))
          }
       }, {
         accessorKey: 'EstadoArchivo',
         header: 'Estado',    
         size: 80,
         Cell({ cell, column, row, table, }) {
            return (cell.getValue() == true )? <span className="badge bg-primary">Activo</span>:<span className="badge bg-danger">Inactivo</span>
          }
       }

     ];


    useEffect(() =>{
        //cambiar contenedor
        ConsultarUsuarios("desarrollodev").then(
            (response) => {
              setUsuarios(response.data);
              setUsuarioSeleccionado(response.data[0]);
            }
        ).catch((error) => {
            errorDialog("Consultar usuarios", "Error al consultar usuarios, no se puede desplegar informacion");
        });

       
    },[]);
 const ConsultarIndicadoresLog = (UsuarioSeleccionado:string|null) =>{
    ConsultarIndicadores(UsuarioSeleccionado).then(
        (response: AxiosResponse<any>) =>{
            if(response.data.length>0){
                (response.data[0] != undefined? setSubido(response.data[0]['Cantidad']):setSubido(0));
                (response.data[1] != undefined ? setDownload(response.data[1]['Cantidad']):setDownload(0));
                (response.data[2] != undefined ? setModificado(response.data[2]['Cantidad']): setModificado(0));
            }
        }
        ).catch(
            (error) =>{
                errorDialog("Consultar usuarios", "Error al consultar usuarios, no se puede desplegar informacion");
            }
        )
 }
    const ConsultarLog = () =>{
        if(validarcampos()){
            ConsultarLogs(FechaInicial,FechaFinal,(UsuarioSeleccionado != undefined ?  UsuarioSeleccionado.UsuarioId : "")).then((respuesta: AxiosResponse<LogDTO[]>) =>{
                setData(respuesta.data);
                if(UsuarioSeleccionado)
                    ConsultarIndicadoresLog(UsuarioSeleccionado.UsuarioId);
            }).catch((error) =>{
                errorDialog("<i>Ha ocurrido un error<i/>","");
            })
        }
            
    }

    function validarcampos (){
        if(FechaInicial == null || FechaInicial == undefined || FechaInicial == ""){
            errorDialog("Seleccione una fecha inicial","");
            return false;
        }
        if(FechaFinal == null || FechaFinal == undefined || FechaFinal == ""){
            errorDialog("Seleccione una fecha final","");
            return false;
        }
        if(UsuarioSeleccionado == null || UsuarioSeleccionado == undefined || UsuarioSeleccionado.UsuarioId == ""){
            errorDialog("Seleccione un usuario","");
            return false;
        }
        if(restaFechas(FechaInicial,FechaFinal)>30){
            errorDialog("Solo se permiten maximo 30 dias en la consulta","");
            return false;
        }
        return true;
    }


    const restaFechas = (f1:string,f2:string) =>
    {
        let fechainicial = moment(f1).format("DD/MM/YYYY");
        let fechafinal = moment(f2).format("DD/MM/YYYY");
        var aFecha1 = fechainicial.split('/');
        var aFecha2 = fechafinal.split('/');
        var fFecha1 = Date.UTC(Number.parseInt(aFecha1[2]),Number.parseInt(aFecha1[1])-1,Number.parseInt(aFecha1[0]));
        var fFecha2 = Date.UTC(Number.parseInt(aFecha2[2]),Number.parseInt(aFecha2[1])-1,Number.parseInt(aFecha2[0]));
        var dif = fFecha2 - fFecha1;
        var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
            return dias;
    }
    function CargaListadoUsuarios() {

        return (           
                <Form.Select   className=" mb-3 " onChange={(e) => {
                    // buscamos el objeto completo para tenerlo en el sistema
                    let lstUsuariosselect =  Usuarios?.filter((value, index) => {
                        return value.UsuarioId === e.currentTarget.value
                    })  
                    if(lstUsuariosselect)
                        setUsuarioSeleccionado(lstUsuariosselect[0]);
                }} aria-label="Default select example">
                    <option value="">Seleccione</option>
                    {                        
                        Usuarios?.map((element,i) => {
                                let flag = (element.UsuarioId === UsuarioSeleccionado?.UsuarioId)
                            return (<option key={element.UsuarioId} selected={flag}  value={element.UsuarioId}>{element.Nombres}</option>)
                        })
                    }
                </Form.Select>               
        );
      }

    

    function FechaInicialControl ()  {
        return (   
            <Form.Control  className=" mb-3 " value={FechaInicial}   type="date" name="fechaini" placeholder="Seleccione una fecha inicial" onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setFechaInicial(e.currentTarget.value);
            }}  />        
        )
    }

    function FechaFinalControl ()  {
        return (   
            <Form.Control  className=" mb-3 " value={FechaFinal}  type="date" name="fechaifin" placeholder="Seleccione una fecha final" onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setFechaFinal(e.currentTarget.value);
            }}  />        
        )
    }

    return ( 
        <div>
            <LogProvider>
                <div className="row">
                <div className="col-sm-3 col-md-3 col-xs-3">
                       <label className="control-label label label-sm"  style={{fontWeight:'bold'}}>Fecha inicial</label>
                       <FechaInicialControl/>
                    </div>
                    <div className="col-sm-3 col-md-3 col-xs-3">
                        <label className="control-label label label-sm" style={{fontWeight:'bold'}}>Fecha final</label>
                        <FechaFinalControl/>
                    </div>
                    <div className="col-sm-3 col-md-3 col-xs-3">
                        <label className="control-label label label-sm"  style={{fontWeight:'bold'}}>Usuarios</label>
                        <CargaListadoUsuarios/>
                      
                    </div>
                    <div className="col-sm-1 col-md-1 col-xs-1">
                        <label className="control-label label label-sm"></label>
                        <div className="">
                            <button className="btn btn-sm btn-primary" title="Consultar" type="button" onClick={ConsultarLog}><i className="bi-search"></i></button>
                        </div>
                    </div>
                    <div className="col-sm-2 col-md-2 col-xs-2">
                        <label className="control-label label label-sm"></label>
                        <div className="">
                         <ExportarExcel DatosExel={Data} NombreArchivo={"Logs"}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-4 col-md-4 col-xs-4" style={{ textAlign:'center'}}>
                       <label className="control-label label label-sm"  style={{fontWeight:'bold', textAlign:'center'}}>Total descargas</label>
                       <div className="card text-white bg-primary mb-3" style={{textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px'}}>
                            <span style={{fontWeight:'bold', fontSize:'30px'}}>{download}</span>
                        </div>
                    </div>
                    <div className="col-sm-4 col-md-4 col-xs-4" style={{ textAlign:'center'}}>
                        <label className="control-label label label-sm" style={{fontWeight:'bold', textAlign:'center'}}>Total modificados</label>
                        <div className="card text-white bg-primary mb-3" style={{textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px'}}>
                            <span style={{fontWeight:'bold', fontSize:'30px'}}>{mmodificado}</span>
                        </div>
                    </div>
                    <div className="col-sm-4 col-md-4 col-xs-4" style={{ textAlign:'center'}}>
                        <label className="control-label label label-sm"  style={{fontWeight:'bold', textAlign:'center'}}>Total subidos</label>
                        <div className="card text-white bg-primary mb-3" style={{textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px'}}>
                            <span style={{fontWeight:'bold', fontSize:'30px'}}>{subido}</span>
                        </div>
                    </div>
                </div>
            <MaterialReactTable
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
                // renderRowActions={({ row, table }) => (
    
                // <Box sx={{ display: 'flex', gap: '1rem' }}>
                // <Tooltip arrow placement="left" title="Editar registro" className="bg-primary">
                //     <IconButton onClick={() => EditarCondicion(row)} >
                //         <Edit />
                //     </IconButton>
                //     </Tooltip>
                //     <Tooltip arrow placement="top" title="Eliminar registro" className="bg-danger">
                //     <IconButton  onClick={() =>   EliminarCondicion(row)} >
                //         <Delete />
                //     </IconButton>
                //     </Tooltip>
    
                // </Box>
                // )
                // }
    
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
            </LogProvider>
        </div>
    )

}
