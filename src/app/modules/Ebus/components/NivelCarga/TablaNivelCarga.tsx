import MaterialReactTable, { MRT_Cell, MRT_ColumnDef, MRT_Row } from "material-react-table";
import moment from "moment";
import { useEffect, useState } from "react";
import { LogDTO } from "../../../Neptuno/models/logModel";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { TablaDTO } from "../../models/NivelcargaModels";
import { Mapa } from "./mapa";
import { NivelCargaProvider, useDataNivelCarga } from "../../core/NivelCargaProvider";
import { MapaDTO } from "../../models/NivelcargaModels";
type Props = {
  data:TablaDTO[]
};

const TablaNivelCarga : React.FC<Props> =  ({data}) =>{
  const {DatosMapa, dataTable,  ClienteSeleccionado, setClientes, setClienteSeleccionado, setDatosMapa, setdataTable, setPeriodo} = useDataNivelCarga()
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
      let Driver = [];
     if(data[0].driver != null)
        Driver = data.reduce((acc:any,item)=>{
          if(!acc.includes(item.driver)){
            acc.push(item.driver);
          }
          return acc;
        },[])

      useEffect(()=>{
        setRowCount(data.length);
      })
      let listadoCampos: MRT_ColumnDef<TablaDTO>[] =

    [
       {
         accessorKey: 'fechaString',
         header: 'Fecha',
         size: 5,
         Cell({ cell, column, row, table, }) {
          return (moment(row.original.fechaString).format("DD/MM/YYYY"));
        }
       },
       {
         accessorKey: 'placa',
         header: 'Móvil',
         Cell({ cell, column, row, table, }) {
          return (cell.getValue() != null)? <a style={{cursor: 'pointer'}}  data-rel={row.original.placa} href="#" id="MapaIndividual" onClick={cargarMapaIndividual} className="MapaIndividual"> {(row.original.placa == null ? "" : row.original.placa)}</a>:"" ;
        },
        size: 3
       },
       {
        accessorKey: 'driver',
        header: 'Operador',
        filterVariant: 'select',
        filterSelectOptions:  Driver,
        size: 20
      },
       {
        accessorKey: 'socInicial',
        header: 'SOC Ini [%]',
        Cell({ cell, column, row, table, }) {
          return (getIconSoc(row.original.socInicial)) ;
        },
        filterVariant: 'range',
        filterFn: 'betweenInclusive',
        size: 3
      },
      {
        accessorKey: 'soc',
        header: 'SOC [%]',
        Cell({ cell, column, row, table, }) {
          return (getIconSoc(row.original.soc)) ;
        },
        filterVariant: 'range',
        filterFn: 'betweenInclusive',
        size: 3
      },
      {
        accessorKey: 'kms',
        header: 'Distancia',
        Header:<text>Distancia<br/>[km]</text>,
        Cell({ cell, column, row, table, }) {
          return (row.original.kms?.toFixed(1)) ;
        },
        size: 10
      },
      {
        accessorKey: 'eficiencia',
        header: `Eficiencia`,
        Header: <text>Eficiencia<br/>[km/kWh]</text>,
        Cell({ cell, column, row, table, }) {
          return (row.original.eficiencia?.toFixed(1)) ;
        },
        size: 100
      },
      {
        accessorKey: 'porRegeneracion',
        header: 'Regeneración',
        Header: <text>Regeneración<br/>[%]</text>,
        Cell({ cell, column, row, table, }) {
          return (row.original.porRegeneracion?.toFixed(1)) ;
        },
        size: 6
      },
      {
        accessorKey: 'autonomia',
        header: 'Autonomia',
        Header:<text>Autonomia<br/> [Km]</text>,
        Cell({ cell, column, row, table, }) {
          return (row.original.autonomia?.toFixed(1)) ;
        },
        size: 10
      },
      {
        accessorKey: 'energia',
        header: 'Energia',
        Header:<text>Energía<br/> [kWh]</text>,
        Cell({ cell, column, row, table, }) {
          return (row.original.energia?.toFixed(1)) ;
        },
        size: 20
      },
      {
        accessorKey: 'energiaDescargada',
        header: 'Energia descargada',
        Header:<text>E.Descargada<br/> [kWh]</text>,
        Cell({ cell, column, row, table, }) {
          return (row.original.energiaDescargada?.toFixed(1)) ;
        },
        size: 10
      },
      {
        accessorKey: 'energiaRegenerada',
        header: 'E.Regenerada',
        Header: <text>E.Regenerada<br/> [kWh]</text>,
        Cell({ cell, column, row, table, }) {
          return (row.original.energiaRegenerada?.toFixed(1)) ;
        },
        size: 10
      },
      {
        accessorKey: 'odometro',
        header: 'Odómetro',
        Header: <text>Odómetro<br/> [km]</text>,
        Cell({ cell, column, row, table, }) {
          return (row.original.odometro?.toFixed(1)) ;
        },
        size: 10
      },
      {
        accessorKey: 'velocidadPromedio',
        header: 'Velocidad',
        Header: <text>Velocidad<br/> Prom</text>,
        Cell({ cell, column, row, table, }) {
          return (row.original.velocidadPromedio?.toFixed(1)) ;
        },
        size: 10
      }
     ];
const cargarMapaIndividual = (row: any) =>{
  let MapaIdnividual = data.filter((item) =>{
    return (item.placa == row.target.dataset.rel);
  })
  setDatosMapa(MapaIdnividual);
  console.log(row);
};

const getIconSoc = (data:any) => {
      return (
        (data <= 100 && data >= 80)? <><i className="bi-battery-full" style={{ color:'#00B050'}}></i><span style={{fontSize:"15px"}}> {data == null ? "" : data.toFixed(0)}%</span></>:
         data <= 79 && data >= 60 ? <><i className="bi-battery-full rotate-45-verde" style={{color:'#92D050'}}></i><span style={{fontSize:"15px"}}>{data == null ? "" : data.toFixed(0)}%</span></>:
        (data <= 59 && data >= 40 ? <><span><i className="bi-battery-half rotate-45-yellow" style={{fontSize:"15px", color:'#ff0'}}></i></span><span style={{fontSize:"15px"}}>{data == null ? "" : data.toFixed(0)}%</span></>:
        (data <= 39 && data >= 20 ? <><span><i className="bi-battery-half rotate-45-naranja" style={{color:'#ffa500'}}></i></span><span style={{fontSize:"15px"}}>{data == null ? "" : data.toFixed(0)}%</span></>:
        (data <= 19 && data >= 0 ? <><span><i className="bi-battery-half" ></i></span><span style={{fontSize:"15px"}}>{data == null ? "" : data.toFixed(0)}%</span></>:
        <><span><i className="bi-battery-half"></i></span> <span style={{fontSize:"15px"}}>{data == null ? "" : data.toFixed(0)}%</span></>)))
      );
  }

  let VisibilidadColumnas = { 
    fechaString: true,
    placa:true,
    driver:true,
    socInicial:true,
    soc:true,
    eficiencia:false,
    autonomia:false, 
    energia:false,
    energiaDescargada:false,
    energiaRegenerada:false, 
    odometro:false, 
    kms:false, 
    porRegeneracion: false , 
    velocidadPromedio:false
  }; 
     
    return (
        <div>
           <NivelCargaProvider>
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
                    
                    enableTopToolbar={true}
                    enableColumnOrdering
                    onColumnFiltersChange={setColumnFilters}
                    onGlobalFilterChange={setGlobalFilter}
                    onPaginationChange={setPagination}
                    onSortingChange={setSorting}
                    rowCount={rowCount}
                    enableFilters
                    enableColumnFilters={true}
                    muiToolbarAlertBannerProps={
                      isError
                        ? {
                          color: 'error',
                          children: 'Error al cargar información',
                        }
                        : undefined
                    }
                    state={{
                    columnFilters,
                    globalFilter,
                    isLoading,
                    pagination,
                    showAlertBanner: isError,
                    showProgressBars: isRefetching,
                    sorting,
                    }}
                    initialState={{columnVisibility:VisibilidadColumnas, showColumnFilters: true}}
                /> 
                </NivelCargaProvider>
        </div>
    )
   
}
export {TablaNivelCarga};
