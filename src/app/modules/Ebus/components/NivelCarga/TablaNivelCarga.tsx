import MaterialReactTable, { MRT_Cell, MRT_ColumnDef, MRT_Row } from "material-react-table";
import moment from "moment";
import { useEffect, useState } from "react";
import { LogDTO } from "../../../Neptuno/models/logModel";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { ColumnFiltersState, PaginationState, SortingState, VisibilityState } from "@tanstack/react-table";
import { TablaDTO } from "../../models/NivelcargaModels";
import { Mapa } from "./mapa";
import { NivelCargaProvider, useDataNivelCarga } from "../../core/NivelCargaProvider";
import { MapaDTO } from "../../models/NivelcargaModels";
import { Principal } from "./principal";
type Props = {
  data:TablaDTO[],
  cargarMapaIndividual:(row:any) =>{}
};

const TablaNivelCarga : React.FC<Props> =  ({cargarMapaIndividual,data}) =>{
  
  const [MapaIndividualL, setMapaIndividualL] = useState<TablaDTO[]>([])     
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
         enableHiding: false,
         size: 10,
         minSize: 10, //min size enforced during resizing
         maxSize: 10,
         Cell({ cell, column, row, table, }) {
          return (moment(row.original.fechaString).format("DD/MM/YYYY"));
        }
       },
       {
         accessorKey: 'placa',
         header: 'Móvil',
         enableHiding: false,
         enableClickToCopy:true,
         Cell({ cell, column, row, table, }) {
          return (cell.getValue() != null)? <a style={{cursor: 'pointer'}}  data-rel={row.original.placa} href="#" id="MapaIndividual" onClick={cargarMapaIndividual} className="MapaIndividual"> {(row.original.placa == null ? "" : row.original.placa)}</a>:"" ;
        },
       
        minSize: 10, //min size enforced during resizing
         maxSize: 10,
        size: 10
       },
       {
        accessorKey: 'driver',
        header: 'Operador',
        filterVariant: 'select',
        filterSelectOptions:  Driver,
        enableHiding: false,
        minSize: 10, //min size enforced during resizing
         maxSize: 10,
        size: 10
      },
       {
        accessorKey: 'socInicial',
        header: 'SOC Ini [%]',
        Cell({ cell, column, row, table, }) {
          return (getIconSoc(row.original.socInicial)) ;
        },
        filterVariant: 'range',
        filterFn: 'betweenInclusive',
        enableHiding: false,
        minSize: 5, //min size enforced during resizing
         maxSize: 5,
        size: 5
      },
      {
        accessorKey: 'soc',
        header: 'SOC [%]',
        Cell({ cell, column, row, table, }) {
          return (getIconSoc(row.original.soc)) ;
        },
        filterVariant: 'range',
        filterFn: 'betweenInclusive',
        enableHiding: false,
        minSize: 5, //min size enforced during resizing
         maxSize: 5,
        size: 5
      },
      {
        accessorKey: 'kms',
        header: 'Distancia',
        Header:<span>Distancia<br/>[km]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.kms?.toFixed(1)) ;
        },
        size: 10
      },
      {
        accessorKey: 'eficiencia',
        header: `Eficiencia`,
        Header: <span>Eficiencia<br/>[km/kWh]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.eficiencia?.toFixed(1)) ;
        },
        size: 100
      },
      {
        accessorKey: 'porRegeneracion',
        header: 'Regeneración',
        Header: <span>Regeneración<br/>[%]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.porRegeneracion?.toFixed(1)) ;
        },
        size: 6
      },
      {
        accessorKey: 'autonomia',
        header: 'Autonomia',
        Header:<span>Autonomia<br/> [Km]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.autonomia?.toFixed(1)) ;
        },
        size: 10
      },
      {
        accessorKey: 'energia',
        header: 'Energia',
        Header:<span>Energía<br/> [kWh]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.energia?.toFixed(1)) ;
        },
        size: 20
      },
      {
        accessorKey: 'energiaDescargada',
        header: 'Energia descargada',
        Header:<span>E.Descargada<br/> [kWh]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.energiaDescargada?.toFixed(1)) ;
        },
        size: 10
      },
      {
        accessorKey: 'energiaRegenerada',
        header: 'E.Regenerada',
        Header: <span>E.Regenerada<br/> [kWh]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.energiaRegenerada?.toFixed(1)) ;
        },
        size: 10
      },
      {
        accessorKey: 'odometro',
        header: 'Odómetro',
        Header: <span>Odómetro<br/> [km]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.odometro?.toFixed(1)) ;
        },
        size: 10
      },
      {
        accessorKey: 'velocidadPromedio',
        header: 'Velocidad',
        Header: <span>Velocidad<br/> Prom</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.velocidadPromedio?.toFixed(1)) ;
        },
        size: 10
      }
     ];
     const {setEstotal, setDatosMapaIndividual} = useDataNivelCarga()
     useEffect(() => {
      return 
    }, []);


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
                        size: 3,
                    },
                  }
                  }
                    columns={listadoCampos}
                    data={data}
                    enableTopToolbar={true}
                    enableDensityToggle
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