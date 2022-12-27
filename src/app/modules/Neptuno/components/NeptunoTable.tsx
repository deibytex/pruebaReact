import { Delete, Download, Edit } from "@mui/icons-material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap-v5";
import { GetInformacionCuenta, GetArchivosPorCuenta, DescargarArchivo, UpdateEstadoArchivo } from "../data/dataNeptuno";
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

type Params = {
  contenedor: string;
}

const NeptunoTable: React.FC<Params> = ({ contenedor }) => {
  // contiene la informacion de la cuenta, con los campos a utilziar  
  const [configArea, SetConfigArea] = useState<AreaDTO[]>([]);
  const [camposHeader, SetcamposHeader] = useState<configCampoDTO[]>([]);

  // informacion del usuario almacenado en el sistema
  const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
  );
  const permisosopcion = PermisosOpcion("Archivos");
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

    GetArchivosPorCuenta(contenedor, pagination.pageIndex, pagination.pageSize).then((respuesta: AxiosResponse<ArchivoDTO[]>) => {
      const totalDeRegistros =
        parseInt(respuesta.headers['totalregistros'] ?? 10, 10);
      console.log("totalDeRegistros", respuesta.headers['totalregistros'])
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
      console.log(datosRecibidos)



    }).catch((e) => {
      errorDialog(e, "<i>Favor comunicarse con su administrador.</i>");
      setIsError(true);

      return;
    });

  }
  useEffect(() => {
    (async () => {

      // traemos la informacion de la cuenta, que campos se van a mostrar
      GetInformacionCuenta(contenedor).then(({ data }) => {

        SetConfigArea(data);
        if (data[0].CamposCapturar != null) {
          // deserializamos el objeto para poder saber los campos que estan en la cabecera    
          let campos = JSON.parse(data[0].CamposCapturar) as configCampoDTO[];
          SetcamposHeader(campos);

          const columnasTabla: MRT_ColumnDef<any>[]
            = [
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

                        DescargarArchivo(row.original.Src, contenedor);
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
                  size: 100,
                  muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                  })
                };



                return insideField;
              }
              )

            ];

          setColumnas(columnasTabla)
          consultaDatos();

        }

        // inicializamos las otras variables

        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);

      }).catch((error) => {
        console.log(error);

      });

    })()


  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
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
             cell.column.id === 'email'
               ? validateEmail(event.target.value)
               : cell.column.id === 'age'
               ? validateAge(+event.target.value)
               : validateRequired(event.target.value);
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


  return (

    <>

      <PageTitle >NEPTUNO  - Gestor Documental</PageTitle>
      <div className="row g-0 g-xl-5 g-xxl-8 bg-syscaf-gris ">
        {(EsPermitido(permisosopcion, Operaciones.Adicionar)) && (<Button
          className="btn btn-primary btn-xs col-xs-4 col-xl-1 col-md-2 mb-2 mt-1"
          onClick={() => handleshowFileLoad(true)}
          variant="contained"
        >
          Nuevo
        </Button>)}

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
          enableTopToolbar={false}
          enableColumnOrdering
          enableEditing
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
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

              {(EsPermitido(permisosopcion, Operaciones.Modificar)) && (<Tooltip arrow placement="left" title="Editar">
                <IconButton onClick={() => table.setEditingRow(row)} >
                  <Edit />
                </IconButton>
              </Tooltip>)}

              {(EsPermitido(permisosopcion, Operaciones.Eliminar)) && ( <Tooltip arrow placement="right" title="Eliminar">
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
          handleClose={() => {handleshowFileLoad(false); }} camposAdicionales={camposHeader} AreaId={configArea[0].AreaId}  AfterSafe ={() => { consultaDatos()}} />
      )}


    </>
  );
};

export { NeptunoTable }

