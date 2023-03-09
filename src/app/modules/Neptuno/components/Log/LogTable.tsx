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
import { RootState } from "../../../../../setup";
import { useSelector } from "react-redux";
import { UserModelSyscaf } from "../../../auth/models/UserModel";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { TituloNeptunoLogs } from "../../../../../_start/helpers/Texts/textosPorDefecto";
import { PageTitle } from "../../../../../_start/layout/core";

type Props = {
  };

  export const LogTable: React.FC<Props> =  () => {

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
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [isError, setIsError] = useState(false);
   // fin table state
   const { FechaInicial, FechaFinal, UsuarioSeleccionado,Usuarios, setFechaInicial,setFechaFinal, setUsuarios, setUsuarioSeleccionado} = useDatLog();
   const [Data, setData] = useState<LogDTO[]>([]);
   const [download, setDownload] = useState(0);
   const [mmodificado, setModificado] = useState(0);
   const [subido, setSubido] = useState(0);
   const [contenedor, setcontenedor] = useState<string>((Array.isArray(model.containerneptuno)?Array.from(model.containerneptuno)[0]:model.containerneptuno));
   
    let listadoCampos: MRT_ColumnDef<LogDTO>[] =

    [
       {
         accessorKey: 'NombreArchivo',
         header: 'Nombre archivo',
         size: 100
       },
       {
         accessorKey: 'Descripcion',
         header: 'Descripción',
         size: 200
       },
       {
        accessorKey: 'NombreMovimiento',
        header: 'Tipo movimiento',
        size: 80
      },
       {
        accessorKey: 'Usuario',
        header: 'Usuario',
        size: 200
      },
       {
         accessorKey: 'FechaSistema',
         header: 'Fecha Creación',
         size: 80,
         Cell({ cell, column, row, table, }) {
            return (moment(row.original.FechaSistema).format('DD/MM/YYYY HH:mm:ss'))
          }
       }, {
         accessorKey: 'EstadoArchivo',
         header: 'Estado archivo',    
         size: 80,
         Cell({ cell, column, row, table, }) {
            return (cell.getValue() == true )? <span className="badge bg-primary">Activo</span>:<span className="badge bg-danger">Inactivo</span>
          }
       }

     ];


    useEffect(() =>{
        //cambiar contenedor
        ConsultarUsuarios(contenedor).then(
            (response) => {
              setUsuarios(response.data);
              setUsuarioSeleccionado(response.data[0]);
            }
        ).catch((error) => {
            errorDialog("Consultar usuarios", "Error al consultar usuarios, no se puede desplegar informacion");
        });

       
    },[contenedor]);

    useEffect(() =>{
        setFechaInicial(moment().format("DD/MM/YYYY"));
        let UltimodiaMes = ultimoDiaMes(moment().format("DD/MM/YYYY"));
        setFechaFinal(moment().add(UltimodiaMes, 'days').format("DD/MM/YYYY"));
    },[FechaInicial,FechaFinal])


    const ultimoDiaMes = (fecha:any) =>{
        let arrayFecha = fecha.split('/');
        let fechaUltimo = new Date(arrayFecha[0], arrayFecha[1]) 
        fechaUltimo.setDate(fechaUltimo.getDate() - 1)
      
        return fechaUltimo.getDate().toString();
      } 

const AgruparArrayByPropiedad = (arrayRespuesta : LogDTO[]) =>{
    //Creamos un nuevo objeto donde vamos a almacenar por indicadores. 
    let nuevoObjeto = {}
    //Recorremos el arreglo 
    arrayRespuesta.forEach( x => {
    //Si tipo o  NombreMovimiento no existe en nuevoObjeto entonces
    //la creamos e inicializamos el arreglo de indicadores. 
        if( !nuevoObjeto.hasOwnProperty(x.NombreMovimiento)){
            nuevoObjeto[x.NombreMovimiento] = {
            Indicadores: []
            }
        }
        //Agregamos los datos de los movimientos. 
        nuevoObjeto[x.NombreMovimiento].Indicadores.push({
        nombre: x.NombreMovimiento,
        })
    
    })
    return nuevoObjeto;
}

    const ConsultarLog = () =>{
        if(validarcampos()){
            ConsultarLogs(FechaInicial,FechaFinal,(UsuarioSeleccionado != undefined ?  UsuarioSeleccionado.UsuarioId : null)).then((respuesta: AxiosResponse<LogDTO[]>) =>{
                setData(respuesta.data);
                //se agrupa por movimientos
                let Indicadores = AgruparArrayByPropiedad(respuesta.data);
                 //Se setean los indicadores
                (Indicadores['Carga'] != undefined ? setSubido(Indicadores['Carga']['Indicadores'].length):setSubido(0));
                (Indicadores['Descarga'] != undefined ? setDownload(Indicadores['Descarga']['Indicadores'].length):setDownload(0));
                (Indicadores['Modificacion'] != undefined ? setModificado(Indicadores['Modificacion']['Indicadores'].length): setModificado(0));
                setRowCount(respuesta.data.length);
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
                    <option value={0}>Todos</option>
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
//El container;
function SelectContainer() {
    let Contenedor = model.containerneptuno;
    if(Array.isArray(Contenedor))
    {
      return (           
        <Form.Select   className="input input-sm mb-3 " onChange={(e) => {
            // buscamos el objeto completo para tenerlo en el sistema
            let containerfilter =  Array.from(Contenedor).filter((value) => {
                return value === e.currentTarget.value
            })  
            if(containerfilter != undefined || containerfilter)
              setcontenedor(containerfilter[0]);
        }} aria-label="Default select example">
            <option value="" disabled>Seleccione</option>
            {                        
                Contenedor?.map((element) => {
                    let flag = (element === contenedor)
                    return (<option key={element} selected={flag}  value={element}>{element}</option>)
                })
            }
        </Form.Select>               
    ); }
    else{
      return (     
          <Form.Select   className="input input-sm mb-3 " onChange={(e) => {
              // buscamos el objeto completo para tenerlo en el sistema
              setcontenedor(Contenedor);
          }} aria-label="Default select example">
              {        
                (<option key={Contenedor}  value={Contenedor}>{Contenedor}</option>)
              }
          </Form.Select>               
    );}
  }
    return ( 
        <LogProvider>
            <PageTitle >{TituloNeptunoLogs}</PageTitle>
            <div className="card card-rounded bg-transparent "    >
                    <div className="row  col-sm-12 col-md-12 col-xs-12 rounded shadow-sm mt-2" >
                        <div className="col-sm-2 col-md-2 col-xs-2">
                            <label className="control-label label text-white label-sm"  style={{fontWeight:'bold'}}>Fecha inicial</label>
                            <FechaInicialControl/>
                        </div>
                        <div className="col-sm-2 col-md-2 col-xs-2">
                            <label className="control-label label text-white label-sm" style={{fontWeight:'bold'}}>Fecha final</label>
                            <FechaFinalControl/>
                        </div>
                        <div  className="col-sm-3 col-md-3 col-xs-3">
                            <label className="control-label label text-white label-sm"  style={{fontWeight:'bold'}}>Contenedor</label>
                            <SelectContainer/>
                        </div>
                        <div className="col-sm-3 col-md-3 col-xs-3">
                            <label className="control-label label text-white label-sm"  style={{fontWeight:'bold'}}>Usuarios</label>
                            <CargaListadoUsuarios/>
                        </div>
                        <div className="col-sm-1 col-md-1 col-xs-1">
                            <label className="control-label label label-sm"></label>
                            <div className="">
                                <button className="btn btn-sm btn-primary" title="Consultar" type="button" onClick={ConsultarLog}><i className="bi-search"></i></button>
                            </div>
                        </div>
                        <div className="col-sm-1 col-md-1 col-xs-1">
                            <label className="control-label label label-sm"></label>
                            <div className="">
                            <ExportarExcel DatosExel={Data} NombreArchivo={"Logs"}/>
                            </div>
                        </div>
                    </div>
                    <div className="row col-sm-12 col-md-12 col-xs-12 py-2">
                        <div className="col-sm-4 col-md-4 col-xs-4 border rounded shadow-sm" style={{ textAlign:'center'}}>
                            <label className="control-label label label-sm text-white"  style={{fontWeight:'bold', textAlign:'center'}}>Cargados</label>
                            <div className="card text-black mb-3" style={{marginTop:'5px', textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px'}}>
                                <span style={{fontWeight:'bold', fontSize:'30px'}}>{subido}</span>
                            </div>
                        </div>
                        <div className="col-sm-4 col-md-4 col-xs-4 border rounded shadow-sm" style={{ textAlign:'center'}}>
                            <label className="control-label label label-sm text-white" style={{fontWeight:'bold', textAlign:'center'}}>Modificados</label>
                            <div className="card text-black mb-3" style={{marginTop:'5px', textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px'}}>
                                <span style={{fontWeight:'bold', fontSize:'30px'}}>{mmodificado}</span>
                            </div>
                        </div>
                        <div className="col-sm-4 col-md-4 col-xs-4 border rounded shadow-sm" style={{ textAlign:'center'}}>
                        <label className="control-label label label-sm text-white"  style={{fontWeight:'bold', textAlign:'center'}}>Descargados</label>
                        <div className="card text-black mb-3" style={{marginTop:'5px', textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px'}}>
                                <span style={{fontWeight:'bold', fontSize:'30px'}}>{download}</span>
                            </div>
                        </div>
                    </div>
                    <div className="row  col-sm-12 col-md-12 col-xs-12 rounded shadow-sm ">
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
                          fontSize : 14,
                          fontStyle: 'bold',  
                        color: 'rgb(27, 66, 94)'
                        
                      }),
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
                  </div>
            </div>
        </LogProvider>
    )

}
