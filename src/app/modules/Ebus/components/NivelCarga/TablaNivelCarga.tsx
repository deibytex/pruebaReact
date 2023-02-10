import MaterialReactTable, { MRT_Cell, MRT_ColumnDef } from "material-react-table";
import moment from "moment";
import { useState } from "react";
import { LogDTO } from "../../../Neptuno/models/logModel";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { TablaDTO } from "../../models/NivelcargaModels";
type Props = {
  data:TablaDTO[]
};

const TablaNivelCarga : React.FC<Props> =  ({data}) =>{
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

      let listadoCampos: MRT_ColumnDef<TablaDTO>[] =

    [
       {
         accessorKey: 'FechaString',
         header: 'Fecha',
      
         size: 20
       },
       {
         accessorKey: 'Placa',
         header: 'Móvil',
         size: 20
       },
       {
        accessorKey: 'Driver',
        header: 'Operador',
        size: 20
      },
       {
        accessorKey: 'SocInicial',
        header: 'SOC Ini [%]',
        size: 10
      },
      {
        accessorKey: 'Soc',
        header: 'SOC [%]',
        size: 10
      },
      {
        accessorKey: 'Kms',
        header: 'Distancia',
        Header:<text>Distancia<br/>[km]</text>,
        size: 10
      },
      {
        accessorKey: 'Eficiencia',
        header: `Eficiencia`,
        Header: <text>Eficiencia<br/>[km/kWh]</text>,
        size: 100
      },
      {
        accessorKey: 'PorRegeneracion',
        header: 'Regeneración<br/> [%]',
        Header: <text>Regeneración<br/>[%]</text>,
        size: 6
      },
      {
        accessorKey: 'Autonomia',
        header: 'Autonomia',
        Header:<text>Autonomia<br/> [Km]</text>,
        size: 10
      },
      {
        accessorKey: 'Energia',
        header: 'Energia',
        Header:<text>Energía<br/> [kWh]</text>,
        size: 20
      },
      {
        accessorKey: 'EnergiaDescargada',
        header: 'Energia descargada',
        Header:<text>E.Descargada<br/> [kWh]</text>,
        size: 10
      },
      {
        accessorKey: 'EnergiaRegenerada',
        header: 'E.Regenerada<br/> [kWh]',
        Header: <text>E.Regenerada<br/> [kWh]</text>,
        size: 10
      },
      {
        accessorKey: 'Odometro',
        header: 'Odómetro',
        Header: <text>Odómetro<br/> [km]</text>,
        size: 10
      },
      {
        accessorKey: 'VelocidadPromedio',
        header: 'Velocidad',
        Header: <text>Velocidad<br/> Prom</text>,
        size: 10
      },

      //  {
      //    accessorKey: 'FechaSistema',
      //    header: 'Fecha Creación',
      //    size: 80,
      //    Cell({  row }) {
      //       return (moment(row.original.FechaSistema).format('DD/MM/YYYY HH:mm:ss'))
      //     }
      //  }, {
      //    accessorKey: 'EstadoArchivo',
      //    header: 'Estado archivo',    
      //    size: 80,
      //    Cell({ cell, column, row, table, }) {
      //       return (cell.getValue() == true )? <span className="badge bg-primary">Activo</span>:<span className="badge bg-danger">Inactivo</span>
      //     }
      //  }

     ];

     
    return (
        <div>
           <MaterialReactTable
                    localization={MRT_Localization_ES}
                    displayColumnDefOptions={{
                      
                    'mrt-row-actions': {
                        muiTableHeadCellProps: {
                        align: 'center',
                        },
                        size: 10,
                    },
                   
                  }
                  }
                    columns={listadoCampos}
                    data={data}
                    initialState={{ columnVisibility: { PorRegeneracion: false } }}
                // editingMode="modal" //default         
                    enableTopToolbar={true}
                    enableColumnOrdering
                    onColumnFiltersChange={setColumnFilters}
                    onGlobalFilterChange={setGlobalFilter}
                    onPaginationChange={setPagination}
                    onSortingChange={setSorting}
                    rowCount={rowCount}
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
                    // enableEditing
                /* onEditingRowSave={handleSaveRowEdits}
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
                    // }*/
        
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
    )
}
export {TablaNivelCarga};
