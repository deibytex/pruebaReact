
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useState, useEffect } from "react";

import { PageTitle } from "../../../../_start/layout/core";
import { UserDTO } from "../models/UserModel";
import { getListUserByToken } from "../redux/AuthCRUD";
import type {
    ColumnFiltersState,
    PaginationState,
    SortingState,
  } from '@tanstack/react-table';
import { AxiosResponse } from "axios";
import { EsPermitido, Operaciones, PermisosOpcion, Post_getconsultadinamicas } from "../../../../_start/helpers/Axios/CoreService";
import { Button } from "react-bootstrap-v5";


export default function IndiceUsuarios() {

    const [data, setData] = useState<UserDTO[]>([]);
  
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
  

    const columnasTabla: MRT_ColumnDef<UserDTO>[]
    = [
      {
        accessorKey: 'nombres',
        header: 'Nombres',
        size: 250
      },
      {
        accessorKey: 'email',
        header: 'Correo',
        size: 250
      }
      ,
      {
        accessorKey: 'perfilTexto',
        header: 'Perfil',
        size: 80
      }
      ,
      {
        accessorKey: 'ClienteNombre',
        header: 'Cliente',
        size: 80
      }
    ];


    useEffect(() => {

       

        getListUserByToken({
            Pagina:pagination.pageIndex,
            RecordsPorPagina: pagination.pageSize
        } ).then((response: AxiosResponse<UserDTO[]>) => {
                    // asignamos los datos a el user state para que se visualicen los datos
                    setData(response.data);
                    // llamamos la informacion de los perfiles
                    var params: { [id: string]: string | null; } = {};
                    params["Sigla"] = "SYS_PER";
                    params["SiglaD"] = null;
                    Post_getconsultadinamicas({    Clase : "PortalQueryHelper",  NombreConsulta: "GetDetallesListaBySisglas", Pagina : 1 , RecordsPorPagina : 100},
                     params)
        });

    },
    // cada vez que cambien algunos de estos estados, se vuelve a generar el user state
    [
        columnFilters,
        globalFilter,
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
      ])

      const permisosopcion = PermisosOpcion("Archivos");
      return (

        <>
    
          <PageTitle >ADMINISTRACIÓN - USUARIOS</PageTitle>
          <div className="row g-0 g-xl-5 g-xxl-8 bg-primary ">
            {(EsPermitido(permisosopcion, Operaciones.Adicionar)) && (<Button
              className="btn btn-primary btn-xs col-xs-4 col-xl-1 col-md-2 mb-2 mt-1"
             // onClick={() => handleshowFileLoad(true)}
              variant="contained"
            >
              Nuevo
            </Button>)}
    
          </div>
          <div className="row g-0 g-xl-5 g-xxl-8 bg-primary">
            <MaterialReactTable
              displayColumnDefOptions={{
                'mrt-row-actions': {
                  muiTableHeadCellProps: {
                    align: 'center',
                  },
                  size: 120,
                },
              }}
              columns={columnasTabla}
              data={data}
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
              localization={MRT_Localization_ES}
              onColumnFiltersChange={setColumnFilters}
              onGlobalFilterChange={setGlobalFilter}
              onPaginationChange={setPagination}
              onSortingChange={setSorting}
              rowCount={rowCount}
           /*   renderRowActions={({ row, table }) => (
    
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
    
            /*  renderDetailPanel={({ row }) => (
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
              )}*/
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
    
       
    
        </>
      );
    };
    


