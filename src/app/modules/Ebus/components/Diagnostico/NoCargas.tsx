import { useEffect, useState } from "react";
import { NoCargaDTO } from "../../models/Carga";
import type {
    ColumnFiltersState,
    PaginationState,
    SortingState,
  } from '@tanstack/react-table';
import { GetListadoNoCarga } from "../../data/diagnostico";

import { AxiosResponse } from "axios";

import { PageTitle } from "../../../../../_start/layout/core";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import moment from "moment";
import { Box, Typography } from "@mui/material";
//Import Material React Table Translations
import { MRT_Localization_ES } from 'material-react-table/locales/es';

// construimos el contenedor
export const NoCargas: React.FC= ({  }) => {

    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [data, setData] = useState<NoCargaDTO[]>([]);
      //table state
      const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
      const [globalFilter, setGlobalFilter] = useState('');
      const [sorting, setSorting] = useState<SortingState>([]);
      const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
      });

      const FechaInicial =   moment(new Date()).add(-1, 'days').startOf('day').add(19, 'hours').toDate();
      const FechaFinal =    new Date();
    //GetListadoNoCarga
  

    useEffect(() => {    

        GetListadoNoCarga("914", FechaInicial, FechaFinal).then((response: AxiosResponse<NoCargaDTO[]>) => {
                    // asignamos los datos a el user state para que se visualicen los datos
                    setData(response.data);
                    // llamamos la informacion de los perfiles            
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

      
    const columnasTabla: MRT_ColumnDef<NoCargaDTO>[]
    = [
      {
        accessorKey: 'Vehiculo',
        header: 'Vehículo',
        size: 250
      },
      {
        accessorKey: 'FechaInicioRecarga',
        header: 'Fecha Inicio Carga ',
        size: 250,
        Cell({ cell, column, row, table, }) {
           return moment(row.original.FechaInicioRecarga).format('DD/MM/YYYY HH:mm:ss')
        },
      }
      ,
      {
        accessorKey: 'SocInicial',
        header: 'Soc Inicial',
        size: 80
      },
      {
        accessorKey: 'Clasificacion',
        header: 'Clasificación',
        size: 80
      }
      
    ];

   
      return (

        <>
    
          <PageTitle >EBUS - LISTADO NO CARGA</PageTitle>
          <div className="row g-0 g-xl-5 g-xxl-8 bg-syscaf-azul  text-white mb-1">
            <h3> Fechas Consultas</h3>
          <Box
                  sx={{
                    display: 'grid',
                    margin: 'auto',
                    gridTemplateColumns: '1fr 1fr',
                    width: '100%',
                  }} 
                >                 
                  <Typography >Fecha Inicio: {moment(FechaInicial).format('DD/MM/YYYY HH:mm')}</Typography>                 
                  <Typography>Fecha Fin: {moment(FechaFinal).format('DD/MM/YYYY HH:mm')}</Typography>
                </Box>
            </div>
          <div className="row g-0 g-xl-5 g-xxl-8 bg-syscaf-azul">
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
              onColumnFiltersChange={setColumnFilters}
              onGlobalFilterChange={setGlobalFilter}
              onPaginationChange={setPagination}
              onSortingChange={setSorting}
              rowCount={rowCount}
              localization={MRT_Localization_ES}
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