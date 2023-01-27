import { Delete, Download, Edit } from "@mui/icons-material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap-v5";
import { GetInformacionCuenta, GetArchivosPorCuenta, DescargarArchivo, UpdateEstadoArchivo, ListarArchivosEstado } from "../data/dataNeptuno";
import { AreaDTO, configCampoDTO } from "../models/ConfigCampoDTO";
import { ArchivoDTO } from "../models/neptunoDirectory";
import Moment from 'moment';
//Import Material React Table Translations
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import MaterialReactTable, { MaterialReactTableProps, MRT_Cell, MRT_ColumnDef, MRT_Row } from 'material-react-table';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import axios, { AxiosResponse } from "axios";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import confirmarDialog, { errorDialog, successDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { CreateFileModal } from "./CreateModalTable";
import { NEP_InsertaArchivo } from "../../../../apiurlstore";
import { useSelector } from "react-redux";
import { RootState } from "../../../../setup";
import { UserModelSyscaf } from "../../auth/models/UserModel";
import { PageTitle } from "../../../../_start/layout/core";
import { EsPermitido, Operaciones, PermisosOpcion } from "../../../../_start/helpers/Axios/CoreService";
import { TituloNeptuno } from "../../../../_start/helpers/Texts/textosPorDefecto";
import { string } from "yup/lib/locale";
import { NeptunoProvider, useDataNeptuno } from '../../Neptuno/core/NeptunoProvider';
type Params = {
  contenedorString: string;
}

const NeptunoTable: React.FC<Params> = ({ contenedorString }) => {
  // contiene la informacion de la cuenta, con los campos a utilziar  
  const [configArea, SetConfigArea] = useState<AreaDTO[]>([]);
  const [camposHeader, SetcamposHeader] = useState<configCampoDTO[]>([]);
  const [tituloPagina, setTituloPagina]= useState<string>(TituloNeptuno);
const [contenedor, setcontenedor] = useState((Array.isArray(contenedorString)?contenedorString[0]:contenedorString));
const {containerNeptuno, setcontainerNeptuno} = useDataNeptuno();
  // verificamos que el contenedor sea un o varios debemos determinar que
  // o es uno que será un string o varios un array de strings
  // let  : string = ;
  // if(Array.isArray(contenedorString))
  // {

  //   contenedor =contenedorString[1]; 
  // }
  // else
  // contenedor =contenedorString; 


  // informacion del usuario almacenado en el sistema
  const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
  );
  const permisosopcion = PermisosOpcion("Archivos");
  const operacionesPermisos = Operaciones;
  // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
  const model = (isAuthorized as UserModelSyscaf);

  // react hook para mostar o model de carga de archivos
  const [showFileLoad, handleshowFileLoad] = useState(false);

  const [data, setData] = useState<any[]>([]);
  const [columnas, setColumnas] = useState<MRT_ColumnDef<any>[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const consultaDatos = () => {

    ListarArchivosEstado(null,contenedor).then((respuesta: AxiosResponse<ArchivoDTO[]>) => {
      const totalDeRegistros =
        parseInt(respuesta.headers['totalregistros'] ?? 10, 10);
      //console.log("totalDeRegistros", respuesta.headers)
      setRowCount(totalDeRegistros);

      // necesitamos transformar la data para que los campos dinamicos queden como columnas
      let datosRecibidos = respuesta.data;

      datosRecibidos.map((item, idx) => {
        if (item.DatosAdicionales != null) {
          // deserializamos la informacion
          let objectData = JSON.parse(item.DatosAdicionales);
          Object.entries(objectData).map((element, index) => {
            item[element[0]] = element[1];
          });
        }
      });

      setData(datosRecibidos);
    }).catch((e) => {
      errorDialog(e, "<i>Favor comunicarse con su administrador.</i>");
      setIsError(true);

      return;
    });

  }
  useEffect(() => {
    consultaDatos();
    setcontainerNeptuno(contenedor);
  },[
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    contenedor]);
  useEffect(() => {
    (async () => {
      setcontainerNeptuno(contenedor);
      // traemos la informacion de la cuenta, que campos se van a mostrar
      GetInformacionCuenta(contenedor).then(({ data }) => {

        SetConfigArea(data);
        if (data[0].CamposCapturar != null) {
          // deserializamos el objeto para poder saber los campos que estan en la cabecera    
          let campos = JSON.parse(data[0].CamposCapturar) as configCampoDTO[];
          let configuracionArea =  JSON.parse(data[0].ConfiguracionArea) as any;
           if(configuracionArea["titulo"] != null) setTituloPagina(configuracionArea["titulo"]);

       

          SetcamposHeader(campos);

          let listadoCampos: MRT_ColumnDef<any>[] =

           [
              {
                accessorKey: 'Nombre',
                header: 'Archivo',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                  ...getCommonEditTextFieldProps(cell),
                }),

                Cell({ cell, column, row, table, }) {

                  let EsPermitidoxx = EsPermitido(permisosopcion, Operaciones.Descargar);
                  return (
                    <>
                      {(EsPermitidoxx) ? (<Button className="btn btn-primary btn-sm" onClick={() => {

                        DescargarArchivo(row.original.Src, contenedor, (row.original.Nombre + row.original.Extension));
                      }}  > <Download />{row.original.Nombre}</Button>) : (<div>{row.original.Nombre}</div>)}


                    </>

                  )
                },
                size: 250
              },
              {
                accessorKey: 'Descripcion',
                header: 'Descripción',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                  ...getCommonEditTextFieldProps(cell),
                }),
                size: 250
              },
              ...campos.map((campo) => {
                let insideField: MRT_ColumnDef<any> = {
                  accessorKey: campo.campo,
                  header: campo.label,
                  muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                  }),
                  size: 100
                };
                return insideField;
              }
              ),
              {
                accessorKey: 'FechaSistema',
                header: 'Fecha Creación',
               enableEditing:false,
               Edit:({ cell, column, row, table, })=>{
                cell.column.getIsVisible();
              },
                Cell({ cell, column, row, table, }) {
                  
                  return (
                    <>
                      {
                        Moment(row.original.FechaSistema).format('DD/MM/YYYY HH:mm:ss')
                      }  
                    </>

                  )
                },
                size: 100
              }, {
                accessorKey: 'EsActivo',
                header: 'Estado',    
                enableEditing:false,    
                Edit:({ cell, column, row, table, })=>{
                  cell.column.getIsVisible();
                },
                Cell({ cell, column, row, table, }) {

                 let label = (row.original.EsActivo) ? <span className="badge bg-primary">Activo</span>:<span className="badge bg-danger">Inactivo</span>
                  return (
                    <> {
                      label
                    }
                    </>

                  )
                },
                size: 80
              }

            ];

         

          // traemos el titulo

          const columnasTabla: MRT_ColumnDef<any>[]
          = [];
        
          let ordenColumna =configuracionArea["ordenCol"] as string[];
      
          ordenColumna.map((col) => {

              let columFiltrada = listadoCampos.filter((campo)=> campo["accessorKey"] === col  );

            
              if(columFiltrada[0] != undefined)
              columnasTabla.push(columFiltrada[0]);
          });
        
          setColumnas(columnasTabla);

        }
      /*  ,
       
        
          
        
        */

      


        // inicializamos las otras variables

        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);

      }).catch((error) => {
        console.log(error);

      });

    })()


  }, [contenedorString
  ]);


  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<any>,
    ): MRT_ColumnDef<any>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        
      /* onBlur: (event) => {
           const isValid =
             cell.column.id === 'FechaSistema' ? '':  cell.column.id;
           if (!isValid) {
             //set validation error for cell if invalid
             setValidationErrors({
               ...validationErrors,
               [cell.id]: `${cell.column.columnDef.header} is required`,
             });
           } else {
             //remove validation error for cell if valid
             delete validationErrors[cell.id];
             setValidationErrors({
               ...validationErrors,
             });
           }
         },*/
      };
    },
    [validationErrors],
  );

  // EDICION DE LA INFORMACION SELECCIONADA
  const handleSaveRowEdits: MaterialReactTableProps<any>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        const submit = () => {
          // se necesita esta forma para ser pasado al servidor los archivos cargados
          const formData = new FormData();
          // transformamos el objeto a los parametros que se necesitan pasar al servidor
          let DatosAdicionales = {};
          camposHeader.map((element) => {
            DatosAdicionales[element.campo] = values[element.campo]
          });

          formData.append('ArchivoId', row.original['ArchivoId']);
          formData.append('NombreArchivo', values['Nombre']);
          formData.append('Descripcion', values['Descripcion']);
          formData.append('DatosAdicionales', JSON.stringify(DatosAdicionales));
          formData.append('UsuarioId', model.Id);
          formData.append('AreaId', configArea[0].AreaId.toString());
          formData.append('Peso', "0");
          formData.append('MovimientoId', "2");


          // datosn modificados 
          let changesData = "";
          Object.entries(values).map((elem) => {

            if (elem[1] != row.original[elem[0]])
              changesData += `(Campo =${elem[0]},  Valor de ${row.original[elem[0]]} a ${elem[1]} ), `
          });

          formData.append('DescripcionLog', changesData);

          axios({
            method: 'post',
            url: NEP_InsertaArchivo,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            params: { contenedor: "-1" }
          }).then(
            t => {
              data[row.index] = values;
              setData([...data]);
              exitEditingMode(); //required to exit editing mode and close modal

              successDialog("Datos guardados exitosamente!", "");
            }
          ).catch((e) => {
            errorDialog(e, "<i>Favor comunicarse con su administrador.</i>");

          });


        };

        submit();

      }
    };
  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };


  // ELIMINA LOGICAMENTE LA INFORMACION INGRESADA
  const handleDeleteRow = useCallback(
    (row: MRT_Row<any>) => {

      confirmarDialog(() => {
        UpdateEstadoArchivo(row.original['ArchivoId'].toString()).then(() => {
          data.splice(row.index, 1);
          setData([...data]);

          successDialog("Archivo Eliminado Exitosamente!", "");
        }).catch((e) => {
          errorDialog(e, "<i>Favor comunicarse con su administrador.</i>");

        });
      }, `Esta seguro que desea eliminar el archivo : ${row.getValue('Nombre')}`);

    },
    [data],
  );

//El container;
function SelectContainer() {
  if(Array.isArray(contenedorString))
  {
    return (           
      <Form.Select   className="input input-sm mb-3 " onChange={(e) => {
          // buscamos el objeto completo para tenerlo en el sistema
          let containerfilter =  contenedorString?.filter((value) => {
              return value === e.currentTarget.value
          })  
          if(containerfilter != undefined || containerfilter)
            setcontenedor(containerfilter[0]);
      }} aria-label="Default select example">
          <option value="" disabled>Seleccione</option>
          {                        
              contenedorString?.map((element) => {
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
            setcontenedor(contenedorString);
        }} aria-label="Default select example">
            {        
              (<option key={contenedorString}  value={contenedorString}>{contenedorString}</option>)
            }
        </Form.Select>               
  );}
}
  return (

    <>
    <NeptunoProvider>
      <PageTitle >{tituloPagina}</PageTitle>
      <div className="row g-0 g-xl-5 g-xxl-8 bg-syscaf-gris ">
        <div className="row" style={{width:'100%'}}>
          <div className="col-sm-4 col-md-4 col-xs-4">
            <div style={{paddingTop:'5px'}}>
              {(EsPermitido(permisosopcion, operacionesPermisos.Adicionar)) && (<Button
                className="btn btn-primary btn-xs  mb-2 mt-1"
                onClick={() => handleshowFileLoad(true)}
                variant="contained"
              >
                Nuevo
              </Button>  
              )}
            </div>
          </div>
          <div className="col-sm-4 col-md-4 col-xs-4" >
            <div style={{float: 'right', paddingTop:'15px'}}>
              <label className="control-label label-sm"><span style={{color:'white', fontWeight:'bold'}}>Contenedor: </span></label>
            </div>
               
          </div>
          <div className="col-sm-4 col-md-4 col-xs-4" style={{paddingTop:'10px'}} >
            {(EsPermitido(permisosopcion, operacionesPermisos.Adicionar)) && (
            <SelectContainer/>)}
          </div>
        </div>
       

      </div>
      <div className="row g-0 g-xl-5 g-xxl-8 bg-syscaf-gris">
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
          columns={columnas}
          data={data}
          editingMode="modal" //default         
          enableTopToolbar
          enableColumnOrdering
          enableEditing
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          enableFilters
          enableColumnFilters={false}
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
          renderRowActions={({ row, table }) => (

            <Box sx={{ display: 'flex', gap: '1rem' }}>

              {(EsPermitido(permisosopcion, operacionesPermisos.Modificar)) && (<Tooltip arrow placement="left" title="Editar">
                <IconButton onClick={() => 

                  table.setEditingRow(row)
                  } >
                  <Edit />
                </IconButton>
              </Tooltip>)}

              {(EsPermitido(permisosopcion, operacionesPermisos.Eliminar)) && ( <Tooltip arrow placement="right" title="Eliminar">
            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
              <Delete />
            </IconButton>
          </Tooltip>)}

            </Box>
          )
          }

          renderDetailPanel={({ row }) => (
            <Box
              sx={{
                display: 'grid',
                margin: 'auto',
                gridTemplateColumns: '1fr 1fr',
                width: '100%',
              }}
            >
              <Typography>Usuario Creación: {row.original.UsuarioCreacion}</Typography>
              <Typography>Fecha Creación: {Moment(row.original.FechaSistema).format('DD/MM/YYYY HH:mm:ss')}</Typography>
              <Typography>Usuario Actualización: {row.original.UsuarioActualizacion}</Typography>
              <Typography>Fecha Actualización: {Moment(row.original.UltFechaActualizacion).format('DD/MM/YYYY HH:mm:ss')}</Typography>
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
        />
      </div>

      {(configArea.length > 0) && (
        <CreateFileModal show={showFileLoad}
          handleClose={() => {handleshowFileLoad(false); }} camposAdicionales={camposHeader} AreaId={configArea[0].AreaId}  AfterSafe ={() => { consultaDatos()}}  container={contenedor}/>
      )}

  </NeptunoProvider>
    </>
  );
};

export { NeptunoTable }

